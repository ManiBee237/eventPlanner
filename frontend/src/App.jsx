import { Link, Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"

export default function App(){
  return (
    <div className="min-h-screen">
      {/* your navbar here */}
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet /> {/* ← critical */}
      </main>
    </div>
  )
}
