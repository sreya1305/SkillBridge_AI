import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifySkillsAgainstText } from './skillsDictionary.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath = '.env') {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
}

loadEnvFile(resolve(__dirname, '.env'));

const AI_API_KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
const AI_API_BASE_URL = process.env.GEMINI_API_BASE_URL || process.env.AI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const PORT = process.env.PORT || 4000;

if (!AI_API_KEY) {
  console.warn('GEMINI_API_KEY environment variable is missing. Server running with fallback generation mode.');
}

function getApiUrl(path) {
  const base = AI_API_BASE_URL.endsWith('/') ? AI_API_BASE_URL : AI_API_BASE_URL + '/';
  return new URL(path, base).toString();
}

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
        `Step 1: Study core concepts, regulations, and frameworks for ${skillName}`,
        `Step 2: Review official documentation, case studies, or reference materials for ${skillName}`,
        `Step 3: Complete practical exercises and real-world scenarios applying ${skillName}`
      ],
      platformResources: [
        { name: `Coursera & edX - Professional ${skillName} Courses`, url: 'https://coursera.org' },
        { name: `LinkedIn Learning - ${skillName} Masterclass`, url: 'https://linkedin.com/learning' },
        { name: `Official Reference Guides & Domain Manuals`, url: 'https://google.com' }
      ],
      actionableTask: `Execute a practical case study or project scenario demonstrating core capabilities of ${skillName}.`
    }
  })
}

function createFallbackRoadmap(targetRole, currentSkills = [], missingSkills = {}) {
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

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/bmp',
  'image/tiff',
]

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF, DOCX, or image files (PNG, JPG, WEBP, BMP, TIFF) are allowed.'))
    }
  },
})

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', proxy: true });
});

app.post('/api/ai/proxy', async (req, res) => {
  const { path, method = 'POST', body } = req.body;

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Request body must include a string `path`.' });
  }

  if (/^https?:\/\//i.test(path)) {
    return res.status(400).json({ error: 'Absolute URLs are not allowed. Use a relative path instead.' });
  }

  const targetUrl = getApiUrl(path);

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': AI_API_KEY,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const responseBody = await response.text();
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return res.status(response.status).json(JSON.parse(responseBody));
    }

    res.status(response.status).send(responseBody);
  } catch (error) {
    console.error('AI proxy request failed:', error);
    res.status(502).json({ error: 'AI proxy request failed', details: error.message });
  }
});

process.on('uncaughtException', (err) => {
  console.warn('[server] Uncaught exception prevented:', err.message || err)
})

process.on('unhandledRejection', (reason) => {
  console.warn('[server] Unhandled rejection prevented:', reason)
})

async function safeOcrImage(buffer) {
  if (!buffer) return ''
  let worker = null
  try {
    console.log('[resume-parser] Running Tesseract OCR worker on image buffer...')
    worker = await Tesseract.createWorker('eng')
    const { data } = await worker.recognize(buffer)
    await worker.terminate()
    const extractedText = data?.text || ''
    console.log('[resume-parser] OCR successfully extracted', extractedText.length, 'characters of text.')
    return extractedText
  } catch (err) {
    console.warn('[resume-parser] OCR text extraction warning:', err.message)
    if (worker) {
      try { await worker.terminate() } catch {}
    }
    return ''
  }
}

