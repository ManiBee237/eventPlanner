import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { getRecommendations, listEvents } from "../api"

// Reusable bits
function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[--primary]">{title}</h2>
        {subtitle && <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function Chip({ label, active, onClick, emoji }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full text-sm border transition",
        active ? "bg-[--secondary] text-white border-transparent" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
      ].join(" ")}
      aria-pressed={active}
    >
      <span className="mr-1">{emoji}</span>{label}
    </button>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="h-5 w-2/3 bg-gray-200 rounded" />
      <div className="mt-3 h-4 w-full bg-gray-200 rounded" />
      <div className="mt-2 h-4 w-5/6 bg-gray-200 rounded" />
      <div className="mt-4 flex gap-3">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="h-4 w-28 bg-gray-200 rounded" />
      </div>
      <div className="mt-5 h-8 w-32 bg-gray-200 rounded" />
    </div>
  )
}

function EmptyState({ title = "Nothing here (yet)", note = "Try adjusting your filters." }) {
  return (
    <div className="text-center border border-dashed border-gray-300 rounded-xl p-8 bg-white">
      <div className="text-4xl mb-2">🫥</div>
      <h3 className="font-semibold text-[--primary]">{title}</h3>
      <p className="text-sm text-gray-600">{note}</p>
    </div>
  )
}

