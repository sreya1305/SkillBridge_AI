import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import PageNav from '../components/PageNav'
import { getAllRoles, selectTargetRole } from '../lib/roleStorage'
import { parseResumeFile } from '../services/resumeParser'

const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const popularSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'SQL', 'AWS', 'Tailwind CSS', 'Docker', 'Git']
const inputClass = 'rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20'

export default function ProfilePage() {
  const [skill, setSkill] = useState('')
  const [level, setLevel] = useState('Intermediate')
  const [skills, setSkills] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = JSON.parse(window.localStorage.getItem('userSkills') || '[]')
      return Array.isArray(stored)
        ? stored.map((item) => typeof item === 'string' ? { name: item, level: 'Intermediate' } : item)
        : []
    } catch {
      return []
    }
  })

  const [allRoles, setAllRoles] = useState(() => getAllRoles())
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.localStorage.getItem('targetRoleId') || ''
  })
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const nav = performance.getEntriesByType('navigation')
        if (nav.length > 0 && nav[0].type === 'reload') {
          window.localStorage.removeItem('userSkills')
          window.localStorage.removeItem('targetRoleId')
          setSkills([])
          setSelectedRoleId('')
        }
      } catch {
        // ignore
      }
    }
  }, [])

  const addSkill = (skillName = skill, skillLevel = level) => {
    const name = skillName.trim()
    if (!name || skills.some((item) => item.name.toLowerCase() === name.toLowerCase())) return
    const updated = [...skills, { name, level: skillLevel }]
    setSkills(updated)
    setSkill('')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('userSkills', JSON.stringify(updated.map((s) => s.name)))
    }
  }

  const clearAllSkills = () => {
    setSkills([])
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('userSkills')
    }
  }

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index)
    setSkills(updated)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('userSkills', JSON.stringify(updated.map((s) => s.name)))
    }
  }

  const updateSkillLevel = (index, newLevel) => {
    const updated = skills.map((s, i) => i === index ? { ...s, level: newLevel } : s)
    setSkills(updated)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('userSkills', JSON.stringify(updated.map((s) => s.name)))
    }
  }

  const handleQuickAdd = (skillName) => {
    addSkill(skillName, 'Intermediate')
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rolesList = getAllRoles()
      setAllRoles(rolesList)
      const storedRoleId = window.localStorage.getItem('targetRoleId') || ''
      if (storedRoleId && !rolesList.some((r) => r.id === storedRoleId)) {
        window.localStorage.removeItem('targetRoleId')
        setSelectedRoleId('')
      } else {
        setSelectedRoleId(storedRoleId)
      }

      if (window.location.hash === '#target-role') {
        const el = document.getElementById('target-role')
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }, 150)
        }
      }
    }
  }, [])

  const handleContinue = () => {
    if (!selectedRoleId) {
      setNotice('Please select a target role before continuing.')
      return
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('userSkills', JSON.stringify(skills.map((s) => s.name)))
      window.localStorage.setItem('targetRoleId', selectedRoleId)
    }
    window.location.href = '/skill-gap'
  }

  return (
    <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
      <div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-10rem] top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" />
      <div className="absolute left-[-10rem] bottom-20 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" />
      <Navbar />

      <div className="wrap py-12 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <PageNav backHref="/" backLabel="Back to Home" />

          {/* Page Header */}
          <div>
            <p className="eyebrow text-mint">Skill Profile Setup</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em] text-white sm:text-5xl">
              Build your technical skill profile
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300 text-base sm:text-lg">
              Add your current skills manually or use our AI & OCR resume parser to instantly detect your skills. Select your target role to generate a personalized skill gap analysis.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleContinue() }} className="space-y-8">
            
            {/* AI Resume Upload Banner */}
            <section className="rounded-3xl border border-violet/30 bg-violet/15 p-6 sm:p-8 backdrop-blur-xl shadow-glow">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <p className="font-extrabold text-white text-lg sm:text-xl">Instant AI Resume Skill Extraction</p>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Upload your resume (PDF, DOCX, or Image) to automatically detect all your technical and soft skills in seconds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.localStorage.setItem('userSkills', JSON.stringify(skills.map(s => s.name)))
                    }
                    window.location.href = '/resume-parser'
                  }}
                  className="rounded-full bg-violet px-7 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-violet/90 transition-all shrink-0"
                >
                  Parse Resume with AI →
                </button>
              </div>
            </section>

            {/* Section 01: Skills */}
            <section className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint/20 text-xs font-black text-mint">01</span>
                  <h2 className="text-xl font-extrabold text-white">Your Technical & Soft Skills</h2>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Add skills one by one and select your confidence level, or click popular suggestions below.
                </p>
              </div>

              {/* Skill Input Form */}
              <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                <input
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                  placeholder="e.g. React, Python, Docker, SQL..."
                  className={inputClass}
                />
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={`${inputClass} bg-[#0e1a34] text-white cursor-pointer`}
                >
                  {levels.map((item) => (
                    <option key={item} value={item} className="bg-[#0e1a34] text-white py-1">
                      {item}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addSkill()}
                  className="rounded-xl bg-violet px-6 py-3 text-sm font-bold text-white shadow-glow hover:bg-violet/90 transition-all"
                >
                  + Add Skill
                </button>
              </div>

              {/* Popular Quick Suggestions */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Add Popular Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((pop) => {
                    const isAdded = skills.some(s => s.name.toLowerCase() === pop.toLowerCase())
                    return (
                      <button
                        key={pop}
                        type="button"
                        onClick={() => !isAdded && handleQuickAdd(pop)}
                        disabled={isAdded}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          isAdded
                            ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed opacity-50'
                            : 'bg-white/5 text-slate-300 border border-white/10 hover:border-mint/50 hover:text-mint'
                        }`}
                      >
                        {isAdded ? `✓ ${pop}` : `+ ${pop}`}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Active Skills List */}
              {skills.length > 0 ? (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Added Skills ({skills.length}):</p>
                    <button
                      type="button"
                      onClick={clearAllSkills}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear All Skills
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {skills.map((item, index) => (
                      <span
                        key={item.name}
                        className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-2 text-sm font-bold text-mint shadow-sm"
                      >
                        <span>{item.name}</span>
                        <select
                          value={item.level || 'Intermediate'}
                          onChange={(e) => updateSkillLevel(index, e.target.value)}
                          className="rounded-full bg-mint/20 px-2 py-0.5 text-xs font-semibold text-mint border-none outline-none cursor-pointer hover:bg-mint/30 transition-colors"
                        >
                          {levels.map((l) => (
                            <option key={l} value={l} className="bg-[#0e1a34] text-white">
                              {l}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-1 text-mint/60 hover:text-white transition-colors"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
                  <p className="text-sm text-slate-400">No skills added yet. Add a skill above or click quick suggestions!</p>
                </div>
              )}
            </section>

            {/* Section 02: Target Role */}
            <section id="target-role" className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 sm:p-8 shadow-xl space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint/20 text-xs font-black text-mint">02</span>
                  <h2 className="text-xl font-extrabold text-white">Target Career Role</h2>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Select the target role you are aiming for to calculate missing skills and roadmap steps.
                </p>
              </div>

              <div>
                <select
                  value={selectedRoleId}
                  onChange={(e) => {
                    setSelectedRoleId(e.target.value)
                    selectTargetRole(e.target.value)
                  }}
                  className={`${inputClass} w-full bg-[#0e1a34] text-white cursor-pointer text-base py-3.5`}
                >
                  <option value="" disabled hidden className="bg-[#0e1a34] text-slate-400 py-1">
                    -- Select your target career role --
                  </option>
                  {allRoles.map((role) => (
                    <option key={role.id} value={role.id} className="bg-[#0e1a34] text-white py-1">
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Role Card Preview */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-mint">Selected Target Role</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {selectedRoleId ? (allRoles.find((r) => r.id === selectedRoleId)?.title || 'Selected Role') : 'No target role selected yet'}
                    </p>
                  </div>
                  <a href="/target-role" className="text-xs font-bold text-mint hover:underline">
                    + Add Custom Role
                  </a>
                </div>
              </div>

              {!selectedRoleId && (
                <p className="text-xs font-semibold text-red-400">
                  ⚠️ Please select a target role to generate your Skill Gap Analysis.
                </p>
              )}
            </section>

            {notice && (
              <p role="status" className="rounded-xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm font-semibold text-mint">
                {notice}
              </p>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-col-reverse justify-between gap-4 pt-4 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-400">You can update your skills or target role anytime.</p>
              <button
                type="submit"
                className="rounded-full bg-mint px-8 py-4 text-base font-bold text-ink hover:bg-mint/90 transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
              >
                Generate Skill Gap Analysis →
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}