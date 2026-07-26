import { useState } from 'react'
import Navbar from '../components/Navbar'
import { getSkillGapAnalysis } from '../lib/skillGap'
import { getSelectedRole } from '../lib/roleStorage'
import { generateRoadmap } from '../services/roadmapGenerator'

export default function RoadmapPage() {
  const targetRoleId = typeof window !== 'undefined' ? window.localStorage.getItem('targetRoleId') : null
  const rawSkills = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('userSkills') || '[]') : []
  const selectedRole = typeof window !== 'undefined' ? getSelectedRole() : null
  const skillGap = typeof window !== 'undefined' ? getSkillGapAnalysis(rawSkills, selectedRole?.skills) : { matched: { critical: [], important: [], niceToHave: [] }, missing: { critical: [], important: [], niceToHave: [] }, matchedSkills: [], totalRequiredSkills: 0, matchedSkillCount: 0, matchPercentage: 0 }

  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setRoadmap(null)
    try {
      const result = await generateRoadmap({
        targetRole: selectedRole?.title || 'Target Role',
        currentSkills: rawSkills,
        missingSkills: skillGap.missing,
        matchedSkills: skillGap.matchedSkills,
      })
      setRoadmap(result)
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap')
    } finally {
      setLoading(false)
    }
  }

  const totalWeeks = roadmap?.estimatedTotalWeeks || 0

  return <main className="min-h-screen bg-[#f7f8fa] text-ink">
    <Navbar />
    <div className="wrap py-6">
      <a href="/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ink">← Back to profile</a>
    </div>
    <section className="wrap py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-violet">Learning plan</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-ink sm:text-5xl">Personalized AI roadmap</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Based on your target role, current skills, and the gap analysis, we can generate a structured roadmap with milestones, resources, and projects. Choose your target role in your profile first.</p>
              <p className="mt-2 text-sm text-slate-500">Selected role: <span className="font-semibold text-ink">{selectedRole?.title || 'None selected'}</span></p>
            </div>
            <div className="shrink-0">
              <button
                onClick={handleGenerate}
                disabled={loading || !selectedRole}
                className="rounded-full bg-violet px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-violet/90 disabled:opacity-60"
              >
                {loading ? 'Generating...' : 'Generate roadmap'}
              </button>
              {!selectedRole && <p className="mt-2 text-xs text-slate-500">Select a target role in your profile first.</p>}
            </div>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

        {roadmap && (
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">Summary</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">{roadmap.summary}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                <span>Estimated total:</span>
                <span className="text-violet">{totalWeeks} weeks</span>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">Milestones</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {roadmap.milestones?.length > 0 ? roadmap.milestones.map((milestone, idx) => <div key={idx} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{milestone.title}</p>
                    <span className="rounded-full bg-violet/10 px-2 py-1 text-xs font-bold text-violet">{milestone.estimatedWeeks} weeks</span>
                  </div>
                  <p className="mt-2 text-slate-600">{milestone.focus}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {milestone.skills?.map((skill) => <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">{skill}</span>)}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-700">Recommended Learning Resources</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
                      {milestone.resources?.map((r, rIdx) => {
                        const urlMatch = typeof r === 'string' ? r.match(/\((https?:\/\/[^\s)]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[^\s)]*|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\)/) : null
                        if (urlMatch) {
                          const rawUrl = urlMatch[1]
                          const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
                          const title = r.replace(/\s*\([^)]*\)/, '')
                          return (
                            <li key={rIdx}>
                              <span>{title}</span>{' '}
                              <a
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-violet hover:underline text-xs"
                              >
                                🔗 {rawUrl}
                              </a>
                            </li>
                          )
                        }
                        return <li key={rIdx}>{r}</li>
                      })}
                    </ul>
                  </div>
                  {milestone.projects?.length > 0 && <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-700">Projects</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600">
                      {milestone.projects.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  </div>}
                </div>) : <p className="text-sm text-slate-500">No milestones generated.</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </section>
  </main>
}