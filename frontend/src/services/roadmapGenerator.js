const API_URL = '/api/ai/roadmap'

function getSpecificResourcesForSkills(skills = [], targetRole = '') {
  const resourceMap = [
    { keys: ['react', 'reactjs'], resources: ['React Official Documentation (react.dev)', 'freeCodeCamp - Learn React Full Course', 'Scrimba - Interactive React Bootcamp'] },
    { keys: ['javascript', 'js', 'es6'], resources: ['MDN Web Docs - JavaScript Guide (developer.mozilla.org)', 'javascript.info - Modern JavaScript Tutorial', 'freeCodeCamp - JS Algorithms & Data Structures'] },
    { keys: ['typescript'], resources: ['TypeScript Handbook (typescriptlang.org)', 'ExecuteProgram - TypeScript Core', 'Total TypeScript by Matt Pocock'] },
    { keys: ['node', 'nodejs', 'express'], resources: ['Node.js Official Documentation (nodejs.org/docs)', 'The Odin Project - Node.js Curriculum', 'Express.js Getting Started Guide'] },
    { keys: ['html', 'css', 'tailwind', 'sass'], resources: ['MDN Web Docs - HTML & CSS Essentials', 'Tailwind CSS Documentation (tailwindcss.com)', 'CSS-Tricks Fundamentals & Flexbox Guide'] },
    { keys: ['sql', 'postgresql', 'postgres', 'mysql'], resources: ['PostgreSQL Tutorial (postgresqltutorial.com)', 'SQLBolt - Interactive SQL Lessons (sqlbolt.com)', 'Mode Analytics SQL Guide'] },
    { keys: ['python', 'pandas', 'numpy'], resources: ['Python Official Documentation (docs.python.org)', 'Real Python Tutorials (realpython.com)', 'Kaggle Learn - Python & Data Analysis'] },
    { keys: ['machine learning', 'ml', 'ai', 'deep learning'], resources: ['Fast.ai - Practical Deep Learning for Coders', 'Coursera - Machine Learning Specialization by Andrew Ng', 'Kaggle Learn - Machine Learning Courses'] },
    { keys: ['docker', 'kubernetes', 'devops'], resources: ['Docker Official Docs & Getting Started (docs.docker.com)', 'KodeKloud - DevOps & Kubernetes Basics', 'Learn X in Y minutes - Docker'] },
    { keys: ['aws', 'cloud', 'azure'], resources: ['AWS Skill Builder (skillbuilder.aws)', 'AWS Official Developer Documentation', 'freeCodeCamp - AWS Certified Practitioner Course'] },
    { keys: ['git', 'github'], resources: ['Pro Git Book (git-scm.com/book)', 'GitHub Skills Interactive Tutorials (skills.github.com)'] },
    { keys: ['system design', 'architecture'], resources: ['System Design Primer (github.com/donnemartin/system-design-primer)', 'ByteByteGo System Design Fundamentals'] },
    { keys: ['figma', 'ui/ux', 'design'], resources: ['Figma Learn & Design Systems (figma.com/resources/learn)', 'UX Design Institute Guides'] },
  ]

  const matched = new Set()
  const lowerSkills = skills.map((s) => String(s).toLowerCase())

  resourceMap.forEach(({ keys, resources }) => {
    if (keys.some((key) => lowerSkills.some((s) => s.includes(key)))) {
      resources.forEach((r) => matched.add(r))
    }
  })

  if (matched.size === 0) {
    matched.add(`MDN Web Docs & Official Documentation for ${skills[0] || targetRole}`)
    matched.add(`freeCodeCamp & YouTube Tutorials for ${skills[0] || targetRole}`)
    matched.add(`Exercism.org & GitHub Interactive Labs`)
  }

  return Array.from(matched).slice(0, 4)
}

function createLocalFallbackRoadmap({ targetRole, currentSkills = [], missingSkills = {} }) {
  const critical = Array.isArray(missingSkills.critical) ? missingSkills.critical : []
  const important = Array.isArray(missingSkills.important) ? missingSkills.important : []
  const niceToHave = Array.isArray(missingSkills.niceToHave) ? missingSkills.niceToHave : []

  const milestone1Skills = critical.length > 0 ? critical : (currentSkills.length > 0 ? currentSkills.slice(0, 3) : ['Core Fundamentals'])
  const milestone2Skills = important.length > 0 ? important : ['Advanced Concepts', 'Framework Integration']
  const milestone3Skills = niceToHave.length > 0 ? niceToHave : ['Best Practices', 'Portfolio & Deployment']

  return {
    milestones: [
      {
        title: `Phase 1: Master Core Fundamentals for ${targetRole}`,
        focus: 'Focus on high-priority critical skill gaps and core requirements.',
        skills: milestone1Skills,
        resources: getSpecificResourcesForSkills(milestone1Skills, targetRole),
        estimatedWeeks: 4,
        projects: [`Build a foundational ${targetRole} project`],
      },
      {
        title: `Phase 2: Intermediate Capabilities & Workflow`,
        focus: 'Deepen knowledge in supporting tools and core framework capabilities.',
        skills: milestone2Skills,
        resources: getSpecificResourcesForSkills(milestone2Skills, targetRole),
        estimatedWeeks: 4,
        projects: [`Develop a multi-feature portfolio application`],
      },
      {
        title: `Phase 3: Specialization & Career Readiness`,
        focus: 'Polish portfolio, performance optimization, and project deployment.',
        skills: milestone3Skills,
        resources: getSpecificResourcesForSkills(milestone3Skills, targetRole),
        estimatedWeeks: 4,
        projects: [`Build capstone project for ${targetRole}`],
      },
    ],
    estimatedTotalWeeks: 12,
    summary: `Personalized 12-week roadmap designed to transition into ${targetRole}, closing priority skill gaps with specific learning resources while building on your existing experience.`,
  }
}

export async function generateRoadmap({ targetRole, currentSkills, missingSkills, matchedSkills }) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole,
        currentSkills,
        missingSkills,
        matchedSkills,
      }),
    })

    if (!response.ok) {
      return createLocalFallbackRoadmap({ targetRole, currentSkills, missingSkills })
    }

    const data = await response.json()
    if (!data || !Array.isArray(data.milestones) || data.milestones.length === 0) {
      return createLocalFallbackRoadmap({ targetRole, currentSkills, missingSkills })
    }

    return data
  } catch (err) {
    console.warn('Backend unavailable, using client fallback roadmap.', err)
    return createLocalFallbackRoadmap({ targetRole, currentSkills, missingSkills })
  }
}