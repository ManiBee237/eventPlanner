// src/pages/Register.jsx
import { useEffect, useMemo, useState } from "react"
import { listEvents } from "../api"
// If your api exports registerUser, it'll be used; otherwise we mock-submit:
import * as API from "../api"
import Navbar from "../components/Navbar"

export default function Register(){
  const [events, setEvents] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  // form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [eventId, setEventId] = useState("")
  const [interests, setInterests] = useState([])
  const [interestInput, setInterestInput] = useState("")

  // ui state
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null) // {registrationId, eventTitle}
  const [error, setError] = useState("")

  useEffect(() => {
    let ok = true
    ;(async () => {
      try {
        setLoadingEvents(true)
        const evs = await listEvents()
        if (!ok) return
        setEvents(evs)
        // preselect if ?event=ID exists
        const params = new URLSearchParams(location.search)
        const pre = params.get("event")
        if (pre && evs.some(e => (e._id || e.id) === pre)) setEventId(pre)
      } finally {
        if (!ok) return
        setLoadingEvents(false)
      }
    })()
    return () => { ok = false }
  }, [])

  const selectedEvent = useMemo(
    () => events.find(e => (e._id || e.id) === eventId),
    [events, eventId]
  )

  function addInterestFromInput() {
    const v = interestInput.trim()
    if (!v) return
    if (!interests.includes(v)) setInterests(prev => [...prev, v])
    setInterestInput("")
  }

  function removeInterest(tag) {
    setInterests(prev => prev.filter(t => t !== tag))
  }

  function onInterestKey(e){
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addInterestFromInput()
    } else if (e.key === "Backspace" && !interestInput && interests.length) {
      e.preventDefault()
      setInterests(prev => prev.slice(0, -1))
    }
  }

  function validate() {
    if (!name.trim()) return "Please enter your name."
    if (!email.trim()) return "Please enter your email."
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!okEmail) return "Please enter a valid email."
    if (!eventId) return "Please select an event."
    return ""
  }

  async function onSubmit(e){
    e.preventDefault()
    setError("")
    const v = validate()
    if (v) { setError(v); return }
    setSubmitting(true)
    try {
      let res
      if (typeof API.registerUser === "function") {
        res = await API.registerUser({
          name: name.trim(),
          email: email.trim(),
          eventId,
          interests,
        })
      } else {
        // graceful mock if backend not ready
        await new Promise(r => setTimeout(r, 700))
        res = { registrationId: "mock-" + Math.random().toString(36).slice(2,8) }
      }

      if (res?.registrationId) {
        setSuccess({
          registrationId: res.registrationId,
          eventTitle: selectedEvent?.title || "Selected Event",
        })
        // reset form (keep event selected)
        setName("")
        setEmail("")
        setInterests([])
        setInterestInput("")
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const regs = JSON.parse(localStorage.getItem("myRegs") || "[]")
const id = selectedEvent?._id || selectedEvent?.id
if (id && !regs.some(r => r.id === id)) {
  regs.push({ id, at: Date.now() })
  localStorage.setItem("myRegs", JSON.stringify(regs))
}

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
      
      {/* LEFT: form panel */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,.35)]">
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB66] via-[#6F00FF33] to-transparent" />
        <form className="p-6 space-y-5" onSubmit={onSubmit} noValidate>
          <header>
            <h1 className="text-2xl font-semibold text-white">Register for an Event</h1>
            <p className="mt-1 text-white/70 text-sm">Secure your spot in seconds.</p>
          </header>

          {/* Name */}
          <div>
            <label className="block text-sm text-white/80 mb-1" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e=>setName(e.target.value)}
              placeholder="e.g., Priya Sharma"
              className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2.5 text-white outline-none focus:border-white/20"
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-white/80 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-2.5 text-white outline-none focus:border-white/20"
              autoComplete="email"
            />
          </div>

          {/* Event */}
          <div>
            <label className="block text-sm text-white/80 mb-1" htmlFor="event">Select Event</label>
            <div className="relative">
              <select
                id="event"
                value={eventId}
                onChange={e=>setEventId(e.target.value)}
                className="w-full appearance-none rounded-xl bg-black/20 border border-white/10 px-3 py-2.5 pr-10 text-white outline-none focus:border-white/20"
              >
                <option value="">{loadingEvents ? "Loading…" : "Choose an event"}</option>
                {events.map(e=>{
                  const id = e._id || e.id
                  return <option key={id} value={id}>{e.title}</option>
                })}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">▾</span>
            </div>
            {selectedEvent && (
              <p className="mt-2 text-xs text-white/60">
                📅 {new Date(selectedEvent.date).toLocaleString()} · 📍 {selectedEvent.venue}
              </p>
            )}
          </div>

          {/* Interests (tag input) */}
          <div>
            <label className="block text-sm text-white/80 mb-1">Interests (optional)</label>
            <div className="rounded-xl bg-black/20 border border-white/10 px-3 py-2.5">
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
                  placeholder={interests.length ? "Add more…" : "e.g., AI, Design, Startup"}
                  className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-white placeholder-white/50"
                />
                <button
                  type="button"
                  onClick={addInterestFromInput}
                  className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/15 hover:border-white/20"
                >
                  Add
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-white/50">Press <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10">Enter</kbd> or comma to add a tag.</p>
          </div>

          {/* Alert */}
          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 text-red-200 text-sm px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 text-emerald-200 text-sm px-3 py-2">
              ✅ Registered for <span className="font-semibold">{success.eventTitle}</span>. Ref: <span className="font-mono">{success.registrationId}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white
                          bg-gradient-to-r from-[#6F00FF] to-[#8B5CF6] shadow-[0_6px_20px_rgba(111,0,255,0.35)]
                          hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {submitting ? "Submitting…" : "Register"}
            </button>
            <button
              type="button"
              onClick={() => { setName(""); setEmail(""); setInterests([]); setInterestInput(""); setError(""); }}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white hover:bg-white/15"
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {/* RIGHT: helpful info / preview */}
      <aside className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,.35)] p-6">
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB33] to-transparent" />
        <h2 className="text-xl font-semibold text-white">Why register?</h2>
        <ul className="mt-3 space-y-2 text-white/80 text-sm">
          <li>• Secure your seat and get reminders</li>
          <li>• Personalized recommendations based on interests</li>
          <li>• One-click check-in on event day</li>
        </ul>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold text-white/90">Your selection</h3>
          {selectedEvent ? (
            <div className="mt-2 text-sm text-white/70">
              <div className="font-medium text-white">{selectedEvent.title}</div>
              <div className="mt-1">📅 {new Date(selectedEvent.date).toLocaleString()}</div>
              <div>📍 {selectedEvent.venue}</div>
              {!!(selectedEvent.tags?.length) && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedEvent.tags.slice(0,4).map((t,i)=>(
                    <span key={`${t}-${i}`} className="text-[11px] text-white/70 bg-white/5 border border-white/10 rounded-md px-2 py-0.5">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-white/60">Choose an event to see details here.</p>
          )}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-sm font-semibold text-white/90">Tips</h3>
          <p className="mt-1 text-sm text-white/70">Use a work/school email for smoother entry. Add interests like <em>AI</em>, <em>Design</em>, <em>Startup</em> for better suggestions.</p>
        </div>
      </aside>
    </div>
  )
}
