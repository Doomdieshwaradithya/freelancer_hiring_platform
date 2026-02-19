import api from './client.js'

export const getJobs = (filters) => api.get('/jobs', { params: filters })
export const getJobById = (id) => api.get(`/jobs/${id}`)
export const createJob = (data) => api.post('/jobs', data)
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data)
export const deleteJob = (id) => api.delete(`/jobs/${id}`)
export const getMyJobs = () => api.get('/jobs/my-jobs')
export const completeJob = (id) => api.put(`/jobs/${id}/complete`)
