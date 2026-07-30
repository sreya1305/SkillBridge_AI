# SkillBridge AI - PowerPoint Presentation Content

---

## Slide 1: Title Slide
**SkillBridge AI: AI-Powered Career Transition & Skill Gap Analysis Platform**
- **Sub-header**: Bridging the Gap Between Current Skills and Target Roles Using Gemini 2.0 Flash
- **Project Domain**: Artificial Intelligence / EdTech / Career Development
- **Presentation Date**: July 2026

---

## Slide 2: Team Details
- **Project Lead / Developer**: [Insert Name]
- **Institution / Organization**: [Insert Department / Institution Name]
- **Guide / Mentor**: [Insert Mentor Name]

---

## Slide 3: Problem Statement
- **Rapidly Evolving Job Requirements**: Technical roles constantly introduce emerging tools & frameworks, confusing job seekers.
- **Unclear Skill Prioritization**: Candidates don't know which skills are critical deal-breakers vs. optional.
- **Lack of Actionable Roadmaps**: Traditional job portals list required skills but fail to provide structured learning steps or curated documentation.

---

## Slide 4: The Solution - SkillBridge AI
- **Multi-Format Resume Intelligence**: Instant parsing of PDF, DOCX, and image-based resumes using server-side Tesseract OCR and Gemini 2.0.
- **Weighted Skill Gap Analysis**: Categorizes skills into Critical, Important, and Nice-to-Have with quantitative match percentage scoring.
- **Personalized 12-Week AI Roadmaps**: Structured milestone phases featuring official documentation links, practical tasks, capstone project specs, flowchart node map, and PDF export.

---

## Slide 5: Existing vs Proposed System

| Existing System | Proposed System (SkillBridge AI) |
| :--- | :--- |
| Manual text input or self-rating sliders | Automated Multi-format Resume Parsing (OCR + AI) |
| Binary (Match / No Match) assessment | Weighted Gap Matrix (Critical/Important/Optional) |
| Static generic job roles | Default role library + AI Custom Role Generator |
| No learning steps or resource links | 12-week roadmap with curated MDN/Official docs |
| Static web pages | Interactive Flowchart Node Graph & PDF Exporter |

---

## Slide 6: Project Objectives
1. **Automate Resume Skill Extraction**: Eliminate manual data entry via OCR & LLM extraction.
2. **Quantify Candidate Match**: Provide transparent, weighted match percentage metrics.
3. **Generate Actionable Guidance**: Create structured weekly learning plans with capstone specifications.
4. **Ensure High Availability**: Provide resilient fallback mechanisms to ensure 100% roadmap availability even without an active AI key.

---

## Slide 7: Core Features
- 📄 **Multi-Format Resume Parser**: PDF, DOCX, PNG, JPG, and Text Paste.
- 🎯 **Target Role Selection & AI Role Creator**: Built-in library + Custom AI role synthesizer.
- 📊 **Weighted Skill Gap Matrix**: Critical (60%), Important (30%), Nice-to-Have (10%).
- 🧭 **Interactive Flowchart Roadmap**: Node-based visual transition workflow.
- 📝 **Study Notes & Progress Persistence**: Browser `localStorage` tracking + Note drawer per skill.
- 📥 **1-Click PDF Export**: Clean client-side PDF document generator using jsPDF.

---

## Slide 8: System Architecture
```
+-------------------------------------------------------------------+
|                        React 18 Frontend                          |
|         (Profile, Target Role, Skill Gap, Resume Parser, Roadmap) |
+---------------------------------+---------------------------------+
                                  | HTTP / REST
+---------------------------------v---------------------------------+
|                       Node.js / Express Server                     |
|           [Tesseract OCR] [pdf-parse] [mammoth] [Skills Dict]     |
+---------------------------------+---------------------------------+
                                  | HTTPS API Key
+---------------------------------v---------------------------------+
|                   Google Gemini 2.0 Flash API                     |
+-------------------------------------------------------------------+
```

---

## Slide 9: Workflow Diagram
1. **User Profile Setup / Upload**: User uploads resume or selects current skills.
2. **Target Role Selection**: User picks target role (e.g. Data Scientist) or generates custom role.
3. **Skill Gap Engine**: System calculates matched vs. missing skills and match score.
4. **Roadmap Generation**: System generates 12-week Phase 1/2/3 learning roadmap.
5. **Interactive Learning & Export**: User tracks progress, takes notes, and exports PDF report.

---

## Slide 10: Technologies Used
- **Frontend**: React 18, Vite, Tailwind CSS, React Router DOM, jsPDF.
- **Backend**: Node.js, Express.js, Cors, Multer.
- **Parsers**: Tesseract.js (OCR), pdf-parse, mammoth (DOCX).
- **AI Core**: Google Gemini 2.0 Flash REST API.

---

## Slide 11: AI Integration & Workflow
- **Prompt Engineering**: Structured JSON response schemas forced via `responseMimeType: application/json`.
- **Evidence Verification Layer**: `skillsDictionary.js` cross-verifies AI candidates against raw resume text to eliminate hallucinations.
- **Resilient Fallback System**: Client-side `AbortController` timeout automatically activates deterministic local generators if backend hangs.

---

## Slide 12: Demo Flow & Screenshots
- **Step 1**: Upload Resume on `/resume-parser` -> Instant skill extraction.
- **Step 2**: Select Role on `/profile` or `/target-role`.
- **Step 3**: Inspect Skill Gap Matrix on `/skill-gap`.
- **Step 4**: View Flowchart & Checklist Roadmap on `/roadmap`.
- **Step 5**: Download PDF report.

---

## Slide 13: Future Scope
- **User Authentication & Cloud Persistence**: Firebase/Supabase user accounts across devices.
- **Mock AI Interview Practice**: Real-time voice/text interview simulator for target roles.
- **Job Board Integration**: Live API connection to LinkedIn / Indeed job postings.

---

## Slide 14: Conclusion
SkillBridge AI successfully transforms passive job seeking into an active, structured career transition journey. Combining multi-modal AI parsing with deterministic evidence verification and interactive roadmaps, it provides a state-of-the-art career development solution.

---

## Slide 15: Thank You
**Thank You!**
- Questions & Discussion
- Project Repository: `https://github.com/sreya1305/SkillBridge_AI`
