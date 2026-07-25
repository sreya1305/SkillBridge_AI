export default function SectionTitle({ eyebrow, title, description, dark = false }) {
  return <div className="max-w-2xl">
    <p className={`eyebrow ${dark ? 'text-violet' : ''}`}>{eyebrow}</p>
    <h2 className={`mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl ${dark ? 'text-ink' : ''}`}>{title}</h2>
    {description && <p className={`mt-4 leading-7 ${dark ? 'text-slate-600' : 'text-slate-300'}`}>{description}</p>}
  </div>
}
