const API_URL = '/api/ai/roadmap'

function generateSkillBreakdown(skills = [], targetRole = '') {
  const masterSkillDatabase = {
    'react': {
      howToDevelop: [
        'Study JSX syntax, functional components, and props on React.dev (Describing the UI)',
        'Master core hooks: useState for state management & useEffect for API fetching',
        'Learn component lifecycle, prop drilling solutions, and custom hooks'
      ],
      platformResources: [
        { name: 'React.dev - Official Interactive Docs', url: 'https://react.dev/learn' },
        { name: 'freeCodeCamp - React Beginner Course', url: 'https://freecodecamp.org' },
        { name: 'Scrimba - Interactive React Bootcamp', url: 'https://scrimba.com' }
      ],
      actionableTask: 'Build an interactive weather & dashboard app fetching live API data with loading & error states.'
    },
    'javascript': {
      howToDevelop: [
        'Master modern ES6+ syntax: let/const, arrow functions, destructuring, spread/rest operator',
        'Understand Asynchronous JavaScript: Event Loop, Promises, Async/Await, and Fetch API',
        'Learn DOM manipulation, event handlers, and array methods (map, filter, reduce)'
      ],
      platformResources: [
        { name: 'MDN Web Docs - JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
        { name: 'javascript.info - Modern JavaScript Tutorial', url: 'https://javascript.info' },
        { name: 'LeetCode - 30 Days of JavaScript', url: 'https://leetcode.com' }
      ],
      actionableTask: 'Write a data transformation script parsing complex nested JSON data using array higher-order methods.'
    },
    'typescript': {
      howToDevelop: [
        'Learn basic primitive types, type annotations, and function signatures',
        'Master Interfaces vs Type Aliases, Generics, and Union/Intersection types',
        'Configure tsconfig.json and migrate JavaScript code to strict TypeScript'
      ],
      platformResources: [
        { name: 'TypeScript Handbook & Interactive Playground', url: 'https://typescriptlang.org/docs/' },
        { name: 'Total TypeScript Core Concepts', url: 'https://totaltypescript.com' }
      ],
      actionableTask: 'Convert an existing JavaScript module into strict TypeScript with zero implicit "any" types.'
    },
    'node': {
      howToDevelop: [
        'Understand Node.js architecture, non-blocking Event Loop, and module system (CommonJS/ESM)',
        'Build RESTful API endpoints using Express.js routing, middleware, and request validation',
        'Connect Node server to databases (MongoDB/PostgreSQL) with async error handling'
      ],
      platformResources: [
        { name: 'Node.js Official API Documentation', url: 'https://nodejs.org/docs/latest/api/' },
        { name: 'The Odin Project - NodeJS Path', url: 'https://theodinproject.com' }
      ],
      actionableTask: 'Build a secure Express REST server with JSON web tokens (JWT) authentication and CORS configuration.'
    },
    'sql': {
      howToDevelop: [
        'Master fundamental queries: SELECT, WHERE, GROUP BY, HAVING, ORDER BY',
        'Learn relational table joins (INNER, LEFT, RIGHT, FULL OUTER) and aggregate functions',
        'Understand database indexing, normalization (1NF to 3NF), and subqueries'
      ],
      platformResources: [
        { name: 'PostgreSQL Official Tutorial', url: 'https://postgresqltutorial.com' },
        { name: 'SQLBolt - Interactive SQL Exercises', url: 'https://sqlbolt.com' }
      ],
      actionableTask: 'Design a 3-table normalized relational schema and execute multi-join reporting queries.'
    },
    'python': {
      howToDevelop: [
        'Learn core syntax, data structures (lists, dicts, tuples, sets), and control flow',
        'Master Object-Oriented Programming (classes, inheritance) and virtual environments (venv)',
        'Explore domain frameworks (Pandas/NumPy for data science or FastAPI/Django for backend)'
      ],
      platformResources: [
        { name: 'Python Official Documentation & Tutorials', url: 'https://docs.python.org/3/tutorial/' },
        { name: 'Real Python In-Depth Guides', url: 'https://realpython.com' }
      ],
      actionableTask: 'Build a Python CLI application that fetches data from a public API, parses JSON, and exports a CSV report.'
    },
    'docker': {
      howToDevelop: [
        'Understand containerization fundamentals vs virtual machines',
        'Write Dockerfiles using multi-stage builds and minimal base images',
        'Orchestrate multi-container web & database environments using Docker Compose'
      ],
      platformResources: [
        { name: 'Docker Official Documentation & Guides', url: 'https://docs.docker.com/get-started/' },
        { name: 'KodeKloud - Docker for Beginners', url: 'https://kodekloud.com' }
      ],
      actionableTask: 'Containerize a full-stack web application and database using docker-compose.yml.'
    },
    'html': {
      howToDevelop: [
        'Master semantic HTML5 tags (header, nav, main, section, article, footer)',
        'Learn form controls, input validations, accessibility (ARIA attributes), and SEO metadata',
        'Understand DOM structure and document outline best practices'
      ],
      platformResources: [
        { name: 'MDN Web Docs - HTML Structure', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
        { name: 'freeCodeCamp - Responsive Web Design', url: 'https://freecodecamp.org' }
      ],
      actionableTask: 'Build an accessible, responsive landing page using semantic HTML5 tags and clean meta tags.'
    },
    'css': {
      howToDevelop: [
        'Master CSS Box Model (margin, border, padding, content)',
        'Learn modern layout systems: Flexbox for 1D layouts and CSS Grid for 2D layouts',
        'Understand responsive design with media queries, CSS variables, and animations'
      ],
      platformResources: [
        { name: 'CSS-Tricks - Complete Guide to Flexbox & Grid', url: 'https://css-tricks.com' },
        { name: 'MDN Web Docs - CSS Styling', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' }
      ],
      actionableTask: 'Create a fully responsive CSS Grid & Flexbox gallery layout that adapts seamlessly to mobile screens.'
    },
    'tailwind': {
      howToDevelop: [
        'Learn utility-first CSS concepts, class naming conventions, and layout primitives',
        'Master responsive modifiers (sm:, md:, lg:), state variants (hover:, focus:, dark:)',
        'Configure tailwind.config.js for custom themes, colors, and typography'
      ],
      platformResources: [
        { name: 'Tailwind CSS Official Documentation', url: 'https://tailwindcss.com/docs' },
        { name: 'Tailwind Labs YouTube Channel', url: 'https://youtube.com/@TailwindLabs' }
      ],
      actionableTask: 'Style a modern dashboard UI featuring glassmorphism and dark mode toggle using Tailwind utility classes.'
    },
    'git': {
      howToDevelop: [
        'Learn core Git commands: git init, add, commit, status, log, diff',
        'Master branching workflows: git branch, checkout/switch, merge, and rebase basics',
        'Collaborate on GitHub: remotes, pull requests, resolving merge conflicts, and GitHub Actions'
      ],
      platformResources: [
        { name: 'Pro Git Book (Official Free Book)', url: 'https://git-scm.com/book/en/v2' },
        { name: 'GitHub Skills Interactive Courses', url: 'https://skills.github.com' }
      ],
      actionableTask: 'Create a open-source repository on GitHub, create a feature branch, open a PR, and merge it.'
    },
    'aws': {
      howToDevelop: [
        'Learn cloud computing concepts, IAM roles, and security policies',
        'Master core services: EC2 for compute, S3 for storage, RDS for managed databases',
        'Understand serverless (Lambda), API Gateway, and CloudFront CDN distribution'
      ],
      platformResources: [
        { name: 'AWS Skill Builder Official Portal', url: 'https://skillbuilder.aws' },
        { name: 'freeCodeCamp - AWS Cloud Practitioner Course', url: 'https://freecodecamp.org' }
      ],
      actionableTask: 'Deploy a static web application to AWS S3 with CloudFront HTTPS distribution.'
    }
  }

  const list = Array.isArray(skills) && skills.length > 0 ? skills : ['Core Fundamentals']

  return list.map((skillName) => {
    const sLower = String(skillName).toLowerCase()
    let found = null
    for (const key in masterSkillDatabase) {
      if (sLower.includes(key)) {
        found = masterSkillDatabase[key]
        break
      }
    }

    if (found) {
      return {
        skill: skillName,
        howToDevelop: found.howToDevelop,
        platformResources: found.platformResources,
        actionableTask: found.actionableTask
      }
    }

    return {
      skill: skillName,
      howToDevelop: [
        `Step 1: Study core concepts and official syntax for ${skillName}`,
        `Step 2: Follow interactive tutorials and code-alongs on MDN / freeCodeCamp for ${skillName}`,
        `Step 3: Build a practical mini-feature implementing ${skillName} to validate mastery`
      ],
      platformResources: [
        { name: `MDN Web Docs - ${skillName} Guide`, url: 'https://developer.mozilla.org' },
        { name: `freeCodeCamp - ${skillName} Tutorials`, url: 'https://freecodecamp.org' },
        { name: `Exercism - Interactive ${skillName} Practice`, url: 'https://exercism.org' }
      ],
      actionableTask: `Build a standalone application or feature demonstrating core capabilities of ${skillName}.`
    }
  })
}

function createLocalFallbackRoadmap({ targetRole, currentSkills = [], missingSkills = {} }) {
  const critical = Array.isArray(missingSkills.critical) ? missingSkills.critical : []
  const important = Array.isArray(missingSkills.important) ? missingSkills.important : []
  const niceToHave = Array.isArray(missingSkills.niceToHave) ? missingSkills.niceToHave : []

  const milestone1Skills = critical.length > 0 ? critical : (currentSkills.length > 0 ? currentSkills.slice(0, 3) : ['Core Fundamentals'])
  const milestone2Skills = important.length > 0 ? important : ['Intermediate Tooling', 'System Integration']
  const milestone3Skills = niceToHave.length > 0 ? niceToHave : ['Advanced Optimization', 'Portfolio & Deployment']

  return {
    role: targetRole,
    personalizedSummary: `Personalized 12-week comprehensive learning path designed for your transition into ${targetRole}, closing critical skill gaps through step-by-step topics, verified resources, and real-world projects.`,
    totalEstimatedDuration: '12 weeks (approx 120 total study hours)',
    milestones: [
      {
        id: 'm1',
        title: `Phase 1: Master Critical Core Fundamentals`,
        goal: `Build production-ready mastery in top critical skill gaps required for ${targetRole}.`,
        whyItMatters: `Without foundational strength in these core skills, advanced architectural patterns cannot be effectively applied.`,
        estimatedDuration: '4 weeks',
        skillsCovered: milestone1Skills,
        skillBreakdown: generateSkillBreakdown(milestone1Skills, targetRole),
        project: {
          title: `Foundational ${targetRole} Application`,
          description: `Build a full-featured baseline project applying core fundamentals with error handling and persistent state.`,
          skillsDemonstrated: milestone1Skills,
          difficulty: 'Beginner to Intermediate',
          estimatedDuration: '10 hours',
          completionCriteria: ['Application builds cleanly', 'Includes API integration or state persistence', 'Passes fundamental unit tests']
        }
      },
      {
        id: 'm2',
        title: `Phase 2: Intermediate Capabilities & Workflow Integration`,
        goal: `Expand technical capabilities into supporting frameworks and database integration.`,
        whyItMatters: `Real-world applications require seamless integration between frontend, backend, and database layers.`,
        estimatedDuration: '4 weeks',
        skillsCovered: milestone2Skills,
        skillBreakdown: generateSkillBreakdown(milestone2Skills, targetRole),
        project: {
          title: `Integrated Multi-Feature Web Application`,
          description: `Develop a complete multi-tier application with authenticated workflows and CRUD data management.`,
          skillsDemonstrated: milestone2Skills,
          difficulty: 'Intermediate',
          estimatedDuration: '15 hours',
          completionCriteria: ['Includes user input validation', 'Handles database or state updates', 'Clean modular folder structure']
        }
      },
      {
        id: 'm3',
        title: `Phase 3: Specialization, Capstone & Deployment`,
        goal: `Polish architecture, performance, deployment pipeline, and portfolio presentation.`,
        whyItMatters: `Demonstrates career readiness and portfolio quality to potential employers.`,
        estimatedDuration: '4 weeks',
        skillsCovered: milestone3Skills,
        skillBreakdown: generateSkillBreakdown(milestone3Skills, targetRole),
        project: {
          title: `Production Capstone Project for ${targetRole}`,
          description: `Deploy a production-ready capstone project with automated CI/CD, documentation, and live demo link.`,
          skillsDemonstrated: milestone3Skills,
          difficulty: 'Advanced',
          estimatedDuration: '20 hours',
          completionCriteria: ['Deployed to live hosting platform', 'Includes comprehensive README and setup guide', 'Optimized for performance']
        }
      }
    ]
  }
}

export async function generateRoadmap({ targetRole, currentSkills, missingSkills, matchedSkills }) {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        targetRole,
        currentSkills,
        missingSkills,
        matchedSkills,
      }),
    })
    clearTimeout(timeoutId)

    if (!response.ok) {
      return createLocalFallbackRoadmap({ targetRole, currentSkills, missingSkills })
    }

    const data = await response.json()
    if (!data || !Array.isArray(data.milestones) || data.milestones.length === 0) {
      return createLocalFallbackRoadmap({ targetRole, currentSkills, missingSkills })
    }

    return data
  } catch (err) {
    console.warn('Backend API request timed out or failed, using client fallback roadmap.', err)
    return createLocalFallbackRoadmap({ targetRole, currentSkills, missingSkills })
  }
}