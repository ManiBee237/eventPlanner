import { toast } from "./Toaster"

export default function AddToCalendar({ ev, className = "" }){
  function downloadICS(){
    const start = new Date(ev.date)
    const end = new Date(start.getTime() + 60*60*1000)
    const toICS = (d) => d.toISOString().replace(/[-:]/g,"").split(".")[0]+"Z"
    const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Event Planner//EN
BEGIN:VEVENT
UID:${ev._id}@event-planner
DTSTAMP:${toICS(new Date())}
DTSTART:${toICS(start)}
DTEND:${toICS(end)}
SUMMARY:${escapeICS(ev.title)}
DESCRIPTION:${escapeICS(ev.description || "")}
LOCATION:${escapeICS(ev.venue || "")}
END:VEVENT
END:VCALENDAR`
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${ev.title.replace(/\s+/g,"_")}.ics`
    a.click()
    URL.revokeObjectURL(a.href)
    toast("Added to calendar 📅")
  }
  return (
    <button onClick={downloadICS} className={className} aria-label="Add to Calendar">
      📅 Add
    </button>
  )
}

function escapeICS(s){ return String(s).replace(/,|\n/g, (m)=> m === "\n" ? "\\n" : "\\,") }
