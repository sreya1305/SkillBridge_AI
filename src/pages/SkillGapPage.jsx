import Navbar from '../components/Navbar'

export default function SkillGapPage() {
  const selectedRoleId = typeof window !== 'undefined' ? window.localStorage.getItem('targetRoleId') : null

  return <main className="min-h-screen bg-[#f7f8fa] text-ink">
    <Navbar />
    <section className="wrap py-16">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="eyebrow text-violet">Skill gap analysis</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-ink sm:text-5xl">Target role selected</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">The selected role ID is saved. Skill gap analysis will be available on this page once the comparison engine is implemented.</p>
        <div className="mt-8 rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
          <p><span className="font-semibold">Selected role ID:</span> {selectedRoleId || 'None'}</p>
        </div>
      </div>
    </section>
  </main>
}
