// src/pages/EventDetailsPanel.jsx
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getEvent } from "../api"
import GlassCard from "../components/GlassCard"

export default function EventDetailsPanel(){
  const { id } = useParams()
  const [ev, setEv] = useState(null)   // null = loading, undefined = not found/error

  useEffect(() => {
    let ok = true
    ;(async () => {
      try {
        const data = await getEvent(id)
        if (!ok) return
        if (!data) {
          setEv(undefined)      // not found
        } else {
          setEv(data)
        }
      } catch {
        if (!ok) return
        setEv(undefined)        // error
      }
    })()
    return () => { ok = false }
  }, [id])

  // Loading skeleton
  if (ev === null) {
    return (
      <GlassCard className="relative overflow-hidden p-6 animate-pulse">
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB33] to-transparent" />
        <div className="h-6 w-2/3 bg-white/10 rounded" />
        <div className="mt-3 h-4 w-3/4 bg-white/10 rounded" />
        <div className="mt-2 h-4 w-2/3 bg-white/10 rounded" />
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <div className="h-16 bg-white/5 rounded-xl" />
          <div className="h-16 bg-white/5 rounded-xl" />
        </div>
        <div className="mt-5 h-9 w-32 bg-white/10 rounded-lg" />
      </GlassCard>
    )
  }

  // Not found / error
  if (ev === undefined) {
    return (
      <GlassCard className="relative overflow-hidden p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB33] to-transparent" />
        <h2 className="text-xl font-semibold text-white">Event not found</h2>
        <p className="mt-2 text-white/70">We couldn’t load this event. It may have been removed or the link is invalid.</p>
        <Link
          to="/events"
          className="mt-4 inline-flex rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white border border-white/15 hover:bg-white/15"
        >
          ← Back to Events
        </Link>
      </GlassCard>
    )
  }

  // Success
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[.04] backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,.35)] overflow-hidden">
      {/* top stripe clipped inside */}
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB66] via-[#6F00FF66] to-transparent" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-semibold text-white">{ev.title}</h2>
          {ev.category && (
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-[#E9B3FB] border border-white/15 bg-white/10">
              {ev.category}
            </span>
          )}
        </div>

        {ev.description && (
          <p className="mt-3 text-white/80">{ev.description}</p>
        )}

        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-white/60">Date & Time</div>
            <div className="text-white mt-1">{new Date(ev.date).toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3">
            <div className="text-white/60">Venue</div>
            <div className="text-white mt-1">{ev.venue}</div>
          </div>
        </div>

        {!!(ev.tags && ev.tags.length) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {ev.tags.map((t, i) => (
              <span
                key={`tag-${t}-${i}`}
                className="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-white/10 border border-white/10"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to={`/register?event=${ev._id || ev.id}`}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6F00FF] to-[#8B5CF6] hover:brightness-110 transition"
          >
            Register →
          </Link>
          <Link
            to="/events"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  )
}
