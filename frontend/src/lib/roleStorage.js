import roles from '../data/roles.json'

const CUSTOM_ROLES_KEY = 'customTargetRoles'
const TARGET_ROLE_ID_KEY = 'targetRoleId'

const emptySkills = { critical: [], important: [], niceToHave: [] }

function canUseStorage() {
  return typeof window !== 'undefined' && window.localStorage
}

function normalizeRole(role) {
  return {
    ...role,
    description: role.description || 'Custom target role created by you.',
    skills: {
      critical: Array.isArray(role.skills?.critical) ? role.skills.critical : [],
      important: Array.isArray(role.skills?.important) ? role.skills.important : [],
      niceToHave: Array.isArray(role.skills?.niceToHave) ? role.skills.niceToHave : [],
    },
  }
}

function createRoleId(title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)

  return `custom-${slug || 'role'}-${Date.now()}`
}

export function getCustomRoles() {
  if (!canUseStorage()) return []

  try {
    const storedRoles = JSON.parse(window.localStorage.getItem(CUSTOM_ROLES_KEY) || '[]')
    if (!Array.isArray(storedRoles)) return []
    const filtered = storedRoles.filter(r => r && r.title && !r.title.toLowerCase().includes('income tax officer'))
    if (filtered.length !== storedRoles.length) {
      window.localStorage.setItem(CUSTOM_ROLES_KEY, JSON.stringify(filtered))
    }
    return filtered.map(normalizeRole)
  } catch {
    return []
  }
}

export function getAllRoles() {
  const combined = [...roles.roles, ...getCustomRoles()]
  return combined.filter(r => r && r.title && !r.title.toLowerCase().includes('income tax officer'))
}

export function getSelectedRole(fallbackRole = null) {
  const targetRoleId = canUseStorage() ? window.localStorage.getItem(TARGET_ROLE_ID_KEY) : ''
  if (!targetRoleId) return fallbackRole
  const found = getAllRoles().find((role) => role.id === targetRoleId)
  if (!found && canUseStorage()) {
    window.localStorage.removeItem(TARGET_ROLE_ID_KEY)
  }
  return found || fallbackRole
}

export function selectTargetRole(roleId) {
  if (!canUseStorage()) return
  if (!roleId) {
    window.localStorage.removeItem(TARGET_ROLE_ID_KEY)
  } else {
    window.localStorage.setItem(TARGET_ROLE_ID_KEY, roleId)
  }
}

export function saveCustomRole(role) {
  if (!canUseStorage()) return null

  const customRole = normalizeRole({
    id: createRoleId(role.title),
    title: role.title.trim(),
    description: role.description.trim() || 'Custom target role created by you.',
    skills: role.skills || emptySkills,
    isCustom: true,
  })
  const customRoles = getCustomRoles()

  window.localStorage.setItem(CUSTOM_ROLES_KEY, JSON.stringify([...customRoles, customRole]))
  selectTargetRole(customRole.id)

  return customRole
}
