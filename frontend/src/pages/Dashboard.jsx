import GlassCard from "../components/GlassCard"
import StatMetric from "../components/StatMetric"

export default function Dashboard(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          {label:"Total Events", value:24},
          {label:"Registrations", value:112},
          {label:"Active Users", value:56}
        ].map((k,i)=>(
          <GlassCard key={i} className="p-5 text-center hover:bg-[--panel]/90">
            <div className="text-[--muted] text-sm">{k.label}</div>
            <div className="mt-2 text-3xl font-bold text-[--text]">{k.value}</div>
          </GlassCard>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatMetric title="Total Events" value={totalEvents} tone="violet" note="Active listings" />
  <StatMetric title="Registrations" value={totalRegs} tone="cyan" delta={totalRegs ? "+live" : ""} note="All-time" />
  <StatMetric title="Today" value={todaysRegs} tone="rose" note="New registrations" />
  <StatMetric title="Capacity Used" value={`${capacityUsed}%`} tone="neutral" note="Across all events" />
</div>

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold text-[--text] mb-3">Recent Registrations</h2>
        <ul className="divide-y divide-[--border] text-[--muted] text-sm">
          <li className="py-2 flex justify-between"><span>John Doe</span><span>Workshop A</span></li>
          <li className="py-2 flex justify-between"><span>Mary K</span><span>Tech Fest</span></li>
          <li className="py-2 flex justify-between"><span>Alex S</span><span>AI Seminar</span></li>
        </ul>
      </GlassCard>
    </div>
  )
}
