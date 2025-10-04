import { useState } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"

export default function PurpleSidebarLayout() {
  const [open, setOpen] = useState(true)       // sidebar expanded on desktop
  const [mobile, setMobile] = useState(false)  // sidebar drawer on mobile

  const sidebar = (
    <aside
      className={[
        "h-full bg-[#6D28D9] text-white flex flex-col",
        "transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16",
      ].join(" ")}
    >
      {/* brand */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <span className="inline-grid place-items-center h-9 w-9 rounded-lg bg-white/15">⚡</span>
        {open && <span className="font-semibold tracking-tight">Events Console</span>}
      </div>

      {/* nav */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        <Item to="/dashboard" open={open} icon="📊" label="Dashboard" />
        <Item to="/admin" open={open} icon="🧑‍💼" label="Participants" />
        <Item to="/events" open={open} icon="🗓️" label="Events" />
        <Item to="/register" open={open} icon="✍️" label="Register" />
        <Item to="/" open={open} icon="🏠" label="Home" />
      </nav>

      {/* footer mini */}
      <div className="px-3 py-3 border-t border-white/10 text-xs text-white/80">
        {open ? "© 2025 Event Planner" : "©25"}
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[--background] text-[--text]">
      {/* top bar */}
      <header className="sticky top-0 z-40 bg-[#6D28D9] text-white shadow">
        <div className="max-w-none px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* left controls */}
          <div className="flex items-center gap-2">
            {/* mobile menu */}
            <button
              className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/15 hover:bg-white/25"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
            >☰</button>

            {/* desktop collapse */}
            <button
              className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white/15 hover:bg-white/25"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle sidebar"
            >{open ? "«" : "»"}</button>

            <Link to="/" className="ml-2 font-semibold tracking-tight hidden sm:block">
              Events Planner
            </Link>
          </div>

          {/* quick actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/events"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-sm"
            >Browse</Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-sm font-semibold"
            >New Reg</Link>
          </div>
        </div>
        <div className="h-[3px] w-full bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD]" />
      </header>

      {/* body */}
      <div className="flex">
        {/* desktop sidebar */}
        <div className="hidden sm:block">{sidebar}</div>

        {/* content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobile(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72">{sidebar}</div>
          <button
            className="absolute top-3 right-3 h-9 w-9 rounded-lg bg-white text-[#6D28D9] font-bold"
            onClick={() => setMobile(false)}
            aria-label="Close menu"
          >×</button>
        </div>
      )}
    </div>
  )
}

function Item({ to, icon, label, open }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
          isActive
            ? "bg-white text-[#6D28D9] font-semibold"
            : "text-white/90 hover:bg-white/10",
        ].join(" ")
      }
    >
      <span className="text-base">{icon}</span>
      {open && <span className="truncate">{label}</span>}
    </NavLink>
  )
}
