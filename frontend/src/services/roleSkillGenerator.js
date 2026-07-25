const API_PROXY_URL = '/api/ai/proxy'
const GEMINI_MODEL = 'gemini-2.0-flash'

function normalizeSkills(skills = {}) {
  return {
    critical: Array.isArray(skills.critical) ? skills.critical.filter(Boolean).slice(0, 8) : [],
    important: Array.isArray(skills.important) ? skills.important.filter(Boolean).slice(0, 8) : [],
    niceToHave: Array.isArray(skills.niceToHave) ? skills.niceToHave.filter(Boolean).slice(0, 8) : [],
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
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || errorBody.details || 'Could not generate role skills.')
  }

  const data = await response.json()
  const content = data.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text

  if (!content) {
    throw new Error('AI response did not include generated skills.')
  }

  return parseRoleContent(content)
}
