import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { nanoid } from 'nanoid'
import fetch from 'node-fetch'
import { z } from 'zod'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const ML_URL = process.env.ML_URL // optional

// --- DB ---
const db = new Low(new JSONFile(path.join(__dirname, 'db.json')), { events: [], registrations: [] })
await db.read()

// --- app ---
const app = express()
app.use(cors({ origin: CLIENT_ORIGIN }))
app.use(express.json())

// --- health ---
app.get('/api/health', (req, res) => res.json({ ok: true }))

// --- events ---
app.get('/api/events', async (req, res) => {
  await db.read()
  res.json(db.data.events)
})

app.get('/api/events/:id', async (req, res) => {
  await db.read()
  const ev = db.data.events.find(e => e.id === req.params.id)
  if (!ev) return res.status(404).json({ error: 'Not found' })
  res.json(ev)
})

// --- register ---
const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  eventId: z.string(),
  interests: z.array(z.string()).optional().default([])
})
app.post('/api/register', async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: 'Invalid payload', issues: parsed.error.issues })

  const { name, email, eventId, interests } = parsed.data
  await db.read()
  const ev = db.data.events.find(e => e.id === eventId)
  if (!ev) return res.status(404).json({ error: 'Event not found' })

  const registrationId = nanoid(12)
  const reg = { id: registrationId, name, email, eventId, interests, createdAt: new Date().toISOString() }
  db.data.registrations.push(reg)
  await db.write()

  res.json({ registrationId, event: ev })
})

// --- admin registrations ---
app.get('/api/admin/registrations', async (req, res) => {
  await db.read()
  // Optional filter by eventId
  const { eventId } = req.query
  const list = eventId ? db.data.registrations.filter(r => r.eventId === eventId) : db.data.registrations
  res.json(list)
})

// --- stats (simple) ---
app.get('/api/stats', async (req, res) => {
  await db.read()
  const totalEvents = db.data.events.length
  const totalRegs = db.data.registrations.length
  const byEvent = Object.fromEntries(
    db.data.events.map(ev => [ev.id, db.data.registrations.filter(r => r.eventId === ev.id).length])
  )
  res.json({ totalEvents, totalRegs, byEvent })
})

// --- recommendations ---
app.post('/api/recommendations', async (req, res) => {
  await db.read()
  const { interests = [], query = '', limit = 9, category = 'All' } = req.body || {}
  const payload = {
    interests, query, limit,
    events: db.data.events.filter(e => category === 'All' ? true : (e.category || '').toLowerCase() === category.toLowerCase())
  }

  // Try Python ML service first
  if (ML_URL) {
    try {
      const r = await fetch(ML_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      if (r.ok) {
        const data = await r.json()
        // Expect array of event ids or full objects
        if (Array.isArray(data) && typeof data[0] === 'string') {
          const map = new Map(db.data.events.map(e => [e.id, e]))
          return res.json(data.map(id => map.get(id)).filter(Boolean).slice(0, limit))
        }
        if (Array.isArray(data)) return res.json(data.slice(0, limit))
      }
    } catch (e) {
      // fall through to JS scorer
      console.warn('ML_URL failed, using local scorer:', e.message)
    }
  }

  // Fallback: local lightweight scorer
  const ql = String(query || '').toLowerCase()
  const tagsUser = interests.map(t => t.toLowerCase())
  const scored = payload.events.map(e => {
    const title = (e.title||'').toLowerCase()
    const desc  = (e.description||'').toLowerCase()
    const venue = (e.venue||'').toLowerCase()
    const tags  = (e.tags||[]).map(t => (t||'').toLowerCase())

    let tagScore = 0; for (const t of tagsUser) if (tags.includes(t)) tagScore += 3
    let textScore = 0
    if (ql) {
      if (title.includes(ql)) textScore += 3
      if (desc.includes(ql))  textScore += 2
      if (venue.includes(ql)) textScore += 1
    }
    const days = Math.ceil((new Date(e.date) - Date.now()) / 86400000)
    const recency = isNaN(days) ? 0 : Math.max(0, 5 - Math.min(days, 10)) * 0.6

    return { e, score: tagScore + textScore + recency }
  }).sort((a,b)=> b.score - a.score).slice(0, limit).map(x=>x.e)

  res.json(scored)
})

// --- 404 fallback ---
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`)
  console.log(`CORS allowed: ${CLIENT_ORIGIN}`)
})
