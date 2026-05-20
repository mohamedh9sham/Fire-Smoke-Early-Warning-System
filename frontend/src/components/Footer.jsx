import { Flame, Github, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.06] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 rounded-lg bg-red-500/15">
                <Flame className="w-4 h-4 text-red-500" />
              </div>
              <span className="font-bold text-white">FireGuard <span className="text-red-500">AI</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              An AI-powered fire and smoke early warning system concept, built as part of the WEX 428 internship project.
            </p>
            <div className="flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs text-orange-400 font-medium">AI Training Phase</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/detect', label: 'Concept Preview' },
                { to: '/monitoring', label: 'Live Monitoring Demo' },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-red-500 transition-all duration-200" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Project Info</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-start gap-2">
                <span className="text-gray-600 shrink-0">Team</span>
                <span className="text-gray-400">Group 13</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 shrink-0">University</span>
                <span className="text-gray-400">OSTIM Technical University</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 shrink-0">Department</span>
                <span className="text-gray-400">Software Engineering</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 shrink-0">Course</span>
                <span className="text-gray-400">WEX 428 (WorkPlace)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-600 shrink-0">Submission</span>
                <span className="text-gray-400">June 5, 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © 2025/2026 FireGuard AI — WEX 428 (WorkPlace) — OSTIM Technical University — Group 13
          </p>
          <p className="text-gray-700 text-xs">
            Project Status: Development Preview — AI Training Phase
          </p>
        </div>
      </div>
    </footer>
  )
}
