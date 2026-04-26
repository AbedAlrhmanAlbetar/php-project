import { useState } from 'react'
import { Search, MapPin, Tag, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../../services/providerService'

export default function SearchBar({ onSearch, initialValues = {} }) {
  const [city, setCity]           = useState(initialValues.city || '')
  const [category, setCategory]   = useState(initialValues.category || '')
  const [minRating, setMinRating] = useState(initialValues.min_rating || '')

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.list,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({ city, category, min_rating: minRating })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card border border-slate-100 p-2 flex flex-col sm:flex-row gap-2">
      {/* City */}
      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 border border-transparent focus-within:border-brand-300 focus-within:bg-brand-50/30 transition">
        <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
        <input
          type="text"
          placeholder="City or location…"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
        />
      </div>

      <div className="hidden sm:block w-px bg-slate-100" />

      {/* Category */}
      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 border border-transparent focus-within:border-brand-300 transition">
        <Tag className="w-4 h-4 text-brand-400 shrink-0" />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-transparent text-sm text-slate-700 outline-none w-full"
        >
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      <div className="hidden sm:block w-px bg-slate-100" />

      {/* Rating */}
      <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 border border-transparent focus-within:border-brand-300 transition">
        <Star className="w-4 h-4 text-brand-400 shrink-0" />
        <select
          value={minRating}
          onChange={e => setMinRating(e.target.value)}
          className="bg-transparent text-sm text-slate-700 outline-none w-full"
        >
          <option value="">Any rating</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
          <option value="2">2+ stars</option>
        </select>
      </div>

      <button type="submit" className="btn-primary shrink-0 px-6">
        <Search className="w-4 h-4" /> Search
      </button>
    </form>
  )
}
