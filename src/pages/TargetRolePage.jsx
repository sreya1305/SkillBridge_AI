import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import RoleCard from '../components/RoleCard'
import roles from '../data/roles.json'

const normalize = (value) => String(value).toLowerCase()

export default function TargetRolePage() {
  const [search, setSearch] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState(() => localStorage.getItem('targetRoleId') || '')

  const filteredRoles = useMemo(() => {
    const term = normalize(search).trim()
    if (!term) return roles.roles

    return roles.roles.filter((role) => {
      const haystack = [role.title, role.description, ...role.skills.critical, ...role.skills.important, ...role.skills.niceToHave].join(' ')
      return normalize(haystack).includes(term)
    })
  }, [search])

  const handleSelect = (roleId) => {
    localStorage.setItem('targetRoleId', roleId)
    setSelectedRoleId(roleId)
    window.location.href = '/skill-gap'
  }

  return <main className="min-h-screen bg-[#f7f8fa] text-ink">
    <Navbar />
    <section className="wrap py-16">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mb-8">
            <p className="eyebrow text-violet">Choose a target role</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-ink sm:text-5xl">What career path do you want next?</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Search through the role library, review the required skill categories, and lock in one target role before closing your gap.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Search roles</label>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by role, skill, or keyword" className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet focus:ring-2 focus:ring-violet/15" />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Available roles</p>
              <p className="mt-3 leading-6">Choose from a static library of career paths. Each role card includes the role description, required categories, and counts for critical and important skills.</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600"><div><span className="font-semibold">Total roles:</span> {roles.roles.length}</div><div><span className="font-semibold">Showing:</span> {filteredRoles.length}</div></div>
            </div>
          </div>

          <div className="mt-10 grid gap-6">
            {filteredRoles.map((role) => <RoleCard key={role.id} role={role} isSelected={selectedRoleId === role.id} onSelect={handleSelect} />)}
            {filteredRoles.length === 0 && <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No matching roles found. Try a different search term.</div>}
          </div>
        </div>
      </div>
    </section>
  </main>
}
