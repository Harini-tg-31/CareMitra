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

import {
  collection,
  query,
  where,
  onSnapshot
} from 'firebase/firestore'

import { auth, db } from '../firebase'

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

  const [workerData, setWorkerData] = useState(user || {})

  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [followUps, setFollowUps] = useState([])
  const [triageRecords, setTriageRecords] = useState([])
  const [referrals, setReferrals] = useState([])
  const [emergencies, setEmergencies] = useState([])
  const [notifications, setNotifications] = useState([])

  const [loading, setLoading] = useState(true)

  // --------------------------------------------------
  // WORKER DETAILS
  // --------------------------------------------------

  const workerName =
    workerData?.name ||
    workerData?.fullName ||
    user?.name ||
    'Health Worker'

  const workerType =
    workerData?.workerType ||
    user?.workerType ||
    'Community Health Worker'

  const workerMobile =
    workerData?.mobile ||
    workerData?.phone ||
    user?.mobile ||
    ''

  // --------------------------------------------------
  // HELPER FUNCTIONS
  // --------------------------------------------------

  const getDateValue = value => {

    if (!value) return 0

    if (value?.seconds) {
      return value.seconds * 1000
    }

    if (value instanceof Date) {
      return value.getTime()
    }

    const parsed = new Date(value).getTime()

    return isNaN(parsed) ? 0 : parsed
  }

  const formatDate = value => {

    const timestamp = getDateValue(value)

    if (!timestamp) {
      return 'No date'
    }

    return new Date(timestamp).toLocaleDateString('en-IN')
  }

  const getPatientName = patient => {

    return (
      patient?.name ||
      patient?.fullName ||
      patient?.patientName ||
      'Unknown Patient'
    )
  }

  const getStatus = item => {

    return (
      item?.status ||
      item?.appointmentStatus ||
      item?.followUpStatus ||
      'Pending'
    )
  }

  // --------------------------------------------------
  // FIREBASE DATA
  // --------------------------------------------------

  useEffect(() => {

    const currentUser = auth.currentUser

    if (!currentUser) {
      setLoading(false)
      return
    }

    const uid = currentUser.uid

    // -----------------------------------------------
    // WORKER PROFILE
    // -----------------------------------------------

    const unsubscribeUser = onSnapshot(
      query(collection(db, 'users')),
      snapshot => {

        const worker = snapshot.docs.find(
          item => item.id === uid
        )

        if (worker) {

          setWorkerData({
            ...user,
            ...worker.data()
          })

        }
      },
      error => {
        console.error('Worker profile error:', error)
      }
    )

    // -----------------------------------------------
    // PATIENTS
    // -----------------------------------------------

    const unsubscribePatients = onSnapshot(
      collection(db, 'patients'),
      snapshot => {

        const data = snapshot.docs.map(item => ({
          firestoreId: item.id,
          ...item.data()
        }))

        data.sort(
          (a, b) =>
            getDateValue(b.createdAt) -
            getDateValue(a.createdAt)
        )

        setPatients(data)
        setLoading(false)
      },
      error => {

        console.error('Patients error:', error)

        setPatients([])
        setLoading(false)
      }
    )

    // -----------------------------------------------
    // APPOINTMENTS
    // -----------------------------------------------

    const unsubscribeAppointments = onSnapshot(
      collection(db, 'appointments'),
      snapshot => {

        const data = snapshot.docs.map(item => ({
          firestoreId: item.id,
          ...item.data()
        }))

        data.sort(
          (a, b) =>
            getDateValue(b.createdAt) -
            getDateValue(a.createdAt)
        )

        setAppointments(data)
      },
      error => {

        console.error('Appointments error:', error)

        setAppointments([])
      }
    )

    // -----------------------------------------------
    // FOLLOW UPS
    // -----------------------------------------------

    const unsubscribeFollowUps = onSnapshot(
      collection(db, 'followUps'),
      snapshot => {

        const data = snapshot.docs.map(item => ({
          firestoreId: item.id,
          ...item.data()
        }))

        data.sort(
          (a, b) =>
            getDateValue(b.createdAt) -
            getDateValue(a.createdAt)
        )

        setFollowUps(data)
      },
      error => {

        console.error('Follow-ups error:', error)

        setFollowUps([])
      }
    )

    // -----------------------------------------------
    // TRIAGE
    // -----------------------------------------------

    const unsubscribeTriage = onSnapshot(
      collection(db, 'triageRecords'),
      snapshot => {

        const data = snapshot.docs.map(item => ({
          firestoreId: item.id,
          ...item.data()
        }))

        data.sort(
          (a, b) =>
            getDateValue(b.createdAt) -
            getDateValue(a.createdAt)
        )

        setTriageRecords(data)
      },
      error => {

        console.error('Triage error:', error)

        setTriageRecords([])
      }
    )

    // -----------------------------------------------
    // REFERRALS
    // -----------------------------------------------

    const unsubscribeReferrals = onSnapshot(
      collection(db, 'referrals'),
      snapshot => {

        const data = snapshot.docs.map(item => ({
          firestoreId: item.id,
          ...item.data()
        }))

        data.sort(
          (a, b) =>
            getDateValue(b.createdAt) -
            getDateValue(a.createdAt)
        )

        setReferrals(data)
      },
      error => {

        console.error('Referrals error:', error)

        setReferrals([])
      }
    )

    // -----------------------------------------------
    // EMERGENCIES
    // -----------------------------------------------

    const unsubscribeEmergencies = onSnapshot(
      collection(db, 'emergencyRequests'),
      snapshot => {

        const data = snapshot.docs.map(item => ({
          firestoreId: item.id,
          ...item.data()
        }))

        data.sort(
          (a, b) =>
            getDateValue(b.createdAt) -
            getDateValue(a.createdAt)
        )

        setEmergencies(data)
      },
      error => {

        console.error('Emergency error:', error)

        setEmergencies([])
      }
    )

    // -----------------------------------------------
    // NOTIFICATIONS
    // -----------------------------------------------

    const notificationQuery = query(
      collection(db, 'notifications'),
      where('role', '==', 'healthWorker')
    )

    const unsubscribeNotifications = onSnapshot(
      notificationQuery,
      snapshot => {

        const data = snapshot.docs.map(item => ({
          firestoreId: item.id,
          ...item.data()
        }))

        data.sort(
          (a, b) =>
            getDateValue(b.createdAt) -
            getDateValue(a.createdAt)
        )

        setNotifications(data)
      },
      error => {

        console.error('Notification error:', error)

        setNotifications([])
      }
    )

    // -----------------------------------------------
    // CLEANUP
    // -----------------------------------------------

    return () => {

      unsubscribeUser()
      unsubscribePatients()
      unsubscribeAppointments()
      unsubscribeFollowUps()
      unsubscribeTriage()
      unsubscribeReferrals()
      unsubscribeEmergencies()
      unsubscribeNotifications()

    }

  }, [user])

  // --------------------------------------------------
  // COUNTS
  // --------------------------------------------------

  const emergencyCount = emergencies.filter(item => {

    const status = getStatus(item)

    return (
      status !== 'Patient Reached' &&
      status !== 'Completed' &&
      status !== 'Handled'
    )

  }).length

  const highRiskCount = triageRecords.filter(item => {

    const priority = String(
      item.priority ||
      item.riskLevel ||
      item.triageLevel ||
      ''
    ).toLowerCase()

    const status = String(
      item.status || ''
    ).toLowerCase()

    return (
      (
        priority === 'high' ||
        priority === 'critical' ||
        priority === 'high risk' ||
        priority === 'emergency'
      ) &&
      status !== 'reviewed' &&
      status !== 'completed'
    )

  }).length

  const referralCount = referrals.filter(item => {

    const status = getStatus(item)

    return (
      status !== 'Completed' &&
      status !== 'Patient Reached'
    )

  }).length

  const notificationCount =
    notifications.filter(
      item => item.read !== true
    ).length

  const pendingAppointments =
    appointments.filter(item => {

      const status = String(
        getStatus(item)
      ).toLowerCase()

      return (
        status !== 'completed' &&
        status !== 'cancelled' &&
        status !== 'cancelled by patient'
      )

    })

  const pendingFollowUps =
    followUps.filter(item => {

      const status = String(
        getStatus(item)
      ).toLowerCase()

      return (
        status !== 'completed' &&
        status !== 'closed'
      )

    })

  // --------------------------------------------------
  // RECENT DATA
  // --------------------------------------------------

  const recentPatients =
    patients.slice(0, 5)

  const recentAppointments =
    appointments.slice(0, 5)

  const recentFollowUps =
    pendingFollowUps.slice(0, 5)

  const highRiskRecords =
    triageRecords
      .filter(item => {

        const priority = String(
          item.priority ||
          item.riskLevel ||
          item.triageLevel ||
          ''
        ).toLowerCase()

        return (
          priority === 'high' ||
          priority === 'critical' ||
          priority === 'high risk' ||
          priority === 'emergency'
        )

      })
      .slice(0, 5)

  // --------------------------------------------------
  // QUICK ACTIONS
  // --------------------------------------------------

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

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {

    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">

        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

          <HeartPulse
            size={42}
            className="text-emerald-600 mx-auto animate-pulse"
          />

          <p className="text-slate-600 mt-4 font-medium">
            Loading Health Worker Dashboard...
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Connecting to CareMitra Firebase
          </p>

        </div>

      </div>
    )
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (

    <div className="min-h-screen bg-sky-50">

      {/* HEADER */}

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

                  {notificationCount > 9
                    ? '9+'
                    : notificationCount}

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

      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* WELCOME */}

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

                <span className="bg-white/15 px-3 py-2 rounded-lg text-sm">
                  {patients.length} Patients
                </span>

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

        {/* STAT CARDS */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">

          {/* PATIENTS */}

          <button
            onClick={onPatients}
            className="bg-white rounded-2xl p-5 text-left border border-emerald-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">

                <Users size={23} />

              </div>

              <span className="text-2xl font-bold text-emerald-600">
                {patients.length}
              </span>

            </div>

            <p className="font-bold text-slate-800 mt-4">
              Patients
            </p>

            <p className="text-xs text-slate-500">
              Registered patients
            </p>

          </button>

          {/* APPOINTMENTS */}

          <button
            onClick={onAppointments}
            className="bg-white rounded-2xl p-5 text-left border border-blue-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">

                <CalendarDays size={23} />

              </div>

              <span className="text-2xl font-bold text-blue-600">
                {pendingAppointments.length}
              </span>

            </div>

            <p className="font-bold text-slate-800 mt-4">
              Doctor Queue
            </p>

            <p className="text-xs text-slate-500">
              Active appointments
            </p>

          </button>

          {/* HIGH RISK */}

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

          {/* EMERGENCY */}

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
              Active emergency alerts
            </p>

          </button>

        </section>

        {/* SECOND STAT ROW */}

        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

          <button
            onClick={onReferrals}
            className="bg-white rounded-2xl p-5 text-left border border-purple-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">

                <Route size={23} />

              </div>

              <span className="text-2xl font-bold text-purple-600">
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
            onClick={onFollowUps}
            className="bg-white rounded-2xl p-5 text-left border border-teal-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">

                <ClipboardCheck size={23} />

              </div>

              <span className="text-2xl font-bold text-teal-600">
                {pendingFollowUps.length}
              </span>

            </div>

            <p className="font-bold text-slate-800 mt-4">
              Follow-ups
            </p>

            <p className="text-xs text-slate-500">
              Pending follow-ups
            </p>

          </button>

          <button
            onClick={onNotifications}
            className="bg-white rounded-2xl p-5 text-left border border-pink-100 shadow-sm hover:shadow-lg"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">

                <Bell size={23} />

              </div>

              <span className="text-2xl font-bold text-pink-600">
                {notificationCount}
              </span>

            </div>

            <p className="font-bold text-slate-800 mt-4">
              Notifications
            </p>

            <p className="text-xs text-slate-500">
              Unread notifications
            </p>

          </button>

        </section>

        {/* RECENT PATIENTS */}

        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">

                <Users size={23} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  Recent Patients
                </h2>

                <p className="text-sm text-slate-500">
                  Recently registered patients
                </p>

              </div>

            </div>

            <button
              onClick={onPatients}
              className="text-sm font-semibold text-emerald-600 hover:underline"
            >
              View All
            </button>

          </div>

          {recentPatients.length === 0 ? (

            <div className="text-center py-8 text-slate-400">

              <Users
                size={35}
                className="mx-auto mb-2"
              />

              <p>No patients registered yet.</p>

            </div>

          ) : (

            <div className="space-y-3">

              {recentPatients.map(patient => (

                <div
                  key={patient.firestoreId}
                  className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">

                      {getPatientName(patient)
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <p className="font-semibold text-slate-800">
                        {getPatientName(patient)}
                      </p>

                      <p className="text-xs text-slate-500">
                        {patient.age
                          ? `${patient.age} years`
                          : 'Age not available'}
                        {patient.gender
                          ? ` • ${patient.gender}`
                          : ''}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p className="text-xs text-slate-400">
                      Registered
                    </p>

                    <p className="text-sm font-medium text-slate-600">
                      {formatDate(patient.createdAt)}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* APPOINTMENTS + FOLLOW UPS */}

        <section className="grid lg:grid-cols-2 gap-6 mb-6">

          {/* APPOINTMENTS */}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">

                  <CalendarDays size={23} />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-800">
                    Doctor Queue
                  </h2>

                  <p className="text-sm text-slate-500">
                    Active appointments
                  </p>

                </div>

              </div>

              <button
                onClick={onAppointments}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View All
              </button>

            </div>

            {recentAppointments.length === 0 ? (

              <p className="text-center text-slate-400 py-8">
                No appointments available.
              </p>

            ) : (

              <div className="space-y-3">

                {recentAppointments.map(item => (

                  <div
                    key={item.firestoreId}
                    className="border border-slate-100 rounded-xl p-4"
                  >

                    <div className="flex justify-between gap-3">

                      <div>

                        <p className="font-semibold text-slate-800">
                          {item.patientName ||
                            item.name ||
                            'Patient'}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {item.date ||
                            item.appointmentDate ||
                            formatDate(item.createdAt)}
                        </p>

                      </div>

                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg h-fit">
                        {getStatus(item)}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* FOLLOW UPS */}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">

                  <ClipboardCheck size={23} />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-800">
                    Follow-ups
                  </h2>

                  <p className="text-sm text-slate-500">
                    Patients needing follow-up
                  </p>

                </div>

              </div>

              <button
                onClick={onFollowUps}
                className="text-sm font-semibold text-teal-600 hover:underline"
              >
                View All
              </button>

            </div>

            {recentFollowUps.length === 0 ? (

              <p className="text-center text-slate-400 py-8">
                No pending follow-ups.
              </p>

            ) : (

              <div className="space-y-3">

                {recentFollowUps.map(item => (

                  <div
                    key={item.firestoreId}
                    className="border border-slate-100 rounded-xl p-4"
                  >

                    <div className="flex justify-between gap-3">

                      <div>

                        <p className="font-semibold text-slate-800">
                          {item.patientName ||
                            item.name ||
                            'Patient'}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {item.title ||
                            item.type ||
                            'Follow-up required'}
                        </p>

                      </div>

                      <span className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded-lg h-fit">
                        {getStatus(item)}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

        {/* HIGH RISK */}

        <section className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 mb-6">

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">

                <AlertTriangle size={23} />

              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-800">
                  High-Risk Patients
                </h2>

                <p className="text-sm text-slate-500">
                  Patients requiring attention
                </p>

              </div>

            </div>

            <button
              onClick={onAlerts}
              className="text-sm font-semibold text-orange-600 hover:underline"
            >
              View Alerts
            </button>

          </div>

          {highRiskRecords.length === 0 ? (

            <div className="text-center py-7">

              <ShieldCheck
                size={35}
                className="mx-auto text-emerald-500 mb-2"
              />

              <p className="text-slate-500">
                No active high-risk records.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-3">

              {highRiskRecords.map(item => (

                <div
                  key={item.firestoreId}
                  className="bg-orange-50 border border-orange-100 rounded-xl p-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">

                      <AlertTriangle size={20} />

                    </div>

                    <div>

                      <p className="font-semibold text-slate-800">

                        {item.patientName ||
                          item.name ||
                          'Patient'}

                      </p>

                      <p className="text-xs text-orange-600">

                        {item.priority ||
                          item.riskLevel ||
                          item.triageLevel ||
                          'High Risk'}

                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* QUICK ACTIONS */}

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

        {/* CONNECTED CARE */}

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

        {/* SUPPORT CARDS */}

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

        {/* FOOTER */}

        <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-8">

          <ShieldCheck size={17} />

          <span>
            CareMitra • Healthcare Support
          </span>

        </div>

      </main>

    </div>

  )
}

export default HealthWorkerDashboard