import { useState } from 'react'
import {
  ArrowLeft,
  Siren,
  MapPin,
  Phone,
  Hospital,
  Ambulance,
  CheckCircle,
  Clock,
  User,
  Navigation,
  AlertTriangle
} from 'lucide-react'

function HealthWorkerEmergency({ onBack, onReferral }) {
  const [alerts, setAlerts] = useState([
    {
      id: 'SOS-2026-1001',
      patient: 'Meena',
      patientId: 'SC-2026-1043',
      age: 35,
      location: 'Madurantakam Village',
      emergency: 'Breathing Difficulty',
      time: '5 min ago',
      priority: 'Emergency',
      status: 'Active',
      phone: '+91 98765 40101'
    },
    {
      id: 'SOS-2026-1002',
      patient: 'Murugan',
      patientId: 'SC-2026-1046',
      age: 61,
      location: 'Walajabad Village',
      emergency: 'Chest Pain',
      time: '18 min ago',
      priority: 'Emergency',
      status: 'Active',
      phone: '+91 98765 40102'
    },
    {
      id: 'SOS-2026-1003',
      patient: 'Lakshmi',
      patientId: 'SC-2026-1041',
      age: 42,
      location: 'Kanchipuram Village',
      emergency: 'Medical Emergency',
      time: '32 min ago',
      priority: 'Urgent',
      status: 'Responding',
      phone: '+91 98765 40103'
    }
  ])

  const [selectedAlert, setSelectedAlert] = useState(null)

  const markResponded = id => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id
          ? { ...alert, status: 'Responded' }
          : alert
      )
    )
    alert('Emergency response marked as completed')
  }

  const callPatient = phone => {
    alert(`Calling patient: ${phone}`)
  }

  const contactAmbulance = () => {
    alert('Emergency ambulance contact initiated')
  }

  const openNavigation = location => {
    alert(`Opening emergency navigation to ${location}`)
  }

  const activeCount = alerts.filter(
    alert => alert.status === 'Active'
  ).length

  const respondingCount = alerts.filter(
    alert => alert.status === 'Responding'
  ).length

  const respondedCount = alerts.filter(
    alert => alert.status === 'Responded'
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">

      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              <ArrowLeft size={22} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Emergency Response
              </h1>
              <p className="text-sm text-gray-500">
                Health Worker Emergency Centre
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
            <Siren size={18} />
            Emergency Mode
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        <section className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Siren size={32} />
                </div>

                <h2 className="text-3xl font-bold">
                  Emergency Alerts
                </h2>
              </div>

              <p className="text-red-50 max-w-2xl">
                Monitor emergency SOS requests from patients and
                coordinate rapid healthcare response.
              </p>
            </div>

            <div className="bg-white/15 rounded-2xl px-8 py-5 text-center">
              <p className="text-sm text-red-100">
                Active Emergency Alerts
              </p>
              <p className="text-4xl font-bold mt-1">
                {activeCount}
              </p>
            </div>

          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Active Alerts
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {activeCount}
                </p>
              </div>

              <div className="bg-red-100 text-red-600 p-4 rounded-2xl">
                <Siren size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Responding
                </p>
                <p className="text-3xl font-bold text-orange-500 mt-2">
                  {respondingCount}
                </p>
              </div>

              <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                <Ambulance size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Responded
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {respondedCount}
                </p>
              </div>

              <div className="bg-green-100 text-green-600 p-4 rounded-2xl">
                <CheckCircle size={28} />
              </div>
            </div>
          </div>

        </section>

        <section className="space-y-5">

          {alerts.map(alertItem => (
            <div
              key={alertItem.id}
              className={`bg-white rounded-3xl shadow-lg border-l-8 p-6 ${
                alertItem.priority === 'Emergency'
                  ? 'border-red-500'
                  : 'border-orange-400'
              }`}
            >

              <div className="flex flex-col lg:flex-row justify-between gap-6">

                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-3 mb-4">

                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      {alertItem.priority}
                    </span>

                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      {alertItem.id}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        alertItem.status === 'Active'
                          ? 'bg-red-100 text-red-600'
                          : alertItem.status === 'Responding'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {alertItem.status}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-3 rounded-2xl">
                      <User className="text-red-600" size={26} />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {alertItem.patient}
                      </h3>

                      <p className="text-gray-500">
                        {alertItem.patientId} • Age {alertItem.age}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                    <div className="bg-red-50 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">
                        Emergency Type
                      </p>
                      <p className="font-bold text-red-700 mt-1">
                        {alertItem.emergency}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4">
                      <p className="text-xs text-gray-500">
                        Alert Location
                      </p>
                      <p className="font-bold text-blue-700 mt-1">
                        {alertItem.location}
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-5 mt-5 text-sm text-gray-500">

                    <span className="flex items-center gap-2">
                      <Clock size={17} />
                      {alertItem.time}
                    </span>

                    <span className="flex items-center gap-2">
                      <Phone size={17} />
                      {alertItem.phone}
                    </span>

                  </div>

                </div>

                <div className="lg:w-64 flex flex-col gap-3">

                  <button
                    onClick={() => setSelectedAlert(alertItem)}
                    className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <User size={18} />
                    View Patient
                  </button>

                  <button
                    onClick={() => callPatient(alertItem.phone)}
                    className="w-full bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Phone size={18} />
                    Call Patient
                  </button>

                  <button
                    onClick={contactAmbulance}
                    className="w-full bg-orange-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-orange-600 flex items-center justify-center gap-2"
                  >
                    <Ambulance size={18} />
                    Ambulance
                  </button>

                  <button
                    onClick={() =>
                      openNavigation(alertItem.location)
                    }
                    className="w-full bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <Navigation size={18} />
                    Navigate
                  </button>

                  {alertItem.status !== 'Responded' && (
                    <button
                      onClick={() => markResponded(alertItem.id)}
                      className="w-full bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold hover:bg-green-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Mark Responded
                    </button>
                  )}

                  <button
                    onClick={onReferral}
                    className="w-full bg-purple-100 text-purple-700 px-5 py-3 rounded-xl font-semibold hover:bg-purple-200 flex items-center justify-center gap-2"
                  >
                    <Hospital size={18} />
                    Create Referral
                  </button>

                </div>

              </div>

            </div>
          ))}

        </section>

        {selectedAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7">

              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-2xl">
                    <AlertTriangle
                      className="text-red-600"
                      size={25}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Emergency Patient
                    </h3>

                    <p className="text-sm text-gray-500">
                      {selectedAlert.id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>

              </div>

              <div className="space-y-3">

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Patient
                  </p>
                  <p className="font-bold">
                    {selectedAlert.patient}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Emergency
                  </p>
                  <p className="font-bold text-red-600">
                    {selectedAlert.emergency}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Location
                  </p>
                  <p className="font-bold">
                    {selectedAlert.location}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Contact
                  </p>
                  <p className="font-bold">
                    {selectedAlert.phone}
                  </p>
                </div>

              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                className="w-full mt-6 bg-gray-900 text-white py-3 rounded-xl font-semibold"
              >
                Close
              </button>

            </div>

          </div>
        )}

        <section className="mt-8 bg-red-50 border border-red-200 rounded-3xl p-6">

          <div className="flex gap-4">

            <div className="bg-red-100 p-3 rounded-2xl h-fit">
              <AlertTriangle
                className="text-red-600"
                size={25}
              />
            </div>

            <div>
              <h3 className="font-bold text-red-800 text-lg">
                Emergency Response Protocol
              </h3>

              <p className="text-red-700 text-sm mt-2">
                Verify the patient's emergency condition, contact
                the patient, coordinate ambulance support, and
                create a referral to the nearest appropriate
                healthcare facility.
              </p>
            </div>

          </div>

        </section>

      </main>

      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="font-semibold">
            SevaCare • Emergency Response Centre
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Rapid response for rural healthcare emergencies
          </p>
        </div>
      </footer>

    </div>
  )
}

export default HealthWorkerEmergency