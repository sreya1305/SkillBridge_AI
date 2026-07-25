import { useMemo } from 'react'
import Navbar from '../components/Navbar'
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

  return <main className="min-h-screen bg-[#f7f8fa] text-ink">
    <Navbar />
    <section className="wrap py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-violet">Skill gap dashboard</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-ink sm:text-5xl">Your match against the target role</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Review what you already know and where to focus next. This is a deterministic comparison using your current skills and the selected role requirements.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Selected role</p>
              <p className="mt-2 text-lg font-bold text-ink">{selectedRole?.title || 'No role selected'}</p>
              <p className="mt-2 text-sm text-slate-500">{selectedRole?.description || 'Choose or add a target role to see your gap.'}</p>
              <p className="mt-4 text-xs uppercase tracking-[.2em] text-slate-500">role id</p>
              <p className="mt-1 text-sm text-slate-700">{targetRoleId || 'none selected'}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-slate-500">Match summary</p>
              <p className="mt-4 text-5xl font-extrabold text-ink">{skillGap.matchPercentage}%</p>
              <p className="mt-2 text-sm text-slate-600">{skillGap.matchedSkillCount} of {skillGap.totalRequiredSkills} required skills matched</p>
            </div>
            <div className="space-y-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
              <div><span className="font-semibold">Matched skills</span><p className="mt-2 text-xs text-slate-500">Skills already present in your profile.</p></div>
              <div className="grid gap-2">
                {skillGap.matchedSkills.length > 0 ? skillGap.matchedSkills.map((skill) => <span key={skill} className="rounded-full bg-white px-3 py-2 text-sm text-slate-700">{skill}</span>) : <p className="text-slate-500">No matched skills yet.</p>}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {(['critical', 'important', 'niceToHave']).map((category) => {
              const { title, tone } = categoryLabels[category]
              const missing = skillGap.missingSkills[category]
              const total = missing.length + (skillGap.matched[category]?.length || 0)
              const matched = skillGap.matched[category]?.length || 0

              return <section key={category} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{title} skills</p>
                    <p className="mt-1 text-xs uppercase tracking-[.2em] text-slate-500">{matched} / {total} matched</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{title}</span>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">Missing</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      {missing.length > 0 ? missing.map((skill) => <div key={skill} className="rounded-2xl bg-white px-3 py-2 shadow-sm">{skill}</div>) : <div className="rounded-2xl bg-white px-3 py-2 text-slate-500">None</div>}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">Matched</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      {skillGap.matched[category]?.length > 0 ? skillGap.matched[category].map((skill) => <div key={skill} className="rounded-2xl bg-white px-3 py-2 shadow-sm">{skill}</div>) : <div className="rounded-2xl bg-white px-3 py-2 text-slate-500">None</div>}
                    </div>
                  </div>
                </div>
              </section>
            })}
          </div>
        </div>
        <div className="mt-6">
          <a href="/roadmap" className="rounded-full bg-violet px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-violet/90">Generate roadmap</a>
        </div>
      </div>
    </section>
  </main>
}
