import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  FileText,
  Hospital,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  RefreshCw,
  ArrowRight,
  CalendarClock
} from 'lucide-react'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'

function ReferralTracking({ onBack, onTravel }) {
  const [referral, setReferral] = useState(null)
  const [updated, setUpdated] = useState(false)
  const [loading, setLoading] = useState(false)

  const stages = [
    {
      title: 'Referral Created',
      description: 'Health worker created the referral'
    },
    {
      title: 'Hospital Review',
      description: 'Hospital is reviewing the referral'
    },
    {
      title: 'Transport Arranged',
      description: 'Transport support has been arranged'
    },
    {
      title: 'Patient Reached',
      description: 'Patient reached the referred facility'
    }
  ]

  const loadReferral = async () => {
    setLoading(true)

    try {
      const snapshot = await getDocs(
        collection(db, 'referrals')
      )

      if (snapshot.empty) {
        setReferral(null)
        return
      }

      const referrals = snapshot.docs.map(item => ({
        ...item.data(),
        firebaseId: item.id
      }))

      referrals.sort((a, b) => {
        const timeA = a.createdAt?.toMillis
          ? a.createdAt.toMillis()
          : 0

        const timeB = b.createdAt?.toMillis
          ? b.createdAt.toMillis()
          : 0

        return timeB - timeA
      })

      setReferral(referrals[0])
    } catch (error) {
      console.error(
        'Firebase referral loading error:',
        error
      )

      alert(
        'Unable to load referral from Firebase.\n\n' +
        error.message
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReferral()

    const interval = setInterval(
      loadReferral,
      5000
    )

    return () => clearInterval(interval)
  }, [])

  const currentStage = referral
    ? stages.findIndex(
        stage => stage.title === referral.status
      )
    : -1

  const createFollowUp = async () => {
    if (!referral) return

    try {
      const snapshot = await getDocs(
        collection(db, 'followUps')
      )

      const exists = snapshot.docs.some(
        item =>
          item.data().referralId === referral.id
      )

      if (exists) {
        return
      }

      const followUpId =
        `FOLLOW-${Date.now()}`

      const followUp = {
        id: followUpId,

        patientId: referral.patientId,

        patientCustomId:
          referral.patientCustomId || '',

        patientUid:
          referral.patientUid || '',

        patient: referral.patientName,

        age: referral.patientAge,

        village: referral.patientVillage,

        mobile: referral.patientMobile,

        type: 'Referral Follow-up',

        title: 'Hospital Referral Follow-up',

        description:
          `Follow up after referral to ${referral.hospital}.`,

        date: 'After hospital visit',

        status: 'Pending',

        priority:
          referral.priority || 'Normal',

        referralId: referral.id,

        hospital: referral.hospital,

        createdAt: serverTimestamp()
      }

      await setDoc(
        doc(db, 'followUps', followUpId),
        followUp
      )

      console.log(
        'Follow-up saved to Firebase'
      )
    } catch (error) {
      console.error(
        'Follow-up Firebase error:',
        error
      )
    }
  }

  const updateReferralStatus = async newStatus => {
    if (!referral) return

    try {
      await updateDoc(
        doc(
          db,
          'referrals',
          referral.firebaseId || referral.id
        ),
        {
          status: newStatus,
          updatedAt: serverTimestamp()
        }
      )

      const updatedReferral = {
        ...referral,
        status: newStatus
      }

      setReferral(updatedReferral)
      setUpdated(true)

      if (newStatus === 'Patient Reached') {
        await createFollowUp()
      }

      setTimeout(() => {
        setUpdated(false)
      }, 2500)

    } catch (error) {
      console.error(
        'Firebase status update error:',
        error
      )

      alert(
        'Failed to update referral status.\n\n' +
        error.message
      )
    }
  }

  const simulateNextStage = () => {
    if (
      currentStage >= 0 &&
      currentStage < stages.length - 1
    ) {
      updateReferralStatus(
        stages[currentStage + 1].title
      )
    }
  }

  const resetTracking = () => {
    updateReferralStatus(
      'Referral Created'
    )
  }

  const contactHospital = () => {
    if (!referral) return

    alert(
      `Calling ${referral.hospital}`
    )
  }

  const handleTravel = () => {
    if (onTravel) {
      onTravel()
    }
  }

  if (!referral) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

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

        <main className="max-w-4xl mx-auto px-6 py-20">

          <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-10 text-center">

            <FileText
              size={55}
              className="mx-auto text-blue-500"
            />

            <h1 className="text-2xl font-bold text-gray-800 mt-5">
              No Referral Found
            </h1>

            <p className="text-gray-500 mt-2">
              Create a referral first from the Health Worker dashboard.
            </p>

            <button
              onClick={loadReferral}
              disabled={loading}
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              {loading
                ? 'Loading...'
                : 'Refresh'}
            </button>

          </div>

        </main>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

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

      <main className="max-w-6xl mx-auto px-6 py-8">

        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="bg-white/20 p-4 rounded-2xl">
                <FileText size={34} />
              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  Referral Tracking
                </h1>

                <p className="text-blue-100 mt-2">
                  Track every stage of your hospital referral.
                </p>

              </div>

            </div>

            <button
              onClick={loadReferral}
              disabled={loading}
              className="bg-white/20 px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
            >

              <RefreshCw size={18} />

              {loading
                ? 'Loading...'
                : 'Refresh'}

            </button>

          </div>

        </section>

        {updated && (
          <section className="bg-green-50 border border-green-200 rounded-2xl p-5 mt-6">

            <div className="flex items-center gap-3">

              <CheckCircle
                className="text-green-600"
                size={24}
              />

              <div>

                <p className="font-bold text-green-800">
                  Referral Status Updated
                </p>

                <p className="text-sm text-green-700">
                  Current stage: {referral.status}
                </p>

              </div>

            </div>

          </section>
        )}

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-7 mt-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm text-gray-500">
                Referral ID
              </p>

              <h2 className="text-2xl font-bold text-blue-700">
                {referral.id}
              </h2>

              <p className="text-gray-500 mt-1">
                {referral.date || 'Date not available'}
              </p>

            </div>

            <div className="bg-blue-50 px-5 py-3 rounded-xl">

              <p className="text-xs text-gray-500">
                Current Status
              </p>

              <p className="font-bold text-blue-700 mt-1">
                {referral.status}
              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-7">

            <div className="bg-gray-50 rounded-2xl p-5">

              <p className="text-xs text-gray-500">
                Patient
              </p>

              <p className="font-bold text-gray-800 mt-1">
                {referral.patientName}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {referral.patientCustomId ||
                  referral.patientId}
              </p>

            </div>

            <div className="bg-gray-50 rounded-2xl p-5">

              <p className="text-xs text-gray-500">
                Referred Facility
              </p>

              <p className="font-bold text-gray-800 mt-1">
                {referral.hospital}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {referral.reason}
              </p>

            </div>

            <div className="bg-gray-50 rounded-2xl p-5">

              <p className="text-xs text-gray-500">
                Priority
              </p>

              <p className="font-bold text-orange-600 mt-1">
                {referral.priority}
              </p>

            </div>

            <div className="bg-gray-50 rounded-2xl p-5">

              <p className="text-xs text-gray-500">
                Transport
              </p>

              <p className="font-bold text-gray-800 mt-1">
                {referral.transport}
              </p>

            </div>

          </div>

        </section>

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-7 mt-6">

          <h2 className="text-xl font-bold text-gray-800">
            Referral Journey
          </h2>

          <p className="text-gray-500 mt-1">
            Live progress of your referral.
          </p>

          <div className="mt-8">

            {stages.map((stage, index) => {

              const completed =
                index <= currentStage

              const current =
                index === currentStage

              return (
                <div
                  key={stage.title}
                  className="relative flex gap-5"
                >

                  {index < stages.length - 1 && (
                    <div
                      className={`absolute left-5 top-12 w-1 h-16 ${
                        index < currentStage
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      completed
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    } ${
                      current
                        ? 'ring-4 ring-green-100'
                        : ''
                    }`}
                  >

                    {completed ? (
                      <CheckCircle size={22} />
                    ) : (
                      <Clock size={20} />
                    )}

                  </div>

                  <div className="pb-10">

                    <h3
                      className={`font-bold ${
                        current
                          ? 'text-green-700'
                          : completed
                          ? 'text-gray-800'
                          : 'text-gray-400'
                      }`}
                    >
                      {stage.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {stage.description}
                    </p>

                    {current && (
                      <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                        Current Stage
                      </span>
                    )}

                  </div>

                </div>
              )
            })}

          </div>

          <div className="flex flex-wrap gap-3 mt-2">

            {currentStage < stages.length - 1 && (

              <button
                onClick={simulateNextStage}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
              >

                Simulate Next Stage
                <ArrowRight size={18} />

              </button>

            )}

            {currentStage === stages.length - 1 && (

              <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold flex items-center gap-2">

                <CheckCircle size={19} />

                Referral Journey Completed

              </div>

            )}

            <button
              onClick={resetTracking}
              className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold"
            >
              Reset Demo
            </button>

          </div>

        </section>

        {referral.status === 'Patient Reached' && (

          <section className="bg-green-50 border border-green-200 rounded-3xl p-6 mt-6">

            <div className="flex items-start gap-4">

              <CalendarClock
                className="text-green-600 mt-1"
                size={26}
              />

              <div>

                <h2 className="font-bold text-green-800">
                  Follow-up Added
                </h2>

                <p className="text-sm text-green-700 mt-2">
                  A follow-up task has been automatically created in Firebase.
                </p>

                <button
                  onClick={onBack}
                  className="mt-4 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  View My Follow-ups
                </button>

              </div>

            </div>

          </section>

        )}

        <section className="grid md:grid-cols-3 gap-5 mt-6">

          <button
            onClick={contactHospital}
            className="bg-white border border-blue-100 rounded-2xl p-6 text-left shadow-sm"
          >

            <Phone
              className="text-blue-600"
              size={26}
            />

            <h3 className="font-bold text-gray-800 mt-4">
              Contact Hospital
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Get referral assistance
            </p>

          </button>

          <button
            onClick={handleTravel}
            className="bg-white border border-blue-100 rounded-2xl p-6 text-left shadow-sm"
          >

            <MapPin
              className="text-green-600"
              size={26}
            />

            <h3 className="font-bold text-gray-800 mt-4">
              Plan My Journey
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Find the best route
            </p>

          </button>

          <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">

            <Hospital
              className="text-purple-600"
              size={26}
            />

            <h3 className="font-bold text-gray-800 mt-4">
              Referred Facility
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {referral.hospital}
            </p>

          </div>

        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mt-6">

          <h2 className="font-bold text-blue-800">
            Firebase Referral Journey
          </h2>

          <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">

            <span className="bg-white px-4 py-2 rounded-lg font-semibold">
              Health Worker
            </span>

            <ArrowRight
              size={18}
              className="text-blue-500"
            />

            <span className="bg-white px-4 py-2 rounded-lg font-semibold">
              Firebase
            </span>

            <ArrowRight
              size={18}
              className="text-blue-500"
            />

            <span className="bg-white px-4 py-2 rounded-lg font-semibold">
              Hospital
            </span>

            <ArrowRight
              size={18}
              className="text-blue-500"
            />

            <span className="bg-white px-4 py-2 rounded-lg font-semibold">
              Follow-up
            </span>

          </div>

        </section>

      </main>

    </div>
  )
}

export default ReferralTracking