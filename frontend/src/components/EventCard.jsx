import { Link } from "react-router-dom"

export default function EventCard({ ev }) {
  return (
    <div className="rounded-2xl border border-[--border] bg-[--panel]/90 hover:border-[--accent]/40 transition-all duration-300 hover:-translate-y-1">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-white">{ev.title}</h3>
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-[--accent]/20">
            {ev.category}
          </span>
        </div>

        <p className="mt-2 text-sm text-[--muted] line-clamp-2">{ev.description}</p>

        <div className="mt-3 text-xs text-[--muted] space-x-3">
          <span>📅 {new Date(ev.date).toLocaleString()}</span>
          <span>📍 {ev.venue}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/events/${ev._id}`}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-[--primary]/70 hover:bg-[--primary] transition"
          >
            Details
          </Link>
          <Link
            to={`/register?event=${ev._id}`}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[--bg] bg-[--accent]/80 hover:bg-[--accent] transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
