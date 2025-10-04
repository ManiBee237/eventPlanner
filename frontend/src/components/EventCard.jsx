import { Link } from "react-router-dom"

export default function EventCard({ ev }){
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-[--primary]">{ev.title}</h3>
        <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-[--accent]">
          {ev.category}
        </span>
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
  )
}
