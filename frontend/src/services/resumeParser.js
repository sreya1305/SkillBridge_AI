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

export async function parseResumeFile(file) {
  const formData = new FormData()
  formData.append('resume', file)

  // Do NOT set Content-Type manually — browser must set it with the correct boundary
  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody.error || errorBody.details || 'Could not parse resume file.'
    throw new Error(message)
  }

  return response.json()
}