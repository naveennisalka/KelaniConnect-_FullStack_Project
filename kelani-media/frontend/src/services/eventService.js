import { api } from './authService.js'

export const eventService = {
  async getEvents() {
    const response = await api.get('/api/events')
    return response.data
  },

  async createEvent(event) {
    const response = await api.post('/api/events', event)
    return response.data
  }
}
