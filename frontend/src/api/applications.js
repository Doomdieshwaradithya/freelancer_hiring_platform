import api from './client.js'

export const applyForJob = (data) => api.post('/applications', data)
export const getMyApplications = () => api.get('/applications/my-applications')
export const getJobApplications = (jobId) => api.get(`/applications/job/${jobId}`)
export const acceptApplication = (id) => api.put(`/applications/${id}/accept`)
export const rejectApplication = (id) => api.put(`/applications/${id}/reject`)
