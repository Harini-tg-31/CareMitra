import { useState } from 'react'
import {
  WifiOff,
  Wifi,
  FileText,
  Pill,
  CalendarDays,
  HeartPulse,
  ClipboardCheck,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

function OfflineMode({ onBack }) {
  const [offline, setOffline] = useState(true)
  const [synced, setSynced] = useState(false)

  const handleSync = () => {
    setSynced(true)
    setTimeout(() => setSynced(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-sky-600">
              CareMitra
            </h1>
            <p className="text-sm text-slate-500">
              Offline Care Mode
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
        <section className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                {offline ? (
                  <WifiOff size={35} />
                ) : (
                  <Wifi size={35} />
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Offline Care Mode
                </h2>

                <p className="text-slate-300 mt-2">
                  Access your important healthcare information even
                  without internet connectivity.
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      offline ? 'bg-orange-400' : 'bg-green-400'
                    }`}
                  ></span>

                  <span className="font-semibold">
                    {offline
                      ? 'Offline Mode Active'
                      : 'Internet Connected'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOffline(!offline)}
              className="bg-white text-slate-800 px-5 py-3 rounded-xl font-bold"
            >
              {offline ? 'Go Online' : 'Enable Offline'}
            </button>
          </div>
        </section>

        {synced && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={22} />
            <span className="font-semibold">
              Healthcare data synchronized successfully.
            </span>
          </div>
        )}

        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Available Offline
              </h2>

              <p className="text-slate-500 mt-1">
                Important healthcare information saved on your device.
              </p>
            </div>

            <button
              onClick={handleSync}
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Sync Data
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <FileText size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-4">
                Medical Records
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                View your saved medical records and previous consultations.
              </p>

              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-4">
                <CheckCircle size={16} />
                Available Offline
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
              <div className="bg-orange-100 text-orange-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <Pill size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-4">
                Medicines
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                View saved prescriptions and medicine information.
              </p>

              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-4">
                <CheckCircle size={16} />
                Available Offline
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
              <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <CalendarDays size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-4">
                Appointments
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                View your upcoming appointment and queue information.
              </p>

              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-4">
                <CheckCircle size={16} />
                Available Offline
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
              <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <HeartPulse size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-4">
                Health Summary
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Access your saved health summary and vital information.
              </p>

              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-4">
                <CheckCircle size={16} />
                Available Offline
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
              <div className="bg-red-100 text-red-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <ClipboardCheck size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-4">
                Care Plan
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                View your saved treatment and follow-up instructions.
              </p>

              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-4">
                <CheckCircle size={16} />
                Available Offline
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
              <div className="bg-sky-100 text-sky-600 w-12 h-12 rounded-xl flex items-center justify-center">
                <WifiOff size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mt-4">
                Offline Records
              </h3>

              <p className="text-slate-500 text-sm mt-2">
                Important information remains accessible during network problems.
              </p>

              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold mt-4">
                <CheckCircle size={16} />
                Ready to Use
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-7">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
              <AlertCircle size={25} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                How Offline Care Works
              </h2>

              <p className="text-slate-500 mt-2">
                CareMitra keeps essential healthcare information available
                on the device so patients can continue accessing important
                information when internet connectivity is unavailable.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-bold text-slate-800">
                    1. Save
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Important healthcare information is saved locally.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-bold text-slate-800">
                    2. Access
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    View essential information without internet.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="font-bold text-slate-800">
                    3. Sync
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Synchronize information when connectivity returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to Patient Dashboard
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default OfflineMode