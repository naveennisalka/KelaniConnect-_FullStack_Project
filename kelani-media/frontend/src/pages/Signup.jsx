import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiAcademicCap, HiEye, HiEyeOff, HiArrowLeft, HiCheckCircle } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import authService from '../services/authService.js'
import StepProgressBar from '../components/StepProgressBar.jsx'

const FACULTIES = [
  'Faculty of Computing & Technology',
  'Faculty of Science',
  'Faculty of Humanities',
  'Faculty of Social Sciences',
  'Faculty of Commerce & Management',
  'Faculty of Medicine'
]

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    birthday: '',
    password: '',
    confirmPassword: '',
    faculty: '',
    degreeProgram: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // Validation helpers
  const isKelaniEmail = (email) => {
    const lower = email.toLowerCase()
    return lower.endsWith('@kln.ac.lk') || lower.includes('.kln.ac.lk')
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strengthLabel = (strength) => {
    if (strength <= 1) return { text: 'Weak', color: 'bg-red-500' }
    if (strength <= 2) return { text: 'Fair', color: 'bg-orange-500' }
    if (strength <= 3) return { text: 'Good', color: 'bg-yellow-500' }
    if (strength <= 4) return { text: 'Strong', color: 'bg-green-500' }
    return { text: 'Very Strong', color: 'bg-emerald-500' }
  }

  // Step validation
  const validateStep = async () => {
    const newErrors = {}

    switch (currentStep) {
      case 1: {
        if (!formData.email) {
          newErrors.email = 'Email is required'
        } else if (!isKelaniEmail(formData.email)) {
          newErrors.email = 'Please use your University of Kelaniya email address (ending with kln.ac.lk)'
        } else {
          // Check email availability
          setLoading(true)
          try {
            const cleanEmail = formData.email.trim()
            const result = await authService.checkEmail(cleanEmail)
            if (!result.valid) {
              newErrors.email = 'Please use a valid University of Kelaniya email'
            } else if (!result.available) {
              newErrors.email = 'An account with this email already exists'
            }
          } catch (err) {
            console.error('Email check error:', err)
            const serverMsg = err.response?.data?.message
            if (serverMsg) {
              newErrors.email = serverMsg
            } else if (err.code === 'ERR_NETWORK' || !err.response) {
              newErrors.email = 'Cannot connect to backend server. Make sure the Spring Boot backend is running on port 8080.'
            } else {
              newErrors.email = 'Unable to verify email. Please try again.'
            }
          } finally {
            setLoading(false)
          }
        }
        break
      }
      case 2:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        break
      case 3:
        if (!formData.birthday) {
          newErrors.birthday = 'Birthday is required'
        } else {
          const birthDate = new Date(formData.birthday)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()
          if (age < 16 || age > 60) {
            newErrors.birthday = 'Please enter a valid birth date'
          }
        }
        break
      case 4:
        if (!formData.password) {
          newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters'
        }
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
        break
      case 5:
        if (!formData.faculty) newErrors.faculty = 'Please select your faculty'
        if (!formData.degreeProgram.trim()) newErrors.degreeProgram = 'Degree program is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    const isValid = await validateStep()
    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await authService.signup({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formData.birthday,
        faculty: formData.faculty,
        degreeProgram: formData.degreeProgram
      })
      login(response)
      toast.success('Account created successfully! 🎉')
      navigate('/home')
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthInfo = strengthLabel(passwordStrength)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <HiAcademicCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
          <p className="text-gray-500 mt-1">Connect, collaborate, and grow together</p>
        </div>

        {/* Progress bar (shown from step 2 onwards) */}
        {currentStep > 1 && (
          <StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* ==================== STEP 1: Email ==================== */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Welcome!</h2>
                <p className="text-sm text-gray-500">Enter your university email to get started</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="yourname@stu.kln.ac.lk"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-400">Use your University of Kelaniya email address</p>
                </div>

                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 2: Name ==================== */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tell us about yourself</h2>
                <p className="text-sm text-gray-500">What should we call you?</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                  />
                  {errors.firstName && <p className="mt-1.5 text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                  />
                  {errors.lastName && <p className="mt-1.5 text-sm text-red-500">{errors.lastName}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <HiArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== STEP 3: Birthday ==================== */}
          {currentStep === 3 && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">When is your birthday?</h2>
                <p className="text-sm text-gray-500">This helps us personalize your experience</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => updateField('birthday', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.birthday ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                  />
                  {errors.birthday && <p className="mt-1.5 text-sm text-red-500">{errors.birthday}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <HiArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== STEP 4: Password ==================== */}
          {currentStep === 4 && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Create a password</h2>
                <p className="text-sm text-gray-500">Make it strong and memorable</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Create a password"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>}

                  {/* Password strength */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full ${level <= passwordStrength ? strengthInfo.color : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{strengthInfo.text}</p>
                    </div>
                  )}

                  {/* Requirements */}
                  <div className="mt-3 space-y-1">
                    {[
                      { label: 'At least 8 characters', met: formData.password.length >= 8 },
                      { label: 'Uppercase letter', met: /[A-Z]/.test(formData.password) },
                      { label: 'Lowercase letter', met: /[a-z]/.test(formData.password) },
                      { label: 'Number', met: /[0-9]/.test(formData.password) }
                    ].map((req) => (
                      <div key={req.label} className="flex items-center gap-2 text-xs">
                        <HiCheckCircle className={`w-4 h-4 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className={req.met ? 'text-green-600' : 'text-gray-400'}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <HiArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== STEP 5: Faculty & Degree ==================== */}
          {currentStep === 5 && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Academic Information</h2>
                <p className="text-sm text-gray-500">Tell us about your studies</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Faculty</label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => updateField('faculty', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.faculty ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                  >
                    <option value="">Select your faculty</option>
                    {FACULTIES.map((faculty) => (
                      <option key={faculty} value={faculty}>{faculty}</option>
                    ))}
                  </select>
                  {errors.faculty && <p className="mt-1.5 text-sm text-red-500">{errors.faculty}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Degree Program</label>
                  <input
                    type="text"
                    value={formData.degreeProgram}
                    onChange={(e) => updateField('degreeProgram', e.target.value)}
                    placeholder="e.g., BSc (Hons) in Software Engineering"
                    className={`w-full px-4 py-3 rounded-xl border ${errors.degreeProgram ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all`}
                  />
                  {errors.degreeProgram && <p className="mt-1.5 text-sm text-red-500">{errors.degreeProgram}</p>}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <HiArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sign in link */}
        {currentStep === 1 && (
          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-light">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default Signup
