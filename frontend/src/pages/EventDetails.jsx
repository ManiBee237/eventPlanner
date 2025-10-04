import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getEvent } from "../api"

export default function EventDetails(){
  const { id } = useParams()
  const [ev, setEv] = useState(null)
  const [err, setErr] = useState("")

  useEffect(()=>{
    getEvent(id).then(setEv).catch(e => setErr(e.message))
  },[id])

  if(err) return <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">{err}</div>
  if(!ev) return <p className="text-center text-gray-500 animate-pulse">Loading…</p>

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-[--primary]">{ev.title}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-[--accent]">{ev.category}</span>
        {(ev.tags||[]).map((t,i)=>(
          <span key={i} className="px-2 py-0.5 rounded-md text-xs font-semibold text-white bg-[--primary]">{t}</span>
        ))}
      </div>
      <p className="mt-3 text-gray-700">{ev.description}</p>
      <div className="mt-3 text-sm text-gray-600 space-y-1">
        <p>📅 {new Date(ev.date).toLocaleString()}</p>
        <p>📍 {ev.venue}</p>
      </div>
      <Link to="/register" className="mt-4 inline-block px-4 py-2 rounded-lg bg-[--secondary] text-white font-semibold hover:brightness-95 transition">
        Register →
      </Link>
    </div>
  )
}
