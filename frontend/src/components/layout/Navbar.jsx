import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Menu, X, Wrench, ChevronDown, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import clsx from 'clsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen]       = useState(false)
  const [dropOpen, setDrop]   = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLink = 'text-slate-600 hover:text-brand-500 font-medium transition-colors text-sm'
  const activeNavLink = 'text-brand-500 font-semibold'

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-slate-900">HandyHub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={({ isActive }) => clsx(navLink, isActive && activeNavLink)}>Home</NavLink>
          <NavLink to="/providers" className={({ isActive }) => clsx(navLink, isActive && activeNavLink)}>Browse</NavLink>
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDrop(!dropOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                  {user.role === 'provider' && (
                    <Link to="/dashboard" onClick={() => setDrop(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDrop(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                      <ShieldCheck className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { setDrop(false); handleLogout() }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log in</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 rounded-lg hover:bg-slate-100" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-3">
          <NavLink to="/" end onClick={() => setOpen(false)} className={({ isActive }) => clsx(navLink, isActive && activeNavLink)}>Home</NavLink>
          <NavLink to="/providers" onClick={() => setOpen(false)} className={({ isActive }) => clsx(navLink, isActive && activeNavLink)}>Browse Providers</NavLink>
          {user ? (
            <>
              {user.role === 'provider' && <Link to="/dashboard" onClick={() => setOpen(false)} className={navLink}>Dashboard</Link>}
              {user.role === 'admin'    && <Link to="/admin"     onClick={() => setOpen(false)} className={navLink}>Admin</Link>}
              <button onClick={() => { setOpen(false); handleLogout() }} className="text-left text-sm text-red-600 font-medium">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login"    onClick={() => setOpen(false)} className="btn-secondary text-sm py-2 px-4 flex-1 justify-center">Log in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-4 flex-1 justify-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
