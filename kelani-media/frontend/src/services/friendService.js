import { api } from './authService.js'

export const friendService = {
  async getStats() {
    const response = await api.get('/api/friends/stats')
    return response.data
  },

  async getPendingRequests() {
    const response = await api.get('/api/friends/requests/pending')
    return response.data
  },

  async sendRequest(receiverId) {
    await api.post('/api/friends/request/send', null, { params: { receiverId } })
  },

  async acceptRequest(requestId) {
    await api.put(`/api/friends/request/accept/${encodeURIComponent(requestId)}`)
  },

  async rejectRequest(requestId) {
    await api.delete(`/api/friends/request/reject/${encodeURIComponent(requestId)}`)
  }
}
