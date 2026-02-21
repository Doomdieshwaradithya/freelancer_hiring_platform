import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  FiGrid, FiPlusSquare, FiBriefcase, FiFileText, FiUsers,
  FiMessageSquare, FiSearch, FiDollarSign, FiZap,
  FiLogOut, FiX, FiMenu, FiChevronDown
} from 'react-icons/fi'

const clientNav = [
  { to: '/dashboard', icon: FiGrid, label: 'Overview' },
  { to: '/post-job', icon: FiPlusSquare, label: 'Post Job' },
  { to: '/dashboard', icon: FiBriefcase, label: 'My Jobs' },
  { to: '/chat', icon: FiMessageSquare, label: 'Messages' },
]

const freelancerNav = [
  { to: '/jobs', icon: FiSearch, label: 'Browse Jobs' },
  { to: '/my-applications', icon: FiFileText, label: 'My Applications' },
  { to: '/chat', icon: FiMessageSquare, label: 'Messages' },
]

function NavLink({ to, icon: Icon, label, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === to && (to !== '/dashboard' || label === 'Overview')

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
        }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </Link>
  )
}

export function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = user?.role === 'client' ? clientNav : freelancerNav

  const SidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col h-full bg-black">
      {/* Logo */}
      <div className="px-4 py-6 border-b border-zinc-900">
        <Link to="/" className="logo-container group" onClick={onLinkClick}>
          <div className="w-9 h-9 logo-icon-glow rounded-xl flex items-center justify-center animate-logo-pulse transition-transform group-hover:scale-110">
            <FiZap className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-white text-xl tracking-tighter uppercase italic">QuickSkillr</span>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {user ? (
          navItems.map((item) => (
            <NavLink key={item.label} {...item} onClick={onLinkClick} />
          ))
        ) : (
          <>
            <NavLink to="/jobs" icon={FiSearch} label="Browse Jobs" onClick={onLinkClick} />
          </>
        )}
      </nav>

      {/* Bottom: logout */}
      <div className="px-3 py-4 border-t border-zinc-800">
        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-zinc-500 hover:bg-rose-950/30 hover:text-rose-500 transition-all"
          >
            <FiLogOut className="w-4 h-4" />
            Logout
          </button>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              onClick={onLinkClick}
              className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-zinc-800 text-sm font-semibold text-zinc-400 hover:border-rose-500 hover:text-rose-500 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={onLinkClick}
              className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 bg-black border-r border-zinc-800 shadow-sm z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-black shadow-2xl animate-slide-in-left">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-all"
            >
              <FiX className="w-5 h-5" />
            </button>
            <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-zinc-800 px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:bg-zinc-800 transition-all"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            {/* Desktop breadcrumb / page title placeholder */}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-zinc-800 transition-all text-sm font-medium text-zinc-300"
                >
                  <div className="w-7 h-7 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  {user.name}
                  <FiChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-2xl shadow-xl border border-zinc-800 py-1 animate-fade-in">
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
                    </div>
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout() }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-950/30 transition-all"
                    >
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-xl hover:bg-zinc-800">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-semibold bg-rose-600 text-white px-4 py-2 rounded-xl hover:bg-rose-700 transition-all shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-6 py-6 max-w-7xl w-full mx-auto text-zinc-200">
          {children}
        </main>
      </div>
    </div>
  )
}
