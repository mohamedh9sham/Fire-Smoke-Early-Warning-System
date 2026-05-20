import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Flame, Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/detect', label: 'Live Detection' },
  { to: '/monitoring', label: 'Monitoring' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
            <div className="relative p-2 rounded-lg bg-red-500/15 group-hover:bg-red-500/25 transition-all duration-300">
              <Flame className="w-5 h-5 text-red-500" />
              <div className="absolute inset-0 rounded-lg bg-red-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              FireGuard <span className="text-red-500">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-white bg-white/8'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-500" />
                  )}
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0A0A0A]/95 backdrop-blur-xl animate-slide-in">
          <div className="px-4 py-3 space-y-1">
            {links.map(link => {
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'text-white bg-white/8 border border-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5 px-4 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400">Live AI Detection — YOLOv8</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
