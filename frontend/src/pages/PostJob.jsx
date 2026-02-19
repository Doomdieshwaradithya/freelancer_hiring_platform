import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob } from '../api/jobs.js'
import toast from 'react-hot-toast'

function getErrorMessage(err, fallback) {
  if (err?.response?.data?.message) return err.response.data.message
  return fallback
}

export function PostJob() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [skills, setSkills] = useState('')
  const [category, setCategory] = useState('')
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const skillsList = skills.split(',').map((s) => s.trim()).filter(Boolean)
    if (skillsList.length === 0) {
      toast.error('Add at least one skill')
      return
    }
    setLoading(true)
    try {
      await createJob({
        title,
        description,
        budget: Number(budget),
        skillsRequired: skillsList,
        category: category || undefined,
        duration: duration || undefined
      })
      toast.success('Job posted!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to post job'))
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Post a Job</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
              placeholder="e.g. Web Developer Needed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className={inputClass}
              placeholder="Describe your project..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Budget ($)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              min={0}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              className={inputClass}
              placeholder="React, Node.js, MongoDB"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category (optional)</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              placeholder="Web Development"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Duration (optional)</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className={inputClass}
              placeholder="1-2 weeks"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 disabled:opacity-70 transition-all shadow-lg shadow-teal-500/25 active:scale-[0.98]"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  )
}
