import { useState } from 'react'
import {
  ArrowLeft,
  Siren,
  MapPin,
  Phone,
  Ambulance,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '../firebase'

function EmergencySOS({ onBack }) {
  const [emergency, setEmergency] = useState('')
  const [location, setLocation] = useState('Kanchipuram Village')
  const [sent, setSent] = useState(false)
  const [alertId, setAlertId] = useState('')
  const [loading, setLoading] = useState(false)

  const sendSOS = async () => {
    if (!emergency) {
      alert('Please select the emergency type.')
      return
    }

    if (!location.trim()) {
      alert('Please enter your current location.')
      return
    }

    const user = auth.currentUser

    if (!user) {
      alert('Please login before sending an emergency SOS.')
      return
    }

    try {
      setLoading(true)

      const id = `SOS-${Date.now()}`

      const emergencyData = {
        id: id,
        patientUid: user.uid,
        patient: 'SevaCare Patient',
        patientId: 'SC-2026-1048',
        age: 42,
        location: location.trim(),
        emergency: emergency,
        time: new Date().toLocaleString('en-IN'),
        phone: '+91 98765 43210',
        status: 'Emergency Requested',
        priority: 'High',
        source: 'Patient SOS',
        createdAt: serverTimestamp()
      }

      const docRef = await addDoc(
        collection(db, 'emergencyRequests'),
        emergencyData
      )

      await addDoc(
        collection(db, 'notifications'),
        {
          role: 'healthWorker',
          title: 'Emergency SOS Received',
          message: `${emergencyData.patient} reported ${emergency} at ${location.trim()}.`,
          type: 'Emergency',
          read: false,
          patientUid: user.uid,
          patientId: emergencyData.patientId,
          patient: emergencyData.patient,
          phone: emergencyData.phone,
          emergencyId: id,
          emergencyFirestoreId: docRef.id,
          createdAt: serverTimestamp()
        }
      )

      console.log('Emergency saved:', docRef.id)
      console.log('Health worker notification created')

      setAlertId(id)
      setSent(true)

    } catch (error) {
      console.error('Emergency SOS Firebase Error:', error)

      alert(
        `Failed to send emergency alert.\n\nError: ${error.code || 'Unknown error'}\n${error.message || 'Please try again.'}`
      )

    } finally {
      setLoading(false)
    }
  }

  const callHelp = () => {
    alert('Emergency helpline contacted.')
  }

  const callAmbulance = () => {
    alert('Ambulance request sent successfully.')
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-6">

        <div className="max-w-2xl w-full">

          <div className="bg-white rounded-3xl shadow-2xl border border-red-100 p-8 text-center">

            <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle size={52} />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mt-6">
              Emergency Alert Sent
            </h1>

            <p className="text-gray-500 mt-3">
              Your emergency request has been sent to the SevaCare
              health worker network.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mt-6 text-left">

              <div className="flex items-center gap-3">

                <Siren
                  className="text-red-600"
                  size={23}
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Emergency ID
                  </p>

                  <p className="font-bold text-red-700">
                    {alertId}
                  </p>
                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">

                <div>
                  <p className="text-xs text-gray-500">
                    Emergency
                  </p>

                  <p className="font-semibold mt-1">
                    {emergency}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="font-semibold mt-1">
                    {location}
                  </p>
                </div>

              </div>

            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">

              <button
                onClick={callHelp}
                className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Phone size={19} />
                Call Emergency Help
              </button>

              <button
                onClick={callAmbulance}
                className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Ambulance size={19} />
                Request Ambulance
              </button>

            </div>

            <button
              onClick={onBack}
              className="mt-5 text-gray-600 hover:text-red-600 font-semibold flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">

      <header className="bg-white border-b border-red-100 shadow-sm">

        <div className="max-w-6xl mx-auto px-6 py-4">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

        </div>

      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">

        <section className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl text-center">

          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Siren size={40} />
          </div>

          <h1 className="text-3xl font-bold mt-5">
            Emergency SOS
          </h1>

          <p className="text-red-100 mt-2">
            Send an immediate emergency alert to the SevaCare
            health worker network.
          </p>

        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-red-100 p-7 mt-7">

          <div className="flex items-center gap-3">

            <AlertTriangle
              className="text-red-600"
              size={24}
            />

            <h2 className="text-xl font-bold text-gray-800">
              Emergency Details
            </h2>

          </div>

          <label className="block text-sm font-semibold text-gray-600 mt-6">
            Emergency Type
          </label>

          <select
            value={emergency}
            onChange={(e) => setEmergency(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 mt-2 outline-none focus:ring-2 focus:ring-red-300"
          >
            <option value="">
              Select Emergency
            </option>

            <option value="Breathing Difficulty">
              Breathing Difficulty
            </option>

            <option value="Chest Pain">
              Chest Pain
            </option>

            <option value="Accident">
              Accident
            </option>

            <option value="Severe Bleeding">
              Severe Bleeding
            </option>

            <option value="Unconsciousness">
              Unconsciousness
            </option>

            <option value="Other Emergency">
              Other Emergency
            </option>
          </select>

          <label className="block text-sm font-semibold text-gray-600 mt-6">
            Current Location
          </label>

          <div className="flex items-center border border-gray-200 rounded-xl mt-2">

            <MapPin
              className="ml-3 text-red-500"
              size={20}
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-3 outline-none"
              placeholder="Enter your location"
            />

          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mt-6">

            <p className="text-sm text-red-700">
              <strong>Important:</strong> For a real medical emergency,
              also contact your local emergency service immediately.
            </p>

          </div>

          <button
            onClick={sendSOS}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-4 rounded-2xl font-bold text-lg mt-6 flex items-center justify-center gap-3 shadow-lg"
          >

            <Siren size={24} />

            {loading
              ? 'SENDING SOS...'
              : 'SEND EMERGENCY SOS'
            }

          </button>

        </section>

      </main>

    </div>
  )
}

export default EmergencySOS