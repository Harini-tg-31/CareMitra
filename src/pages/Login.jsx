import { useState } from 'react'
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  HeartPulse,
  BriefcaseMedical,
  ShieldCheck,
  Stethoscope,
  Landmark
} from 'lucide-react'

function Login({ onLogin }) {
  const [mode, setMode] = useState('Login')
  const [role, setRole] = useState('Patient')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [workerType, setWorkerType] = useState('Community Health Worker')
  const [specialization, setSpecialization] = useState('General Medicine')
  const [showPassword, setShowPassword] = useState(false)

  const doctorSpecializations = [
    'General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 'Gynecology', 'Orthopedics', 'Emergency Medicine'
  ]

  const workerTypes = [
    'Community Health Worker',
    'ASHA Worker',
    'ANM',
    'Nurse',
    'Pharmacist',
    'Lab Technician',
    'Other'
  ]

  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)

  const handleMobileChange = e => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setMobile(value)
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!name.trim()) {
      alert('Please enter your name')
      return
    }

    if (mobile.length !== 10) {
      alert('Phone number must contain exactly 10 digits')
      return
    }

    if (!passwordValid) {
      alert('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character')
      return
    }

    const userData = {
      name: name.trim(),
      mobile,
      role,
      workerType: role === 'Health Worker' ? workerType : '',
      specialization: role === 'Doctor' ? specialization : ''
    }

    localStorage.setItem(
      'caremitraUser',
      JSON.stringify(userData)
    )

    onLogin(role, userData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-gradient-to-r from-sky-600 to-emerald-500 p-8 text-center">

            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <HeartPulse
                size={42}
                className="text-white"
              />
            </div>

            <h1 className="text-3xl font-bold text-white mt-4">
              CareMitra
            </h1>

            <p className="text-sky-50 text-sm mt-1">
              Your Health • Our Priority
            </p>

            <p className="text-white/90 text-sm mt-3">
              Healthcare Support
            </p>

          </div>

          <div className="p-6 md:p-8">

            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">

              <button
                type="button"
                onClick={() => setMode('Login')}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  mode === 'Login'
                    ? 'bg-white text-sky-600 shadow'
                    : 'text-slate-500'
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => setMode('Register')}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  mode === 'Register'
                    ? 'bg-white text-sky-600 shadow'
                    : 'text-slate-500'
                }`}
              >
                Register
              </button>

            </div>

            <h2 className="text-2xl font-bold text-slate-800 text-center">
              {mode === 'Login'
                ? 'Welcome Back'
                : 'Create Your Account'}
            </h2>

            <p className="text-slate-500 text-center text-sm mt-2 mb-6">
              {mode === 'Login'
                ? 'Sign in to continue to CareMitra'
                : 'Create your CareMitra account'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">

              <button
                type="button"
                onClick={() => setRole('Patient')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 ${
                  role === 'Patient'
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                <HeartPulse size={25} />
                <span className="font-semibold text-sm">Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('Health Worker')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 ${
                  role === 'Health Worker'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                <BriefcaseMedical size={25} />
                <span className="font-semibold text-sm">Health Worker</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('Doctor')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 ${
                  role === 'Doctor'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                <Stethoscope size={25} />
                <span className="font-semibold text-sm">Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('Government Admin')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 ${
                  role === 'Government Admin'
                    ? 'border-slate-700 bg-slate-100 text-slate-800'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                <Landmark size={25} />
                <span className="font-semibold text-sm">Gov Admin</span>
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                  />

                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="Enter 10 digit phone number"
                    maxLength={10}
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                  />

                </div>

                <p className="text-xs text-slate-400 mt-1">
                  {mobile.length}/10 digits
                </p>
              </div>

              {role === 'Doctor' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Medical Specialization
                  </label>
                  <div className="relative">
                    <Stethoscope size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" />
                    <select
                      value={specialization}
                      onChange={e => setSpecialization(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-white outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      {doctorSpecializations.map(item => <option key={item}>{item}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {role === 'Health Worker' && (
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type of Health Worker
                  </label>

                  <div className="relative">

                    <BriefcaseMedical
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      value={workerType}
                      onChange={e => setWorkerType(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-white outline-none focus:ring-2 focus:ring-emerald-300"
                    >
                      {workerTypes.map(type => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      ))}
                    </select>

                  </div>
                </div>
              )}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-12 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                <div className="bg-slate-50 rounded-xl p-3 mt-2">

                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    Password requirements
                  </p>

                  <div className="space-y-1 text-xs">

                    <p className={
                      password.length >= 8
                        ? 'text-green-600'
                        : 'text-slate-400'
                    }>
                      ✓ At least 8 characters
                    </p>

                    <p className={
                      /[A-Z]/.test(password)
                        ? 'text-green-600'
                        : 'text-slate-400'
                    }>
                      ✓ One uppercase letter
                    </p>

                    <p className={
                      /[a-z]/.test(password)
                        ? 'text-green-600'
                        : 'text-slate-400'
                    }>
                      ✓ One lowercase letter
                    </p>

                    <p className={
                      /[0-9]/.test(password)
                        ? 'text-green-600'
                        : 'text-slate-400'
                    }>
                      ✓ One number
                    </p>

                    <p className={
                      /[^A-Za-z0-9]/.test(password)
                        ? 'text-green-600'
                        : 'text-slate-400'
                    }>
                      ✓ One special character
                    </p>

                  </div>
                </div>

              </div>

              <button
                type="submit"
                className={`w-full text-white py-4 rounded-xl font-bold ${
                  role === 'Patient'
                    ? 'bg-sky-600 hover:bg-sky-700'
                    : role === 'Doctor'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {mode === 'Login'
                  ? 'Login to CareMitra'
                  : 'Create CareMitra Account'}
              </button>

            </form>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-6">

              <ShieldCheck size={15} />

              <span>
                Your information is kept secure
              </span>

            </div>

          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          CareMitra • Healthcare Support
        </p>

      </div>
    </div>
  )
}

export default Login