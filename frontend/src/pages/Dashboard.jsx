import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyJobs } from '../api/jobs.js'
import { getJobApplications, acceptApplication, rejectApplication } from '../api/applications.js'
import { completeJob, deleteJob } from '../api/jobs.js'
import toast from 'react-hot-toast'
import {
  FiBriefcase, FiPlusSquare, FiCheckCircle, FiClock,
  FiUsers, FiMessageSquare, FiTrash2, FiChevronDown, FiChevronUp
} from 'react-icons/fi'

function getErrorMessage(err, fallback) {
  if (err?.response?.data?.message) return err.response.data.message
  return fallback
}

const STATUS_CONFIG = {
  open: { cls: 'bg-blue-900/30 text-blue-400 border border-blue-800', label: 'Open' },
  'in-progress': { cls: 'bg-amber-900/30 text-amber-400 border border-amber-800', label: 'In Progress' },
  completed: { cls: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800', label: 'Completed' },
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-zinc-500 text-sm">{label}</p>
      </div>
    </div>
  )
}

export function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedJob, setExpandedJob] = useState(null)
  const [applications, setApplications] = useState({})
  const navigate = useNavigate()

  const fetchJobs = async () => {
    try {
      console.log('DASHBOARD: Calling getMyJobs...');
      const { data } = await getMyJobs()
      console.log('DASHBOARD: Received jobs:', data);
      setJobs(data)
    } catch (err) {
      console.error('DASHBOARD ERROR fetching jobs:', err);
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const loadApplications = async (jobId) => {
    if (expandedJob === jobId) { setExpandedJob(null); return }
    if (applications[jobId]) { setExpandedJob(jobId); return }
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
      toast.success('Freelancer hired! 🎉')
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
      const jobId = Object.keys(applications).find((k) => applications[k].some((a) => a._id === appId))
      if (jobId) setApplications((prev) => ({ ...prev, [jobId]: prev[jobId].filter((a) => a._id !== appId) }))
    } catch {
      toast.error('Failed to reject')
    }
  }

  const handleComplete = async (jobId) => {
    try {
      await completeJob(jobId)
      toast.success('Job marked as complete ✓')
      fetchJobs()
    } catch {
      toast.error('Failed')
    }
  }

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job? This cannot be undone.')) return
    try {
      await deleteJob(jobId)
      toast.success('Job deleted')
      fetchJobs()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.status === 'open').length,
    inProgress: jobs.filter((j) => j.status === 'in-progress').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 h-24 skeleton" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 h-20 skeleton" />)}
        </div>
      </div>
    )
  }

  console.log('DASHBOARD: Rendering with jobs length:', jobs.length);
  return (
    <div className="animate-fade-in text-zinc-200">
      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage your jobs and applications</p>
        </div>
        <Link
          to="/post-job"
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-rose-600/25 hover:scale-[1.02] transition-all text-sm"
        >
          <FiPlusSquare className="w-4 h-4" /> Post Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7 stagger">
        <StatCard icon={FiBriefcase} label="Total Jobs" value={stats.total} color="bg-rose-950/30 text-rose-500" />
        <StatCard icon={FiClock} label="Open" value={stats.active} color="bg-blue-950/30 text-blue-500" />
        <StatCard icon={FiUsers} label="In Progress" value={stats.inProgress} color="bg-amber-950/30 text-amber-500" />
        <StatCard icon={FiCheckCircle} label="Completed" value={stats.completed} color="bg-emerald-950/30 text-emerald-500" />
      </div>

      {/* Jobs list */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Your Jobs</h2>
        <span className="text-sm text-zinc-500">{jobs.length} total</span>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-14 text-center shadow-sm">
          <div className="w-14 h-14 bg-rose-950/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiBriefcase className="w-7 h-7 text-rose-500" />
          </div>
          <h3 className="font-semibold text-white mb-1">No jobs posted yet</h3>
          <p className="text-zinc-500 text-sm mb-5">Get started by posting your first job to find great freelancers.</p>
          <Link
            to="/post-job"
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md shadow-rose-600/25 hover:scale-[1.02] transition-all"
          >
            <FiPlusSquare className="w-4 h-4" /> Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {jobs.map((job) => {
            const apps = applications[job._id] ?? []
            const isExpanded = expandedJob === job._id
            const freelancer = typeof job.hiredFreelancer === 'object' ? job.hiredFreelancer : null
            const statusCfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.open

            return (
              <div key={job._id} className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm hover:shadow-md transition-all overflow-hidden animate-slide-up">
                {/* Job row */}
                <div className="p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link to={`/jobs/${job._id}`} className="font-semibold text-white hover:text-rose-500 transition-colors">
                          {job.title}
                        </Link>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusCfg.cls}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-sm mt-1">
                        Budget: <span className="text-emerald-500 font-semibold">${job.budget}</span>
                        {freelancer && <span className="ml-3">Hired: <span className="text-zinc-300 font-medium">{freelancer.name}</span></span>}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {job.status === 'open' && (
                        <button
                          onClick={() => loadApplications(job._id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-950/30 transition-all"
                        >
                          <FiUsers className="w-3.5 h-3.5" />
                          Applications
                          {isExpanded ? <FiChevronUp className="w-3.5 h-3.5" /> : <FiChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      {job.status === 'in-progress' && (
                        <>
                          <button
                            onClick={() => handleComplete(job._id)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-950/30 transition-all"
                          >
                            <FiCheckCircle className="w-3.5 h-3.5" /> Complete
                          </button>
                          {freelancer && (
                            <button
                              onClick={() => navigate(`/chat?with=${freelancer._id}`)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-950/30 transition-all"
                            >
                              <FiMessageSquare className="w-3.5 h-3.5" /> Chat
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-950/30 transition-all"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Applications panel */}
                {isExpanded && (
                  <div className="border-t border-zinc-800 bg-black/50 p-5">
                    <h4 className="text-sm font-semibold text-zinc-300 mb-3">
                      Applications {apps.length > 0 && <span className="ml-1 text-rose-500">({apps.length})</span>}
                    </h4>
                    {apps.length === 0 ? (
                      <p className="text-zinc-500 text-sm">No applications received yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {apps.map((app) => (
                          <div key={app._id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 flex justify-between items-start gap-3">
                            <div className="flex gap-3">
                              <div className="w-9 h-9 bg-rose-950/50 rounded-xl flex items-center justify-center text-rose-500 font-bold text-sm flex-shrink-0 border border-rose-900/30">
                                {app.freelancerId?.name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-white text-sm">{app.freelancerId?.name}</p>
                                <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">{app.proposal}</p>
                                {app.bidAmount && (
                                  <p className="text-emerald-500 font-bold text-sm mt-1">Bid: ${app.bidAmount}</p>
                                )}
                              </div>
                            </div>
                            {app.status === 'pending' ? (
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => handleAccept(app._id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleReject(app._id)}
                                  className="border border-zinc-700 text-zinc-400 hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${app.status === 'accepted' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'
                                }`}>
                                {app.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
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
