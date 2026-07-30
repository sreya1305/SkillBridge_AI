# Installation Guide, Folder Structure, Testing & Evaluation

## Project Folder Structure

```
SkillBridge_AI/
├── backend/
│   ├── .env                    # Environment variables (GEMINI_API_KEY, PORT)
│   ├── package.json            # Node.js backend dependencies
│   ├── server.js               # Express server, API routes, Tesseract OCR, Gemini 2.0 integration
│   ├── skillsDictionary.js     # Evidence verification dictionary & synonym normalizer
│   └── eng.traineddata         # Tesseract OCR language data file
├── frontend/
│   ├── index.html              # HTML5 entry document
│   ├── package.json            # Vite & React dependencies
│   ├── vite.config.js          # Vite config & server proxy setup
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── src/
│       ├── main.jsx            # React root application entry
│       ├── App.jsx             # Route provider & top-level layout
│       ├── pages/              # Primary application pages
│       │   ├── ProfilePage.jsx         # User skills & target role selection
│       │   ├── TargetRolePage.jsx      # Role library & custom role creator
│       │   ├── SkillGapPage.jsx        # Gap analysis matrix & match score
│       │   ├── ResumeParserPage.jsx    # Multi-format resume uploader & OCR
│       │   └── RoadmapPage.jsx         # AI Roadmap generator, flowchart, & PDF export
│       ├── components/         # Reusable UI components (Navbar, PageNav, RoleCard, BackButton)
│       ├── lib/                # Utility modules (skillGap.js, roleStorage.js)
│       └── services/           # Service integrations (resumeParser.js, roadmapGenerator.js)
└── README.md                   # Core project README
```

---

## Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Google Gemini API Key** (Free tier key from Google AI Studio)

### Step 1: Clone or Extract Repository
```bash
cd SkillBridge_AI
```

### Step 2: Configure Backend Environment Variables
Create or verify `backend/.env`:
```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Install Backend Dependencies & Start Server
```bash
cd backend
npm install
npm start
```
*Backend server will start listening on `http://localhost:4000`.*

### Step 4: Install Frontend Dependencies & Start Dev Server
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend dev server will start on `http://localhost:5173`.*

---

## Limitations & Challenges Faced

### Limitations
1. **API Rate Limits**: Reliance on Google Gemini free tier API limits requests per minute. Implemented automatic local fallback generation when API key is missing or rate limited.
2. **Local Storage Bound**: Progress state is persisted in `localStorage`. Cross-device synchronization requires adding user authentication & database backend in future versions.
3. **Image OCR Accuracy**: Handwritten or low-resolution image resumes rely on Tesseract OCR accuracy; low contrast images fallback to dictionary string verification.

### Challenges Faced & Solutions
- **Unresponsive AI Provider Hanging UI**: Resolved by introducing an `AbortController` with a 6-second timeout in `roadmapGenerator.js`, automatically triggering client fallback if backend is unreachable.
- **Strict Evidence Verification**: Prevented hallucinated skills from AI by introducing `verifySkillsAgainstText()` in `skillsDictionary.js` to cross-examine AI candidates against raw resume text.

---

## Testing Summary & Conclusion

### Automated & Manual Testing Completed
- **Unit Testing**: Verified `skillGap.js` match percentage calculations and dictionary normalizer functions.
- **Integration Testing**: Verified `/api/parse-resume` with PDF, DOCX, and PNG samples.
- **End-to-End Browser Testing**: Browser subagents tested complete user journeys from profile setup -> resume parse -> gap analysis -> roadmap generation -> PDF export.

### Conclusion
SkillBridge AI successfully addresses career transition challenges by turning unstructured resume data and job requirements into structured, verifiable learning pathways. The application meets all project requirements with high performance, elegant visual design, and resilient client-server fallback mechanisms.
