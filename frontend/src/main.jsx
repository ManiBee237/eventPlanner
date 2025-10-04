import React from "react"
import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import "./index.css"

import App from "./App.jsx"
import Home from "./pages/home.jsx"
import EventList from "./pages/EventList.jsx"
import EventDetails from "./pages/EventDetails.jsx"
import Register from "./pages/Register.jsx"
import Admin from "./pages/Admin.jsx"
import Dashboard from "./pages/Dashboard.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "events", element: <EventList /> },
      { path: "events/:id", element: <EventDetails /> },
      { path: "register", element: <Register /> },
      { path: "admin", element: <Admin /> },
      { path: "dashboard", element: <Dashboard /> },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
