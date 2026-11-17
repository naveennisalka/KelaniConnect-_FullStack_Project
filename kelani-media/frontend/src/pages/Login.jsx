import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { HiAcademicCap, HiEye, HiEyeOff } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import authService from '../services/authService.js'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/home'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const response = await authService.login(email, password)
      login(response)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (error) {
      console.warn('Backend login error:', error)
      const message = error.response?.data?.message || 'Login failed. Please check your credentials or backend server.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    const demoUser = {
      id: '650000000000000000000001',
      firstName: 'Kasun',
      lastName: 'Perera',
      email: 'kasun.perera@stu.kln.ac.lk',
      faculty: 'Faculty of Computing & Technology',
      degreeProgram: 'BSc (Hons) in Software Engineering',
      token: 'demo-jwt-token-12345'
    }
    login(demoUser)
    toast.success('Signed in as Demo Student!')
    navigate('/home', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#800000] text-white rounded-2xl shadow-lg mb-4">
            <HiAcademicCap className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">KelaniConnect</h1>
          <p className="text-gray-500 mt-1 text-sm">University of Kelaniya Student Community Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your student credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">University Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@stu.kln.ac.lk"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10 transition-all pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#800000] focus:ring-[#800000]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm font-medium text-[#800000] hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#800000] text-white font-semibold rounded-xl hover:bg-[#660000] shadow-md shadow-[#800000]/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Demo Login Button */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">or explore instantly</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-all border border-gray-200 flex items-center justify-center gap-2"
            >
              <span>🎓 Continue as Demo Student</span>
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-[#800000] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
