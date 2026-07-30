# Technical Architecture, Technology Stack & API Guide

## Technology Stack

### Frontend
- **Core Framework**: React 18 (Vite build toolchain)
- **Routing**: React Router DOM (v6)
- **Styling**: Vanilla CSS + Tailwind CSS (Utility classes & custom dark mode theme system)
- **PDF Export**: jsPDF + html2canvas
- **Icons**: Lucide React / SVG Icons

### Backend
- **Runtime Environment**: Node.js (ES Modules `type: module`)
- **Web Framework**: Express.js (v4)
- **Middleware**: CORS, Multer (Memory Storage for file uploads)
- **Document Extractors**:
  - `pdf-parse`: PDF text extraction
  - `mammoth`: DOCX raw text extraction
  - `tesseract.js`: Server-side OCR engine for image-based resumes
- **HTTP Client**: Native Node `fetch` with AbortController timeout handling

### AI Integration
- **LLM Engine**: Google Gemini 2.0 Flash (`models/gemini-2.0-flash:generateContent`)
- **API Endpoints**: REST API with JSON response schema enforcement (`responseMimeType: application/json`)

---

## System Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                              CLIENT (Browser)                           |
|  [ProfilePage]  [TargetRolePage]  [SkillGapPage]  [ResumeParserPage]   |
|                                    |                                    |
|                             React Router DOM                            |
|                                    |                                    |
|                       Client Storage (localStorage)                     |
|                                    |                                    |
+------------------------------------+------------------------------------+
                                     |
                             HTTP / REST (JSON & FormData)
                                     |
+------------------------------------+------------------------------------+
|                         EXPRESS BACKEND SERVER                          |
|                             (Port 4000)                                 |
|                                    |                                    |
|  [Multer Memory Storage] -> [PDF/DOCX/Tesseract OCR Extractors]          |
|                                    |                                    |
|                      [Skills Dictionary Normalization]                  |
|                                    |                                    |
|                        [Gemini 2.0 Flash AI API]                        |
+-------------------------------------------------------------------------+
```

---

## System Modules & Responsibilities

1. **Resume Parsing Module (`ResumeParserPage.jsx` & `/api/parse-resume`)**:
   Handles multi-format upload, runs OCR or text extraction, sends prompt to Gemini 2.0 Flash for structured JSON skill extraction, verifies extracted skills against dictionary evidence, and returns verified skill objects.

2. **Profile & Skill Management Module (`ProfilePage.jsx` & `roleStorage.js`)**:
   Manages user skill matrix, skill levels, target role selection, and localStorage persistence.

3. **Skill Gap Analysis Engine (`SkillGapPage.jsx` & `skillGap.js`)**:
   Compares user skills against target role requirements, categorizing skills into matched vs missing (critical, important, nice-to-have) and calculating weighted match percentage scores.

4. **Target Role Management Module (`TargetRolePage.jsx` & `/api/ai/generate-role-skills`)**:
   Provides default role library and connects to Gemini 2.0 Flash to synthesize skill requirements for custom user roles on demand.

5. **AI Roadmap Generation & Tracking Module (`RoadmapPage.jsx` & `/api/ai/roadmap`)**:
   Generates a 12-week customized milestone plan with learning steps, official documentation links, capstone projects, interactive flowchart node graph, study notes drawer, and jsPDF document exporter.

---

## Backend API Specifications

### 1. `POST /api/parse-resume`
- **Description**: Parses uploaded resume (PDF/DOCX/Image) or text string.
- **Request Format**: `multipart/form-data` (`file`) or `application/json` (`resumeText`).
- **Response Format**: JSON containing `skills`, `technicalSkills`, `softSkills`, `verifiedSkills`.

### 2. `POST /api/ai/generate-role-skills`
- **Description**: Generates critical, important, and nice-to-have skills for custom target roles.
- **Request Body**: `{ "roleTitle": "AI Engineer", "roleDescription": "..." }`
- **Response**: `{ "skills": { "critical": [...], "important": [...], "niceToHave": [...] } }`

### 3. `POST /api/ai/roadmap`
- **Description**: Generates 12-week learning roadmap based on target role & skill gaps.
- **Request Body**: `{ "targetRole": "Data Scientist", "currentSkills": [...], "missingSkills": {...} }`
- **Response**: `{ "role": "Data Scientist", "totalEstimatedDuration": "12 weeks", "milestones": [...] }`

### 4. `GET /api/careers`
- **Description**: Returns list of default career profiles.

### 5. `POST /api/gap-analysis`
- **Description**: Utility endpoint performing server-side gap analysis.

### 6. `POST /api/chat/stream`
- **Description**: Server-Sent Events (SSE) streaming endpoint for AI career guidance chat.

### 7. `POST /api/roadmap/export`
- **Description**: Server-side Markdown exporter for roadmaps.
