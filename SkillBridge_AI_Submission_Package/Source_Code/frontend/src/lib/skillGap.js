const SKILL_SYNONYMS = {
  html: ['html5', 'html 5'],
  html5: ['html', 'html 5'],
  css: ['css3', 'css 3', 'sass', 'scss'],
  css3: ['css', 'css 3'],
  javascript: ['js', 'es6', 'ecmascript'],
  js: ['javascript', 'es6', 'ecmascript'],
  typescript: ['ts'],
  ts: ['typescript'],
  python: ['py', 'py3', 'python3'],
  py: ['python', 'py3', 'python3'],
  c: ['c language', 'c programming', 'c lang', 'clang'],
  'c++': ['cpp', 'c plus plus'],
  cpp: ['c++', 'c plus plus'],
  'c#': ['csharp', 'c sharp', '.net'],
  csharp: ['c#', 'c sharp'],
  react: ['reactjs', 'react.js', 'react native'],
  reactjs: ['react', 'react.js'],
  'react.js': ['react', 'reactjs'],
  vue: ['vuejs', 'vue.js', 'vue3'],
  vuejs: ['vue', 'vue.js'],
  'vue.js': ['vue', 'vuejs'],
  node: ['nodejs', 'node.js'],
  nodejs: ['node', 'node.js'],
  'node.js': ['node', 'nodejs'],
  express: ['expressjs', 'express.js'],
  expressjs: ['express', 'express.js'],
  'express.js': ['express', 'expressjs'],
  next: ['nextjs', 'next.js'],
  nextjs: ['next', 'next.js'],
  'next.js': ['next', 'nextjs'],
  ml: ['machine learning', 'ai'],
  'machine learning': ['ml', 'ai'],
  ai: ['machine learning', 'ml'],
  dbms: ['database', 'databases', 'rdbms', 'database management', 'sql'],
  rdbms: ['dbms', 'database', 'databases', 'sql'],
  database: ['dbms', 'rdbms', 'databases', 'sql'],
  databases: ['dbms', 'rdbms', 'database', 'sql'],
  sql: ['mysql', 'postgresql', 'postgres', 'databases', 'dbms'],
  postgres: ['postgresql', 'sql', 'databases'],
  postgresql: ['postgres', 'sql', 'databases'],
  db: ['databases', 'sql', 'dbms'],
  dsa: ['data structures and algorithms', 'algorithms', 'data structures'],
  algo: ['data structures and algorithms', 'algorithms'],
  algorithms: ['data structures and algorithms', 'dsa'],
  oop: ['object-oriented programming', 'object oriented programming', 'oops'],
  api: ['apis and http', 'apis', 'http', 'rest', 'rest api'],
  apis: ['apis and http', 'api', 'http', 'rest', 'rest api'],
  git: ['github', 'gitlab', 'version control'],
  bash: ['shell', 'scripting', 'powershell'],
  shell: ['bash', 'scripting'],
  linux: ['ubuntu', 'unix'],
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
  
  // Base version strip fallback e.g. "html5" -> "html", "css3" -> "css"
  const baseNorm = norm.replace(/\d+$/, '')
  if (baseNorm && baseNorm.length >= 2) {
    results.add(baseNorm)
  }

  const syns = SKILL_SYNONYMS[norm] || SKILL_SYNONYMS[baseNorm]
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

  // 2. Base version match e.g. "html" vs "html5" or "css" vs "css3"
  const reqBase = reqClean.replace(/\d+$/, '')
  const userBase = userClean.replace(/\d+$/, '')
  if (reqBase.length >= 2 && reqBase === userBase) return true

  // 3. Word token & synonym match (e.g. required "HTML and CSS", user "CSS" or "HTML5")
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
