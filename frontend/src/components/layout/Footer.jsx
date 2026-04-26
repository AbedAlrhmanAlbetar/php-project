import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">HandyHub</span>
            </div>
            <p className="text-sm leading-relaxed">
              Connecting you with trusted local service professionals. Quality work, guaranteed.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/providers" className="hover:text-brand-400 transition-colors">Browse Providers</Link></li>
              <li><Link to="/register?role=provider" className="hover:text-brand-400 transition-colors">Become a Provider</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Sign Up Free</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Categories</h3>
            <ul className="space-y-2 text-sm">
              {['Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning'].map(c => (
                <li key={c}>
                  <Link to={`/providers?category=${c.toLowerCase()}`} className="hover:text-brand-400 transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-center text-sm">
          © {new Date().getFullYear()} HandyHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
