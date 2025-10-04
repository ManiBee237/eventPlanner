import { Outlet } from "react-router-dom"
import PurpleNavbar from "./components/PurpleNavbar"

export default function App() {
  return (
    <div className="min-h-screen bg-[--background] text-[--text]">
      <PurpleNavbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
