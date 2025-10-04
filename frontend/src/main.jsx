import React from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"

import App from "./App.jsx"
import Home from "./pages/Home.jsx"
import Register from "./pages/Register.jsx"
import EventsSplit from "./pages/EventsSplit.jsx"
import EventDetailsPanel from "./pages/EventDetailsPanel.jsx"
import Recommendations from "./pages/Recommendations.jsx"
import RightHint from "./pages/RightHint.jsx"
import Schedule from "./pages/Schedule.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,              // App MUST render <Outlet/>
    children: [
      { index: true, element: <Home /> },

      // 👇 Split view parent
      {
        path: "events",
        element: <EventsSplit />,   // MUST render <Outlet/> (right panel)
        children: [
          { index: true, element: <RightHint /> },
          { path: ":id", element: <EventDetailsPanel /> }, // 👈 nested child
        ],
      },
      

      { path: "register", element: <Register /> },
    ],
    
  },
  { path: "recommendations", element: <Recommendations /> },
  { path: "schedule", element: <Schedule /> },
  { path: "*", element: <div className="text-white/80 p-6">404</div> },
])

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
