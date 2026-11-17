import { api } from './authService.js'

export const jobService = {
  async getJobs() {
    const response = await api.get('/api/jobs')
    return response.data
  },

  async createJob(job) {
    const response = await api.post('/api/jobs', job)
    return response.data
  },

  async getMyApplications() {
    const response = await api.get('/api/jobs/my-applications')
    return response.data
  },

  async apply(jobId, coverLetter) {
    const response = await api.post(`/api/jobs/${encodeURIComponent(jobId)}/applications`, { coverLetter })
    return response.data
  },

  async submitWork(applicationId, submission) {
    const response = await api.post(
      `/api/jobs/applications/${encodeURIComponent(applicationId)}/submission`,
      submission
    )
    return response.data
  }
}
