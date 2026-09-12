import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  UserPlus,
  Stethoscope,
  AlertTriangle,
  Hospital,
  Ambulance,
  MapPin,
  CalendarClock,
  CheckCircle,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react'

function CareJourney({ onBack }) {
  const [events, setEvents] = useState([])

  const loadJourney = () => {
    const patients = JSON.parse(
      localStorage.getItem(
        'sevacarePatients'
      ) || '[]'
    )

    const triageRecords = JSON.parse(
      localStorage.getItem(
        'sevacareTriageRecords'
      ) || '[]'
    )

    const referrals = JSON.parse(
      localStorage.getItem(
        'sevacareReferrals'
      ) || '[]'
    )

    const followUps = JSON.parse(
      localStorage.getItem(
        'sevacareFollowUps'
      ) || '[]'
    )

    const emergencies = JSON.parse(
      localStorage.getItem(
        'sevacareEmergencyAlerts'
      ) || '[]'
    )

    const journey = []

    if (patients.length > 0) {
      patients.forEach((patient) => {
        journey.push({
          id: `patient-${patient.id}`,
          type: 'Registration',
          title: 'Patient Registered',
          description: `${patient.name} was registered in the SevaCare patient registry.`,
          patient: patient.name,
          patientId: patient.id,
          date: patient.createdAt || 'Recent',
          icon: 'registration',
          color: 'blue'
        })
      })
    }

    if (triageRecords.length > 0) {
      triageRecords.forEach((record) => {
        journey.push({
          id: `triage-${record.id}`,
          type: 'Triage',
          title: 'Health Assessment Completed',
          description:
            record.symptoms?.length > 0
              ? `Symptoms recorded: ${record.symptoms.join(', ')}.`
              : 'Patient health assessment completed.',
          patient:
            record.patient ||
            'Patient',
          patientId:
            record.patientId ||
            'Unknown',
          date:
            record.date ||
            'Recent',
          icon: 'triage',
          color:
            record.risk === 'High'
              ? 'red'
              : record.risk === 'Medium'
              ? 'orange'
              : 'green'
        })
      })
    }

    if (emergencies.length > 0) {
      emergencies.forEach(
        (emergency) => {
          journey.push({
            id: `emergency-${emergency.id}`,
            type: 'Emergency',
            title: 'Emergency Alert',
            description: `${emergency.emergency} reported from ${emergency.location}.`,
            patient:
              emergency.patient,
            patientId:
              emergency.patientId,
            date:
              emergency.time,
            icon: 'emergency',
            color: 'red',
            status:
              emergency.status
          })
        }
      )
    }

    if (referrals.length > 0) {
      referrals.forEach(
        (referral) => {
          journey.push({
            id: `referral-${referral.id}`,
            type: 'Referral',
            title: 'Hospital Referral Created',
            description: `Referral created to ${referral.hospital} for ${referral.reason}.`,
            patient:
              referral.patientName,
            patientId:
              referral.patientId,
            date:
              referral.date,
            icon: 'referral',
            color: 'orange',
            status:
              referral.status
          })
        }
      )
    }

    if (followUps.length > 0) {
      followUps.forEach(
        (followUp) => {
          journey.push({
            id: `followup-${followUp.id}`,
            type: 'Follow-up',
            title: followUp.title ||
              'Follow-up Added',
            description:
              followUp.description ||
              'A follow-up task was created for the patient.',
            patient:
              followUp.patient,
            patientId:
              followUp.patientId,
            date:
              followUp.date ||
              followUp.createdAt ||
              'Recent',
            icon: 'followup',
            color:
              followUp.status ===
              'Completed'
                ? 'green'
                : 'purple',
            status:
              followUp.status
          })
        }
      )
    }

    if (journey.length === 0) {
      journey.push(
        {
          id: 'demo-1',
          type: 'Registration',
          title: 'Patient Registered',
          description:
            'Patient profile created in the SevaCare registry.',
          patient:
            'SevaCare Patient',
          patientId:
            'SC-2026-1048',
          date:
            '10 Sep 2026',
          icon: 'registration',
          color: 'blue'
        },
        {
          id: 'demo-2',
          type: 'Triage',
          title:
            'Health Assessment Completed',
          description:
            'Initial symptoms and vital signs were assessed.',
          patient:
            'SevaCare Patient',
          patientId:
            'SC-2026-1048',
          date:
            '10 Sep 2026',
          icon: 'triage',
          color: 'green'
        },
        {
          id: 'demo-3',
          type: 'Referral',
          title:
            'Hospital Referral Created',
          description:
            'Patient referred for specialist medical review.',
          patient:
            'SevaCare Patient',
          patientId:
            'SC-2026-1048',
          date:
            '10 Sep 2026',
          icon: 'referral',
          color: 'orange',
          status:
            'Hospital Review'
        },
        {
          id: 'demo-4',
          type: 'Follow-up',
          title:
            'Follow-up Scheduled',
          description:
            'Follow-up task created to continue patient care.',
          patient:
            'SevaCare Patient',
          patientId:
            'SC-2026-1048',
          date:
            'After hospital visit',
          icon: 'followup',
          color: 'purple',
          status:
            'Pending'
        }
      )
    }

    setEvents(journey)
  }

  useEffect(() => {
    loadJourney()

    const timer = setInterval(
      loadJourney,
      2000
    )

    return () =>
      clearInterval(timer)
  }, [])

  const getIcon = (icon) => {
    if (icon === 'registration') {
      return <UserPlus size={22} />
    }

    if (icon === 'triage') {
      return <Stethoscope size={22} />
    }

    if (icon === 'emergency') {
      return (
        <AlertTriangle size={22} />
      )
    }

    if (icon === 'referral') {
      return <Hospital size={22} />
    }

    return (
      <CalendarClock size={22} />
    )
  }

  const getColor = (color) => {
    if (color === 'red') {
      return {
        box: 'bg-red-100 text-red-600',
        line: 'bg-red-300',
        text: 'text-red-700'
      }
    }

    if (color === 'orange') {
      return {
        box: 'bg-orange-100 text-orange-600',
        line: 'bg-orange-300',
        text: 'text-orange-700'
      }
    }

    if (color === 'green') {
      return {
        box: 'bg-green-100 text-green-600',
        line: 'bg-green-300',
        text: 'text-green-700'
      }
    }

    if (color === 'purple') {
      return {
        box: 'bg-purple-100 text-purple-600',
        line: 'bg-purple-300',
        text: 'text-purple-700'
      }
    }

    return {
      box: 'bg-blue-100 text-blue-600',
      line: 'bg-blue-300',
      text: 'text-blue-700'
    }
  }

  const completedCount =
    events.filter(
      (event) =>
        event.status === 'Completed' ||
        event.type === 'Registration' ||
        event.type === 'Triage'
    ).length

  const pendingCount =
    events.filter(
      (event) =>
        event.status === 'Pending' ||
        event.status ===
          'Hospital Review'
    ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
            <Activity size={17} />
            Connected Care
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-blue-700 to-green-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <Activity size={38} />

                <h1 className="text-3xl font-bold">
                  Complete Patient Journey
                </h1>
              </div>

              <p className="text-blue-100 mt-3 max-w-2xl">
                One connected timeline from patient registration to
                assessment, emergency response, referral and follow-up.
              </p>
            </div>

            <button
              onClick={loadJourney}
              className="bg-white text-blue-700 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh Journey
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-7">
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
            <Activity
              className="text-blue-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Total Care Events
            </p>

            <p className="text-3xl font-bold text-gray-800">
              {events.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
            <CheckCircle
              className="text-green-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Completed Care
            </p>

            <p className="text-3xl font-bold text-green-700">
              {completedCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
            <Clock
              className="text-orange-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Active / Pending
            </p>

            <p className="text-3xl font-bold text-orange-700">
              {pendingCount}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-7 mt-7">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Care Journey Timeline
            </h2>

            <p className="text-gray-500 mt-1">
              Events are automatically collected from SevaCare care modules.
            </p>
          </div>

          <div className="relative">
            {events.map(
              (event, index) => {
                const colors =
                  getColor(
                    event.color
                  )

                const last =
                  index ===
                  events.length - 1

                return (
                  <div
                    key={event.id}
                    className="relative flex gap-5 pb-10"
                  >
                    {!last && (
                      <div
                        className={`absolute left-6 top-12 w-0.5 h-full ${colors.line}`}
                      />
                    )}

                    <div
                      className={`relative z-10 w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${colors.box}`}
                    >
                      {getIcon(
                        event.icon
                      )}
                    </div>

                    <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${colors.box}`}
                            >
                              {event.type}
                            </span>

                            {event.status && (
                              <span className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                                {event.status}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mt-3">
                            {event.title}
                          </h3>

                          <p className="text-gray-600 mt-2">
                            {event.description}
                          </p>
                        </div>

                        <div className="text-sm text-gray-400 flex items-center gap-1 whitespace-nowrap">
                          <Clock size={14} />
                          {event.date}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                        <span className="flex items-center gap-1">
                          <UserPlus size={14} />
                          {event.patient}
                        </span>

                        <span>
                          ID: {event.patientId}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-4 mt-7">
          <JourneyStep
            icon={<UserPlus size={22} />}
            title="Registration"
            text="Patient identity"
          />

          <JourneyStep
            icon={<Stethoscope size={22} />}
            title="Assessment"
            text="Triage and risk"
          />

          <JourneyStep
            icon={<Hospital size={22} />}
            title="Referral"
            text="Hospital connection"
          />

          <JourneyStep
            icon={<CalendarClock size={22} />}
            title="Follow-up"
            text="Continuity of care"
          />
        </section>

        <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-7">
          <div className="flex items-start gap-4">
            <CheckCircle
              className="text-blue-600 mt-1"
              size={25}
            />

            <div>
              <h2 className="font-bold text-blue-800">
                Why this matters
              </h2>

              <p className="text-sm text-blue-700 mt-2">
                SevaCare keeps the patient's care journey connected across
                community registration, triage, emergency response,
                hospital referral and follow-up instead of treating each
                interaction as a separate event.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-5">
          <div className="flex items-start gap-4">
            <Ambulance
              className="text-red-600 mt-1"
              size={27}
            />

            <div>
              <h2 className="font-bold text-red-800">
                Emergency-ready care
              </h2>

              <p className="text-sm text-red-700 mt-2">
                Emergency SOS events are included in the same patient
                journey so health workers can understand what happened
                before responding or creating a hospital referral.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function JourneyStep({
  icon,
  title,
  text
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
      <div className="w-11 h-11 mx-auto bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
        {icon}
      </div>

      <h3 className="font-bold text-gray-800 mt-3">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {text}
      </p>
    </div>
  )
}

export default CareJourney