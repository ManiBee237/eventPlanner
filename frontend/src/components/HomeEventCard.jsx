import { Link } from "react-router-dom"

/** Calm, premium event card (no Tailwind config needed) */
export default function HomeEventCard({ ev }) {
  const id = ev?._id || ev?.id

  return (
    <article
      className="
        relative overflow-hidden                   /* clip stripe/glow */
        rounded-2xl border border-white/10
        bg-[rgba(255,255,255,0.03)] backdrop-blur-md
        shadow-[0_6px_24px_rgba(0,0,0,0.35)]
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.48)]
      "
    >
      {/* header stripe (inside, matches radius) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB66] via-[#6F00FF66] to-transparent" />

      {/* subtle corner glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#E9B3FB33] to-transparent blur-2xl" />

      <div className="p-5">
        {/* title + pill */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-semibold leading-snug text-white">
            {ev.title}
          </h3>
          {ev.category && (
            <span className="shrink-0 rounded-md bg-white/10 px-2 py-0.5 text-xs font-semibold text-[#E9B3FB] border border-white/15">
              {ev.category}
            </span>
          )}
        </div>

        {/* description */}
        {ev.description && (
          <p className="mt-2 line-clamp-3 text-sm text-white/70">
            {ev.description}
          </p>
        )}

        {/* meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
          <span className="inline-flex items-center gap-1">
            <span>📅</span>
            {new Date(ev.date).toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <span>📍</span>
            {ev.venue}
          </span>
        </div>

        {/* tags */}
        {!!(ev.tags && ev.tags.length) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ev.tags.slice(0, 4).map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70"
              >
                #{t}
              </span>
            ))}
            {ev.tags.length > 4 && (
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70">
                +{ev.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* actions */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={id ? `/events/${id}` : "/events"}   /* ✅ use safe id */
            className="
              inline-flex items-center justify-center rounded-lg
              bg-white/10 px-3 py-1.5 text-sm font-semibold text-white
              border border-white/15
              hover:bg-white/15 hover:border-white/25 transition
            "
          >
            Details
          </Link>

          <Link
            to={id ? `/register?event=${id}` : "/register"}
            className="
              inline-flex items-center justify-center rounded-lg
              bg-gradient-to-r from-[#6F00FF] to-[#8B5CF6]
              px-3 py-1.5 text-sm font-semibold text-white
              shadow-[0_6px_20px_rgba(111,0,255,0.35)]
              hover:brightness-110 transition
            "
          >
            Register
          </Link>
        </div>
      </div>
    </article>
  )
}

/** Skeleton loader to match the new card */
export function HomeEventCardSkeleton() {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        border border-white/10 bg-white/5 backdrop-blur-md p-5 animate-pulse
      "
    >
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB33] to-transparent" />
      <div className="h-4 w-2/3 rounded bg-white/10" />
      <div className="mt-2 h-4 w-4/5 rounded bg-white/10" />
      <div className="mt-5 flex gap-2">
        <div className="h-8 w-24 rounded-lg bg-white/10" />
        <div className="h-8 w-24 rounded-lg bg-white/10" />
      </div>
    </div>
  )
}
