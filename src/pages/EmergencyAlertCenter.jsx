import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  AlertTriangle,
  Phone,
  Ambulance,
  Navigation,
  Activity,
  CheckCircle,
  Clock,
  User,
  MapPin,
  Hospital,
  Radio
} from 'lucide-react'

function EmergencyAlertCenter({
  onBack,
  onEmergency,
  onTracking,
  onReferral
}) {
  const defaultAlerts = [
    {
      id: 'SOS-1001',
      patient: 'Meena',
      patientId: 'SC-2026-1043',
      age: 35,
      location: 'Madurantakam Village',
      emergency: 'Breathing Difficulty',
      time: '10 Sep 2026, 09:45 AM',
      phone: '+91 98765 40103',
      status: 'New',
      source: 'Patient SOS'
    },
    {
      id: 'SOS-1002',
      patient: 'Murugan',
      patientId: 'SC-2026-1046',
      age: 61,
      location: 'Walajabad Village',
      emergency: 'Chest Pain',
      time: '10 Sep 2026, 08:20 AM',
      phone: '+91 98765 40106',
      status: 'Worker Responding',
      source: 'Health Worker Triage'
    }
  ]

  const [alerts, setAlerts] =
    useState(defaultAlerts)
  const [selected, setSelected] =
    useState(null)

  const loadAlerts = () => {
    const saved = JSON.parse(
      localStorage.getItem(
        'sevacareEmergencyAlerts'
      ) || '[]'
    )

    const combined = [
      ...saved,
      ...defaultAlerts
    ]

    const unique = combined.filter(
      (item, index, array) =>
        array.findIndex(
          (x) => x.id === item.id
        ) === index
    )

    setAlerts(unique)
  }

  useEffect(() => {
    loadAlerts()

    const timer = setInterval(
      loadAlerts,
      2000
    )

    return () => clearInterval(timer)
  }, [])

  const activeAlerts = alerts.filter(
    (item) =>
      item.status !== 'Handled'
  )

  const newAlerts = alerts.filter(
    (item) => item.status === 'New'
  )

  const responding = alerts.filter(
    (item) =>
      item.status ===
        'Worker Responding' ||
      item.status ===
        'Ambulance Dispatched' ||
      item.status ===
        'Hospital Notified'
  )

  const handled = alerts.filter(
    (item) => item.status === 'Handled'
  )

  const updateStatus = (
    id,
    status
  ) => {
    const updated = alerts.map(
      (item) =>
        item.id === id
          ? {
              ...item,
              status
            }
          : item
    )

    setAlerts(updated)

    const saved = JSON.parse(
      localStorage.getItem(
        'sevacareEmergencyAlerts'
      ) || '[]'
    )

    const exists = saved.find(
      (item) => item.id === id
    )

    if (exists) {
      const updatedSaved = saved.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                status
              }
            : item
      )

      localStorage.setItem(
        'sevacareEmergencyAlerts',
        JSON.stringify(updatedSaved)
      )
    }

    if (status === 'Handled') {
      alert(
        'Emergency response marked as handled.'
      )
    }
  }

  const callPatient = (
    alert
  ) => {
    alert =
      alert

    window.alert(
      `Calling ${alert.patient}\n${alert.phone}`
    )
  }

  const sendAmbulance = (
    alert
  ) => {
    updateStatus(
      alert.id,
      'Ambulance Dispatched'
    )

    window.alert(
      `Ambulance dispatched for ${alert.patient}.`
    )
  }

  const navigateToPatient = (
    alert
  ) => {
    window.alert(
      `Navigation started to ${alert.location}.`
    )
  }

  const openDetails = (
    alert
  ) => {
    setSelected(alert)
  }

  const createReferral = (
    alert
  ) => {
    const patient = {
      id: alert.patientId,
      name: alert.patient,
      age: alert.age,
      village: alert.location,
      mobile: alert.phone
    }

    onReferral(patient)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      <header className="bg-white border-b border-red-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
            <Radio size={17} />
            LIVE EMERGENCY CENTRE
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-red-700 to-orange-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <AlertTriangle size={38} />

                <h1 className="text-3xl font-bold">
                  Emergency Alert Centre
                </h1>
              </div>

              <p className="mt-3 text-red-100 max-w-2xl">
                Monitor patient SOS alerts, coordinate emergency
                response and connect patients with hospitals.
              </p>
            </div>

            <button
              onClick={onEmergency}
              className="bg-white text-red-700 px-6 py-3 rounded-xl font-bold"
            >
              Emergency Response
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-5 mt-7">
          <div className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
            <AlertTriangle
              className="text-red-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              New Alerts
            </p>

            <p className="text-3xl font-bold text-red-700">
              {newAlerts.length}
            </p>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
            <Activity
              className="text-orange-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Responding
            </p>

            <p className="text-3xl font-bold text-orange-700">
              {responding.length}
            </p>
          </div>

          <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">
            <CheckCircle
              className="text-green-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Handled
            </p>

            <p className="text-3xl font-bold text-green-700">
              {handled.length}
            </p>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
            <Clock
              className="text-blue-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Active Alerts
            </p>

            <p className="text-3xl font-bold text-blue-700">
              {activeAlerts.length}
            </p>
          </div>
        </section>

        {newAlerts.length > 0 && (
          <section className="bg-red-50 border border-red-200 rounded-2xl p-5 mt-7">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className="text-red-600 animate-pulse"
                size={25}
              />

              <div>
                <h2 className="font-bold text-red-800">
                  New Emergency Alert Received
                </h2>

                <p className="text-sm text-red-700 mt-1">
                  Immediate attention is required for the latest patient SOS.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Emergency Requests
              </h2>

              <p className="text-gray-500">
                Live patient emergency requests
              </p>
            </div>

            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Monitoring
            </div>
          </div>

          <div className="space-y-5">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-3xl border shadow-sm p-6 ${
                  alert.status === 'New'
                    ? 'border-red-300'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-4 rounded-2xl ${
                        alert.status === 'New'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      <AlertTriangle size={28} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {alert.patient}
                        </h3>

                        <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          {alert.id}
                        </span>
                      </div>

                      <p className="font-semibold text-red-700 mt-2">
                        {alert.emergency}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                        <span className="flex items-center gap-1">
                          <User size={15} />
                          {alert.patientId}
                        </span>

                        <span>
                          Age {alert.age}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPin size={15} />
                          {alert.location}
                        </span>

                        <span>
                          {alert.time}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        Source: {alert.source}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold ${
                      alert.status === 'New'
                        ? 'bg-red-100 text-red-700'
                        : alert.status === 'Handled'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
                  <button
                    onClick={() =>
                      openDetails(alert)
                    }
                    className="bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <User size={17} />
                    View Details
                  </button>

                  <button
                    onClick={() =>
                      callPatient(alert)
                    }
                    className="bg-green-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Phone size={17} />
                    Call
                  </button>

                  <button
                    onClick={() =>
                      sendAmbulance(alert)
                    }
                    className="bg-red-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Ambulance size={17} />
                    Ambulance
                  </button>

                  <button
                    onClick={() =>
                      onTracking(alert)
                    }
                    className="bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Activity size={17} />
                    Track Response
                  </button>

                  <button
                    onClick={() =>
                      createReferral(alert)
                    }
                    className="bg-orange-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Hospital size={17} />
                    Hospital Referral
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 mt-3">
                  <button
                    onClick={() =>
                      navigateToPatient(alert)
                    }
                    className="border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Navigation size={15} />
                    Navigate to Patient
                  </button>

                  {alert.status !==
                    'Handled' && (
                    <button
                      onClick={() =>
                        updateStatus(
                          alert.id,
                          'Handled'
                        )
                      }
                      className="border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                    >
                      <CheckCircle size={15} />
                      Mark Handled
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-7 mt-8">
          <h2 className="text-xl font-bold text-gray-800">
            Rapid Response Protocol
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mt-5">
            <Protocol
              number="1"
              title="Receive SOS"
              text="Verify emergency alert."
            />

            <Protocol
              number="2"
              title="Contact Patient"
              text="Call and confirm location."
            />

            <Protocol
              number="3"
              title="Dispatch"
              text="Send ambulance or worker."
            />

            <Protocol
              number="4"
              title="Hospital"
              text="Notify referral facility."
            />
          </div>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Emergency Details
              </h2>

              <button
                onClick={() =>
                  setSelected(null)
                }
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="bg-red-50 rounded-2xl p-5 mt-5">
              <p className="font-bold text-red-700 text-lg">
                {selected.emergency}
              </p>

              <p className="text-gray-700 mt-2">
                Patient: {selected.patient}
              </p>

              <p className="text-gray-700">
                Patient ID: {selected.patientId}
              </p>

              <p className="text-gray-700">
                Age: {selected.age}
              </p>

              <p className="text-gray-700">
                Location: {selected.location}
              </p>

              <p className="text-gray-700">
                Phone: {selected.phone}
              </p>

              <p className="text-gray-700">
                Time: {selected.time}
              </p>

              <p className="text-gray-700">
                Status: {selected.status}
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() =>
                  callPatient(selected)
                }
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold"
              >
                Call Patient
              </button>

              <button
                onClick={() => {
                  setSelected(null)
                  onTracking(selected)
                }}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold"
              >
                Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Protocol({
  number,
  title,
  text
}) {
  return (
    <div className="bg-blue-50 rounded-2xl p-5">
      <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
        {number}
      </div>

      <h3 className="font-bold text-gray-800 mt-4">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {text}
      </p>
    </div>
  )
}

export default EmergencyAlertCenter