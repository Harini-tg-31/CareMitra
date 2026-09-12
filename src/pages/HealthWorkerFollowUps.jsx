import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Bell,
  CheckCircle,
  Clock,
  RotateCcw,
  FileText,
  RefreshCw
} from 'lucide-react'

function HealthWorkerFollowUps({ onBack }) {
  const defaultFollowUps = [
    {
      id: 'FU-2026-1001',
      patient: 'Lakshmi',
      patientId: 'SC-2026-1041',
      age: 42,
      village: 'Kanchipuram Village',
      date: '11 Sep 2026',
      type: 'Medicine Follow-up',
      status: 'Pending',
      phone: '+91 98765 40101'
    },
    {
      id: 'FU-2026-1002',
      patient: 'Kumar',
      patientId: 'SC-2026-1042',
      age: 58,
      village: 'Chengalpattu Village',
      date: '11 Sep 2026',
      type: 'Doctor Review',
      status: 'Pending',
      phone: '+91 98765 40102'
    },
    {
      id: 'FU-2026-1003',
      patient: 'Meena',
      patientId: 'SC-2026-1043',
      age: 35,
      village: 'Madurantakam Village',
      date: '12 Sep 2026',
      type: 'Referral Follow-up',
      status: 'Pending',
      phone: '+91 98765 40103'
    },
    {
      id: 'FU-2026-1004',
      patient: 'Ravi',
      patientId: 'SC-2026-1044',
      age: 67,
      village: 'Uthiramerur Village',
      date: '13 Sep 2026',
      type: 'Health Check',
      status: 'Pending',
      phone: '+91 98765 40104'
    }
  ]

  const [followUps, setFollowUps] = useState(defaultFollowUps)

  const loadFollowUps = () => {
    const savedFollowUps = JSON.parse(
      localStorage.getItem('sevacareFollowUps') || '[]'
    )

    const savedPatients = JSON.parse(
      localStorage.getItem('sevacarePatients') || '[]'
    )

    const savedReferrals = JSON.parse(
      localStorage.getItem('sevacareReferrals') || '[]'
    )

    const newPatientFollowUps = savedPatients.map(
      (patient, index) => ({
        id: `FU-PATIENT-${patient.id}`,
        patient: patient.name,
        patientId: patient.id,
        age: patient.age,
        village: patient.village,
        date: new Date(
          Date.now() + (index + 1) * 86400000
        ).toLocaleDateString('en-IN'),
        type: 'New Patient Follow-up',
        status: 'Pending',
        phone: patient.mobile || '+91 98765 40000'
      })
    )

    const referralFollowUps = savedReferrals.map(
      (referral) => ({
        id: `FU-REF-${referral.id}`,
        patient: referral.patientName,
        patientId: referral.patientId,
        age: referral.patientAge,
        village: referral.patientVillage,
        date: referral.date,
        type: `Referral Follow-up · ${referral.id}`,
        status: 'Pending',
        phone: referral.patientMobile || '+91 98765 40000'
      })
    )

    const allFollowUps = [
      ...savedFollowUps,
      ...referralFollowUps,
      ...newPatientFollowUps,
      ...defaultFollowUps
    ]

    const uniqueFollowUps = allFollowUps.filter(
      (item, index, array) =>
        index ===
        array.findIndex(
          (followUp) => followUp.id === item.id
        )
    )

    setFollowUps(uniqueFollowUps)
  }

  useEffect(() => {
    loadFollowUps()

    const interval = setInterval(() => {
      loadFollowUps()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const saveFollowUps = (updatedFollowUps) => {
    const customFollowUps = updatedFollowUps.filter(
      (item) =>
        item.id.startsWith('FU-') &&
        !item.id.startsWith('FU-PATIENT-') &&
        !item.id.startsWith('FU-REF-')
    )

    localStorage.setItem(
      'sevacareFollowUps',
      JSON.stringify(customFollowUps)
    )
  }

  const completeFollowUp = (id) => {
    const updatedFollowUps = followUps.map(
      (item) =>
        item.id === id
          ? { ...item, status: 'Completed' }
          : item
    )

    setFollowUps(updatedFollowUps)
    saveFollowUps(updatedFollowUps)
  }

  const undoFollowUp = (id) => {
    const updatedFollowUps = followUps.map(
      (item) =>
        item.id === id
          ? { ...item, status: 'Pending' }
          : item
    )

    setFollowUps(updatedFollowUps)
    saveFollowUps(updatedFollowUps)
  }

  const callPatient = (item) => {
    window.alert(
      `Calling ${item.patient}\n${item.phone}`
    )
  }

  const sendReminder = (item) => {
    window.alert(
      `Follow-up reminder sent to ${item.patient}`
    )
  }

  const pendingCount = followUps.filter(
    (item) => item.status === 'Pending'
  ).length

  const completedCount = followUps.filter(
    (item) => item.status === 'Completed'
  ).length

  const today = new Date().toLocaleDateString('en-IN')

  const todayCount = followUps.filter(
    (item) => item.date === today
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <button
            onClick={loadFollowUps}
            className="flex items-center gap-2 text-blue-600 font-semibold"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Calendar size={36} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Follow-up Management
              </h1>

              <p className="text-blue-100 mt-2">
                Track patient follow-ups and continuity of care.
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Follow-ups
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {followUps.length}
                </p>
              </div>

              <Calendar
                className="text-blue-600"
                size={32}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {pendingCount}
                </p>
              </div>

              <Clock
                className="text-orange-600"
                size={32}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Completed
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {completedCount}
                </p>
              </div>

              <CheckCircle
                className="text-green-600"
                size={32}
              />
            </div>
          </div>
        </section>

        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mt-8">
          <div className="flex items-start gap-4">
            <div className="bg-white text-blue-600 p-3 rounded-xl">
              <Bell size={24} />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">
                Today's Follow-ups
              </h2>

              <p className="text-gray-600 mt-1">
                {todayCount > 0
                  ? `${todayCount} follow-up(s) scheduled for today.`
                  : 'Follow-ups are being monitored for today.'}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm mt-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">
              Patient Follow-ups
            </h2>

            <p className="text-gray-500 mt-1">
              Follow-ups are automatically created from registered
              patients and referrals.
            </p>
          </div>

          <div className="p-6 space-y-5">
            {followUps.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-6 ${
                  item.status === 'Completed'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                  <div className="flex gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                        item.status === 'Completed'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {item.status === 'Completed' ? (
                        <CheckCircle size={28} />
                      ) : (
                        <Calendar size={28} />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {item.patient}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.patientId} · Age {item.age}
                      </p>

                      <p className="text-blue-600 font-semibold mt-2">
                        {item.type}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span>
                          {item.date}
                        </span>

                        <span>
                          {item.village}
                        </span>

                        <span>
                          {item.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => callPatient(item)}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold flex items-center gap-2"
                    >
                      <Phone size={17} />
                      Call Patient
                    </button>

                    {item.status === 'Pending' && (
                      <button
                        onClick={() => sendReminder(item)}
                        className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-semibold flex items-center gap-2"
                      >
                        <Bell size={17} />
                        Send Reminder
                      </button>
                    )}

                    {item.status === 'Pending' ? (
                      <button
                        onClick={() =>
                          completeFollowUp(item.id)
                        }
                        className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold flex items-center gap-2"
                      >
                        <CheckCircle size={17} />
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          undoFollowUp(item.id)
                        }
                        className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold flex items-center gap-2"
                      >
                        <RotateCcw size={17} />
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-3xl p-7 mt-8">
          <div className="flex items-start gap-4">
            <div className="bg-white text-green-600 p-3 rounded-xl">
              <FileText size={26} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Smart Follow-up Continuity
              </h2>

              <p className="text-gray-600 mt-2">
                SevaCare automatically creates follow-up tasks for
                registered patients and hospital referrals, helping
                health workers continue care after the initial visit.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 text-white rounded-3xl p-7 mt-6">
          <div className="flex items-start gap-4">
            <CheckCircle size={28} />

            <div>
              <h2 className="text-xl font-bold">
                Continuity of Care
              </h2>

              <p className="text-blue-100 mt-2">
                Follow-up completion is saved locally so the health
                worker can maintain a simple digital care history even
                without a backend.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HealthWorkerFollowUps