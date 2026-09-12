import {
  Search,
  Stethoscope,
  CalendarDays,
  Map,
  IndianRupee,
  FileText,
  Pill,
  FlaskConical,
  ClipboardCheck,
  Bell,
  Mic,
  WifiOff,
  User,
  HeartPulse,
  Siren,
  LogOut,
  Activity,
  ShieldCheck
} from 'lucide-react'

function PatientDashboard({
  user,
  onSearch,
  onTriage,
  onAppointment,
  onTravel,
  onCost,
  onRecords,
  onMedicines,
  onDiagnostics,
  onFollowUps,
  onNotifications,
  onVoice,
  onOffline,
  onProfile,
  onEmergency,
  onHealthSummary,
  onLogout
}) {
  const patientName = user?.name || 'Patient'
  const patientMobile = user?.mobile || ''

  const services = [
    ['Find Healthcare', 'Find doctors, hospitals and PHCs', Search, onSearch],
    ['Digital Triage', 'Check your symptoms', Stethoscope, onTriage],
    ['Appointments', 'Book and manage appointments', CalendarDays, onAppointment],
    ['Travel Planner', 'Plan your healthcare journey', Map, onTravel],
    ['Cost & Entitlement', 'View costs and scheme support', IndianRupee, onCost],
    ['Medical Records', 'View your health records', FileText, onRecords],
    ['Medicines', 'View prescriptions and medicines', Pill, onMedicines],
    ['Diagnostics', 'Book and view diagnostic tests', FlaskConical, onDiagnostics],
    ['Follow-ups', 'Track your follow-up care', ClipboardCheck, onFollowUps],
    ['Notifications', 'View important health updates', Bell, onNotifications],
    ['Voice Support', 'Healthcare support in your language', Mic, onVoice],
    ['Offline Mode', 'Access saved information offline', WifiOff, onOffline],
    ['Health Summary', 'View your complete health summary', Activity, onHealthSummary],
    ['My Profile', 'Manage your personal details', User, onProfile]
  ]

  return (
    <div className="min-h-screen bg-sky-50">

      <header className="bg-white border-b border-sky-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-sky-600 flex items-center justify-center">
              <HeartPulse size={25} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-sky-700">
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
              className="p-3 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-100"
            >
              <Bell size={20} />
            </button>

            <button
              onClick={onProfile}
              className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl"
            >
              <User size={18} className="text-sky-600" />
              <span className="hidden sm:block text-sm font-semibold text-slate-700">
                {patientName}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
            >
              <LogOut size={19} />
            </button>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        <section className="bg-gradient-to-r from-sky-600 to-cyan-500 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <p className="text-sky-100 text-sm mb-2">
                Welcome to CareMitra
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Hello, {patientName} 👋
              </h2>

              <p className="text-sky-50 mt-2">
                Your healthcare support is just a few clicks away.
              </p>

              {patientMobile && (
                <p className="text-sky-100 text-sm mt-3">
                  Phone: {patientMobile}
                </p>
              )}
            </div>

            <div className="bg-white/15 rounded-2xl p-5">
              <HeartPulse size={55} />
            </div>

          </div>
        </section>

        <button
          onClick={onEmergency}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl p-5 mb-7 flex items-center justify-between shadow-lg"
        >

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Siren size={28} />
            </div>

            <div className="text-left">
              <h3 className="text-lg font-bold">
                Emergency SOS
              </h3>

              <p className="text-red-100 text-sm">
                Get immediate emergency healthcare support
              </p>
            </div>

          </div>

          <span className="hidden sm:block bg-white text-red-600 px-5 py-2 rounded-xl font-bold">
            SOS
          </span>

        </button>

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-800">
            Healthcare Services
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Access your CareMitra services
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {services.map(([title, text, Icon, action]) => (
            <button
              key={title}
              onClick={action}
              className="bg-white rounded-2xl p-5 text-left shadow-sm border border-slate-100 hover:shadow-lg hover:border-sky-200 group"
            >

              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white">
                <Icon size={24} />
              </div>

              <h3 className="font-bold text-slate-800">
                {title}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {text}
              </p>

            </button>
          ))}

        </div>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mt-8">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Activity size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Your Care Journey
              </h2>

              <p className="text-sm text-slate-500">
                Track your healthcare journey with CareMitra
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

            {['Registration', 'Triage', 'Consultation', 'Prescription', 'Follow-up'].map(
              (step, index) => (
                <div
                  key={step}
                  className="flex flex-col items-center text-center"
                >

                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <p className="text-sm font-semibold text-slate-700 mt-2">
                    {step}
                  </p>

                </div>
              )
            )}

          </div>

        </section>

        <div className="grid md:grid-cols-3 gap-4 mt-6">

          <div className="bg-white rounded-2xl p-5 border border-sky-100">
            <HeartPulse className="text-sky-600 mb-3" size={25} />
            <h3 className="font-bold text-slate-800">
              Connected Care
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Keep your healthcare information connected across services.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-100">
            <ShieldCheck className="text-emerald-600 mb-3" size={25} />
            <h3 className="font-bold text-slate-800">
              Secure Support
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Your healthcare information is designed for secure access.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-purple-100">
            <Mic className="text-purple-600 mb-3" size={25} />
            <h3 className="font-bold text-slate-800">
              Language Support
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Access healthcare support using voice and local language.
            </p>
          </div>

        </div>

        <footer className="text-center py-8 text-sm text-slate-400">
          CareMitra • Healthcare Support
        </footer>

      </main>
    </div>
  )
}

export default PatientDashboard