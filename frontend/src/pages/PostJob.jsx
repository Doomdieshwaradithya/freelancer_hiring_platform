import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createJob } from '../api/jobs.js'
import toast from 'react-hot-toast'
import { FiPlusSquare, FiX, FiArrowRight } from 'react-icons/fi'

function getErrorMessage(err, fallback) {
  if (err?.response?.data?.message) return err.response.data.message
  return fallback
}

const inputClass = "w-full px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent focus:bg-zinc-900 transition-all"

export function PostJob() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState([])
  const [category, setCategory] = useState('')
  const [duration, setDuration] = useState('')
  const [loading, setLoading] = useState(false)

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault()
      const s = skillInput.trim().replace(/,$/, '')
      if (s && !skills.includes(s)) setSkills([...skills, s])
      setSkillInput('')
    }
  }

  const removeSkill = (s) => setSkills(skills.filter((sk) => sk !== s))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const finalSkills = [
      ...skills,
      ...skillInput.split(',').map((s) => s.trim()).filter(Boolean)
    ]
    const uniqueSkills = [...new Set(finalSkills)]
    if (uniqueSkills.length === 0) {
      toast.error('Add at least one skill')
      return
    }
    setLoading(true)
    try {
      await createJob({
        title, description,
        budget: Number(budget),
        skillsRequired: uniqueSkills,
        category: category || undefined,
        duration: duration || undefined
      })
      toast.success('Job posted successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to post job'))
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Data & Analytics', 'DevOps', 'Other']
  const durations = ['Less than 1 week', '1-2 weeks', '1 month', '1-3 months', '3-6 months', 'Ongoing']

  return (
    <div className="max-w-2xl mx-auto animate-fade-in text-zinc-200">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Post a New Job</h1>
        <p className="text-zinc-500 text-sm mt-1">Fill in the details to attract the right freelancers.</p>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-sm overflow-hidden">
        <div className="bg-rose-600 px-6 py-4 flex items-center gap-3">
          <FiPlusSquare className="w-5 h-5 text-white" />
          <h2 className="font-semibold text-white">Job Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Job Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
              placeholder="e.g. React Developer for E-commerce Site"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className={inputClass}
              placeholder="Describe your project, deliverables, and any specific requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Budget (USD) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  min={0}
                  className={`${inputClass} pl-8`}
                  placeholder="500"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className={inputClass}
              >
                <option value="">Select duration</option>
                {durations.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">
              Required Skills * <span className="text-zinc-500 font-normal">— press Enter or comma to add</span>
            </label>
            <div className="min-h-12 flex flex-wrap gap-2 px-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 focus-within:ring-2 focus-within:ring-rose-500 focus-within:bg-zinc-900 transition-all">
              {skills.map((s) => (
                <span key={s} className="flex items-center gap-1.5 bg-rose-950/50 text-rose-400 text-xs font-semibold px-2.5 py-1 rounded-lg border border-rose-900/30">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className="hover:text-rose-200">
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder={skills.length === 0 ? "React, Node.js, TypeScript..." : "Add more..."}
                className="flex-1 min-w-24 bg-transparent outline-none text-sm text-white placeholder-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-rose-600/25 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 transition-all duration-200"
          >
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting...</>
            ) : (
              <><FiPlusSquare className="w-4 h-4" /> Post Job <FiArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
