import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Register", path: "/register" },
    { name: "Recommendations", path: "/recommendations" },
    { name: "My Schedule", path: "/schedule" },
    // { name: "Announcements", path: "/announcements" },
  ]

  return (
    <header
      className="
        sticky top-0 z-50 backdrop-blur-xl
        bg-gradient-to-r from-[#6F00FF] via-[#8B5CF6] to-[#00C2FF]
        border-b border-white/10
        shadow-[0_2px_25px_rgba(111,0,255,0.3)]
        transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* ---------- Brand ---------- */}
        <Link to="/" className="flex items-center gap-2 group">
          {/* ⚡ Icon */}
          <span
            className="inline-grid place-items-center h-9 w-9 rounded-lg
                       bg-[#E9B3FB]/15 text-[#E9B3FB]
                       font-semibold text-lg shadow-inner
                       transition-all duration-300
                       group-hover:shadow-[0_0_12px_rgba(233,179,251,0.6)]
                       group-hover:text-white group-hover:bg-[#E9B3FB]/25"
          >
            ⚡
          </span>

          {/* Brand Text */}
          <span
            className="font-[600] text-[1.25rem] tracking-tight text-white select-none"
            style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.5px" }}
          >
            <span className="">
              Events&nbsp;
            </span>
            Planner
          </span>
        </Link>

        {/* ---------- Navigation Links ---------- */}
        <nav className="hidden sm:flex items-center gap-1">
          {links.map(({ name, path }) => {
            const active = pathname === path
            return (
              <Link
                key={name}
                to={path}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300
                  ${
                    active
                      ? "text-white bg-white/10"
                      : "text-white/90 hover:text-white hover:bg-white/15"
                  }`}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.3px",
                }}
              >
                {name}
                <span
                  className={`absolute left-0 -bottom-[2px] h-[2px] rounded-full bg-gradient-to-r from-[#E9B3FB] to-[#6F00FF] transition-all duration-300 ${
                    active ? "w-full" : "w-0 hover:w-full"
                  }`}
                />
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
