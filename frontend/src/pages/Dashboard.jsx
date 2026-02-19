import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyJobs } from '../api/jobs.js'
import { getJobApplications, acceptApplication, rejectApplication } from '../api/applications.js'
import { completeJob, deleteJob } from '../api/jobs.js'
import toast from 'react-hot-toast'

function getErrorMessage(err, fallback) {
  if (err?.response?.data?.message) return err.response.data.message
  return fallback
}

export function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedJob, setExpandedJob] = useState(null)
  const [applications, setApplications] = useState({})

  const fetchJobs = async () => {
    try {
      const { data } = await getMyJobs()
      setJobs(data)
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const loadApplications = async (jobId) => {
    if (applications[jobId]) {
      setExpandedJob(expandedJob === jobId ? null : jobId)
      return
    }
    try {
      const { data } = await getJobApplications(jobId)
      setApplications((prev) => ({ ...prev, [jobId]: data }))
      setExpandedJob(jobId)
    } catch {
      toast.error('Failed to load applications')
    }
  }

  const handleAccept = async (appId) => {
    try {
      await acceptApplication(appId)
      toast.success('Freelancer hired!')
      setExpandedJob(null)
      setApplications({})
      fetchJobs()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed'))
    }
  }

  const handleReject = async (appId) => {
    try {
      await rejectApplication(appId)
      toast.success('Application rejected')
      const jobId = Object.keys(applications).find((k) =>
        applications[k].some((a) => a._id === appId)
      )
      if (jobId) {
        setApplications((prev) => ({
          ...prev,
          [jobId]: prev[jobId].filter((a) => a._id !== appId)
        }))
      }
    } catch {
      toast.error('Failed to reject')
    }
  }

  const handleComplete = async (jobId) => {
    try {
      await completeJob(jobId)
      toast.success('Job marked complete')
      fetchJobs()
    } catch {
      toast.error('Failed to complete')
    }
  }

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job?')) return
    try {
      await deleteJob(jobId)
      toast.success('Job deleted')
      fetchJobs()
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-stone-600">Loading your jobs...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-800">My Jobs</h1>
        <Link
          to="/post-job"
          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all"
        >
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-600 shadow-sm">
          <p>You haven&apos;t posted any jobs yet.</p>
          <Link to="/post-job" className="text-violet-600 font-semibold hover:underline mt-2 inline-block">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const apps = applications[job._id] ?? []
            const isExpanded = expandedJob === job._id
            const freelancer = typeof job.hiredFreelancer === 'object' ? job.hiredFreelancer : null

            return (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5 flex justify-between items-start">
                  <div>
                    <Link to={`/jobs/${job._id}`} className="font-semibold text-stone-800 hover:text-teal-600 transition-colors">
                      {job.title}
                    </Link>
                    <p className="text-stone-500 text-sm mt-1">
                      <span className="text-amber-600 font-medium">${job.budget}</span> · {job.status}
                    </p>
                    {freelancer && (
                      <p className="text-stone-600 text-sm mt-1">Hired: {freelancer.name}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {job.status === 'open' && (
                      <button
                        onClick={() => loadApplications(job._id)}
                        className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                      >
                        {isExpanded ? 'Hide' : 'View'} applications
                      </button>
                    )}
                    {job.status === 'in-progress' && (
                      <button
                        onClick={() => handleComplete(job._id)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                      >
                        Mark complete
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-rose-600 hover:text-rose-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && apps.length > 0 && (
                  <div className="border-t border-stone-200 bg-amber-50/50 p-5 space-y-3">
                    <h4 className="font-medium text-stone-700">Applications</h4>
                    {apps.map((app) => (
                      <div key={app._id} className="bg-white rounded-xl p-4 border border-stone-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-stone-800">{app.freelancerId.name}</p>
                            <p className="text-stone-600 text-sm mt-1">{app.proposal}</p>
                            {app.bidAmount ? (
                              <p className="text-amber-700 font-semibold mt-1">Bid: ${app.bidAmount}</p>
                            ) : null}
                          </div>
                          {app.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAccept(app._id)}
                                className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleReject(app._id)}
                                className="border border-stone-300 text-stone-600 px-3 py-1.5 rounded-lg text-sm hover:bg-stone-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {app.status !== 'pending' && (
                            <span
                              className={`px-2 py-0.5 rounded-lg text-sm font-medium ${
                                app.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isExpanded && apps.length === 0 && (
                  <div className="border-t border-stone-200 bg-stone-50 p-5 text-stone-600 text-sm">
                    No applications yet.
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
