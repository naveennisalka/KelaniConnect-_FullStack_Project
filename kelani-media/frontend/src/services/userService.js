import { api } from './authService.js'

export const userService = {
  async discover() {
    const response = await api.get('/api/users/discover')
    return response.data.map((user) => ({
      ...user,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      degree: user.degreeProgram
    }))
  },

  async getProfile(userId) {
    const response = await api.get(`/api/users/${encodeURIComponent(userId)}`)
    return response.data
  },

  async updateProfile(profileData) {
    const response = await api.put('/api/users/me', profileData)
    return response.data
  }
}
