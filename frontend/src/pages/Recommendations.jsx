// src/pages/Recommendations.jsx
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { listEvents } from "../api"
import Navbar from "../components/Navbar"

export default function Recommendations(){
  // data
  const [events, setEvents] = useState(null) // null = loading

  // profile / filters
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "")
  const [interestInput, setInterestInput] = useState("")
  const [interests, setInterests] = useState(() => {
    try { return JSON.parse(localStorage.getItem("interests") || "[]") } catch { return [] }
  })
  const [q, setQ] = useState("")
  const [sort, setSort] = useState("scoreDesc")
  const [limit, setLimit] = useState(9)
  const [category, setCategory] = useState("All")
  const [viewCols, setViewCols] = useState(3) // 2 or 3

  useEffect(() => { listEvents().then(setEvents) }, [])
  useEffect(() => { localStorage.setItem("userId", userId) }, [userId])
  useEffect(() => { localStorage.setItem("interests", JSON.stringify(interests)) }, [interests])

  // helpers: interests
  function addInterest(){
    const v = interestInput.trim()
    if(!v) return
    if(!interests.map(t=>t.toLowerCase()).includes(v.toLowerCase())) {
      setInterests(prev => [...prev, v])
    }
    setInterestInput("")
  }
  function onInterestKey(e){
    if(e.key === "Enter" || e.key === ","){ e.preventDefault(); addInterest() }
    else if(e.key === "Backspace" && !interestInput && interests.length){ e.preventDefault(); setInterests(prev => prev.slice(0,-1)) }
  }
  function removeInterest(tag){ setInterests(prev => prev.filter(t => t !== tag)) }

  // presets for fast layout
  const presetTags = ["AI", "Design", "React", "Networking", "Product", "Startup"]

  // scoring
  const scored = useMemo(() => {
    if (!Array.isArray(events)) return []
    const ql = q.trim().toLowerCase()
    const userTags = interests.map(t => t.toLowerCase())
    let base = events.map(e => {
      const title=(e.title||"").toLowerCase()
      const desc=(e.description||"").toLowerCase()
      const venue=(e.venue||"").toLowerCase()
      const tags=(e.tags||[]).map(t=>(t||"").toLowerCase())

      let tagScore = 0; for(const t of userTags) if(tags.includes(t)) tagScore += 3
      let textScore=0
      if(ql){ if(title.includes(ql)) textScore += 3; if(desc.includes(ql)) textScore += 2; if(venue.includes(ql)) textScore += 1 }
      const days = daysFromNow(e.date)
      const recency = isNaN(days) ? 0 : Math.max(0, 5 - Math.min(days, 10)) * 0.6

      return { ...e, __score: tagScore + textScore + recency }
    })

    if(category !== "All") base = base.filter(e => (e.category||"").toLowerCase().includes(category.toLowerCase()))

    base = base.sort((a,b)=>{
      if (sort === "scoreDesc") return b.__score - a.__score
      if (sort === "dateAsc")   return new Date(a.date) - new Date(b.date)
      if (sort === "dateDesc")  return new Date(b.date) - new Date(a.date)
      if (sort === "titleAsc")  return (a.title||"").localeCompare(b.title||"")
      if (sort === "titleDesc") return (b.title||"").localeCompare(a.title||"")
      return b.__score - a.__score
    })

    return base.slice(0, limit)
  }, [events, interests, q, sort, limit, category])

  const colsClass = viewCols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3"

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0A0A0F] to-[#141420] text-white">
      <Navbar />

      <main className="grid gap-6 lg:grid-cols-[320px,1fr] px-4 sm:px-6 lg:px-8 mt-6">
        {/* LEFT: filters */}
        <aside className="lg:sticky lg:top-6 h-fit space-y-4">
          {/* Interests */}
          <Panel title="Recommendations" subtitle="Tune your preferences">
            <div className="flex flex-wrap gap-2">
              {presetTags.map(tag => {
                const active = interests.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={()=> active ? removeInterest(tag) : setInterests(prev=>[...prev, tag])}
                    className={`px-2.5 py-1 rounded-md text-xs border transition
                      ${active ? "text-white bg-white/10 border-white/20" : "text-white/80 border-white/10 hover:bg-white/10"}`}
                  >
                    #{tag}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 rounded-lg bg-black/20 border border-white/10 px-2.5 py-2">
              <div className="flex flex-wrap items-center gap-2">
                {interests.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={()=>removeInterest(tag)}
                    className="group inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-xs text-white/80 hover:bg-white/15 hover:border-white/20"
                    title="Remove"
                  >
                    #{tag}
                    <span className="text-white/60 group-hover:text-white">✕</span>
                  </button>
                ))}
                <input
                  value={interestInput}
                  onChange={e=>setInterestInput(e.target.value)}
                  onKeyDown={onInterestKey}
                  placeholder={interests.length ? "Add more…" : "e.g., AI, React, UX"}
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-xs text-white placeholder-white/50"
                />
                <button onClick={addInterest} type="button" className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/15 hover:border-white/20">
                  Add
                </button>
              </div>
            </div>
          </Panel>

          {/* Filters */}
          <Panel title="Filters" subtitle="Narrow down results">
            <div className="flex items-center gap-2 rounded-lg bg-black/20 border border-white/10 px-2.5 py-2">
              <span className="text-white/60 text-sm">🔎</span>
              <input
                value={q}
                onChange={e=>setQ(e.target.value)}
                placeholder="Search title, venue…"
                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/60"
              />
              {q && <button onClick={()=>setQ("")} className="text-white/60 hover:text-white text-xs">✕</button>}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {["All","Seminar","Workshop","Fest","Networking"].map(c=>{
                const active = category === c
                return (
                  <button
                    key={c}
                    onClick={()=>setCategory(c)}
                    className={`px-2.5 py-1.5 rounded-md text-xs border transition text-left
                      ${active ? "text-white bg-white/10 border-white/20" : "text-white/80 border-white/10 hover:bg-white/10"}`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </Panel>

          {/* Display */}
          <Panel title="Display" subtitle="Sort & density">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/60">Sort</label>
              <select
                value={sort}
                onChange={e=>setSort(e.target.value)}
                className="rounded-md bg-black/20 border border-white/10 text-xs text-white px-2 py-1 outline-none"
              >
                <option value="scoreDesc">Best match</option>
                <option value="dateAsc">Date ↑</option>
                <option value="dateDesc">Date ↓</option>
                <option value="titleAsc">Title A–Z</option>
                <option value="titleDesc">Title Z–A</option>
              </select>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <label className="text-xs text-white/60">Show</label>
              <select
                value={limit}
                onChange={e=>setLimit(Number(e.target.value))}
                className="rounded-md bg-black/20 border border-white/10 text-xs text-white px-2 py-1 outline-none"
              >
                {[6,9,12].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="text-xs text-white/60">Columns</label>
              <div className="inline-flex rounded-md border border-white/10 overflow-hidden">
                <button
                  onClick={()=>setViewCols(2)}
                  className={`px-3 py-1 text-xs ${viewCols===2 ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"}`}
                >
                  2
                </button>
                <button
                  onClick={()=>setViewCols(3)}
                  className={`px-3 py-1 text-xs ${viewCols===3 ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10"}`}
                >
                  3
                </button>
              </div>
            </div>
          </Panel>

          {/* Account */}
          <Panel title="Account" subtitle="(optional)">
            <input
              value={userId}
              onChange={e=>setUserId(e.target.value)}
              placeholder="User ID for server-side recs"
              className="w-full rounded-md bg-black/20 border border-white/10 px-2.5 py-2 text-xs text-white outline-none focus:border-white/20"
            />
          </Panel>
        </aside>

        {/* RIGHT: results */}
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-white/70">
            <span>
              {events === null ? "Loading…" : `${scored.length} result${scored.length===1?"":"s"}`}
              {category !== "All" ? ` · ${category}` : ""}
            </span>
            {scored.length === 0 && (
              <button 
                onClick={() => { setQ(""); setInterests([]); setCategory("All") }}
                className="px-2.5 py-1 rounded-md border border-white/15 bg-white/10 hover:bg-white/15 text-xs"
              >
                Clear Filters
              </button>
            )}
          </div>

          {events === null ? (
            <div className={`grid gap-4 sm:grid-cols-2 ${colsClass}`}>
              {Array.from({length:9}).map((_,i)=> <SkeletonCard key={`sk-${i}`} />)}
            </div>
          ) : scored.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70 space-y-2">
              <p>No recommendations yet.</p>
              <p className="text-sm text-white/50">Try adding interests like <code>#AI</code> or <code>#Design</code>.</p>
            </div>
          ) : (
            <div className={`grid gap-4 sm:grid-cols-2 ${colsClass}`}>
              {scored.map((ev,i)=> <RecCard key={ev._id || ev.id || `r-${i}`} ev={ev} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

/* ---------- Panel ---------- */
function Panel({ title, subtitle, children }){
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] backdrop-blur-md shadow-lg p-4 transition hover:border-white/20">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6F00FF66] via-[#E9B3FB44] to-transparent" />
      <header className="mb-2">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-[11px] text-white/60">{subtitle}</p>}
      </header>
      {children}
    </section>
  )
}

/* ---------- RecCard ---------- */
function RecCard({ ev }){
  const id = ev?._id || ev?.id
  return (
    <article className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[.035] backdrop-blur-md p-5 hover:scale-[1.02] transition shadow-lg hover:shadow-xl">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#6F00FF88] via-[#E9B3FB55] to-transparent" />
      
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-white">{ev.title}</h3>
        {ev.category && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium text-[#E9B3FB] border border-white/15 bg-white/10">
            {ev.category}
          </span>
        )}
      </div>

      {ev.description && <p className="mt-1.5 text-sm text-white/70 line-clamp-2">{ev.description}</p>}

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/60">
        {ev.date && <span>📅 {new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
        {ev.venue && <span>📍 {ev.venue}</span>}
      </div>

      {!!(ev.tags && ev.tags.length) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {ev.tags.slice(0,3).map((t,i)=>(
            <span key={`${t}-${i}`} className="px-2 py-[2px] rounded-md text-[10px] text-white/70 bg-white/5 border border-white/10">#{t}</span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Link to={id ? `/events/${id}` : "/events"} className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15">
          Details
        </Link>
        <Link to={id ? `/register?event=${id}` : "/register"} className="px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-gradient-to-r from-[#6F00FF] to-[#8B5CF6] hover:brightness-110">
          Register
        </Link>
      </div>
    </article>
  )
}

/* ---------- Skeleton ---------- */
function SkeletonCard(){
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[.05] backdrop-blur-md p-4 animate-pulse">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#E9B3FB22] to-transparent" />
      <div className="h-4 w-2/3 bg-white/10 rounded" />
      <div className="mt-2 h-3.5 w-4/5 bg-white/10 rounded" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 bg-white/10 rounded" />
        <div className="h-6 w-16 bg-white/10 rounded" />
      </div>
    </div>
  )
}

function daysFromNow(dateStr){
  const d = new Date(dateStr)
  if(isNaN(d)) return NaN
  const now = new Date()
  return Math.ceil((d - now) / (1000*60*60*24))
}
