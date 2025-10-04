import { Link } from "react-router-dom"
import ShareButton from "./ShareButton"
import AddToCalendar from "./AddToCalendar"
import useLocalStorage from "../hooks/useLocalStorage"
import { registerUser } from "../api"
import { toast } from "./Toaster"

export default function EventCard({ ev }){
  const [faves, setFaves] = useLocalStorage("faves", {})
  const isFav = !!faves[ev._id]

  function toggleFav(){
    setFaves(prev => ({ ...prev, [ev._id]: !prev[ev._id] }))
  }

  async function quickRSVP(){
    const res = await registerUser({
      name: "Quick RSVP",
      email: `rsvp+${ev._id}@example.com`,
      eventId: ev._id,
      interests: []
    })
    if(res.registrationId){ toast("RSVP confirmed ✅") } else { toast("RSVP failed ❌") }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-[var(--font-display)] font-semibold text-[--primary]">{ev.title}</h3>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-[--accent]">
            {ev.category}
          </span>
        </div>
        <button onClick={toggleFav} className="text-xl" aria-label="Favourite">
          {isFav ? "💜" : "🤍"}
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{ev.description}</p>

      <div className="mt-3 text-sm text-gray-500 space-y-1">
        <p>📅 {new Date(ev.date).toLocaleString()}</p>
        <p>📍 {ev.venue}</p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Link to={`/events/${ev._id}`} className="px-3 py-1.5 rounded-lg bg-[--secondary] text-white text-sm font-semibold hover:brightness-95">
          Details
        </Link>
        <button onClick={quickRSVP} className="px-3 py-1.5 rounded-lg bg-[#6D28D9] text-white text-sm font-semibold hover:bg-[#5B21B6]">
          Quick RSVP
        </button>
        <AddToCalendar ev={ev} className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm hover:bg-gray-50" />
        <ShareButton title={ev.title} text={ev.description} url={`${location.origin}/events/${ev._id}`} className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-sm hover:bg-gray-50" />
      </div>
    </div>
  )
}
