import { createContext, useContext, useState, useEffect } from 'react'
import { getUser, getToken, removeToken, saveUser, saveToken } from '../services/authService.js'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    const savedUser = getUser()
    if (token && savedUser) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    saveUser(userData)
    if (userData.token) {
      saveToken(userData.token)
    }
  }

  const logout = () => {
    setUser(null)
    removeToken()
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
