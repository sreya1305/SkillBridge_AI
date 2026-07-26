function clearProfileSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('userSkills')
    window.localStorage.removeItem('userEducation')
    window.localStorage.removeItem('userExperience')
    window.localStorage.removeItem('targetRoleId')
    window.localStorage.removeItem('customRole')
  }
}

export default function PageNav({ backHref = '/', backLabel = 'Back' }) {
  const handleHomeClick = () => {
    clearProfileSession()
  }

  const handleBackClick = () => {
    if (backHref === '/') {
      clearProfileSession()
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <a
        href={backHref}
        onClick={handleBackClick}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all shadow-sm group"
      >
        <svg className="w-4 h-4 text-mint transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>{backLabel}</span>
      </a>

      <a
        href="/"
        onClick={handleHomeClick}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all shadow-sm group"
      >
        <span>Home</span>
        <svg className="w-4 h-4 text-mint transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </a>
    </div>
  )
}
