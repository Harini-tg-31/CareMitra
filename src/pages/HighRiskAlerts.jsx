import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  AlertTriangle,
  Phone,
  Hospital,
  CheckCircle,
  Eye,
  Siren,
  RefreshCw
} from 'lucide-react'

function HighRiskAlerts({ onBack, onReferral }) {
  const defaultAlerts = [
    {
      id: 'RISK-1001',
      patientId: 'SC-2026-1043',
      patient: 'Meena',
      age: 35,
      village: 'Madurantakam Village',
      mobile: '+91 98765 40103',
      reason: 'Breathing Difficulty',
      oxygen: 89,
      status: 'Pending Review',
      date: '11 Sep 2026'
    },
    {
      id: 'RISK-1002',
      patientId: 'SC-2026-1046',
      patient: 'Murugan',
      age: 61,
      village: 'Walajabad Village',
      mobile: '+91 98765 40106',
      reason: 'Chest Pain',
      oxygen: 91,
      status: 'Pending Review',
      date: '11 Sep 2026'
    },
    {
      id: 'RISK-1003',
      patientId: 'SC-2026-1042',
      patient: 'Kumar',
      age: 58,
      village: 'Chengalpattu Village',
      mobile: '+91 98765 40102',
      reason: 'High Fever',
      oxygen: 94,
      status: 'Reviewed',
      date: '10 Sep 2026'
    }
  ]

  const [alerts, setAlerts] = useState(defaultAlerts)
  const [selectedAlert, setSelectedAlert] = useState(null)

  const loadAlerts = () => {
    const saved = JSON.parse(
      localStorage.getItem('sevacareHighRiskAlerts') || '[]'
    )

    const combined = [...saved, ...defaultAlerts]

    const unique = combined.filter(
      (alert, index, array) =>
        index ===
        array.findIndex(
          (item) => item.id === alert.id
        )
    )

    setAlerts(unique)
  }

  useEffect(() => {
    loadAlerts()

    const interval = setInterval(
      loadAlerts,
      2000
    )

    return () => clearInterval(interval)
  }, [])

  const saveAlerts = (updated) => {
    localStorage.setItem(
      'sevacareHighRiskAlerts',
      JSON.stringify(updated)
    )
  }

  const updateStatus = (id, status) => {
    const updated = alerts.map((alert) =>
      alert.id === id
        ? { ...alert, status }
        : alert
    )

    setAlerts(updated)
    saveAlerts(updated)

    if (
      selectedAlert &&
      selectedAlert.id === id
    ) {
      setSelectedAlert({
        ...selectedAlert,
        status
      })
    }
  }

  const callPatient = (alert) => {
    window.alert(
      `Calling ${alert.patient}\n${alert.mobile}`
    )
  }

  const createReferral = (alert) => {
    const patient = {
      id: alert.patientId,
      name: alert.patient,
      age: alert.age,
      village: alert.village,
      mobile: alert.mobile
    }

    updateStatus(
      alert.id,
      'Referral Created'
    )

    onReferral(patient)
  }

  const stats = {
    emergency: alerts.filter(
      (alert) =>
        alert.reason
          ?.toLowerCase()
          .includes('chest') ||
        alert.reason
          ?.toLowerCase()
          .includes('breathing')
    ).length,

    pending: alerts.filter(
      (alert) =>
        alert.status === 'Pending Review'
    ).length,

    reviewed: alerts.filter(
      (alert) =>
        alert.status === 'Reviewed' ||
        alert.status === 'Referral Created'
    ).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
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

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <AlertTriangle size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                High-Risk Alerts
              </h1>

              <p className="text-red-100 mt-2">
                Patients requiring immediate health worker attention.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-7">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
            <div className="flex items-center justify-between">
              <p className="text-gray-500">
                Emergency Risk
              </p>

              <Siren className="text-red-600" />
            </div>

            <p className="text-3xl font-bold text-red-600 mt-3">
              {stats.emergency}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-yellow-100">
            <div className="flex items-center justify-between">
              <p className="text-gray-500">
                Pending Review
              </p>

              <AlertTriangle className="text-yellow-600" />
            </div>

            <p className="text-3xl font-bold text-yellow-600 mt-3">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <p className="text-gray-500">
                Reviewed
              </p>

              <CheckCircle className="text-green-600" />
            </div>

            <p className="text-3xl font-bold text-green-600 mt-3">
              {stats.reviewed}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-red-100 shadow-sm p-7 mt-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Patients Needing Attention
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Alerts generated from triage and health monitoring.
              </p>
            </div>

            <button
              onClick={loadAlerts}
              className="bg-gray-100 p-3 rounded-xl"
            >
              <RefreshCw size={19} />
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-2xl p-5 ${
                  alert.status === 'Pending Review'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 text-red-600 p-3 rounded-xl">
                      <AlertTriangle size={24} />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg text-gray-800">
                          {alert.patient}
                        </h3>

                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {alert.patientId}
                        </span>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            alert.status === 'Pending Review'
                              ? 'bg-red-100 text-red-700'
                              : alert.status === 'Referral Created'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mt-2">
                        {alert.reason}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                        <span>
                          Age: {alert.age}
                        </span>

                        <span>
                          Village: {alert.village}
                        </span>

                        <span>
                          Oxygen: {alert.oxygen}%
                        </span>

                        <span>
                          {alert.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setSelectedAlert(alert)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold"
                    >
                      <Eye size={17} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        callPatient(alert)
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold"
                    >
                      <Phone size={17} />
                      Call
                    </button>

                    <button
                      onClick={() =>
                        createReferral(alert)
                      }
                      className="bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold"
                    >
                      <Hospital size={17} />
                      Referral
                    </button>

                    {alert.status === 'Pending Review' && (
                      <button
                        onClick={() =>
                          updateStatus(
                            alert.id,
                            'Reviewed'
                          )
                        }
                        className="bg-gray-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold"
                      >
                        <CheckCircle size={17} />
                        Reviewed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-red-50 border border-red-200 rounded-3xl p-6 mt-7">
          <div className="flex items-start gap-3">
            <Siren
              className="text-red-600 mt-1"
              size={24}
            />

            <div>
              <h2 className="font-bold text-red-800 text-lg">
                Automated Risk Detection
              </h2>

              <p className="text-sm text-red-700 mt-2">
                High-risk patients identified through triage are
                automatically added here and can be moved directly
                into emergency response or hospital referral.
              </p>
            </div>
          </div>
        </section>
      </main>

      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Patient Risk Details
              </h2>

              <button
                onClick={() =>
                  setSelectedAlert(null)
                }
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-red-50 rounded-2xl p-5 mt-5">
              <h3 className="font-bold text-red-700 text-xl">
                {selectedAlert.patient}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {selectedAlert.patientId}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Age
                </p>

                <p className="font-bold mt-1">
                  {selectedAlert.age}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  Oxygen
                </p>

                <p className="font-bold mt-1">
                  {selectedAlert.oxygen}%
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 col-span-2">
                <p className="text-xs text-gray-500">
                  Risk Reason
                </p>

                <p className="font-bold mt-1">
                  {selectedAlert.reason}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  callPatient(selectedAlert)
                }
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold"
              >
                Call Patient
              </button>

              <button
                onClick={() => {
                  setSelectedAlert(null)
                  createReferral(selectedAlert)
                }}
                className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-semibold"
              >
                Create Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HighRiskAlerts