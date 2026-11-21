import { api } from './authService.js'

// All API calls for events, event posts and passes (bought tickets)
export const eventService = {
  // ---------- Events ----------
  async getEvents() {
    const response = await api.get('/api/events')
    return response.data
  },

  async getEvent(eventId) {
    const response = await api.get(`/api/events/${encodeURIComponent(eventId)}`)
    return response.data
  },

  async createEvent(event) {
    const response = await api.post('/api/events', event)
    return response.data
  },

  // photos = { profilePhoto } or { coverPhoto }
  async updatePhotos(eventId, photos) {
    const response = await api.put(`/api/events/${encodeURIComponent(eventId)}/photos`, photos)
    return response.data
  },

  async toggleFollow(eventId) {
    const response = await api.post(`/api/events/${encodeURIComponent(eventId)}/follow`)
    return response.data
  },

  async addOrganizer(eventId, userId) {
    const response = await api.post(`/api/events/${encodeURIComponent(eventId)}/organizers`, { userId })
    return response.data
  },

  async inviteMember(eventId, userId) {
    const response = await api.post(`/api/events/${encodeURIComponent(eventId)}/invites`, { userId })
    return response.data
  },

  // ---------- Tickets and other items ----------
  async addItem(eventId, item) {
    const response = await api.post(`/api/events/${encodeURIComponent(eventId)}/items`, item)
    return response.data
  },

  async buyItem(eventId, itemId) {
    const response = await api.post(
      `/api/events/${encodeURIComponent(eventId)}/items/${encodeURIComponent(itemId)}/buy`
    )
    return response.data
  },

  async getMyPasses() {
    const response = await api.get('/api/passes/me')
    return response.data
  },

  // ---------- Event posts ----------
  async getAllPosts() {
    const response = await api.get('/api/event-posts')
    return response.data
  },

  async getEventPosts(eventId) {
    const response = await api.get('/api/event-posts', { params: { eventId } })
    return response.data
  },

  // post = { eventId, content, imageUrl }
  async createPost(post) {
    const response = await api.post('/api/event-posts', post)
    return response.data
  },

  async toggleLike(postId) {
    const response = await api.post(`/api/event-posts/${encodeURIComponent(postId)}/likes`)
    return response.data
  },

  async addComment(postId, content) {
    const response = await api.post(`/api/event-posts/${encodeURIComponent(postId)}/comments`, { content })
    return response.data
  }
}
