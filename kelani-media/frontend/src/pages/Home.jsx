import { useNavigate } from 'react-router-dom'
import { HiAcademicCap, HiLogout } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const Home = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav bar */}
      <nav className="bg-primary shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <HiAcademicCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg">KelaniConnect</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all text-sm font-medium"
            >
              <HiLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
            <HiAcademicCap className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.firstName || 'Student'}! 🎓
          </h1>

          <p className="text-gray-500 mb-6">
            You are now connected to KelaniConnect
          </p>

          <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3">
            <h3 className="font-semibold text-gray-700 mb-3">Your Profile</h3>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-900">{user?.email}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-sm text-gray-500">Faculty</span>
              <span className="text-sm font-medium text-gray-900">{user?.faculty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Degree</span>
              <span className="text-sm font-medium text-gray-900">{user?.degreeProgram}</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-8">
            🚀 Home feed coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
