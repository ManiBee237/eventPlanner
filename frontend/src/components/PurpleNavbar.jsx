import { Link, NavLink } from "react-router-dom"

export default function PurpleNavbar() {
  return (
    <header className="sticky top-0 z-30 bg-[#6D28D9] text-white shadow">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-lg bg-white/15 grid place-items-center">⚡</span>
          <span className="font-bold tracking-tight">Events Planner</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-5 text-sm">
          <NavLink to="/" className={({isActive}) => `hover:text-[#A78BFA] ${isActive?'text-[#EBD9FF]':''}`}>Home</NavLink>
          <NavLink to="/events" className={({isActive}) => `hover:text-[#A78BFA] ${isActive?'text-[#EBD9FF]':''}`}>Events</NavLink>
          <NavLink to="/register" className={({isActive}) => `hover:text-[#A78BFA] ${isActive?'text-[#EBD9FF]':''}`}>Register</NavLink>
          <NavLink to="/admin" className={({isActive}) => `hover:text-[#A78BFA] ${isActive?'text-[#EBD9FF]':''}`}>Admin</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => `hover:text-[#A78BFA] ${isActive?'text-[#EBD9FF]':''}`}>Dashboard</NavLink>
        </nav>

        <Link
          to="/dashboard"
          className="sm:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition"
        >
          📊 <span className="text-sm font-semibold">Dashboard</span>
        </Link>
      </div>
      {/* subtle bottom border glow */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD]" />
    </header>
  )
}
