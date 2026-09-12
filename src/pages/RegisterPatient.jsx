import { useState } from 'react'
import {
  ArrowLeft,
  UserPlus,
  CheckCircle,
  User,
  Phone,
  MapPin,
  HeartPulse
} from 'lucide-react'

function RegisterPatient({ onBack }) {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    age: '',
    gender: '',
    village: '',
    bloodGroup: '',
    emergencyContact: ''
  })

  const [registered, setRegistered] = useState(null)

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (
      !form.name ||
      !form.mobile ||
      !form.age ||
      !form.gender ||
      !form.village
    ) {
      alert('Please fill all required fields.')
      return
    }

    const patient = {
      id: `SC-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      name: form.name,
      mobile: form.mobile,
      age: Number(form.age),
      gender: form.gender,
      village: form.village,
      bloodGroup: form.bloodGroup || 'Not Provided',
      emergencyContact:
        form.emergencyContact || 'Not Provided',
      status: 'Newly Registered',
      risk: 'Low',
      registeredAt: new Date().toLocaleString('en-IN')
    }

    const existing = JSON.parse(
      localStorage.getItem('sevacarePatients') || '[]'
    )

    localStorage.setItem(
      'sevacarePatients',
      JSON.stringify([patient, ...existing])
    )

    setRegistered(patient)
  }

  if (registered) {
    return (
      <div className="min-h-screen bg-sky-50 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sky-700 font-semibold mb-6"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center border border-green-100">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle size={45} />
            </div>

            <h1 className="text-3xl font-bold text-green-700 mt-6">
              Patient Registered Successfully
            </h1>

            <p className="text-slate-500 mt-2">
              The patient has been added to the SevaCare patient registry.
            </p>

            <div className="bg-sky-50 rounded-2xl p-6 text-left mt-8 space-y-4">
              <div>
                <p className="text-xs text-slate-500">
                  Patient ID
                </p>
                <p className="font-bold text-lg text-sky-700">
                  {registered.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Patient Name
                </p>
                <p className="font-bold">
                  {registered.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Mobile
                </p>
                <p className="font-semibold">
                  {registered.mobile}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Village
                </p>
                <p className="font-semibold">
                  {registered.village}
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
              <p className="font-semibold text-green-700">
                Connected Patient Registry
              </p>

              <p className="text-sm text-green-600 mt-1">
                This patient can now appear in Patient List, Triage,
                Referrals and Health Summary.
              </p>
            </div>

            <button
              onClick={onBack}
              className="mt-6 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sky-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-sky-100 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-700 to-cyan-600 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <UserPlus size={30} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Register Patient
                </h1>

                <p className="text-sky-100 mt-1">
                  Create a digital patient record for community care.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold mb-2">
                  Patient Name *
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Mobile Number *
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Age *
                </label>

                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Gender *
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                >
                  <option value="">
                    Select gender
                  </option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Village / Location *
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <input
                    name="village"
                    value={form.village}
                    onChange={handleChange}
                    placeholder="Enter village"
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Blood Group
                </label>

                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                >
                  <option value="">
                    Select blood group
                  </option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Emergency Contact
              </label>

              <input
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency contact number"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
              />
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <HeartPulse className="text-sky-600" />

                <div>
                  <p className="font-semibold">
                    Connected Digital Record
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    The registered patient can be used across SevaCare
                    triage, referral, follow-up and health summary modules.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-xl font-bold text-lg"
            >
              Register Patient
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPatient