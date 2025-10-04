export default function GlassCard({ className = "", children }) {
  return (
    <div
      className={[
        "relative overflow-hidden",                // ⬅️ added
        "rounded-2xl border border-white/10",
        "bg-[--panel]/95 backdrop-blur-md",
        "shadow-[0_6px_24px_rgba(0,0,0,.35)]",
        "transition-colors duration-200 hover:border-white/20",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  )
}
