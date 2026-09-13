import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Users,
  Search,
  User,
  Phone,
  MapPin,
  Activity,
  Eye,
  X,
  Stethoscope,
  HeartPulse,
  ClipboardPlus,
  FileHeart
} from 'lucide-react'
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

function PatientList({
  onBack,
  onTriage,
  onHealthSummary,
  onReferral
}) {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const patientsQuery = query(
      collection(db, 'patients'),
      orderBy('registeredAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      patientsQuery,
      snapshot => {
        const firebasePatients = snapshot.docs.map(doc => ({
          firestoreId: doc.id,
          ...doc.data()
        }))

        setPatients(firebasePatients)
        setLoading(false)
      },
      error => {
        console.error('Error loading patients:', error)
        setPatients([])
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const filteredPatients = patients.filter(patient => {
    const text = search.toLowerCase()

    return (
      String(patient.name || '')
        .toLowerCase()
        .includes(text) ||
      String(patient.id || '')
        .toLowerCase()
        .includes(text) ||
      String(patient.village || '')
        .toLowerCase()
        .includes(text) ||
      String(patient.mobile || '')
        .toLowerCase()
        .includes(text)
    )
  })

  const highRisk = patients.filter(
    patient => patient.risk === 'High'
  ).length

  const mediumRisk = patients.filter(
    patient => patient.risk === 'Medium'
  ).length

  const stable = patients.filter(
    patient => patient.risk === 'Low'
  ).length

  const riskStyle = risk => {
    if (risk === 'High') {
      return 'bg-red-100 text-red-700'
    }

    if (risk === 'Medium') {
      return 'bg-orange-100 text-orange-700'
    }

    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="min-h-screen bg-sky-50 p-6">

      <div className="max-w-7xl mx-auto">

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
                <Users size={30} />
              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  Patient List
                </h1>

                <p className="text-sky-100 mt-1">
                  View and manage registered community patients.
                </p>

              </div>

            </div>

          </div>

          <div className="p-6">

            <div className="grid md:grid-cols-4 gap-4">

              <div className="bg-sky-50 rounded-2xl p-5">

                <Users className="text-sky-600" />

                <p className="text-sm text-slate-500 mt-3">
                  Total Patients
                </p>

                <h2 className="text-3xl font-bold">
                  {patients.length}
                </h2>

              </div>

              <div className="bg-red-50 rounded-2xl p-5">

                <Activity className="text-red-600" />

                <p className="text-sm text-slate-500 mt-3">
                  High Risk
                </p>

                <h2 className="text-3xl font-bold text-red-600">
                  {highRisk}
                </h2>

              </div>

              <div className="bg-orange-50 rounded-2xl p-5">

                <HeartPulse className="text-orange-600" />

                <p className="text-sm text-slate-500 mt-3">
                  Medium Risk
                </p>

                <h2 className="text-3xl font-bold text-orange-600">
                  {mediumRisk}
                </h2>

              </div>

              <div className="bg-green-50 rounded-2xl p-5">

                <Stethoscope className="text-green-600" />

                <p className="text-sm text-slate-500 mt-3">
                  Stable
                </p>

                <h2 className="text-3xl font-bold text-green-600">
                  {stable}
                </h2>

              </div>

            </div>

            <div className="relative mt-7">

              <Search
                size={20}
                className="absolute left-4 top-4 text-slate-400"
              />

              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search patient name, ID, village or mobile..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-sky-500"
              />

            </div>

            {loading ? (

              <div className="text-center py-12">

                <div className="animate-spin w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full mx-auto" />

                <p className="text-slate-500 mt-4">
                  Loading patients from Firebase...
                </p>

              </div>

            ) : (

              <div className="space-y-4 mt-6">

                {filteredPatients.map(patient => (

                  <div
                    key={patient.firestoreId || patient.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                      <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-sky-600">
                        <User size={28} />
                      </div>

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-lg font-bold">
                            {patient.name}
                          </h3>

                          <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-full">
                            {patient.id}
                          </span>

                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${riskStyle(
                              patient.risk
                            )}`}
                          >
                            {patient.risk || 'Low'} Risk
                          </span>

                        </div>

                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">

                          <span>
                            Age {patient.age}
                          </span>

                          <span>
                            {patient.gender}
                          </span>

                          <span className="flex items-center gap-1">
                            <MapPin size={15} />
                            {patient.village}
                          </span>

                          <span className="flex items-center gap-1">
                            <Phone size={15} />
                            {patient.mobile}
                          </span>

                        </div>

                        <p className="text-sm font-semibold text-slate-700 mt-2">
                          Status: {patient.status || 'Newly Registered'}
                        </p>

                      </div>

                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="px-5 py-3 bg-sky-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                      >
                        <Eye size={18} />
                        View Patient
                      </button>

                    </div>

                  </div>

                ))}

                {filteredPatients.length === 0 && (

                  <div className="text-center py-12">

                    <Users
                      size={50}
                      className="mx-auto text-slate-300"
                    />

                    <p className="text-slate-500 mt-4">
                      {patients.length === 0
                        ? 'No patients registered in Firebase yet.'
                        : 'No patients found.'}
                    </p>

                  </div>

                )}

              </div>

            )}

            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mt-7">

              <div className="flex items-center gap-3">

                <Users className="text-green-600" />

                <div>

                  <h3 className="font-bold text-green-700">
                    Firebase Patient Registry
                  </h3>

                  <p className="text-sm text-green-600 mt-1">
                    Patient records are loaded directly from Firebase
                    and update automatically when new patients are registered.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {selectedPatient && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5 z-50">

            <div className="bg-white rounded-3xl max-w-lg w-full p-7">

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                  Patient Details
                </h2>

                <button
                  onClick={() => setSelectedPatient(null)}
                  className="text-slate-500"
                >
                  <X size={25} />
                </button>

              </div>

              <div className="bg-sky-50 rounded-2xl p-5 mt-6">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-sky-600">
                    <User size={28} />
                  </div>

                  <div>

                    <h3 className="text-xl font-bold">
                      {selectedPatient.name}
                    </h3>

                    <p className="text-sm text-sky-700">
                      {selectedPatient.id}
                    </p>

                  </div>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">

                <Info
                  label="Age"
                  value={selectedPatient.age}
                />

                <Info
                  label="Gender"
                  value={selectedPatient.gender}
                />

                <Info
                  label="Blood Group"
                  value={selectedPatient.bloodGroup}
                />

                <Info
                  label="Risk"
                  value={selectedPatient.risk}
                />

                <Info
                  label="Village"
                  value={selectedPatient.village}
                />

                <Info
                  label="Status"
                  value={selectedPatient.status}
                />

              </div>

              <div className="mt-5 flex items-center gap-3">

                <Phone
                  className="text-sky-600"
                  size={20}
                />

                <span>
                  {selectedPatient.mobile}
                </span>

              </div>

              <div className="mt-4">

                <p className="text-xs text-slate-500">
                  Emergency Contact
                </p>

                <p className="font-semibold mt-1">
                  {selectedPatient.emergencyContact || 'Not Provided'}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">

                <button
                  onClick={() => {
                    setSelectedPatient(null)
                    onTriage(selectedPatient)
                  }}
                  className="bg-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <ClipboardPlus size={18} />
                  Triage
                </button>

                <button
                  onClick={() => {
                    setSelectedPatient(null)
                    onHealthSummary(selectedPatient)
                  }}
                  className="bg-sky-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <FileHeart size={18} />
                  Health Summary
                </button>

              </div>

              <button
                onClick={() => {
                  setSelectedPatient(null)
                  onReferral(selectedPatient)
                }}
                className="w-full mt-3 bg-purple-600 text-white py-3 rounded-xl font-semibold"
              >
                Create Hospital Referral
              </button>

              <button
                onClick={() =>
                  window.alert(
                    `Calling ${selectedPatient.name}\n${selectedPatient.mobile}`
                  )
                }
                className="w-full mt-3 bg-green-600 text-white py-3 rounded-xl font-semibold"
              >
                Call Patient
              </button>

              <button
                onClick={() => setSelectedPatient(null)}
                className="w-full mt-3 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold"
              >
                Close
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value || 'Not Provided'}
      </p>

    </div>
  )
}

export default PatientList