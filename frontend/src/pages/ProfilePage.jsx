import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import PageNav from '../components/PageNav'
import { getAllRoles, selectTargetRole } from '../lib/roleStorage'
import { parseResumeFile } from '../services/resumeParser'

const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const inputClass = 'rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20'

function Entries({ entries, onRemove }) {
  return entries.length ? <div className="mt-4 space-y-2">{entries.map((entry, index) => <div key={`${entry.title}-${index}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"><span><strong>{entry.title}</strong><span className="text-slate-400"> {entry.detail}</span></span><button type="button" onClick={() => onRemove(index)} className="text-xs font-bold text-slate-400 hover:text-red-400">Remove</button></div>)}</div> : null
}

export default function ProfilePage() {
  const [skill, setSkill] = useState('')
  const [level, setLevel] = useState('Intermediate')
  const [skills, setSkills] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(window.localStorage.getItem('userSkills') || '[]').map((name) => ({ name, level: 'Intermediate' }))
    } catch {
      return []
    }
  })
  const [education, setEducation] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(window.localStorage.getItem('userEducation') || '[]')
    } catch {
      return []
    }
  })
  const [experience, setExperience] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(window.localStorage.getItem('userExperience') || '[]')
    } catch {
      return []
    }
  })
  const [educationForm, setEducationForm] = useState({ degree: '', school: '' })
  const [experienceForm, setExperienceForm] = useState({ role: '', company: '' })
  const [allRoles] = useState(() => getAllRoles())
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    if (typeof window === 'undefined') return ''
    return window.localStorage.getItem('targetRoleId') || ''
  })
  const [resumeName, setResumeName] = useState('')
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [notice, setNotice] = useState('')
  const resumeRef = useRef(null)
  const degreeRef = useRef(null)
  const schoolRef = useRef(null)
  const roleRef = useRef(null)
  const companyRef = useRef(null)

  const addSkill = () => { const name = skill.trim(); if (!name || skills.some((item) => item.name.toLowerCase() === name.toLowerCase())) return; const updated = [...skills, { name, level }]; setSkills(updated); setSkill(''); if (typeof window !== 'undefined') window.localStorage.setItem('userSkills', JSON.stringify(updated.map(s => s.name))) }
  const addEducation = () => { const { degree, school } = educationForm; if (!degree.trim() || !school.trim()) return; const updated = [...education, { title: degree.trim(), detail: `at ${school.trim()}` }]; setEducation(updated); setEducationForm({ degree: '', school: '' }); if (typeof window !== 'undefined') window.localStorage.setItem('userEducation', JSON.stringify(updated)) }
  const addExperience = () => { const { role, company } = experienceForm; if (!role.trim() || !company.trim()) return; const updated = [...experience, { title: role.trim(), detail: `at ${company.trim()}` }]; setExperience(updated); setExperienceForm({ role: '', company: '' }); if (typeof window !== 'undefined') window.localStorage.setItem('userExperience', JSON.stringify(updated)) }
  const onEnter = (callback) => (event) => { if (event.key === 'Enter') { event.preventDefault(); callback() } }
  const onArrow = (targetRef, direction) => (event) => {
    if (event.key !== direction) return
    const { selectionStart, selectionEnd, value } = event.currentTarget
    const atBoundary = direction === 'ArrowRight' ? selectionStart === value.length && selectionEnd === value.length : selectionStart === 0 && selectionEnd === 0
    if (atBoundary) { event.preventDefault(); targetRef.current?.focus() }
  }
  const addKeyHandlers = (callback, targetRef, direction) => (event) => { onEnter(callback)(event); onArrow(targetRef, direction)(event) }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#target-role') {
      const el = document.getElementById('target-role')
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 150)
      }
    }
  }, [])

  const handleResumeUpload = async (file) => {
    if (!file) return
    setResumeName(file.name)
    setIsParsingResume(true)
    setNotice('Parsing resume with AI & OCR engine...')

    try {
      const result = await parseResumeFile(file)
      const data = result?.data || result
      const extractedSkills = Array.isArray(data?.skills) ? data.skills : []
      const extractedEdu = Array.isArray(data?.education) ? data.education : []
      const extractedExp = Array.isArray(data?.experience) ? data.experience : []

      let updatedSkills = skills
      if (extractedSkills.length > 0) {
        const existingNames = new Set(skills.map((s) => s.name.toLowerCase()))
        const newEntries = extractedSkills
          .filter((name) => typeof name === 'string' && !existingNames.has(name.toLowerCase()))
          .map((name) => ({ name, level: 'Intermediate' }))
        updatedSkills = [...skills, ...newEntries]
        setSkills(updatedSkills)
      }

      let updatedEdu = education
      if (extractedEdu.length > 0) {
        const formattedNewEdu = extractedEdu.map((e) => {
          const deg = e.degree || e.title || ''
          const sch = e.school || e.detail || ''
          const years = e.startYear && e.endYear ? ` (${e.startYear}-${e.endYear})` : ''
          return {
            title: deg || 'Education / Degree',
            detail: sch ? `at ${sch}${years}` : years
          }
        })
        updatedEdu = [...education, ...formattedNewEdu]
        setEducation(updatedEdu)
      }

      let updatedExp = experience
      if (extractedExp.length > 0) {
        const formattedNewExp = extractedExp.map((e) => {
          const roleTitle = e.title || e.role || ''
          const companyName = e.company || e.detail || ''
          const desc = e.description && e.description !== roleTitle ? ` - ${e.description}` : ''
          return {
            title: roleTitle || 'Experience / Role',
            detail: companyName ? `at ${companyName}${desc}` : desc
          }
        })
        updatedExp = [...experience, ...formattedNewExp]
        setExperience(updatedExp)
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userSkills', JSON.stringify(updatedSkills.map((s) => s.name)))
        window.localStorage.setItem('userEducation', JSON.stringify(updatedEdu))
        window.localStorage.setItem('userExperience', JSON.stringify(updatedExp))
      }

      setNotice(`✓ Resume parsed! Extracted ${extractedSkills.length} skills, ${extractedEdu.length} education, and ${extractedExp.length} experience entries!`)
    } catch (err) {
      setNotice(`Uploaded ${file.name}. (${err.message || 'Auto-parsing completed'})`)
    } finally {
      setIsParsingResume(false)
    }
  }

  const handleContinue = () => {
    if (!selectedRoleId) {
      setNotice('Please select a target role before continuing.')
      return
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('userSkills', JSON.stringify(skills.map((s) => s.name)))
      window.localStorage.setItem('userEducation', JSON.stringify(education))
      window.localStorage.setItem('userExperience', JSON.stringify(experience))
      window.localStorage.setItem('targetRoleId', selectedRoleId)
    }
    window.location.href = '/skill-gap'
  }

  return <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
    <div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px] pointer-events-none" />
    <div className="absolute right-[-10rem] top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" />
    <div className="absolute left-[-10rem] bottom-20 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" />
    <Navbar />
    <div className="wrap py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <PageNav backHref="/" backLabel="Back to Home" />
        <div className="mb-10"><p className="eyebrow text-mint">Build your profile</p><h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em] text-white sm:text-4xl">Tell us about the experience you bring.</h1><p className="mt-4 max-w-2xl leading-7 text-slate-300">Add skills manually or upload a resume / picture document (PDF, DOCX, PNG, JPG, WEBP) to auto-extract your skills using AI.</p></div>
      <form onSubmit={(event) => { event.preventDefault(); handleContinue() }} className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-[#0e1a34] p-6 sm:p-8 shadow-xl"><h2 className="text-xl font-extrabold text-white">01 Your skills</h2><p className="mt-1 text-sm text-slate-400">Add a skill, then choose how confident you feel using it.</p><div className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px_auto]"><input value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={onEnter(addSkill)} placeholder="e.g. React, Excel, project management" className={inputClass} /><select value={level} onChange={(e) => setLevel(e.target.value)} className={`${inputClass} bg-[#0e1a34] text-white cursor-pointer`}>{levels.map((item) => <option key={item} value={item} className="bg-[#0e1a34] text-white py-1">{item}</option>)}</select><button type="button" onClick={addSkill} className="rounded-xl bg-violet px-5 py-3 text-sm font-bold text-white shadow-glow hover:bg-violet/90 transition-all">Add skill</button></div>{skills.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{skills.map((item, index) => <span key={item.name} className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-2 text-sm font-bold text-mint">{item.name}<small className="text-slate-300">({item.level})</small><button type="button" onClick={() => setSkills(skills.filter((_, i) => i !== index))} className="hover:text-white">x</button></span>)}</div>}</section>
        <section className="rounded-2xl border border-white/10 bg-[#0e1a34] p-6 sm:p-8 shadow-xl"><h2 className="text-xl font-extrabold text-white">02 Education</h2><p className="mt-1 text-sm text-slate-400">Add your degree, certification, or relevant education.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><input ref={degreeRef} value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} onKeyDown={addKeyHandlers(addEducation, schoolRef, 'ArrowRight')} placeholder="Degree or qualification" className={inputClass} /><input ref={schoolRef} value={educationForm.school} onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })} onKeyDown={addKeyHandlers(addEducation, degreeRef, 'ArrowLeft')} placeholder="School or institution" className={inputClass} /></div><button type="button" onClick={addEducation} className="mt-3 text-sm font-bold text-mint hover:text-mint/80 transition-colors">+ Add education</button><Entries entries={education} onRemove={(index) => setEducation(education.filter((_, i) => i !== index))} /></section>
        <section className="rounded-2xl border border-white/10 bg-[#0e1a34] p-6 sm:p-8 shadow-xl"><h2 className="text-xl font-extrabold text-white">03 Experience</h2><p className="mt-1 text-sm text-slate-400">Add relevant work, internship, freelance, or volunteer experience.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><input ref={roleRef} value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} onKeyDown={addKeyHandlers(addExperience, companyRef, 'ArrowRight')} placeholder="Role or position" className={inputClass} /><input ref={companyRef} value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} onKeyDown={addKeyHandlers(addExperience, roleRef, 'ArrowLeft')} placeholder="Company or organisation" className={inputClass} /></div><button type="button" onClick={addExperience} className="mt-3 text-sm font-bold text-mint hover:text-mint/80 transition-colors">+ Add experience</button><Entries entries={experience} onRemove={(index) => setExperience(experience.filter((_, i) => i !== index))} /></section>
        <section id="target-role" className="rounded-2xl border border-white/10 bg-[#0e1a34] p-6 sm:p-8 shadow-xl"><h2 className="text-xl font-extrabold text-white">04 Target role</h2><p className="mt-1 text-sm text-slate-400">Choose the role you want to compare against your current skills.</p><div className="mt-6"><select value={selectedRoleId} onChange={(e) => { setSelectedRoleId(e.target.value); selectTargetRole(e.target.value) }} className={`${inputClass} w-full bg-[#0e1a34] text-white cursor-pointer`}><option value="" disabled hidden className="bg-[#0e1a34] text-slate-400 py-1">Select a role</option>{allRoles.map((role) => <option key={role.id} value={role.id} className="bg-[#0e1a34] text-white py-1">{role.title}</option>)}</select></div><div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"><p className="font-semibold text-white">Selected role</p><p className="mt-2 text-sm">{selectedRoleId ? (allRoles.find((r) => r.id === selectedRoleId)?.title || 'Select a role') : 'No target role selected yet'}</p><a href="/target-role" className="mt-3 inline-block text-sm font-bold text-mint hover:text-mint/80 transition-colors">Add a custom target role</a></div>{!selectedRoleId && <p className="mt-2 text-xs font-semibold text-red-400">Please select a target role before continuing.</p>}</section>
        <section className="rounded-2xl border border-dashed border-violet-500/40 bg-violet-950/20 p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="font-bold text-white">Or upload your resume file / picture</p><p className="mt-1 text-sm text-slate-300">PDF, DOCX, PNG, JPG, WEBP (up to 10 MB). AI & OCR will automatically extract your skills!</p>{resumeName && <p className="mt-2 text-sm font-semibold text-mint">{isParsingResume ? '⏳ Extracting skills...' : `Selected: ${resumeName}`}</p>}</div><input ref={resumeRef} type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,image/*" onChange={(e) => handleResumeUpload(e.target.files?.[0])} className="hidden" /><button type="button" disabled={isParsingResume} onClick={() => resumeRef.current?.click()} className="rounded-xl border border-violet bg-violet/20 px-5 py-3 text-sm font-bold text-violet-200 hover:bg-violet/30 transition-all disabled:opacity-50">{isParsingResume ? 'Parsing...' : 'Choose file'}</button></div></section>
        {notice && <p role="status" className="rounded-xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm font-semibold text-mint">{notice}</p>}<div className="flex flex-col-reverse justify-between gap-4 pt-2 sm:flex-row sm:items-center"><p className="text-sm text-slate-400">You can update this information later.</p><button type="submit" className="rounded-full bg-violet px-6 py-3 text-sm font-bold text-white shadow-glow hover:bg-violet/90 transition-all">Continue to skill gap</button></div>
      </form>
    </div>
  </div>
</main>
}