export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="text-center text-primary">
      <div className="inline-flex items-center gap-2">
        <span className="badge bg-secondary !bg-secondary">⏳</span>
        <span>{label}</span>
      </div>
    </div>
  )
}
