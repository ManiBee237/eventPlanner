import { useEffect, useMemo, useState } from "react"
import { listEvents } from "../api"
import EventCard from "../components/EventCard"

const PAGE_SIZE = 6

export default function EventList(){
  const [events, setEvents] = useState(null)
  const [q, setQ] = useState("")
  const [sort, setSort] = useState("dateAsc") // dateAsc | dateDesc | titleAsc | titleDesc
  const [page, setPage] = useState(1)

  useEffect(()=>{ listEvents().then(setEvents) },[])

  const filtered = useMemo(() => {
    const base = (events || []).filter(e =>
      [e.title, e.description, e.category, e.venue, (e.tags||[]).join(' ')].join(' ').toLowerCase().includes(q.toLowerCase())
    )
    const sorted = base.sort((a,b)=>{
      if(sort === "dateAsc") return new Date(a.date) - new Date(b.date)
      if(sort === "dateDesc") return new Date(b.date) - new Date(a.date)
      if(sort === "titleAsc") return a.title.localeCompare(b.title)
      if(sort === "titleDesc") return b.title.localeCompare(a.title)
      return 0
    })
    return sorted
  }, [events, q, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE)

  useEffect(()=>{ setPage(1) }, [q, sort]) // reset page on filter changes

  return (
    <div className="min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-[var(--font-display)] font-bold text-[--primary]">All Events</h1>
        <div className="flex items-center gap-2">
          <input
            value={q} onChange={e=>setQ(e.target.value)} placeholder="Search events…"
            className="w-56 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:oklch(70%_0.1_180/0.5)] outline-none text-sm"
          />
          <select
            value={sort} onChange={e=>setSort(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="dateAsc">Date ↑</option>
            <option value="dateDesc">Date ↓</option>
            <option value="titleAsc">Title A–Z</option>
            <option value="titleDesc">Title Z–A</option>
          </select>
        </div>
      </div>

      {events===null ? (
        <p className="text-center text-gray-500 animate-pulse">Loading…</p>
      ) : pageItems.length===0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map(ev => <EventCard key={ev._id} ev={ev} />)}
          </div>

          {/* pagination */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={()=>setPage(p=>Math.max(1,p-1))}
              disabled={page===1}
              className="px-3 py-1.5 rounded border border-gray-300 bg-white disabled:opacity-50"
            >Prev</button>
            <span className="text-sm text-gray-600">Page {page} / {totalPages}</span>
            <button
              onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
              disabled={page===totalPages}
              className="px-3 py-1.5 rounded border border-gray-300 bg-white disabled:opacity-50"
            >Next</button>
          </div>
        </>
      )}
    </div>
  )
}
