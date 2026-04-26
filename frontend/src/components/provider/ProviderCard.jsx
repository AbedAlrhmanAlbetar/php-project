import { Link } from 'react-router-dom'
import { MapPin, Clock, Star, DollarSign } from 'lucide-react'
import { StarRating, Badge } from '../ui'

export default function ProviderCard({ provider }) {
  const user = provider.user || {}
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'

  return (
    <Link to={`/providers/${provider.id}`} className="card group block">
      {/* Banner */}
      <div className="h-28 bg-gradient-to-br from-brand-400 to-brand-600 relative">
        {provider.media?.[0] && (
          <img src={provider.media[0].url} alt="" className="w-full h-full object-cover opacity-60" />
        )}
      </div>

      <div className="px-5 pb-5">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-7 mb-3">
          <div className="w-14 h-14 rounded-xl bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center bg-brand-100">
            {user.profile_photo_url
              ? <img src={user.profile_photo_url} alt={user.name} className="w-full h-full object-cover" />
              : <span className="text-brand-600 font-bold text-lg">{initials}</span>
            }
          </div>
          {user.is_verified && (
            <span className="badge bg-emerald-50 text-emerald-700 text-xs">✓ Verified</span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-slate-900 text-lg leading-tight group-hover:text-brand-600 transition-colors">
          {user.name}
        </h3>

        {/* Categories */}
        {provider.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 mb-3">
            {provider.categories.slice(0, 3).map(c => (
              <Badge key={c.id} color="brand">{c.icon} {c.name}</Badge>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
          {user.city && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400" /> {user.city}
            </span>
          )}
          {provider.experience_years > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {provider.experience_years}y exp
            </span>
          )}
        </div>

        {/* Rating + Rate */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <StarRating rating={provider.average_rating} size="sm" />
            <span className="text-sm font-medium text-slate-700">{Number(provider.average_rating).toFixed(1)}</span>
            <span className="text-xs text-slate-400">({provider.reviews_count})</span>
          </div>
          {provider.hourly_rate && (
            <span className="text-sm font-semibold text-brand-600 flex items-center gap-0.5">
              <DollarSign className="w-3.5 h-3.5" />{provider.hourly_rate}<span className="font-normal text-slate-400">/hr</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
