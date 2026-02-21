import { Link } from 'react-router-dom'
import {
  FiBriefcase, FiZap, FiCheckCircle, FiUsers,
  FiSearch, FiArrowRight, FiShield, FiStar, FiClock
} from 'react-icons/fi'

export function Landing() {
  return (
    <div className="animate-fade-in text-zinc-200">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Blur blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-rose-900/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-zinc-900/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-950/30 border border-rose-900/50 text-rose-400 text-sm font-medium px-4 py-2 rounded-full mb-8 animate-slide-up">
            <FiZap className="w-3.5 h-3.5" />
            The modern red-fueled marketplace
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            Hire Top Talent.<br />
            <span className="gradient-text">QuickSkillr.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-zinc-400 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Connect with world-class freelancers or find your next great project. Simple,
            fast, and built for modern teams that demand speed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <Link
              to="/register"
              className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-rose-600/30 hover:scale-105 transition-all flex items-center gap-2"
            >
              Hire Talent <FiArrowRight />
            </Link>
            <Link
              to="/jobs"
              className="bg-white/5 hover:bg-white/10 text-white border border-zinc-800 px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-md transition-all"
            >
              Find Work
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { label: 'Freelancers', value: '10K+' },
              { label: 'Clients', value: '2K+' },
              { label: 'Jobs Posted', value: '15K+' },
              { label: 'Satisfaction', value: '98%' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-zinc-950/50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Everything you need to manage complex projects and payments in one sleek dashboard.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 stagger">
            <div className="glass p-8 rounded-3xl group hover:border-rose-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-rose-600/20 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Escrow Protection</h3>
              <p className="text-zinc-500 leading-relaxed">Funds are held securely and only released when you&apos;re 100% satisfied with the work.</p>
            </div>

            <div className="glass p-8 rounded-3xl group hover:border-rose-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-rose-600/20 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <FiZap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Chat</h3>
              <p className="text-zinc-500 leading-relaxed">Collaborate instantly with integrated messaging, file sharing, and project tracking.</p>
            </div>

            <div className="glass p-8 rounded-3xl group hover:border-rose-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-rose-600/20 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:bg-rose-600 group-hover:text-white transition-all">
                <FiStar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Vetted Talent</h3>
              <p className="text-zinc-500 leading-relaxed">Browse top-rated professionals verified for their skills, communication, and reliability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Simple Workflow</h2>
              <div className="space-y-8">
                {[
                  { title: 'Post a Job', desc: 'Tell us what you need. It&apos;s free and takes 2 minutes.', icon: FiBriefcase },
                  { title: 'Get Proposals', desc: 'Review talented freelancers and their previous work.', icon: FiUsers },
                  { title: 'Hire & Pay', desc: 'Start working together with secure escrow payments.', icon: FiCheckCircle },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-500 font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{step.title}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-zinc-900 rounded-[40px] p-8 border border-zinc-800 shadow-2xl relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/20">
                <FiClock className="text-white" />
              </div>
              <div className="space-y-4">
                <div className="w-1/3 h-4 bg-zinc-800 rounded-full" />
                <div className="w-full h-32 bg-zinc-800/50 rounded-2xl animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-3 bg-zinc-800 rounded-full" />
                  <div className="w-4/5 h-3 bg-zinc-800 rounded-full" />
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-rose-600/20 rounded-full" />
                  <div className="w-16 h-6 bg-zinc-800 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-rose-600 to-rose-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-30 pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10">
              Ready to take your project<br />to the next level?
            </h2>
            <p className="text-rose-100 mb-10 text-lg relative z-10 opacity-90">Join QuickSkillr today and build something amazing.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link to="/register" className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Link to="/" className="logo-container group">
                  <div className="w-9 h-9 logo-icon-glow rounded-xl flex items-center justify-center animate-logo-pulse transition-transform group-hover:scale-110">
                    <FiZap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-white text-xl tracking-tighter uppercase italic">QuickSkillr</span>
                </Link>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                The most advanced skill marketplace for high-performance teams and freelancers.
              </p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Platform</h5>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><Link to="/jobs" className="hover:text-rose-500 transition-colors">Browse Jobs</Link></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Resources</h5>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-rose-500 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-rose-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-rose-500 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-900 flex flex-col md:row items-center justify-between gap-4 text-xs text-zinc-600">
            <p>© 2026 QuickSkillr. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-rose-500 transition-colors">Twitter</a>
              <a href="#" className="hover:text-rose-500 transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-rose-500 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
