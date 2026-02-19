import { useState } from 'react'
import { applyForJob } from '../api/applications.js'
import toast from 'react-hot-toast'

function getErrorMessage(err, fallback) {
  if (err?.response?.data?.message) return err.response.data.message
  return fallback
}

export function ApplyModal({ jobId, onClose, onSuccess }) {
  const [proposal, setProposal] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await applyForJob({
        jobId,
        proposal,
        bidAmount: bidAmount ? Number(bidAmount) : undefined
      })
      toast.success('Application submitted!')
      onSuccess()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to apply'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-teal-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Apply for Job</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Proposal</label>
            <textarea
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="Describe your approach and experience..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Your bid (optional)</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={0}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              placeholder="0"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-stone-300 text-stone-700 py-2.5 rounded-xl hover:bg-stone-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white py-2.5 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 disabled:opacity-70 transition-all shadow-lg shadow-teal-500/25"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
