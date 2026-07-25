const SYNONYM_DEFINITIONS = {
  javascript: ['js', 'javascript', 'javascript/es6', 'nodejs', 'node.js'],
  react: ['react', 'reactjs', 'react.js'],
  'machine learning': ['machine learning', 'ml'],
  postgresql: ['postgresql', 'postgres', 'postgres db', 'postgres dbs'],
  sql: ['sql'],
}

const SYNONYM_LOOKUP = new Map(
  Object.entries(SYNONYM_DEFINITIONS).flatMap(([canonical, aliases]) => [
    [canonical, canonical],
    ...aliases.map((alias) => [alias, canonical]),
  ])
)

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeSkillName(skill) {
  const normalized = normalizeText(skill)
  if (!normalized) return ''
  return SYNONYM_LOOKUP.get(normalized) || normalized
}

function splitAlternatives(value) {
  return normalizeText(value)
    .split(/\s+or\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function splitAndParts(value) {
  return normalizeText(value)
    .split(/\s+and\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildUserSkillSet(skills = []) {
  const entries = new Set()

  skills.forEach((skill) => {
    const normalized = normalizeSkillName(skill)
    if (!normalized) return

    entries.add(normalized)
    splitAlternatives(skill).forEach((option) => {
      const canonical = normalizeSkillName(option)
      if (canonical) entries.add(canonical)
    })
    splitAndParts(skill).forEach((option) => {
      const canonical = normalizeSkillName(option)
      if (canonical) entries.add(canonical)
    })
  })

  return entries
}

function isRequirementSatisfied(requirement, userSkillSet) {
  const normalized = normalizeSkillName(requirement)
  if (!normalized) return false

  const alternatives = splitAlternatives(requirement)
  if (alternatives.length > 1) {
    return alternatives.some((option) => userSkillSet.has(normalizeSkillName(option)))
  }

  const andParts = splitAndParts(requirement)
  if (andParts.length > 1) {
    return andParts.every((part) => userSkillSet.has(normalizeSkillName(part)))
  }

  return userSkillSet.has(normalized)
}

function aggregateMatchedSkills(matched) {
  return ['critical', 'important', 'niceToHave'].flatMap((category) => matched[category])
}

export function getSkillGapAnalysis(userSkills = [], roleSkills = {}) {
  const userSkillSet = buildUserSkillSet(userSkills)
  const categories = ['critical', 'important', 'niceToHave']

  const result = {
    matched: { critical: [], important: [], niceToHave: [] },
    missing: { critical: [], important: [], niceToHave: [] },
    matchedSkills: [],
    missingSkills: { critical: [], important: [], niceToHave: [] },
    totalRequiredSkills: 0,
    matchedSkillCount: 0,
    matchPercentage: 0,
  }

  categories.forEach((category) => {
    const requiredSkills = Array.isArray(roleSkills[category]) ? roleSkills[category] : []
    result.totalRequiredSkills += requiredSkills.length

    requiredSkills.forEach((requiredSkill) => {
      const satisfied = isRequirementSatisfied(requiredSkill, userSkillSet)
      if (satisfied) {
        result.matched[category].push(requiredSkill)
        result.matchedSkills.push(requiredSkill)
        result.matchedSkillCount += 1
      } else {
        result.missing[category].push(requiredSkill)
        result.missingSkills[category].push(requiredSkill)
      }
    })
  })

  result.matchPercentage = result.totalRequiredSkills > 0
    ? Number(((result.matchedSkillCount / result.totalRequiredSkills) * 100).toFixed(1))
    : 0

  return result
}
