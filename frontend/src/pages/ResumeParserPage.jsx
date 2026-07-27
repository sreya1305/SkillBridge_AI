import { useState, useRef, useCallback, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageNav from '../components/PageNav'
import { parseResume, parseResumeFile } from '../services/resumeParser'

const ACCEPTED_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/bmp',
  'image/tiff',
]

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ResultSection({ title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#0e1a34] p-6 shadow-xl">
      <h2 className="text-lg font-bold text-mint">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function ResumeParserPage() {
  const [activeTab, setActiveTab] = useState('upload')
  const [resumeText, setResumeText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile)
      setFilePreview(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setFilePreview(null)
    }
  }, [selectedFile])

  const switchTab = (tab) => {
    setActiveTab(tab)
    setError('')
    setParsed(null)
  }

  const handleFileSelect = useCallback((file) => {
    if (!file) return
    const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp|tiff)$/i.test(file.name)
    const isDoc = ACCEPTED_MIME.includes(file.type) || /\.(pdf|docx?)$/i.test(file.name)

    if (!isImage && !isDoc) {
      setError('Unsupported file type. Please upload a PDF, DOCX, or Image (PNG, JPG, WEBP).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.')
      return
    }
    setError('')
    setParsed(null)
    setSelectedFile(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files[0])
  }, [handleFileSelect])

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true) }, [])
  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  const handleParse = async () => {
    setLoading(true)
    setError('')
    setParsed(null)
    try {
      const result = activeTab === 'upload'
        ? await parseResumeFile(selectedFile)
        : await parseResume(resumeText)
      setParsed(result)
    } catch (err) {
      setError(err.message || 'Failed to parse resume.')
    } finally {
      setLoading(false)
    }
  }

  const canParse = activeTab === 'upload' ? !!selectedFile : resumeText.trim().length > 0

  return (
    <main className="relative isolate min-h-screen bg-ink text-white pt-20 pb-16 overflow-hidden">
      <div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-10rem] top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" />
      <div className="absolute left-[-10rem] bottom-20 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" />
      <Navbar />

      <section className="wrap py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <PageNav backHref="/" backLabel="Back to Home" />

          <div className="rounded-3xl border border-white/10 bg-[#0e1a34] p-8 sm:p-10 shadow-xl">
            {/* Header */}
            <div>
              <p className="eyebrow text-mint">Resume analysis</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-white sm:text-5xl">
                AI-powered resume parsing
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Upload a PDF, DOCX, or picture of your resume (PNG, JPG, WEBP), or paste text directly. Our AI & OCR engine instantly extracts skills, education, experience, and certifications.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="mt-8 flex gap-1 rounded-2xl border border-white/10 bg-white/[.04] p-1 w-fit">
              {[['upload', '📁', 'Upload File / Picture'], ['text', '📋', 'Paste Text']].map(([tab, icon, label]) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-violet text-white shadow-glow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Upload tab */}
            {activeTab === 'upload' && (
              <div className="mt-6 space-y-3">
                <div
                  role="button"
                  tabIndex={0}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                  className={`relative cursor-pointer select-none rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
                    isDragging
                      ? 'border-mint bg-mint/10 scale-[1.01]'
                      : selectedFile
                      ? 'border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400/70'
                      : 'border-white/20 bg-white/[.02] hover:border-violet/60 hover:bg-violet/5'
                  }`}
                >
                  <input
                    id="resume-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.webp,.bmp,.tiff,image/*"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="space-y-4">
                      {filePreview ? (
                        <div className="mx-auto h-32 w-32 overflow-hidden rounded-2xl border border-emerald-500/40 bg-black/40 shadow-lg flex items-center justify-center p-1">
                          <img src={filePreview} alt="Resume Preview" className="h-full w-full object-contain rounded-xl" />
                        </div>
                      ) : (
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-3xl">
                          {selectedFile.type.includes('pdf') ? '📄' : '📝'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-emerald-300 text-base truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatFileSize(selectedFile.size)} · {selectedFile.type.startsWith('image/') ? 'Image Document' : 'Document'} · Click to change
                        </p>
                      </div>
                      <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                        ✓ Ready to parse {selectedFile.type.startsWith('image/') ? '(OCR & AI Vision)' : ''}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                        {isDragging ? '📥' : '🖼️'}
                      </div>
                      <div>
                        <p className="text-base font-bold text-white">
                          {isDragging ? 'Drop your resume file or image here' : 'Drag & drop your resume or picture'}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          or <span className="font-semibold text-mint">click to browse</span>
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">PDF, DOCX, PNG, JPG, WEBP supported · Max 10 MB</p>
                    </div>
                  )}
                </div>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setFilePreview(null); setParsed(null) }}
                    className="text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors"
                  >
                    × Remove file
                  </button>
                )}
              </div>
            )}

            {/* Text tab */}
            {activeTab === 'text' && (
              <div className="mt-6 space-y-3">
                <label htmlFor="resume-text" className="block text-sm font-semibold text-slate-200">
                  Resume text
                </label>
                <textarea
                  id="resume-text"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={12}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-slate-400 outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20 resize-none"
                  placeholder="Paste your resume text here…"
                />
                {resumeText.length > 18000 && (
                  <p className="text-xs text-amber-400">Approaching character limit ({resumeText.length} / 20 000)</p>
                )}
              </div>
            )}

            {/* Parse button */}
            <div className="mt-6">
              <button
                id="parse-resume-btn"
                onClick={handleParse}
                disabled={loading || !canParse}
                className="inline-flex items-center gap-2.5 rounded-full bg-violet px-8 py-3.5 text-sm font-bold text-white shadow-glow transition-all hover:bg-violet/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" strokeWidth="3" stroke="currentColor">
                    <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                )}
                {loading ? 'Parsing resume…' : 'Parse resume'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-6 text-sm font-semibold text-red-300">
              {error}
            </div>
          )}

          {/* Results */}
          {parsed && (() => {
            const data = parsed.data || parsed
            const skills = Array.isArray(data.skills) ? data.skills : (Array.isArray(parsed.skills) ? parsed.skills : [])

            const saveSkillsAndNavigate = (targetPath) => {
              if (typeof window !== 'undefined') {
                let existingSkills = []
                try {
                  const stored = JSON.parse(window.localStorage.getItem('userSkills') || '[]')
                  existingSkills = Array.isArray(stored) ? stored.map(s => typeof s === 'string' ? s : s.name).filter(Boolean) : []
                } catch {}

                const mergedSkills = Array.from(new Set([...existingSkills, ...skills]))
                if (mergedSkills.length > 0) {
                  window.localStorage.setItem('userSkills', JSON.stringify(mergedSkills))
                }
              }
              window.location.href = targetPath
            }

            return (
              <div className="grid gap-6">
                <div className="rounded-3xl border border-emerald-500/40 bg-emerald-950/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white text-lg">✓ Resume Skills Parsed Successfully!</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {skills.length} skills detected. Save these skills to your profile and proceed to target role selection.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => saveSkillsAndNavigate('/profile#target-role')}
                      className="rounded-full bg-mint px-7 py-3 text-sm font-bold text-ink hover:bg-mint/90 transition-all shadow-glow"
                    >
                      Select Target Role →
                    </button>
                  </div>
                </div>

                <ResultSection title={`Detected Technical & Soft Skills (${skills.length})`}>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <span key={s} className="rounded-full border border-mint/30 bg-mint/10 px-3.5 py-2 text-sm font-bold text-mint shadow-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-sm text-slate-400">No skills detected in this document.</p>}
                </ResultSection>
              </div>
            )
          })()}
        </div>
      </section>
    </main>
  )
}