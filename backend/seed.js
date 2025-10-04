import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const db = new Low(new JSONFile(path.join(__dirname, 'db.json')), { events: [], registrations: [] })
await db.read()

if (db.data.events.length) {
  console.log('Seed skipped — events already present.')
  process.exit(0)
}

const mk = (title, category, daysFromNow, venue, tags=[]) => ({
  id: nanoid(10),
  title,
  description: `${title} — join us for hands-on sessions, Q&A, and networking.`,
  category,
  date: dayjs().add(daysFromNow, 'day').hour(18).minute(30).toISOString(),
  venue,
  tags
})

db.data.events = [
  mk('AI for Product Managers', 'Seminar', 2, 'Auditorium A', ['AI','Product','ML']),
  mk('React Advanced Workshop', 'Workshop', 5, 'Lab 2', ['React','Frontend']),
  mk('Startup Networking Night', 'Networking', 6, 'Cafe Commons', ['Networking','Founders']),
  mk('Design Systems 101', 'Seminar', 10, 'Hall B', ['Design','UX']),
  mk('Cloud & DevOps Bootcamp', 'Workshop', 14, 'Lab 1', ['DevOps','Cloud']),
  mk('Music Fest: Indie Beats', 'Fest', 20, 'Open Arena', ['Music','Fest'])
]

await db.write()
console.log('Seeded events:', db.data.events.length)
