import { useEffect, useRef, useState } from 'react'
import { getAllRoles, selectTargetRole } from '../lib/roleStorage'

const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const inputClass = 'rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15'

function Entries({ entries, onRemove }) {
  return entries.length ? <div className="mt-4 space-y-2">{entries.map((entry, index) => <div key={`${entry.title}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"><span><strong>{entry.title}</strong><span className="text-slate-500"> {entry.detail}</span></span><button type="button" onClick={() => onRemove(index)} className="text-xs font-bold text-slate-500 hover:text-red-600">Remove</button></div>)}</div> : null
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
  const [education, setEducation] = useState([])
  const [experience, setExperience] = useState([])
  const [educationForm, setEducationForm] = useState({ degree: '', school: '' })
  const [experienceForm, setExperienceForm] = useState({ role: '', company: '' })
  const [allRoles] = useState(() => getAllRoles())
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    if (typeof window === 'undefined') return ''
    window.localStorage.removeItem('userSkills')
    window.localStorage.removeItem('targetRoleId')
    return ''
  })
  const [resumeName, setResumeName] = useState('')
  const [notice, setNotice] = useState('')
  const resumeRef = useRef(null)
  const degreeRef = useRef(null)
  const schoolRef = useRef(null)
  const roleRef = useRef(null)
  const companyRef = useRef(null)

  const addSkill = () => { const name = skill.trim(); if (!name || skills.some((item) => item.name.toLowerCase() === name.toLowerCase())) return; setSkills([...skills, { name, level }]); setSkill('') }
  const addEducation = () => { const { degree, school } = educationForm; if (!degree.trim() || !school.trim()) return; setEducation([...education, { title: degree.trim(), detail: `at ${school.trim()}` }]); setEducationForm({ degree: '', school: '' }) }
  const addExperience = () => { const { role, company } = experienceForm; if (!role.trim() || !company.trim()) return; setExperience([...experience, { title: role.trim(), detail: `at ${company.trim()}` }]); setExperienceForm({ role, company: '' }) }
  const onEnter = (callback) => (event) => { if (event.key === 'Enter') { event.preventDefault(); callback() } }
  const onArrow = (targetRef, direction) => (event) => {
    if (event.key !== direction) return
    const { selectionStart, selectionEnd, value } = event.currentTarget
    const atBoundary = direction === 'ArrowRight' ? selectionStart === value.length && selectionEnd === value.length : selectionStart === 0 && selectionEnd === 0
    if (atBoundary) { event.preventDefault(); targetRef.current?.focus() }
  }
  const addKeyHandlers = (callback, targetRef, direction) => (event) => { onEnter(callback)(event); onArrow(targetRef, direction)(event) }

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem('userSkills')
    window.localStorage.removeItem('targetRoleId')
  }, [])

  const handleContinue = () => {
    if (!selectedRoleId) {
      setNotice('Please select a target role before continuing.')
      return
    }
    window.location.href = '/skill-gap'
  }

  return <main className="min-h-screen bg-[#f7f8fa] text-ink">
    <header className="border-b border-slate-200 bg-white"><nav className="wrap flex h-20 items-center justify-between"><a href="/" className="flex items-center gap-2.5 font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-mint text-ink">*</span>SkillBridge <span className="-ml-2 text-mint">AI</span></a><a href="/" className="text-sm font-bold text-slate-500 hover:text-ink">Back to home</a></nav></header>
    <div className="wrap py-12 sm:py-16"><div className="mx-auto max-w-4xl"><div className="mb-10"><p className="eyebrow text-violet">Step 1 of 4 - Build your profile</p><h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Tell us about the experience you bring.</h1><p className="mt-4 max-w-2xl leading-7 text-slate-600">Start manually, or upload a resume to keep a reference handy. We will not parse or send any file in this version.</p></div>
      <form onSubmit={(event) => { event.preventDefault(); handleContinue() }} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-extrabold">01 Your skills</h2><p className="mt-1 text-sm text-slate-500">Add a skill, then choose how confident you feel using it.</p><div className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px_auto]"><input value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={onEnter(addSkill)} placeholder="e.g. React, Excel, project management" className={inputClass} /><select value={level} onChange={(e) => setLevel(e.target.value)} className={`${inputClass} bg-white`}>{levels.map((item) => <option key={item}>{item}</option>)}</select><button type="button" onClick={addSkill} className="rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white">Add skill</button></div>{skills.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{skills.map((item, index) => <span key={item.name} className="inline-flex items-center gap-2 rounded-full bg-[#eeedff] px-3 py-2 text-sm font-bold text-[#5147cb]">{item.name}<small>{item.level}</small><button type="button" onClick={() => setSkills(skills.filter((_, i) => i !== index))}>x</button></span>)}</div>}</section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-extrabold">02 Education</h2><p className="mt-1 text-sm text-slate-500">Add your degree, certification, or relevant education.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><input ref={degreeRef} value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} onKeyDown={addKeyHandlers(addEducation, schoolRef, 'ArrowRight')} placeholder="Degree or qualification" className={inputClass} /><input ref={schoolRef} value={educationForm.school} onChange={(e) => setEducationForm({ ...educationForm, school: e.target.value })} onKeyDown={addKeyHandlers(addEducation, degreeRef, 'ArrowLeft')} placeholder="School or institution" className={inputClass} /></div><button type="button" onClick={addEducation} className="mt-3 text-sm font-bold text-violet">+ Add education</button><Entries entries={education} onRemove={(index) => setEducation(education.filter((_, i) => i !== index))} /></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-extrabold">03 Experience</h2><p className="mt-1 text-sm text-slate-500">Add relevant work, internship, freelance, or volunteer experience.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><input ref={roleRef} value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} onKeyDown={addKeyHandlers(addExperience, companyRef, 'ArrowRight')} placeholder="Role or position" className={inputClass} /><input ref={companyRef} value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} onKeyDown={addKeyHandlers(addExperience, roleRef, 'ArrowLeft')} placeholder="Company or organisation" className={inputClass} /></div><button type="button" onClick={addExperience} className="mt-3 text-sm font-bold text-violet">+ Add experience</button><Entries entries={experience} onRemove={(index) => setExperience(experience.filter((_, i) => i !== index))} /></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-xl font-extrabold">04 Target role</h2><p className="mt-1 text-sm text-slate-500">Choose the role you want to compare against your current skills.</p><div className="mt-6"><select value={selectedRoleId} onChange={(e) => { setSelectedRoleId(e.target.value); selectTargetRole(e.target.value) }} className={`${inputClass} w-full bg-white`}><option value="">Select a role</option>{allRoles.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}</select></div><div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-semibold">Selected role</p><p className="mt-2 text-sm">{selectedRoleId ? allRoles.find((r) => r.id === selectedRoleId)?.title : 'No role selected'}</p><a href="/target-role" className="mt-3 inline-block text-sm font-bold text-violet">Add a custom target role</a></div>{!selectedRoleId && <p className="mt-2 text-xs text-red-600">Please select a target role before continuing.</p>}</section>
        <section className="rounded-2xl border border-dashed border-violet/40 bg-[#f9f8ff] p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="font-bold">Or upload your resume</p><p className="mt-1 text-sm text-slate-500">PDF or DOCX, up to 10 MB. Upload is visual only - AI parsing is not enabled.</p>{resumeName && <p className="mt-2 text-sm font-semibold text-[#5147cb]">Selected: {resumeName}</p>}</div><input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeName(e.target.files?.[0]?.name || '')} className="hidden" /><button type="button" onClick={() => resumeRef.current?.click()} className="rounded-xl border border-violet bg-white px-5 py-3 text-sm font-bold text-violet">Choose file</button></div></section>
        {notice && <p role="status" className="rounded-xl bg-mint/50 px-4 py-3 text-sm font-semibold">{notice}</p>}<div className="flex flex-col-reverse justify-between gap-4 pt-2 sm:flex-row sm:items-center"><p className="text-sm text-slate-500">You can update this information later.</p><button type="submit" className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">Continue to skill gap</button></div>
      </form>
    </div>
  </div>
</main>
}