import { useMemo, useState } from 'react'
import {
  ArrowLeft, Bell, CalendarDays, CheckCircle2, ChevronRight, Clock3,
  FileText, FlaskConical, HeartPulse, Hospital, LogOut, MapPin, Menu,
  Pill, Phone, Plus, Search, Send, Siren, Stethoscope, UserRound,
  Users, Video, X, Activity, ClipboardList, RefreshCw, AlertTriangle,
  BedDouble, Languages, MessageSquare, CircleDot, Building2
} from 'lucide-react'

const patients = [
  {
    id: 'SC-2026-1043', name: 'Lakshmi', age: 34, gender: 'Female', village: 'Kanchipuram',
    mobile: '98765 40101', blood: 'O+', condition: 'Type 2 Diabetes', priority: 'High',
    allergies: 'Penicillin', nextFollowUp: '18 Sep 2026', status: 'Waiting',
    visits: [
      ['12 Jan 2026', 'Consultation', 'Diabetes review and medication adjustment'],
      ['05 Feb 2026', 'Blood Test', 'HbA1c: 7.2%'],
      ['10 Feb 2026', 'Follow-up', 'Continue medication and diet plan'],
      ['18 Mar 2026', 'Referral', 'District Hospital – Endocrinology'],
      ['02 Apr 2026', 'Specialist Consultation', 'Treatment plan reviewed']
    ]
  },
  {
    id: 'SC-2026-1044', name: 'Kumar', age: 47, gender: 'Male', village: 'Madurantakam',
    mobile: '98765 40102', blood: 'B+', condition: 'Hypertension', priority: 'Normal',
    allergies: 'None known', nextFollowUp: '22 Sep 2026', status: 'Waiting',
    visits: [
      ['08 Feb 2026', 'Consultation', 'Blood pressure monitoring'],
      ['14 Mar 2026', 'Lab Test', 'Lipid profile reviewed'],
      ['20 Jun 2026', 'Prescription', 'Antihypertensive renewed']
    ]
  },
  {
    id: 'SC-2026-1045', name: 'Meena', age: 35, gender: 'Female', village: 'Madurantakam',
    mobile: '98765 40103', blood: 'A+', condition: 'Respiratory symptoms', priority: 'High',
    allergies: 'Sulfa drugs', nextFollowUp: '20 Sep 2026', status: 'In Progress',
    visits: [
      ['21 Jan 2026', 'Consultation', 'Recurring cough'],
      ['12 May 2026', 'Chest X-Ray', 'Report available for review'],
      ['10 Sep 2026', 'Emergency', 'Breathing difficulty – escalated']
    ]
  },
  {
    id: 'SC-2026-1046', name: 'Ravi', age: 29, gender: 'Male', village: 'Chengalpattu',
    mobile: '98765 40104', blood: 'AB+', condition: 'Gastritis', priority: 'Normal',
    allergies: 'None known', nextFollowUp: '25 Sep 2026', status: 'Completed',
    visits: [
      ['03 Mar 2026', 'Consultation', 'Abdominal discomfort'],
      ['03 Jun 2026', 'Follow-up', 'Symptoms improved']
    ]
  },
  {
    id: 'SC-2026-1047', name: 'Anitha', age: 52, gender: 'Female', village: 'Uthiramerur',
    mobile: '98765 40105', blood: 'O-', condition: 'Arthritis', priority: 'Normal',
    allergies: 'None known', nextFollowUp: '28 Sep 2026', status: 'Waiting',
    visits: [
      ['18 Jan 2026', 'Consultation', 'Knee pain assessment'],
      ['15 Apr 2026', 'X-Ray', 'Degenerative changes noted']
    ]
  },
  {
    id: 'SC-2026-1048', name: 'Murugan', age: 42, gender: 'Male', village: 'Kanchipuram Village',
    mobile: '98765 40106', blood: 'A+', condition: 'Back pain', priority: 'Normal',
    allergies: 'None known', nextFollowUp: '30 Sep 2026', status: 'Waiting',
    visits: [
      ['02 Feb 2026', 'Consultation', 'Lower back pain'],
      ['22 Apr 2026', 'Physiotherapy Referral', 'Referred for physiotherapy']
    ]
  }
]

