import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Hospital,
  UserRound,
  CheckCircle,
  FileText,
  CalendarClock
} from 'lucide-react'
import {
  collection,
  doc,
  setDoc,
  getDocs
} from 'firebase/firestore'
import { db } from '../firebase'

function HealthWorkerReferrals({ onBack, prefillPatient }) {
  const defaultPatients = [
    {
      id: 'SC-2026-1041',
      name: 'Lakshmi',
      age: 42,
      village: 'Kanchipuram Village',
      mobile: '+91 98765 40101'
    },
    {
      id: 'SC-2026-1042',
      name: 'Kumar',
      age: 58,
      village: 'Chengalpattu Village',
      mobile: '+91 98765 40102'
    },
    {
      id: 'SC-2026-1043',
      name: 'Meena',
      age: 35,
      village: 'Madurantakam Village',
      mobile: '+91 98765 40103'
    },
    {
      id: 'SC-2026-1046',
      name: 'Murugan',
      age: 61,
      village: 'Walajabad Village',
      mobile: '+91 98765 40106'
    }
  ]

  const [patients, setPatients] = useState(defaultPatients)
  const [selectedPatient, setSelectedPatient] = useState('')
  const [hospital, setHospital] = useState('')
  const [reason, setReason] = useState('')
  const [priority, setPriority] = useState('High')
  const [transport, setTransport] = useState('Government Ambulance')
  const [notes, setNotes] = useState('')
  const [success, setSuccess] = useState(false)
  const [referralId, setReferralId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const savedPatients = JSON.parse(
          localStorage.getItem('sevacarePatients') || '[]'
        )

        const combined = [
          ...savedPatients,
          ...defaultPatients
        ]

        const unique = combined.filter(
          (patient, index, array) =>
            index ===
            array.findIndex(
              item => item.id === patient.id
            )
        )

        setPatients(unique)

        if (prefillPatient) {
          const match = unique.find(
            patient => patient.id === prefillPatient.id
          )

          if (match) {
            setSelectedPatient(match.id)
          }
        }
      } catch (error) {
        console.error('Patient loading error:', error)
      }
    }

    loadPatients()
  }, [prefillPatient])

  const createFollowUp = referral => {
    const followUps = JSON.parse(
      localStorage.getItem('sevacareFollowUps') || '[]'
    )

    const followUp = {
      id: `FOLLOW-${Date.now()}`,
      patientId: referral.patientId,
      patient: referral.patientName,
      age: referral.patientAge,
      village: referral.patientVillage,
      mobile: referral.patientMobile,
      type: 'Referral Follow-up',
      title: 'Hospital Referral Follow-up',
      description: `Follow up after referral to ${referral.hospital}.`,
      date: 'After hospital visit',
      status: 'Pending',
      referralId: referral.id,
      createdAt: new Date().toLocaleString('en-IN')
    }

    localStorage.setItem(
      'sevacareFollowUps',
      JSON.stringify([
        followUp,
        ...followUps
      ])
    )
  }

  const submitReferral = async () => {
    if (!selectedPatient) {
      alert('Please select a patient.')
      return
    }

    if (!hospital || !reason) {
      alert('Please enter hospital and referral reason.')
      return
    }

    const patient = patients.find(
      item => item.id === selectedPatient
    )

    if (!patient) {
      alert('Patient not found.')
      return
    }

    setSaving(true)

    try {
      const id = `REF-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`

      const referral = {
        id,
        patientId: patient.id,
        patientName: patient.name,
        patientAge: patient.age,
        patientVillage: patient.village,
        patientMobile: patient.mobile,
        hospital,
        reason,
        priority,
        transport,
        notes,
        status: 'Hospital Review',
        date: new Date().toLocaleDateString('en-IN'),
        createdAt: new Date().toISOString()
      }

      await setDoc(
        doc(db, 'referrals', id),
        referral
      )

      createFollowUp(referral)

      setReferralId(id)
      setSuccess(true)

      alert('Referral saved successfully to Firebase.')
    } catch (error) {
      console.error('Referral Firebase error:', error)

      alert(
        'Failed to save referral to Firebase.\n\n' +
        error.message
      )
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setSelectedPatient('')
    setHospital('')
    setReason('')
    setPriority('High')
    setTransport('Government Ambulance')
    setNotes('')
    setSuccess(false)
    setReferralId('')
  }

  if (success) {
    const registeredPatient = patients.find(
      patient => patient.id === selectedPatient
    )

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-green-100 p-8 text-center">

          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={45} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mt-5">
            Referral Created Successfully
          </h1>

          <p className="text-gray-500 mt-2">
            The referral has been saved to Firebase.
          </p>

          <div className="bg-blue-50 rounded-2xl p-5 mt-6 text-left">

            <p className="text-xs text-gray-500">
              Referral ID
            </p>

            <p className="text-xl font-bold text-blue-700 mt-1">
              {referralId}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">

              <div>
                <p className="text-xs text-gray-500">
                  Patient
                </p>

                <p className="font-semibold mt-1">
                  {registeredPatient?.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Hospital
                </p>

                <p className="font-semibold mt-1">
                  {hospital}
                </p>
              </div>

            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mt-5 text-left">
            <div className="flex items-start gap-3">

              <CalendarClock
                className="text-green-600 mt-1"
                size={22}
              />

              <div>
                <h3 className="font-bold text-green-800">
                  Referral Saved Successfully
                </h3>

                <p className="text-sm text-green-700 mt-1">
                  This referral can now be tracked from the Referral Tracking page.
                </p>
              </div>

            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mt-6">

            <button
              onClick={resetForm}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Create Another Referral
            </button>

            <button
              onClick={onBack}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>

          </div>
        </div>
      </div>
    )
  }

  const currentPatient = patients.find(
    patient => patient.id === selectedPatient
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">

      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">

          <div className="flex items-center gap-4">

            <div className="bg-white/20 p-4 rounded-2xl">
              <Hospital size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Create Hospital Referral
              </h1>

              <p className="text-blue-100 mt-2">
                Connect the patient with the appropriate healthcare facility.
              </p>
            </div>

          </div>
        </section>

        {prefillPatient && currentPatient && (
          <section className="bg-green-50 border border-green-200 rounded-2xl p-5 mt-7">

            <div className="flex items-start gap-3">

              <CheckCircle
                className="text-green-600 mt-1"
                size={23}
              />

              <div>
                <h3 className="font-bold text-green-800">
                  Patient Details Automatically Loaded
                </h3>

                <p className="text-sm text-green-700 mt-1">
                  Referral was initiated from another SevaCare workflow.
                </p>
              </div>

            </div>
          </section>
        )}

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-7 mt-7">

          <div className="flex items-center gap-3">

            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <UserRound size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Patient Details
              </h2>

              <p className="text-sm text-gray-500">
                Select the patient requiring referral.
              </p>
            </div>

          </div>

          <select
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-5 outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">
              Select Patient
            </option>

            {patients.map(patient => (
              <option
                key={patient.id}
                value={patient.id}
              >
                {patient.name} - {patient.id}
              </option>
            ))}
          </select>

          {currentPatient && (
            <div className="grid md:grid-cols-3 gap-4 bg-blue-50 rounded-2xl p-5 mt-5">

              <div>
                <p className="text-xs text-gray-500">
                  Name
                </p>
                <p className="font-bold mt-1">
                  {currentPatient.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Age
                </p>
                <p className="font-bold mt-1">
                  {currentPatient.age}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Village
                </p>
                <p className="font-bold mt-1">
                  {currentPatient.village}
                </p>
              </div>

            </div>
          )}

        </section>

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-7 mt-6">

          <h2 className="text-xl font-bold text-gray-800">
            Referral Details
          </h2>

          <div className="mt-5">

            <label className="text-sm font-semibold text-gray-600">
              Hospital / Facility
            </label>

            <input
              value={hospital}
              onChange={e => setHospital(e.target.value)}
              placeholder="Government District Hospital"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-300"
            />

          </div>

          <div className="mt-5">

            <label className="text-sm font-semibold text-gray-600">
              Reason for Referral
            </label>

            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Specialist consultation required"
              rows="3"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-300"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-5">

            <div>

              <label className="text-sm font-semibold text-gray-600">
                Priority
              </label>

              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

            </div>

            <div>

              <label className="text-sm font-semibold text-gray-600">
                Transport
              </label>

              <select
                value={transport}
                onChange={e => setTransport(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2"
              >
                <option>Government Ambulance</option>
                <option>Government Bus</option>
                <option>Shared Vehicle</option>
                <option>Own Transport</option>
              </select>

            </div>

          </div>

          <div className="mt-5">

            <label className="text-sm font-semibold text-gray-600">
              Additional Notes
            </label>

            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add additional clinical or travel information"
              rows="3"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-blue-300"
            />

          </div>

          <button
            onClick={submitReferral}
            disabled={saving}
            className="w-full bg-blue-600 disabled:bg-blue-300 text-white py-4 rounded-xl font-bold mt-6 flex items-center justify-center gap-2"
          >
            <FileText size={20} />

            {saving
              ? 'Saving to Firebase...'
              : 'Create Referral'}
          </button>

        </section>

        <section className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mt-6">

          <div className="flex items-start gap-3">

            <CalendarClock
              className="text-orange-600 mt-1"
              size={23}
            />

            <div>
              <h3 className="font-bold text-orange-800">
                Firebase Referral Tracking
              </h3>

              <p className="text-sm text-orange-700 mt-1">
                Referral information is stored in the Firebase referrals collection and can be tracked later.
              </p>
            </div>

          </div>

        </section>

      </main>
    </div>
  )
}

export default HealthWorkerReferrals