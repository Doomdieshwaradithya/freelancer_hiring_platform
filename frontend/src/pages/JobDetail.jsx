import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getJobById } from '../api/jobs.js'
import { useAuth } from '../context/AuthContext.jsx'
import { ApplyModal } from '../components/ApplyModal.jsx'

export function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showApply, setShowApply] = useState(false)

  useEffect(() => {
    if (!id) return
    getJobById(id)
      .then(({ data }) => setJob(data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-600">Loading...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 mb-4">Job not found.</p>
        <Link to="/jobs" className="text-violet-600 hover:underline font-medium">Back to jobs</Link>
      </div>
    )
  }

  const client = typeof job.clientId === 'object' ? job.clientId : null
  const isFreelancer = user?.role === 'freelancer'
  const isOpen = job.status === 'open'

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="text-stone-600 hover:text-teal-600 mb-4 font-medium transition-colors"
      >
        ← Back
      </button>
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{job.title}</h1>
            {client && (
              <p className="text-stone-500 mt-1">Posted by {client.name}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.status === 'open'
                ? 'bg-emerald-100 text-emerald-700'
                : job.status === 'in-progress'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            {job.status}
          </span>
        </div>

        <p className="mt-4 text-stone-600 whitespace-pre-wrap">{job.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-xl font-semibold">
            Budget: ${job.budget}
          </span>
          {job.skillsRequired.map((s) => (
            <span key={s} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-xl">
              {s}
            </span>
          ))}
        </div>

        {job.duration && (
          <p className="mt-2 text-stone-500">Duration: {job.duration}</p>
        )}

        {isFreelancer && isOpen && (
          <div className="mt-6">
            {user ? (
              <button
                onClick={() => setShowApply(true)}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all"
              >
                Apply Now
              </button>
            ) : (
              <Link
                to="/login"
                state={{ from: { pathname: `/jobs/${id}` } }}
                className="inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all"
              >
                Login to Apply
              </Link>
            )}
          </div>
        )}
      </div>

      {showApply && id && (
        <ApplyModal jobId={id} onClose={() => setShowApply(false)} onSuccess={() => setShowApply(false)} />
      )}
    </div>
  )
}
