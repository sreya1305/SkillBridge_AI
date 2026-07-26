const API_URL = '/api/ai/roadmap'

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
        resources: ['Official documentation & core guides', 'Hands-on practice exercises'],
        estimatedWeeks: 4,
        projects: [`Build a foundational ${targetRole} project`],
      },
      {
        title: `Phase 2: Intermediate Capabilities & Workflow`,
        focus: 'Deepen knowledge in supporting tools and core framework capabilities.',
        skills: milestone2Skills,
        resources: ['Developer tutorials & community examples', 'Architecture & pattern guides'],
        estimatedWeeks: 4,
        projects: [`Develop a multi-feature portfolio application`],
      },
      {
        title: `Phase 3: Specialization & Career Readiness`,
        focus: 'Polish portfolio, performance optimization, and project deployment.',
        skills: milestone3Skills,
        resources: ['System design guides', 'Production deployment tutorials'],
        estimatedWeeks: 4,
        projects: [`Build capstone project for ${targetRole}`],
      },
    ],
    estimatedTotalWeeks: 12,
    summary: `Personalized 12-week roadmap designed to transition into ${targetRole}, closing priority skill gaps while building on your existing experience.`,
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