export default function StatMetric({ title, value, delta, tone = "violet", note, className = "" }) {
  const toneMap = {
    violet: { bar: "from-[#E9B3FB66] to-[#6F00FF66]", chip: "text-[#E9B3FB]" },
    cyan:   { bar: "from-[#A8F3FF66] to-[#3EC6D766]", chip: "text-[#A8F3FF]" },
    rose:   { bar: "from-[#FFC4D666] to-[#FF7B9E66]", chip: "text-[#FFD1DD]" },
    neutral:{ bar: "from-white/20 to-transparent",     chip: "text-white/70" },
  }
  const c = toneMap[tone] || toneMap.violet

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,.35)] hover:border-white/20 transition ${className}`}>
      {/* inside stripe (clipped by border radius) */}
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${c.bar}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm text-white/70">{title}</div>
          {delta && <span className={`text-xs font-semibold ${c.chip}`}>{delta}</span>}
        </div>
        <div className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</div>
        {note && <div className="mt-1 text-xs text-white/60">{note}</div>}
      </div>
    </div>
  )
}
