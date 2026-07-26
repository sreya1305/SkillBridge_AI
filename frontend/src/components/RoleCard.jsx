import { useState } from 'react'

export default function RoleCard({ role, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const criticalCount = role.skills.critical?.length ?? 0
  const importantCount = role.skills.important?.length ?? 0
  const niceToHaveCount = role.skills.niceToHave?.length ?? 0

  return <article className={`rounded-3xl border p-6 shadow-xl transition ${isSelected ? 'border-mint bg-mint/10 shadow-mint/10' : 'border-white/10 bg-[#0e1a34] hover:-translate-y-0.5 hover:border-white/20'}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xl font-bold text-white">{role.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">{role.description}</p>
      </div>
      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[.24em] text-mint">{criticalCount} critical</span>
    </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
        <p className="text-xs uppercase tracking-[.22em] text-slate-400">Critical</p>
        <p className="mt-2 font-semibold text-white">{criticalCount}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
        <p className="text-xs uppercase tracking-[.22em] text-slate-400">Important</p>
        <p className="mt-2 font-semibold text-white">{importantCount}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
        <p className="text-xs uppercase tracking-[.22em] text-slate-400">Nice to have</p>
        <p className="mt-2 font-semibold text-white">{niceToHaveCount}</p>
      </div>
    </div>

    <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
      {['Critical', 'Important', 'Nice to have'].map((label) => <span key={label} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">{label}</span>)}
    </div>

    {expanded && <div className="mt-5 space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
      <div>
        <p className="font-semibold text-mint">Critical skills</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">{role.skills.critical.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div>
        <p className="font-semibold text-violet-300">Important skills</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">{role.skills.important.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div>
        <p className="font-semibold text-slate-300">Nice to have</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">{role.skills.niceToHave.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </div>}

    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button type="button" onClick={() => setExpanded(!expanded)} className="text-sm font-semibold text-mint transition hover:text-mint/80">{expanded ? 'Hide details' : 'View more details'}</button>
      <button type="button" onClick={() => onSelect(role.id)} className={`rounded-full px-6 py-3 text-sm font-bold transition ${isSelected ? 'bg-mint text-ink hover:bg-mint/90' : 'bg-violet text-white hover:bg-violet/90'}`}>{isSelected ? '✓ Selected' : 'Select role'}</button>
    </div>
  </article>
}
