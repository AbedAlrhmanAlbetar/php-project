import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { providerService, workService, categoryService } from '../services/providerService'
import { useAuth } from '../context/AuthContext'
import { StarRating, Spinner, Modal, EmptyState } from '../components/ui'
import toast from 'react-hot-toast'
import { Plus, Edit3, Trash2, Briefcase, User, Star, ImagePlus } from 'lucide-react'

/* ── Work Form Modal ──────────────────────────────────────── */
function WorkModal({ work, onClose }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ title: work?.title || '', description: work?.description || '' })
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      images.forEach(img => fd.append('images[]', img))
      return work ? workService.update(work.id, fd) : workService.create(fd)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-profile'])
      toast.success(work ? 'Work updated!' : 'Work added!')
      onClose()
    },
    onError: (err) => {
      if (err.response?.data?.errors) setErrors(err.response.data.errors)
    },
  })

  return (
    <Modal open onClose={onClose} title={work ? 'Edit Work' : 'Add Portfolio Work'}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Title *</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className={`input ${errors.title ? 'border-red-400' : ''}`} placeholder="Kitchen renovation" />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title[0]}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
          <textarea rows={3} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="input resize-none w-full" placeholder="Describe the work…" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Images</label>
          <input type="file" accept="image/*" multiple
            onChange={e => setImages(Array.from(e.target.files))}
            className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-600 file:font-medium hover:file:bg-brand-100" />
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="btn-primary flex-1 justify-center">
            {mutation.isPending ? 'Saving…' : 'Save Work'}
          </button>
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Profile Form ─────────────────────────────────────────── */
function ProfileForm({ provider }) {
  const queryClient = useQueryClient()
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.list })

  const [form, setForm] = useState({
    name:             provider?.user?.name || '',
    phone:            provider?.user?.phone || '',
    city:             provider?.user?.city || '',
    bio:              provider?.bio || '',
    experience_years: provider?.experience_years || 0,
    hourly_rate:      provider?.hourly_rate || '',
    service_area:     provider?.service_area || '',
    category_ids:     provider?.categories?.map(c => c.id) || [],
  })
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'category_ids') v.forEach(id => fd.append('category_ids[]', id))
        else fd.append(k, v)
      })
      if (photo) fd.append('profile_photo', photo)
      return providerService.update(fd)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-profile'])
      toast.success('Profile updated!')
    },
    onError: (err) => {
      if (err.response?.data?.errors) setErrors(err.response.data.errors)
    },
  })

  const toggleCategory = (id) => {
    setForm(f => ({
      ...f,
      category_ids: f.category_ids.includes(id)
        ? f.category_ids.filter(c => c !== id)
        : [...f.category_ids, id],
    }))
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="card p-6 space-y-5">
      <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
        <User className="w-5 h-5 text-brand-400" /> Edit Profile
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[['name','Full Name'], ['phone','Phone'], ['city','City'], ['service_area','Service Area']].map(([key, label]) => (
          <div key={key}>
            <label className="text-sm font-medium text-slate-700 block mb-1">{label}</label>
            <input value={form[key]} onChange={set(key)} className={`input ${errors[key] ? 'border-red-400' : ''}`} />
            {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key][0]}</p>}
          </div>
        ))}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Experience (years)</label>
          <input type="number" min="0" max="60" value={form.experience_years} onChange={set('experience_years')} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">Hourly Rate ($)</label>
          <input type="number" min="0" value={form.hourly_rate} onChange={set('hourly_rate')} className="input" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1">Bio</label>
        <textarea rows={4} value={form.bio} onChange={set('bio')} className="input resize-none w-full"
          placeholder="Tell customers about yourself…" />
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 block mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button key={c.id} type="button" onClick={() => toggleCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                form.category_ids.includes(c.id)
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'
              }`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1">Profile Photo</label>
        <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])}
          className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-600 file:font-medium" />
      </div>

      <button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="btn-primary">
        {mutation.isPending ? 'Saving…' : 'Save Profile'}
      </button>
    </div>
  )
}

/* ── Dashboard page ───────────────────────────────────────── */
export default function ProviderDashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [tab, setTab]           = useState('profile')
  const [workModal, setWorkModal] = useState(null) // null | 'new' | work obj

  const { data: provider, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: providerService.myProfile,
  })

  const deleteWork = useMutation({
    mutationFn: workService.destroy,
    onSuccess: () => { queryClient.invalidateQueries(['my-profile']); toast.success('Work deleted') },
  })

  if (isLoading) return <div className="flex justify-center py-24"><Spinner /></div>

  const tabs = [
    { id: 'profile',   label: 'Profile',   icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'reviews',   label: 'Reviews',   icon: Star },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-900">Provider Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your profile and portfolio</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Rating',   value: Number(provider?.average_rating || 0).toFixed(1), sub: `${provider?.reviews_count || 0} reviews` },
          { label: 'Works',    value: provider?.works?.length || 0,       sub: 'portfolio items' },
          { label: 'Rate',     value: provider?.hourly_rate ? `$${provider.hourly_rate}` : '—', sub: 'per hour' },
        ].map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-2xl font-display font-bold text-brand-500">{s.value}</div>
            <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-white shadow-sm text-brand-600' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'profile' && <ProfileForm provider={provider} />}

      {tab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-bold text-slate-900">Portfolio Works</h2>
            <button onClick={() => setWorkModal('new')} className="btn-primary text-sm py-2">
              <Plus className="w-4 h-4" /> Add Work
            </button>
          </div>

          {provider?.works?.length === 0
            ? <EmptyState icon={Briefcase} title="No works yet" description="Add your first portfolio item to showcase your skills." />
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provider.works.map(work => (
                  <div key={work.id} className="card p-4">
                    {work.media?.[0] && (
                      <img src={work.media[0].url} alt={work.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                    )}
                    <h3 className="font-semibold text-slate-800">{work.title}</h3>
                    {work.description && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{work.description}</p>}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => setWorkModal(work)} className="btn-secondary text-xs py-1.5 px-3">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => deleteWork.mutate(work.id)} className="btn-danger text-xs py-1.5 px-3">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {tab === 'reviews' && (
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-brand-400" /> Customer Reviews
          </h2>
          {provider?.reviews?.length === 0 ? (
            <EmptyState icon={Star} title="No reviews yet" description="Reviews from customers will appear here." />
          ) : (
            provider.reviews.map(r => (
              <div key={r.id} className="flex gap-3 py-4 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm shrink-0">
                  {r.reviewer?.name?.[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">{r.reviewer?.name}</span>
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                  {r.comment && <p className="text-sm text-slate-500 mt-1">{r.comment}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Work modal */}
      {workModal && (
        <WorkModal
          work={workModal === 'new' ? null : workModal}
          onClose={() => setWorkModal(null)}
        />
      )}
    </div>
  )
}
