import { api } from './authService.js'

export const postService = {
  async getFeed() {
    const response = await api.get('/api/posts')
    return response.data
  },

  async createPost(post) {
    const response = await api.post('/api/posts', post)
    return response.data
  },

  async toggleLike(postId) {
    const response = await api.post(`/api/posts/${encodeURIComponent(postId)}/likes`)
    return response.data
  },

  async addComment(postId, content) {
    const response = await api.post(`/api/posts/${encodeURIComponent(postId)}/comments`, { content })
    return response.data
  }
}
