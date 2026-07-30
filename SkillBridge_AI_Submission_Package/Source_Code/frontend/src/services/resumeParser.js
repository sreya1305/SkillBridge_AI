const ENDPOINTS = [
  '/api/ai/resume-parser',
  'http://localhost:4000/api/ai/resume-parser'
]

function fallbackExtractSkillsFromText(text = '', fileName = '') {
  const combinedText = (text || '') + ' ' + (fileName || '')
  if (!combinedText.trim()) {
    return {
      success: true,
      data: {
        skills: [],
        education: [],
        experience: [],
        certifications: []
      }
    }
  }

  const padded = ' ' + combinedText.replace(/[\r\n\t]+/g, ' ') + ' '
  const foundSkills = new Set()

  const masterSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Golang', 'Go',
    'Rust', 'Swift', 'Kotlin', 'MATLAB', 'HTML5', 'CSS3', 'HTML', 'CSS', 'SQL',
    'React', 'React.js', 'React Native', 'Vue', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
    'Redux', 'Tailwind CSS', 'Bootstrap', 'Sass', 'SCSS', 'jQuery', 'Webpack', 'Vite', 'GraphQL',
    'Node.js', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
    'Laravel', 'Ruby on Rails', 'Microservices', 'RESTful APIs', 'REST API',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Firebase',
    'DynamoDB', 'Cassandra', 'Elasticsearch', 'Prisma', 'Sequelize',
    'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud Platform', 'Docker', 'Kubernetes',
    'CI/CD', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Nginx', 'Linux', 'Bash',
    'Machine Learning', 'Deep Learning', 'Artificial Intelligence', 'Data Analysis', 'Data Science',
    'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'NLP', 'LLMs',
    'Power BI', 'Tableau', 'Matplotlib', 'Seaborn', 'Spark', 'Hadoop',
    'Flutter', 'Android', 'iOS', 'Expo', 'SwiftUI',
    'Git', 'GitHub', 'GitLab', 'Jira', 'Postman', 'Figma', 'Canva', 'Trello', 'VS Code',
    'Data Structures', 'Algorithms', 'Object-Oriented Programming', 'System Design',
    'Agile', 'Scrum', 'Unit Testing', 'TDD',
    'Communication', 'Leadership', 'Problem Solving', 'Project Management'
  ]

  masterSkills.forEach((skill) => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    const reg = new RegExp(`(?:^|[^a-zA-Z0-9+#.])${escaped}(?:$|[^a-zA-Z0-9+#.])`, 'i')
    if (reg.test(padded)) {
      foundSkills.add(skill)
    }
  })

  const extracted = Array.from(foundSkills)

  return {
    success: true,
    data: {
      skills: extracted,
      education: [],
      experience: [],
      certifications: []
    }
  }
}

export async function parseResume(resumeText) {
  let lastError = null

  for (const endpoint of ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })

      if (response.ok) {
        return await response.json()
      }

      const errorBody = await response.json().catch(() => ({}))
      lastError = new Error(errorBody.error || errorBody.details || 'Could not parse resume text.')
    } catch (err) {
      lastError = err
    }
  }

  console.warn('[resumeParser] Endpoints unreachable, using padded text extraction.')
  return fallbackExtractSkillsFromText(resumeText)
}

export async function parseResumeFile(file) {
  if (!file) {
    throw new Error('Please select a file to parse.')
  }

  let lastError = null

  for (const endpoint of ENDPOINTS) {
    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        return await response.json()
      }

      const errorBody = await response.json().catch(() => ({}))
      lastError = new Error(errorBody.error || errorBody.details || 'Could not parse resume file.')
    } catch (err) {
      lastError = err
    }
  }

  console.warn('[resumeParser] File upload endpoints unreachable.')
  return fallbackExtractSkillsFromText('', file.name)
}