function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,]/g, '')
    .replace(/\band\b/g, 'and')
    .replace(/\bor\b/g, 'or')
    .trim()
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
    const normalized = normalizeText(skill)
    if (!normalized) return
    entries.add(normalized)

    splitAlternatives(normalized).forEach((option) => entries.add(option))
    splitAndParts(normalized).forEach((part) => entries.add(part))
  })
  return entries
}

function isRequirementSatisfied(requirement, userSkillSet) {
  const normalized = normalizeText(requirement)
  if (!normalized) return false

  const alternatives = splitAlternatives(normalized)
  if (alternatives.length > 1) {
    return alternatives.some((option) => userSkillSet.has(option))
  }

  const andParts = splitAndParts(normalized)
  if (andParts.length > 1) {
    return andParts.every((part) => userSkillSet.has(part))
  }

  return userSkillSet.has(normalized)
}

export function getSkillGapAnalysis(userSkills = [], roleSkills = {}) {
  const userSkillSet = buildUserSkillSet(userSkills)
  const categories = ['critical', 'important', 'niceToHave']
  const result = {
    matched: { critical: [], important: [], niceToHave: [] },
    missing: { critical: [], important: [], niceToHave: [] },
    counts: { critical: { matched: 0, total: 0 }, important: { matched: 0, total: 0 }, niceToHave: { matched: 0, total: 0 } },
    totalMissing: 0,
  }

  categories.forEach((category) => {
    const requiredSkills = Array.isArray(roleSkills[category]) ? roleSkills[category] : []
    result.counts[category].total = requiredSkills.length

    requiredSkills.forEach((requiredSkill) => {
      const satisfied = isRequirementSatisfied(requiredSkill, userSkillSet)
      if (satisfied) {
        result.matched[category].push(requiredSkill)
        result.counts[category].matched += 1
      } else {
        result.missing[category].push(requiredSkill)
        result.totalMissing += 1
      }
    })
  })

  return result
}
