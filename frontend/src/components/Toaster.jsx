import { useEffect, useState } from "react"

export default function Toaster(){
  const [items, setItems] = useState([])

  useEffect(() => {
    const handler = (e) => {
      const id = crypto.randomUUID()
      setItems((prev) => [...prev, { id, text: e.detail }])
      setTimeout(() => setItems((prev) => prev.filter(x => x.id !== id)), 2500)
    }
    window.addEventListener("toast", handler)
    return () => window.removeEventListener("toast", handler)
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {items.map(i => (
        <div key={i.id} className="px-4 py-2 rounded-lg bg-black/80 text-white text-sm shadow">
          {i.text}
        </div>
      ))}
    </div>
  )
}

// helper to fire a toast: toast("Saved!")
export function toast(text){ window.dispatchEvent(new CustomEvent("toast", { detail: text })) }
