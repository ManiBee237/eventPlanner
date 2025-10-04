import React from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"

import App from "./App.jsx"
import Home from "./pages/home.jsx"
import EventList from "./pages/EventList.jsx"
import EventDetails from "./pages/EventDetails.jsx"
import Register from "./pages/Register.jsx"
import Admin from "./pages/Admin.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import PurpleSidebarLayout from "./layouts/PurpleSidebarLayout.jsx"

const router = createBrowserRouter([
  // public / basic layout
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

  // console layout (purple sidebar)
  {
    path: "/",
    element: <PurpleSidebarLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "admin", element: <Admin /> },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
