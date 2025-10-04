import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getRecommendations, listEvents } from "../api"
// add this import at the top
import HomeEventCard, { HomeEventCardSkeleton } from "../components/HomeEventCard"
import StatMetric from "../components/StatMetric"

import EventCard from "../components/EventCard"
import GlassCard from "../components/GlassCard"

export default function Home(){
  const [events, setEvents] = useState(null)
  const [recs, setRecs] = useState([])
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "")
  const [q, setQ] = useState("")

  useEffect(()=>{ listEvents().then(setEvents) },[])
  useEffect(()=>{
    if(!userId){ setRecs([]); return }
    getRecommendations(userId).then(setRecs).catch(()=>setRecs([]))
  },[userId])

  const filtered = useMemo(()=>{
    const base = (events||[])
    if(!q) return base
    return base.filter(e => [e.title,e.description,e.category,e.venue,(e.tags||[]).join(" ")].join(" ").toLowerCase().includes(q.toLowerCase()))
  },[events,q])

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl ring-1 ring-[--ring]">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_500px_at_10%_-20%,rgba(124,58,237,.25),transparent_60%),radial-gradient(900px_500px_at_110%_120%,rgba(34,211,248,.25),transparent_60%)] pointer-events-none" />
        <div className="relative px-6 py-12 sm:px-10 sm:py-16">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold ring-1 ring-white/20">
              🔥 trending events · AI picks
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-[var(--font-display)] font-extrabold text-white leading-tight">
              Discover, plan, and <span className="bg-gradient-to-r from-[#22D3EE] to-[#7626ff] bg-clip-text text-transparent">attend</span> the best events.
            </h1>
            <p className="mt-3 text-[--muted] max-w-xl">
              Search, filter, and get tailored recommendations—seminars, workshops, fests, and more.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 bg-white/10 ring-1 ring-white/15 rounded-xl px-3 py-2">
                  <span>🔎</span>
                  <input
                    value={q}
                    onChange={e=>setQ(e.target.value)}
                    placeholder="Search topics, venues, or tags…"
                    className="flex-1 outline-none text-sm bg-transparent text-white placeholder-white/60"
                  />
                  {q && <button onClick={()=>setQ("")} className="text-white/70 hover:text-white">✕</button>}
                </div>
              </div>
              <Link to="/events" className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#7C3AED] to-[#22D3EE] hover:brightness-110">
                Browse All →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-4 sm:grid-cols-3">
  <StatMetric title="Total Events" value={events?.length ?? "—"} tone="violet" note="All upcoming & live" />
  <StatMetric title="Matching Now" value={filtered.length} tone="cyan" note="Based on your search" />
  <StatMetric title="For You" value={recs.length} tone="rose" note="AI recommendations" />
</section>

      {/* RECS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Recommended</h2>
          <div className="flex gap-2">
            <input
              value={userId}
              onChange={e=>{ const v=e.target.value; setUserId(v); localStorage.setItem("userId", v) }}
              className="px-3 py-2 rounded-lg bg-white/10 text-sm ring-1 ring-white/10 outline-none text-white placeholder-white/60"
              placeholder="Your user id for AI picks"
            />
            <button onClick={()=>setUserId("")} className="px-3 py-2 rounded-lg bg-white/10 ring-1 ring-white/10 text-sm">Clear</button>
          </div>
        </div>

        {recs.length === 0 ? (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <HomeEventCardSkeleton key={`sk-rec-${i}`} />
    ))}
  </div>
) : (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {recs.map((ev, i) => (
      <HomeEventCard key={ev._id || `rec-${i}`} ev={ev} />
    ))}
  </div>
)}

      </section>

{/* EXPLORE */}
<section className="space-y-4">
  <div className="flex items-end justify-between">
    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
      Explore
    </h2>
    <Link
      to="/events"
      className="text-[#E9B3FB] hover:text-white font-semibold text-sm transition"
    >
      See all →
    </Link>
  </div>

  {events === null ? (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <HomeEventCardSkeleton key={`sk-ex-${i}`} />
      ))}
    </div>
  ) : filtered.length === 0 ? (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
      No events match your search.
    </div>
  ) : (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.slice(0, 6).map((ev, i) => (
        <HomeEventCard key={ev._id || `ex-${i}`} ev={ev} />
      ))}
    </div>
  )}
</section>

    </div>
  )
}
