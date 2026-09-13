import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft, Bell, CalendarDays, CheckCircle2, ChevronRight,
  Clock3, FlaskConical, HeartPulse, Hospital, LogOut, MapPin,
  Menu, Pill, Phone, Plus, Search, Send, Siren, Stethoscope,
  Users, Video, Activity, ClipboardList, RefreshCw,
  BedDouble, CircleDot, Building2
} from 'lucide-react'

import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'

import { db } from '../firebase'

function SectionButton({ icon: Icon, title, description, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-left hover:shadow-md hover:border-sky-200 transition flex items-center gap-4"
    >
      <div className="w-11 h-11 shrink-0 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
        <Icon size={22} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800">{title}</h3>

          {badge && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1">
          {description}
        </p>
      </div>

      <ChevronRight size={19} className="text-slate-400" />
    </button>
  )
}

function BackButton({ onBack, label = 'Back to Dashboard' }) {
  return (
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900 mb-5"
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  )
}

function DoctorDashboard({ user, onLogout }) {

  const [view, setView] = useState('dashboard')

  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])
  const [followUps, setFollowUps] = useState([])
  const [referrals, setReferrals] = useState([])

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [selectedMedicalRecords, setSelectedMedicalRecords] = useState([])

  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const [consultSaved, setConsultSaved] = useState(false)
  const [doctorAvailable, setDoctorAvailable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [savingConsultation, setSavingConsultation] = useState(false)

  const [consultation, setConsultation] = useState({
    chiefComplaint: '',
    symptoms: '',
    observations: '',
    assessment: '',
    diagnosis: '',
    treatment: ''
  })

  // --------------------------------------------------
  // LOAD FIREBASE DATA
  // --------------------------------------------------

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      const [
        patientsSnapshot,
        appointmentsSnapshot,
        followUpsSnapshot,
        referralsSnapshot
      ] = await Promise.all([
        getDocs(collection(db, 'patients')),
        getDocs(collection(db, 'appointments')),
        getDocs(collection(db, 'followUps')),
        getDocs(collection(db, 'referrals'))
      ])

      const firebasePatients = patientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const firebaseAppointments = appointmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const firebaseFollowUps = followUpsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      const firebaseReferrals = referralsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setAppointments(firebaseAppointments)
      setFollowUps(firebaseFollowUps)
      setReferrals(firebaseReferrals)

      // --------------------------------------------------
      // CREATE PATIENT LIST FROM PATIENTS + APPOINTMENTS
      // --------------------------------------------------

      const patientMap = new Map()

      firebasePatients.forEach(patient => {

        const patientId =
          patient.id ||
          patient.patientId ||
          patient.uid

        if (!patientId) return

        patientMap.set(patientId, {
          id: patientId,
          name: patient.name || patient.patient || 'Unknown',
          age: patient.age || 'Not available',
          gender: patient.gender || 'Not available',
          village: patient.village || patient.location || 'Not available',
          mobile: patient.mobile || patient.phone || 'Not available',

          blood:
            patient.blood ||
            patient.bloodGroup ||
            'Not available',

          condition:
            patient.condition ||
            patient.reason ||
            'General',

          priority: patient.priority || 'Normal',

          allergies:
            patient.allergies ||
            'None known',

          nextFollowUp:
            patient.nextFollowUp ||
            'Not scheduled',

          status:
            patient.status ||
            'Waiting',

          visits: patient.visits || [],

          ...patient
        })
      })

      // --------------------------------------------------
      // ADD PATIENTS FROM APPOINTMENTS
      // --------------------------------------------------

      firebaseAppointments.forEach(appointment => {

        const patientId =
          appointment.patientId ||
          appointment.uid ||
          appointment.id

        if (!patientId) return

        if (!patientMap.has(patientId)) {

          patientMap.set(patientId, {

            id: patientId,

            name:
              appointment.patient ||
              'Unknown',

            age:
              appointment.age ||
              'Not available',

            gender:
              appointment.gender ||
              'Not available',

            village:
              appointment.location ||
              'Not available',

            mobile:
              appointment.mobile ||
              'Not available',

            blood:
              appointment.blood ||
              appointment.bloodGroup ||
              'Not available',

            condition:
              appointment.condition ||
              appointment.reason ||
              'General',

            priority:
              appointment.priority ||
              'Normal',

            allergies:
              appointment.allergies ||
              'None known',

            nextFollowUp:
              appointment.nextFollowUp ||
              'Not scheduled',

            status:
              appointment.status ||
              'Waiting',

            visits: [],

            appointmentId:
              appointment.id,

            bookingId:
              appointment.bookingId,

            doctor:
              appointment.doctor,

            doctorId:
              appointment.doctorId,

            hospital:
              appointment.hospital,

            specialty:
              appointment.specialty,

            reason:
              appointment.reason,

            ...appointment
          })

        } else {

          const existing =
            patientMap.get(patientId)

          patientMap.set(patientId, {

            ...existing,

            name:
              existing.name !== 'Unknown'
                ? existing.name
                : appointment.patient || 'Unknown',

            mobile:
              existing.mobile !== 'Not available'
                ? existing.mobile
                : appointment.mobile || 'Not available',

            village:
              existing.village !== 'Not available'
                ? existing.village
                : appointment.location || 'Not available',

            condition:
              existing.condition !== 'General'
                ? existing.condition
                : appointment.condition ||
                  appointment.reason ||
                  'General',

            priority:
              appointment.priority ||
              existing.priority ||
              'Normal',

            status:
              appointment.status ||
              existing.status ||
              'Waiting',

            bookingId:
              appointment.bookingId ||
              existing.bookingId,

            blood:
              existing.blood !== 'Not available'
                ? existing.blood
                : appointment.blood ||
                  appointment.bloodGroup ||
                  'Not available'
          })
        }
      })

      setPatients(
        Array.from(patientMap.values())
      )

    } catch (error) {

      console.error(
        'Firebase loading error:',
        error
      )

      notify(
        'Unable to load Firebase data'
      )

    } finally {

      setLoading(false)

    }
  }

  // --------------------------------------------------
  // TOAST
  // --------------------------------------------------

  const notify = message => {

    setToast(message)

    window.setTimeout(() => {
      setToast('')
    }, 2500)

  }

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredPatients = useMemo(() => {

    return patients.filter(patient =>
      `${patient.name} ${patient.id} ${patient.condition}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )

  }, [patients, search])

  // --------------------------------------------------
  // LOAD MEDICAL RECORDS
  // --------------------------------------------------

  const loadMedicalRecords = async patientId => {

    if (!patientId) {
      setSelectedMedicalRecords([])
      return
    }

    try {

      const recordsSnapshot =
        await getDocs(
          collection(
            db,
            'patients',
            patientId,
            'medicalRecords'
          )
        )

      const records =
        recordsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

      records.sort((a, b) => {

        const aTime =
          a.createdAt?.seconds || 0

        const bTime =
          b.createdAt?.seconds || 0

        return bTime - aTime

      })

      setSelectedMedicalRecords(records)

    } catch (error) {

      console.error(
        'Medical records loading error:',
        error
      )

      setSelectedMedicalRecords([])

    }
  }

  // --------------------------------------------------
  // OPEN PATIENT
  // --------------------------------------------------

  const openPatient = async patient => {

    setSelectedPatient(patient)

    setConsultSaved(false)

    setConsultation({
      chiefComplaint: '',
      symptoms: '',
      observations: '',
      assessment: '',
      diagnosis: '',
      treatment: ''
    })

    await loadMedicalRecords(patient.id)

    setView('patient-detail')
  }

  // --------------------------------------------------
  // START CONSULTATION
  // --------------------------------------------------

  const startConsultation = async patient => {

    setSelectedPatient(patient)

    setConsultSaved(false)

    setConsultation({
      chiefComplaint: '',
      symptoms: '',
      observations: '',
      assessment: '',
      diagnosis: '',
      treatment: ''
    })

    await loadMedicalRecords(patient.id)

    setView('consultation')
  }

  // --------------------------------------------------
  // CONSULTATION INPUT
  // --------------------------------------------------

  const handleConsultationChange = (
    field,
    value
  ) => {

    setConsultation(prev => ({
      ...prev,
      [field]: value
    }))

  }

  // --------------------------------------------------
  // SAVE CONSULTATION TO FIREBASE
  // --------------------------------------------------

  const saveConsultation = async () => {

    if (!selectedPatient?.id) {

      notify(
        'Patient ID is missing'
      )

      return
    }

    const hasData =
      Object.values(consultation)
        .some(value =>
          value.trim() !== ''
        )

    if (!hasData) {

      notify(
        'Please enter consultation details'
      )

      return
    }

    try {

      setSavingConsultation(true)

      const medicalRecordsRef =
        collection(
          db,
          'patients',
          selectedPatient.id,
          'medicalRecords'
        )

      const record = {

        patient:
          selectedPatient.name,

        patientId:
          selectedPatient.id,

        doctor:
          user?.name ||
          'Doctor',

        doctorId:
          user?.uid ||
          '',

        createdAt:
          serverTimestamp(),

        chiefComplaint:
          consultation.chiefComplaint,

        symptoms:
          consultation.symptoms,

        observations:
          consultation.observations,

        assessment:
          consultation.assessment,

        diagnosis:
          consultation.diagnosis,

        treatment:
          consultation.treatment,

        type:
          'Consultation',

        source:
          'Doctor Dashboard'
      }

      const newRecord =
        await addDoc(
          medicalRecordsRef,
          record
        )

      // Add immediately to screen
      const localRecord = {
        id: newRecord.id,
        ...record,
        createdAt: {
          seconds:
            Math.floor(
              Date.now() / 1000
            )
        }
      }

      setSelectedMedicalRecords(prev => [
        localRecord,
        ...prev
      ])

      setConsultSaved(true)

      notify(
        'Consultation saved to Firebase'
      )

    } catch (error) {

      console.error(
        'Save consultation error:',
        error
      )

      notify(
        'Failed to save consultation'
      )

    } finally {

      setSavingConsultation(false)

    }
  }

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------

  const nav = [
    ['dashboard', 'Dashboard', Activity],
    ['appointments', 'Appointments', CalendarDays],
    ['queue', 'Patient Queue', Users],
    ['patients', 'Patient Records', Users],
    ['diagnostics', 'Diagnostics', FlaskConical],
    ['prescription', 'Prescriptions', Pill],
    ['medicines', 'Medicine Availability', Pill],
    ['referrals', 'Referrals', RefreshCw],
    ['followups', 'Follow-ups', ClipboardList],
    ['teleconsult', 'Teleconsultation', Video],
    ['emergency', 'Emergency Escalation', Siren],
    ['facility', 'Facility Status', Hospital],
    ['notifications', 'Notifications', Bell],
    ['profile', 'Doctor Profile', Stethoscope]
  ]

  const pageTitle = {

    dashboard:
      'Doctor Dashboard',

    appointments:
      "Today's Appointments",

    queue:
      'Patient Queue',

    patients:
      'Patient Records',

    'patient-detail':
      `${selectedPatient?.name || 'Patient'}'s Care Record`,

    consultation:
      `Consultation • ${selectedPatient?.name || 'Patient'}`,

    diagnostics:
      `Diagnostics • ${selectedPatient?.name || 'Patient'}`,

    prescription:
      `Prescription • ${selectedPatient?.name || 'Patient'}`,

    medicines:
      'Medicine Availability',

    referrals:
      `Referral Management • ${selectedPatient?.name || 'Patient'}`,

    followups:
      'Follow-up Care',

    teleconsult:
      'Teleconsultation',

    emergency:
      'Emergency Escalation',

    facility:
      'Facility Status',

    notifications:
      'Notifications',

    profile:
      'Doctor Profile'

  }[view]

  const patientHeader =
    view !== 'dashboard' &&
    view !== 'appointments' &&
    view !== 'queue' &&
    view !== 'patients' &&
    view !== 'medicines' &&
    view !== 'teleconsult' &&
    view !== 'emergency' &&
    view !== 'facility' &&
    view !== 'notifications' &&
    view !== 'profile'

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = timestamp => {

    if (!timestamp) {
      return 'Just now'
    }

    try {

      const date =
        timestamp.toDate
          ? timestamp.toDate()
          : new Date(
              timestamp.seconds * 1000
            )

      return date.toLocaleString(
        'en-IN',
        {
          dateStyle: 'medium',
          timeStyle: 'short'
        }
      )

    } catch {

      return 'Date unavailable'

    }
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 font-semibold text-slate-700">
            Loading doctor dashboard...
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Connecting to Firebase
          </p>

        </div>

      </div>
    )
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (

    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">

        <div className="max-w-[1500px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                setMobileMenu(!mobileMenu)
              }
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu size={21} />
            </button>

            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center">
              <HeartPulse
                size={22}
                className="text-white"
              />
            </div>

            <div>

              <h1 className="font-bold text-sky-700">
                CareMitra
              </h1>

              <p className="text-[10px] text-slate-400">
                Doctor Care Console
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <div
              className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl ${
                doctorAvailable
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >

              <CircleDot size={15} />

              {doctorAvailable
                ? 'Available'
                : 'Unavailable'}

            </div>

            <button
              onClick={() =>
                setView('notifications')
              }
              className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-sky-50"
            >
              <Bell size={19} />
            </button>

            <div className="hidden sm:block text-right">

              <p className="text-sm font-bold text-slate-800">
                {user?.name || 'Dr. Priya'}
              </p>

              <p className="text-xs text-slate-500">
                {user?.specialization || 'General Medicine'}
              </p>

            </div>

            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-red-50 text-red-600"
            >
              <LogOut size={18} />
            </button>

          </div>

        </div>

      </header>

      <div className="max-w-[1500px] mx-auto flex">

        {/* SIDEBAR */}

        <aside
          className={`${
            mobileMenu ? 'block' : 'hidden'
          } lg:block w-72 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto absolute z-20 lg:relative`}
        >

          <div className="p-4">

            <div className="bg-sky-50 rounded-2xl p-4 mb-4">

              <p className="text-xs text-sky-600 font-semibold">
                SIGNED IN AS
              </p>

              <p className="font-bold text-slate-800 mt-1">
                {user?.name || 'Dr. Priya'}
              </p>

              <p className="text-xs text-slate-500">
                {user?.specialization || 'General Medicine'}
              </p>

              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Building2 size={12} />
                Government PHC • Kanchipuram
              </p>

            </div>

            <div className="space-y-1">

              {nav.map(([key, title, Icon]) => (

                <button
                  key={key}
                  onClick={() => {

                    setView(key)
                    setMobileMenu(false)

                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    view === key
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >

                  <Icon size={18} />

                  <span className="flex-1 text-left">
                    {title}
                  </span>

                  {key === 'notifications' && (

                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      4
                    </span>

                  )}

                </button>

              ))}

            </div>

          </div>

        </aside>

        {/* MAIN */}

        <main className="flex-1 min-w-0 p-4 md:p-6">

          <div className="max-w-6xl mx-auto">

            {view !== 'dashboard' &&
              view !== 'patient-detail' &&
              !patientHeader && (

                <BackButton
                  onBack={() =>
                    setView('dashboard')
                  }
                />

              )}

            {view !== 'dashboard' &&
              view !== 'patient-detail' &&
              patientHeader && (

                <BackButton
                  onBack={() =>
                    setView('patient-detail')
                  }
                  label={`Back to ${selectedPatient?.name || 'Patient'}'s Record`}
                />

              )}

            {view === 'patient-detail' && (

              <BackButton
                onBack={() =>
                  setView('patients')
                }
                label="Back to Patient Records"
              />

            )}

            {view !== 'dashboard' && (

              <h2 className="text-2xl font-bold text-slate-800 mb-1">
                {pageTitle}
              </h2>

            )}

            {view !== 'dashboard' && (

              <p className="text-sm text-slate-500 mb-5">
                {patientHeader
                  ? 'Patient-specific care workspace'
                  : 'Manage care activities from one connected workspace.'}
              </p>

            )}

            {/* DASHBOARD */}

            {view === 'dashboard' && (

              <>

                <div className="bg-gradient-to-r from-sky-700 to-cyan-600 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-lg">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                      <p className="text-sky-100 text-sm">
                        Good Morning
                      </p>

                      <h2 className="text-3xl font-bold mt-1">
                        {user?.name || 'Dr. Priya'} 👋
                      </h2>

                      <p className="text-sky-50 mt-2">
                        Continuity-of-care console for your patients.
                      </p>

                      <p className="text-xs text-sky-100 mt-3 flex items-center gap-2">
                        <Building2 size={14} />
                        Government PHC • Kanchipuram •
                        {user?.specialization || 'General Medicine'}
                      </p>

                    </div>

                    <div className="bg-white/15 rounded-2xl p-5">
                      <Stethoscope size={52} />
                    </div>

                  </div>

                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">

                  {[
                    [patients.length, 'Patients', Users],
                    [appointments.length, 'Appointments', CalendarDays],
                    [referrals.length, 'Referrals', RefreshCw],
                    ['7', 'Reports to Review', FlaskConical],
                    [followUps.length, 'Follow-ups', ClipboardList],
                    [
                      patients.filter(
                        p => p.priority === 'High'
                      ).length,
                      'High Priority',
                      Siren
                    ]
                  ].map(([value, label, Icon]) => (

                    <div
                      key={label}
                      className="bg-white rounded-2xl border border-slate-100 p-4"
                    >

                      <Icon
                        size={19}
                        className="text-sky-600"
                      />

                      <p className="text-2xl font-bold text-slate-800 mt-2">
                        {value}
                      </p>

                      <p className="text-xs text-slate-500">
                        {label}
                      </p>

                    </div>

                  ))}

                </div>

                <div className="flex flex-wrap gap-2 mb-6">

                  {[
                    ['New Consultation', Stethoscope, 'consultation'],
                    ['My Patients', Users, 'patients'],
                    ['Appointments', CalendarDays, 'appointments'],
                    ['Lab Reports', FlaskConical, 'diagnostics'],
                    ['Referrals', RefreshCw, 'referrals'],
                    ['Follow-ups', ClipboardList, 'followups'],
                    ['Prescriptions', Pill, 'prescription']
                  ].map(([label, Icon, key]) => (

                    <button
                      key={label}
                      onClick={() =>
                        setView(key)
                      }
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700 flex items-center gap-2"
                    >
                      <Icon size={17} />
                      {label}
                    </button>

                  ))}

                </div>

                <div className="grid lg:grid-cols-3 gap-4">

                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">

                    <div className="flex items-center justify-between mb-4">

                      <div>

                        <h3 className="font-bold text-slate-800">
                          Today's Care Queue
                        </h3>

                        <p className="text-xs text-slate-500">
                          Patient-specific priority and consultation status
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          setView('queue')
                        }
                        className="text-sm text-sky-600 font-semibold"
                      >
                        View all
                      </button>

                    </div>

                    <div className="space-y-2">

                      {appointments.slice(0, 6).map(appointment => {

                        const patient =
                          patients.find(
                            p =>
                              p.id ===
                                appointment.patientId ||
                              p.name ===
                                appointment.patient
                          )

                        return (

                          <button
                            key={appointment.id}
                            onClick={() =>
                              patient
                                ? openPatient(patient)
                                : notify(
                                    'Patient record not found'
                                  )
                            }
                            className="w-full p-3 rounded-xl bg-slate-50 hover:bg-sky-50 flex items-center gap-3 text-left"
                          >

                            <span className="font-bold text-sm w-16">
                              {appointment.time}
                            </span>

                            <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                              {(appointment.patient || 'P')[0]}
                            </div>

                            <div className="flex-1">

                              <p className="font-semibold text-sm text-slate-800">
                                {appointment.patient}
                              </p>

                              <p className="text-xs text-slate-500">
                                {appointment.reason || 'Consultation'}
                              </p>

                            </div>

                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                appointment.priority === 'High'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {appointment.priority || 'Normal'}
                            </span>

                            <span className="text-xs text-slate-500">
                              {appointment.status}
                            </span>

                          </button>

                        )

                      })}

                    </div>

                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 p-5">

                    <h3 className="font-bold text-slate-800">
                      Doctor Availability
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      Feeds patient-facing facility status
                    </p>

                    <button
                      onClick={() =>
                        setDoctorAvailable(
                          !doctorAvailable
                        )
                      }
                      className={`w-full mt-5 p-4 rounded-2xl border ${
                        doctorAvailable
                          ? 'border-emerald-200 bg-emerald-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >

                      <span
                        className={`inline-flex items-center gap-2 font-bold ${
                          doctorAvailable
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >

                        <CircleDot size={17} />

                        {doctorAvailable
                          ? 'Doctor Available'
                          : 'Doctor Unavailable'}

                      </span>

                      <p className="text-xs text-slate-500 mt-2">
                        Last updated just now
                      </p>

                    </button>

                  </div>

                </div>

              </>

            )}

            {/* APPOINTMENTS */}

            {view === 'appointments' && (

              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

                <div className="p-5 border-b">

                  <div className="flex flex-wrap justify-between gap-3">

                    <div>

                      <h3 className="font-bold">
                        Appointments
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        {appointments.length} appointments loaded from Firebase
                      </p>

                    </div>

                    <button
                      onClick={loadData}
                      className="px-3 py-2 bg-sky-50 text-sky-700 rounded-xl text-sm font-semibold"
                    >

                      <RefreshCw
                        size={16}
                        className="inline mr-1"
                      />

                      Refresh

                    </button>

                  </div>

                </div>

                <div className="divide-y">

                  {appointments.map(appointment => {

                    const patient =
                      patients.find(
                        p =>
                          p.id ===
                            appointment.patientId ||
                          p.name ===
                            appointment.patient
                      )

                    return (

                      <div
                        key={appointment.id}
                        className="p-4 flex flex-wrap items-center gap-3"
                      >

                        <div className="w-20 font-bold">
                          {appointment.time}
                        </div>

                        <button
                          onClick={() =>
                            patient
                              ? openPatient(patient)
                              : notify(
                                  'Patient record not found'
                                )
                          }
                          className="flex-1 min-w-[180px] text-left"
                        >

                          <p className="font-semibold text-slate-800">
                            {appointment.patient}
                          </p>

                          <p className="text-xs text-slate-500">
                            {appointment.reason ||
                              appointment.specialty}
                          </p>

                        </button>

                        <span className="px-2 py-1 rounded-full text-xs bg-slate-100">
                          {appointment.priority || 'Normal'}
                        </span>

                        <span className="text-xs font-semibold text-slate-500">
                          {appointment.status}
                        </span>

                        {patient && (

                          <button
                            onClick={() =>
                              startConsultation(
                                patient
                              )
                            }
                            className="px-3 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold"
                          >
                            Start
                          </button>

                        )}

                      </div>

                    )

                  })}

                </div>

              </div>

            )}

            {/* QUEUE */}

            {view === 'queue' && (

              <div className="grid lg:grid-cols-3 gap-4">

                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">

                  <div className="flex justify-between items-center mb-4">

                    <div>

                      <h3 className="font-bold">
                        Current Queue
                      </h3>

                      <p className="text-xs text-slate-500">
                        Patients from Firebase appointments
                      </p>

                    </div>

                    <button
                      onClick={() => {

                        const next =
                          patients.find(
                            p =>
                              p.status ===
                              'Waiting'
                          )

                        if (next) {

                          notify(
                            `Next patient: ${next.name}`
                          )

                        }

                      }}
                      className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      Call Next
                    </button>

                  </div>

                  <div className="space-y-3">

                    {patients.map((p, i) => (

                      <div
                        key={p.id}
                        className="border rounded-2xl p-4 flex items-center gap-3"
                      >

                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">
                          {i + 1}
                        </div>

                        <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                          {p.name[0]}
                        </div>

                        <button
                          onClick={() =>
                            openPatient(p)
                          }
                          className="flex-1 text-left"
                        >

                          <p className="font-bold">
                            {p.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {p.id} • {p.condition}
                          </p>

                        </button>

                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            p.priority === 'High'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p.priority}
                        </span>

                        <button
                          onClick={() =>
                            startConsultation(
                              p
                            )
                          }
                          className="px-3 py-2 bg-sky-50 text-sky-700 rounded-lg text-xs font-semibold"
                        >
                          Start
                        </button>

                      </div>

                    ))}

                  </div>

                </div>

                <div className="bg-white rounded-2xl border p-5">

                  <h3 className="font-bold">
                    Queue Controls
                  </h3>

                  <div className="space-y-2 mt-4">

                    <button
                      onClick={() =>
                        notify(
                          'Priority updated'
                        )
                      }
                      className="w-full p-3 bg-slate-50 rounded-xl text-left text-sm font-semibold"
                    >
                      Change priority
                    </button>

                    <button
                      onClick={() =>
                        notify(
                          'Patient marked completed'
                        )
                      }
                      className="w-full p-3 bg-slate-50 rounded-xl text-left text-sm font-semibold"
                    >
                      Complete consultation
                    </button>

                    <button
                      onClick={() =>
                        notify(
                          'No-show recorded'
                        )
                      }
                      className="w-full p-3 bg-slate-50 rounded-xl text-left text-sm font-semibold"
                    >
                      Mark no-show
                    </button>

                  </div>

                </div>

              </div>

            )}

            {/* PATIENT RECORDS */}

            {view === 'patients' && (

              <div className="bg-white rounded-2xl border border-slate-100 p-5">

                <div className="relative mb-5">

                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={search}
                    onChange={e =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Search patient name, ID or condition"
                    className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-3">

                  {filteredPatients.map(p => (

                    <button
                      key={p.id}
                      onClick={() =>
                        openPatient(p)
                      }
                      className="p-4 border rounded-2xl text-left hover:border-sky-300 hover:bg-sky-50/40"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                          {p.name[0]}
                        </div>

                        <div className="flex-1">

                          <p className="font-bold">
                            {p.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {p.id}
                          </p>

                        </div>

                        <ChevronRight size={17} />

                      </div>

                      <div className="mt-3 flex gap-2 flex-wrap">

                        <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                          {p.condition}
                        </span>

                        <span className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded-full">
                          {p.blood ||
                            'Blood group not available'}
                        </span>

                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            p.priority === 'High'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {p.priority} priority
                        </span>

                      </div>

                    </button>

                  ))}

                </div>

                {filteredPatients.length === 0 && (

                  <div className="text-center py-10 text-slate-500">
                    No patients found.
                  </div>

                )}

              </div>

            )}

            {/* PATIENT DETAIL */}

            {view === 'patient-detail' &&
              selectedPatient && (

                <div>

                  <div className="bg-white rounded-2xl border p-5 mb-4">

                    <div className="flex flex-wrap gap-4 items-start">

                      <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold">
                        {selectedPatient.name[0]}
                      </div>

                      <div className="flex-1">

                        <h3 className="text-xl font-bold">
                          {selectedPatient.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {selectedPatient.id}
                        </p>

                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin size={14} />
                          {selectedPatient.village}
                        </p>

                        <p className="text-sm text-slate-500 mt-1">
                          📱 {selectedPatient.mobile}
                        </p>

                      </div>

                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                        {selectedPatient.priority} priority
                      </span>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

                      {[
                        ['Condition', selectedPatient.condition],
                        ['Blood Group', selectedPatient.blood],
                        ['Allergies', selectedPatient.allergies],
                        ['Next Follow-up', selectedPatient.nextFollowUp]
                      ].map(([k, v]) => (

                        <div
                          key={k}
                          className="bg-slate-50 rounded-xl p-3"
                        >

                          <p className="text-xs text-slate-500">
                            {k}
                          </p>

                          <p className="font-semibold text-sm mt-1">
                            {v || 'Not available'}
                          </p>

                        </div>

                      ))}

                    </div>

                    {selectedPatient.bookingId && (

                      <div className="mt-4 bg-sky-50 rounded-xl p-4">

                        <p className="text-xs text-sky-600 font-semibold">
                          APPOINTMENT LINKED
                        </p>

                        <p className="text-sm font-semibold text-slate-700 mt-1">
                          Booking ID: {selectedPatient.bookingId}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          This patient was automatically added from the appointments collection.
                        </p>

                      </div>

                    )}

                  </div>

                  {/* LONGITUDINAL CARE TIMELINE */}

                  <div className="bg-white rounded-2xl border p-5 mb-4">

                    <div className="flex items-center justify-between mb-4">

                      <div>

                        <h3 className="font-bold text-slate-800">
                          Longitudinal Care Timeline
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          Consultation records saved in Firebase
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          loadMedicalRecords(
                            selectedPatient.id
                          )
                        }
                        className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-sky-50"
                      >
                        <RefreshCw size={17} />
                      </button>

                    </div>

                    {selectedMedicalRecords.length === 0 ? (

                      <div className="text-center py-8 bg-slate-50 rounded-xl">

                        <ClipboardList
                          size={30}
                          className="mx-auto text-slate-400"
                        />

                        <p className="font-semibold text-slate-600 mt-2">
                          No consultation records yet
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Saved consultations will appear here.
                        </p>

                      </div>

                    ) : (

                      <div className="space-y-4">

                        {selectedMedicalRecords.map(record => (

                          <div
                            key={record.id}
                            className="relative border-l-4 border-sky-500 bg-slate-50 rounded-r-xl p-4"
                          >

                            <div className="flex flex-wrap justify-between gap-2">

                              <div>

                                <p className="font-bold text-slate-800">
                                  Doctor Consultation
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  Dr. {record.doctor || 'Doctor'}
                                </p>

                              </div>

                              <span className="text-xs text-slate-500">
                                {formatDate(
                                  record.createdAt
                                )}
                              </span>

                            </div>

                            {record.chiefComplaint && (

                              <div className="mt-3">

                                <p className="text-xs font-bold text-slate-500">
                                  Chief Complaint
                                </p>

                                <p className="text-sm text-slate-700 mt-1">
                                  {record.chiefComplaint}
                                </p>

                              </div>

                            )}

                            {record.symptoms && (

                              <div className="mt-3">

                                <p className="text-xs font-bold text-slate-500">
                                  Symptoms
                                </p>

                                <p className="text-sm text-slate-700 mt-1">
                                  {record.symptoms}
                                </p>

                              </div>

                            )}

                            {record.observations && (

                              <div className="mt-3">

                                <p className="text-xs font-bold text-slate-500">
                                  Observations
                                </p>

                                <p className="text-sm text-slate-700 mt-1">
                                  {record.observations}
                                </p>

                              </div>

                            )}

                            {record.assessment && (

                              <div className="mt-3">

                                <p className="text-xs font-bold text-slate-500">
                                  Assessment
                                </p>

                                <p className="text-sm text-slate-700 mt-1">
                                  {record.assessment}
                                </p>

                              </div>

                            )}

                            {record.diagnosis && (

                              <div className="mt-3">

                                <p className="text-xs font-bold text-slate-500">
                                  Diagnosis
                                </p>

                                <p className="text-sm font-semibold text-slate-800 mt-1">
                                  {record.diagnosis}
                                </p>

                              </div>

                            )}

                            {record.treatment && (

                              <div className="mt-3">

                                <p className="text-xs font-bold text-slate-500">
                                  Treatment
                                </p>

                                <p className="text-sm text-slate-700 mt-1">
                                  {record.treatment}
                                </p>

                              </div>

                            )}

                          </div>

                        ))}

                      </div>

                    )}

                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">

                    {[
                      [
                        'New Consultation',
                        Stethoscope,
                        'Record current symptoms, observations, diagnosis and treatment.',
                        'consultation'
                      ],
                      [
                        'Diagnostics',
                        FlaskConical,
                        'Request tests and review this patient’s reports.',
                        'diagnostics'
                      ],
                      [
                        'Prescription',
                        Pill,
                        'Create a patient-specific digital prescription.',
                        'prescription'
                      ],
                      [
                        'Referral',
                        RefreshCw,
                        'Refer this patient and track completion.',
                        'referrals'
                      ],
                      [
                        'Follow-up',
                        ClipboardList,
                        'Set reminders so this patient is not lost after today.',
                        'followups'
                      ],
                      [
                        'Emergency Escalation',
                        Siren,
                        'Escalate this patient to a higher-level facility.',
                        'emergency'
                      ]
                    ].map(([t, I, d, v]) => (

                      <SectionButton
                        key={t}
                        icon={I}
                        title={t}
                        description={d}
                        onClick={() =>
                          setView(v)
                        }
                      />

                    ))}

                  </div>

                </div>

              )}

            {/* CONSULTATION */}

            {view === 'consultation' &&
              selectedPatient && (

                <div>

                  <div className="bg-white rounded-2xl border p-5">

                    <div className="bg-sky-50 rounded-xl p-4 mb-5">

                      <p className="font-bold">
                        {selectedPatient.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {selectedPatient.condition} •{' '}
                        {selectedPatient.allergies}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Patient ID: {selectedPatient.id}
                      </p>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4">

                      {[
                        [
                          'Chief Complaint',
                          'e.g. Fever, cough, pain',
                          'chiefComplaint'
                        ],
                        [
                          'Symptoms',
                          'Describe patient-reported symptoms',
                          'symptoms'
                        ],
                        [
                          'Observations',
                          'Vitals, examination findings',
                          'observations'
                        ],
                        [
                          'Assessment',
                          'Clinical assessment',
                          'assessment'
                        ],
                        [
                          'Diagnosis',
                          'Diagnosis / suspected condition',
                          'diagnosis'
                        ],
                        [
                          'Treatment',
                          'Treatment plan',
                          'treatment'
                        ]
                      ].map(
                        ([label, placeholder, field]) => (

                          <label
                            key={field}
                            className="text-sm font-semibold text-slate-700"
                          >

                            {label}

                            <textarea
                              value={
                                consultation[field]
                              }
                              onChange={e =>
                                handleConsultationChange(
                                  field,
                                  e.target.value
                                )
                              }
                              placeholder={
                                placeholder
                              }
                              className="w-full mt-2 border rounded-xl p-3 min-h-24 font-normal outline-none focus:ring-2 focus:ring-sky-200"
                            />

                          </label>

                        )
                      )}

                    </div>

                    <button
                      disabled={
                        savingConsultation
                      }
                      onClick={
                        saveConsultation
                      }
                      className={`mt-5 px-5 py-3 rounded-xl font-bold ${
                        savingConsultation
                          ? 'bg-slate-400 text-white'
                          : 'bg-sky-600 text-white'
                      }`}
                    >

                      <CheckCircle2
                        size={17}
                        className="inline mr-2"
                      />

                      {savingConsultation
                        ? 'Saving...'
                        : consultSaved
                          ? 'Saved to Longitudinal Record'
                          : 'Save Consultation'}

                    </button>

                  </div>

                  {/* TIMELINE AFTER SAVE */}

                  <div className="bg-white rounded-2xl border p-5 mt-4">

                    <div className="flex items-center justify-between mb-4">

                      <div>

                        <h3 className="font-bold">
                          Longitudinal Care Timeline
                        </h3>

                        <p className="text-xs text-slate-500">
                          Previous consultations for {selectedPatient.name}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          loadMedicalRecords(
                            selectedPatient.id
                          )
                        }
                        className="p-2 bg-slate-50 rounded-xl"
                      >
                        <RefreshCw
                          size={17}
                        />
                      </button>

                    </div>

                    {selectedMedicalRecords.length === 0 ? (

                      <p className="text-sm text-slate-500 py-5">
                        No consultation records yet.
                      </p>

                    ) : (

                      <div className="space-y-3">

                        {selectedMedicalRecords.map(
                          record => (

                            <div
                              key={record.id}
                              className="border-l-4 border-sky-500 bg-slate-50 rounded-r-xl p-4"
                            >

                              <div className="flex justify-between gap-3">

                                <div>

                                  <p className="font-bold">
                                    Consultation
                                  </p>

                                  <p className="text-xs text-slate-500">
                                    {record.doctor}
                                  </p>

                                </div>

                                <span className="text-xs text-slate-500">
                                  {formatDate(
                                    record.createdAt
                                  )}
                                </span>

                              </div>

                              {record.diagnosis && (

                                <p className="text-sm mt-3">
                                  <strong>
                                    Diagnosis:
                                  </strong>{' '}
                                  {record.diagnosis}
                                </p>

                              )}

                              {record.treatment && (

                                <p className="text-sm mt-1">
                                  <strong>
                                    Treatment:
                                  </strong>{' '}
                                  {record.treatment}
                                </p>

                              )}

                            </div>

                          )
                        )}

                      </div>

                    )}

                  </div>

                </div>

              )}

            {/* DIAGNOSTICS */}

            {view === 'diagnostics' && (

              <div className="grid lg:grid-cols-2 gap-4">

                <div className="bg-white rounded-2xl border p-5">

                  <h3 className="font-bold">
                    Diagnostic Tests
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Patient: {selectedPatient?.name || 'Select a patient'}
                  </p>

                  <select className="w-full mt-4 border rounded-xl p-3">

                    <option>
                      Blood Test / CBC
                    </option>

                    <option>
                      X-Ray
                    </option>

                    <option>
                      Ultrasound
                    </option>

                    <option>
                      Blood Sugar
                    </option>

                    <option>
                      Lipid Profile
                    </option>

                  </select>

                  <button
                    onClick={() =>
                      notify(
                        `Diagnostic request sent for ${selectedPatient?.name || 'patient'}`
                      )
                    }
                    className="mt-4 bg-sky-600 text-white px-4 py-3 rounded-xl font-semibold"
                  >

                    <Send
                      size={16}
                      className="inline mr-2"
                    />

                    Send Request

                  </button>

                </div>

                <div className="bg-white rounded-2xl border p-5">

                  <h3 className="font-bold">
                    Patient Lab Reports
                  </h3>

                  <p className="text-sm text-slate-500 mt-3">
                    Reports connected through the diagnostics workflow.
                  </p>

                </div>

              </div>

            )}

            {/* PRESCRIPTION */}

            {view === 'prescription' && (

              <div className="bg-white rounded-2xl border p-5">

                <div className="bg-sky-50 p-4 rounded-xl mb-4">

                  <p className="font-bold">
                    {selectedPatient?.name ||
                      'Select Patient'}
                  </p>

                  <p className="text-xs text-slate-500">
                    {selectedPatient?.condition}
                  </p>

                </div>

                <div className="grid md:grid-cols-4 gap-3">

                  <input
                    placeholder="Medicine"
                    className="border rounded-xl p-3"
                  />

                  <input
                    placeholder="Dose"
                    className="border rounded-xl p-3"
                  />

                  <input
                    placeholder="Frequency"
                    className="border rounded-xl p-3"
                  />

                  <input
                    placeholder="Duration"
                    className="border rounded-xl p-3"
                  />

                </div>

                <textarea
                  placeholder="Instructions for the patient"
                  className="w-full border rounded-xl p-3 mt-3 min-h-24"
                />

                <div className="flex flex-wrap gap-2 mt-4">

                  <button
                    onClick={() =>
                      notify(
                        'Medicine added to prescription'
                      )
                    }
                    className="px-4 py-2.5 bg-slate-100 rounded-xl font-semibold"
                  >

                    <Plus
                      size={16}
                      className="inline mr-1"
                    />

                    Add Medicine

                  </button>

                  <button
                    onClick={() =>
                      notify(
                        'Digital prescription generated'
                      )
                    }
                    className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-semibold"
                  >
                    Generate Digital Prescription
                  </button>

                </div>

              </div>

            )}

            {/* MEDICINES */}

            {view === 'medicines' && (

              <div className="bg-white rounded-2xl border overflow-hidden">

                <div className="p-5 border-b">

                  <h3 className="font-bold">
                    Medicine Availability
                  </h3>

                </div>

                {[
                  ['Paracetamol 500mg', 'Available', '186 units'],
                  ['Metformin 500mg', 'Available', '72 units'],
                  ['Amoxicillin 500mg', 'Low Stock', '8 units'],
                  ['Amlodipine 5mg', 'Available', '44 units'],
                  ['ORS Solution', 'Unavailable', '0 units']
                ].map(([name, status, stock]) => (

                  <div
                    key={name}
                    className="p-4 flex items-center gap-3 border-b"
                  >

                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Pill size={19} />
                    </div>

                    <div className="flex-1">

                      <p className="font-semibold text-sm">
                        {name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {stock}
                      </p>

                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      {status}
                    </span>

                  </div>

                ))}

              </div>

            )}

            {/* REFERRALS */}

            {view === 'referrals' && (

              <div className="grid lg:grid-cols-2 gap-4">

                <div className="bg-white rounded-2xl border p-5">

                  <h3 className="font-bold">
                    Create Referral
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Patient: {selectedPatient?.name || 'Select a patient'}
                  </p>

                  <select className="w-full mt-4 border rounded-xl p-3">

                    <option>
                      District Hospital – Kanchipuram
                    </option>

                    <option>
                      Government Medical College Hospital
                    </option>

                  </select>

                  <select className="w-full mt-3 border rounded-xl p-3">

                    <option>
                      Cardiology
                    </option>

                    <option>
                      Dermatology
                    </option>

                    <option>
                      Pediatrics
                    </option>

                    <option>
                      Gynecology
                    </option>

                    <option>
                      Orthopedics
                    </option>

                  </select>

                  <textarea
                    placeholder="Reason for referral"
                    className="w-full mt-3 border rounded-xl p-3 min-h-24"
                  />

                  <button
                    onClick={() =>
                      notify(
                        `Referral created for ${selectedPatient?.name || 'patient'}`
                      )
                    }
                    className="mt-3 bg-sky-600 text-white px-5 py-3 rounded-xl font-semibold"
                  >
                    Create Referral
                  </button>

                </div>

                <div className="bg-white rounded-2xl border p-5">

                  <h3 className="font-bold">
                    Referral Records
                  </h3>

                  <p className="text-sm text-slate-500 mt-3">
                    {referrals.length} referral records loaded from Firebase.
                  </p>

                </div>

              </div>

            )}

            {/* FOLLOWUPS */}

            {view === 'followups' && (

              <div className="grid md:grid-cols-2 gap-4">

                {patients.map(p => (

                  <div
                    key={p.id}
                    className="bg-white border rounded-2xl p-5"
                  >

                    <div className="flex justify-between">

                      <div>

                        <p className="font-bold">
                          {p.name}
                        </p>

                        <p className="text-xs text-slate-500">
                          {p.condition}
                        </p>

                      </div>

                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100">
                        {p.nextFollowUp}
                      </span>

                    </div>

                    <div className="flex gap-2 mt-4">

                      <button
                        onClick={() =>
                          openPatient(p)
                        }
                        className="px-3 py-2 bg-sky-50 text-sky-700 rounded-lg text-xs font-semibold"
                      >
                        View Patient
                      </button>

                      <button
                        onClick={() =>
                          notify(
                            `Reminder set for ${p.name}`
                          )
                        }
                        className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold"
                      >
                        Set Reminder
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

            {/* TELECONSULT */}

            {view === 'teleconsult' && (

              <div className="grid lg:grid-cols-3 gap-4">

                <div className="lg:col-span-2 bg-slate-900 rounded-3xl min-h-[440px] p-5 flex flex-col justify-between text-white">

                  <div className="flex justify-between">

                    <span className="bg-white/10 px-3 py-2 rounded-xl text-sm">
                      Secure Virtual Care Room
                    </span>

                    <span className="bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-xl text-xs">
                      Ready
                    </span>

                  </div>

                  <div className="text-center">

                    <div className="w-24 h-24 rounded-full bg-white/10 mx-auto flex items-center justify-center">
                      <Video size={40} />
                    </div>

                    <h3 className="text-xl font-bold mt-4">
                      Emergency Virtual Doctor Call
                    </h3>

                    <div className="flex justify-center gap-3 mt-5">

                      <button
                        onClick={() =>
                          notify(
                            'Virtual call started'
                          )
                        }
                        className="bg-emerald-500 px-5 py-3 rounded-xl font-bold"
                      >

                        <Video
                          size={17}
                          className="inline mr-2"
                        />

                        Start Video Call

                      </button>

                      <button
                        onClick={() =>
                          notify(
                            'Audio call started'
                          )
                        }
                        className="bg-white/10 px-5 py-3 rounded-xl font-semibold"
                      >

                        <Phone
                          size={17}
                          className="inline mr-2"
                        />

                        Audio

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            )}

            {/* EMERGENCY */}

            {view === 'emergency' && (

              <div className="grid lg:grid-cols-2 gap-4">

                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">

                  <h3 className="font-bold text-red-800 flex items-center gap-2">

                    <Siren size={20} />

                    Emergency Escalation

                  </h3>

                  <select
                    onChange={e =>
                      setSelectedPatient(
                        patients.find(
                          p =>
                            p.name ===
                            e.target.value
                        ) || patients[0]
                      )
                    }
                    className="w-full mt-4 border rounded-xl p-3 bg-white"
                  >

                    {patients.map(p => (

                      <option
                        key={p.id}
                        value={p.name}
                      >
                        {p.name}
                      </option>

                    ))}

                  </select>

                  <select className="w-full mt-3 border rounded-xl p-3 bg-white">

                    <option>
                      Emergency Care
                    </option>

                    <option>
                      ICU
                    </option>

                    <option>
                      Specialist Care
                    </option>

                  </select>

                  <button
                    onClick={() =>
                      notify(
                        `Emergency escalation sent for ${selectedPatient?.name}`
                      )
                    }
                    className="mt-4 bg-red-600 text-white px-5 py-3 rounded-xl font-bold"
                  >
                    Escalate Patient
                  </button>

                </div>

                <div className="bg-white rounded-2xl border p-5">

                  <h3 className="font-bold">
                    Emergency Virtual Support
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    Connect emergency patients with virtual doctor support.
                  </p>

                  <button
                    onClick={() =>
                      setView('teleconsult')
                    }
                    className="mt-5 w-full bg-sky-600 text-white p-3 rounded-xl font-bold"
                  >

                    <Video
                      size={17}
                      className="inline mr-2"
                    />

                    Open Virtual Doctor Call

                  </button>

                </div>

              </div>

            )}

            {/* FACILITY */}

            {view === 'facility' && (

              <div className="grid md:grid-cols-2 gap-4">

                <div className="bg-white border rounded-2xl p-5">

                  <h3 className="font-bold">
                    Facility Status
                  </h3>

                  {[
                    ['Doctor Available', doctorAvailable],
                    ['Lab Available', true],
                    ['X-Ray', true],
                    ['Ultrasound', true]
                  ].map(([label, value]) => (

                    <div
                      key={label}
                      className="flex justify-between items-center py-4 border-b last:border-0"
                    >

                      <span className="text-sm font-semibold">
                        {label}
                      </span>

                      <button
                        onClick={() =>
                          label ===
                            'Doctor Available' &&
                          setDoctorAvailable(
                            !doctorAvailable
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          value
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {value
                          ? 'Available'
                          : 'Unavailable'}
                      </button>

                    </div>

                  ))}

                </div>

                <div className="bg-white border rounded-2xl p-5">

                  <h3 className="font-bold">
                    Live Facility Snapshot
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mt-4">

                    {[
                      ['Waiting Time', '25 min', Clock3],
                      ['Beds', '12 available', BedDouble],
                      ['Emergency', 'Available', Siren],
                      ['Last Updated', 'Just now', RefreshCw]
                    ].map(([a, b, I]) => (

                      <div
                        key={a}
                        className="bg-slate-50 rounded-xl p-4"
                      >

                        <I
                          size={18}
                          className="text-sky-600"
                        />

                        <p className="text-xs text-slate-500 mt-2">
                          {a}
                        </p>

                        <p className="font-bold text-sm">
                          {b}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            )}

            {/* NOTIFICATIONS */}

            {view === 'notifications' && (

              <div className="bg-white border rounded-2xl divide-y">

                {[
                  [
                    'New patient waiting',
                    'A patient is waiting for consultation',
                    '2 min ago'
                  ],
                  [
                    'Appointments updated',
                    `${appointments.length} appointments loaded`,
                    '5 min ago'
                  ],
                  [
                    'Referral records',
                    `${referrals.length} referrals loaded`,
                    '10 min ago'
                  ],
                  [
                    'Follow-ups',
                    `${followUps.length} follow-ups loaded`,
                    '15 min ago'
                  ]
                ].map(
                  ([title, description, time]) => (

                    <button
                      key={title}
                      onClick={() =>
                        notify(
                          'Notification opened'
                        )
                      }
                      className="w-full p-5 text-left flex gap-3"
                    >

                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">

                        <Bell size={18} />

                      </div>

                      <div className="flex-1">

                        <p className="font-bold text-sm">
                          {title}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {description}
                        </p>

                      </div>

                      <span className="text-xs text-slate-400">
                        {time}
                      </span>

                    </button>

                  )
                )}

              </div>

            )}

            {/* PROFILE */}

            {view === 'profile' && (

              <div className="bg-white border rounded-2xl p-6 max-w-2xl">

                <div className="flex items-center gap-4">

                  <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    <Stethoscope size={30} />
                  </div>

                  <div>

                    <h3 className="text-xl font-bold">
                      {user?.name ||
                        'Dr. Priya'}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {user?.specialization ||
                        'General Medicine'}
                    </p>

                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">

                  {[
                    [
                      'Facility',
                      'Government PHC, Kanchipuram'
                    ],
                    [
                      'Working Hours',
                      '09:00 AM – 05:00 PM'
                    ],
                    [
                      'Languages',
                      'English • Tamil'
                    ],
                    [
                      'Availability',
                      doctorAvailable
                        ? 'Available'
                        : 'Unavailable'
                    ],
                    [
                      'Contact',
                      '+91 90000 11223'
                    ],
                    [
                      'License',
                      'Clinical profile verified'
                    ]
                  ].map(([key, value]) => (

                    <div
                      key={key}
                      className="bg-slate-50 rounded-xl p-4"
                    >

                      <p className="text-xs text-slate-500">
                        {key}
                      </p>

                      <p className="font-semibold mt-1">
                        {value}
                      </p>

                    </div>

                  ))}

                </div>

                <button
                  onClick={() =>
                    setDoctorAvailable(
                      !doctorAvailable
                    )
                  }
                  className="mt-5 px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold"
                >
                  {doctorAvailable
                    ? 'Set Unavailable'
                    : 'Set Available'}
                </button>

              </div>

            )}

          </div>

        </main>

      </div>

      {/* TOAST */}

      {toast && (

        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold">
          {toast}
        </div>

      )}

    </div>
  )
}

export default DoctorDashboard