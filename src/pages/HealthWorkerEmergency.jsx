import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Siren,
  Phone,
  Hospital,
  Ambulance,
  CheckCircle,
  Clock,
  User,
  Navigation,
  AlertTriangle
} from 'lucide-react'

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  addDoc
} from 'firebase/firestore'

import { db } from '../firebase'

function HealthWorkerEmergency({ onBack, onReferral }) {
  const [alerts, setAlerts] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'emergencyRequests'),
      snapshot => {
        const emergencyList = snapshot.docs.map(docItem => {
          const data = docItem.data()

          return {
            firestoreId: docItem.id,
            id: data.id || `SOS-${docItem.id}`,
            patientUid: data.patientUid || '',
            patient: data.patient || 'Unknown Patient',
            patientId: data.patientId || '',
            age: data.age || '',
            location: data.location || 'Location unavailable',
            emergency: data.emergency || 'Medical Emergency',
            time: data.time || 'Recently',
            priority: data.priority || 'High',
            status: data.status || 'Emergency Requested',
            phone: data.phone || '',
            source: data.source || 'Patient SOS',
            createdAt: data.createdAt
          }
        })

        emergencyList.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0
          const timeB = b.createdAt?.seconds || 0

          return timeB - timeA
        })

        setAlerts(emergencyList)
        setLoading(false)
      },
      error => {
        console.error(
          'Error loading emergency requests:',
          error
        )

        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Update emergency status + notify patient
  const updateEmergencyStatus = async (
    alertItem,
    newStatus
  ) => {
    try {
      await updateDoc(
        doc(
          db,
          'emergencyRequests',
          alertItem.firestoreId
        ),
        {
          status: newStatus,
          updatedAt: serverTimestamp()
        }
      )

      // Send notification to the patient
      if (alertItem.patientUid) {
        await addDoc(
          collection(db, 'notifications'),
          {
            userId: alertItem.patientUid,
            title: 'Emergency Status Updated',
            message: `Your emergency request is now "${newStatus}".`,
            type: 'Emergency',
            read: false,
            emergencyId: alertItem.id,
            emergencyFirestoreId: alertItem.firestoreId,
            patientId: alertItem.patientId,
            status: newStatus,
            createdAt: serverTimestamp()
          }
        )

        console.log(
          'Patient notification created successfully'
        )
      } else {
        console.warn(
          'Patient UID not found. Patient notification was not created.'
        )
      }

      alert(
        `Emergency status updated to "${newStatus}"`
      )
    } catch (error) {
      console.error(
        'Error updating emergency status:',
        error
      )

      alert(
        `Failed to update emergency status.\n\n${error.message}`
      )
    }
  }

  const moveToNextStage = async alertItem => {
    const statusFlow = [
      'Emergency Requested',
      'Worker Responding',
      'Ambulance Dispatched',
      'Hospital Notified',
      'Patient Reached'
    ]

    const currentIndex =
      statusFlow.indexOf(alertItem.status)

    if (currentIndex === -1) {
      await updateEmergencyStatus(
        alertItem,
        'Worker Responding'
      )
      return
    }

    if (currentIndex >= statusFlow.length - 1) {
      alert(
        'Emergency response journey is already completed.'
      )
      return
    }

    const nextStatus =
      statusFlow[currentIndex + 1]

    await updateEmergencyStatus(
      alertItem,
      nextStatus
    )
  }

  const callPatient = phone => {
    alert(`Calling patient: ${phone}`)
  }

  const contactAmbulance = async alertItem => {
    await updateEmergencyStatus(
      alertItem,
      'Ambulance Dispatched'
    )

    alert(
      'Ambulance request has been sent successfully.'
    )
  }

  const openNavigation = location => {
    alert(
      `Opening emergency navigation to ${location}`
    )
  }

  const createReferral = alertItem => {
    const patient = {
      id: alertItem.patientId,
      name: alertItem.patient,
      age: alertItem.age,
      village: alertItem.location,
      mobile: alertItem.phone,
      patientUid: alertItem.patientUid
    }

    if (onReferral) {
      onReferral(patient)
    }
  }

  const getStatusColor = status => {
    if (status === 'Emergency Requested') {
      return 'bg-red-100 text-red-600'
    }

    if (status === 'Worker Responding') {
      return 'bg-orange-100 text-orange-600'
    }

    if (status === 'Ambulance Dispatched') {
      return 'bg-blue-100 text-blue-600'
    }

    if (status === 'Hospital Notified') {
      return 'bg-purple-100 text-purple-600'
    }

    if (status === 'Patient Reached') {
      return 'bg-green-100 text-green-600'
    }

    return 'bg-gray-100 text-gray-600'
  }

  const activeCount = alerts.filter(
    alertItem =>
      alertItem.status !== 'Patient Reached'
  ).length

  const respondingCount = alerts.filter(
    alertItem =>
      alertItem.status === 'Worker Responding' ||
      alertItem.status === 'Ambulance Dispatched'
  ).length

  const respondedCount = alerts.filter(
    alertItem =>
      alertItem.status === 'Patient Reached'
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

        <section className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl mb-8">

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
                Monitor emergency SOS requests from patients
                and coordinate rapid healthcare response.
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

        {loading ? (

          <section className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <Clock
              size={35}
              className="mx-auto text-blue-600 animate-spin"
            />

            <p className="text-gray-600 mt-4">
              Loading emergency alerts...
            </p>

          </section>

        ) : alerts.length === 0 ? (

          <section className="bg-white rounded-3xl shadow-lg p-10 text-center">

            <CheckCircle
              size={45}
              className="mx-auto text-green-500"
            />

            <h3 className="text-xl font-bold text-gray-800 mt-4">
              No Emergency Alerts
            </h3>

            <p className="text-gray-500 mt-2">
              New patient SOS requests will appear here.
            </p>

          </section>

        ) : (

          <section className="space-y-5">

            {alerts.map(alertItem => (

              <div
                key={alertItem.firestoreId}
                className={`bg-white rounded-3xl shadow-lg border-l-8 p-6 ${
                  alertItem.priority === 'High' ||
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
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          alertItem.status
                        )}`}
                      >
                        {alertItem.status}
                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <div className="bg-red-50 p-3 rounded-2xl">
                        <User
                          className="text-red-600"
                          size={26}
                        />
                      </div>

                      <div>

                        <h3 className="text-2xl font-bold text-gray-800">
                          {alertItem.patient}
                        </h3>

                        <p className="text-gray-500">
                          {alertItem.patientId} • Age{' '}
                          {alertItem.age}
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
                      onClick={() =>
                        setSelectedAlert(alertItem)
                      }
                      className="w-full bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <User size={18} />
                      View Patient
                    </button>

                    <button
                      onClick={() =>
                        callPatient(alertItem.phone)
                      }
                      className="w-full bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <Phone size={18} />
                      Call Patient
                    </button>

                    <button
                      onClick={() =>
                        contactAmbulance(alertItem)
                      }
                      className="w-full bg-orange-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-orange-600 flex items-center justify-center gap-2"
                    >
                      <Ambulance size={18} />
                      Ambulance
                    </button>

                    <button
                      onClick={() =>
                        openNavigation(
                          alertItem.location
                        )
                      }
                      className="w-full bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                      <Navigation size={18} />
                      Navigate
                    </button>

                    {alertItem.status !==
                      'Patient Reached' && (

                      <button
                        onClick={() =>
                          moveToNextStage(alertItem)
                        }
                        className="w-full bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold hover:bg-green-200 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />

                        {alertItem.status ===
                        'Emergency Requested'
                          ? 'Start Response'
                          : alertItem.status ===
                            'Worker Responding'
                          ? 'Dispatch Ambulance'
                          : alertItem.status ===
                            'Ambulance Dispatched'
                          ? 'Notify Hospital'
                          : 'Mark Patient Reached'}
                      </button>

                    )}

                    <button
                      onClick={() =>
                        createReferral(alertItem)
                      }
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

        )}

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
                  onClick={() =>
                    setSelectedAlert(null)
                  }
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

                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    Current Status
                  </p>

                  <p className="font-bold text-red-600">
                    {selectedAlert.status}
                  </p>
                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedAlert(null)
                }
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
                Verify the patient's emergency condition,
                contact the patient, coordinate ambulance
                support, and create a referral to the nearest
                appropriate healthcare facility.
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
            Firebase-connected emergency response system
          </p>

        </div>

      </footer>

    </div>
  )
}

export default HealthWorkerEmergency