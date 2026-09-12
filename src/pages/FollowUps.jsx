import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  Clock,
  Hospital,
  Phone,
  RefreshCw
} from 'lucide-react'

function FollowUps({ onBack }) {
  const defaultFollowUps = [
    {
      id: 'FU-1001',
      patientId: 'SC-2026-1048',
      patient: 'SevaCare Patient',
      age: 42,
      village: 'Kanchipuram Village',
      mobile: '+91 98765 43210',
      type: 'Routine Follow-up',
      title: 'General Health Review',
      description: 'Review symptoms and continue prescribed care.',
      date: '15 Sep 2026',
      status: 'Pending',
      priority: 'Normal'
    },
    {
      id: 'FU-1002',
      patientId: 'SC-2026-1048',
      patient: 'SevaCare Patient',
      age: 42,
      village: 'Kanchipuram Village',
      mobile: '+91 98765 43210',
      type: 'Medication Follow-up',
      title: 'Medicine Review',
      description: 'Check response to current medicines.',
      date: '18 Sep 2026',
      status: 'Pending',
      priority: 'Normal'
    }
  ]

  const [followUps, setFollowUps] = useState(
    defaultFollowUps
  )

  const loadFollowUps = () => {
    const saved = JSON.parse(
      localStorage.getItem('sevacareFollowUps') || '[]'
    )

    const patientId = 'SC-2026-1048'

    const patientFollowUps = saved.filter(
      (item) => item.patientId === patientId
    )

    const combined = [
      ...patientFollowUps,
      ...defaultFollowUps
    ]

    const unique = combined.filter(
      (item, index, array) =>
        index ===
        array.findIndex(
          (followUp) =>
            followUp.id === item.id
        )
    )

    setFollowUps(unique)
  }

  useEffect(() => {
    loadFollowUps()

    const interval = setInterval(
      loadFollowUps,
      2000
    )

    return () => clearInterval(interval)
  }, [])

  const updateStatus = (id, status) => {
    const saved = JSON.parse(
      localStorage.getItem('sevacareFollowUps') || '[]'
    )

    const updatedSaved = saved.map(
      (item) =>
        item.id === id
          ? { ...item, status }
          : item
    )

    localStorage.setItem(
      'sevacareFollowUps',
      JSON.stringify(updatedSaved)
    )

    setFollowUps((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    )
  }

  const callWorker = (mobile) => {
    alert(`Calling healthcare worker: ${mobile}`)
  }

  const pendingCount = followUps.filter(
    (item) => item.status === 'Pending'
  ).length

  const completedCount = followUps.filter(
    (item) => item.status === 'Completed'
  ).length

  const referralCount = followUps.filter(
    (item) => item.type === 'Referral Follow-up'
  ).length

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
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <CalendarClock size={34} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                My Follow-ups
              </h1>

              <p className="text-blue-100 mt-2">
                Track your upcoming healthcare follow-ups and referral care.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-7">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {pendingCount}
                </p>
              </div>

              <Clock
                className="text-orange-500"
                size={30}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <p className="text-3xl font-bold text-green-600 mt-1">
                  {completedCount}
                </p>
              </div>

              <CheckCircle
                className="text-green-500"
                size={30}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Referral Follow-ups
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {referralCount}
                </p>
              </div>

              <Hospital
                className="text-blue-500"
                size={30}
              />
            </div>
          </div>
        </section>

        {followUps.length === 0 ? (
          <section className="bg-white rounded-3xl p-10 mt-7 text-center shadow-sm">
            <CalendarClock
              size={50}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-xl font-bold text-gray-700 mt-4">
              No Follow-ups
            </h2>

            <p className="text-gray-500 mt-2">
              You currently have no follow-up tasks.
            </p>
          </section>
        ) : (
          <section className="space-y-5 mt-7">
            {followUps.map((followUp) => (
              <div
                key={followUp.id}
                className={`bg-white rounded-3xl p-6 shadow-sm border ${
                  followUp.status === 'Completed'
                    ? 'border-green-200'
                    : 'border-blue-100'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex gap-4">
                    <div
                      className={`p-4 rounded-2xl h-fit ${
                        followUp.type ===
                        'Referral Follow-up'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {followUp.type ===
                      'Referral Follow-up' ? (
                        <Hospital size={28} />
                      ) : (
                        <CalendarClock size={28} />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-800">
                          {followUp.title}
                        </h2>

                        <span
                          className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            followUp.status ===
                            'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {followUp.status}
                        </span>
                      </div>

                      <p className="text-sm text-blue-600 font-semibold mt-2">
                        {followUp.type}
                      </p>

                      <p className="text-gray-500 mt-2">
                        {followUp.description}
                      </p>

                      {followUp.hospital && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-semibold">
                            Hospital:
                          </span>{' '}
                          {followUp.hospital}
                        </p>
                      )}

                      {followUp.referralId && (
                        <p className="text-sm text-gray-500 mt-1">
                          Referral ID:{' '}
                          <span className="font-semibold">
                            {followUp.referralId}
                          </span>
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarClock size={16} />
                          {followUp.date}
                        </span>

                        <span>
                          Priority:{' '}
                          <b>
                            {followUp.priority ||
                              'Normal'}
                          </b>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {followUp.status !==
                      'Completed' && (
                      <button
                        onClick={() =>
                          updateStatus(
                            followUp.id,
                            'Completed'
                          )
                        }
                        className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
                      >
                        <CheckCircle
                          size={18}
                        />
                        Mark Completed
                      </button>
                    )}

                    <button
                      onClick={() =>
                        callWorker(
                          followUp.mobile ||
                            '+91 98765 40001'
                        )
                      }
                      className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
                    >
                      <Phone size={18} />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="bg-green-50 border border-green-200 rounded-3xl p-6 mt-7">
          <div className="flex items-start gap-4">
            <RefreshCw
              className="text-green-600 mt-1"
              size={25}
            />

            <div>
              <h2 className="font-bold text-green-800">
                Connected Care Journey
              </h2>

              <p className="text-sm text-green-700 mt-2">
                Follow-ups created by your healthcare worker are
                automatically synchronized here. This helps ensure
                you continue receiving care after a hospital referral.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-white px-3 py-2 rounded-lg text-sm font-semibold text-green-700">
                  Referral
                </span>

                <span className="text-green-500">
                  →
                </span>

                <span className="bg-white px-3 py-2 rounded-lg text-sm font-semibold text-green-700">
                  Hospital Visit
                </span>

                <span className="text-green-500">
                  →
                </span>

                <span className="bg-white px-3 py-2 rounded-lg text-sm font-semibold text-green-700">
                  Follow-up
                </span>

                <span className="text-green-500">
                  →
                </span>

                <span className="bg-white px-3 py-2 rounded-lg text-sm font-semibold text-green-700">
                  Continued Care
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default FollowUps