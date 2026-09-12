import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  Hospital,
  CalendarClock,
  UserRound,
  CheckCircle,
  Clock,
  Trash2,
  Phone,
  Activity
} from 'lucide-react'

function HealthWorkerNotifications({ onBack }) {
  const defaultNotifications = [
    {
      id: 'HW-NOT-001',
      type: 'Patient',
      title: 'Patient Follow-up Due',
      message: 'Ravi has a follow-up scheduled.',
      time: '10 Sep 2026, 09:30 AM',
      read: false
    },
    {
      id: 'HW-NOT-002',
      type: 'Referral',
      title: 'Referral Requires Review',
      message: 'A hospital referral is awaiting review.',
      time: '10 Sep 2026, 09:10 AM',
      read: false
    }
  ]

  const [notifications, setNotifications] =
    useState(defaultNotifications)

  const loadNotifications = () => {
    const emergencyAlerts = JSON.parse(
      localStorage.getItem(
        'sevacareEmergencyAlerts'
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

    const riskAlerts = JSON.parse(
      localStorage.getItem(
        'sevacareHighRiskAlerts'
      ) || '[]'
    )

    const generated = []

    emergencyAlerts.forEach((alert) => {
      generated.push({
        id: `EMERGENCY-${alert.id}`,
        type: 'Emergency',
        title: 'Emergency SOS Received',
        message: `${alert.patient} reported ${alert.emergency} at ${alert.location}.`,
        time: alert.time,
        read: false,
        patientId: alert.patientId,
        patient: alert.patient,
        phone: alert.phone
      })
    })

    referrals.forEach((referral) => {
      generated.push({
        id: `REFERRAL-${referral.id}`,
        type: 'Referral',
        title: 'New Hospital Referral',
        message: `${referral.patientName} was referred to ${referral.hospital}.`,
        time: referral.date,
        read: false,
        patientId: referral.patientId,
        patient: referral.patientName,
        phone: referral.patientMobile
      })
    })

    followUps.forEach((followUp) => {
      generated.push({
        id: `FOLLOWUP-${followUp.id}`,
        type: 'Follow-up',
        title: 'New Follow-up Added',
        message: `${followUp.patient} has a new follow-up task.`,
        time: followUp.createdAt || followUp.date,
        read: false,
        patientId: followUp.patientId,
        patient: followUp.patient,
        phone: followUp.mobile
      })
    })

    riskAlerts.forEach((alert) => {
      generated.push({
        id: `RISK-${alert.id}`,
        type: 'High Risk',
        title: 'High-Risk Patient Alert',
        message: `${alert.name} requires health-worker attention.`,
        time: new Date().toLocaleString('en-IN'),
        read: false,
        patientId: alert.patientId,
        patient: alert.name,
        phone: alert.mobile
      })
    })

    const combined = [
      ...generated,
      ...defaultNotifications
    ]

    const unique = combined.filter(
      (item, index, array) =>
        array.findIndex(
          (x) => x.id === item.id
        ) === index
    )

    setNotifications(unique)
  }

  useEffect(() => {
    loadNotifications()

    const timer = setInterval(
      loadNotifications,
      2000
    )

    return () =>
      clearInterval(timer)
  }, [])

  const unread = notifications.filter(
    (item) => !item.read
  )

  const emergencyCount =
    notifications.filter(
      (item) =>
        item.type === 'Emergency' &&
        !item.read
    ).length

  const riskCount =
    notifications.filter(
      (item) =>
        item.type === 'High Risk' &&
        !item.read
    ).length

  const markRead = (id) => {
    setNotifications(
      notifications.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true
            }
          : item
      )
    )
  }

  const markAllRead = () => {
    setNotifications(
      notifications.map((item) => ({
        ...item,
        read: true
      }))
    )
  }

  const removeNotification = (id) => {
    setNotifications(
      notifications.filter(
        (item) => item.id !== id
      )
    )
  }

  const getIcon = (type) => {
    if (type === 'Emergency') {
      return (
        <AlertTriangle
          size={23}
        />
      )
    }

    if (type === 'Referral') {
      return (
        <Hospital size={23} />
      )
    }

    if (type === 'Follow-up') {
      return (
        <CalendarClock
          size={23}
        />
      )
    }

    if (type === 'High Risk') {
      return (
        <Activity size={23} />
      )
    }

    return (
      <UserRound size={23} />
    )
  }

  const getStyle = (type) => {
    if (type === 'Emergency') {
      return 'bg-red-100 text-red-600'
    }

    if (type === 'Referral') {
      return 'bg-orange-100 text-orange-600'
    }

    if (type === 'Follow-up') {
      return 'bg-green-100 text-green-600'
    }

    if (type === 'High Risk') {
      return 'bg-purple-100 text-purple-600'
    }

    return 'bg-blue-100 text-blue-600'
  }

  const callPatient = (notification) => {
    if (!notification.phone) {
      alert('Patient phone number is not available.')
      return
    }

    alert(
      `Calling ${notification.patient}\n${notification.phone}`
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
            <Bell size={17} />
            Health Worker Notifications
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-blue-700 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <Bell size={38} />

                <h1 className="text-3xl font-bold">
                  Connected Care Alerts
                </h1>
              </div>

              <p className="text-blue-100 mt-3 max-w-2xl">
                Patient emergencies, referrals, follow-ups and risk alerts
                appear here automatically.
              </p>
            </div>

            <div className="bg-white/15 rounded-2xl px-6 py-4">
              <p className="text-sm text-blue-100">
                Unread Alerts
              </p>

              <p className="text-4xl font-bold">
                {unread.length}
              </p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-5 mt-7">
          <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm">
            <AlertTriangle
              className="text-red-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Emergency
            </p>

            <p className="text-3xl font-bold text-red-700">
              {emergencyCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
            <Activity
              className="text-purple-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              High Risk
            </p>

            <p className="text-3xl font-bold text-purple-700">
              {riskCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
            <Hospital
              className="text-orange-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Referrals
            </p>

            <p className="text-3xl font-bold text-orange-700">
              {
                notifications.filter(
                  (item) =>
                    item.type ===
                    'Referral'
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <CalendarClock
              className="text-green-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Follow-ups
            </p>

            <p className="text-3xl font-bold text-green-700">
              {
                notifications.filter(
                  (item) =>
                    item.type ===
                    'Follow-up'
                ).length
              }
            </p>
          </div>
        </section>

        {emergencyCount > 0 && (
          <section className="bg-red-50 border border-red-300 rounded-2xl p-5 mt-7">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className="text-red-600 animate-pulse"
                size={26}
              />

              <div>
                <h2 className="font-bold text-red-800">
                  Immediate Emergency Attention Required
                </h2>

                <p className="text-sm text-red-700 mt-1">
                  A patient emergency alert is waiting for response.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 mt-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Notifications
              </h2>

              <p className="text-gray-500 mt-1">
                Automatically synchronized from SevaCare activities.
              </p>
            </div>

            {unread.length > 0 && (
              <button
                onClick={markAllRead}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                Mark All Read
              </button>
            )}
          </div>

          <div className="space-y-4 mt-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell
                  className="mx-auto text-gray-300"
                  size={50}
                />

                <p className="text-gray-500 mt-4">
                  No notifications available.
                </p>
              </div>
            ) : (
              notifications.map(
                (notification) => (
                  <div
                    key={notification.id}
                    className={`rounded-2xl border p-5 ${
                      notification.read
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                      <div className="flex gap-4">
                        <div
                          className={`p-3 rounded-xl h-fit ${getStyle(
                            notification.type
                          )}`}
                        >
                          {getIcon(
                            notification.type
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-800">
                              {
                                notification.title
                              }
                            </h3>

                            {!notification.read && (
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                NEW
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 mt-2">
                            {
                              notification.message
                            }
                          </p>

                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
                            <Clock size={14} />
                            {
                              notification.time
                            }
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {notification.phone && (
                          <button
                            onClick={() =>
                              callPatient(
                                notification
                              )
                            }
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold"
                          >
                            <Phone size={15} />
                            Call
                          </button>
                        )}

                        {!notification.read && (
                          <button
                            onClick={() =>
                              markRead(
                                notification.id
                              )
                            }
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold"
                          >
                            <CheckCircle
                              size={15}
                            />
                            Read
                          </button>
                        )}

                        <button
                          onClick={() =>
                            removeNotification(
                              notification.id
                            )
                          }
                          className="border border-gray-200 text-gray-500 px-3 py-2 rounded-lg"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-7">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <AlertTriangle
              className="text-red-600"
              size={28}
            />

            <h3 className="font-bold text-red-800 text-lg mt-4">
              Emergency Alerts
            </h3>

            <p className="text-sm text-red-700 mt-2">
              Patient SOS requests are synchronized automatically.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <Hospital
              className="text-orange-600"
              size={28}
            />

            <h3 className="font-bold text-orange-800 text-lg mt-4">
              Referral Alerts
            </h3>

            <p className="text-sm text-orange-700 mt-2">
              New hospital referrals are shown immediately.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <CalendarClock
              className="text-green-600"
              size={28}
            />

            <h3 className="font-bold text-green-800 text-lg mt-4">
              Follow-up Alerts
            </h3>

            <p className="text-sm text-green-700 mt-2">
              Follow-up tasks help prevent patients from being lost after treatment.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HealthWorkerNotifications