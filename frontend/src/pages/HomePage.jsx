import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { categoryService, providerService } from '../services/providerService'
import SearchBar from '../components/provider/SearchBar'
import ProviderCard from '../components/provider/ProviderCard'
import { Spinner } from '../components/ui'
import { ArrowRight, Shield, Star, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: Shield,  title: 'Verified Pros',   desc: 'Every provider is vetted and verified before joining our platform.' },
  { icon: Star,    title: 'Rated & Reviewed', desc: 'Real reviews from real customers to help you choose confidently.' },
  { icon: Zap,     title: 'Fast Matching',    desc: 'Find the right professional for your job in minutes, not days.' },
]

export default function HomePage() {
  const navigate = useNavigate()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.list,
  })

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['providers', 'featured'],
    queryFn: () => providerService.list({ per_page: 6, sort: 'rating' }),
  })

  const providers = featuredData?.data || []

  const handleSearch = (params) => {
    const query = new URLSearchParams()
    if (params.city)       query.set('city', params.city)
    if (params.category)   query.set('category', params.category)
    if (params.min_rating) query.set('min_rating', params.min_rating)
    navigate(`/providers?${query.toString()}`)
  }

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #ee7420 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f19340 0%, transparent 50%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block mb-4 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold tracking-wide uppercase">
              Trusted by thousands
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Find Local <span className="text-brand-400">Professionals</span> You Can Trust
            </h1>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              From plumbing to tutoring — connect with verified, top-rated service providers in your area. Quality work, fair prices.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-slate-900">Browse by Category</h2>
          <Link to="/providers" className="text-brand-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/providers?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-brand-300 hover:shadow-md transition-all group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-semibold text-slate-600 group-hover:text-brand-600 text-center transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Providers ── */}
      <section className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-slate-900">Top-Rated Providers</h2>
            <Link to="/providers" className="text-brand-500 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {providers.map(p => <ProviderCard key={p.id} provider={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-display text-3xl font-bold text-center text-slate-900 mb-12">Why Choose HandyHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-brand-500" />
              </div>
              <h3 className="font-display font-semibold text-xl text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-500 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Are You a Service Professional?</h2>
          <p className="text-brand-100 mb-8 text-lg">Join thousands of providers and grow your business with HandyHub.</p>
          <Link to="/register?role=provider" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-600 font-bold rounded-xl hover:bg-brand-50 transition-colors shadow-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
