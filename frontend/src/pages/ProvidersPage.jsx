import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { providerService } from '../services/providerService'
import ProviderCard from '../components/provider/ProviderCard'
import SearchBar from '../components/provider/SearchBar'
import { Spinner, Pagination, EmptyState } from '../components/ui'
import { Users } from 'lucide-react'

export default function ProvidersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)

  const filters = {
    city:       searchParams.get('city') || '',
    category:   searchParams.get('category') || '',
    min_rating: searchParams.get('min_rating') || '',
    sort:       searchParams.get('sort') || '',
    page,
  }

  useEffect(() => { setPage(1) }, [searchParams.toString()])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['providers', filters],
    queryFn: () => providerService.list(filters),
    keepPreviousData: true,
  })

  const providers = data?.data || []
  const meta      = data?.meta

  const handleSearch = (params) => {
    const sp = new URLSearchParams()
    if (params.city)       sp.set('city', params.city)
    if (params.category)   sp.set('category', params.category)
    if (params.min_rating) sp.set('min_rating', params.min_rating)
    setSearchParams(sp)
  }

  const sortOptions = [
    { value: '',         label: 'Top Rated' },
    { value: 'rate_asc', label: 'Price: Low to High' },
    { value: 'rate_desc',label: 'Price: High to Low' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Bar */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-900 mb-2">Find a Professional</h1>
        <p className="text-slate-500 mb-6">Browse verified service providers in your area</p>
        <SearchBar onSearch={handleSearch} initialValues={filters} />
      </div>

      {/* Sort + count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">
          {meta ? <><span className="font-semibold text-slate-800">{meta.total}</span> providers found</> : ''}
        </p>
        <select
          value={filters.sort}
          onChange={e => setSearchParams(prev => { prev.set('sort', e.target.value); return prev })}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
        >
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner /></div>
      ) : providers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No providers found"
          description="Try adjusting your filters or searching in a different area."
        />
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
          {providers.map(p => <ProviderCard key={p.id} provider={p} />)}
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />
    </div>
  )
}
