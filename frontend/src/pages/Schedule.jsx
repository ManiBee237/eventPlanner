// src/pages/Schedule.jsx
import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { listEvents } from "../api"
import Navbar from "../components/Navbar"

// ---- localStorage helpers (compatible with different keys) ----
const LS_KEY = "myRegs"              // preferred
const LEGACY_KEYS = ["registrations"] // optional compatibility

function loadRegs() {
  try {
    const v = localStorage.getItem(LS_KEY)
    if (v) return JSON.parse(v)
    for (const k of LEGACY_KEYS) {
      const legacy = localStorage.getItem(k)
      if (legacy) return JSON.parse(legacy)
    }
  } catch {}
  return [] // [{ id, at }]
}

function saveRegs(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr))
}

function addReg(id) {
  if (!id) return
  const regs = loadRegs()
  if (!regs.some(r => r.id === id)) {
    regs.push({ id, at: Date.now() })
    saveRegs(regs)
  }
}

function removeReg(id) {
  const regs = loadRegs().filter(r => r.id !== id)
  saveRegs(regs)
}

function clearRegs() {
  saveRegs([])
}

// ---- ICS file generator ----
function toICS(ev) {
  // Minimal VCALENDAR. Times left floating; feel free to adapt to UTC if needed.
  const uid = (ev._id || ev.id || Math.random().toString(36).slice(2)) + "@events-planner"
  const dt = new Date(ev.date)
  const pad = n => String(n).padStart(2, "0")
  const y = dt.getFullYear()
  const mo = pad(dt.getMonth() + 1)
  const d = pad(dt.getDate())
  const hh = pad(dt.getHours())
  const mm = pad(dt.getMinutes())
  const start = `${y}${mo}${d}T${hh}${mm}00`
  const end = `${y}${mo}${d}T${pad(dt.getHours()+1)}${mm}00` // +1h default

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Events Planner//Schedule//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${(ev.title || "").replace(/\n/g, " ")}`,
    `LOCATION:${(ev.venue || "").replace(/\n/g, " ")}`,
    `DESCRIPTION:${(ev.description || "").replace(/\n/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" })
}

export default function Schedule() {
  const [events, setEvents] = useState(null) // null = loading
  const [regs, setRegs] = useState(loadRegs())
  const [tab, setTab] = useState("upcoming") // upcoming | past | all
  const [q, setQ] = useState("")
  const location = useLocation()

  // Support quick add via ?event=<id>
  useEffect(() => {
    const p = new URLSearchParams(location.search)
    const id = p.get("event")
    if (id) {
      addReg(id)
      setRegs(loadRegs())
    }
  }, [location.search])

  useEffect(() => { listEvents().then(setEvents) }, [])

  const byId = useMemo(() => {
    const map = new Map()
    ;(events || []).forEach(e => map.set(e._id || e.id, e))
    return map
  }, [events])

  const now = Date.now()
  const items = useMemo(() => {
    const enriched = regs
      .map(r => ({ ...r, ev: byId.get(r.id) }))
      .filter(r => !!r.ev)

    const filteredByTab = enriched.filter(({ ev }) => {
      const t = new Date(ev.date).getTime()
      if (tab === "upcoming") return t >= now
      if (tab === "past") return t < now
      return true
    })

    const s = q.trim().toLowerCase()
    const filteredBySearch = s
      ? filteredByTab.filter(({ ev }) =>
          [ev.title, ev.description, ev.venue, (ev.tags || []).join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(s)
        )
      : filteredByTab

    // Sort by date ascending
    return filteredBySearch.sort((a, b) => new Date(a.ev.date) - new Date(b.ev.date))
  }, [regs, byId, tab, q, now])

  function onRemove(id) {
    removeReg(id)
    setRegs(loadRegs())
  }

  function onClear() {
    clearRegs()
    setRegs([])
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px),1fr]">

        <Navbar />
      {/* LEFT: controls */}
      <aside className="lg:sticky lg:top-6 h-fit">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,.35)] p-5">
          <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB66] via-[#6F00FF33] to-transparent" />
          <h1 className="text-xl font-semibold text-white">My Schedule</h1>
          <p className="text-sm text-white/70">Your registered events at a glance.</p>

          {/* Tabs */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { k: "upcoming", label: "Upcoming" },
              { k: "past", label: "Past" },
              { k: "all", label: "All" },
            ].map(t => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition
                  ${tab === t.k ? "text-white bg-white/10 border-white/20" : "text-white/80 border-white/10 hover:bg-white/10"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/20 border border-white/10 px-3 py-2">
            <span className="text-white/60">🔎</span>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search your events…"
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/60"
            />
            {q && (
              <button onClick={() => setQ("")} className="text-white/60 hover:text-white text-sm">
                ✕
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            <Link
              to="/events"
              className="text-xs font-semibold text-[#E9B3FB] hover:text-white transition"
            >
              + Add more events
            </Link>
            {regs.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-white/70 hover:text-white px-2 py-1 rounded-md border border-white/10 hover:bg-white/10"
              >
                Clear all
              </button>
            )}
          </div>
        </section>
      </aside>

      {/* RIGHT: list */}
      <section className="space-y-3">
        {/* Summary */}
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>
            {events === null ? "Loading…" : `${items.length} item${items.length === 1 ? "" : "s"}`}
            {tab !== "all" ? ` · ${tab}` : ""}
          </span>
          <span className="hidden sm:block">
            Tip: Click “Details” to view the event in the right panel on the Events page.
          </span>
        </div>

        {/* States */}
        {events === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`sk-${i}`} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            Nothing here yet. Register for an event or click “Add more events”.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(({ ev }) => (
              <ScheduleCard
                key={ev._id || ev.id}
                ev={ev}
                onRemove={() => onRemove(ev._id || ev.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

/* ---------- Schedule Card (compact) ---------- */
function ScheduleCard({ ev, onRemove }) {
  const id = ev?._id || ev?.id
  const icsBlob = toICS(ev)
  const icsUrl = URL.createObjectURL(icsBlob)

  return (
    <article className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[.035] backdrop-blur-md p-4 hover:-translate-y-0.5 transition shadow-[0_4px_18px_rgba(0,0,0,0.35)] hover:shadow-[0_10px_26px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl bg-gradient-to-r from-[#E9B3FB44] via-[#6F00FF33] to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug text-white">{ev.title}</h3>
        {ev.category && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-[#E9B3FB] border border-white/15 bg-white/10">
            {ev.category}
          </span>
        )}
      </div>

      {ev.description && (
        <p className="mt-1.5 text-[12.5px] text-white/70 line-clamp-2">{ev.description}</p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-white/60">
        <span>📅 {new Date(ev.date).toLocaleString()}</span>
        <span>📍 {ev.venue}</span>
      </div>

      {!!(ev.tags && ev.tags.length) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {ev.tags.slice(0, 3).map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="px-2 py-[2px] rounded-md text-[10px] text-white/70 bg-white/5 border border-white/10"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Link
          to={id ? `/events/${id}` : "/events"}
          className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15"
        >
          Details
        </Link>

        <a
          href={icsUrl}
          download={`${(ev.title || "event").replace(/\s+/g, "_")}.ics`}
          className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-gradient-to-r from-[#6F00FF] to-[#8B5CF6] hover:brightness-110"
        >
          Add to Calendar
        </a>

        <button
          onClick={onRemove}
          className="ml-auto px-2.5 py-1 rounded-md text-xs font-semibold text-white/80 hover:text-white border border-white/10 hover:bg-white/10"
          title="Remove from My Schedule"
        >
          Remove
        </button>
      </div>
    </article>
  )
}

/* ---------- Skeleton ---------- */
function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[.05] backdrop-blur-md p-4 animate-pulse">
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl bg-gradient-to-r from-[#E9B3FB22] to-transparent" />
      <div className="h-4 w-2/3 bg-white/10 rounded" />
      <div className="mt-2 h-3.5 w-4/5 bg-white/10 rounded" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 bg-white/10 rounded" />
        <div className="h-6 w-24 bg-white/10 rounded" />
      </div>
    </div>
  )
}
