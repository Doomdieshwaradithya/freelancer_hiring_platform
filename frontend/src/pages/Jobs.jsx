import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../api/jobs.js'
import { FiSearch, FiFilter, FiDollarSign, FiClock, FiUser, FiArrowRight } from 'react-icons/fi'

const STATUS_COLORS = {
  open: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800',
  'in-progress': 'bg-blue-900/30 text-blue-400 border border-blue-800',
  completed: 'bg-zinc-800 text-zinc-500 border border-zinc-700',
}

function SkeletonCard() {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
      <div className="flex gap-2 mt-3">
        <div className="skeleton h-6 w-16 rounded-lg" />
        <div className="skeleton h-6 w-20 rounded-lg" />
        <div className="skeleton h-6 w-14 rounded-lg" />
      </div>
    </div>
  )
}

export function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [inputVal, setInputVal] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const { data } = await getJobs({ status: 'open', search: search || undefined })
        setJobs(data)
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [search])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(inputVal)
  }

  return (
    <div className="animate-fade-in text-zinc-200">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Browse Jobs</h1>
        <p className="text-zinc-500 text-sm mt-1">Find your next great project from our open listings.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-7">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input
            type="search"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search by title, skill, or keyword..."
            className="w-full pl-10 pr-4 py-3 border border-zinc-800 rounded-xl bg-zinc-900 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-rose-600/25 hover:scale-[1.02] transition-all text-sm"
        >
          <FiSearch className="w-4 h-4" /> Search
        </button>
      </form>

      {/* Results info */}
      {!loading && (
        <p className="text-sm text-zinc-500 mb-4">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found{search ? ` for "${search}"` : ''}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-14 text-center shadow-sm">
          <div className="w-14 h-14 bg-rose-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-900/30">
            <FiSearch className="w-7 h-7 text-rose-500" />
          </div>
          <h3 className="font-semibold text-white mb-1">No jobs found</h3>
          <p className="text-zinc-500 text-sm">Try a different search or check back later.</p>
          {search && (
            <button
              onClick={() => { setSearch(''); setInputVal('') }}
              className="mt-4 text-sm text-rose-500 font-semibold hover:text-rose-400 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {jobs.map((job) => {
            const client = typeof job.clientId === 'object' ? job.clientId : null
            return (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="block bg-zinc-900 rounded-2xl border border-zinc-800 p-5 hover:shadow-lg hover:border-rose-900/50 hover:-translate-y-0.5 transition-all duration-200 group animate-slide-up"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-rose-500 transition-colors">{job.title}</h3>
                    <p className="text-zinc-500 text-sm mt-1 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 bg-emerald-950/30 text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-900/30">
                        <FiDollarSign className="w-3 h-3" /> {job.budget}
                      </span>
                      {job.duration && (
                        <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-700">
                          <FiClock className="w-3 h-3" /> {job.duration}
                        </span>
                      )}
                      {job.skillsRequired.slice(0, 3).map((s) => (
                        <span key={s} className="bg-rose-950/30 text-rose-400 px-2.5 py-1 rounded-lg text-xs font-medium border border-rose-900/30">
                          {s}
                        </span>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <span className="text-zinc-500 text-xs py-1">+{job.skillsRequired.length - 3} more</span>
                      )}
                    </div>

                    {client && (
                      <p className="text-zinc-600 text-xs mt-2 flex items-center gap-1">
                        <FiUser className="w-3 h-3" /> {client.name}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[job.status] ?? STATUS_COLORS.open}`}>
                      {job.status}
                    </span>
                    <FiArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
