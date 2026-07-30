# Objectives & Core Features

## Project Objectives
1. **Automate Resume Analysis**: Provide seamless drag-and-drop parsing for PDF, DOCX, and image resumes (PNG/JPG) using server-side Tesseract OCR and Google Gemini 2.0 Flash vision/text processing.
2. **Deliver Precise Gap Identification**: Quantify missing candidate capabilities across critical, important, and optional tiers to prioritize learning effort.
3. **Generate Actionable Learning Paths**: Produce structured 12-week roadmaps complete with curated documentation links, practical daily tasks, and capstone project specifications.
4. **Enable Full Offline Capability & Exportability**: Support client-side PDF document generation (jsPDF) and local storage persistence so users retain progress without data loss.

---

## Core System Features

### 1. Multi-Format Resume Parser
- **File Support**: PDF, DOCX, PNG, JPG, JPEG, and direct text paste.
- **Tesseract OCR Integration**: Extracts raw text from image-based resumes automatically.
- **Skills Normalization Layer**: Uses `skillsDictionary.js` to standardize raw extracted text, mapping synonyms (e.g., `JS` -> `JavaScript`, `Postgres` -> `PostgreSQL`).

### 2. Profile & Skill Management
- Interactive user skill matrix with level selection (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
- Quick-add buttons for popular industry skills (React, Python, SQL, Docker, AWS, etc.).
- Reload-persistent profile state stored in `localStorage`.

### 3. Target Career Role Library & Custom AI Role Generator
- Pre-loaded role library: Data Scientist, Software Developer, Full Stack Developer, UI/UX Designer, Cybersecurity Analyst, AI Engineer.
- AI-driven custom role creation: Generates critical, important, and nice-to-have skill requirements for specialized roles on demand.

### 4. Skill Gap Matrix & Analytics
- Calculates match percentage using a weighted formula: `Match % = (Matched Score / Total Required Score) * 100`.
- Categorized gap visualization displaying matched vs. missing skills with priority badges.

### 5. Interactive Roadmap Generator
- 12-week roadmap structured into Phase 1 (Foundations), Phase 2 (Core Proficiency), and Phase 3 (Specialization & Capstones).
- Multiple view modes: Interactive Flowchart Node Map & Detailed Checklist View.
- Real-time checkbox completion tracking & personal study note drawer per skill module.
- 1-click Client-side jsPDF Document Generation with custom page layouts & canvas rendering.
