export default function Button({ children, href = '#get-started', variant = 'primary', className = '' }) {
  const styles = variant === 'primary' ? 'bg-mint text-ink hover:bg-[#d9fae5]' : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
  return <a href={href} className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${styles} ${className}`}>{children}<span aria-hidden="true">→</span></a>
}
