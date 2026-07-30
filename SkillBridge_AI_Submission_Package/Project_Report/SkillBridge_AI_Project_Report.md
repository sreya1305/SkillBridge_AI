# SkillBridge AI - Full Project Report

## 1. Executive Summary
SkillBridge AI is an innovative career transition engineering platform designed to eliminate ambiguity in professional upskilling. By leveraging multi-format OCR resume extraction, deterministic evidence verification, weighted gap analysis algorithms, and Google Gemini 2.0 Flash AI model synthesis, SkillBridge AI generates customized 12-week learning roadmaps. Complete with curated official documentation resources, daily practical exercises, capstone project specifications, interactive visual flowchart maps, and PDF export functionality, SkillBridge AI empowers candidates to systematically bridge skill gaps and achieve target career milestones.

---

## 2. Functional Requirements
1. **Resume Analysis**: System MUST accept PDF, DOCX, and PNG/JPG image uploads and extract candidate skills using OCR & LLM parsing.
2. **Skill Evidence Verification**: System MUST cross-verify AI-extracted skills against raw resume text via dictionary matching to prevent hallucinations.
3. **Profile & Skill Management**: Users MUST be able to view, add, modify skill levels, and select target career roles.
4. **Target Role Synthesizer**: System MUST allow users to select from pre-configured role profiles or generate custom target roles on demand.
5. **Skill Gap Categorization**: System MUST categorize gaps into Critical (60% weight), Important (30% weight), and Nice-to-Have (10% weight), calculating overall match percentages.
6. **Roadmap Generation**: System MUST generate a 12-week roadmap structured into Phase 1, Phase 2, and Phase 3 with curated links, study time estimates, and capstone projects.
7. **Interactive Flowchart & Tracking**: System MUST render node-based flowchart visuals and enable checkbox progress tracking stored in `localStorage`.
8. **PDF Export**: System MUST generate client-side downloadable PDF roadmap reports.

---

## 3. Non-Functional Requirements
1. **Performance**: Resume parsing and skill gap calculations MUST complete in under 5 seconds.
2. **Resilience**: Frontend MUST feature automatic client-side fallback generation if the backend or AI provider is unreachable.
3. **Usability**: Interface MUST adhere to modern dark-mode aesthetic standards with glassmorphic cards, clear visual hierarchy, and responsive mobile/desktop layouts.
4. **Maintainability**: Modular component design in React and standalone Express routes ensuring ease of extension.
5. **Security**: No user files or resume buffers stored permanently on server disk; memory-only processing via Multer.

---

## 4. Detailed Module Description

### Module A: Resume Extraction Pipeline
- **Input**: Binary file buffer or raw text paste.
- **Process**: File type detection -> PDF text extraction (`pdf-parse`) / DOCX extraction (`mammoth`) / Image OCR (`tesseract.js`) -> Gemini 2.0 Flash JSON extraction -> Normalization & Dictionary Verification (`skillsDictionary.js`).
- **Output**: Verified skill objects with level and categorization.

### Module B: Skill Gap Matrix Engine
- **Input**: User skills array & Target Role required skills object.
- **Process**: Normalizes strings -> Identifies matched vs. missing skills across critical, important, and nice-to-have tiers -> Applies weighted score calculation:
  $$\text{Match \%} = \frac{W_{\text{critical}} \cdot M_{\text{critical}} + W_{\text{important}} \cdot M_{\text{important}} + W_{\text{optional}} \cdot M_{\text{optional}}}{W_{\text{critical}} \cdot T_{\text{critical}} + W_{\text{important}} \cdot T_{\text{important}} + W_{\text{optional}} \cdot T_{\text{optional}}} \times 100$$
- **Output**: Matched list, missing list, match percentage.

### Module C: Roadmap Generator & Exporter
- **Input**: Target role title, current skills, skill gap analysis.
- **Process**: Calls Gemini 2.0 Flash or deterministic fallback generator -> Produces 12-week milestones -> Renders Flowchart & Checklist -> Exports PDF via `jsPDF`.

---

## 5. User Flow Diagram

```
[ Landing Page / Nav ] 
          │
          ├──> [ Resume Parser (/resume-parser) ]
          │          │ (Upload PDF/DOCX/Image)
          │          ▼
          │    [ Extract & Verify Skills ]
          │          │
          └──────────┼──────> [ Profile Setup (/profile) ]
                     │              │ (Select Target Role)
                     │              ▼
                     └─────> [ Skill Gap Analysis (/skill-gap) ]
                                    │ (Review Match % & Gaps)
                                    ▼
                             [ Roadmap Page (/roadmap) ]
                                    │
                                    ├──> Click "Generate Roadmap"
                                    ├──> View Flowchart Node Graph
                                    ├──> Track Checklist Progress
                                    └──> Download PDF Strategy Report
```

---

## 6. Conclusion
SkillBridge AI successfully delivers an end-to-end AI career transition environment. By pairing state-of-the-art vision and language models with deterministic evidence verification and responsive user interfaces, the platform establishes a reliable, actionable bridge between job seekers and industry expectations.