function fallbackParseResumeText(text = '', fileName = '') {
  const combinedText = (text || '') + ' ' + (fileName || '')
  if (!combinedText.trim()) {
    return {
      success: true,
      data: { skills: [], technicalSkills: [], softSkills: [], verifiedSkills: [], education: [], experience: [], certifications: [] },
      skills: [], technicalSkills: [], softSkills: [], verifiedSkills: [], education: [], experience: [], certifications: []
    }
  }

  const verificationResult = verifySkillsAgainstText([], combinedText)
  const finalVerifiedObjects = verificationResult.finalSkills
  const finalSkillNames = finalVerifiedObjects.map((s) => s.name)
  const technicalSkillNames = verificationResult.technicalSkills.map((s) => s.name)
  const softSkillNames = verificationResult.softSkills.map((s) => s.name)

  return {
    success: true,
    data: {
      skills: finalSkillNames,
      technicalSkills: technicalSkillNames,
      softSkills: softSkillNames,
      verifiedSkills: finalVerifiedObjects,
      verifiedTechnicalSkills: verificationResult.technicalSkills,
      verifiedSoftSkills: verificationResult.softSkills,
      education: [],
      experience: [],
      certifications: []
    },
    skills: finalSkillNames,
    technicalSkills: technicalSkillNames,
    softSkills: softSkillNames,
    verifiedSkills: finalVerifiedObjects,
    verifiedTechnicalSkills: verificationResult.technicalSkills,
    verifiedSoftSkills: verificationResult.softSkills,
    debugPipeline: {
      rawTextLength: combinedText.length,
      candidateSkills: [],
      removedSkills: verificationResult.removedSkills,
      finalSkills: finalVerifiedObjects,
      debugLogs: verificationResult.debugLogs
    }
  }
}

