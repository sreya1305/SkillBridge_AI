# SkillBridge AI - API Reference Documentation

## Overview
The SkillBridge AI backend is built with Express.js running on Node.js (default port `4000`). It provides endpoints for resume parsing, AI role skill generation, roadmap generation, skill gap analysis, and PDF/Markdown exports.

---

## 1. Parse Resume
- **Endpoint**: `POST /api/parse-resume`
- **Content-Type**: `multipart/form-data` or `application/json`

### Request Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `file` | File (Binary) | Optional | Resume file (PDF, DOCX, PNG, JPG, JPEG) |
| `resumeText` | String | Optional | Raw text paste if no file is uploaded |

### Example Curl Request
```bash
curl -X POST http://localhost:4000/api/parse-resume \
  -F "file=@/path/to/resume.pdf"
```

### Example Response (JSON)
```json
{
  "success": true,
  "data": {
    "skills": ["JavaScript", "React", "Python", "SQL", "Git"],
    "technicalSkills": ["JavaScript", "React", "Python", "SQL", "Git"],
    "softSkills": ["Problem Solving", "Teamwork"],
    "verifiedSkills": [
      { "name": "JavaScript", "category": "technical", "level": "Intermediate" },
      { "name": "React", "category": "technical", "level": "Intermediate" },
      { "name": "Python", "category": "technical", "level": "Beginner" },
      { "name": "SQL", "category": "technical", "level": "Intermediate" },
      { "name": "Git", "category": "technical", "level": "Intermediate" }
    ]
  }
}
```

---

## 2. Generate Custom Role Skills
- **Endpoint**: `POST /api/ai/generate-role-skills`
- **Content-Type**: `application/json`

### Request Body
```json
{
  "roleTitle": "DevOps Engineer",
  "roleDescription": "Responsible for CI/CD pipelines, Docker containerization, and Kubernetes cluster management."
}
```

### Example Response (JSON)
```json
{
  "skills": {
    "critical": ["Docker", "Kubernetes", "CI/CD", "Linux"],
    "important": ["Terraform", "AWS", "Python", "Git"],
    "niceToHave": ["Bash Scripting", "Prometheus", "Grafana"]
  }
}
```

---

## 3. Generate Roadmap
- **Endpoint**: `POST /api/ai/roadmap`
- **Content-Type**: `application/json`

### Request Body
```json
{
  "targetRole": "Full Stack Developer",
  "currentSkills": ["HTML", "CSS", "JavaScript"],
  "missingSkills": {
    "critical": ["React", "Node.js", "SQL"],
    "important": ["TypeScript", "Express", "Tailwind CSS"],
    "niceToHave": ["Docker", "AWS"]
  }
}
```

### Example Response (JSON)
```json
{
  "role": "Full Stack Developer",
  "personalizedSummary": "Comprehensive 12-week roadmap tailored for Full Stack Developer transition.",
  "totalEstimatedDuration": "12 weeks",
  "milestones": [
    {
      "id": "m1",
      "title": "Phase 1: Frontend Mastery & Component Architecture",
      "goal": "Master React functional components, hooks, and responsive styling.",
      "whyItMatters": "Frontend proficiency is essential for building modern interactive applications.",
      "estimatedDuration": "4 weeks",
      "skillsCovered": ["React", "Tailwind CSS"],
      "learningSteps": [
        {
          "topic": "React Hooks & State Management",
          "whyLearnThis": "Core mechanism for handling dynamic data in user interfaces.",
          "resource": {
            "title": "React.dev Official Documentation",
            "type": "Documentation",
            "platform": "React.dev",
            "url": "https://react.dev/learn"
          },
          "estimatedStudyTime": "10 hours",
          "practicalTask": "Build a task management application with state persistence.",
          "completionCriteria": ["State updates cleanly", "Components are properly modularized"]
        }
      ],
      "project": {
        "title": "Interactive Dashboard Capstone",
        "description": "Build a full-featured analytics dashboard connected to live public APIs.",
        "difficulty": "Intermediate",
        "estimatedDuration": "15 hours",
        "completionCriteria": ["Responsive on mobile & desktop", "Includes error handling"]
      }
    }
  ]
}
```

---

## 4. Get Default Careers
- **Endpoint**: `GET /api/careers`

### Example Response (JSON)
```json
{
  "success": true,
  "data": {
    "careers": [
      {
        "id": "data-scientist",
        "title": "Data Scientist",
        "skills": {
          "critical": ["Python", "SQL", "Machine Learning"],
          "important": ["Pandas", "NumPy", "Statistics"],
          "niceToHave": ["Docker", "AWS"]
        }
      }
    ]
  }
}
```

---

## 5. Export Roadmap Markdown
- **Endpoint**: `POST /api/roadmap/export`
- **Content-Type**: `application/json`
- **Response**: Attachment file `SkillBridge_Roadmap.md` (Markdown format)
