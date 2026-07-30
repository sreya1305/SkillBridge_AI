export default function BackButton({ href = '/', label = 'Back' }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all shadow-sm group"
    >
      <svg className="w-4 h-4 text-mint transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span>{label}</span>
    </a>
  )
}
