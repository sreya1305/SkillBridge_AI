import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageNav from '../components/PageNav'
import { getSkillGapAnalysis } from '../lib/skillGap'
import { getSelectedRole } from '../lib/roleStorage'
import { generateRoadmap } from '../services/roadmapGenerator'

const MASTER_SKILL_GUIDES = {
  'programming fundamentals': {
    skill: 'Programming Fundamentals',
    howToDevelop: [
      'Learn core control flow: variables, data types, loops (for, while), and conditional statements (if/else)',
      'Understand functions, parameters, return values, and variable scope',
      'Practice algorithmic problem solving using basic pseudocode and simple flowcharts'
    ],
    platformResources: [
      { name: 'freeCodeCamp - Foundational Programming', url: 'https://freecodecamp.org' },
      { name: 'Khan Academy - Computer Programming', url: 'https://khanacademy.org/computing/computer-programming' },
      { name: 'CS50x - Harvard Introduction to Computer Science', url: 'https://cs50.harvard.edu/x/' }
    ],
    actionableTask: 'Write a command-line program implementing a text-based calculator with input validation.'
  },
  'javascript': {
    skill: 'JavaScript',
    howToDevelop: [
      'Master modern ES6+ syntax: let/const, arrow functions, destructuring, spread/rest operator',
      'Understand Asynchronous JavaScript: Event Loop, Promises, Async/Await, and Fetch API',
      'Learn DOM manipulation, event handlers, and higher-order array methods (map, filter, reduce)'
    ],
    platformResources: [
      { name: 'MDN Web Docs - JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
      { name: 'javascript.info - Modern JavaScript Tutorial', url: 'https://javascript.info' },
      { name: 'LeetCode - 30 Days of JavaScript', url: 'https://leetcode.com' }
    ],
    actionableTask: 'Build a dynamic filterable todo application parsing JSON stored in localStorage.'
  },
  'python': {
    skill: 'Python',
    howToDevelop: [
      'Learn Python syntax, primitive types, lists, dictionaries, tuples, and sets',
      'Understand functions, modules, package management (pip), and virtual environments (venv)',
      'Practice file I/O operations and exception handling (try/except)'
    ],
    platformResources: [
      { name: 'Python Official Documentation & Tutorials', url: 'https://docs.python.org/3/tutorial/' },
      { name: 'Real Python - In-Depth Guides', url: 'https://realpython.com' },
      { name: 'W3Schools - Python Tutorial', url: 'https://w3schools.com/python/' }
    ],
    actionableTask: 'Create a Python script that parses log files and generates a formatted analytical report.'
  },
  'data structures': {
    skill: 'Data Structures & Algorithms (DSA)',
    howToDevelop: [
      'Study linear data structures: Arrays, Linked Lists, Stacks, and Queues',
      'Understand non-linear structures: Trees (Binary Search Trees), Graphs, and Hash Tables',
      'Master Big-O time and space complexity analysis and common sorting/searching algorithms'
    ],
    platformResources: [
      { name: 'LeetCode - Algorithm Problem Solving', url: 'https://leetcode.com' },
      { name: 'GeeksforGeeks - Data Structures & Algorithms', url: 'https://geeksforgeeks.org' },
      { name: 'NeetCode 150 Roadmap & Video Guides', url: 'https://neetcode.io' }
    ],
    actionableTask: 'Solve 15 Easy/Medium LeetCode problems covering Arrays, Hash Maps, and Two Pointers.'
  },
  'git': {
    skill: 'Git & Version Control',
    howToDevelop: [
      'Master core commands: git init, status, add, commit, push, pull, log, diff',
      'Understand branching strategies: git branch, checkout, merge, and rebase',
      'Collaborate using GitHub: pull requests, code reviews, and conflict resolution'
    ],
    platformResources: [
      { name: 'Pro Git Book (Official Free Book)', url: 'https://git-scm.com/book/en/v2' },
      { name: 'GitHub Skills Interactive Courses', url: 'https://skills.github.com' },
      { name: 'Atlassian Git Tutorial', url: 'https://atlassian.com/git/tutorials' }
    ],
    actionableTask: 'Initialize a local repo, create feature branches, solve a merge conflict, and submit a PR on GitHub.'
  },
  'debugging': {
    skill: 'Debugging & Code Inspection',
    howToDevelop: [
      'Learn Chrome DevTools / Browser inspection: Console logging, Network tab, and Breakpoints',
      'Master IDE debugger tools: setting conditional breakpoints, step-over, step-into, and inspecting call stacks',
      'Apply systematic debugging methodology: reproducing bugs, isolating variables, and regression testing'
    ],
    platformResources: [
      { name: 'Chrome DevTools Debugging Documentation', url: 'https://developer.chrome.com/docs/devtools/javascript/' },
      { name: 'VS Code Debugging Guide', url: 'https://code.visualstudio.com/docs/editor/debugging' }
    ],
    actionableTask: 'Debug a buggy sample app using breakpoints and Network throttling without using plain console.log.'
  },
  'react': {
    skill: 'React Frontend Framework',
    howToDevelop: [
      'Study JSX syntax, functional components, props, and component tree architecture',
      'Master core hooks: useState for state management & useEffect for side-effects/data fetching',
      'Learn component composition, context API for global state, and custom hooks'
    ],
    platformResources: [
      { name: 'React.dev - Official Interactive Docs', url: 'https://react.dev/learn' },
      { name: 'freeCodeCamp - React Beginner Course', url: 'https://freecodecamp.org' },
      { name: 'Scrimba - Interactive React Bootcamp', url: 'https://scrimba.com' }
    ],
    actionableTask: 'Build a multi-page interactive web dashboard fetching live API data with loading and error states.'
  },
  'api': {
    skill: 'APIs & HTTP Protocol',
    howToDevelop: [
      'Understand HTTP verbs (GET, POST, PUT, DELETE), status codes (200, 201, 400, 401, 404, 500)',
      'Learn RESTful API architecture conventions and JSON payload formatting',
      'Test and inspect API endpoints using Postman or Bruno'
    ],
    platformResources: [
      { name: 'MDN Web Docs - Overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
      { name: 'Postman Learning Center API Guides', url: 'https://learning.postman.com' }
    ],
    actionableTask: 'Design a Postman API test collection for a user registration and login flow.'
  },
  'database': {
    skill: 'Databases & SQL',
    howToDevelop: [
      'Master relational database queries: SELECT, WHERE, GROUP BY, HAVING, ORDER BY',
      'Learn table joins (INNER, LEFT, RIGHT) and data normalization principles (1NF to 3NF)',
      'Explore ORMs (Prisma, Sequelize, or Mongoose) for database integration in applications'
    ],
    platformResources: [
      { name: 'PostgreSQL Official Tutorial', url: 'https://postgresqltutorial.com' },
      { name: 'SQLBolt - Interactive SQL Exercises', url: 'https://sqlbolt.com' },
      { name: 'MongoDB University Free Courses', url: 'https://university.mongodb.com' }
    ],
    actionableTask: 'Design a 3-table normalized schema and execute SQL join queries for reporting data.'
  },
  'testing': {
    skill: 'Software Testing & QA',
    howToDevelop: [
      'Understand testing hierarchy: Unit testing, Integration testing, and End-to-End (E2E) testing',
      'Learn unit testing frameworks (Vitest, Jest, PyTest) and test assertions',
      'Practice mock functions, API mocking, and test-driven development (TDD) principles'
    ],
    platformResources: [
      { name: 'Vitest Official Documentation', url: 'https://vitest.dev' },
      { name: 'Testing Library Docs (React Testing)', url: 'https://testing-library.com' },
      { name: 'Jest Official Documentation', url: 'https://jestjs.io' }
    ],
    actionableTask: 'Write unit test suites achieving 80%+ code coverage for business logic helper functions.'
  },
  'object-oriented': {
    skill: 'Object-Oriented Programming (OOP)',
    howToDevelop: [
      'Master the 4 core pillars of OOP: Encapsulation, Abstraction, Inheritance, and Polymorphism',
      'Learn design patterns (Factory, Singleton, Observer, Strategy) and SOLID principles',
      'Implement class structures, constructors, private fields, and interface contracts'
    ],
    platformResources: [
      { name: 'Refactoring.Guru - Design Patterns & OOP', url: 'https://refactoring.guru' },
      { name: 'GeeksforGeeks - Object Oriented Programming', url: 'https://geeksforgeeks.org' }
    ],
    actionableTask: 'Refactor a procedural code script into clean OOP classes adhering to SOLID principles.'
  }
}

function resolveSkillBreakdown(milestone) {
  if (milestone.skillBreakdown?.length > 0) {
    return milestone.skillBreakdown
  }

  const rawSkills = milestone.skillsCovered || milestone.skills || []
  if (rawSkills.length === 0) return []

  const results = []
  const addedKeys = new Set()

  rawSkills.forEach((rawSkill) => {
    const sLower = String(rawSkill).toLowerCase()
    let matched = false

    for (const key in MASTER_SKILL_GUIDES) {
      if (sLower.includes(key)) {
        if (!addedKeys.has(key)) {
          addedKeys.add(key)
          results.push(MASTER_SKILL_GUIDES[key])
        }
        matched = true
      }
    }

    if (!matched) {
      results.push({
        skill: rawSkill,
        howToDevelop: [
          `Step 1: Study core concepts and official syntax for ${rawSkill}`,
          `Step 2: Follow interactive tutorials and code-alongs on MDN / freeCodeCamp for ${rawSkill}`,
          `Step 3: Build a practical mini-feature implementing ${rawSkill} to validate mastery`
        ],
        platformResources: [
          { name: `MDN Web Docs - ${rawSkill} Guide`, url: 'https://developer.mozilla.org' },
          { name: `freeCodeCamp - ${rawSkill} Tutorials`, url: 'https://freecodecamp.org' },
          { name: `Exercism - Interactive ${rawSkill} Practice`, url: 'https://exercism.org' }
        ],
        actionableTask: `Build a standalone application or feature demonstrating core capabilities of ${rawSkill}.`
      })
    }
  })

  return results
}

export default function RoadmapPage() {
  const targetRoleId = typeof window !== 'undefined' ? window.localStorage.getItem('targetRoleId') : null
  const rawSkills = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('userSkills') || '[]') : []
  const selectedRole = typeof window !== 'undefined' ? getSelectedRole() : null
  const skillGap = typeof window !== 'undefined' ? getSkillGapAnalysis(rawSkills, selectedRole?.skills) : { matched: { critical: [], important: [], niceToHave: [] }, missing: { critical: [], important: [], niceToHave: [] }, matchedSkills: [], totalRequiredSkills: 0, matchedSkillCount: 0, matchPercentage: 0 }

  const roleKey = selectedRole?.id || targetRoleId || 'default'
  const roadmapStorageKey = `saved_roadmap_${roleKey}`
  const progressStorageKey = `roadmap_progress_${roleKey}`

  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState('')
  const [completedItems, setCompletedItems] = useState({})

  // Load saved roadmap & progress from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRoadmapRaw = window.localStorage.getItem(roadmapStorageKey)
      if (savedRoadmapRaw) {
        try {
          setRoadmap(JSON.parse(savedRoadmapRaw))
        } catch {
          // ignore parsing error
        }
      }

      const savedProgressRaw = window.localStorage.getItem(progressStorageKey)
      if (savedProgressRaw) {
        try {
          setCompletedItems(JSON.parse(savedProgressRaw))
        } catch {
          // ignore parsing error
        }
      }
    }
  }, [roadmapStorageKey, progressStorageKey])

  // Save progress changes to localStorage
  const toggleItem = (itemId) => {
    setCompletedItems((prev) => {
      const updated = { ...prev, [itemId]: !prev[itemId] }
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(progressStorageKey, JSON.stringify(updated))
      }
      return updated
    })
  }

  const handleResetProgress = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(progressStorageKey)
    }
    setCompletedItems({})
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setRoadmap(null)
    try {
      const result = await generateRoadmap({
        targetRole: selectedRole?.title || 'Target Role',
        currentSkills: rawSkills,
        missingSkills: skillGap.missing,
        matchedSkills: skillGap.matchedSkills,
      })
      setRoadmap(result)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(roadmapStorageKey, JSON.stringify(result))
      }
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap')
    } finally {
      setLoading(false)
    }
  }

  // Calculate trackable items & completion metrics
  const getTrackableItems = () => {
    if (!roadmap?.milestones) return { total: 0, completed: 0, percent: 0, phaseStats: [] }

    let total = 0
    let completed = 0
    const phaseStats = []

    roadmap.milestones.forEach((milestone, mIdx) => {
      let pTotal = 0
      let pCompleted = 0

      // Learning Steps
      const steps = milestone.learningSteps || []
      steps.forEach((_, stIdx) => {
        const id = `m${mIdx}_step_${stIdx}`
        pTotal++
        if (completedItems[id]) pCompleted++
      })

      // Per-skill breakdown
      const resolvedBreakdown = resolveSkillBreakdown(milestone)
      resolvedBreakdown.forEach((_, sbIdx) => {
        const id = `m${mIdx}_skill_${sbIdx}`
        pTotal++
        if (completedItems[id]) pCompleted++
      })

      // Capstone project
      if (milestone.project?.title) {
        const id = `m${mIdx}_project`
        pTotal++
        if (completedItems[id]) pCompleted++
      }

      total += pTotal
      completed += pCompleted

      phaseStats.push({
        title: milestone.title,
        isFinished: pTotal > 0 && pCompleted === pTotal,
        completed: pCompleted,
        total: pTotal
      })
    })

    const percent = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percent, phaseStats }
  }

  const metrics = getTrackableItems()
  const roleTitle = roadmap?.role || selectedRole?.title || 'Select a role'
  const summaryText = roadmap?.personalizedSummary || roadmap?.summary || 'Tailored learning roadmap created for your target role.'
  const totalDuration = roadmap?.totalEstimatedDuration || (roadmap?.estimatedTotalWeeks ? `${roadmap.estimatedTotalWeeks} weeks` : '12 weeks')

  return (
    <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
      <div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-10rem] top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" />
      <div className="absolute left-[-10rem] bottom-20 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" />
      <Navbar />
      <div className="wrap pt-6">
        <PageNav backHref="/skill-gap" backLabel="Back to Skill Gap" />
      </div>
      <section className="wrap pb-16">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header & Generator Card */}
          <div className="rounded-3xl border border-white/10 bg-[#0e1a34] p-8 sm:p-10 shadow-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow text-mint">Expert AI Career Mentor</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-white sm:text-4xl">
                  Personalized Learning Path
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                  Step-by-step actionable guide customized for your transition into <span className="font-bold text-mint">{roleTitle}</span>. Track your real-time progress across skills, learning steps, and capstone projects.
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Target Role: <span className="font-semibold text-white">{selectedRole?.title || 'Select a role'}</span>
                </p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !selectedRole}
                  className="rounded-full bg-violet px-6 py-3.5 text-sm font-bold text-white shadow-glow hover:bg-violet/90 disabled:opacity-60 transition-all"
                >
                  {loading ? 'Generating Mentor Plan...' : (roadmap ? 'Regenerate Roadmap' : 'Generate Roadmap')}
                </button>
                {!selectedRole && <p className="mt-2 text-xs text-slate-400">Select a target role in your profile first.</p>}
              </div>
            </div>
          </div>

          {error && <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-6 text-sm text-red-300">{error}</div>}

          {roadmap && (
            <div className="space-y-6">
              {/* Interactive Progress Tracking Header Card */}
              <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#122040] via-[#0d1830] to-[#081225] p-6 sm:p-8 text-white shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-violet/20 px-3 py-1 text-xs font-bold text-mint border border-mint/20">
                        ⚡ Real-Time Local Progress
                      </span>
                      {metrics.percent === 100 && (
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                          🏆 100% Completed!
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-extrabold text-white mt-2 tracking-tight">Your Career Roadmap Progress</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Check off completed learning steps, skill masterclasses, and capstone projects. Saved automatically on this browser.
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <div className="text-right">
                      <span className={`text-3xl font-black ${metrics.percent === 100 ? 'text-emerald-400' : 'text-mint'}`}>
                        {metrics.percent}%
                      </span>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Overall Completion</p>
                    </div>
                    {metrics.completed > 0 && (
                      <button
                        onClick={handleResetProgress}
                        className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/20 hover:text-white transition-all"
                        title="Reset checked progress items"
                      >
                        🔄 Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Progress Tracker Instruction Banner */}
                <div className="rounded-2xl border border-mint/40 bg-gradient-to-r from-mint/15 to-violet/15 p-4 text-sm text-mint flex items-center gap-3.5 shadow-md">
                  <span className="text-2xl shrink-0">☑️</span>
                  <div>
                    <p className="font-extrabold text-white text-sm sm:text-base">Tick the checkboxes below to mark items as complete</p>
                    <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                      Click the checkbox next to any learning step, skill masterclass, or capstone project below as you complete them to automatically update your progress score in real-time.
                    </p>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span className="text-violet-300 font-extrabold flex items-center gap-1.5">
                      <span>📊</span> Progress Tracker
                    </span>
                    <span>{metrics.completed} of {metrics.total} items completed</span>
                  </div>
                  <div className="h-4 w-full rounded-full bg-white/10 p-0.5 overflow-hidden border border-white/10 shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${metrics.percent}%`,
                        background: metrics.percent === 100
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'linear-gradient(90deg, #7267FF, #8b5cf6, #B9F4D1)'
                      }}
                    />
                  </div>
                </div>

                {/* Phase Completion Badges */}
                {metrics.phaseStats.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-3 pt-2">
                    {metrics.phaseStats.map((ps, pIdx) => (
                      <div
                        key={pIdx}
                        className={`rounded-2xl p-3 text-xs border transition-all ${
                          ps.isFinished
                            ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300 font-semibold'
                            : 'bg-white/[.04] border-white/10 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="truncate">Phase {pIdx + 1}</span>
                          <span className={ps.isFinished ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}>
                            {ps.isFinished ? '✅ Complete' : `${ps.completed}/${ps.total}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{ps.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Overall Summary Card */}
              <section className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Personalized Strategy</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{summaryText}</p>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-violet/20 border border-violet/30 px-4 py-2.5 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-mint">Estimated Duration</p>
                    <p className="text-sm font-extrabold text-white mt-0.5">{totalDuration}</p>
                  </div>
                </div>
              </section>

              {/* Milestones */}
              <section className="space-y-6">
                {roadmap.milestones?.length > 0 ? (
                  roadmap.milestones.map((milestone, mIdx) => {
                    const steps = milestone.learningSteps || []
                    const project = milestone.project
                    const skills = milestone.skillsCovered || milestone.skills || []
                    const resolvedBreakdown = resolveSkillBreakdown(milestone)

                    const projId = `m${mIdx}_project`
                    const isProjDone = !!completedItems[projId]

                    return (
                      <div key={mIdx} className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 sm:p-8 shadow-xl space-y-6">
                        {/* Milestone Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/10 pb-5">
                          <div className="space-y-1">
                            <span className="inline-block rounded-full bg-violet/20 px-3 py-1 text-xs font-bold text-mint border border-mint/20">
                              Phase {mIdx + 1} • {milestone.estimatedDuration || (milestone.estimatedWeeks ? `${milestone.estimatedWeeks} weeks` : '4 weeks')}
                            </span>
                            <h3 className="text-xl font-bold text-white pt-1">{milestone.title}</h3>
                            {milestone.goal && <p className="text-sm font-medium text-slate-200">🎯 Goal: {milestone.goal}</p>}
                            {milestone.whyItMatters && (
                              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                                💡 <span className="font-semibold text-slate-300">Why it matters:</span> {milestone.whyItMatters}
                              </p>
                            )}
                          </div>

                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:justify-end">
                              {skills.map((s, sIdx) => (
                                <span key={sIdx} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Learning Steps / Topics */}
                        {steps.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-mint">
                              📚 Detailed Learning Steps & Resources ({steps.length})
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                              {steps.map((step, stIdx) => {
                                const stepId = `m${mIdx}_step_${stIdx}`
                                const isDone = !!completedItems[stepId]
                                const res = step.resource || {}
                                const subtopics = step.subtopics || []
                                const criteria = step.completionCriteria || []

                                return (
                                  <div
                                    key={stIdx}
                                    className={`rounded-2xl border p-5 space-y-4 shadow-xs transition-all ${
                                      isDone
                                        ? 'border-emerald-500/40 bg-emerald-950/30 opacity-90'
                                        : 'border-white/10 bg-white/[.03] hover:border-violet/40'
                                    }`}
                                  >
                                    {/* Topic Title & Checkbox */}
                                    <div>
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                          <input
                                            type="checkbox"
                                            checked={isDone}
                                            onChange={() => toggleItem(stepId)}
                                            className="h-5 w-5 sm:h-6 sm:w-6 rounded-md border-2 border-mint bg-slate-900 text-mint accent-mint focus:ring-2 focus:ring-mint cursor-pointer hover:scale-110 transition-transform shrink-0 shadow-md"
                                          />
                                          <div className="flex flex-wrap items-center gap-2">
                                            <h5 className={`font-bold text-sm sm:text-base ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                              {step.topic}
                                            </h5>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${isDone ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-mint/15 text-mint border-mint/40'}`}>
                                              {isDone ? '✓ Completed' : 'Tick to complete'}
                                            </span>
                                          </div>
                                        </div>
                                        {step.estimatedStudyTime && (
                                          <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                                            ⏳ {step.estimatedStudyTime}
                                          </span>
                                        )}
                                      </div>
                                      {step.whyLearnThis && (
                                        <p className="mt-1 text-xs text-slate-400 leading-relaxed pl-6.5">{step.whyLearnThis}</p>
                                      )}
                                    </div>

                                    {/* Subtopics */}
                                    {subtopics.length > 0 && (
                                      <div className="rounded-xl bg-white/5 p-3 border border-white/10 text-xs">
                                        <p className="font-semibold text-slate-300 mb-1">Key Subtopics:</p>
                                        <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                                          {subtopics.map((st, subIdx) => (
                                            <li key={subIdx}>{st}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Resource */}
                                    {res.title && (
                                      <div className="rounded-xl bg-violet-950/40 border border-violet-500/30 p-3 text-xs space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-violet-200">📖 Recommended Resource</span>
                                          {res.type && (
                                            <span className="rounded bg-violet-500/30 px-2 py-0.5 text-[10px] font-bold text-mint">
                                              {res.type}
                                            </span>
                                          )}
                                        </div>
                                        <p className="font-semibold text-white">{res.title}</p>
                                        {res.url && (
                                          <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 font-bold text-mint hover:underline pt-0.5"
                                          >
                                            <span>Open Resource on {res.platform || 'Web'}</span>
                                            <span>↗</span>
                                          </a>
                                        )}
                                      </div>
                                    )}

                                    {/* Practical Task */}
                                    {step.practicalTask && (
                                      <div className="rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-950/50 to-indigo-950/40 p-3.5 text-xs text-slate-200 shadow-md backdrop-blur-md space-y-1">
                                        <p className="font-bold text-violet-300 font-extrabold">⚡ Practical Application Task:</p>
                                        <p className="text-slate-200 leading-relaxed font-medium">{step.practicalTask}</p>
                                        {criteria.length > 0 && (
                                          <div className="pt-1">
                                            <p className="font-semibold text-violet-300 font-extrabold text-[11px]">Completion Criteria:</p>
                                            <ul className="list-disc pl-4 text-[11px] text-violet-200/90 space-y-0.5">
                                              {criteria.map((c, cIdx) => (
                                                <li key={cIdx}>{c}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Per-Skill Explicit Study Guides */}
                        {resolvedBreakdown?.length > 0 && (
                          <div className="space-y-4 pt-2 border-t border-white/10">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-mint">
                                📍 Where & How to Study Each Skill ({resolvedBreakdown.length} Skill Guides)
                              </h4>
                              <span className="text-[11px] font-medium text-slate-400">Step-by-Step & Direct Platform Links</span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                              {resolvedBreakdown.map((sb, sbIdx) => {
                                const skillId = `m${mIdx}_skill_${sbIdx}`
                                const isSkillDone = !!completedItems[skillId]

                                return (
                                  <div
                                    key={sbIdx}
                                    className={`rounded-2xl border p-5 space-y-4 shadow-xs transition-all ${
                                      isSkillDone
                                        ? 'border-emerald-500/40 bg-emerald-950/30 opacity-90'
                                        : 'border-violet-500/30 bg-gradient-to-b from-violet-950/30 to-[#0e1a34]'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                                      <div className="flex items-center gap-2.5">
                                        <input
                                          type="checkbox"
                                          checked={isSkillDone}
                                          onChange={() => toggleItem(skillId)}
                                          className="h-5 w-5 sm:h-6 sm:w-6 rounded-md border-2 border-mint bg-slate-900 text-mint accent-mint focus:ring-2 focus:ring-mint cursor-pointer hover:scale-110 transition-transform shrink-0 shadow-md"
                                        />
                                        <div className="flex flex-wrap items-center gap-2">
                                          <h5 className={`font-extrabold text-base ${isSkillDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                            🎯 {sb.skill}
                                          </h5>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${isSkillDone ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-mint/15 text-mint border-mint/40'}`}>
                                            {isSkillDone ? '✓ Mastered' : 'Tick to complete'}
                                          </span>
                                        </div>
                                      </div>
                                      <span className="rounded-full bg-violet/20 border border-mint/20 px-2.5 py-0.5 text-[10px] font-bold text-mint">
                                        {isSkillDone ? '✅ Mastered' : 'Skill Masterclass'}
                                      </span>
                                    </div>

                                    {/* How to Develop Step-by-Step */}
                                    {sb.howToDevelop?.length > 0 && (
                                      <div className="space-y-1.5 pl-6.5">
                                        <p className="text-xs font-bold text-slate-200">🚀 How & Where to Study Step-by-Step:</p>
                                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                                          {sb.howToDevelop.map((step, stIdx) => (
                                            <li key={stIdx} className="leading-relaxed">{step}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Direct Platform Links */}
                                    {sb.platformResources?.length > 0 && (
                                      <div className="space-y-1.5 pt-1 pl-6.5">
                                        <p className="text-xs font-bold text-slate-200">🔗 Recommended Platforms & Direct Study Links:</p>
                                        <div className="flex flex-wrap gap-2 pt-0.5">
                                          {sb.platformResources.map((res, rIdx) => (
                                            <a
                                              key={rIdx}
                                              href={res.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1.5 rounded-xl border border-mint/30 bg-mint/10 px-3 py-1.5 text-xs font-bold text-mint hover:bg-mint hover:text-ink transition-all shadow-xs"
                                            >
                                              <span>{res.name}</span>
                                              <span className="text-[10px]">↗</span>
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Actionable Task */}
                                    {sb.actionableTask && (
                                      <div className="rounded-xl border border-violet-500/40 bg-gradient-to-r from-violet-950/50 to-indigo-950/40 p-3.5 text-xs text-slate-200 shadow-md backdrop-blur-md space-y-1">
                                        <p className="font-bold text-violet-300 font-extrabold">⚡ Hands-on Skill Task:</p>
                                        <p className="text-slate-200 leading-relaxed font-medium">{sb.actionableTask}</p>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Milestone Capstone Project */}
                        {project && project.title && (
                          <div
                            className={`rounded-2xl border p-5 space-y-3 transition-all ${
                              isProjDone
                                ? 'border-emerald-500/50 bg-emerald-950/40'
                                : 'border-emerald-500/30 bg-emerald-950/20'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/20 pb-2.5">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isProjDone}
                                  onChange={() => toggleItem(projId)}
                                  className="h-6 w-6 rounded-md border-2 border-emerald-400 bg-slate-900 text-emerald-400 accent-emerald-400 focus:ring-2 focus:ring-emerald-400 cursor-pointer hover:scale-110 transition-transform shrink-0 shadow-md"
                                />
                                <div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                                    🏆 Milestone Capstone Project {isProjDone ? '(Completed ✅)' : ''}
                                  </span>
                                  <h4 className={`text-base font-bold text-white mt-0.5 ${isProjDone ? 'line-through text-emerald-300' : ''}`}>
                                    {project.title}
                                  </h4>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pl-8 sm:pl-0">
                                {project.difficulty && (
                                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-300">
                                    {project.difficulty}
                                  </span>
                                )}
                                {project.estimatedDuration && (
                                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-300">
                                    ⏱ {project.estimatedDuration}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed pl-8 sm:pl-0">{project.description}</p>

                            {project.skillsDemonstrated?.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 text-xs pl-8 sm:pl-0">
                                <span className="font-semibold text-slate-200">Skills Demonstrated:</span>
                                {project.skillsDemonstrated.map((sd, sdIdx) => (
                                  <span key={sdIdx} className="rounded bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
                                    {sd}
                                  </span>
                                ))}
                              </div>
                            )}

                            {project.completionCriteria?.length > 0 && (
                              <div className="text-xs text-slate-300 pt-1 pl-8 sm:pl-0">
                                <span className="font-bold text-emerald-300">Project Criteria:</span>
                                <ul className="list-disc pl-4 text-slate-300 space-y-0.5 mt-0.5">
                                  {project.completionCriteria.map((pc, pcIdx) => (
                                    <li key={pcIdx}>{pc}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-slate-400">No milestones generated.</p>
                )}
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}