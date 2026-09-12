import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  FileText,
  User,
  Search,
  Pill,
  CalendarClock,
  Activity,
  RefreshCw,
  WifiOff,
  CheckCircle,
  Eye
} from 'lucide-react'

function HealthWorkerOfflineRecords({ onBack }) {
  const defaultRecords = [
    {
      id: 'REC-1001',
      patientId: 'SC-2026-1041',
      patient: 'Lakshmi',
      age: 42,
      village: 'Kanchipuram',
      condition: 'Seasonal Fever',
      date: '10 Sep 2026',
      medicine: 'Paracetamol 500mg',
      status: 'Follow-up Required'
    },
    {
      id: 'REC-1002',
      patientId: 'SC-2026-1042',
      patient: 'Kumar',
      age: 58,
      village: 'Chengalpattu',
      condition: 'Blood Pressure Check',
      date: '09 Sep 2026',
      medicine: 'Continue prescribed medicine',
      status: 'Stable'
    },
    {
      id: 'REC-1003',
      patientId: 'SC-2026-1043',
      patient: 'Meena',
      age: 35,
      village: 'Madurantakam',
      condition: 'Breathing Difficulty',
      date: '10 Sep 2026',
      medicine: 'Urgent medical review',
      status: 'High Risk'
    },
    {
      id: 'REC-1004',
      patientId: 'SC-2026-1046',
      patient: 'Murugan',
      age: 61,
      village: 'Walajabad',
      condition: 'Chest Pain',
      date: '10 Sep 2026',
      medicine: 'Immediate hospital referral',
      status: 'Emergency'
    }
  ]

  const [records, setRecords] =
    useState(defaultRecords)

  const [patients, setPatients] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [offline, setOffline] =
    useState(false)

  const [syncing, setSyncing] =
    useState(false)

  const [selectedRecord, setSelectedRecord] =
    useState(null)

  const [lastSync, setLastSync] =
    useState(
      localStorage.getItem(
        'sevacareWorkerLastSync'
      ) ||
        '10 Sep 2026, 10:30 AM'
    )

  const loadData = () => {
    const savedPatients =
      JSON.parse(
        localStorage.getItem(
          'sevacarePatients'
        ) || '[]'
      )

    const savedTriage =
      JSON.parse(
        localStorage.getItem(
          'sevacareTriageRecords'
        ) || '[]'
      )

    setPatients(savedPatients)

    const triageRecords =
      savedTriage.map(
        (item, index) => ({
          id:
            item.id ||
            `TRIAGE-${index}`,
          patientId:
            item.patientId,
          patient:
            item.patient,
          age:
            item.age,
          village:
            item.village ||
            'Village',
          condition:
            item.symptoms?.join(
              ', '
            ) ||
            'Health Assessment',
          date:
            item.date ||
            'Recent',
          medicine:
            item.recommendation ||
            'Review required',
          status:
            item.risk === 'High'
              ? 'High Risk'
              : item.risk === 'Medium'
              ? 'Needs Review'
              : 'Stable'
        })
      )

    const combined = [
      ...triageRecords,
      ...defaultRecords
    ]

    const unique = combined.filter(
      (item, index, array) =>
        array.findIndex(
          (x) =>
            x.id === item.id
        ) === index
    )

    setRecords(unique)

    localStorage.setItem(
      'sevacareWorkerOfflineRecords',
      JSON.stringify(unique)
    )
  }

  useEffect(() => {
    loadData()

    const timer = setInterval(
      loadData,
      2000
    )

    return () =>
      clearInterval(timer)
  }, [])

  const filteredRecords =
    records.filter((record) => {
      const value =
        search.toLowerCase()

      return (
        record.patient
          .toLowerCase()
          .includes(value) ||
        record.patientId
          .toLowerCase()
          .includes(value) ||
        record.village
          .toLowerCase()
          .includes(value) ||
        record.condition
          .toLowerCase()
          .includes(value)
      )
    })

  const syncRecords = () => {
    setSyncing(true)

    loadData()

    setTimeout(() => {
      const now =
        new Date().toLocaleString(
          'en-IN'
        )

      setLastSync(now)

      localStorage.setItem(
        'sevacareWorkerLastSync',
        now
      )

      setSyncing(false)

      alert(
        'Patient records synchronized successfully.'
      )
    }, 2000)
  }

  const toggleOffline = () => {
    const value = !offline

    setOffline(value)

    if (value) {
      alert(
        'Offline Records enabled. Saved patient information remains available.'
      )
    } else {
      alert(
        'Online mode restored.'
      )
    }
  }

  const getStatusStyle = (
    status
  ) => {
    if (
      status === 'Emergency' ||
      status === 'High Risk'
    ) {
      return 'bg-red-100 text-red-700'
    }

    if (
      status === 'Needs Review' ||
      status ===
        'Follow-up Required'
    ) {
      return 'bg-orange-100 text-orange-700'
    }

    return 'bg-green-100 text-green-700'
  }

  const showRecord = (
    record
  ) => {
    setSelectedRecord(record)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
              offline
                ? 'bg-orange-100 text-orange-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {offline ? (
              <WifiOff size={17} />
            ) : (
              <CheckCircle size={17} />
            )}

            {offline
              ? 'Offline Records'
              : 'Records Online'}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="bg-gradient-to-r from-blue-700 to-green-600 rounded-3xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl">
                <FileText size={36} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  Patient Health Records
                </h1>

                <p className="text-blue-100 mt-2">
                  Access essential patient information even in low-connectivity areas.
                </p>
              </div>
            </div>

            <button
              onClick={toggleOffline}
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold"
            >
              {offline
                ? 'Go Online'
                : 'Simulate Offline'}
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-5 mt-7">
          <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
            <FileText
              className="text-blue-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Health Records
            </p>

            <p className="text-3xl font-bold text-gray-800">
              {records.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
            <User
              className="text-green-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Registered Patients
            </p>

            <p className="text-3xl font-bold text-gray-800">
              {patients.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm">
            <Activity
              className="text-red-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              High Risk Records
            </p>

            <p className="text-3xl font-bold text-red-700">
              {
                records.filter(
                  (record) =>
                    record.status ===
                      'High Risk' ||
                    record.status ===
                      'Emergency'
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
            <CalendarClock
              className="text-purple-600"
              size={28}
            />

            <p className="text-sm text-gray-500 mt-4">
              Follow-up Records
            </p>

            <p className="text-3xl font-bold text-purple-700">
              {
                records.filter(
                  (record) =>
                    record.status ===
                    'Follow-up Required'
                ).length
              }
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 mt-7">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search patient, ID, village or condition..."
              className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </section>

        <section className="space-y-5 mt-7">
          {filteredRecords.map(
            (record) => (
              <div
                key={record.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                      <FileText size={28} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-800">
                          {record.patient}
                        </h2>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>
                      </div>

                      <p className="text-sm text-blue-600 font-semibold mt-1">
                        {record.patientId}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                        <span>
                          Age {record.age}
                        </span>

                        <span className="flex items-center gap-1">
                          <MapPinIcon />
                          {record.village}
                        </span>

                        <span>
                          {record.date}
                        </span>
                      </div>

                      <p className="font-semibold text-gray-700 mt-3">
                        {record.condition}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Medicine / Action:{' '}
                        {record.medicine}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      showRecord(record)
                    }
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Eye size={18} />
                    View Record
                  </button>
                </div>
              </div>
            )
          )}

          {filteredRecords.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
              <FileText
                className="mx-auto text-gray-300"
                size={50}
              />

              <p className="text-gray-500 mt-4">
                No records found.
              </p>
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-7 mt-7">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                <RefreshCw size={25} />
              </div>

              <div>
                <h2 className="font-bold text-gray-800">
                  Record Synchronization
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Last sync: {lastSync}
                </p>
              </div>
            </div>

            <button
              onClick={syncRecords}
              disabled={syncing}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                className={
                  syncing
                    ? 'animate-spin'
                    : ''
                }
              />

              {syncing
                ? 'Syncing...'
                : 'Sync Records'}
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-7">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
            <Pill
              className="text-purple-600"
              size={30}
            />

            <h3 className="font-bold text-purple-800 text-lg mt-4">
              Medicine History
            </h3>

            <p className="text-sm text-purple-700 mt-2">
              Health workers can review medicine information from saved records.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <CalendarClock
              className="text-green-600"
              size={30}
            />

            <h3 className="font-bold text-green-800 text-lg mt-4">
              Follow-up Continuity
            </h3>

            <p className="text-sm text-green-700 mt-2">
              Previous care information helps workers continue treatment.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <WifiOff
              className="text-orange-600"
              size={30}
            />

            <h3 className="font-bold text-orange-800 text-lg mt-4">
              Low Connectivity Support
            </h3>

            <p className="text-sm text-orange-700 mt-2">
              Essential records remain accessible when network connectivity is unavailable.
            </p>
          </div>
        </section>
      </main>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Health Record
              </h2>

              <button
                onClick={() =>
                  setSelectedRecord(
                    null
                  )
                }
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 mt-5">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-3 rounded-xl">
                  <User size={24} />
                </div>

                <div>
                  <h3 className="font-bold text-xl">
                    {selectedRecord.patient}
                  </h3>

                  <p className="text-sm text-blue-600">
                    {selectedRecord.patientId}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-5 text-sm text-gray-700">
                <p>
                  <b>Age:</b>{' '}
                  {selectedRecord.age}
                </p>

                <p>
                  <b>Village:</b>{' '}
                  {selectedRecord.village}
                </p>

                <p>
                  <b>Condition:</b>{' '}
                  {selectedRecord.condition}
                </p>

                <p>
                  <b>Date:</b>{' '}
                  {selectedRecord.date}
                </p>

                <p>
                  <b>Medicine / Action:</b>{' '}
                  {selectedRecord.medicine}
                </p>

                <p>
                  <b>Status:</b>{' '}
                  {selectedRecord.status}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                alert(
                  `Patient record available offline for ${selectedRecord.patient}.`
                )
              }
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mt-5"
            >
              Confirm Offline Access
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MapPinIcon() {
  return (
    <span className="text-gray-400">
      📍
    </span>
  )
}

export default HealthWorkerOfflineRecords