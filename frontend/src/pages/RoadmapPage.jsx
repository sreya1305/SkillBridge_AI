import { useState } from 'react'
import Navbar from '../components/Navbar'
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

  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState(null)
  const [error, setError] = useState('')

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
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap')
    } finally {
      setLoading(false)
    }
  }

  const roleTitle = roadmap?.role || selectedRole?.title || 'Target Role'
  const summaryText = roadmap?.personalizedSummary || roadmap?.summary || 'Tailored learning roadmap created for your target role.'
  const totalDuration = roadmap?.totalEstimatedDuration || (roadmap?.estimatedTotalWeeks ? `${roadmap.estimatedTotalWeeks} weeks` : '12 weeks')

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-ink">
      <Navbar />
      <div className="wrap py-6">
        <a href="/profile" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ink">
          ← Back to profile
        </a>
      </div>
      <section className="wrap pb-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow text-violet">Expert AI Career Mentor</p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-[-.04em] text-ink sm:text-4xl">
                  Personalized Learning Path
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Step-by-step actionable guide customized for your transition into <span className="font-bold text-ink">{roleTitle}</span>. Features explicit subtopics, verified learning resources, practical tasks, and capstone projects.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Target Role: <span className="font-semibold text-ink">{selectedRole?.title || 'None selected'}</span>
                </p>
              </div>
              <div className="shrink-0">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !selectedRole}
                  className="rounded-full bg-violet px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-violet/90 disabled:opacity-60 transition-all"
                >
                  {loading ? 'Generating Mentor Plan...' : 'Generate Roadmap'}
                </button>
                {!selectedRole && <p className="mt-2 text-xs text-slate-500">Select a target role in your profile first.</p>}
              </div>
            </div>
          </div>

          {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

          {roadmap && (
            <div className="space-y-6">
              {/* Overall Summary Card */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-ink">Personalized Strategy</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{summaryText}</p>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-violet/10 border border-violet/20 px-4 py-2.5 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-violet">Estimated Duration</p>
                    <p className="text-sm font-extrabold text-violet mt-0.5">{totalDuration}</p>
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

                    return (
                      <div key={mIdx} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                        {/* Milestone Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                          <div className="space-y-1">
                            <span className="inline-block rounded-full bg-violet/10 px-3 py-1 text-xs font-bold text-violet">
                              Phase {mIdx + 1} • {milestone.estimatedDuration || (milestone.estimatedWeeks ? `${milestone.estimatedWeeks} weeks` : '4 weeks')}
                            </span>
                            <h3 className="text-xl font-bold text-ink pt-1">{milestone.title}</h3>
                            {milestone.goal && <p className="text-sm font-medium text-slate-700">🎯 Goal: {milestone.goal}</p>}
                            {milestone.whyItMatters && (
                              <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                                💡 <span className="font-semibold text-slate-600">Why it matters:</span> {milestone.whyItMatters}
                              </p>
                            )}
                          </div>

                          {skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:justify-end">
                              {skills.map((s, sIdx) => (
                                <span key={sIdx} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Learning Steps / Topics */}
                        {steps.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-violet">
                              📚 Detailed Learning Steps & Resources ({steps.length})
                            </h4>
                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                              {steps.map((step, stIdx) => {
                                const res = step.resource || {}
                                const subtopics = step.subtopics || []
                                const criteria = step.completionCriteria || []

                                return (
                                  <div key={stIdx} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-4 shadow-xs hover:border-slate-300 transition-colors">
                                    {/* Topic Title & Why Learn */}
                                    <div>
                                      <div className="flex items-start justify-between gap-2">
                                        <h5 className="font-bold text-ink text-sm sm:text-base">{step.topic}</h5>
                                        {step.estimatedStudyTime && (
                                          <span className="shrink-0 rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                                            ⏳ {step.estimatedStudyTime}
                                          </span>
                                        )}
                                      </div>
                                      {step.whyLearnThis && (
                                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{step.whyLearnThis}</p>
                                      )}
                                    </div>

                                    {/* Subtopics */}
                                    {subtopics.length > 0 && (
                                      <div className="rounded-xl bg-white p-3 border border-slate-200/60 text-xs">
                                        <p className="font-semibold text-slate-700 mb-1">Key Subtopics:</p>
                                        <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                                          {subtopics.map((st, subIdx) => (
                                            <li key={subIdx}>{st}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Resource */}
                                    {res.title && (
                                      <div className="rounded-xl bg-violet-50/60 border border-violet-100 p-3 text-xs space-y-1.5">
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-violet-950">📖 Recommended Resource</span>
                                          {res.type && (
                                            <span className="rounded bg-violet-200/70 px-2 py-0.5 text-[10px] font-bold text-violet-900">
                                              {res.type}
                                            </span>
                                          )}
                                        </div>
                                        <p className="font-semibold text-slate-800">{res.title}</p>
                                        {res.url && (
                                          <a
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 font-bold text-violet hover:underline pt-0.5"
                                          >
                                            <span>Open Resource on {res.platform || 'Web'}</span>
                                            <span>↗</span>
                                          </a>
                                        )}
                                      </div>
                                    )}

                                    {/* Practical Task */}
                                    {step.practicalTask && (
                                      <div className="rounded-xl bg-amber-50/80 border border-amber-200/70 p-3 text-xs text-amber-950 space-y-1">
                                        <p className="font-bold">⚡ Practical Application Task:</p>
                                        <p className="text-amber-900 leading-relaxed">{step.practicalTask}</p>
                                        {criteria.length > 0 && (
                                          <div className="pt-1">
                                            <p className="font-semibold text-amber-950 text-[11px]">Completion Criteria:</p>
                                            <ul className="list-disc pl-4 text-[11px] text-amber-900 space-y-0.5">
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
                          <div className="space-y-4 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-violet">
                                📍 Where & How to Study Each Skill ({resolvedBreakdown.length} Skill Guides)
                              </h4>
                              <span className="text-[11px] font-medium text-slate-500">Step-by-Step & Direct Platform Links</span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                              {resolvedBreakdown.map((sb, sbIdx) => (
                                <div key={sbIdx} className="rounded-2xl border border-violet/20 bg-gradient-to-b from-violet-50/30 to-white p-5 space-y-4 shadow-xs">
                                  <div className="flex items-center justify-between border-b border-violet/10 pb-2.5">
                                    <h5 className="font-extrabold text-ink text-base">🎯 {sb.skill}</h5>
                                    <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-[10px] font-bold text-violet">
                                      Skill Masterclass
                                    </span>
                                  </div>

                                  {/* How to Develop Step-by-Step */}
                                  {sb.howToDevelop?.length > 0 && (
                                    <div className="space-y-1.5">
                                      <p className="text-xs font-bold text-slate-800">🚀 How & Where to Study Step-by-Step:</p>
                                      <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                                        {sb.howToDevelop.map((step, stIdx) => (
                                          <li key={stIdx} className="leading-relaxed">{step}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Direct Platform Links */}
                                  {sb.platformResources?.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                      <p className="text-xs font-bold text-slate-800">🔗 Recommended Platforms & Direct Study Links:</p>
                                      <div className="flex flex-wrap gap-2 pt-0.5">
                                        {sb.platformResources.map((res, rIdx) => (
                                          <a
                                            key={rIdx}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-violet/30 bg-white px-3 py-1.5 text-xs font-bold text-violet hover:bg-violet-600 hover:text-white transition-all shadow-xs"
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
                                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-950 space-y-1">
                                      <p className="font-bold">⚡ Hands-on Skill Task:</p>
                                      <p className="text-amber-900 leading-relaxed">{sb.actionableTask}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Milestone Capstone Project */}
                        {project && project.title && (
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-2.5">
                              <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                                  🏆 Milestone Capstone Project
                                </span>
                                <h4 className="text-base font-bold text-emerald-950 mt-0.5">{project.title}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                {project.difficulty && (
                                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
                                    {project.difficulty}
                                  </span>
                                )}
                                {project.estimatedDuration && (
                                  <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-0.5 text-xs font-bold text-emerald-800">
                                    ⏱ {project.estimatedDuration}
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-emerald-900 leading-relaxed">{project.description}</p>

                            {project.skillsDemonstrated?.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                <span className="font-semibold text-emerald-950">Skills Demonstrated:</span>
                                {project.skillsDemonstrated.map((sd, sdIdx) => (
                                  <span key={sdIdx} className="rounded bg-emerald-100/80 px-2 py-0.5 text-[11px] font-medium text-emerald-900">
                                    {sd}
                                  </span>
                                ))}
                              </div>
                            )}

                            {project.completionCriteria?.length > 0 && (
                              <div className="text-xs text-emerald-900 pt-1">
                                <span className="font-bold text-emerald-950">Project Criteria:</span>
                                <ul className="list-disc pl-4 text-emerald-900 space-y-0.5 mt-0.5">
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
                  <p className="text-sm text-slate-500">No milestones generated.</p>
                )}
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}