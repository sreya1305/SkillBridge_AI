import { useState } from 'react'
import Button from './Button'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [['How it works', '#how-it-works'], ['Features', '#features']]
  return <header className="absolute inset-x-0 top-0 z-20"><nav className="wrap flex h-20 items-center justify-between"><a href="#top" className="flex items-center gap-2.5 font-extrabold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-mint text-ink">*</span>SkillBridge <span className="-ml-2 text-mint">AI</span></a><div className="hidden items-center gap-8 md:flex">{links.map(([label, href]) => <a key={href} href={href} className="text-sm font-semibold text-slate-300 hover:text-white">{label}</a>)}<Button href="/profile" className="px-4 py-2.5">Get started</Button></div><button onClick={() => setOpen(!open)} className="rounded-lg border border-white/15 px-3 py-2 text-sm md:hidden" aria-label="Toggle menu">{open ? 'Close' : 'Menu'}</button></nav>{open && <div className="wrap md:hidden"><div className="rounded-xl border border-white/10 bg-[#101d38] p-3">{links.map(([label, href]) => <a onClick={() => setOpen(false)} key={href} href={href} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-200">{label}</a>)}<Button href="/profile" className="mt-2 w-full">Get started</Button></div></div>}</header>
}
