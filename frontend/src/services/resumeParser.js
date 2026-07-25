const API_URL = '/api/ai/resume-parser'

export async function parseResume(resumeText) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody.error || errorBody.details || 'Could not parse resume.'
    throw new Error(message)
  }

  return response.json()
}