export default function Home() {
  // personalization
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "")

  // data
  const [events, setEvents] = useState(null)
  const [loading, setLoading] = useState(true)

  // recommendations
  const [recs, setRecs] = useState(null)
  const [recsLoading, setRecsLoading] = useState(false)

  // UI state
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [quick, setQuick] = useState("All")
  const categories = ["All", "Seminar", "Workshop", "Fest", "Networking"]

  useEffect(() => {
  console.log("Home mounted ✅")
}, [])


  // fetch events
  useEffect(() => {
    let alive = true
    setLoading(true)
    listEvents()
      .then((res) => alive && setEvents(res || []))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  // fetch recs when userId changes
  useEffect(() => {
    let alive = true
    if (!userId) { setRecs(null); return }
    setRecsLoading(true)
    getRecommendations(userId)
      .then((r) => alive && setRecs(Array.isArray(r) ? r : []))
      .catch(() => alive && setRecs([]))
      .finally(() => alive && setRecsLoading(false))
    return () => { alive = false }
  }, [userId])

  // dates for quick filters
  const now = new Date()
  const startOfNextWeek = useMemo(() => {
    const d = new Date(); const day = d.getDay(); const diff = (7 - day) % 7
    d.setDate(d.getDate() + diff); d.setHours(0,0,0,0); return d
  }, [])
  const endOfNextWeek = useMemo(() => { const d = new Date(startOfNextWeek); d.setDate(d.getDate()+7); return d }, [startOfNextWeek])
  const endOfThisWeekend = useMemo(() => { const d = new Date(); const day = d.getDay(); const toSun = (7 - day) % 7; d.setDate(d.getDate()+toSun); d.setHours(23,59,59,999); return d }, [])

  // derived lists
  const filtered = useMemo(() => {
    if (!Array.isArray(events)) return []
    return events
      .filter((ev) => new Date(ev.date) >= now)
      .filter((ev) => (category === "All" ? true : (ev.category || "").toLowerCase() === category.toLowerCase()))
      .filter((ev) => {
        if (!query) return true
        const hay = [ev.title, ev.description, ev.venue, ev.category, (ev.tags || []).join(" ")].join(" ").toLowerCase()
        return hay.includes(query.toLowerCase())
      })
      .filter((ev) => {
        if (quick === "All") return true
        const d = new Date(ev.date)
        if (quick === "This Weekend") return d <= endOfThisWeekend
        if (quick === "Next Week") return d >= startOfNextWeek && d < endOfNextWeek
        return true
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [events, category, query, quick, now, endOfThisWeekend, startOfNextWeek, endOfNextWeek])

  const trending = useMemo(() => {
    if (!Array.isArray(events)) return []
    return [...events]
      .filter((ev) => new Date(ev.date) >= now)
      .sort((a, b) => {
        const timeScore = new Date(a.date) - new Date(b.date)
        const lenScore = (b.description?.length || 0) - (a.description?.length || 0)
        return timeScore || lenScore
      })
      .slice(0, 6)
  }, [events, now])

  function handleSurprise() {
    if (!filtered.length) return
    const choice = filtered[Math.floor(Math.random() * filtered.length)]
    alert(`🎯 Surprise pick:\n${choice.title}\n${new Date(choice.date).toLocaleString()} @ ${choice.venue}`)
  }

  // UI
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-[--background] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10 sm:py-14">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[--secondary]/10 text-[--secondary] text-xs font-semibold">
                🔮 smart picks • gen-z vibe • pro polish
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-[--primary]">
                Find your next <span className="text-[--secondary]">seminar</span>, <span className="text-[--secondary]">workshop</span>, or <span className="text-[--secondary]">fest</span>
              </h1>
              <p className="mt-3 text-gray-700">Search, filter, and get AI-powered recommendations matched to your interests.</p>

              {/* search + action */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2">
                    <span>🔎</span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search topics, venues, or tags…"
                      className="flex-1 outline-none text-sm bg-transparent"
                    />
                    {query && (
                      <button
                        className="text-gray-500 hover:text-[--accent] text-sm"
                        onClick={() => setQuery("")}
                        aria-label="Clear search"
                      >✕</button>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleSurprise}
                  className="px-4 py-2 rounded-xl bg-[--secondary] text-white font-semibold hover:brightness-95 transition"
                >
                  🎲 Surprise me
                </button>
              </div>

              {/* category chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["All","Seminar","Workshop","Fest","Networking"].map((c, i) => (
                  <Chip
                    key={`cat-${c}-${i}`}
                    label={c}
                    emoji={c==="Seminar"?"🎓":c==="Workshop"?"🛠️":c==="Fest"?"🎉":c==="Networking"?"🤝":"✨"}
                    active={category === c}
                    onClick={() => setCategory(c)}
                  />
                ))}
              </div>

              {/* quick date filters */}
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  {label:"All Dates", val:"All", emoji:"🗓️"},
                  {label:"This Weekend", val:"This Weekend", emoji:"🌈"},
                  {label:"Next Week", val:"Next Week", emoji:"📆"},
                ].map((f) => (
                  <Chip
                    key={`qf-${f.val}`}
                    label={f.label}
                    emoji={f.emoji}
                    active={quick === f.val}
                    onClick={() => setQuick(f.val)}
                  />
                ))}
              </div>
            </div>

            {/* stat card */}
            <div className="flex-1 w-full">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Live stats</p>
                <div className="mt-3 grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[--background] text-center">
                    <div className="text-2xl font-extrabold text-[--primary]">{events?.length ?? "—"}</div>
                    <div className="text-xs text-gray-600">Total events</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[--background] text-center">
                    <div className="text-2xl font-extrabold text-[--primary]">{filtered.length}</div>
                    <div className="text-xs text-gray-600">Matching</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[--background] text-center">
                    <div className="text-2xl font-extrabold text-[--primary]">{recs?.length ?? 0}</div>
                    <div className="text-xs text-gray-600">For you</div>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-semibold text-[--primary]">Your User ID for AI picks</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      value={userId}
                      onChange={(e) => { const v = e.target.value; setUserId(v); localStorage.setItem("userId", v) }}
                      placeholder="Paste user id from registration response"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-[color:oklch(70%_0.1_180/0.5)] text-sm"
                    />
                    <button
                      onClick={() => setUserId("")}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>          
        </div>
      </section>

      {/* TRENDING */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <SectionTitle
          title="Trending Now"
          subtitle="What’s hot & happening soon"
          action={<Link to="/events" className="text-[--secondary] hover:text-[--accent] font-semibold">Browse all →</Link>}
        />

        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-tr-${i}`} />)}
          </div>
        ) : trending.length === 0 ? (
          <div className="mt-6"><EmptyState title="No trending events" note="Check back later!" /></div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((ev, i) => (
              <div key={ev._id || ev.id || `tr-${ev.title}-${ev.date}-${i}`} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-[--primary]">{ev.title}</h3>
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-[--accent]">{ev.category}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{ev.description}</p>
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p>📅 {new Date(ev.date).toLocaleString()}</p>
                  <p>📍 {ev.venue}</p>
                </div>
                <Link to={`/events/${ev._id}`} className="mt-4 inline-block text-[--secondary] font-semibold hover:text-[--accent]">
                  View details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOR YOU */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <SectionTitle title="For You" subtitle="AI-powered picks based on your interests" />
        {!userId ? (
          <div className="mt-6"><EmptyState title="Add your User ID" note="Paste your user id above to see recommendations." /></div>
        ) : recsLoading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-rec-${i}`} />)}
          </div>
        ) : !recs?.length ? (
          <div className="mt-6"><EmptyState title="No recommendations yet" note="Register with interests or tweak them to get matches." /></div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recs.map((ev, i) => (
              <div key={ev._id || ev.id || `rec-${ev.title}-${ev.date}-${i}`} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-[--primary]">{ev.title}</h3>
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-[--secondary]">For you</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{ev.description}</p>
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p>📅 {new Date(ev.date).toLocaleString()}</p>
                  <p>📍 {ev.venue}</p>
                </div>
                <Link to={`/events/${ev._id}`} className="mt-4 inline-block text-[--secondary] font-semibold hover:text-[--accent]">
                  Save me a seat →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* EXPLORE */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <SectionTitle title="Explore" subtitle="Matches for your current search & filters" />
        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`sk-ex-${i}`} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6"><EmptyState title="No matches" note="Try a different category or clear your search." /></div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ev, i) => (
              <div key={ev._id || ev.id || `ex-${ev.title}-${ev.date}-${i}`} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-[--primary]">{ev.title}</h3>
                  <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-[--primary]">✨</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{ev.description}</p>
                <div className="mt-3 text-sm text-gray-500 space-y-1">
                  <p>📅 {new Date(ev.date).toLocaleString()}</p>
                  <p>📍 {ev.venue}</p>
                </div>
                <Link to={`/events/${ev._id}`} className="mt-4 inline-block text-[--secondary] font-semibold hover:text-[--accent]">
                  Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
