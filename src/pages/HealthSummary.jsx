import {
  ArrowLeft,
  HeartPulse,
  Activity,
  Droplets,
  Weight,
  Thermometer,
  Pill,
  CalendarDays,
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react'

function HealthSummary({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <header className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-sky-600">
              CareMitra
            </h1>
            <p className="text-sm text-slate-500">
              Health Summary
            </p>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-sky-600 to-emerald-500 rounded-3xl p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <HeartPulse size={38} />
            </div>

            <div>
              <p className="text-sky-100 font-semibold">
                PATIENT HEALTH SUMMARY
              </p>

              <h2 className="text-3xl font-bold mt-1">
                Your Health at a Glance
              </h2>

              <p className="text-sky-50 mt-2">
                View your important health information, recent readings,
                medicines and care status.
              </p>
            </div>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
            <div className="bg-red-100 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <HeartPulse size={25} />
            </div>

            <p className="text-slate-500 text-sm mt-4">
              Heart Rate
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              76 BPM
            </h3>

            <p className="text-green-600 text-sm font-semibold mt-2">
              Normal
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <Activity size={25} />
            </div>

            <p className="text-slate-500 text-sm mt-4">
              Blood Pressure
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              120/80
            </h3>

            <p className="text-green-600 text-sm font-semibold mt-2">
              Normal
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-cyan-100">
            <div className="bg-cyan-100 text-cyan-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <Thermometer size={25} />
            </div>

            <p className="text-slate-500 text-sm mt-4">
              Temperature
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              98.4°F
            </h3>

            <p className="text-green-600 text-sm font-semibold mt-2">
              Normal
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
              <Droplets size={25} />
            </div>

            <p className="text-slate-500 text-sm mt-4">
              SpO₂
            </p>

            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              98%
            </h3>

            <p className="text-green-600 text-sm font-semibold mt-2">
              Normal
            </p>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-lg p-7 border border-sky-100">
            <div className="flex items-center gap-3">
              <FileText className="text-sky-600" size={28} />

              <h2 className="text-xl font-bold text-slate-800">
                Patient Information
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">
                  Patient ID
                </p>
                <p className="font-bold text-slate-800 mt-1">
                  CM-2026-1048
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">
                  Age
                </p>
                <p className="font-bold text-slate-800 mt-1">
                  32 Years
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">
                  Blood Group
                </p>
                <p className="font-bold text-slate-800 mt-1">
                  O+
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">
                  Last Consultation
                </p>
                <p className="font-bold text-slate-800 mt-1">
                  05 September 2026
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-7 border border-orange-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-500" size={28} />

              <h2 className="text-xl font-bold text-slate-800">
                Health Conditions
              </h2>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                <span className="font-semibold text-slate-700">
                  General Health
                </span>

                <span className="text-green-600 font-bold">
                  Stable
                </span>
              </div>

              <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                <span className="font-semibold text-slate-700">
                  Blood Pressure
                </span>

                <span className="text-green-600 font-bold">
                  Normal
                </span>
              </div>

              <div className="flex items-center justify-between bg-green-50 rounded-xl p-4">
                <span className="font-semibold text-slate-700">
                  Diabetes
                </span>

                <span className="text-green-600 font-bold">
                  No Record
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-lg p-7 border border-purple-100">
            <div className="flex items-center gap-3">
              <Pill className="text-purple-600" size={28} />

              <h2 className="text-xl font-bold text-slate-800">
                Current Medicines
              </h2>
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center justify-between bg-purple-50 rounded-xl p-4">
                <div>
                  <p className="font-bold text-slate-800">
                    Vitamin Supplement
                  </p>
                  <p className="text-sm text-slate-500">
                    Once daily
                  </p>
                </div>

                <CheckCircle className="text-green-600" size={20} />
              </div>

              <div className="flex items-center justify-between bg-purple-50 rounded-xl p-4">
                <div>
                  <p className="font-bold text-slate-800">
                    Prescribed Medicine
                  </p>
                  <p className="text-sm text-slate-500">
                    As advised by doctor
                  </p>
                </div>

                <CheckCircle className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-7 border border-blue-100">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-blue-600" size={28} />

              <h2 className="text-xl font-bold text-slate-800">
                Upcoming Care
              </h2>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 mt-6">
              <p className="text-sm text-slate-500">
                Next Appointment
              </p>

              <p className="text-lg font-bold text-slate-800 mt-2">
                12 September 2026 · 10:30 AM
              </p>

              <p className="text-slate-600 mt-1">
                Government District Hospital
              </p>

              <div className="flex items-center gap-2 text-blue-600 font-semibold mt-4">
                <CheckCircle size={18} />
                Appointment Confirmed
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-emerald-500 to-sky-600 rounded-3xl p-7 text-white shadow-lg mb-8">
          <div className="flex items-start gap-4">
            <HeartPulse size={32} />

            <div>
              <h2 className="text-xl font-bold">
                Overall Health Status
              </h2>

              <p className="text-emerald-50 mt-2">
                Your current health information is stable. Continue
                following your care plan and attend scheduled
                appointments.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Patient Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}

export default HealthSummary