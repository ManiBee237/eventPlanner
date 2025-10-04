import { useEffect, useMemo, useState } from "react"
import { listEvents, getParticipants } from "../api"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ok = true
    async function boot() {
      setLoading(true)
      const evs = await listEvents()
      let all = []
      // load participants for each (mock is fast; real API: you might aggregate on backend)
      for (const e of evs) {
        const rows = await getParticipants(e._id).catch(() => [])
        all = all.concat(rows.map(r => ({ ...r, eventTitle: e.title })))
      }
      if (!ok) return
      setEvents(evs)
      setParticipants(all)
      setLoading(false)
    }
    boot()
    return () => { ok = false }
  }, [])

  const todayStr = new Date().toDateString()
  const totalEvents = events.length
  const totalRegs = participants.length
  const todaysRegs = participants.filter(p => new Date(p.createdAt).toDateString() === todayStr).length
  const conversionRate = useMemo(() => {
    // fake formula for demo: regs / (events * 10)
    const denom = Math.max(totalEvents * 10, 1)
    return Math.round((totalRegs / denom) * 100)
  }, [totalEvents, totalRegs])
  const capacityUsed = useMemo(() => {
    // pretend each event has 100 seats
    const seats = Math.max(totalEvents * 100, 1)
    return Math.min(100, Math.round((totalRegs / seats) * 100))
  }, [totalEvents, totalRegs])

  // sample series for fake charts
  const series = [12, 18, 9, 22, 17, 25, 20]
  const max = Math.max(...series, 1)

  return (
    <div className="min-h-screen">
      {/* Title + actions */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2C3E50]">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of registrations and event activity</p>
        </div>
        <div className="flex gap-2">
          <Link to="/events" className="px-3 py-2 rounded-lg bg-[#6D28D9] text-white font-semibold hover:bg-[#5B21B6] transition">Browse Events</Link>
          <Link to="/register" className="px-3 py-2 rounded-lg bg-[#8B5CF6] text-white font-semibold hover:bg-[#7C3AED] transition">Add Registration</Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Total Events</div>
          <div className="mt-2 flex items-end justify-between">
            <div className="text-3xl font-extrabold text-[#6D28D9]">{totalEvents}</div>
            <span className="text-xs px-2 py-0.5 rounded bg-[#EDE9FE] text-[#6D28D9]">live</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Total Registrations</div>
          <div className="mt-2 text-3xl font-extrabold text-[#6D28D9]">{totalRegs}</div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-[#8B5CF6]" style={{ width: `${Math.min(totalRegs,100)}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Today</div>
          <div className="mt-2 text-3xl font-extrabold text-[#6D28D9]">{todaysRegs}</div>
          <div className="mt-2 text-xs text-gray-500">New registrations</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Conversion</div>
          <div className="mt-2 text-3xl font-extrabold text-[#6D28D9]">{conversionRate}%</div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-[#A78BFA]" style={{ width: `${conversionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Charts (pure Tailwind + divs) */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        {/* Bars */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#2C3E50]">Registrations (last 7)</h3>
            <span className="text-xs text-gray-500">mock data</span>
          </div>
          <div className="mt-5 flex items-end gap-3 h-36">
            {series.map((v, i) => (
              <div key={i} className="flex-1 grid place-items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#6D28D9] to-[#8B5CF6]"
                  style={{ height: `${(v / max) * 100}%` }}
                  title={`${v}`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 text-center text-xs text-gray-500">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d}>{d}</div>)}
          </div>
        </div>

        {/* Sparkline */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-[#2C3E50]">Capacity Used</h3>
          <p className="text-sm text-gray-600">Across all events</p>
          <div className="mt-3 text-4xl font-extrabold text-[#6D28D9]">{capacityUsed}%</div>
          <div className="mt-4 h-24 w-full relative">
            {/* pseudo sparkline bars */}
            <div className="absolute inset-0 flex items-end gap-1">
              {[35,45,40,60,55,70,65,80].map((v,i)=>(
                <div key={i} className="flex-1 bg-[#EDE9FE] rounded-t" style={{height:`${v}%`}} />
              ))}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C4B5FD]" />
          </div>
        </div>
      </div>

      {/* Recent registrations */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#2C3E50]">Recent Registrations</h3>
          <Link to="/admin" className="text-[#6D28D9] hover:text-[#8B5CF6] text-sm font-semibold">View all →</Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm mt-4 animate-pulse">Loading…</p>
        ) : participants.length === 0 ? (
          <p className="text-gray-500 text-sm mt-4">No registrations yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[#6D28D9] text-white">
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Event</th>
                  <th className="text-left p-3 font-semibold">Interests</th>
                  <th className="text-left p-3 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {participants.slice(0,10).map((p) => (
                  <tr key={p._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">{p.user?.name || "—"}</td>
                    <td className="p-3">{p.user?.email || "—"}</td>
                    <td className="p-3">{p.eventTitle}</td>
                    <td className="p-3">{(p.user?.interests || []).join(", ") || "—"}</td>
                    <td className="p-3 text-gray-500">{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
