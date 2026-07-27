/**
 * Comprehensive Canonical Skills & Approved Aliases Dictionary
 * Enables high-precision and high-recall skill extraction with distinct Technical vs Soft categories.
 */

const SKILLS_DICTIONARY = [
  // Programming Languages (Technical)
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
  { canonical: 'Agile', category: 'technical', aliases: ['agile', 'scrum'] },

  // Soft & Professional Skills (Soft)
  { canonical: 'Communication', category: 'soft', aliases: ['communication', 'verbal communication', 'written communication', 'effective communication', 'presentation skills', 'public speaking'] },
  { canonical: 'Leadership', category: 'soft', aliases: ['leadership', 'team leadership', 'team management', 'mentorship', 'coaching', 'people management'] },
  { canonical: 'Problem Solving', category: 'soft', aliases: ['problem solving', 'problem-solving', 'analytical skills', 'analytical thinking', 'troubleshooting', 'critical thinking', 'critical reasoning'] },
  { canonical: 'Project Management', category: 'soft', aliases: ['project management', 'project manager', 'pmp', 'agile management', 'program management', 'task management'] },
  { canonical: 'Teamwork', category: 'soft', aliases: ['teamwork', 'collaboration', 'cross-functional collaboration', 'team player', 'collaborative'] },
  { canonical: 'Time Management', category: 'soft', aliases: ['time management', 'prioritization', 'multitasking', 'organization', 'time prioritization'] },
  { canonical: 'Adaptability', category: 'soft', aliases: ['adaptability', 'flexibility', 'adaptable', 'fast learner', 'quick learner'] },
  { canonical: 'Creativity', category: 'soft', aliases: ['creativity', 'creative thinking', 'innovation', 'innovative thinking'] },
  { canonical: 'Decision Making', category: 'soft', aliases: ['decision making', 'decision-making', 'strategic decision making', 'decisiveness'] },
  { canonical: 'Conflict Resolution', category: 'soft', aliases: ['conflict resolution', 'negotiation', 'mediation'] },
  { canonical: 'Strategic Thinking', category: 'soft', aliases: ['strategic thinking', 'strategic planning', 'strategy'] },
  { canonical: 'Emotional Intelligence', category: 'soft', aliases: ['emotional intelligence', 'eq', 'empathy'] },
  { canonical: 'Attention to Detail', category: 'soft', aliases: ['attention to detail', 'detail-oriented', 'detail oriented', 'meticulous'] },
  { canonical: 'Work Ethic', category: 'soft', aliases: ['work ethic', 'dedication', 'self-motivated', 'self motivation', 'ownership', 'accountability'] },
  { canonical: 'Customer Service', category: 'soft', aliases: ['customer service', 'client relations', 'stakeholder management', 'customer support'] },
  { canonical: 'Interpersonal Skills', category: 'soft', aliases: ['interpersonal skills', 'interpersonal communication', 'relationship building'] }
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

/**
 * High-Precision & High-Recall Skill Extraction Verification
 */
function verifySkillsAgainstText(candidateSkills = [], rawText = '') {
  const skillsSectionText = extractExplicitSkillsSectionText(rawText)
  const normSkillsSectionText = ' ' + normalizeText(skillsSectionText) + ' '
  const normRawText = ' ' + normalizeText(rawText) + ' '

  const verifiedMap = new Map() // canonicalName -> { name, category, evidence, sourceText, confidence }
  const removedSkills = []
  const debugLogs = []

  // Step 1: Process Candidate Skills returned by AI / Parser
  for (const rawCandidate of candidateSkills) {
    const candStr = (typeof rawCandidate === 'string' ? rawCandidate : (rawCandidate.name || rawCandidate.skill || '')).trim()
    if (!candStr) continue

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
      matchedEntry = { canonical: candStr, category: 'technical', aliases: [candStr] }
    }

    // Check text presence: Prefer explicit skills section text first, then fallback to full text
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

        if (normRawText.includes(' ' + normAlias + ' ') || normRawText.includes(normAlias)) {
          verifiedSourceText = alias
          break
        }
      }
    }

    // Fallback if raw text is empty/unstructured
    if (!verifiedSourceText && (rawText.length < 50 || normRawText.length < 30)) {
      verifiedSourceText = candStr
    }

    if (verifiedSourceText) {
      const canonicalName = matchedEntry.canonical || candStr
      const category = matchedEntry.category || 'technical'
      if (!verifiedMap.has(canonicalName)) {
        const evidence = findEvidence(skillsSectionText.length > 20 ? skillsSectionText : rawText, verifiedSourceText)
        verifiedMap.set(canonicalName, {
          name: canonicalName,
          category,
          evidence,
          sourceText: verifiedSourceText,
          confidence: 'high'
        })
        debugLogs.push({ status: 'VERIFIED', candidate: candStr, canonical: canonicalName, category, sourceText: verifiedSourceText })
      }
    } else {
      removedSkills.push({ candidate: candStr, reason: 'Not found in resume text' })
    }
  }

  // Step 2: High Recall - Scan skillsSectionText & rawText against SKILLS_DICTIONARY
  const scanTargetText = normSkillsSectionText.length > 30 ? normSkillsSectionText : normRawText
  for (const item of SKILLS_DICTIONARY) {
    if (verifiedMap.has(item.canonical)) continue

    for (const alias of item.aliases) {
      const normAlias = normalizeText(alias)
      if (!normAlias || normAlias.length < 2) continue

      const escaped = normAlias.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const reg = new RegExp(`(?:^|[^a-z0-9+#.])${escaped}(?:$|[^a-z0-9+#.])`, 'i')

      if (reg.test(scanTargetText)) {
        const evidence = findEvidence(skillsSectionText.length > 20 ? skillsSectionText : rawText, alias)
        verifiedMap.set(item.canonical, {
          name: item.canonical,
          category: item.category || 'technical',
          evidence,
          sourceText: alias,
          confidence: 'high'
        })
        debugLogs.push({ status: 'RECALLED_FROM_TEXT', canonical: item.canonical, category: item.category || 'technical', sourceText: alias })
        break
      }
    }
  }

  const allVerified = Array.from(verifiedMap.values())
  const technicalSkills = allVerified.filter(s => s.category === 'technical')
  const softSkills = allVerified.filter(s => s.category === 'soft')

  return {
    finalSkills: allVerified,
    technicalSkills,
    softSkills,
    removedSkills,
    debugLogs
  }
}

export {
  SKILLS_DICTIONARY,
  normalizeText,
  findEvidence,
  extractExplicitSkillsSectionText,
  verifySkillsAgainstText
}
