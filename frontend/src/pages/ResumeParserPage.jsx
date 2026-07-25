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

  return <main className="min-h-screen bg-[#f7f8fa] text-ink">
    <Navbar />
    <section className="wrap py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div>
            <p className="eyebrow text-violet">Resume analysis</p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-ink sm:text-5xl">AI-powered resume parsing</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Paste your resume text below. The backend extracts skills, education, experience, and certifications.</p>
          </div>

          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Resume text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="h-64 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
              placeholder="Paste your resume here..."
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleParse}
                disabled={loading || !resumeText.trim()}
                className="rounded-full bg-violet px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet/90 disabled:opacity-60"
              >
                {loading ? 'Parsing...' : 'Parse resume'}
              </button>
              {resumeText.length > 18000 && <span className="text-xs text-slate-500">Approaching length limit</span>}
            </div>
          </div>
        </div>

        {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>}

        {parsed && (
          <div className="grid gap-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {parsed.skills?.length > 0 ? parsed.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{skill}</span>) : <p className="text-sm text-slate-500">None detected</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">Education</h2>
              <div className="mt-4 space-y-3">
                {parsed.education?.length > 0 ? parsed.education.map((entry, idx) => <div key={idx} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-ink">{entry.school || 'Unknown school'}</p>
                  <p>{entry.degree || 'Unknown degree'}</p>
                  <p className="text-xs text-slate-500">{entry.startYear ?? '?'} - {entry.endYear ?? '?'}</p>
                </div>) : <p className="text-sm text-slate-500">None detected</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">Experience</h2>
              <div className="mt-4 space-y-3">
                {parsed.experience?.length > 0 ? parsed.experience.map((entry, idx) => <div key={idx} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-ink">{entry.company || 'Unknown company'}</p>
                  <p>{entry.title || 'Unknown title'}</p>
                  <p className="text-xs text-slate-500">{entry.startYear ?? '?'} - {entry.endYear ?? '?'}</p>
                  {entry.description && <p className="mt-2 text-slate-600">{entry.description}</p>}
                </div>) : <p className="text-sm text-slate-500">None detected</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-ink">Certifications</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {parsed.certifications?.length > 0 ? parsed.certifications.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{item}</span>) : <p className="text-sm text-slate-500">None detected</p>}
              </div>
            </section>
          </div>
        )}
      </div>
    </section>
  </main>
}