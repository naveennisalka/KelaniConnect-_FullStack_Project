import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const API_URL = `${API_BASE_URL}/api/auth`

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password })
    if (response.data.token) {
      saveToken(response.data.token)
      saveUser(response.data)
    }
    return response.data
  },

  async signup(signupData) {
    const response = await api.post('/signup', signupData)
    if (response.data.token) {
      saveToken(response.data.token)
      saveUser(response.data)
    }
    return response.data
  },

  async checkEmail(email) {
    const response = await api.post('/check-email', { email })
    return response.data
  }
}

export const saveToken = (token) => {
  localStorage.setItem('kc_token', token)
}

export const getToken = () => {
  return localStorage.getItem('kc_token')
}

export const removeToken = () => {
  localStorage.removeItem('kc_token')
  localStorage.removeItem('kc_user')
}

export const saveUser = (user) => {
  localStorage.setItem('kc_user', JSON.stringify(user))
}

export const getUser = () => {
  const user = localStorage.getItem('kc_user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => {
  return !!getToken()
}

export default authService
