import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService, categoryService } from '../services/providerService'
import { Spinner, EmptyState, Modal } from '../components/ui'
import { StarRating } from '../components/ui'
import toast from 'react-hot-toast'
import {
  Users, Briefcase, Star, Tag, ShieldCheck, ShieldOff,
  Trash2, Plus, Edit3, BarChart3
} from 'lucide-react'

/* ── Category Modal ───────────────────────────────────────── */
function CategoryModal({ cat, onClose }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ name: cat?.name || '', icon: cat?.icon || '', slug: cat?.slug || '' })

  const mutation = useMutation({
    mutationFn: () => cat
      ? categoryService.update(cat.id, form)
      : categoryService.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories'])
      toast.success(cat ? 'Category updated!' : 'Category created!')
      onClose()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  })

  return (
    <Modal open onClose={onClose} title={cat ? 'Edit Category' : 'New Category'}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="input" placeholder="Plumbing" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Icon (emoji)</label>
          <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
            className="input" placeholder="🔧" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Slug (auto-generated if empty)</label>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className="input" placeholder="plumbing" />
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="btn-primary flex-1 justify-center">
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Admin Dashboard ──────────────────────────────────────── */
export default function AdminDashboard() {
  const queryClient = useQueryClient()
  const [tab, setTab]         = useState('stats')
  const [catModal, setCatModal] = useState(null)
  const [userSearch, setUserSearch] = useState('')
  const [userRole, setUserRole]     = useState('')

  /* queries */
  const { data: stats }     = useQuery({ queryKey: ['admin-stats'],      queryFn: adminService.stats })
  const { data: usersData, isLoading: usersLoading }  = useQuery({
    queryKey: ['admin-users', userSearch, userRole],
    queryFn:  () => adminService.users({ search: userSearch, role: userRole }),
    enabled:  tab === 'users',
  })
  const { data: providersData } = useQuery({
    queryKey: ['admin-providers'],
    queryFn:  adminService.providers,
    enabled:  tab === 'providers',
  })
  const { data: reviewsData } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn:  adminService.reviews,
    enabled:  tab === 'reviews',
  })
  const { data: catsData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn:  categoryService.list,
    enabled:  tab === 'categories',
  })

  /* mutations */
  const verifyUser   = useMutation({ mutationFn: adminService.verifyUser,   onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('Updated!') } })
  const deleteUser   = useMutation({ mutationFn: adminService.deleteUser,   onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('User deleted') } })
  const deleteReview = useMutation({ mutationFn: adminService.deleteReview, onSuccess: () => { queryClient.invalidateQueries(['admin-reviews']); toast.success('Review deleted') } })
  const deleteCat    = useMutation({ mutationFn: categoryService.destroy,   onSuccess: () => { queryClient.invalidateQueries(['admin-categories']); toast.success('Category deleted') } })

  const tabs = [
    { id: 'stats',      label: 'Overview',   icon: BarChart3 },
    { id: 'users',      label: 'Users',      icon: Users },
    { id: 'providers',  label: 'Providers',  icon: Briefcase },
    { id: 'reviews',    label: 'Reviews',    icon: Star },
    { id: 'categories', label: 'Categories', icon: Tag },
  ]

  const statCards = stats ? [
    { label: 'Total Users',     value: stats.total_users,     color: 'text-blue-600',  bg: 'bg-blue-50' },
    { label: 'Total Providers', value: stats.total_providers, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Total Reviews',   value: stats.total_reviews,   color: 'text-purple-600',bg: 'bg-purple-50' },
    { label: 'Verified Users',  value: stats.verified_users,  color: 'text-emerald-600',bg: 'bg-emerald-50' },
  ] : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your platform</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {tab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map(s => (
              <div key={s.label} className={`card p-6 ${s.bg}`}>
                <div className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</div>
                <div className="text-sm text-slate-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          {stats?.users_by_role && (
            <div className="card p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Users by Role</h3>
              <div className="space-y-3">
                {Object.entries(stats.users_by_role).map(([role, count]) => (
                  <div key={role} className="flex items-center gap-3">
                    <span className="w-24 text-sm capitalize text-slate-600">{role}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3">
                      <div
                        className="bg-brand-500 h-3 rounded-full"
                        style={{ width: `${Math.round((count / stats.total_users) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
              placeholder="Search by name or email…" className="input max-w-xs" />
            <select value={userRole} onChange={e => setUserRole(e.target.value)} className="input w-40">
              <option value="">All roles</option>
              <option value="admin">Admin</option>
              <option value="provider">Provider</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          {usersLoading ? <Spinner /> : (
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Name', 'Email', 'Role', 'City', 'Verified', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersData?.data?.map(u => (
                    <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : u.role === 'provider' ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.city || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${u.is_verified ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {u.is_verified ? '✓ Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => verifyUser.mutate(u.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-emerald-500 transition-colors" title="Toggle verify">
                            {u.is_verified ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { if (confirm('Delete user?')) deleteUser.mutate(u.id) }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Providers */}
      {tab === 'providers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providersData?.data?.map(p => (
            <div key={p.id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                  {p.user?.name?.[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{p.user?.name}</h3>
                  <p className="text-xs text-slate-500">{p.user?.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={p.average_rating} size="sm" />
                <span className="text-sm text-slate-600">{Number(p.average_rating).toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.categories?.slice(0, 3).map(c => (
                  <span key={c.id} className="badge bg-brand-50 text-brand-700 text-xs">{c.icon} {c.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {tab === 'reviews' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                {['Reviewer', 'Provider', 'Rating', 'Comment', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviewsData?.data?.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{r.reviewer?.name}</td>
                  <td className="px-4 py-3 text-slate-500">{r.provider?.user?.name}</td>
                  <td className="px-4 py-3"><StarRating rating={r.rating} size="sm" /></td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{r.comment || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { if (confirm('Delete review?')) deleteReview.mutate(r.id) }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Categories */}
      {tab === 'categories' && (
        <div className="space-y-4">
          <button onClick={() => setCatModal('new')} className="btn-primary">
            <Plus className="w-4 h-4" /> New Category
          </button>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {catsData?.map(c => (
              <div key={c.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.providers_count} providers</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setCatModal(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-500 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (confirm('Delete category?')) deleteCat.mutate(c.id) }}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {catModal && <CategoryModal cat={catModal === 'new' ? null : catModal} onClose={() => setCatModal(null)} />}
    </div>
  )
}
