const SKILL_SYNONYMS = {
  javascript: ['js', 'es6', 'ecmascript'],
  js: ['javascript', 'es6', 'ecmascript'],
  typescript: ['ts'],
  ts: ['typescript'],
  python: ['py', 'py3', 'python3'],
  py: ['python', 'py3', 'python3'],
  react: ['reactjs', 'react.js'],
  reactjs: ['react', 'react.js'],
  'react.js': ['react', 'reactjs'],
  node: ['nodejs', 'node.js'],
  nodejs: ['node', 'node.js'],
  'node.js': ['node', 'nodejs'],
  ml: ['machine learning', 'ai'],
  'machine learning': ['ml', 'ai'],
  ai: ['machine learning', 'ml'],
  sql: ['mysql', 'postgresql', 'postgres', 'databases'],
  postgres: ['postgresql', 'sql', 'databases'],
  postgresql: ['postgres', 'sql', 'databases'],
  databases: ['sql', 'postgres', 'postgresql', 'db'],
  db: ['databases', 'sql'],
  dsa: ['data structures and algorithms', 'algorithms', 'data structures'],
  algo: ['data structures and algorithms', 'algorithms'],
  algorithms: ['data structures and algorithms', 'dsa'],
  oop: ['object-oriented programming', 'object oriented programming'],
  api: ['apis and http', 'apis', 'http', 'rest'],
  apis: ['apis and http', 'api', 'http', 'rest'],
  git: ['github', 'gitlab', 'version control'],
  bash: ['shell', 'scripting'],
  shell: ['bash', 'scripting'],
  linux: ['ubuntu'],
  pandas: ['numpy'],
  numpy: ['pandas'],
  figma: [],
  wireframing: ['wireframe', 'wireframes'],
  prototyping: ['prototype', 'prototypes'],
}

function cleanStr(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/visualis/g, 'visualiz')
    .replace(/organis/g, 'organiz')
    .replace(/[^a-z0-9]/g, '')
}

function extractSkillName(item) {
  if (!item) return ''
  if (typeof item === 'string') return item
  if (typeof item === 'object') return item.name || item.title || item.skill || ''
  return String(item)
}

function toWords(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0 && w !== 'and' && w !== 'or' && w !== 'with')
}

function getEquivalentTokens(word) {
  const norm = cleanStr(word)
  const results = new Set([norm])
  const syns = SKILL_SYNONYMS[norm]
  if (syns) {
    syns.forEach((s) => {
      toWords(s).forEach((w) => results.add(cleanStr(w)))
    })
  }
  return Array.from(results)
}

function isSingleSkillMatched(requiredSkill, userSkillInput) {
  const reqClean = cleanStr(requiredSkill)
  const userClean = cleanStr(userSkillInput)

  if (!reqClean || !userClean) return false

  // 1. Direct clean match
  if (reqClean === userClean) return true

  // 2. Word token & synonym match (e.g. required "HTML and CSS", user "CSS" or "HTML")
  const reqWords = toWords(requiredSkill)
  const userWords = toWords(userSkillInput)

  for (const uw of userWords) {
    const userTokens = getEquivalentTokens(uw)
    for (const rw of reqWords) {
      const reqTokens = getEquivalentTokens(rw)
      for (const ut of userTokens) {
        if (reqTokens.includes(ut)) return true
      }
    }
  }

  return false
}

function isRequirementSatisfied(requiredSkill, userSkills) {
  return userSkills.some((userItem) => {
    const userSkillName = extractSkillName(userItem)
    return isSingleSkillMatched(requiredSkill, userSkillName)
  })
}

export function getSkillGapAnalysis(userSkills = [], roleSkills = {}) {
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
      const satisfied = isRequirementSatisfied(requiredSkill, userSkills)
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
