import { useState } from 'react'

export default function TagInput({ value = [], onChange, placeholder='Add interests (press Enter)' }) {
  const [text, setText] = useState('')

  function addTag(t) {
    const tag = t.trim()
    if(!tag) return
    const next = Array.from(new Set([...(value||[]), tag]))
    onChange?.(next)
    setText('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(value||[]).map((t, i) => (
          <span key={i} className="badge bg-primary !bg-primary">
            {t}
            <button
              type="button"
              onClick={() => onChange?.(value.filter(v=>v!==t))}
              className="ml-2 text-white/90"
              aria-label={`remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className="input mt-2"
        value={text}
        placeholder={placeholder}
        onChange={e=>setText(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); addTag(text) } }}
      />
    </div>
  )
}
