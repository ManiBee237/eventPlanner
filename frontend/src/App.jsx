import { Link, Outlet } from "react-router-dom"
import Toaster from "./components/Toaster"

export default function App() {
  return (
    <div className="min-h-screen bg-[--background] text-[--text]">
      <nav className="bg-[#2C3E50] text-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="font-semibold">Events Planner</Link>
          <Link to="/events" className="hover:text-[--secondary]">Events</Link>
          <Link to="/register" className="hover:text-[--secondary]">Register</Link>
          <Link to="/dashboard" className="ml-auto px-3 py-1.5 rounded bg-white/15 hover:bg-white/25">Console</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Toaster />
        {/* 👇 THIS IS CRITICAL */}
        <Outlet />
      </main>
    </div>
  )
}
