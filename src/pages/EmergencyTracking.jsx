import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Siren,
  UserRound,
  Phone,
  Ambulance,
  Navigation,
  Hospital,
  CheckCircle,
  Clock,
  ArrowRight,
  RotateCcw
} from 'lucide-react'

import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'

import { db } from '../firebase'

function EmergencyTracking({ emergency, onBack, onReferral }) {

  const defaultEmergency = {
    firestoreId: '',
    id: 'SOS-1001',
    patient: 'Meena',
    patientId: 'SC-2026-1043',
    age: 35,
    location: 'Madurantakam Village',
    emergency: 'Breathing Difficulty',
    time: '11 Sep 2026, 10:00 AM',
    phone: '+91 98765 40103',
    status: 'Emergency Requested'
  }

  const [currentEmergency, setCurrentEmergency] =
    useState(emergency || defaultEmergency)

  const [loading, setLoading] = useState(false)

  const stages = [
    {
      title: 'Alert Sent',
      description: 'Emergency request received',
      icon: Siren
    },
    {
      title: 'Worker Responding',
      description: 'Health worker is responding',
      icon: UserRound
    },
    {
      title: 'Ambulance Dispatched',
      description: 'Emergency transport dispatched',
      icon: Ambulance
    },
    {
      title: 'Hospital Notified',
      description: 'Hospital has been notified',
      icon: Hospital
    },
    {
      title: 'Patient Reached',
      description: 'Patient reached the facility',
      icon: CheckCircle
    }
  ]

  const getStage = status => {

    if (status === 'Worker Responding') {
      return 1
    }

    if (status === 'Ambulance Dispatched') {
      return 2
    }

    if (status === 'Hospital Notified') {
      return 3
    }

    if (status === 'Patient Reached') {
      return 4
    }

    return 0
  }

  const [currentStage, setCurrentStage] =
    useState(
      getStage(
        currentEmergency.status
      )
    )

  // Listen to Firebase emergency document
  useEffect(() => {

    if (!emergency?.firestoreId) {
      return
    }

    const emergencyRef = doc(
      db,
      'emergencyRequests',
      emergency.firestoreId
    )

    const unsubscribe = onSnapshot(
      emergencyRef,
      snapshot => {

        if (!snapshot.exists()) {
          console.log(
            'Emergency request not found'
          )
          return
        }

        const data = snapshot.data()

        const updatedEmergency = {
          firestoreId: snapshot.id,
          ...data
        }

        setCurrentEmergency(
          updatedEmergency
        )

        setCurrentStage(
          getStage(data.status)
        )
      },
      error => {
        console.error(
          'Emergency tracking Firebase error:',
          error
        )
      }
    )

    return () => unsubscribe()

  }, [emergency])

  // Update Firebase status
  const updateEmergencyStatus = async status => {

    if (!currentEmergency.firestoreId) {
      alert(
        'Emergency Firebase record was not found.'
      )
      return
    }

    try {

      setLoading(true)

      const emergencyRef = doc(
        db,
        'emergencyRequests',
        currentEmergency.firestoreId
      )

      await updateDoc(
        emergencyRef,
        {
          status: status,
          updatedAt: serverTimestamp()
        }
      )

    } catch (error) {

      console.error(
        'Error updating emergency:',
        error
      )

      alert(
        `Failed to update emergency status.\n\n${error.message}`
      )

    } finally {

      setLoading(false)

    }
  }

  const simulateNextStage = async () => {

    if (
      currentStage >=
      stages.length - 1
    ) {
      alert(
        'Emergency response journey is already completed.'
      )
      return
    }

    const nextStage =
      currentStage + 1

    const nextStatus =
      stages[nextStage].title

    await updateEmergencyStatus(
      nextStatus
    )
  }

  const resetTracking = async () => {

    if (!currentEmergency.firestoreId) {
      alert(
        'Emergency Firebase record was not found.'
      )
      return
    }

    const confirmReset =
      window.confirm(
        'Reset this emergency journey?'
      )

    if (!confirmReset) {
      return
    }

    await updateEmergencyStatus(
      'Emergency Requested'
    )
  }

  const callPatient = () => {

    window.alert(
      `Calling ${currentEmergency.patient}\n${currentEmergency.phone}`
    )

  }

  const callAmbulance = async () => {

    await updateEmergencyStatus(
      'Ambulance Dispatched'
    )

    window.alert(
      'Emergency ambulance has been contacted.'
    )

  }

  const navigateToPatient = () => {

    window.alert(
      `Navigation started to ${currentEmergency.location}.`
    )

  }

  const createReferral = () => {

    const patient = {
      id: currentEmergency.patientId,
      name: currentEmergency.patient,
      age: currentEmergency.age,
      village: currentEmergency.location,
      mobile: currentEmergency.phone
    }

    if (onReferral) {
      onReferral(patient)
    }

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
            Back to Emergency Alerts
          </button>

        </div>

      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        <section className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-8 text-white shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="bg-white/20 p-4 rounded-2xl animate-pulse">
                <Siren size={35} />
              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  Emergency Response Tracking
                </h1>

                <p className="text-red-100 mt-2">
                  Monitor the patient's emergency response journey in real time.
                </p>

              </div>

            </div>

            <div className="bg-white/20 px-5 py-3 rounded-xl">

              <p className="text-xs text-red-100">
                Current Status
              </p>

              <p className="font-bold text-lg">
                {currentEmergency.status}
              </p>

            </div>

          </div>

        </section>

        <section className="bg-white rounded-3xl border border-red-100 shadow-sm p-7 mt-7">

          <div className="flex items-center gap-4">

            <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
              <UserRound size={28} />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                {currentEmergency.patient}
              </h2>

              <p className="text-gray-500">
                {currentEmergency.patientId}
              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-6">

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500">
                Age
              </p>

              <p className="font-bold mt-1">
                {currentEmergency.age}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500">
                Location
              </p>

              <p className="font-bold mt-1">
                {currentEmergency.location}
              </p>

            </div>

            <div className="bg-red-50 rounded-xl p-4">

              <p className="text-xs text-red-500">
                Emergency
              </p>

              <p className="font-bold text-red-700 mt-1">
                {currentEmergency.emergency}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500">
                Alert Time
              </p>

              <p className="font-bold mt-1">
                {currentEmergency.time}
              </p>

            </div>

          </div>

        </section>

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-7 mt-7">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                Emergency Journey
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Track each stage of the emergency response.
              </p>

            </div>

            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold">
              {currentStage + 1} / {stages.length}
            </div>

          </div>

          <div className="mt-8">

            {stages.map((stage, index) => {

              const Icon = stage.icon

              const completed =
                index <= currentStage

              const current =
                index === currentStage

              return (

                <div
                  key={stage.title}
                  className="flex gap-4"
                >

                  <div className="flex flex-col items-center">

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        completed
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      } ${
                        current
                          ? 'ring-4 ring-green-100'
                          : ''
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    {index < stages.length - 1 && (

                      <div
                        className={`w-1 h-16 ${
                          index < currentStage
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />

                    )}

                  </div>

                  <div className="pb-10">

                    <div className="flex items-center gap-3 flex-wrap">

                      <h3
                        className={`font-bold ${
                          completed
                            ? 'text-gray-800'
                            : 'text-gray-400'
                        }`}
                      >
                        {stage.title}
                      </h3>

                      {current && (

                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          Current Stage
                        </span>

                      )}

                    </div>

                    <p
                      className={`text-sm mt-1 ${
                        completed
                          ? 'text-gray-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {stage.description}
                    </p>

                  </div>

                </div>

              )

            })}

          </div>

        </section>

        <section className="grid md:grid-cols-2 gap-5 mt-7">

          <button
            onClick={simulateNextStage}
            disabled={
              loading ||
              currentStage >=
                stages.length - 1
            }
            className={`rounded-2xl p-6 text-left text-white ${
              loading ||
              currentStage >=
                stages.length - 1
                ? 'bg-gray-400'
                : 'bg-green-600'
            }`}
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm opacity-80">
                  Emergency Simulation
                </p>

                <h3 className="text-xl font-bold mt-1">

                  {currentStage >=
                  stages.length - 1
                    ? 'Journey Completed'
                    : loading
                    ? 'Updating...'
                    : 'Simulate Next Stage'}

                </h3>

              </div>

              <ArrowRight size={25} />

            </div>

          </button>

          <button
            onClick={resetTracking}
            disabled={loading}
            className="bg-gray-100 rounded-2xl p-6 text-left text-gray-700"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Demo Control
                </p>

                <h3 className="text-xl font-bold mt-1">
                  Reset Emergency Journey
                </h3>

              </div>

              <RotateCcw size={25} />

            </div>

          </button>

        </section>

        <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7 mt-7">

          <h2 className="text-xl font-bold text-gray-800">
            Emergency Actions
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">

            <button
              onClick={callPatient}
              className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-4 font-semibold flex items-center justify-center gap-2"
            >
              <Phone size={19} />
              Call Patient
            </button>

            <button
              onClick={callAmbulance}
              disabled={loading}
              className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 font-semibold flex items-center justify-center gap-2"
            >
              <Ambulance size={19} />
              Ambulance
            </button>

            <button
              onClick={navigateToPatient}
              className="bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-4 font-semibold flex items-center justify-center gap-2"
            >
              <Navigation size={19} />
              Navigate
            </button>

            <button
              onClick={createReferral}
              className="bg-orange-50 text-orange-700 border border-orange-200 rounded-xl p-4 font-semibold flex items-center justify-center gap-2"
            >
              <Hospital size={19} />
              Hospital Referral
            </button>

          </div>

        </section>

        <section className="bg-blue-50 border border-blue-200 rounded-3xl p-6 mt-7">

          <div className="flex items-start gap-3">

            <Clock
              className="text-blue-600 mt-1"
              size={23}
            />

            <div>

              <h3 className="font-bold text-blue-800">
                Live Response Monitoring
              </h3>

              <p className="text-sm text-blue-700 mt-1">
                Emergency status is synchronized with Firebase.
                When the health worker updates the response stage,
                the latest status is reflected automatically.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default EmergencyTracking