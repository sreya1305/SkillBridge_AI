import Button from './components/Button'
import Navbar from './components/Navbar'
import SectionTitle from './components/SectionTitle'
import ProfilePage from './pages/ProfilePage'
import TargetRolePage from './pages/TargetRolePage'
import SkillGapPage from './pages/SkillGapPage'
import ResumeParserPage from './pages/ResumeParserPage'
import RoadmapPage from './pages/RoadmapPage'

const features = [
  ['01', 'Start with what you know', 'Add your existing skills or upload your resume to create your starting point.'],
  ['02', 'Aim for the right role', 'Choose the career you want next and see the capabilities that matter.'],
  ['03', 'Understand your gap', 'Turn role requirements into a focused learning priority.'],
  ['04', 'Learn with direction', 'Follow a practical roadmap shaped around where you are today.'],
]
const steps = [['01', 'Share your skills', 'Add your skills manually or upload a resume to make a starting profile.'], ['02', 'Choose a destination', 'Select the role you want to grow into, from data analyst to product designer.'], ['03', 'See your path forward', 'Understand your gaps and follow learning milestones built for you.']]

function HeroFlow() {
  const flow = [
    ['01', 'Current skills', 'React / SQL / Figma'],
    ['02', 'Skill gap', '3 priority skills found'],
    ['03', 'Roadmap', '12-week focused plan'],
    ['04', 'Career readiness', 'You are on your way'],
  ]

  return (
    <div className="relative mx-auto mt-14 max-w-5xl">
      <div className="absolute left-[12%] right-[12%] top-10 hidden h-[1px] bg-gradient-to-r from-mint/20 via-mint/60 to-mint/20 md:block" />
      <div className="relative grid gap-4 md:grid-cols-4">
        {flow.map(([number, title, detail]) => (
          <div
            key={title}
            className="rounded-2xl border border-mint/35 bg-gradient-to-b from-mint/15 via-[#0d2736]/90 to-[#0e1a34] p-5 text-left backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-mint/65 hover:from-mint/25 hover:shadow-mint/20"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl font-[DM_Mono] text-xs font-bold text-mint bg-mint/20 border border-mint/40 shadow-xs">
              {number}
            </div>
            <h3 className="mt-5 text-sm font-bold text-white">{title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-emerald-200/90">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  if (typeof window !== 'undefined') {
    try {
      const nav = performance.getEntriesByType('navigation')
      if (nav.length > 0 && nav[0].type === 'reload') {
        window.localStorage.clear()
        window.sessionStorage.clear()
      }
    } catch {
      // ignore
    }
  }

  const rawPath = typeof window !== 'undefined' ? window.location.pathname : '/'
  const path = rawPath.replace(/\/+$/, '') || '/'

  if (path === '/profile') return <ProfilePage />
  if (path === '/target-role') return <TargetRolePage />
  if (path === '/skill-gap') return <SkillGapPage />
  if (path === '/resume-parser') return <ResumeParserPage />
  if (path === '/roadmap') return <RoadmapPage />
  return <main id="top" className="relative isolate overflow-hidden"><Navbar /><section className="relative isolate min-h-[760px] overflow-hidden pb-20 pt-36 text-center sm:pt-44"><div className="absolute left-1/2 top-[-26rem] -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet/25 blur-[130px]" /><div className="absolute right-[-10rem] top-1/4 -z-10 h-[550px] w-[550px] rounded-full bg-mint/15 blur-[160px] pointer-events-none" /><div className="absolute left-[-10rem] bottom-10 -z-10 h-[500px] w-[500px] rounded-full bg-mint/10 blur-[150px] pointer-events-none" /><div className="wrap"><div className="inline-flex rounded-full border border-mint/20 bg-mint/5 px-3 py-1.5 text-xs font-semibold text-mint">Your career, mapped with clarity</div><h1 className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-[1.06] tracking-[-.055em] sm:text-6xl lg:text-7xl">Turn what you know into <span className="text-mint">where you are going.</span></h1><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">SkillBridge AI shows you the shortest, smartest path from your current skills to the career you want next.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Button href="/profile">Build my roadmap</Button><Button variant="secondary" href="#how-it-works">See how it works</Button></div><p className="mt-4 text-xs text-slate-500">No guesswork. Just a clear next step.</p><HeroFlow /></div></section><section id="features" className="bg-[#f7f8fa] py-24 text-ink sm:py-32"><div className="wrap"><SectionTitle dark eyebrow="Built for momentum" title="A clearer way to grow into your next role." description="Every part of SkillBridge helps turn ambition into an actionable plan." /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(([number, title, copy]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-violet/40 hover:shadow-xl"><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet/10 font-[DM_Mono] text-sm text-violet">{number}</div><h3 className="mt-6 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p></article>)}</div></div></section><section id="how-it-works" className="bg-[#101d38] py-24 sm:py-32"><div className="wrap grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24"><div><SectionTitle eyebrow="How it works" title="From uncertainty to a plan you can act on." description="You do not need to figure out every career move alone. Start with your skills; we will help reveal the next right ones." /><Button href="/profile" className="mt-8">Explore your path</Button></div><div className="space-y-4">{steps.map(([number, title, copy]) => <article key={number} className="flex gap-5 rounded-2xl border border-white/10 bg-white/[.04] p-5 sm:p-6"><span className="font-[DM_Mono] text-sm text-mint">{number}</span><div><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p></div></article>)}</div></div></section><section id="get-started" className="bg-mint py-20 text-ink sm:py-24"><div className="wrap"><div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-ink px-7 py-10 text-white sm:px-12 sm:py-14 lg:flex-row lg:items-center"><div><p className="eyebrow">Your next move starts here</p><h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Make your skills work harder for your future.</h2></div><Button href="/profile" className="shrink-0">Get started free</Button></div></div></section></main>
}
