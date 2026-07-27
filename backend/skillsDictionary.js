/**
 * Comprehensive Canonical Skills & Approved Aliases Dictionary
 * Enables high-precision and high-recall technical skill extraction.
 * Excludes project section technologies (group project leaks) while accepting Skills, Experience, Education, and Certifications sections.
 */

const SKILLS_DICTIONARY = [
  // Programming Languages & CS Core (Technical)
  { canonical: 'JavaScript', category: 'technical', aliases: ['javascript', 'js', 'java script', 'ecmascript'] },
  { canonical: 'TypeScript', category: 'technical', aliases: ['typescript', 'ts', 'type script'] },
  { canonical: 'Python', category: 'technical', aliases: ['python', 'py', 'python3', 'python2'] },
  { canonical: 'Java', category: 'technical', aliases: ['java', 'jdk', 'jre'] },
  { canonical: 'C++', category: 'technical', aliases: ['c++', 'cpp', 'c plus plus'] },
  { canonical: 'C#', category: 'technical', aliases: ['c#', 'csharp', 'c sharp', '.net'] },
  { canonical: 'C', category: 'technical', aliases: ['c', 'c language', 'c programming', 'c-lang', 'c lang'] },
  { canonical: 'Google Apps Script', category: 'technical', aliases: ['google apps script', 'apps script', 'appscript', 'app script', 'gas'] },
  { canonical: 'PHP', category: 'technical', aliases: ['php', 'php7', 'php8'] },
  { canonical: 'Ruby', category: 'technical', aliases: ['ruby'] },
  { canonical: 'Go', category: 'technical', aliases: ['golang', 'go lang', 'go programming', 'go'] },
  { canonical: 'Rust', category: 'technical', aliases: ['rust', 'rustlang'] },
  { canonical: 'Swift', category: 'technical', aliases: ['swift', 'swift5'] },
  { canonical: 'Kotlin', category: 'technical', aliases: ['kotlin'] },
  { canonical: 'R', category: 'technical', aliases: ['r programming', 'r language', 'r-lang', 'r'] },
  { canonical: 'MATLAB', category: 'technical', aliases: ['matlab'] },
  { canonical: 'SQL', category: 'technical', aliases: ['sql', 'structured query language', 't-sql', 'pl/sql'] },
  { canonical: 'HTML5', category: 'technical', aliases: ['html5', 'html 5'] },
  { canonical: 'HTML', category: 'technical', aliases: ['html'] },
  { canonical: 'CSS3', category: 'technical', aliases: ['css3', 'css 3'] },
  { canonical: 'CSS', category: 'technical', aliases: ['css'] },
  { canonical: 'Bash', category: 'technical', aliases: ['bash', 'sh', 'shell script', 'shell scripting', 'shell'] },
  { canonical: 'PowerShell', category: 'technical', aliases: ['powershell', 'pwsh'] },
  { canonical: 'Solidity', category: 'technical', aliases: ['solidity'] },

  // Computer Science Core (Technical)
  { canonical: 'DBMS', category: 'technical', aliases: ['dbms', 'rdbms', 'dbms concepts', 'database management', 'database management system', 'database management systems'] },
  { canonical: 'OOP', category: 'technical', aliases: ['oop', 'oops', 'oop concepts', 'oops concepts', 'object oriented programming', 'object-oriented programming'] },
  { canonical: 'Data Structures', category: 'technical', aliases: ['dsa', 'data structures', 'data structures & algorithms', 'data structures and algorithms', 'ds'] },
  { canonical: 'Algorithms', category: 'technical', aliases: ['algorithms', 'algo', 'algos'] },
  { canonical: 'Operating Systems', category: 'technical', aliases: ['operating systems', 'os', 'operating system'] },
  { canonical: 'Computer Networks', category: 'technical', aliases: ['computer networks', 'networking', 'cn', 'computer network'] },

  // Frontend Frameworks & Libraries (Technical)
  { canonical: 'React', category: 'technical', aliases: ['react', 'react.js', 'reactjs', 'react js'] },
  { canonical: 'React Native', category: 'technical', aliases: ['react native', 'react-native'] },
  { canonical: 'Vue.js', category: 'technical', aliases: ['vue', 'vue.js', 'vuejs', 'vue 3', 'vue 2', 'vuejs3'] },
  { canonical: 'Angular', category: 'technical', aliases: ['angular', 'angularjs', 'angular.js', 'angular 2+'] },
  { canonical: 'Next.js', category: 'technical', aliases: ['next.js', 'nextjs', 'next js'] },
  { canonical: 'Nuxt.js', category: 'technical', aliases: ['nuxt.js', 'nuxtjs', 'nuxt js'] },
  { canonical: 'Svelte', category: 'technical', aliases: ['svelte', 'sveltekit', 'svelte.js'] },
  { canonical: 'Redux', category: 'technical', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { canonical: 'Tailwind CSS', category: 'technical', aliases: ['tailwind css', 'tailwindcss', 'tailwind'] },
  { canonical: 'Bootstrap', category: 'technical', aliases: ['bootstrap', 'bootstrap 5', 'bootstrap 4'] },
  { canonical: 'Sass', category: 'technical', aliases: ['sass', 'scss'] },
  { canonical: 'jQuery', category: 'technical', aliases: ['jquery', 'jquery.js'] },
  { canonical: 'Webpack', category: 'technical', aliases: ['webpack'] },
  { canonical: 'Vite', category: 'technical', aliases: ['vite', 'vitejs'] },
  { canonical: 'GraphQL', category: 'technical', aliases: ['graphql', 'gql'] },
  { canonical: 'Material UI', category: 'technical', aliases: ['material ui', 'mui', 'material-ui'] },
  { canonical: 'Chakra UI', category: 'technical', aliases: ['chakra ui', 'chakra'] },

  // Backend Frameworks & Libraries (Technical)
  { canonical: 'Node.js', category: 'technical', aliases: ['node.js', 'nodejs', 'node js', 'node'] },
  { canonical: 'Express.js', category: 'technical', aliases: ['express', 'express.js', 'expressjs', 'express js'] },
  { canonical: 'NestJS', category: 'technical', aliases: ['nestjs', 'nest.js', 'nest js'] },
  { canonical: 'Django', category: 'technical', aliases: ['django', 'django rest framework', 'drf'] },
  { canonical: 'Flask', category: 'technical', aliases: ['flask'] },
  { canonical: 'FastAPI', category: 'technical', aliases: ['fastapi', 'fast api'] },
  { canonical: 'Spring Boot', category: 'technical', aliases: ['spring boot', 'springframework', 'spring framework', 'spring'] },
  { canonical: 'Laravel', category: 'technical', aliases: ['laravel'] },
  { canonical: 'Ruby on Rails', category: 'technical', aliases: ['ruby on rails', 'rails', 'ror'] },
  { canonical: 'ASP.NET', category: 'technical', aliases: ['asp.net', 'asp.net core', 'net core'] },
  { canonical: 'REST API', category: 'technical', aliases: ['rest api', 'restful apis', 'restful api', 'rest apis', 'rest', 'web api', 'web apis'] },
  { canonical: 'Microservices', category: 'technical', aliases: ['microservices', 'microservice architecture'] },

  // Databases & ORMs (Technical)
  { canonical: 'PostgreSQL', category: 'technical', aliases: ['postgresql', 'postgres', 'psql'] },
  { canonical: 'MySQL', category: 'technical', aliases: ['mysql', 'my sql'] },
  { canonical: 'MongoDB', category: 'technical', aliases: ['mongodb', 'mongo', 'mongo db'] },
  { canonical: 'Redis', category: 'technical', aliases: ['redis'] },
  { canonical: 'SQLite', category: 'technical', aliases: ['sqlite', 'sqlite3'] },
  { canonical: 'Oracle', category: 'technical', aliases: ['oracle database', 'oracle db', 'oracle'] },
  { canonical: 'SQL Server', category: 'technical', aliases: ['sql server', 'mssql', 'ms sql server', 'ms sql'] },
  { canonical: 'Firebase', category: 'technical', aliases: ['firebase', 'firestore', 'realtime database'] },
  { canonical: 'DynamoDB', category: 'technical', aliases: ['dynamodb', 'aws dynamodb'] },
  { canonical: 'Cassandra', category: 'technical', aliases: ['cassandra', 'apache cassandra'] },
  { canonical: 'Elasticsearch', category: 'technical', aliases: ['elasticsearch', 'elastic search', 'elastic stack'] },
  { canonical: 'Prisma', category: 'technical', aliases: ['prisma', 'prisma orm'] },
  { canonical: 'Sequelize', category: 'technical', aliases: ['sequelize', 'sequelize orm'] },

  // Cloud & DevOps (Technical)
  { canonical: 'AWS', category: 'technical', aliases: ['aws', 'amazon web services', 'aws cloud', 'ec2', 's3', 'lambda'] },
  { canonical: 'Azure', category: 'technical', aliases: ['azure', 'microsoft azure', 'azure cloud'] },
  { canonical: 'GCP', category: 'technical', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { canonical: 'Docker', category: 'technical', aliases: ['docker', 'docker container', 'docker desktop'] },
  { canonical: 'Kubernetes', category: 'technical', aliases: ['kubernetes', 'k8s'] },
  { canonical: 'CI/CD', category: 'technical', aliases: ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'] },
  { canonical: 'Jenkins', category: 'technical', aliases: ['jenkins'] },
  { canonical: 'GitHub Actions', category: 'technical', aliases: ['github actions', 'gh actions'] },
  { canonical: 'Terraform', category: 'technical', aliases: ['terraform'] },
  { canonical: 'Ansible', category: 'technical', aliases: ['ansible'] },
  { canonical: 'Nginx', category: 'technical', aliases: ['nginx'] },
  { canonical: 'Linux', category: 'technical', aliases: ['linux', 'ubuntu', 'centos', 'debian', 'rhel', 'unix'] },

  // AI & Data Science (Technical)
  { canonical: 'Machine Learning', category: 'technical', aliases: ['machine learning', 'ml', 'machine-learning'] },
  { canonical: 'Deep Learning', category: 'technical', aliases: ['deep learning', 'dl'] },
  { canonical: 'Artificial Intelligence', category: 'technical', aliases: ['artificial intelligence', 'ai'] },
  { canonical: 'Data Analysis', category: 'technical', aliases: ['data analysis', 'data analytics'] },
  { canonical: 'Data Science', category: 'technical', aliases: ['data science'] },
  { canonical: 'Pandas', category: 'technical', aliases: ['pandas'] },
  { canonical: 'NumPy', category: 'technical', aliases: ['numpy'] },
  { canonical: 'scikit-learn', category: 'technical', aliases: ['scikit-learn', 'scikit learn', 'sklearn'] },
  { canonical: 'TensorFlow', category: 'technical', aliases: ['tensorflow', 'tf'] },
  { canonical: 'PyTorch', category: 'technical', aliases: ['pytorch', 'torch'] },
  { canonical: 'Keras', category: 'technical', aliases: ['keras'] },
  { canonical: 'OpenCV', category: 'technical', aliases: ['opencv', 'open cv'] },
  { canonical: 'NLP', category: 'technical', aliases: ['nlp', 'natural language processing'] },
  { canonical: 'LLMs', category: 'technical', aliases: ['llm', 'llms', 'large language models', 'langchain', 'generative ai', 'genai'] },
  { canonical: 'Power BI', category: 'technical', aliases: ['power bi', 'powerbi'] },
  { canonical: 'Tableau', category: 'technical', aliases: ['tableau'] },
  { canonical: 'Matplotlib', category: 'technical', aliases: ['matplotlib'] },
  { canonical: 'Seaborn', category: 'technical', aliases: ['seaborn'] },
  { canonical: 'Spark', category: 'technical', aliases: ['spark', 'apache spark', 'pyspark'] },
  { canonical: 'Hadoop', category: 'technical', aliases: ['hadoop', 'apache hadoop'] },
  { canonical: 'Excel', category: 'technical', aliases: ['excel', 'microsoft excel', 'ms excel'] },

  // Mobile Development (Technical)
  { canonical: 'Flutter', category: 'technical', aliases: ['flutter'] },
  { canonical: 'Android', category: 'technical', aliases: ['android', 'android SDK', 'android studio'] },
  { canonical: 'iOS', category: 'technical', aliases: ['ios', 'ios SDK', 'xcode'] },
  { canonical: 'Expo', category: 'technical', aliases: ['expo'] },
  { canonical: 'SwiftUI', category: 'technical', aliases: ['swiftui'] },

  // Dev Tools & Utilities (Technical)
  { canonical: 'Git', category: 'technical', aliases: ['git', 'version control'] },
  { canonical: 'GitHub', category: 'technical', aliases: ['github'] },
  { canonical: 'GitLab', category: 'technical', aliases: ['gitlab'] },
  { canonical: 'Figma', category: 'technical', aliases: ['figma'] },
  { canonical: 'Jira', category: 'technical', aliases: ['jira'] },
  { canonical: 'Postman', category: 'technical', aliases: ['postman'] },
  { canonical: 'Unit Testing', category: 'technical', aliases: ['unit testing', 'jest', 'mocha', 'cypress', 'pytest', 'junit'] },
  { canonical: 'Agile', category: 'technical', aliases: ['agile', 'scrum'] }
]

function normalizeText(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[^a-z0-9+#.\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findEvidence(rawText, sourceText) {
  if (!rawText || !sourceText) return ''
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const escaped = sourceText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const reg = new RegExp(`(?:^|[^a-zA-Z0-9+#.])${escaped}(?:$|[^a-zA-Z0-9+#.])`, 'i')

  for (const line of lines) {
    if (reg.test(line)) {
      return line.slice(0, 160)
    }
  }

  const idx = rawText.toLowerCase().indexOf(sourceText.toLowerCase())
  if (idx !== -1) {
    const start = Math.max(0, idx - 40)
    const end = Math.min(rawText.length, idx + sourceText.length + 40)
    return rawText.slice(start, end).replace(/[\r\n\t]+/g, ' ').trim()
  }

  return `Found in resume: "${sourceText}"`
}

/**
 * Strips out Project sections from resume text to prevent group project skill leaks
 */
function removeProjectSections(rawText = '') {
  if (!rawText) return ''

  const lines = rawText.split(/\r?\n/)
  const filteredLines = []
  let insideProjectSection = false

  const projectHeaderRegex = /^\s*(projects|project experience|personal projects|academic projects|key projects|recent projects)\b/i
  const nonProjectHeaderRegex = /^\s*(skills|technical skills|soft skills|technologies|tools|work experience|experience|employment history|employment|education|certifications|summary|profile|achievements|languages|declarations)\b/i

  for (const line of lines) {
    const trimmed = line.trim()
    if (projectHeaderRegex.test(trimmed)) {
      insideProjectSection = true
      continue
    }

    if (insideProjectSection) {
      if (nonProjectHeaderRegex.test(trimmed)) {
        insideProjectSection = false
        filteredLines.push(line)
      }
      continue
    }

    filteredLines.push(line)
  }

  return filteredLines.join('\n')
}

function extractExplicitSkillsSectionText(rawText = '') {
  if (!rawText) return ''

  const match = rawText.match(/\b(technical skills|skills|technologies|tools & technologies|tools|core competencies|programming languages|skills & competencies|soft skills)\b/i)

  if (match && match.index !== undefined) {
    const afterHeader = rawText.slice(match.index)
    const nextHeaderMatch = afterHeader.search(/\n\s*(projects|project experience|personal projects|academic projects|work experience|employment history|experience|education|certifications|achievements|declarations)\b/i)

    if (nextHeaderMatch !== -1 && nextHeaderMatch > 20) {
      return afterHeader.slice(0, nextHeaderMatch)
    }
    return afterHeader
  }

  return rawText
}

// Strict regex for noise words and generic phrases that should NEVER be extracted as standalone skills
const NOISE_WORDS_REGEX = /\b(technologies|technology|technologies used|relevant technologies|tools used|concepts|core concepts|basic concepts|programming concepts|fundamentals|basics|overview|knowledge|experience|proficiency|proficient|familiarity|familiar|intermediate|advanced|expert|working knowledge|hands-on|etc|others|other|languages|programming languages|scripting languages|databases|tools|frameworks|skills|soft skills|technical skills|libraries|platforms|operating systems|devops|cloud|used|skills & technologies|communication|leadership|teamwork|collaboration|problem solving|time management|adaptability|creativity|interpersonal skills|work ethic|conflict resolution|public speaking|presentation skills|negotiation)\b/i

/**
 * Directly extracts item tokens explicitly typed inside an explicit SKILLS section
 */
function parseExplicitSkillsSectionItems(skillsSectionText = '') {
  if (!skillsSectionText || skillsSectionText.length < 3) return []

  const lines = skillsSectionText.split(/\r?\n/)
  const extracted = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Skip top section header
    if (/^\s*(technical skills|skills|technologies|tools & technologies|tools|core competencies|programming languages|skills & competencies|soft skills)\b[:\r\n\t]?$/i.test(trimmed)) {
      continue
    }

    // Strip generic inline subheadings ending with colons e.g. "Programming Concepts:", "Databases:", "Tools:", "Frameworks:", "Technologies Used:"
    const contentLine = trimmed.replace(/^[a-z0-9\s&/\\-]+:\s*/i, '')

    // Split line by commas, semicolons, bullets, slashes, or pipes
    const tokens = contentLine.split(/[,;\t|•\*·/]+/)
    for (let token of tokens) {
      let cleaned = token.replace(/^[•\*·\-\s]+/, '').replace(/[\s]+$/, '').trim()
      // Remove trailing parenthetical details if present e.g. "Python (Proficient)" -> "Python"
      cleaned = cleaned.replace(/\s*\([^)]*\)/g, '').trim()

      if (cleaned.length >= 1 && cleaned.length <= 45 && !NOISE_WORDS_REGEX.test(cleaned)) {
        extracted.push(cleaned)
      }
    }
  }

  return extracted
}

/**
 * High-Precision & High-Recall Technical Skill Extraction Verification
 * Strictly excludes Projects sections while accepting Skills, Experience, Education, and Certifications.
 * Soft skills and generic header noise words (e.g. "technologies") are completely filtered out.
 */
function verifySkillsAgainstText(candidateSkills = [], rawText = '') {
  const allowedText = removeProjectSections(rawText)
  const normAllowedText = ' ' + normalizeText(allowedText) + ' '

  const skillsSectionText = extractExplicitSkillsSectionText(allowedText)
  const normSkillsSectionText = ' ' + normalizeText(skillsSectionText) + ' '

  // Combine AI candidates + Direct items parsed from SKILLS section to guarantee 100% recall
  const directSkillsSectionItems = parseExplicitSkillsSectionItems(skillsSectionText)
  const mergedCandidates = Array.from(new Set([...directSkillsSectionItems, ...candidateSkills]))

  const verifiedMap = new Map() // canonicalName -> { name, category, evidence, sourceText, confidence }
  const removedSkills = []
  const debugLogs = []

  // Step 1: Process Candidate Skills returned by AI / Parser + Direct SKILLS section items
  for (const rawCandidate of mergedCandidates) {
    const candStr = (typeof rawCandidate === 'string' ? rawCandidate : (rawCandidate.name || rawCandidate.skill || '')).trim()
    if (!candStr) continue

    // Skip generic noise tokens e.g. "technologies", "concepts", "tools used"
    if (NOISE_WORDS_REGEX.test(candStr)) continue

    const normCand = normalizeText(candStr)
    let matchedEntry = null

    // Check dictionary
    for (const item of SKILLS_DICTIONARY) {
      if (normalizeText(item.canonical) === normCand) {
        matchedEntry = item
        break
      }
      for (const alias of item.aliases) {
        if (normalizeText(alias) === normCand) {
          matchedEntry = item
          break
        }
      }
      if (matchedEntry) break
    }

    if (!matchedEntry) {
      // Filter out soft skills completely
      const isSoftSkill = /\b(communication|leadership|team leadership|people management|problem solving|teamwork|collaboration|time management|adaptability|creativity|conflict resolution|strategic thinking|emotional intelligence|attention to detail|work ethic|customer service|interpersonal)\b/i.test(candStr)
        && !/\b(dbms|rdbms|database|sql|postgres|mysql|mongo|redis|system|architecture|agile|scrum|data structures|algorithms|operating systems|computer networks|oop|oops)\b/i.test(candStr)
      
      if (isSoftSkill) continue // Skip soft skills completely

      matchedEntry = { canonical: candStr, category: 'technical', aliases: [candStr] }
    }

    // Check text presence ONLY inside allowedText (Skills + Experience + Education + Certifications, NO Projects!)
    let verifiedSourceText = null
    for (const alias of matchedEntry.aliases) {
      const normAlias = normalizeText(alias)
      if (!normAlias) continue

      if (normSkillsSectionText.includes(' ' + normAlias + ' ') || normSkillsSectionText.includes(normAlias)) {
        verifiedSourceText = alias
        break
      }
    }

    if (!verifiedSourceText) {
      for (const alias of matchedEntry.aliases) {
        const normAlias = normalizeText(alias)
        if (!normAlias) continue

        if (normAllowedText.includes(' ' + normAlias + ' ') || normAllowedText.includes(normAlias)) {
          verifiedSourceText = alias
          break
        }
      }
    }

    // Fallback if raw text is empty/unstructured
    if (!verifiedSourceText && (rawText.length < 50 || normAllowedText.length < 30)) {
      verifiedSourceText = candStr
    }

    if (verifiedSourceText) {
      const canonicalName = matchedEntry.canonical || candStr
      if (!verifiedMap.has(canonicalName)) {
        const evidence = findEvidence(skillsSectionText.length > 20 ? skillsSectionText : allowedText, verifiedSourceText)
        verifiedMap.set(canonicalName, {
          name: canonicalName,
          category: 'technical',
          evidence,
          sourceText: verifiedSourceText,
          confidence: 'high'
        })
        debugLogs.push({ status: 'VERIFIED', candidate: candStr, canonical: canonicalName, category: 'technical', sourceText: verifiedSourceText })
      }
    } else {
      removedSkills.push({ candidate: candStr, reason: 'Exclusively in Projects section (group project filtering)' })
    }
  }

  // Step 2: High Recall - Scan allowedText (Skills, Experience, Education) against SKILLS_DICTIONARY
  for (const item of SKILLS_DICTIONARY) {
    if (verifiedMap.has(item.canonical)) continue

    for (const alias of item.aliases) {
      const normAlias = normalizeText(alias)
      if (!normAlias || normAlias.length < 2) continue

      const escaped = normAlias.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const reg = new RegExp(`(?:^|[^a-z0-9+#.])${escaped}(?:$|[^a-z0-9+#.])`, 'i')

      if (reg.test(normAllowedText)) {
        const evidence = findEvidence(skillsSectionText.length > 20 ? skillsSectionText : allowedText, alias)
        verifiedMap.set(item.canonical, {
          name: item.canonical,
          category: 'technical',
          evidence,
          sourceText: alias,
          confidence: 'high'
        })
        debugLogs.push({ status: 'RECALLED_FROM_ALLOWED_SECTIONS', canonical: item.canonical, category: 'technical', sourceText: alias })
        break
      }
    }
  }

  const allVerified = Array.from(verifiedMap.values())

  return {
    finalSkills: allVerified,
    technicalSkills: allVerified,
    softSkills: [],
    removedSkills,
    debugLogs
  }
}

export {
  SKILLS_DICTIONARY,
  normalizeText,
  findEvidence,
  removeProjectSections,
  extractExplicitSkillsSectionText,
  parseExplicitSkillsSectionItems,
  verifySkillsAgainstText
}
