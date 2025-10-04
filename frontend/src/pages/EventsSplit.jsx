import { useEffect, useMemo, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { listEvents } from "../api"
import GlassCard from "../components/GlassCard"

const CATEGORIES = ["All", "Seminar", "Workshop", "Fest", "Networking"]

export default function EventsSplit(){
  const [events, setEvents] = useState(null)        // null = loading
  const [q, setQ] = useState("")
  const [sort, setSort] = useState("dateAsc")
  const [cat, setCat] = useState("All")

  useEffect(()=>{ listEvents().then(setEvents) },[])

  const filtered = useMemo(() => {
    let base = (events || [])
    if (cat !== "All") base = base.filter(e => (e.category||"").toLowerCase() === cat.toLowerCase())
    if (q) {
      const s = q.toLowerCase()
      base = base.filter(e =>
        [e.title,e.description,e.category,e.venue,(e.tags||[]).join(" ")].join(" ").toLowerCase().includes(s)
      )
    }
    base = base.sort((a,b) => {
      if (sort === "dateAsc")  return new Date(a.date) - new Date(b.date)
      if (sort === "dateDesc") return new Date(b.date) - new Date(a.date)
      if (sort === "titleAsc") return a.title.localeCompare(b.title)
      if (sort === "titleDesc")return b.title.localeCompare(a.title)
      return 0
    })
    return base
  }, [events, q, sort, cat])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(320px,520px),1fr]">
      {/* LEFT: Filters + List */}
      <div>
        {/* Filter bar */}
        <GlassCard className="relative overflow-hidden p-4">
          <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB33] to-transparent" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-semibold text-white">Events</h1>
              <select
                value={sort}
                onChange={e=>setSort(e.target.value)}
                className="rounded-lg bg-black/20 border border-white/10 text-sm text-white px-2 py-1 outline-none"
                title="Sort"
              >
                <option value="dateAsc">Date ↑</option>
                <option value="dateDesc">Date ↓</option>
                <option value="titleAsc">Title A–Z</option>
                <option value="titleDesc">Title Z–A</option>
              </select>
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => {
                const active = c === cat
                return (
                  <button
                    key={c}
                    onClick={()=>setCat(c)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition
                      ${active
                        ? "text-white bg-white/10 border-white/20"
                        : "text-white/80 border-white/10 hover:bg-white/10"
                      }`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>

            {/* Search + count */}
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-xl bg-black/20 border border-white/10 px-3 py-2">
                <span className="text-white/60">🔎</span>
                <input
                  value={q}
                  onChange={e=>setQ(e.target.value)}
                  placeholder="Search topics, venues, or tags…"
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/60"
                />
                {q && (
                  <button onClick={()=>setQ("")} className="text-white/60 hover:text-white">✕</button>
                )}
              </div>
              <span className="text-xs text-white/70 shrink-0">
                {events === null ? "…" : `${filtered.length} result${filtered.length===1?"":"s"}`}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* List */}
        <div className="mt-4 space-y-3">
          {events === null ? (
            Array.from({length:6}).map((_,i)=>(
              <GlassCard key={`sk-${i}`} className="relative overflow-hidden p-4 animate-pulse">
                <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB33] to-transparent" />
                <div className="h-5 w-1/2 bg-white/10 rounded" />
                <div className="mt-2 h-4 w-3/4 bg-white/10 rounded" />
              </GlassCard>
            ))
          ) : filtered.length === 0 ? (
            <GlassCard className="p-6 text-center text-white/70">No events found</GlassCard>
          ) : (
            filtered.map(ev => {
              const id = ev._id || ev.id
              const soon = daysFromNow(ev.date) <= 3
              return (
                <NavLink key={id} to={`/events/${id}`} className="block group">
                  {({ isActive }) => (
                    <GlassCard className={`relative overflow-hidden p-4 ${isActive ? "border-white/20" : ""}`}>
                      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB66] via-[#6F00FF33] to-transparent" />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-white font-semibold leading-snug">{ev.title}</h3>
                          <p className="text-sm text-white/70 mt-1 line-clamp-2">{ev.description}</p>
                          <div className="text-xs text-white/60 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            <span>📅 {new Date(ev.date).toLocaleString()}</span>
                            <span>📍 {ev.venue}</span>
                          </div>
                          {!!(ev.tags && ev.tags.length) && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {ev.tags.slice(0,3).map((t,i)=>(
                                <span key={`${t}-${i}`} className="text-[11px] text-white/70 bg-white/5 border border-white/10 rounded-md px-2 py-0.5">#{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {ev.category && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-[#E9B3FB] border border-white/15 bg-white/10">
                              {ev.category}
                            </span>
                          )}
                          {soon && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-white bg-[#6F00FF]/40 border border-white/10">
                              Soon
                            </span>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  )}
                </NavLink>
              )
            })
          )}
        </div>
      </div>

      {/* RIGHT: sticky sidebar outlet */}
      <aside className="lg:sticky lg:top-6 min-h-[60vh]">
        <Outlet />
      </aside>
    </div>
  )
}

function daysFromNow(dateStr){
  const d = new Date(dateStr)
  const now = new Date()
  return Math.ceil((d - now) / (1000*60*60*24))
}
