import { useMemo } from 'react'
import Navbar from '../components/Navbar'
import PageNav from '../components/PageNav'
import { getSkillGapAnalysis } from '../lib/skillGap'
import { getSelectedRole } from '../lib/roleStorage'

const categoryLabels = {
  critical: { title: 'Critical', tone: 'bg-red-100 text-red-700' },
  important: { title: 'Important', tone: 'bg-amber-100 text-amber-700' },
  niceToHave: { title: 'Nice to have', tone: 'bg-slate-100 text-slate-700' },
}

export default function SkillGapPage() {
  const targetRoleId = typeof window !== 'undefined' ? window.localStorage.getItem('targetRoleId') : null
  const userSkills = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('userSkills') || '[]') : []
  const selectedRole = useMemo(() => getSelectedRole(), [targetRoleId])
  const skillGap = useMemo(() => getSkillGapAnalysis(userSkills, selectedRole?.skills), [userSkills, selectedRole])

  return <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
    <div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px] pointer-events-none" />
    <div className="absolute right-[-10rem] top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" />
    <div className="absolute left-[-10rem] bottom-10 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" />
    <Navbar />
    <section className="wrap py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <PageNav backHref="/profile" backLabel="Back to Profile" />
        <div className="rounded-3xl border border-white/10 bg-[#0e1a34] p-10 shadow-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-mint">Skill gap dashboard</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-white sm:text-5xl">Your match against the target role</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Review what you already know and where to focus next. This is a deterministic comparison using your current skills and the selected role requirements.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              <p className="font-semibold text-white">Selected role</p>
              <p className="mt-2 text-lg font-bold text-mint">{selectedRole?.title || 'Select a role'}</p>
              <p className="mt-2 text-sm text-slate-400">{selectedRole?.description || 'Choose or add a target role to see your gap analysis.'}</p>
              <p className="mt-4 text-xs uppercase tracking-[.2em] text-slate-500">role id</p>
              <p className="mt-1 text-sm text-slate-300">{targetRoleId || 'none selected'}</p>
            </div>
          </div>
        </div>

        {!selectedRole && (
          <div className="rounded-3xl border border-dashed border-amber-500/40 bg-amber-950/20 p-6 text-amber-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white text-base">No Target Role Selected</p>
                <p className="mt-1 text-sm text-slate-300">Please select a target role to compare against your current profile skills.</p>
              </div>
              <a href="/target-role" className="inline-block shrink-0 rounded-full bg-mint px-5 py-2.5 text-sm font-bold text-ink hover:bg-mint/90 transition-all">
                Select a Role →
              </a>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 rounded-3xl border border-white/10 bg-[#0e1a34] p-6 shadow-xl">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-slate-400">Match summary</p>
              <p className="mt-4 text-5xl font-extrabold text-mint">{skillGap.matchPercentage}%</p>
              <p className="mt-2 text-sm text-slate-300">{skillGap.matchedSkillCount} of {skillGap.totalRequiredSkills} required skills matched</p>
            </div>
            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <div><span className="font-semibold text-white">Matched skills</span><p className="mt-2 text-xs text-slate-400">Skills already present in your profile.</p></div>
              <div className="grid gap-2">
                {skillGap.matchedSkills.length > 0 ? skillGap.matchedSkills.map((skill) => <span key={skill} className="rounded-full bg-white/10 border border-white/10 px-3 py-2 text-sm font-medium text-white">{skill}</span>) : <p className="text-slate-400">No matched skills yet.</p>}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {(['critical', 'important', 'niceToHave']).map((category) => {
              const { title, tone } = categoryLabels[category]
              const missing = skillGap.missingSkills[category]
              const total = missing.length + (skillGap.matched[category]?.length || 0)
              const matched = skillGap.matched[category]?.length || 0

              return <section key={category} className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{title} skills</p>
                    <p className="mt-1 text-xs uppercase tracking-[.2em] text-slate-400">{matched} / {total} matched</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{title}</span>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-red-300">Missing</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-200">
                      {missing.length > 0 ? missing.map((skill) => <div key={skill} className="rounded-2xl border border-red-500/30 bg-red-950/20 px-3 py-2 shadow-sm text-red-200">{skill}</div>) : <div className="rounded-2xl bg-white/5 px-3 py-2 text-slate-400">None</div>}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-emerald-300">Matched</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-200">
                      {skillGap.matched[category]?.length > 0 ? skillGap.matched[category].map((skill) => <div key={skill} className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 shadow-sm text-emerald-200">{skill}</div>) : <div className="rounded-2xl bg-white/5 px-3 py-2 text-slate-400">None</div>}
                    </div>
                  </div>
                </div>
              </section>
            })}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <a href="/roadmap" className="rounded-full bg-violet px-8 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-violet/90 transition-all">Generate roadmap →</a>
        </div>
      </div>
    </section>
  </main>
}
