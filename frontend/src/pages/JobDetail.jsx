import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getJobById } from '../api/jobs.js'
import { applyForJob } from '../api/applications.js'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiDollarSign, FiClock, FiBriefcase, FiUser, FiArrowRight } from 'react-icons/fi'

export function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [proposal, setProposal] = useState('')
  const [bidAmount, setBidAmount] = useState('')

  useEffect(() => {
    if (!id) return
    getJobById(id)
      .then(({ data }) => setJob(data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to apply')
      return
    }
    try {
      await applyForJob({
        jobId: id,
        proposal,
        bidAmount: Number(bidAmount)
      })
      toast.success('Application submitted! 🚀')
      setProposal('')
      setBidAmount('')
      navigate('/my-applications')
    } catch (err) {
      toast.error('Failed to submit application')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-zinc-200">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 h-48 skeleton" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-zinc-900 rounded-2xl border border-zinc-800 p-8 h-64 skeleton" />
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 h-48 skeleton" />
        </div>
      </div>
    )
  }

  if (!job) return <div className="text-center py-20 text-zinc-500 font-medium">Job not found</div>

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in text-zinc-200">
      <Link to="/jobs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-rose-500 mb-6 transition-colors font-medium">
        <FiArrowLeft className="w-4 h-4" /> Back to listings
      </Link>

      {/* Header card */}
      <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 mb-8 shadow-sm">
        <div className="flex justify-between items-start gap-4 mb-6">
          <h1 className="text-3xl font-extrabold text-white leading-tight">{job.title}</h1>
          <span className="bg-emerald-950/30 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-900/30">
            {job.status === 'open' ? 'Open' : job.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 text-zinc-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <FiDollarSign className="text-emerald-500 w-4 h-4" />
            <span className="text-white text-base">${job.budget}</span>
            <span>Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-rose-500 w-4 h-4" />
            <span className="text-white text-base">{job.duration || 'Not specified'}</span>
            <span>Duration</span>
          </div>
          <div className="flex items-center gap-2">
            <FiBriefcase className="text-blue-500 w-4 h-4" />
            <span className="text-white text-base">{job.category || 'General'}</span>
            <span>Category</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Description</h2>
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-sm">
              <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill) => (
                <span key={skill} className="bg-rose-950/30 text-rose-400 px-4 py-1.5 rounded-xl text-sm font-semibold border border-rose-900/30">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {user?.role === 'freelancer' && job.status === 'open' && (
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-600" />
              <h3 className="text-lg font-bold text-white mb-4">Apply for this job</h3>
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Your Proposal</label>
                  <textarea
                    value={proposal}
                    onChange={(e) => setProposal(e.target.value)}
                    required
                    placeholder="Tell the client why you're a good fit..."
                    className="w-full px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all min-h-[120px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Bid Amount ($)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    placeholder="500"
                    className="w-full px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Submit Proposal <FiArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">About Client</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 font-bold border border-zinc-700">
                {job.clientId?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white">{job.clientId?.name}</p>
                <p className="text-xs text-zinc-500 font-medium">Member since 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
