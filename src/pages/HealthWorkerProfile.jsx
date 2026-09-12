import { useState } from 'react'
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Languages,
  BriefcaseMedical,
  Calendar,
  Users,
  GitBranch,
  AlertTriangle,
  Save,
  Pencil
} from 'lucide-react'

function HealthWorkerProfile({ onBack }) {
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    name: 'Health Worker',
    mobile: '+91 98765 40001',
    employeeId: 'HW-2026-1024',
    role: 'Community Health Worker',
    village: 'Kanchipuram',
    experience: '5 Years',
    language: 'Tamil'
  })

  const handleChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value
    })
  }

  const handleSave = () => {
    setEditing(false)
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-xl">
            <BriefcaseMedical className="text-white" size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              My Profile
            </h1>
            <p className="text-sm text-gray-500">
              Manage your health worker information
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 text-center font-medium">
            ✓ Profile saved successfully
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div>
            <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8 text-center">
              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
                <BriefcaseMedical
                  size={50}
                  className="text-white"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-5">
                {profile.name}
              </h2>

              <p className="text-gray-500 mt-1">
                Employee ID
              </p>

              <div className="inline-block mt-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold">
                {profile.employeeId}
              </div>

              <div className="mt-6 bg-green-50 rounded-2xl p-4 text-left">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="text-green-600"
                    size={22}
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Verified Health Worker
                    </p>

                    <p className="text-xs text-gray-500">
                      SevaCare healthcare network
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-6 mt-6">
              <h3 className="font-bold text-gray-800 mb-4">
                Work Summary
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <SummaryCard
                  icon={<Users size={21} />}
                  value="24"
                  label="Patients"
                  style="bg-blue-50 text-blue-600"
                />

                <SummaryCard
                  icon={<AlertTriangle size={21} />}
                  value="5"
                  label="High Risk"
                  style="bg-red-50 text-red-600"
                />

                <SummaryCard
                  icon={<GitBranch size={21} />}
                  value="8"
                  label="Referrals"
                  style="bg-purple-50 text-purple-600"
                />

                <SummaryCard
                  icon={<Calendar size={21} />}
                  value="12"
                  label="Follow-ups"
                  style="bg-green-50 text-green-600"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Professional Information
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Keep your work information up to date
                  </p>
                </div>

                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700"
                  >
                    <Pencil size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700"
                  >
                    <Save size={18} />
                    Save Profile
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ProfileField
                  icon={<User size={20} />}
                  label="Full Name"
                  value={profile.name}
                  editing={editing}
                  onChange={value =>
                    handleChange('name', value)
                  }
                />

                <ProfileField
                  icon={<Phone size={20} />}
                  label="Mobile Number"
                  value={profile.mobile}
                  editing={editing}
                  onChange={value =>
                    handleChange('mobile', value)
                  }
                />

                <ProfileField
                  icon={<BriefcaseMedical size={20} />}
                  label="Employee ID"
                  value={profile.employeeId}
                  editing={false}
                  onChange={() => {}}
                />

                <ProfileField
                  icon={<BriefcaseMedical size={20} />}
                  label="Role"
                  value={profile.role}
                  editing={editing}
                  onChange={value =>
                    handleChange('role', value)
                  }
                />

                <ProfileField
                  icon={<MapPin size={20} />}
                  label="Assigned Area"
                  value={profile.village}
                  editing={editing}
                  onChange={value =>
                    handleChange('village', value)
                  }
                />

                <ProfileField
                  icon={<Calendar size={20} />}
                  label="Experience"
                  value={profile.experience}
                  editing={editing}
                  onChange={value =>
                    handleChange('experience', value)
                  }
                />

                <ProfileField
                  icon={<Languages size={20} />}
                  label="Preferred Language"
                  value={profile.language}
                  editing={editing}
                  onChange={value =>
                    handleChange('language', value)
                  }
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl shadow-lg p-8 mt-6 text-white">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <ShieldCheck size={26} />
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Secure Healthcare Access
                  </h3>

                  <p className="text-blue-50 mt-2 leading-relaxed">
                    Health worker access is protected to help keep
                    patient information secure. Use SevaCare only
                    for authorized healthcare activities and care
                    coordination.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-blue-100 p-6 mt-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Languages
                    className="text-green-600"
                    size={24}
                  />
                </div>

                <div>
                  <h3 className="font-bold text-gray-800">
                    Local Language Support
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Your preferred working language is{' '}
                    <span className="font-semibold text-blue-600">
                      {profile.language}
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        SevaCare • Health Worker Portal
      </footer>
    </div>
  )
}

function ProfileField({
  icon,
  label,
  value,
  editing,
  onChange
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-2">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500">
          {icon}
        </div>

        <input
          type="text"
          value={value}
          disabled={!editing}
          onChange={e => onChange(e.target.value)}
          className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none ${
            editing
              ? 'border-blue-300 bg-white focus:ring-2 focus:ring-blue-200'
              : 'border-gray-200 bg-gray-50 text-gray-700'
          }`}
        />
      </div>
    </div>
  )
}

function SummaryCard({ icon, value, label, style }) {
  return (
    <div className={`${style} rounded-2xl p-4`}>
      {icon}

      <p className="text-2xl font-bold text-gray-800 mt-2">
        {value}
      </p>

      <p className="text-xs text-gray-500">
        {label}
      </p>
    </div>
  )
}

export default HealthWorkerProfile