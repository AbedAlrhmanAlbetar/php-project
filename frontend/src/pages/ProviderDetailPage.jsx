import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { providerService } from '../services/providerService'
import { ReviewCard, ReviewForm } from '../components/provider/ReviewCard'
import { StarRating, Badge, Spinner } from '../components/ui'
import { MapPin, Clock, DollarSign, Briefcase, ArrowLeft, MessageCircle, Image as ImageIcon } from 'lucide-react'

export default function ProviderDetailPage() {
  const { id } = useParams()

  const { data: provider, isLoading, error } = useQuery({
    queryKey: ['provider', id],
    queryFn: () => providerService.get(id),
  })

  if (isLoading) return <div className="flex justify-center py-32"><Spinner /></div>

  if (error) return (
    <div className="max-w-xl mx-auto text-center py-24">
      <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Provider not found</h2>
      <Link to="/providers" className="btn-primary mt-4">← Back to Providers</Link>
    </div>
  )

  const user = provider.user || {}

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link to="/providers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-500 mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to providers
      </Link>

      {/* Profile Header Card */}
      <div className="card mb-8 overflow-hidden border-none shadow-xl shadow-slate-200/50">
        
        {/* الجزء المعدل: Header Section */}
        <div className="h-48 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 relative overflow-hidden">
          {/* طبقة زخرفية خفيفة */}
          <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          {/* عرض صورة الغلاف إذا وجدت بشكل احترافي */}
          {provider.media?.[0] ? (
            <div className="absolute inset-0">
               <img src={provider.media[0].url} alt="" className="w-full h-full object-cover mix-blend-overlay opacity-40" />
               <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 to-transparent"></div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
               <ImageIcon className="w-32 h-32 text-white" />
            </div>
          )}

          {/* تأثير ضوئي علوي */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="px-6 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12 mb-6">
            {/* Avatar مع مظهر زجاجي للحواف */}
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-2xl relative z-10">
              <div className="w-full h-full rounded-[1.25rem] bg-brand-50 overflow-hidden flex items-center justify-center border border-slate-100">
                {user.profile_photo_url
                  ? <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
                  : <span className="text-brand-600 font-bold text-3xl">{user.name?.[0]}</span>
                }
              </div>
            </div>

            <div className="flex-1 sm:pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
                {user.is_verified && (
                  <Badge className="bg-green-50 text-green-600 border-green-100 px-2 py-0.5 rounded-full text-xs font-bold">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm font-medium text-slate-500">
                {user.city && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-500" /> {user.city}</span>}
                {provider.experience_years > 0 && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {provider.experience_years} years exp.</span>}
                {provider.hourly_rate && <span className="flex items-center gap-1.5 text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-lg"><DollarSign className="w-3.5 h-3.5" />{provider.hourly_rate}/hr</span>}
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2">
                <StarRating rating={provider.average_rating} size="sm" />
                <span className="font-bold text-lg text-slate-800">{Number(provider.average_rating).toFixed(1)}</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{provider.reviews_count} reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               {/* Categories */}
              {provider.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {provider.categories.map(c => (
                    <Badge key={c.id} className="bg-white border-slate-200 text-slate-700 shadow-sm hover:border-brand-300 transition-colors">
                      {c.icon} {c.name}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Bio */}
              {provider.bio && <p className="text-slate-600 leading-relaxed text-base">{provider.bio}</p>}
            </div>
            
            {provider.service_area && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-dashed border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Availability</h4>
                <p className="text-sm text-slate-700 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                   Serving: <span className="font-semibold">{provider.service_area}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Portfolio */}
          {provider.works?.length > 0 && (
            <div className="card p-6 border-none shadow-lg">
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-brand-600" />
                </div>
                Portfolio Projects
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {provider.works.map(work => (
                  <div key={work.id} className="group">
                    <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-brand-600 transition-colors">{work.title}</h3>
                    {work.description && <p className="text-sm text-slate-500 mb-4 line-clamp-2">{work.description}</p>}
                    {work.media?.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {work.media.map(m => (
                          <div key={m.id} className="aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                            <img src={m.url} alt={work.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="card p-6 border-none shadow-lg">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                 <MessageCircle className="w-5 h-5 text-brand-600" />
              </div>
              Customer Feedback
            </h2>
            <div className="space-y-4">
               {provider.reviews?.length > 0
                ? provider.reviews.map(r => <ReviewCard key={r.id} review={r} providerId={id} />)
                : <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No reviews yet. Be the first to share your experience!</p>
                  </div>
               }
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100">
               <ReviewForm providerId={id} />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Photos Gallery */}
        <div className="space-y-6">
          {provider.media?.length > 0 && (
            <div className="card p-5 border-none shadow-lg sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-500" />
                Media Gallery
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {provider.media.map(m => (
                  <div key={m.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                    <img src={m.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}