const appointments = [
  { time: '09:00', patient: 'Lakshmi', type: 'Consultation', priority: 'High', status: 'Waiting' },
  { time: '09:30', patient: 'Meena', type: 'Follow-up', priority: 'High', status: 'In Progress' },
  { time: '10:00', patient: 'Kumar', type: 'Teleconsultation', priority: 'Normal', status: 'Waiting' },
  { time: '10:30', patient: 'Ravi', type: 'Consultation', priority: 'Normal', status: 'Completed' },
  { time: '11:00', patient: 'Anitha', type: 'Consultation', priority: 'Normal', status: 'Waiting' }
]

const labs = [
  { patient: 'Meena', test: 'Chest X-Ray', result: 'Abnormal values flagged', status: 'Review required' },
  { patient: 'Lakshmi', test: 'HbA1c', result: '7.2%', status: 'Completed' },
  { patient: 'Kumar', test: 'Lipid Profile', result: 'LDL 128 mg/dL', status: 'Completed' }
]

const medicines = [
  ['Paracetamol 500mg', 'Available', '186 units'],
  ['Metformin 500mg', 'Available', '72 units'],
  ['Amoxicillin 500mg', 'Low Stock', '8 units'],
  ['Amlodipine 5mg', 'Available', '44 units'],
  ['ORS Solution', 'Unavailable', '0 units']
]

