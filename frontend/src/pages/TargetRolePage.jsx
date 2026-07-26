import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import PageNav from '../components/PageNav'
import RoleCard from '../components/RoleCard'
import { getAllRoles, saveCustomRole, selectTargetRole } from '../lib/roleStorage'
import { generateRoleSkills } from '../services/roleSkillGenerator'

const normalize = (value) => String(value).toLowerCase()
const emptyCustomRole = {
  title: '',
  description: '',
  critical: '',
  important: '',
  niceToHave: '',
}

function splitSkills(value) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export default function TargetRolePage() {
  const [search, setSearch] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState(() => localStorage.getItem('targetRoleId') || '')
  const [customRole, setCustomRole] = useState(emptyCustomRole)
  const [allRoles, setAllRoles] = useState(() => getAllRoles())
  const [formError, setFormError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRole, setGeneratedRole] = useState(null)

  const filteredRoles = useMemo(() => {
    const term = normalize(search).trim()
    if (!term) return allRoles

    return allRoles.filter((role) => {
      const haystack = [role.title, role.description, ...role.skills.critical, ...role.skills.important, ...role.skills.niceToHave].join(' ')
      return normalize(haystack).includes(term)
    })
  }, [allRoles, search])

  const handleSelect = (roleId) => {
    selectTargetRole(roleId)
    setSelectedRoleId(roleId)
    window.location.href = '/skill-gap'
  }

  const handleGenerateRole = async (event) => {
    event.preventDefault()

    const title = customRole.title.trim()

    if (!title) {
      setFormError('Add a target role first.')
      return
    }

    setIsGenerating(true)
    setFormError('')

    try {
      const role = await generateRoleSkills(title)
      setGeneratedRole(role)
      setCustomRole({
        title: role.title,
        description: role.description,
        critical: role.skills.critical.join('\n'),
        important: role.skills.important.join('\n'),
        niceToHave: role.skills.niceToHave.join('\n'),
      })
    } catch (error) {
      setGeneratedRole(null)
      setFormError(`${error.message} Make sure the backend is running with AI_API_KEY.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveGeneratedRole = () => {
    const title = customRole.title.trim()
    const skills = {
      critical: splitSkills(customRole.critical),
      important: splitSkills(customRole.important),
      niceToHave: splitSkills(customRole.niceToHave),
    }
    const skillCount = skills.critical.length + skills.important.length + skills.niceToHave.length

    if (!title || skillCount === 0) {
      setFormError('Generate a role or keep at least one skill before saving.')
      return
    }

    const savedRole = saveCustomRole({ title, description: customRole.description, skills })
    if (!savedRole) return

    setAllRoles(getAllRoles())
    setSelectedRoleId(savedRole.id)
    setCustomRole(emptyCustomRole)
    setGeneratedRole(null)
    setFormError('')
    window.location.href = '/skill-gap'
  }

  return <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
    <div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px] pointer-events-none" />
    <div className="absolute right-[-12rem] top-1/3 -z-10 h-[600px] w-[600px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" />
    <div className="absolute left-[-12rem] bottom-20 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" />
    <Navbar />
    <section className="wrap py-16">
      <div className="mx-auto max-w-5xl">
        <PageNav backHref="/profile" backLabel="Back to Profile" />
        <div className="rounded-3xl border border-white/10 bg-[#0e1a34] p-10 shadow-xl">
          <div className="mb-8">
            <p className="eyebrow text-mint">Choose a target role</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-white sm:text-5xl">What career path do you want next?</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Search through the role library, review the required skill categories, and lock in one target role before closing your gap.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-200">Search roles</label>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by role, skill, or keyword" className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              <p className="font-semibold text-white">Available roles</p>
              <p className="mt-3 leading-6 text-slate-300">Choose from the role library or add your own target role with the skills you want to compare against.</p>
              <div className="mt-4 space-y-2 text-sm text-slate-400"><div><span className="font-semibold text-slate-200">Total roles:</span> {allRoles.length}</div><div><span className="font-semibold text-slate-200">Showing:</span> {filteredRoles.length}</div></div>
            </div>
          </div>

          <form onSubmit={handleGenerateRole} className="mt-8 rounded-3xl border border-dashed border-violet-500/40 bg-violet-950/20 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-white">Generate another target role</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Enter the role you want. SkillBridge AI will fetch the expected skills and prepare the gap categories.</p>
              </div>
              <button type="submit" disabled={isGenerating} className="rounded-full bg-violet px-6 py-3 text-sm font-bold text-white shadow-glow hover:bg-violet/90 transition-all disabled:cursor-not-allowed disabled:bg-slate-700">{isGenerating ? 'Generating...' : 'Generate skills'}</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_1.4fr]">
              <input value={customRole.title} onChange={(event) => setCustomRole({ ...customRole, title: event.target.value })} placeholder="Target role title" className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
              <input value={customRole.description} onChange={(event) => setCustomRole({ ...customRole, description: event.target.value })} placeholder="Short description" className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
            </div>
            {generatedRole && <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-white">Generated skills are ready. Review them, then save this role.</p>
                <button type="button" onClick={handleSaveGeneratedRole} className="rounded-full bg-mint px-5 py-3 text-sm font-bold text-ink hover:bg-mint/90 transition-all">Save and view gap</button>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                <textarea value={customRole.critical} onChange={(event) => setCustomRole({ ...customRole, critical: event.target.value })} placeholder="Critical skills" rows="7" className="resize-none rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
                <textarea value={customRole.important} onChange={(event) => setCustomRole({ ...customRole, important: event.target.value })} placeholder="Important skills" rows="7" className="resize-none rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
                <textarea value={customRole.niceToHave} onChange={(event) => setCustomRole({ ...customRole, niceToHave: event.target.value })} placeholder="Nice-to-have skills" rows="7" className="resize-none rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20" />
              </div>
            </div>}
            {formError && <p role="alert" className="mt-3 text-sm font-semibold text-red-400">{formError}</p>}
          </form>

          <div className="mt-10 grid gap-6">
            {filteredRoles.map((role) => <RoleCard key={role.id} role={role} isSelected={selectedRoleId === role.id} onSelect={handleSelect} />)}
            {filteredRoles.length === 0 && <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">No matching roles found. Try a different search term.</div>}
          </div>
        </div>
      </div>
    </section>
  </main>
}
