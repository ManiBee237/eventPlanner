import { useEffect, useState } from "react"
import { listEvents, getParticipants } from "../api"

export default function Admin() {
  const [events, setEvents] = useState([])
  const [eventId, setEventId] = useState("")
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => {
    listEvents().then(setEvents)
  }, [])

  async function loadParticipants() {
    if (!eventId) {
      setMsg("Please select an event.")
      return
    }
    setLoading(true)
    setMsg("Loading participants...")
    try {
      const data = await getParticipants(eventId)
      setParticipants(data)
      setMsg("")
    } catch (e) {
      setMsg("Failed to load participants.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[--primary] mb-4">
          Admin Panel · Participants
        </h1>

        {/* Event Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:oklch(70%_0.1_180/0.5)] outline-none text-sm w-full sm:w-72"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Choose event…</option>
            {events.map((e) => (
              <option key={e._id} value={e._id}>
                {e.title}
              </option>
            ))}
          </select>
          <button
            onClick={loadParticipants}
            className="px-4 py-2 rounded-lg bg-[--secondary] text-white font-semibold hover:brightness-95 transition"
          >
            Load
          </button>
        </div>

        {msg && (
          <p
            className={`mb-4 text-sm ${
              msg.includes("fail") ? "text-red-600" : "text-gray-600"
            }`}
          >
            {msg}
          </p>
        )}

        {/* Table */}
        {loading ? (
          <p className="text-gray-500 animate-pulse text-sm">Fetching data...</p>
        ) : participants.length === 0 ? (
          <p className="text-gray-500 text-sm">No participants found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[--primary] text-white">
                  <th className="text-left p-3 font-semibold">Name</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold">Interests</th>
                  <th className="text-left p-3 font-semibold">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-3">{p.user?.name || "—"}</td>
                    <td className="p-3">{p.user?.email || "—"}</td>
                    <td className="p-3 text-gray-700">
                      {(p.user?.interests || []).join(", ") || "—"}
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(p.createdAt).toLocaleString()}
                    </td>
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
