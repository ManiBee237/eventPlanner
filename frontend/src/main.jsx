// src/main.jsx
import React from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"

import App from "./App.jsx"
import Home from "./pages/Home.jsx"
import EventList from "./pages/EventList.jsx"
import EventDetails from "./pages/EventDetails.jsx"
import Register from "./pages/Register.jsx"
import Admin from "./pages/Admin.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import PurpleSidebarLayout from "./layouts/PurpleSidebarLayout.jsx"

function NotFound() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-[--primary]">404</h1>
      <p className="text-gray-600">Page not found.</p>
    </div>
  )
}

const router = createBrowserRouter([
  // Public layout
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "events", element: <EventList /> },
      { path: "events/:id", element: <EventDetails /> },
      { path: "register", element: <Register /> },
    ],
  },
  // Console layout
  {
    path: "/",
    element: <PurpleSidebarLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "admin", element: <Admin /> },
    ],
  },
  // Catch-all
  { path: "*", element: <NotFound /> },
])

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
