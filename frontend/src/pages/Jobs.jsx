import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getJobs } from '../api/jobs.js'

export function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
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

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-600">Loading jobs...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Browse Jobs</h1>
        <input
          type="search"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 border border-stone-200 rounded-xl w-64 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
        />
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-600 shadow-sm">
          No open jobs found. Try a different search or check back later.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const client = typeof job.clientId === 'object' ? job.clientId : null
            return (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="block bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-lg hover:border-teal-200 transition-all duration-200 hover:-translate-y-0.5"
              >
                <h3 className="font-semibold text-stone-800">{job.title}</h3>
                <p className="text-stone-600 text-sm mt-1 line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-lg text-sm font-medium">
                    ${job.budget}
                  </span>
                  {job.skillsRequired.map((s) => (
                    <span key={s} className="bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-lg text-sm">
                      {s}
                    </span>
                  ))}
                </div>
                {client && (
                  <p className="text-stone-500 text-sm mt-2">Posted by {client.name}</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
