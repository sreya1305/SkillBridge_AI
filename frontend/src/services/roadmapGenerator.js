const API_URL = '/api/ai/roadmap'

export async function generateRoadmap({ targetRole, currentSkills, missingSkills, matchedSkills }) {
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
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody.error || errorBody.details || 'Could not generate roadmap.'
    throw new Error(message)
  }

  return response.json()
}