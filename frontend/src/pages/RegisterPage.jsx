import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Wrench } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState({
    name: '', email: '', password: '', password_confirmation: '',
    phone: '', city: '', role: searchParams.get('role') || 'customer',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const u = await register(form)
      toast.success(`Account created! Welcome, ${u.name}!`)
      if (u.role === 'provider') navigate('/dashboard')
      else navigate('/')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else toast.error(data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-sm font-medium text-slate-700 block mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => set(key, e.target.value)}
        className={`input ${errors[key] ? 'border-red-400' : ''}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key][0]}</p>}
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md">

        {/* 🔥 NEW HEADER */}
        <div className="h-40 bg-gradient-to-br from-brand-400 to-brand-700 relative rounded-t-2xl overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative z-10 text-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold">Create Account</h1>
            <p className="text-white/80 text-sm mt-1">Join HandyHub today</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-4 rounded-t-none">

          {/* Role toggle */}
          <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            {['customer', 'provider'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => set('role', role)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  form.role === role
                    ? 'bg-white shadow-sm text-brand-600'
                    : 'text-slate-500'
                }`}
              >
                {role === 'customer' ? '👤 Customer' : '🔧 Provider'}
              </button>
            ))}
          </div>

          {field('name',  'Full Name',  'text',     'John Smith')}
          {field('email', 'Email',      'email',    'you@example.com')}
          {field('phone', 'Phone',      'tel',      '+1 555 000 0000')}
          {field('city',  'City',       'text',     'New York')}
          {field('password', 'Password', 'password', '••••••••')}
          {field('password_confirmation', 'Confirm Password', 'password', '••••••••')}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-3 mt-2"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}