const handleResumeParsingRequest = async (req, res) => {
  let resumeText = ''
  const fileName = req.file?.originalname || ''

  try {
    if (req.file && req.file.buffer) {
      const mime = (req.file.mimetype || '').toLowerCase()
      if (mime.startsWith('image/')) {
        console.log('[resume-parser] Image file uploaded:', fileName, 'MIME:', mime)
        resumeText = await safeOcrImage(req.file.buffer)
      } else if (mime === 'application/pdf') {
        try {
          const parser = new PDFParse({ data: req.file.buffer })
          const data = await parser.getText()
          resumeText = data?.text || ''
          console.log('[resume-parser] PDF text successfully extracted:', resumeText.length, 'characters')
        } catch (pdfErr) {
          console.warn('[resume-parser] PDF extraction warning:', pdfErr.message)
        }
      } else {
        try {
          const result = await mammoth.extractRawText({ buffer: req.file.buffer })
          resumeText = result.value || ''
        } catch (docErr) {
          console.warn('[resume-parser] DOCX extraction warning:', docErr.message)
        }
      }
    } else {
      try {
        resumeText = String(req.body?.resumeText || '').trim()
      } catch {
        resumeText = ''
      }
    }

    const isImageFile = req.file && req.file.mimetype && req.file.mimetype.startsWith('image/')

    if (!AI_API_KEY) {
      console.warn('[resume-parser] GEMINI_API_KEY missing. Returning fallback skills.')
      return res.status(200).json(fallbackParseResumeText(resumeText, fileName))
    }

    let geminiMime = req.file?.mimetype || 'image/jpeg'
    if (geminiMime === 'image/jpg') geminiMime = 'image/jpeg'

    const prompt = [
      'You are a high-precision AI resume skills analyst.',
      'CRITICAL MANDATE: Extract skills ONLY from the candidate\'s explicit SKILLS, TECHNICAL SKILLS, TECHNOLOGIES, TOOLS, LANGUAGES, or COMPETENCIES sections in the resume.',
      'DO NOT extract technologies or tools mentioned exclusively inside Project descriptions or team projects (as projects may be group projects where the candidate did not personally handle every listed technology).',
      'RULES:',
      '1. Extract all technical & soft skills explicitly listed in the candidate\'s skills sections.',
      '2. Standardize recognized abbreviations (e.g., JS -> JavaScript, ReactJS -> React, ML -> Machine Learning, Py -> Python, Postgres -> PostgreSQL, sklearn -> scikit-learn).',
      '3. DO NOT infer unmentioned skills or related skills.',
      '4. Return ONLY a valid JSON object formatted as: { "skills": ["Skill1", "Skill2", ...] }'
    ].join(' ')

    const userParts = [{ text: prompt }]

    if (isImageFile && req.file.buffer) {
      userParts.push({
        inlineData: {
          mimeType: geminiMime,
          data: req.file.buffer.toString('base64'),
        },
      })
      if (resumeText && resumeText.trim()) {
        userParts.push({ text: '---RESUME_TEXT_START---\n' + resumeText + '\n---RESUME_TEXT_END---' })
      }
    } else {
      userParts.push({ text: '---RESUME_TEXT_START---\n' + (resumeText || fileName) + '\n---RESUME_TEXT_END---' })
    }

    const contents = [{ role: 'user', parts: userParts }]

    const response = await fetch(
      getApiUrl('models/gemini-2.0-flash:generateContent'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': AI_API_KEY,
        },
        body: JSON.stringify({
          contents,
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    )

    if (!response.ok) {
      console.warn('[resume-parser] AI provider status:', response.status, '- using fallback parser.')
      return res.status(200).json(fallbackParseResumeText(resumeText, fileName))
    }

    const responseText = await response.text()
    let aiResponse = {}
    try {
      aiResponse = JSON.parse(responseText)
    } catch {
      return res.status(200).json(fallbackParseResumeText(resumeText, fileName))
    }

    const content = aiResponse.candidates?.[0]?.content?.parts?.find((part) => typeof part?.text === 'string')?.text

    if (!content) {
      return res.status(200).json(fallbackParseResumeText(resumeText, fileName))
    }

    let parsed = {}
    try {
      parsed = JSON.parse(content)
    } catch {
      return res.status(200).json(fallbackParseResumeText(resumeText, fileName))
    }

    const rawSkills = Array.isArray(parsed?.skills) ? parsed.skills : []
    const aiSkillCandidates = rawSkills
      .map((s) => (typeof s === 'string' ? s : (s.name || s.skill || '')))
      .filter((s) => typeof s === 'string' && s.trim())
      .map((s) => s.trim())

    // Deterministic Normalization & Evidence Verification Layer
    const verificationResult = verifySkillsAgainstText(aiSkillCandidates, resumeText)
    const finalVerifiedObjects = verificationResult.finalSkills
    const finalSkillNames = finalVerifiedObjects.map((s) => s.name)

    // Log Pipeline Debugging Steps A - F
    console.log('\n============== RESUME PARSER PIPELINE DEBUG LOGS ==============')
    console.log('A. Raw Resume Text Length:', resumeText.length, 'chars')
    console.log('B. AI Candidate Skills:', aiSkillCandidates)
    console.log('C. Verified Final Skills:', finalSkillNames)
    console.log('D. Evidence Objects:', finalVerifiedObjects)
    console.log('E. Removed Skills:', verificationResult.removedSkills)
    console.log('=================================================================\n')

    const technicalSkillNames = verificationResult.technicalSkills.map((s) => s.name)
    const softSkillNames = verificationResult.softSkills.map((s) => s.name)

    return res.status(200).json({
      success: true,
      data: {
        skills: finalSkillNames,
        technicalSkills: technicalSkillNames,
        softSkills: softSkillNames,
        verifiedSkills: finalVerifiedObjects,
        verifiedTechnicalSkills: verificationResult.technicalSkills,
        verifiedSoftSkills: verificationResult.softSkills,
        education: [],
        experience: [],
        certifications: []
      },
      skills: finalSkillNames,
      technicalSkills: technicalSkillNames,
      softSkills: softSkillNames,
      verifiedSkills: finalVerifiedObjects,
      verifiedTechnicalSkills: verificationResult.technicalSkills,
      verifiedSoftSkills: verificationResult.softSkills,
      debugPipeline: {
        rawTextLength: resumeText.length,
        candidateSkills: aiSkillCandidates,
        removedSkills: verificationResult.removedSkills,
        finalSkills: finalVerifiedObjects,
        debugLogs: verificationResult.debugLogs
      }
    })
  } catch (globalErr) {
    console.error('[resume-parser] Unhandled request error, returning fallback:', globalErr)
    return res.status(200).json(fallbackParseResumeText('', req.file?.originalname || ''))
  }
}

// Multer route wrapper helper
const multerRouteWrapper = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: `File upload error: ${err.message}` } })
    }
    if (err) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.message } })
    }
    next()
  })
}

// Support both endpoint paths per PRD Section 17 & existing API
app.post('/api/ai/resume-parser', multerRouteWrapper, handleResumeParsingRequest)
app.post('/api/resume/parse', multerRouteWrapper, handleResumeParsingRequest)


