import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="text-center py-16 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4 bg-gradient-to-r from-stone-800 via-teal-800 to-violet-800 bg-clip-text text-transparent">
        Connect Talent with Opportunity
      </h1>
      <p className="text-lg text-stone-600 mb-10 max-w-2xl mx-auto">
        Post projects as a client or find work as a freelancer. Simple, professional, and built for students.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          to="/register"
          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 shadow-xl shadow-teal-500/30 transition-all hover:shadow-2xl hover:shadow-teal-500/40 active:scale-[0.98]"
        >
          Get Started
        </Link>
        <Link
          to="/jobs"
          className="border-2 border-teal-500 text-teal-700 px-8 py-4 rounded-xl font-semibold bg-teal-50 hover:bg-teal-100 transition-all active:scale-[0.98]"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  )
}
