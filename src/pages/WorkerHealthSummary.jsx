import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CalendarClock,
  Activity,
  HeartPulse,
  Thermometer,
  Wind,
  ClipboardPlus,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

function WorkerHealthSummary({ patient, onBack }) {
  const fallbackPatient = {
    id: 'SC-2026-1048',
    name: 'SevaCare Patient',
    age: 42,
    gender: 'Female',
    village: 'Kanchipuram Village',
    mobile: '+91 98765 43210',
    bloodGroup: 'B+'
  }

  const [patientData, setPatientData] = useState(
    patient || fallbackPatient
  )

  const [triage, setTriage] = useState(null)
  const [referral, setReferral] = useState(null)
  const [followUps, setFollowUps] = useState([])
  const [emergencies, setEmergencies] = useState([])

  const loadSummary = () => {
    const targetId =
      patient?.id || patientData?.id || fallbackPatient.id

    const savedPatients = JSON.parse(
      localStorage.getItem('sevacarePatients') || '[]'
    )

    const savedPatient = savedPatients.find(
      item => item.id === targetId
    )

    if (savedPatient) {
      setPatientData({
        ...fallbackPatient,
        ...savedPatient
      })
    } else if (patient) {
      setPatientData({
        ...fallbackPatient,
        ...patient
      })
    }

    const triageRecords = JSON.parse(
      localStorage.getItem('sevacareTriageRecords') || '[]'
    )

    const patientTriage = triageRecords.filter(
      item => item.patientId === targetId
    )

    setTriage(patientTriage[0] || null)

    const referrals = JSON.parse(
      localStorage.getItem('sevacareReferrals') || '[]'
    )

    const patientReferrals = referrals.filter(
      item => item.patientId === targetId
    )

    setReferral(patientReferrals[0] || null)

    const savedFollowUps = JSON.parse(
      localStorage.getItem('sevacareFollowUps') || '[]'
    )

    setFollowUps(
      savedFollowUps.filter(
        item => item.patientId === targetId
      )
    )

    const emergencyAlerts = JSON.parse(
      localStorage.getItem('sevacareEmergencyAlerts') || '[]'
    )

    setEmergencies(
      emergencyAlerts.filter(
        item => item.patientId === targetId
      )
    )
  }

  useEffect(() => {
    loadSummary()

    const interval = setInterval(loadSummary, 2000)

    return () => clearInterval(interval)
  }, [patient])

  const activeEmergency = emergencies.find(
    item => item.status !== 'Handled'
  )

  const pendingFollowUps = followUps.filter(
    item => item.status !== 'Completed'
  ).length

  return (
    <div className="min-h-screen bg-sky-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sky-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Patient List
        </button>

        {activeEmergency && (
          <div className="bg-red-600 text-white rounded-2xl p-5 mb-6 shadow-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle size={28} />

              <div>
                <h2 className="font-bold text-lg">
                  Active Emergency Alert
                </h2>

                <p className="text-red-100 text-sm mt-1">
                  {activeEmergency.emergency}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg border border-sky-100 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-700 to-cyan-600 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <User size={34} />
              </div>

              <div className="flex-1">
                <p className="text-sky-100 text-sm">
                  Patient Health Summary
                </p>

                <h1 className="text-3xl font-bold mt-1">
                  {patientData.name}
                </h1>

                <p className="text-sky-100 mt-1">
                  {patientData.id}
                </p>
              </div>

              <button
                onClick={loadSummary}
                className="bg-white/20 px-4 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-7">
            <div className="grid md:grid-cols-4 gap-4">
              <SummaryCard
                icon={<User />}
                label="Age"
                value={patientData.age}
              />

              <SummaryCard
                icon={<MapPin />}
                label="Village"
                value={patientData.village}
              />

              <SummaryCard
                icon={<Phone />}
                label="Mobile"
                value={patientData.mobile}
              />

              <SummaryCard
                icon={<HeartPulse />}
                label="Blood Group"
                value={patientData.bloodGroup || 'Not Provided'}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-orange-50 rounded-2xl p-5">
                <Activity className="text-orange-600" />

                <p className="text-sm text-slate-500 mt-3">
                  Latest Risk
                </p>

                <p
                  className={`text-2xl font-bold ${
                    triage?.risk === 'High'
                      ? 'text-red-600'
                      : triage?.risk === 'Medium'
                        ? 'text-orange-600'
                        : 'text-green-600'
                  }`}
                >
                  {triage?.risk || 'Not Assessed'}
                </p>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5">
                <ClipboardPlus className="text-purple-600" />

                <p className="text-sm text-slate-500 mt-3">
                  Referral
                </p>

                <p className="text-2xl font-bold text-purple-700">
                  {referral ? referral.status : 'None'}
                </p>
              </div>

              <div className="bg-green-50 rounded-2xl p-5">
                <CheckCircle className="text-green-600" />

                <p className="text-sm text-slate-500 mt-3">
                  Pending Follow-ups
                </p>

                <p className="text-2xl font-bold text-green-700">
                  {pendingFollowUps}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">
                Latest Triage Assessment
              </h2>

              {triage ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Vital
                      icon={<Thermometer />}
                      label="Temperature"
                      value={`${triage.temperature} °F`}
                    />

                    <Vital
                      icon={<HeartPulse />}
                      label="Pulse"
                      value={`${triage.pulse} bpm`}
                    />

                    <Vital
                      icon={<Wind />}
                      label="Oxygen"
                      value={`${triage.oxygen}%`}
                    />
                  </div>

                  <div className="mt-5">
                    <p className="font-semibold">
                      Symptoms
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {triage.symptoms.map(symptom => (
                        <span
                          key={symptom}
                          className="bg-white border border-slate-200 px-3 py-2 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 mt-5">
                    <p className="text-sm text-slate-500">
                      Recommendation
                    </p>

                    <p className="font-semibold mt-1">
                      {triage.recommendation}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 mt-4">
                    Assessed: {triage.date}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 mt-4 text-center text-slate-500">
                  No triage assessment available for this patient.
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">
                Referral Status
              </h2>

              {referral ? (
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Info
                      label="Referral ID"
                      value={referral.id}
                    />

                    <Info
                      label="Hospital"
                      value={referral.hospital}
                    />

                    <Info
                      label="Priority"
                      value={referral.priority}
                    />

                    <Info
                      label="Status"
                      value={referral.status}
                    />
                  </div>

                  <p className="text-sm text-slate-600 mt-4">
                    Reason: {referral.reason}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 mt-4 text-slate-500">
                  No hospital referral created for this patient.
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold">
                Follow-up Care
              </h2>

              {followUps.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {followUps.map(item => (
                    <div
                      key={item.id}
                      className="bg-green-50 border border-green-100 rounded-2xl p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold">
                            {item.title}
                          </h3>

                          <p className="text-sm text-slate-600 mt-1">
                            {item.description}
                          </p>

                          {item.hospital && (
                            <p className="text-sm text-purple-600 mt-2">
                              Hospital: {item.hospital}
                            </p>
                          )}
                        </div>

                        <span className="bg-white px-3 py-2 rounded-full text-sm font-semibold">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 mt-4 text-slate-500">
                  No follow-up records available.
                </div>
              )}
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 mt-8">
              <div className="flex items-center gap-3">
                <CalendarClock className="text-sky-600" />

                <div>
                  <h3 className="font-bold text-sky-700">
                    Unified Patient View
                  </h3>

                  <p className="text-sm text-slate-600 mt-1">
                    Registration, triage, emergency alerts, referrals
                    and follow-up records are connected using the
                    SevaCare patient ID.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                window.alert(
                  `Calling ${patientData.name}\n${patientData.mobile}`
                )
              }
              className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Contact Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5">
      <div className="text-sky-600">
        {icon}
      </div>

      <p className="text-sm text-slate-500 mt-3">
        {label}
      </p>

      <p className="font-bold mt-1 break-words">
        {value}
      </p>
    </div>
  )
}

function Vital({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100">
      <div className="text-sky-600">
        {icon}
      </div>

      <p className="text-sm text-slate-500 mt-2">
        {label}
      </p>

      <p className="text-xl font-bold mt-1">
        {value}
      </p>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="bg-white rounded-xl p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value}
      </p>
    </div>
  )
}

export default WorkerHealthSummary
