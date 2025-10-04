import { useEffect, useState } from "react"
import { listEvents } from "../api"
import EventCard from "../components/EventCard"
import EventsSplit from "./EventsSplit"
import EventDetailsPanel from "./EventDetailsPanel"

export default function EventList(){
  const [events, setEvents] = useState(null)
  const [q, setQ] = useState("")

  useEffect(()=>{ listEvents().then(setEvents) },[])

  const filtered = (events||[]).filter(e =>
    [e.title, e.description, e.category, e.venue, (e.tags||[]).join(' ')].join(' ').toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold text-[--primary]">All Events</h1>
        <input
          value={q} onChange={e=>setQ(e.target.value)} placeholder="Search events…"
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:oklch(70%_0.1_180/0.5)] outline-none text-sm"
        />
      </div>

      {events===null ? (
        <p className="text-center text-gray-500 animate-pulse">Loading…</p>
      ) : filtered.length===0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(ev => <EventCard key={ev._id} ev={ev} />)}
        </div>
      )}
      <EventsSplit />
      <EventDetailsPanel />
    </div>
  )
}
