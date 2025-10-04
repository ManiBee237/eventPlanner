import { useEffect, useState } from "react"
import { listEvents, registerUser } from "../api"

export default function Register(){
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ name:"", email:"", eventId:"", interests:"" })
  const [msg, setMsg] = useState("")

  useEffect(()=>{ listEvents().then(setEvents) },[])

  async function submit(e){
    e.preventDefault()
    setMsg("Submitting…")
    const payload = { ...form, interests: form.interests.split(',').map(s=>s.trim()).filter(Boolean) }
    const res = await registerUser(payload)
    if(res.registrationId){ 
      setMsg("✅ Registered successfully!")
      if(res.userId) localStorage.setItem("userId", res.userId)
      setForm({ name:"", email:"", eventId:"", interests:"" })
    } else {
      setMsg("❌ Registration failed")
    }
  }

  return (
    <div className="min-h-screen flex justify-center">
      <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 w-full max-w-xl space-y-5">
        <h1 className="text-3xl font-bold text-[--primary] text-center">Event Registration</h1>

        <div>
          <label className="block text-sm font-medium text-[--primary] mb-1">Name</label>
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:oklch(70%_0.1_180/0.5)] outline-none" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-[--primary] mb-1">Email</label>
          <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:oklch(70%_0.1_180/0.5)] outline-none" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-[--primary] mb-1">Select Event</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:oklch(70%_0.1_180/0.5)] outline-none" value={form.eventId} onChange={e=>setForm({...form, eventId:e.target.value})} required>
            <option value="">Choose an event…</option>
            {events.map(e => <option key={e._id} value={e._id}>{e.title} — {new Date(e.date).toLocaleDateString()}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[--primary] mb-1">Interests (comma separated)</label>
          <input className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:oklch(70%_0.1_180/0.5)] outline-none" placeholder="e.g., ai, frontend, marketing" value={form.interests} onChange={e=>setForm({...form, interests:e.target.value})} />
        </div>

        <button type="submit" className="w-full py-2 rounded-lg bg-[--secondary] text-white font-semibold hover:brightness-95 transition">
          Register
        </button>

        {msg && <p className={`text-center text-sm ${msg.startsWith('✅')?'text-green-600':msg.startsWith('❌')?'text-red-500':'text-gray-500'}`}>{msg}</p>}
      </form>
    </div>
  )
}
