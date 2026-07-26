import { useState } from 'react'
import Navbar from '../components/Navbar'
import { parseResume } from '../services/resumeParser'

export default function ResumeParserPage() {
  const [resumeText, setResumeText] = useState('')
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleParse = async () => {
    setLoading(true)
    setError('')
    setParsed(null)
    try {
      const result = await parseResume(resumeText)
      setParsed(result)
    } catch (err) {
      setError(err.message || 'Failed to parse resume')
    } finally {
      setLoading(false)
    }
  }

  return <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
    <div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px] pointer-events-none" />
    <div className="absolute right-[-10rem] top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" />
    <div className="absolute left-[-10rem] bottom-20 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" />
    <Navbar />
    <section className="wrap py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-[#0e1a34] p-10 shadow-xl">
          <div>
            <p className="eyebrow text-mint">Resume analysis</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-white sm:text-5xl">AI-powered resume parsing</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Paste your resume text below. The backend extracts skills, education, experience, and certifications.</p>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-slate-200">Resume text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="h-64 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
              placeholder="Paste your resume here..."
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleParse}
                disabled={loading || !resumeText.trim()}
                className="rounded-full bg-violet px-6 py-3 text-sm font-bold text-white shadow-glow hover:bg-violet/90 transition-all disabled:opacity-60"
              >
                {loading ? 'Parsing...' : 'Parse resume'}
              </button>
              {resumeText.length > 18000 && <span className="text-xs text-slate-400">Approaching length limit</span>}
            </div>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-6 text-sm font-semibold text-red-300">{error}</div>}

        {parsed && (
          <div className="grid gap-6">
            <section className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 shadow-xl">
              <h2 className="text-lg font-bold text-mint">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {parsed.skills?.length > 0 ? parsed.skills.map((skill) => <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">{skill}</span>) : <p className="text-sm text-slate-400">None detected</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 shadow-xl">
              <h2 className="text-lg font-bold text-mint">Education</h2>
              <div className="mt-4 space-y-3">
                {parsed.education?.length > 0 ? parsed.education.map((entry, idx) => <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">{entry.school || 'Unknown school'}</p>
                  <p>{entry.degree || 'Unknown degree'}</p>
                  <p className="text-xs text-slate-400">{entry.startYear ?? '?'} - {entry.endYear ?? '?'}</p>
                </div>) : <p className="text-sm text-slate-400">None detected</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 shadow-xl">
              <h2 className="text-lg font-bold text-mint">Experience</h2>
              <div className="mt-4 space-y-3">
                {parsed.experience?.length > 0 ? parsed.experience.map((entry, idx) => <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">{entry.company || 'Unknown company'}</p>
                  <p>{entry.title || 'Unknown title'}</p>
                  <p className="text-xs text-slate-400">{entry.startYear ?? '?'} - {entry.endYear ?? '?'}</p>
                  {entry.description && <p className="mt-2 text-slate-300">{entry.description}</p>}
                </div>) : <p className="text-sm text-slate-400">None detected</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 shadow-xl">
              <h2 className="text-lg font-bold text-mint">Certifications</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {parsed.certifications?.length > 0 ? parsed.certifications.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">{item}</span>) : <p className="text-sm text-slate-400">None detected</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </section>
  </main>
}