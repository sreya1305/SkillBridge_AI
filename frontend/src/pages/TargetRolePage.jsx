import { useState } from 'react'
import Navbar from '../components/Navbar'
import PageNav from '../components/PageNav'
import { getAllRoles, saveCustomRole, selectTargetRole } from '../lib/roleStorage'
import { generateRoleSkills } from '../services/roleSkillGenerator'

function splitSkills(value) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function TargetRolePage() {
  const [customRoleTitle, setCustomRoleTitle] = useState('')
  const [customRoleDescription, setCustomRoleDescription] = useState('')
  const [formError, setFormError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRole, setGeneratedRole] = useState(null)
  const [skillsForm, setSkillsForm] = useState({ critical: '', important: '', niceToHave: '' })

  const handleCreateRole = async (event) => {
    event.preventDefault()

    const title = customRoleTitle.trim()
    if (!title) {
      setFormError('Please enter your intended target role title.')
      return
    }

    setIsGenerating(true)
    setFormError('')

    try {
      // Check if role title matches an existing role in library
      const existingRoles = getAllRoles()
      const matchedRole = existingRoles.find(r => r.title.toLowerCase() === title.toLowerCase())

      if (matchedRole) {
        selectTargetRole(matchedRole.id)
        window.location.href = '/profile#target-role'
        return
      }

      // Generate skills for the new custom role
      const role = await generateRoleSkills(title)
      setGeneratedRole(role)
      setSkillsForm({
        critical: role.skills.critical.join('\n'),
        important: role.skills.important.join('\n'),
        niceToHave: role.skills.niceToHave.join('\n'),
      })
    } catch (error) {
      setFormError(error.message || 'Could not generate skills for custom role.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAndSetRole = () => {
    const title = customRoleTitle.trim()
    const skills = {
      critical: splitSkills(skillsForm.critical),
      important: splitSkills(skillsForm.important),
      niceToHave: splitSkills(skillsForm.niceToHave),
    }

    if (!title) {
      setFormError('Target role title is required.')
      return
    }

    const savedRole = saveCustomRole({
      title,
      description: customRoleDescription.trim() || `Target role requirements and expectations for ${title}.`,
      skills
    })

    if (savedRole) {
      selectTargetRole(savedRole.id)
      window.location.href = '/profile#target-role'
    }
  }

  return (
    <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
      <div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-12rem] top-1/3 -z-10 h-[600px] w-[600px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" />
      <div className="absolute left-[-12rem] bottom-20 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" />
      <Navbar />
      <section className="wrap py-16">
        <div className="mx-auto max-w-3xl">
          <PageNav backHref="/profile#target-role" backLabel="Back to Profile" />
          <div className="rounded-3xl border border-white/10 bg-[#0e1a34] p-8 sm:p-10 shadow-xl">
            <div className="mb-8">
              <p className="eyebrow text-mint">Custom target role</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-[-.04em] text-white sm:text-4xl">Add Your Intended Target Role</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">Enter any career position you want to target (e.g. <i>AI Engineer, Product Manager, Cloud Architect</i>). SkillBridge AI will automatically build the required skill set for you.</p>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Target Role Title *</label>
                <input
                  value={customRoleTitle}
                  onChange={(e) => setCustomRoleTitle(e.target.value)}
                  placeholder="e.g. AI Engineer, Mobile App Developer, Data Architect"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Role Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input
                  value={customRoleDescription}
                  onChange={(e) => setCustomRoleDescription(e.target.value)}
                  placeholder="e.g. Responsible for machine learning pipelines, LLM fine-tuning, and AI web services."
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
                />
              </div>

              {formError && <p role="alert" className="text-sm font-semibold text-red-400">{formError}</p>}

              {!generatedRole ? (
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full rounded-full bg-violet px-6 py-4 text-sm font-bold text-white shadow-glow hover:bg-violet/90 transition-all disabled:opacity-50"
                >
                  {isGenerating ? '⏳ Generating role requirements...' : 'Create & Select Target Role →'}
                </button>
              ) : (
                <div className="mt-6 rounded-2xl border border-mint/30 bg-mint/5 p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-bold text-mint">✓ Required skills generated for "{generatedRole.title}"</p>
                      <p className="text-xs text-slate-300 mt-1">Review the skill requirements below or save to confirm your target role.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveAndSetRole}
                      className="rounded-full bg-mint px-6 py-3 text-sm font-bold text-ink hover:bg-mint/90 transition-all shadow-glow"
                    >
                      Confirm & Set Target Role
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold text-red-400 mb-1">Critical Skills</label>
                      <textarea
                        value={skillsForm.critical}
                        onChange={(e) => setSkillsForm({ ...skillsForm, critical: e.target.value })}
                        rows="6"
                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-white outline-none focus:border-mint"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-amber-400 mb-1">Important Skills</label>
                      <textarea
                        value={skillsForm.important}
                        onChange={(e) => setSkillsForm({ ...skillsForm, important: e.target.value })}
                        rows="6"
                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-white outline-none focus:border-mint"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-mint mb-1">Nice to Have Skills</label>
                      <textarea
                        value={skillsForm.niceToHave}
                        onChange={(e) => setSkillsForm({ ...skillsForm, niceToHave: e.target.value })}
                        rows="6"
                        className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-white outline-none focus:border-mint"
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
