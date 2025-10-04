import GlassCard from "../components/GlassCard"
export default function RightHint(){
  return (
    <GlassCard className="relative overflow-hidden p-6">
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-[#E9B3FB33] to-transparent" />
      <h2 className="text-xl font-semibold text-white">Select an event</h2>
      <p className="mt-2 text-white/70">Pick an event from the left to view full details here.</p>
    </GlassCard>
  )
}
