import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyApplications } from '../api/applications.js'

export function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-600">Loading applications...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-600 shadow-sm">
          <p>You haven&apos;t applied to any jobs yet.</p>
          <Link to="/jobs" className="text-violet-600 font-semibold hover:underline mt-2 inline-block">
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = typeof app.jobId === 'object' ? app.jobId : null
            const client = job && typeof job.clientId === 'object' ? job.clientId : null
            const jobId = typeof app.jobId === 'object' ? app.jobId._id : app.jobId

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md hover:border-teal-100 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/jobs/${jobId}`}
                      className="font-semibold text-stone-800 hover:text-teal-600 transition-colors"
                    >
                      {job?.title ?? 'Job'}
                    </Link>
                    {client && (
                      <p className="text-stone-500 text-sm">Client: {client.name}</p>
                    )}
                    <p className="text-stone-600 text-sm mt-2 line-clamp-2">{app.proposal}</p>
                    {app.bidAmount ? (
                      <p className="text-amber-700 font-semibold mt-1">Your bid: ${app.bidAmount}</p>
                    ) : null}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
