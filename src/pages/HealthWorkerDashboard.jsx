import { useEffect, useState } from 'react'
import {
  HeartPulse,
  Users,
  UserPlus,
  Stethoscope,
  CalendarDays,
  ClipboardCheck,
  Bell,
  AlertTriangle,
  Siren,
  FileText,
  WifiOff,
  Route,
  Activity,
  User,
  LogOut,
  ShieldCheck,
  Ambulance
} from 'lucide-react'

function HealthWorkerDashboard({
  user,
  onRegisterPatient,
  onPatients,
  onTriage,
  onRecords,
  onReferrals,
  onFollowUps,
  onAlerts,
  onNotifications,
  onOffline,
  onEmergency,
  onEmergencyAlerts,
  onEmergencyTracking,
  onProfile,
  onWorkerHealthSummary,
  onAppointments,
  onCareJourney,
  onLogout
}) {
  const [emergencyCount, setEmergencyCount] = useState(0)
  const [highRiskCount, setHighRiskCount] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [notificationCount, setNotificationCount] = useState(0)

  const workerName = user?.name || 'Health Worker'
  const workerType = user?.workerType || 'Community Health Worker'
  const workerMobile = user?.mobile || ''

  useEffect(() => {
    const loadCounts = () => {
      try {
        const emergencies = JSON.parse(
          localStorage.getItem('sevacareEmergencyAlerts') || '[]'
        )

        const highRisk = JSON.parse(
          localStorage.getItem('sevacareHighRiskAlerts') || '[]'
        )

        const referrals = JSON.parse(
          localStorage.getItem('sevacareReferrals') || '[]'
        )

        const followups = JSON.parse(
          localStorage.getItem('sevacareFollowUps') || '[]'
        )

        setEmergencyCount(
          emergencies.filter(item => item.status !== 'Handled').length
        )

        setHighRiskCount(
          highRisk.filter(item => item.status !== 'Reviewed').length
        )

        setReferralCount(
          referrals.filter(item => item.status !== 'Completed').length
        )

        setNotificationCount(
          emergencies.filter(item => item.status !== 'Handled').length +
          highRisk.filter(item => item.status !== 'Reviewed').length +
          followups.filter(item => item.status !== 'Completed').length
        )
      } catch {
        setEmergencyCount(0)
        setHighRiskCount(0)
        setReferralCount(0)
        setNotificationCount(0)
      }
    }

    loadCounts()

    const interval = setInterval(loadCounts, 2000)

    return () => clearInterval(interval)
  }, [])

  const quickActions = [
    {
      title: 'Register Patient',
      text: 'Add a new patient',
      icon: UserPlus,
      action: onRegisterPatient
    },
    {
      title: 'Patient List',
      text: 'View registered patients',
      icon: Users,
      action: onPatients
    },
    {
      title: 'Patient Triage',
      text: 'Assess patient symptoms',
      icon: Stethoscope,
      action: onTriage
    },
    {
      title: 'Doctor Queue',
      text: 'View waiting patients',
      icon: CalendarDays,
      action: onAppointments
    },
    {
      title: 'Referrals',
      text: 'Create and track referrals',
      icon: Route,
      action: onReferrals
    },
    {
      title: 'Follow-ups',
      text: 'Manage patient follow-ups',
      icon: ClipboardCheck,
      action: onFollowUps
    },
    {
      title: 'High-Risk Alerts',
      text: 'Review high-risk patients',
      icon: AlertTriangle,
      action: onAlerts
    },
    {
      title: 'Emergency Alerts',
      text: 'Respond to emergencies',
      icon: Siren,
      action: onEmergencyAlerts
    },
    {
      title: 'Notifications',
      text: 'View important updates',
      icon: Bell,
      action: onNotifications
    },
    {
      title: 'Offline Records',
      text: 'Access saved records',
      icon: WifiOff,
      action: onOffline
    },
    {
      title: 'Care Journey',
      text: 'Track connected care',
      icon: Route,
      action: onCareJourney
    },
    {
      title: 'Health Summary',
      text: 'View patient health summary',
      icon: Activity,
      action: onWorkerHealthSummary
    }
  ]

  return (
    <div className="min-h-screen bg-sky-50">

      <header className="bg-white border-b border-sky-100 sticky top-0 z-20">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center">
              <HeartPulse
                size={25}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-emerald-700">
                CareMitra
              </h1>

              <p className="text-xs text-slate-500">
                Healthcare Support
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={onNotifications}
              className="relative p-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            >
              <Bell size={20} />

              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={onProfile}
              className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl"
            >
              <User
                size={18}
                className="text-emerald-600"
              />

              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-700">
                  {workerName}
                </p>

                <p className="text-xs text-slate-400">
                  {workerType}
                </p>
              </div>
            </button>

            <button
              onClick={onLogout}
              className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
              title="Logout"
            >
              <LogOut size={19} />
            </button>

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        <section className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <p className="text-emerald-100 text-sm mb-2">
                CareMitra Healthcare Support
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Welcome, {workerName} 👋
              </h2>

              <p className="text-emerald-50 mt-2">
                Manage patients and provide connected healthcare support.
              </p>

              <div className="flex flex-wrap gap-3 mt-4">

                <span className="bg-white/15 px-3 py-2 rounded-lg text-sm">
                  {workerType}
                </span>

                {workerMobile && (
                  <span className="bg-white/15 px-3 py-2 rounded-lg text-sm">
                    {workerMobile}
                  </span>
                )}

              </div>

            </div>

            <div className="bg-white/15 rounded-2xl p-5">
              <Stethoscope
                size={55}
                className="text-white"
              />
            </div>

          </div>

        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

          <button
            onClick={onEmergencyAlerts}
            className="bg-white rounded-2xl p-5 text-left border border-red-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <Siren size={23} />
              </div>

              <span className="text-2xl font-bold text-red-600">
                {emergencyCount}
              </span>

            </div>

            <p className="font-bold text-slate-800 mt-4">
              Emergencies
            </p>

            <p className="text-xs text-slate-500">
              Active alerts
            </p>

          </button>

          <button
            onClick={onAlerts}
            className="bg-white rounded-2xl p-5 text-left border border-orange-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <AlertTriangle size={23} />
              </div>

              <span className="text-2xl font-bold text-orange-600">
                {highRiskCount}
              </span>

            </div>

            <p className="font-bold text-slate-800 mt-4">
              High Risk
            </p>

            <p className="text-xs text-slate-500">
              Patients requiring review
            </p>

          </button>

          <button
            onClick={onReferrals}
            className="bg-white rounded-2xl p-5 text-left border border-blue-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Route size={23} />
              </div>

              <span className="text-2xl font-bold text-blue-600">
                {referralCount}
              </span>

            </div>

            <p className="font-bold text-slate-800 mt-4">
              Referrals
            </p>

            <p className="text-xs text-slate-500">
              Active referrals
            </p>

          </button>

          <button
            onClick={onNotifications}
            className="bg-white rounded-2xl p-5 text-left border border-purple-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Bell size={23} />
              </div>

              <span className="text-2xl font-bold text-purple-600">
                {notificationCount}
              </span>

            </div>

            <p className="font-bold text-slate-800 mt-4">
              Notifications
            </p>

            <p className="text-xs text-slate-500">
              Important updates
            </p>

          </button>

        </section>

        <section>

          <div className="mb-5">

            <h2 className="text-2xl font-bold text-slate-800">
              Quick Actions
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Manage your healthcare support activities
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {quickActions.map(action => {

              const Icon = action.icon

              return (
                <button
                  key={action.title}
                  onClick={action.action}
                  className="bg-white rounded-2xl p-5 text-left shadow-sm border border-slate-100 hover:shadow-lg hover:border-emerald-200 group"
                >

                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="font-bold text-slate-800">
                    {action.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {action.text}
                  </p>

                </button>
              )

            })}

          </div>

        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mt-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Activity size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Connected Care
              </h2>

              <p className="text-sm text-slate-500">
                Keep every patient interaction connected
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

            {[
              'Registration',
              'Triage',
              'Consultation',
              'Referral',
              'Follow-up'
            ].map((step, index) => (

              <div
                key={step}
                className="flex flex-col items-center text-center"
              >

                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <p className="text-sm font-semibold text-slate-700 mt-2">
                  {step}
                </p>

              </div>

            ))}

          </div>

        </section>

        <section className="grid md:grid-cols-3 gap-4 mt-6">

          <button
            onClick={onEmergencyAlerts}
            className="bg-red-50 border border-red-100 rounded-2xl p-5 text-left"
          >

            <Ambulance
              className="text-red-600 mb-3"
              size={27}
            />

            <h3 className="font-bold text-slate-800">
              Emergency Response
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Respond quickly to patient emergency alerts.
            </p>

          </button>

          <button
            onClick={onOffline}
            className="bg-sky-50 border border-sky-100 rounded-2xl p-5 text-left"
          >

            <WifiOff
              className="text-sky-600 mb-3"
              size={27}
            />

            <h3 className="font-bold text-slate-800">
              Offline Patient Records
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Access essential patient information during low connectivity.
            </p>

          </button>

          <button
            onClick={onCareJourney}
            className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-left"
          >

            <FileText
              className="text-purple-600 mb-3"
              size={27}
            />

            <h3 className="font-bold text-slate-800">
              Patient Care Journey
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Follow the patient's complete healthcare journey.
            </p>

          </button>

        </section>

        <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-8">
          <ShieldCheck size={17} />
          <span>CareMitra • Healthcare Support</span>
        </div>

      </main>
    </div>
  )
}

export default HealthWorkerDashboard