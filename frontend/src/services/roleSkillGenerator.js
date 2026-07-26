const API_PROXY_URL = '/api/ai/proxy'
const GEMINI_MODEL = 'gemini-2.0-flash'

function normalizeSkills(skills = {}) {
  return {
    critical: Array.isArray(skills.critical) ? skills.critical.filter(Boolean).slice(0, 8) : [],
    important: Array.isArray(skills.important) ? skills.important.filter(Boolean).slice(0, 8) : [],
    niceToHave: Array.isArray(skills.niceToHave) ? skills.niceToHave.filter(Boolean).slice(0, 8) : [],
  }
}

export function getFallbackSkillsForRole(title = '') {
  const t = title.toLowerCase()
  let critical = ['Core Fundamentals', 'Problem Solving', 'Git']
  let important = ['Technical Documentation', 'Code Review', 'System Design']
  let niceToHave = ['CI/CD', 'Cloud Deployment', 'Automated Testing']

  if (t.includes('ai') || t.includes('ml') || t.includes('machine learning') || t.includes('data')) {
    critical = ['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'Pandas', 'NumPy']
    important = ['Scikit-Learn', 'TensorFlow', 'PyTorch', 'Data Visualization', 'Statistics']
    niceToHave = ['Docker', 'AWS', 'Big Data', 'Feature Engineering']
  } else if (t.includes('devops') || t.includes('cloud') || t.includes('infrastructure')) {
    critical = ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'AWS / Azure']
    important = ['Terraform', 'Bash Scripting', 'Monitoring & Logging', 'Git']
    niceToHave = ['Python', 'Ansible', 'Networking', 'Security Best Practices']
  } else if (t.includes('design') || t.includes('ui') || t.includes('ux')) {
    critical = ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'UI Design']
    important = ['Design Systems', 'Usability Testing', 'HTML/CSS', 'User Journey Mapping']
    niceToHave = ['Animation', 'Responsive Design', 'Accessibility (a11y)', 'Canva']
  } else if (t.includes('web') || t.includes('frontend') || t.includes('backend') || t.includes('react') || t.includes('full stack') || t.includes('developer') || t.includes('engineer') || t.includes('programmer')) {
    critical = ['JavaScript', 'HTML5', 'CSS3', 'React / Vue', 'Node.js', 'Git']
    important = ['REST APIs', 'TypeScript', 'SQL / NoSQL Databases', 'System Architecture']
    niceToHave = ['Docker', 'GraphQL', 'Tailwind CSS', 'Testing (Jest/Cypress)']
  }

  return {
    title: title.trim(),
    description: `Target role requirements and baseline skill expectations for ${title.trim()}.`,
    skills: { critical, important, niceToHave }
  }
}

function parseRoleContent(content) {
  const parsed = JSON.parse(content)

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI response was not a valid role object.')
  }

  const skills = normalizeSkills(parsed.skills)
  const totalSkills = skills.critical.length + skills.important.length + skills.niceToHave.length

  if (!parsed.title || totalSkills === 0) {
    throw new Error('AI response did not include a role title and skills.')
  }

  return {
    title: String(parsed.title).trim(),
    description: String(parsed.description || '').trim(),
    skills,
  }
}

export async function generateRoleSkills(roleTitle) {
  try {
    const response = await fetch(API_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: `models/${GEMINI_MODEL}:generateContent`,
        body: {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: [
                    'Return only valid JSON for a career skill gap app.',
                    'Use practical, current role expectations.',
                    'Categorize skills into critical, important, and niceToHave arrays.',
                    `Create target-role requirements for this role: "${roleTitle}".`,
                    'Return JSON with title, description, and skills: { critical: [], important: [], niceToHave: [] }.',
                    'Include 5-7 concise skills per category.',
                  ].join(' '),
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        },
      }),
    })

    if (!response.ok) {
      return getFallbackSkillsForRole(roleTitle)
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text

    if (!content) {
      return getFallbackSkillsForRole(roleTitle)
    }

    return parseRoleContent(content)
  } catch (err) {
    console.warn('[generateRoleSkills] Using smart fallback skills:', err.message)
    return getFallbackSkillsForRole(roleTitle)
  }
}
