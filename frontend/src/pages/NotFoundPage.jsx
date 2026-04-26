import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
        <Wrench className="w-10 h-10 text-brand-400" />
      </div>
      <h1 className="font-display text-6xl font-bold text-slate-200 mb-2">404</h1>
      <h2 className="font-display text-2xl font-bold text-slate-800 mb-3">Page Not Found</h2>
      <p className="text-slate-500 max-w-sm mb-8">
        Looks like this page went missing. Let's get you back on track.
      </p>
      <Link to="/" className="btn-primary px-8 py-3">Go Home</Link>
    </div>
  )
}
