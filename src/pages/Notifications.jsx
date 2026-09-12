import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  AlertTriangle,
  Hospital,
  CalendarClock,
  Trash2,
  RefreshCw
} from 'lucide-react'

function Notifications({ onBack }) {
  const defaultNotifications = [
    {
      id: 'N-1001',
      type: 'Appointment',
      title: 'Appointment Reminder',
      message: 'Your doctor appointment is scheduled for 12 Sep 2026.',
      time: 'Today',
      read: false
    },
    {
      id: 'N-1002',
      type: 'Health',
      title: 'Health Check Reminder',
      message: 'Please complete your scheduled health follow-up.',
      time: 'Yesterday',
      read: true
    }
  ]

  const [notifications, setNotifications] = useState(
    defaultNotifications
  )

  const loadNotifications = () => {
    const savedNotifications = JSON.parse(
      localStorage.getItem('sevacarePatientNotifications') || '[]'
    )

    const referrals = JSON.parse(
      localStorage.getItem('sevacareReferrals') || '[]'
    )

    const followUps = JSON.parse(
      localStorage.getItem('sevacareFollowUps') || '[]'
    )

    const emergencies = JSON.parse(
      localStorage.getItem('sevacareEmergencyAlerts') || '[]'
    )

    const highRisk = JSON.parse(
      localStorage.getItem('sevacareHighRiskAlerts') || '[]'
    )

    const patientId = 'SC-2026-1048'

    const newNotifications = []

    referrals
      .filter(
        (item) =>
          item.patientId === patientId
      )
      .forEach((item) => {
        newNotifications.push({
          id: `REF-NOTIFY-${item.id}`,
          type: 'Referral',
          title: 'New Hospital Referral',
          message: `Your referral to ${item.hospital} has been created.`,
          time: item.date,
          read: false,
          referralId: item.id
        })
      })

    followUps
      .filter(
        (item) =>
          item.patientId === patientId
      )
      .forEach((item) => {
        newNotifications.push({
          id: `FU-NOTIFY-${item.id}`,
          type: 'Follow-up',
          title: 'New Follow-up Added',
          message:
            item.description ||
            'A new healthcare follow-up has been added.',
          time: item.createdAt || 'Today',
          read: false,
          followUpId: item.id
        })
      })

    emergencies
      .filter(
        (item) =>
          item.patientId === patientId
      )
      .forEach((item) => {
        newNotifications.push({
          id: `SOS-NOTIFY-${item.id}`,
          type: 'Emergency',
          title: 'Emergency Alert Status',
          message: `Your emergency alert is currently ${item.status}.`,
          time: item.time,
          read: item.status === 'Handled',
          emergencyId: item.id
        })
      })

    highRisk
      .filter(
        (item) =>
          item.patientId === patientId
      )
      .forEach((item) => {
        newNotifications.push({
          id: `RISK-NOTIFY-${item.id}`,
          type: 'Risk',
          title: 'Health Risk Alert',
          message: `Health worker recorded a high-risk condition: ${item.reason}.`,
          time: item.time || 'Today',
          read: false,
          riskId: item.id
        })
      })

    const combined = [
      ...newNotifications,
      ...savedNotifications,
      ...defaultNotifications
    ]

    const unique = combined.filter(
      (item, index, array) =>
        index ===
        array.findIndex(
          (notification) =>
            notification.id === item.id
        )
    )

    setNotifications(unique)
  }

  useEffect(() => {
    loadNotifications()

    const interval = setInterval(
      loadNotifications,
      2000
    )

    return () => clearInterval(interval)
  }, [])

  const saveNotifications = (items) => {
    localStorage.setItem(
      'sevacarePatientNotifications',
      JSON.stringify(items)
    )
  }

  const markRead = (id) => {
    const updated = notifications.map(
      (notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true
            }
          : notification
    )

    setNotifications(updated)
    saveNotifications(
      updated.filter(
        (item) =>
          !item.id.startsWith('N-')
      )
    )
  }

  const markAllRead = () => {
    const updated = notifications.map(
      (notification) => ({
        ...notification,
        read: true
      })
    )

    setNotifications(updated)
    saveNotifications(
      updated.filter(
        (item) =>
          !item.id.startsWith('N-')
      )
    )
  }

  const removeNotification = (id) => {
    const updated = notifications.filter(
      (notification) =>
        notification.id !== id
    )

    setNotifications(updated)
    saveNotifications(
      updated.filter(
        (item) =>
          !item.id.startsWith('N-')
      )
    )
  }

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.read
  ).length

  const getIcon = (type) => {
    if (type === 'Emergency') {
      return (
        <AlertTriangle
          size={24}
          className="text-red-600"
        />
      )
    }

    if (type === 'Referral') {
      return (
        <Hospital
          size={24}
          className="text-blue-600"
        />
      )
    }

    if (type === 'Follow-up') {
      return (
        <CalendarClock
          size={24}
          className="text-green-600"
        />
      )
    }

    if (type === 'Risk') {
      return (
        <AlertTriangle
          size={24}
          className="text-orange-600"
        />
      )
    }

    return (
      <Bell
        size={24}
        className="text-purple-600"
      />
    )
  }

  const getBackground = (type) => {
    if (type === 'Emergency') {
      return 'bg-red-100'
    }

    if (type === 'Referral') {
      return 'bg-blue-100'
    }

    if (type === 'Follow-up') {
      return 'bg-green-100'
    }

    if (type === 'Risk') {
      return 'bg-orange-100'
    }

    return 'bg-purple-100'
  }

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

          <button
            onClick={loadNotifications}
            className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl">
                <Bell size={34} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Notifications
                </h1>

                <p className="text-blue-100 mt-2">
                  Stay updated about your healthcare journey.
                </p>
              </div>
            </div>

            <div className="bg-white/20 px-5 py-3 rounded-xl">
              <p className="text-sm">
                Unread
              </p>

              <p className="text-2xl font-bold">
                {unreadCount}
              </p>
            </div>
          </div>
        </section>

        {unreadCount > 0 && (
          <div className="flex justify-end mt-5">
            <button
              onClick={markAllRead}
              className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <CheckCircle size={18} />
              Mark All as Read
            </button>
          </div>
        )}

        <section className="space-y-4 mt-6">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
              <Bell
                size={50}
                className="mx-auto text-gray-300"
              />

              <h2 className="text-xl font-bold text-gray-700 mt-4">
                No Notifications
              </h2>

              <p className="text-gray-500 mt-2">
                You are all caught up.
              </p>
            </div>
          ) : (
            notifications.map(
              (notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl p-5 border shadow-sm ${
                    notification.read
                      ? 'border-gray-100'
                      : 'border-blue-200'
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`p-3 rounded-xl h-fit ${getBackground(
                        notification.type
                      )}`}
                    >
                      {getIcon(
                        notification.type
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-gray-800">
                            {notification.title}
                          </h2>

                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                        </div>

                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                      </div>

                      <p className="text-gray-500 mt-2">
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-4">
                        {!notification.read && (
                          <button
                            onClick={() =>
                              markRead(
                                notification.id
                              )
                            }
                            className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Mark Read
                          </button>
                        )}

                        <button
                          onClick={() =>
                            removeNotification(
                              notification.id
                            )
                          }
                          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-7">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <Hospital
              className="text-blue-600"
              size={25}
            />

            <h3 className="font-bold text-blue-800 mt-3">
              Referral Updates
            </h3>

            <p className="text-sm text-blue-700 mt-1">
              Receive updates when your health worker creates or progresses a referral.
            </p>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <CalendarClock
              className="text-green-600"
              size={25}
            />

            <h3 className="font-bold text-green-800 mt-3">
              Follow-up Alerts
            </h3>

            <p className="text-sm text-green-700 mt-1">
              Automatically receive follow-up tasks after referral care.
            </p>
          </div>

          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <AlertTriangle
              className="text-red-600"
              size={25}
            />

            <h3 className="font-bold text-red-800 mt-3">
              Emergency Updates
            </h3>

            <p className="text-sm text-red-700 mt-1">
              Monitor the status of emergency alerts sent through SevaCare.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Notifications