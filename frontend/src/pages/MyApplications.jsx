import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyApplications } from '../api/applications.js'
import { FiBriefcase, FiDollarSign, FiClock, FiMessageSquare } from 'react-icons/fi'

const STATUS_COLORS = {
  pending: 'bg-amber-900/30 text-amber-400 border border-amber-800',
  accepted: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800',
  rejected: 'bg-red-900/30 text-red-400 border border-red-800',
}

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
      <div className="space-y-4 animate-fade-in text-zinc-200">
        <h1 className="text-2xl font-bold text-white mb-6">My Applications</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 h-32 skeleton" />
        ))}
      </div>
    )
  }

  console.log('MY_APPLICATIONS: Rendering with apps length:', applications.length);
  return (
    <div className="animate-fade-in text-zinc-200">
      <h1 className="text-2xl font-bold text-white mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-14 text-center shadow-sm">
          <div className="w-14 h-14 bg-rose-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-900/30">
            <FiBriefcase className="w-7 h-7 text-rose-500" />
          </div>
          <h3 className="font-semibold text-white mb-1">No applications yet</h3>
          <p className="text-zinc-500 text-sm mb-6">Start browsing jobs and apply to find your next project.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-rose-600/25 transition-all hover:scale-[1.02]"
          >
            Browse All Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4 stagger">
          {applications.map((app) => (
            <div key={app._id} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm hover:shadow-md hover:border-zinc-700 transition-all group animate-slide-up">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Link to={`/jobs/${app.jobId?._id}`} className="text-lg font-bold text-white group-hover:text-rose-500 transition-colors">
                      {app.jobId?.title}
                    </Link>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[app.status] || STATUS_COLORS.pending}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-3">{app.proposal}</p>
                  <div className="flex gap-4 text-xs font-medium text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <FiDollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      Bid: <span className="text-white">${app.bidAmount}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5 text-rose-500" />
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {app.status === 'accepted' && (
                  <Link
                    to={`/chat?with=${app.jobId?.clientId?._id}`}
                    className="flex-shrink-0 bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-xl shadow-md shadow-rose-600/20 hover:scale-105 transition-all"
                    title="Open Chat with Client"
                  >
                    <FiMessageSquare className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
