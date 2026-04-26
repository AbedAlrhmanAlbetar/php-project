import clsx from 'clsx'

/* ─── Spinner ─────────────────────────────────────────────── */
export function Spinner({ className = '' }) {
  return (
    <div className={clsx('w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin', className)} />
  )
}

/* ─── Star Rating ─────────────────────────────────────────── */
export function StarRating({ rating = 0, max = 5, size = 'sm', interactive = false, onChange }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(rating)
        return (
          <svg
            key={i}
            onClick={() => interactive && onChange?.(i + 1)}
            className={clsx(
              sizes[size],
              filled ? 'text-amber-400' : 'text-slate-200',
              interactive && 'cursor-pointer hover:text-amber-300 transition-colors'
            )}
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      })}
    </div>
  )
}

/* ─── Badge ───────────────────────────────────────────────── */
export function Badge({ children, color = 'brand' }) {
  const colors = {
    brand:  'bg-brand-50 text-brand-700',
    green:  'bg-emerald-50 text-emerald-700',
    blue:   'bg-blue-50 text-blue-700',
    red:    'bg-red-50 text-red-700',
    slate:  'bg-slate-100 text-slate-600',
  }
  return (
    <span className={clsx('badge', colors[color] || colors.brand)}>{children}</span>
  )
}

/* ─── Input ───────────────────────────────────────────────── */
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input className={clsx('input', error && 'border-red-400 focus:ring-red-300', className)} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ─── Textarea ────────────────────────────────────────────── */
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea className={clsx('input resize-none', error && 'border-red-400', className)} {...props} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ─── Select ──────────────────────────────────────────────── */
export function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select className={clsx('input', error && 'border-red-400', className)} {...props}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ─── Empty State ─────────────────────────────────────────── */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      {Icon && <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>}
      <div>
        <h3 className="font-semibold text-slate-700 text-lg">{title}</h3>
        {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}

/* ─── Pagination ──────────────────────────────────────────── */
export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null
  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={clsx(
            'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
            p === meta.current_page
              ? 'bg-brand-500 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300'
          )}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

/* ─── Modal ───────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        {title && <h2 className="text-xl font-display font-bold text-slate-900 mb-5">{title}</h2>}
        {children}
      </div>
    </div>
  )
}