app.post('/api/ai/roadmap', async (req, res) => {
  const targetRole = String(req.body?.targetRole || '').trim()
  const currentSkills = Array.isArray(req.body?.currentSkills) ? req.body.currentSkills.filter((item) => typeof item === 'string').slice(0, 100) : []
  const missingSkillsRaw = req.body?.missingSkills || {}
  const matchedSkills = Array.isArray(req.body?.matchedSkills) ? req.body.matchedSkills.filter((item) => typeof item === 'string').slice(0, 100) : []

  const missingSkills = {}
  if (missingSkillsRaw && typeof missingSkillsRaw === 'object') {
    ;['critical', 'important', 'niceToHave'].forEach((category) => {
      const value = missingSkillsRaw[category]
      if (Array.isArray(value)) {
        missingSkills[category] = value.filter((item) => typeof item === 'string').slice(0, 20)
      }
    })
  }

  if (!targetRole) {
    return res.status(400).json({ error: 'targetRole is required.' })
  }

  if (!AI_API_KEY) {
    console.warn('Using fallback roadmap because GEMINI_API_KEY is not configured.')
    return res.status(200).json(createFallbackRoadmap(targetRole, currentSkills, missingSkills))
  }

  const prompt = [
    'Act as an expert career mentor and personalized learning-path designer.',
    'Generate a highly specific, practical roadmap for the target role.',
    'Do NOT create a generic roadmap. Every roadmap step must tell the user exactly:',
    '1. What to learn. 2. Why they need to learn it. 3. Specific subtopics to study. 4. A specific learning resource with real URL. 5. Estimated time required. 6. Practical task. 7. Completion criteria.',
    'Schema JSON structure MUST BE EXCLUSIVELY:',
    '{\n' +
    '  "role": "string",\n' +
    '  "personalizedSummary": "string",\n' +
    '  "totalEstimatedDuration": "string",\n' +
    '  "milestones": [\n' +
    '    {\n' +
    '      "id": "string",\n' +
    '      "title": "string",\n' +
    '      "goal": "string",\n' +
    '      "whyItMatters": "string",\n' +
    '      "estimatedDuration": "string",\n' +
    '      "skillsCovered": ["string"],\n' +
    '      "learningSteps": [\n' +
    '        {\n' +
    '          "topic": "string",\n' +
    '          "subtopics": ["string"],\n' +
    '          "whyLearnThis": "string",\n' +
    '          "resource": {\n' +
    '            "title": "string",\n' +
    '            "type": "string",\n' +
    '            "platform": "string",\n' +
    '            "url": "string"\n' +
    '          },\n' +
    '          "estimatedStudyTime": "string",\n' +
    '          "practicalTask": "string",\n' +
    '          "completionCriteria": ["string"]\n' +
    '        }\n' +
    '      ],\n' +
    '      "project": {\n' +
    '        "title": "string",\n' +
    '        "description": "string",\n' +
    '        "skillsDemonstrated": ["string"],\n' +
    '        "difficulty": "string",\n' +
    '        "estimatedDuration": "string",\n' +
    '        "completionCriteria": ["string"]\n' +
    '      }\n' +
    '    }\n' +
    '  ]\n' +
    '}',
    'Return ONLY valid JSON.'
  ].join(' ')

  const contents = [
    {
      role: 'user',
      parts: [
        { text: prompt },
        { text: 'TARGET ROLE: ' + targetRole },
        { text: 'CURRENT SKILLS: ' + JSON.stringify(currentSkills) },
        { text: 'MATCHED SKILLS: ' + JSON.stringify(matchedSkills) },
        { text: 'CRITICAL GAPS: ' + JSON.stringify(missingSkills.critical || []) },
        { text: 'IMPORTANT GAPS: ' + JSON.stringify(missingSkills.important || []) },
        { text: 'NICE TO HAVE GAPS: ' + JSON.stringify(missingSkills.niceToHave || []) },
      ],
    },
  ]

  try {
    const response = await fetch(
      getApiUrl('models/gemini-2.0-flash:generateContent'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': AI_API_KEY,
        },
        body: JSON.stringify({
          contents,
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    )

    const responseBody = await response.text()
    const contentType = response.headers.get('content-type') || ''
    console.log('[roadmap] ai status', response.status, 'contentType', contentType, 'body', responseBody)

    if (!response.ok) {
      console.warn('AI request failed, falling back to generated roadmap. Status:', response.status, responseBody)
      return res.status(200).json(createFallbackRoadmap(targetRole, currentSkills, missingSkills))
    }

    let aiResponse
    if (contentType.includes('application/json')) {
      aiResponse = JSON.parse(responseBody)
    } else {
      console.warn('AI response non-JSON, falling back.')
      return res.status(200).json(createFallbackRoadmap(targetRole, currentSkills, missingSkills))
    }

    const content = aiResponse.candidates?.[0]?.content?.parts?.find((part) => typeof part?.text === 'string')?.text

    if (!content) {
      return res.status(200).json(createFallbackRoadmap(targetRole, currentSkills, missingSkills))
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      return res.status(200).json(createFallbackRoadmap(targetRole, currentSkills, missingSkills))
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return res.status(200).json(createFallbackRoadmap(targetRole, currentSkills, missingSkills))
    }

    const rawMilestones = Array.isArray(parsed.milestones) ? parsed.milestones.filter((item) => item && typeof item === 'object').slice(0, 10) : []
    
    if (rawMilestones.length === 0) {
      return res.status(200).json(createFallbackRoadmap(targetRole, currentSkills, missingSkills))
    }

    const sanitizedMilestones = rawMilestones.map((m, idx) => {
      const skillsCovered = Array.isArray(m.skillsCovered) ? m.skillsCovered.filter((item) => typeof item === 'string') : []
      const rawSteps = Array.isArray(m.learningSteps) ? m.learningSteps.filter((item) => item && typeof item === 'object') : []
      
      const learningSteps = rawSteps.length > 0
        ? rawSteps.map((step) => ({
            topic: typeof step.topic === 'string' ? step.topic : 'Core Concept',
            subtopics: Array.isArray(step.subtopics) ? step.subtopics.filter((st) => typeof st === 'string') : [],
            whyLearnThis: typeof step.whyLearnThis === 'string' ? step.whyLearnThis : 'Essential skill for target role.',
            resource: {
              title: typeof step.resource?.title === 'string' ? step.resource.title : 'Official Documentation',
              type: typeof step.resource?.type === 'string' ? step.resource.type : 'Documentation',
              platform: typeof step.resource?.platform === 'string' ? step.resource.platform : 'Official Docs',
              url: typeof step.resource?.url === 'string' ? step.resource.url : 'https://developer.mozilla.org'
            },
            estimatedStudyTime: typeof step.estimatedStudyTime === 'string' ? step.estimatedStudyTime : '8 hours',
            practicalTask: typeof step.practicalTask === 'string' ? step.practicalTask : 'Implement a hands-on exercise.',
            completionCriteria: Array.isArray(step.completionCriteria) ? step.completionCriteria.filter((cc) => typeof cc === 'string') : ['Completed task successfully']
          }))
        : skillsCovered.flatMap((s) => generateLearningStepsForSkill(s, targetRole))

      const rawProj = m.project && typeof m.project === 'object' ? m.project : {}
      const project = {
        title: typeof rawProj.title === 'string' ? rawProj.title : `Milestone ${idx + 1} Capstone Project`,
        description: typeof rawProj.description === 'string' ? rawProj.description : `Build a baseline project applying skills learned in this milestone.`,
        skillsDemonstrated: Array.isArray(rawProj.skillsDemonstrated) ? rawProj.skillsDemonstrated.filter((sd) => typeof sd === 'string') : skillsCovered,
        difficulty: typeof rawProj.difficulty === 'string' ? rawProj.difficulty : 'Intermediate',
        estimatedDuration: typeof rawProj.estimatedDuration === 'string' ? rawProj.estimatedDuration : '12 hours',
        completionCriteria: Array.isArray(rawProj.completionCriteria) ? rawProj.completionCriteria.filter((cc) => typeof cc === 'string') : ['Project builds cleanly', 'Includes documentation']
      }

      return {
        id: typeof m.id === 'string' ? m.id : `m${idx + 1}`,
        title: typeof m.title === 'string' ? m.title : `Phase ${idx + 1}: Skill Development`,
        goal: typeof m.goal === 'string' ? m.goal : `Master key target capabilities.`,
        whyItMatters: typeof m.whyItMatters === 'string' ? m.whyItMatters : `Required step towards becoming a ${targetRole}.`,
        estimatedDuration: typeof m.estimatedDuration === 'string' ? m.estimatedDuration : '4 weeks',
        skillsCovered,
        learningSteps,
        project
      }
    })

    const sanitized = {
      role: typeof parsed.role === 'string' ? parsed.role : targetRole,
      personalizedSummary: typeof parsed.personalizedSummary === 'string' ? parsed.personalizedSummary : `Personalized learning roadmap for ${targetRole}.`,
      totalEstimatedDuration: typeof parsed.totalEstimatedDuration === 'string' ? parsed.totalEstimatedDuration : '12 weeks',
      milestones: sanitizedMilestones
    }

    return res.status(200).json(sanitized)
  } catch (error) {
    console.error('Roadmap generation failed:', error)
    return res.status(200).json(createFallbackRoadmap(targetRole, currentSkills, missingSkills))
  }
})

// Alias POST /api/roadmap per PRD Section 17
app.post('/api/roadmap', async (req, res) => {
  const targetRole = String(req.body?.targetRole || req.body?.role || '').trim()
  const currentSkills = Array.isArray(req.body?.currentSkills || req.body?.skills) ? (req.body.currentSkills || req.body.skills).filter((item) => typeof item === 'string') : []
  const missingSkills = req.body?.missingSkills || {}
  return res.status(200).json(createFallbackRoadmap(targetRole || 'Full Stack Developer', currentSkills, missingSkills))
})

// GET /api/careers - PRD Section 17 & Appendix
app.get('/api/careers', (req, res) => {
  const careers = [
    { id: 'data-scientist', title: 'Data Scientist', skills: { critical: ['Python', 'SQL', 'Machine Learning'], important: ['Pandas', 'NumPy', 'Statistics'], niceToHave: ['Docker', 'AWS'] } },
    { id: 'software-developer', title: 'Software Developer', skills: { critical: ['JavaScript', 'Git', 'Data Structures'], important: ['TypeScript', 'Testing', 'Clean Code'], niceToHave: ['Docker', 'CI/CD'] } },
    { id: 'full-stack-developer', title: 'Full Stack Developer', skills: { critical: ['React', 'Node.js', 'SQL'], important: ['TypeScript', 'Express', 'Tailwind'], niceToHave: ['Docker', 'AWS'] } },
    { id: 'ui-ux-designer', title: 'UI/UX Designer', skills: { critical: ['Figma', 'User Research', 'Wireframing'], important: ['Prototyping', 'Design Systems'], niceToHave: ['HTML', 'CSS'] } },
    { id: 'cybersecurity-analyst', title: 'Cybersecurity Analyst', skills: { critical: ['Networking', 'Linux', 'Security Fundamentals'], important: ['SIEM Tools', 'Penetration Testing'], niceToHave: ['Python', 'Cloud Security'] } },
    { id: 'ai-engineer', title: 'AI Engineer', skills: { critical: ['Python', 'PyTorch/TensorFlow', 'LLMs & RAG'], important: ['Prompt Engineering', 'Vector DBs'], niceToHave: ['Docker', 'FastAPI'] } },
  ]
  res.json({ success: true, data: { careers } })
})

// POST /api/gap-analysis - PRD Section 17 & 12.4
app.post('/api/gap-analysis', (req, res) => {
  const userSkills = Array.isArray(req.body?.skills) ? req.body.skills : []
  const career = String(req.body?.career || req.body?.targetRole || 'Software Developer')
  const userLower = new Set(userSkills.map((s) => String(s).toLowerCase()))

  const cLower = career.toLowerCase()
  let requiredSkills = ['Core Domain Knowledge', 'Professional Ethics', 'Analytical Reasoning', 'Problem Solving', 'Task & Project Management', 'Reporting & Documentation']
  
  if (cLower.includes('tax') || cLower.includes('audit') || cLower.includes('accountant') || cLower.includes('finance') || cLower.includes('bank') || cLower.includes('revenue')) {
    requiredSkills = ['Taxation Laws & Regulations', 'Financial Auditing & Inspection', 'Accounting Principles', 'Tax Assessment & Filing', 'Legal Compliance', 'Financial Analysis']
  } else if (cLower.includes('data scientist') || cLower.includes('data science')) {
    requiredSkills = ['Python', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Statistics']
  } else if (cLower.includes('ui') || cLower.includes('ux') || cLower.includes('design')) {
    requiredSkills = ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'UI Design', 'Design Systems']
  } else if (cLower.includes('cyber') || cLower.includes('security')) {
    requiredSkills = ['Networking', 'Linux', 'Security Fundamentals', 'SIEM Tools', 'Penetration Testing', 'Incident Response']
  } else if (cLower.includes('manager') || cLower.includes('marketing') || cLower.includes('business') || cLower.includes('hr')) {
    requiredSkills = ['Strategic Planning', 'Project Leadership', 'Market Analysis', 'Financial Budgeting', 'Stakeholder Management', 'Data-Driven Decision Making']
  } else if (cLower.includes('developer') || cLower.includes('engineer') || cLower.includes('software') || cLower.includes('coder')) {
    requiredSkills = ['JavaScript', 'TypeScript', 'Node.js', 'SQL', 'Git', 'Docker']
  }

  const existingSkills = []
  const missingSkills = []

  requiredSkills.forEach((skill, idx) => {
    if (userLower.has(skill.toLowerCase())) {
      existingSkills.push(skill)
    } else {
      missingSkills.push({
        skill,
        priority: idx < 3 ? 'high' : 'nice-to-have',
        reason: `Essential capability for ${career}.`
      })
    }
  })

  res.json({
    success: true,
    data: {
      existingSkills,
      missingSkills
    }
  })
})

// POST /api/chat/stream - PRD Section 12.6 SSE streaming endpoint
app.post('/api/chat/stream', async (req, res) => {
  const message = String(req.body?.message || '').trim()
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  if (!message) {
    res.write(`data: ${JSON.stringify({ text: "Please ask a question about your career or roadmap." })}\n\n`)
    return res.end()
  }

  const chunks = [
    `Here is guidance regarding: "${message}". `,
    `To grow towards your target career, focus on project-based learning and closing critical skill gaps first. `,
    `Consistently build capstone projects and document your work in a portfolio.`
  ]

  for (const chunk of chunks) {
    res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`)
    await new Promise((r) => setTimeout(r, 150))
  }
  res.write('data: [DONE]\n\n')
  res.end()
})

// POST /api/roadmap/export - PRD Section 17
app.post('/api/roadmap/export', (req, res) => {
  const roadmap = req.body?.roadmap || {}
  const title = roadmap.role ? `# Learning Roadmap for ${roadmap.role}\n\n` : '# Career Learning Roadmap\n\n'
  const summary = roadmap.personalizedSummary ? `> ${roadmap.personalizedSummary}\n\n` : ''
  let content = title + summary + `Estimated Duration: ${roadmap.totalEstimatedDuration || '12 weeks'}\n\n`

  if (Array.isArray(roadmap.milestones)) {
    roadmap.milestones.forEach((m, i) => {
      content += `## Milestone ${i + 1}: ${m.title}\n`
      content += `- Goal: ${m.goal || ''}\n`
      content += `- Estimated Time: ${m.estimatedDuration || ''}\n`
      if (m.project) {
        content += `- Capstone Project: ${m.project.title} (${m.project.description || ''})\n`
      }
      content += '\n'
    })
  }

  res.setHeader('Content-Type', 'text/markdown')
  res.setHeader('Content-Disposition', 'attachment; filename="SkillBridge_Roadmap.md"')
  res.send(content)
})

app.listen(PORT, () => {
  console.log(`AI proxy server listening on http://localhost:${PORT}`);
});