function SectionButton({ icon: Icon, title, description, onClick, badge }) {
  return (
    <button onClick={onClick} className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-left hover:shadow-md hover:border-sky-200 transition flex items-center gap-4">
      <div className="w-11 h-11 shrink-0 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800">{title}</h3>
          {badge && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">{badge}</span>}
        </div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <ChevronRight size={19} className="text-slate-400" />
    </button>
  )
}

function BackButton({ onBack, label = 'Back to Dashboard' }) {
  return (
    <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900 mb-5">
      <ArrowLeft size={18} /> {label}
    </button>
  )
}

function DoctorDashboard({ user, onLogout }) {
  const [view, setView] = useState('dashboard')
  const [selectedPatient, setSelectedPatient] = useState(patients[0])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [consultSaved, setConsultSaved] = useState(false)
  const [doctorAvailable, setDoctorAvailable] = useState(true)

  const filteredPatients = useMemo(
    () => patients.filter(p => `${p.name} ${p.id} ${p.condition}`.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const notify = message => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const openPatient = patient => {
    setSelectedPatient(patient)
    setView('patient-detail')
  }

  const nav = [
    ['dashboard', 'Dashboard', Activity],
    ['appointments', 'Appointments', CalendarDays],
    ['queue', 'Patient Queue', Users],
    ['patients', 'Patient Records', UserRound],
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
    dashboard: 'Doctor Dashboard', appointments: "Today's Appointments", queue: 'Patient Queue',
    patients: 'Patient Records', 'patient-detail': `${selectedPatient.name}'s Care Record`,
    consultation: `Consultation • ${selectedPatient.name}`, diagnostics: `Diagnostics • ${selectedPatient.name}`,
    prescription: `Prescription • ${selectedPatient.name}`, medicines: 'Medicine Availability',
    referrals: `Referral Management • ${selectedPatient.name}`, followups: 'Follow-up Care',
    teleconsult: 'Teleconsultation', emergency: 'Emergency Escalation', facility: 'Facility Status',
    notifications: 'Notifications', profile: 'Doctor Profile'
  }[view]

  const patientHeader = view !== 'dashboard' && view !== 'appointments' && view !== 'queue' && view !== 'patients' && view !== 'medicines' && view !== 'teleconsult' && view !== 'emergency' && view !== 'facility' && view !== 'notifications' && view !== 'profile'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-[1500px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100"><Menu size={21} /></button>
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center"><HeartPulse size={22} className="text-white" /></div>
            <div><h1 className="font-bold text-sky-700">CareMitra</h1><p className="text-[10px] text-slate-400">Doctor Care Console</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl ${doctorAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              <CircleDot size={15} /> {doctorAvailable ? 'Available' : 'Unavailable'}
            </div>
            <button onClick={() => setView('notifications')} className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-sky-50"><Bell size={19} /></button>
            <div className="hidden sm:block text-right"><p className="text-sm font-bold text-slate-800">{user?.name || 'Dr. Priya'}</p><p className="text-xs text-slate-500">{user?.specialization || 'General Medicine'}</p></div>
            <button onClick={onLogout} className="p-2.5 rounded-xl bg-red-50 text-red-600"><LogOut size={18} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-[1500px] mx-auto flex">
        <aside className={`${mobileMenu ? 'block' : 'hidden'} lg:block w-72 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] overflow-y-auto absolute z-20 lg:relative`}>
          <div className="p-4">
            <div className="bg-sky-50 rounded-2xl p-4 mb-4">
              <p className="text-xs text-sky-600 font-semibold">SIGNED IN AS</p>
              <p className="font-bold text-slate-800 mt-1">{user?.name || 'Dr. Priya'}</p>
              <p className="text-xs text-slate-500">{user?.specialization || 'General Medicine'}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Building2 size={12} /> Government PHC • Kanchipuram</p>
            </div>
            <div className="space-y-1">
              {nav.map(([key, title, Icon]) => (
                <button key={key} onClick={() => { setView(key); setMobileMenu(false) }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${view === key ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                  <Icon size={18} /><span className="flex-1 text-left">{title}</span>
                  {key === 'notifications' && <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">4</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {view !== 'dashboard' && view !== 'patient-detail' && !patientHeader && (
              <BackButton onBack={() => setView('dashboard')} />
            )}
            {view !== 'dashboard' && view !== 'patient-detail' && patientHeader && (
              <BackButton onBack={() => setView('patient-detail')} label={`Back to ${selectedPatient.name}'s Record`} />
            )}
            {view === 'patient-detail' && (
              <BackButton onBack={() => setView('patients')} label="Back to Patient Records" />
            )}
            {view !== 'dashboard' && <h2 className="text-2xl font-bold text-slate-800 mb-1">{pageTitle}</h2>}
            {view !== 'dashboard' && <p className="text-sm text-slate-500 mb-5">{patientHeader ? 'Patient-specific care workspace' : 'Manage care activities from one connected workspace.'}</p>}

            {view === 'dashboard' && (
              <>
                <div className="bg-gradient-to-r from-sky-700 to-cyan-600 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div><p className="text-sky-100 text-sm">Good Morning</p><h2 className="text-3xl font-bold mt-1">{user?.name || 'Dr. Priya'} 👋</h2><p className="text-sky-50 mt-2">Continuity-of-care console for your patients.</p><p className="text-xs text-sky-100 mt-3 flex items-center gap-2"><Building2 size={14}/> Government PHC • Kanchipuram • {user?.specialization || 'General Medicine'}</p></div>
                    <div className="bg-white/15 rounded-2xl p-5"><Stethoscope size={52}/></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
                  {[
                    ['24', "Today's Patients", Users], ['18', 'Appointments', CalendarDays], ['5', 'Pending Referrals', RefreshCw],
                    ['7', 'Reports to Review', FlaskConical], ['12', 'Follow-ups Due', ClipboardList], ['3', 'High Priority', Siren]
                  ].map(([value, label, Icon]) => <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4"><Icon size={19} className="text-sky-600"/><p className="text-2xl font-bold text-slate-800 mt-2">{value}</p><p className="text-xs text-slate-500">{label}</p></div>)}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    ['New Consultation', Stethoscope, 'consultation'], ['My Patients', Users, 'patients'], ['Appointments', CalendarDays, 'appointments'],
                    ['Lab Reports', FlaskConical, 'diagnostics'], ['Referrals', RefreshCw, 'referrals'], ['Follow-ups', ClipboardList, 'followups'], ['Prescriptions', Pill, 'prescription']
                  ].map(([label, Icon, key]) => <button key={label} onClick={() => setView(key)} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700 flex items-center gap-2"><Icon size={17}/>{label}</button>)}
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4"><div><h3 className="font-bold text-slate-800">Today's Care Queue</h3><p className="text-xs text-slate-500">Patient-specific priority and consultation status</p></div><button onClick={() => setView('queue')} className="text-sm text-sky-600 font-semibold">View all</button></div>
                    <div className="space-y-2">
                      {appointments.slice(0, 4).map(a => {
                        const p = patients.find(x => x.name === a.patient)
                        return <button key={a.time} onClick={() => openPatient(p)} className="w-full p-3 rounded-xl bg-slate-50 hover:bg-sky-50 flex items-center gap-3 text-left">
                          <span className="font-bold text-sm w-12">{a.time}</span><div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">{a.patient[0]}</div><div className="flex-1"><p className="font-semibold text-sm text-slate-800">{a.patient}</p><p className="text-xs text-slate-500">{a.type} • {p?.condition}</p></div><span className={`text-xs px-2 py-1 rounded-full ${a.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>{a.priority}</span><span className="text-xs text-slate-500">{a.status}</span></button>
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <h3 className="font-bold text-slate-800">Doctor Availability</h3><p className="text-xs text-slate-500 mt-1">Feeds patient-facing facility status</p>
                    <button onClick={() => setDoctorAvailable(!doctorAvailable)} className={`w-full mt-5 p-4 rounded-2xl border ${doctorAvailable ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}><span className={`inline-flex items-center gap-2 font-bold ${doctorAvailable ? 'text-emerald-700' : 'text-red-700'}`}><CircleDot size={17}/>{doctorAvailable ? 'Doctor Available' : 'Doctor Unavailable'}</span><p className="text-xs text-slate-500 mt-2">Last updated just now</p></button>
                    <div className="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-amber-800 flex gap-2"><AlertTriangle size={16}/> If unavailable, emergency patients can request a virtual doctor call.</div>
                  </div>
                </div>
              </>
            )}

            {view === 'appointments' && (
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="p-5 border-b"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-bold">11 September 2026</h3><p className="text-xs text-slate-500 mt-1">18 appointments scheduled</p></div><button onClick={() => notify('Appointment calendar refreshed')} className="px-3 py-2 bg-sky-50 text-sky-700 rounded-xl text-sm font-semibold"><RefreshCw size={16} className="inline mr-1"/> Refresh</button></div></div>
                <div className="divide-y">{appointments.map(a => { const p=patients.find(x=>x.name===a.patient); return <div key={a.time} className="p-4 flex flex-wrap items-center gap-3"><div className="w-14 font-bold">{a.time}</div><button onClick={()=>openPatient(p)} className="flex-1 min-w-[180px] text-left"><p className="font-semibold text-slate-800">{a.patient}</p><p className="text-xs text-slate-500">{a.type} • {p?.condition}</p></button><span className={`px-2 py-1 rounded-full text-xs ${a.priority==='High'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-600'}`}>{a.priority}</span><span className="text-xs font-semibold text-slate-500">{a.status}</span><div className="flex gap-2"><button onClick={()=>{setSelectedPatient(p);setView('consultation')}} className="px-3 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold">Start</button><button onClick={()=>notify(`${a.patient} appointment marked completed`)} className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">Complete</button></div></div>})}</div>
              </div>
            )}

            {view === 'queue' && (
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5"><div className="flex justify-between items-center mb-4"><div><h3 className="font-bold">Current Queue</h3><p className="text-xs text-slate-500">Priority-aware consultation order</p></div><button onClick={()=>notify('Next patient: Lakshmi')} className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">Call Next</button></div>
                  <div className="space-y-3">{patients.slice(0,5).map((p,i)=><div key={p.id} className="border rounded-2xl p-4 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold">{i+1}</div><div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">{p.name[0]}</div><button onClick={()=>openPatient(p)} className="flex-1 text-left"><p className="font-bold">{p.name}</p><p className="text-xs text-slate-500">{p.id} • {p.condition}</p></button><span className={`px-2 py-1 rounded-full text-xs ${p.priority==='High'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-600'}`}>{p.priority}</span><button onClick={()=>notify(`${p.name} consultation started`)} className="px-3 py-2 bg-sky-50 text-sky-700 rounded-lg text-xs font-semibold">Start</button></div>)}</div>
                </div>
                <div className="bg-white rounded-2xl border p-5"><h3 className="font-bold">Queue Controls</h3><div className="space-y-2 mt-4"><button onClick={()=>notify('Priority updated')} className="w-full p-3 bg-slate-50 rounded-xl text-left text-sm font-semibold">Change priority</button><button onClick={()=>notify('Patient marked completed')} className="w-full p-3 bg-slate-50 rounded-xl text-left text-sm font-semibold">Complete consultation</button><button onClick={()=>notify('No-show recorded')} className="w-full p-3 bg-slate-50 rounded-xl text-left text-sm font-semibold">Mark no-show</button></div></div>
              </div>
            )}

            {view === 'patients' && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <div className="relative mb-5"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patient name, ID or condition" className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-sky-200"/></div>
                <div className="grid md:grid-cols-2 gap-3">{filteredPatients.map(p=><button key={p.id} onClick={()=>openPatient(p)} className="p-4 border rounded-2xl text-left hover:border-sky-300 hover:bg-sky-50/40"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">{p.name[0]}</div><div className="flex-1"><p className="font-bold">{p.name}</p><p className="text-xs text-slate-500">{p.id} • {p.age} yrs • {p.village}</p></div><ChevronRight size={17}/></div><div className="mt-3 flex gap-2 flex-wrap"><span className="text-xs bg-slate-100 px-2 py-1 rounded-full">{p.condition}</span><span className={`text-xs px-2 py-1 rounded-full ${p.priority==='High'?'bg-red-100 text-red-700':'bg-emerald-100 text-emerald-700'}`}>{p.priority} priority</span></div></button>)}</div>
              </div>
            )}

            {view === 'patient-detail' && (
              <div>
                <div className="bg-white rounded-2xl border p-5 mb-4"><div className="flex flex-wrap gap-4 items-start"><div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-bold">{selectedPatient.name[0]}</div><div className="flex-1"><h3 className="text-xl font-bold">{selectedPatient.name}</h3><p className="text-sm text-slate-500">{selectedPatient.id} • {selectedPatient.age} years • {selectedPatient.gender}</p><p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><MapPin size={14}/>{selectedPatient.village} • +91 {selectedPatient.mobile}</p></div><span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">{selectedPatient.priority} priority</span></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">{[['Condition',selectedPatient.condition],['Blood Group',selectedPatient.blood],['Allergies',selectedPatient.allergies],['Next Follow-up',selectedPatient.nextFollowUp]].map(([k,v])=><div key={k} className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-500">{k}</p><p className="font-semibold text-sm mt-1">{v}</p></div>)}</div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">{[
                  ['New Consultation',Stethoscope,'Record current symptoms, observations, diagnosis and treatment.','consultation'],
                  ['Diagnostics',FlaskConical,'Request tests and review this patient’s reports.','diagnostics'],
                  ['Prescription',Pill,'Create a patient-specific digital prescription.','prescription'],
                  ['Referral',RefreshCw,'Refer this patient and track completion.','referrals'],
                  ['Follow-up',ClipboardList,'Set reminders so this patient is not lost after today.','followups'],
                  ['Emergency Escalation',Siren,'Escalate this patient to a higher-level facility.','emergency']
                ].map(([t,I,d,v])=><SectionButton key={t} icon={I} title={t} description={d} onClick={()=>setView(v)} />)}</div>
                <div className="bg-white rounded-2xl border p-5"><h3 className="font-bold mb-4">Longitudinal Care Timeline</h3><div className="space-y-4">{selectedPatient.visits.map(([date,type,note])=><div key={date+type} className="flex gap-3"><div className="w-3 h-3 mt-1.5 rounded-full bg-sky-500 shrink-0"/><div><p className="text-xs text-slate-400">{date}</p><p className="font-semibold text-sm">{type}</p><p className="text-sm text-slate-500">{note}</p></div></div>)}</div></div>
              </div>
            )}

            {view === 'consultation' && (
              <div><div className="bg-white rounded-2xl border p-5"><div className="bg-sky-50 rounded-xl p-4 mb-5"><p className="font-bold">{selectedPatient.name}</p><p className="text-xs text-slate-500">{selectedPatient.condition} • {selectedPatient.allergies} allergies</p></div><div className="grid md:grid-cols-2 gap-4">{[['Chief Complaint','e.g. Fever, cough, pain'],['Symptoms','Describe patient-reported symptoms'],['Observations','Vitals, examination findings'],['Assessment','Clinical assessment'],['Diagnosis','Diagnosis / suspected condition'],['Treatment','Treatment plan']].map(([l,p])=><label key={l} className="text-sm font-semibold text-slate-700">{l}<textarea placeholder={p} className="w-full mt-2 border rounded-xl p-3 min-h-24 font-normal outline-none focus:ring-2 focus:ring-sky-200"/></label>)}</div><label className="block text-sm font-semibold text-slate-700 mt-4">Follow-up date<input type="date" className="block w-full md:w-72 mt-2 border rounded-xl p-3 font-normal"/></label><button onClick={()=>{setConsultSaved(true);notify('Consultation saved to patient record')}} className="mt-5 bg-sky-600 text-white px-5 py-3 rounded-xl font-bold"><CheckCircle2 size={17} className="inline mr-2"/>{consultSaved?'Saved to Longitudinal Record':'Save Consultation'}</button></div></div>
            )}

            {view === 'diagnostics' && (
              <div><div className="grid lg:grid-cols-2 gap-4"><div className="bg-white rounded-2xl border p-5"><h3 className="font-bold">Request Diagnostic Test</h3><p className="text-xs text-slate-500 mt-1">For {selectedPatient.name} • {selectedPatient.id}</p><select className="w-full mt-4 border rounded-xl p-3"><option>Blood Test / CBC</option><option>X-Ray</option><option>Ultrasound</option><option>Blood Sugar</option><option>Lipid Profile</option></select><div className="mt-4 grid gap-2">{['Lab A • 1.2 km • Available','Lab B • 3.5 km • Available','Lab C • 5.1 km • Unavailable'].map(x=><div key={x} className="p-3 bg-slate-50 rounded-xl text-sm flex justify-between"><span>{x}</span><span className="text-emerald-600">●</span></div>)}</div><button onClick={()=>notify(`Diagnostic request sent for ${selectedPatient.name}`)} className="mt-4 bg-sky-600 text-white px-4 py-3 rounded-xl font-semibold"><Send size={16} className="inline mr-2"/>Send Request</button></div><div className="bg-white rounded-2xl border p-5"><h3 className="font-bold">Patient Lab Reports</h3><div className="space-y-3 mt-4">{labs.map(l=><div key={l.test+l.patient} className="border rounded-xl p-3"><div className="flex justify-between"><p className="font-semibold text-sm">{l.test}</p><span className="text-xs text-slate-500">{l.status}</span></div><p className="text-xs text-slate-500 mt-1">{l.patient} • {l.result}</p><button onClick={()=>notify(`${l.test} marked reviewed`)} className="text-xs text-sky-700 font-semibold mt-2">Open & Review</button></div>)}</div></div></div></div>
            )}

            {view === 'prescription' && (
              <div><div className="bg-white rounded-2xl border p-5"><div className="bg-sky-50 p-4 rounded-xl mb-4"><p className="font-bold">{selectedPatient.name}</p><p className="text-xs text-slate-500">{selectedPatient.condition}</p></div><div className="grid md:grid-cols-4 gap-3"><input placeholder="Medicine" className="border rounded-xl p-3"/><input placeholder="Dose e.g. 1 tablet" className="border rounded-xl p-3"/><input placeholder="Frequency" className="border rounded-xl p-3"/><input placeholder="Duration" className="border rounded-xl p-3"/></div><textarea placeholder="Instructions for the patient" className="w-full border rounded-xl p-3 mt-3 min-h-24"/><div className="flex flex-wrap gap-2 mt-4"><button onClick={()=>notify('Medicine added to prescription')} className="px-4 py-2.5 bg-slate-100 rounded-xl font-semibold"><Plus size={16} className="inline mr-1"/>Add Medicine</button><button onClick={()=>notify('Digital prescription generated')} className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-semibold">Generate Digital Prescription</button></div><div className="mt-5 border rounded-xl p-4"><p className="text-xs text-slate-500">Medicine availability check</p><p className="font-semibold mt-1">Metformin 500mg • <span className="text-emerald-600">Available</span></p></div></div></div>
            )}

            {view === 'medicines' && (
              <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-5 border-b"><h3 className="font-bold">Participating Facility Medicine Stock</h3><p className="text-xs text-slate-500 mt-1">Check stock before prescribing or guide the patient to another facility.</p></div><div className="divide-y">{medicines.map(([name,status,stock])=><div key={name} className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center"><Pill size={19}/></div><div className="flex-1"><p className="font-semibold text-sm">{name}</p><p className="text-xs text-slate-500">{stock}</p></div><span className={`px-3 py-1 rounded-full text-xs font-semibold ${status==='Available'?'bg-emerald-100 text-emerald-700':status==='Low Stock'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700'}`}>{status}</span></div>)}</div></div>
            )}

            {view === 'referrals' && (
              <div><div className="grid lg:grid-cols-2 gap-4"><div className="bg-white rounded-2xl border p-5"><h3 className="font-bold">Create Referral</h3><p className="text-xs text-slate-500 mt-1">Patient: {selectedPatient.name} • {selectedPatient.id}</p><div className="space-y-3 mt-4"><select className="w-full border rounded-xl p-3"><option>District Hospital – Kanchipuram</option><option>Government Medical College Hospital</option></select><select className="w-full border rounded-xl p-3"><option>Cardiology</option><option>Dermatology</option><option>Pediatrics</option><option>Gynecology</option><option>Orthopedics</option></select><select className="w-full border rounded-xl p-3"><option>High Priority</option><option>Normal</option></select><textarea placeholder="Reason for referral" className="w-full border rounded-xl p-3 min-h-24"/><button onClick={()=>notify(`Referral created for ${selectedPatient.name}`)} className="bg-sky-600 text-white px-5 py-3 rounded-xl font-semibold">Create Referral</button></div></div><div className="bg-white rounded-2xl border p-5"><h3 className="font-bold">Referral Tracking</h3><div className="space-y-4 mt-5">{[['Referral Created',true],['Hospital Received',true],['Appointment Booked',true],['Patient Visited',false],['Follow-up',false]].map(([s,done])=><div key={s} className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center ${done?'bg-emerald-100 text-emerald-600':'bg-slate-100 text-slate-400'}`}>{done?<CheckCircle2 size={17}/>:<Clock3 size={17}/>}</div><p className="font-semibold text-sm">{s}</p></div>)}</div></div></div></div>
            )}

            {view === 'followups' && (
              <div className="grid md:grid-cols-2 gap-4">{patients.map(p=><div key={p.id} className="bg-white border rounded-2xl p-5"><div className="flex justify-between"><div><p className="font-bold">{p.name}</p><p className="text-xs text-slate-500">{p.condition}</p></div><span className={`text-xs px-2 py-1 rounded-full ${p.priority==='High'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-600'}`}>{p.nextFollowUp}</span></div><p className="text-sm text-slate-600 mt-4">Follow-up purpose: review progress, reports and treatment response.</p><div className="flex gap-2 mt-4"><button onClick={()=>{setSelectedPatient(p);setView('patient-detail')}} className="px-3 py-2 bg-sky-50 text-sky-700 rounded-lg text-xs font-semibold">View Patient</button><button onClick={()=>notify(`Reminder set for ${p.name}`)} className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">Set Reminder</button></div></div>)}</div>
            )}

            {view === 'teleconsult' && (
              <div className="grid lg:grid-cols-3 gap-4"><div className="lg:col-span-2 bg-slate-900 rounded-3xl min-h-[440px] p-5 flex flex-col justify-between text-white"><div className="flex justify-between"><span className="bg-white/10 px-3 py-2 rounded-xl text-sm">Secure Virtual Care Room</span><span className="bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-xl text-xs">Ready</span></div><div className="text-center"><div className="w-24 h-24 rounded-full bg-white/10 mx-auto flex items-center justify-center"><Video size={40}/></div><h3 className="text-xl font-bold mt-4">Emergency Virtual Doctor Call</h3><p className="text-slate-300 text-sm mt-2 max-w-md mx-auto">If the doctor is unavailable at the patient's hospital, an emergency patient can request a virtual video consultation with an available doctor.</p><div className="flex justify-center gap-3 mt-5"><button onClick={()=>notify('Virtual call started with patient')} className="bg-emerald-500 px-5 py-3 rounded-xl font-bold"><Video size={17} className="inline mr-2"/>Start Video Call</button><button onClick={()=>notify('Audio call started')} className="bg-white/10 px-5 py-3 rounded-xl font-semibold"><Phone size={17} className="inline mr-2"/>Audio</button></div></div><div className="text-xs text-slate-400 flex justify-between"><span>Patient record can stay open beside the call</span><span>Emergency priority enabled</span></div></div><div className="bg-white rounded-2xl border p-5"><h3 className="font-bold">Waiting Patients</h3><div className="space-y-2 mt-4">{patients.slice(0,4).map(p=><button key={p.id} onClick={()=>openPatient(p)} className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-sky-50"><p className="font-semibold text-sm">{p.name}</p><p className="text-xs text-slate-500">{p.condition} • {p.priority}</p></button>)}</div><div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex gap-2"><Siren size={16}/> Emergency patients are placed at the top of the virtual queue.</div></div></div>
            )}

            {view === 'emergency' && (
              <div className="grid lg:grid-cols-2 gap-4"><div className="bg-red-50 border border-red-100 rounded-2xl p-5"><h3 className="font-bold text-red-800 flex items-center gap-2"><Siren size={20}/> Emergency Escalation</h3><p className="text-sm text-red-700 mt-1">Select the patient who needs urgent higher-level care.</p><select onChange={e=>setSelectedPatient(patients.find(p=>p.name===e.target.value)||patients[0])} className="w-full mt-4 border rounded-xl p-3 bg-white">{patients.map(p=><option key={p.id}>{p.name}</option>)}</select><div className="grid md:grid-cols-2 gap-3 mt-3"><select className="border rounded-xl p-3 bg-white"><option>Emergency Care</option><option>ICU</option><option>Specialist Care</option></select><select className="border rounded-xl p-3 bg-white"><option>Critical</option><option>High</option></select></div><select className="w-full mt-3 border rounded-xl p-3 bg-white"><option>District Emergency Hospital • Available</option><option>Government Medical College • Available</option></select><button onClick={()=>notify(`Emergency escalation sent for ${selectedPatient.name}`)} className="mt-4 bg-red-600 text-white px-5 py-3 rounded-xl font-bold">Escalate Patient</button></div><div className="bg-white rounded-2xl border p-5"><h3 className="font-bold">Emergency Virtual Support</h3><p className="text-sm text-slate-500 mt-2">When the local doctor is unavailable, connect the patient to an available virtual doctor while arranging escalation.</p><button onClick={()=>setView('teleconsult')} className="mt-5 w-full bg-sky-600 text-white p-3 rounded-xl font-bold"><Video size={17} className="inline mr-2"/>Open Virtual Doctor Call</button></div></div>
            )}

            {view === 'facility' && (
              <div className="grid md:grid-cols-2 gap-4"><div className="bg-white border rounded-2xl p-5"><h3 className="font-bold">Facility Status</h3><p className="text-xs text-slate-500 mt-1">Authorized staff can publish current operational information.</p>{[['Doctor Available',doctorAvailable],['Lab Available',true],['X-Ray',true],['Ultrasound',true]].map(([label,val])=><div key={label} className="flex justify-between items-center py-4 border-b last:border-0"><span className="text-sm font-semibold">{label}</span><button onClick={()=>label==='Doctor Available'&&setDoctorAvailable(!doctorAvailable)} className={`px-3 py-1.5 rounded-full text-xs font-bold ${val?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>{val?'Available':'Unavailable'}</button></div>)}</div><div className="bg-white border rounded-2xl p-5"><h3 className="font-bold">Live Facility Snapshot</h3><div className="grid grid-cols-2 gap-3 mt-4">{[['Waiting Time','25 min',Clock3],['Beds','12 available',BedDouble],['Emergency','Available',Siren],['Last Updated','8 min ago',RefreshCw]].map(([a,b,I])=><div key={a} className="bg-slate-50 rounded-xl p-4"><I size={18} className="text-sky-600"/><p className="text-xs text-slate-500 mt-2">{a}</p><p className="font-bold text-sm">{b}</p></div>)}</div></div></div>
            )}

            {view === 'notifications' && (
              <div className="bg-white border rounded-2xl divide-y">{[['New patient waiting','Lakshmi is waiting for consultation','2 min ago'],['Lab report available','Meena’s Chest X-Ray is ready for review','8 min ago'],['Referral accepted','Kumar’s referral was accepted by District Hospital','25 min ago'],['Follow-up due','3 high-priority follow-ups need attention today','1 hr ago']].map(([t,d,time],i)=><button key={t} onClick={()=>notify('Notification opened')} className="w-full p-5 text-left flex gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i===1?'bg-amber-50 text-amber-600':'bg-sky-50 text-sky-600'}`}><Bell size={18}/></div><div className="flex-1"><p className="font-bold text-sm">{t}</p><p className="text-xs text-slate-500 mt-1">{d}</p></div><span className="text-xs text-slate-400">{time}</span></button>)}</div>
            )}

            {view === 'profile' && (
              <div className="bg-white border rounded-2xl p-6 max-w-2xl"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center"><Stethoscope size={30}/></div><div><h3 className="text-xl font-bold">{user?.name || 'Dr. Priya'}</h3><p className="text-sm text-slate-500">{user?.specialization || 'General Medicine'}</p></div></div><div className="grid sm:grid-cols-2 gap-4 mt-6">{[['Facility','Government PHC, Kanchipuram'],['Working Hours','09:00 AM – 05:00 PM'],['Languages','English • Tamil'],['Availability',doctorAvailable?'Available':'Unavailable'],['Contact','+91 90000 11223'],['License','Clinical profile verified']].map(([k,v])=><div key={k} className="bg-slate-50 rounded-xl p-4"><p className="text-xs text-slate-500">{k}</p><p className="font-semibold mt-1">{v}</p></div>)}</div><button onClick={()=>setDoctorAvailable(!doctorAvailable)} className="mt-5 px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold">{doctorAvailable?'Set Unavailable':'Set Available'}</button></div>
            )}
          </div>
        </main>
      </div>

      {toast && <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm font-semibold">{toast}</div>}
    </div>
  )
}

export default DoctorDashboard
