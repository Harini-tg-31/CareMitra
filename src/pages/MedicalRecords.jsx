import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Pill,
  Stethoscope,
  ShieldCheck
} from 'lucide-react'
import { collection, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'

function MedicalRecords({ onBack }) {
  const [records, setRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let unsubscribeRecords = null

    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (!user) {
        setRecords([])
        setLoading(false)
        setError('Please log in to view your medical records.')
        return
      }

      setLoading(true)
      setError('')

      const recordsRef = collection(
        db,
        'patients',
        user.uid,
        'medicalRecords'
      )

      unsubscribeRecords = onSnapshot(
        recordsRef,
        snapshot => {
          const firebaseRecords = snapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data()

            return {
              id:
                data.recordId ||
                data.id ||
                `REC-${docSnapshot.id.slice(0, 6).toUpperCase()}`,

              firestoreId: docSnapshot.id,

              patientId: data.patientId || user.uid,

              patient:
                data.patient ||
                data.patientName ||
                localStorage.getItem('caremitraUser')
                  ? getPatientName()
                  : 'CareMitra Patient',

              date: formatDate(data.date || data.createdAt),

              hospital:
                data.hospital ||
                data.hospitalName ||
                data.location ||
                'Healthcare Centre',

              doctor:
                data.doctor ||
                data.doctorName ||
                'Healthcare Provider',

              condition:
                data.condition ||
                data.diagnosis ||
                data.problem ||
                'Consultation',

              medicine:
                data.medicine ||
                data.medicines ||
                data.prescription ||
                'No prescription',

              dosage:
                data.dosage ||
                data.frequency ||
                'As directed',

              instructions:
                data.instructions ||
                data.notes ||
                data.doctorNotes ||
                'Follow the advice provided during consultation.',

              type:
                data.type ||
                data.recordType ||
                'Consultation'
            }
          })

          firebaseRecords.sort((a, b) => {
            return getDateValue(b.date) - getDateValue(a.date)
          })

          setRecords(firebaseRecords)
          setLoading(false)
        },
        firestoreError => {
          console.error(
            'Error loading medical records:',
            firestoreError
          )

          setLoading(false)
          setError(
            'Unable to load medical records. Please try again.'
          )
        }
      )
    })

    return () => {
      unsubscribeAuth()

      if (unsubscribeRecords) {
        unsubscribeRecords()
      }
    }
  }, [])

  const viewRecord = record => {
    setSelectedRecord(record)
  }

  const downloadRecord = record => {
    const text = `
CAREMitra MEDICAL RECORD

Record ID: ${record.id}
Patient ID: ${record.patientId || 'Not available'}
Patient: ${record.patient || 'CareMitra Patient'}
Date: ${record.date}

Hospital: ${record.hospital}
Doctor: ${record.doctor}

Condition:
${record.condition}

Medicine:
${record.medicine}

Dosage:
${record.dosage}

Instructions:
${record.instructions}
`

    const blob = new Blob([text], {
      type: 'text/plain'
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${record.id}.txt`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sky-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-sky-100 rounded-2xl">
                <FileText className="text-sky-600" size={30} />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Medical Records
                </h1>

                <p className="text-slate-500">
                  Your digital healthcare history and prescriptions.
                </p>
              </div>
            </div>

            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 font-semibold">
              <ShieldCheck size={20} />
              Secure Digital Record
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-sky-50 rounded-2xl p-5">
              <p className="text-sm text-slate-500">
                Total Records
              </p>

              <p className="text-3xl font-bold text-sky-700">
                {records.length}
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              <p className="text-sm text-slate-500">
                Consultations
              </p>

              <p className="text-3xl font-bold text-green-700">
                {
                  records.filter(
                    record =>
                      record.type === 'Consultation' ||
                      record.type === 'Doctor Consultation'
                  ).length
                }
              </p>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-5">
              <p className="text-sm text-slate-500">
                Prescriptions
              </p>

              <p className="text-3xl font-bold text-indigo-700">
                {
                  records.filter(
                    record =>
                      record.medicine &&
                      record.medicine !== 'No prescription' &&
                      record.medicine !== 'No prescription available'
                  ).length
                }
              </p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-slate-500 font-medium">
                Loading your medical records...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {!loading && !error && records.length === 0 && (
            <div className="bg-slate-50 rounded-2xl p-10 text-center">
              <FileText
                className="mx-auto text-slate-400 mb-4"
                size={45}
              />

              <h2 className="text-xl font-bold text-slate-700">
                No medical records yet
              </h2>

              <p className="text-slate-500 mt-2">
                Completed consultations will automatically appear here.
              </p>
            </div>
          )}

          {!loading && !error && records.length > 0 && (
            <div className="space-y-4">
              {records.map(record => (
                <div
                  key={record.firestoreId || record.id}
                  className="border border-slate-200 rounded-2xl p-5 bg-white"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-sky-100 rounded-xl">
                        <FileText
                          className="text-sky-600"
                          size={25}
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-bold text-slate-800">
                            {record.condition}
                          </h2>

                          <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold">
                            {record.type}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                          {record.id}
                        </p>

                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm text-slate-600">
                          <p className="flex items-center gap-2">
                            <Calendar size={16} />
                            {record.date}
                          </p>

                          <p className="flex items-center gap-2">
                            <Stethoscope size={16} />
                            {record.doctor}
                          </p>

                          <p className="flex items-center gap-2">
                            <User size={16} />
                            {record.hospital}
                          </p>

                          <p className="flex items-center gap-2">
                            <Pill size={16} />
                            {record.medicine}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => viewRecord(record)}
                        className="bg-sky-100 text-sky-700 px-4 py-3 rounded-xl font-semibold flex items-center gap-2"
                      >
                        <Eye size={18} />
                        View
                      </button>

                      <button
                        onClick={() => downloadRecord(record)}
                        className="bg-slate-800 text-white px-4 py-3 rounded-xl font-semibold flex items-center gap-2"
                      >
                        <Download size={18} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 bg-sky-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Connected Digital Health Record
            </h2>

            <p className="text-slate-600">
              Doctor and health worker consultations completed through
              CareMitra are automatically added to your medical records.
            </p>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Medical Record
                </h2>

                <p className="text-sm text-slate-500">
                  {selectedRecord.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-500 font-bold text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-sky-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Patient
                </p>

                <p className="font-bold text-slate-800">
                  {selectedRecord.patient || 'CareMitra Patient'}
                </p>

                <p className="text-sm text-slate-600">
                  {selectedRecord.patientId || 'Not available'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    Date
                  </p>

                  <p className="font-bold">
                    {selectedRecord.date}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    Doctor
                  </p>

                  <p className="font-bold">
                    {selectedRecord.doctor}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    Condition
                  </p>

                  <p className="font-bold">
                    {selectedRecord.condition}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">
                    Hospital
                  </p>

                  <p className="font-bold">
                    {selectedRecord.hospital}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Prescription
                </p>

                <p className="font-bold text-green-700">
                  {selectedRecord.medicine}
                </p>

                <p className="text-sm text-slate-600 mt-1">
                  {selectedRecord.dosage}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">
                  Doctor Instructions
                </p>

                <p className="font-medium text-slate-700">
                  {selectedRecord.instructions}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => downloadRecord(selectedRecord)}
                className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download Record
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/*
  Get patient name from the local CareMitra login data.
*/
function getPatientName() {
  try {
    const savedUser = JSON.parse(
      localStorage.getItem('caremitraUser') || '{}'
    )

    return (
      savedUser.name ||
      savedUser.patientName ||
      'CareMitra Patient'
    )
  } catch {
    return 'CareMitra Patient'
  }
}

/*
  Convert Firebase Timestamp, Date, string, or other date values
  into a readable date.
*/
function formatDate(value) {
  if (!value) {
    return 'Date not available'
  }

  try {
    let date

    if (value?.toDate) {
      date = value.toDate()
    } else if (value instanceof Date) {
      date = value
    } else {
      date = new Date(value)
    }

    if (Number.isNaN(date.getTime())) {
      return String(value)
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return String(value)
  }
}

/*
  Used only for sorting records by date.
*/
function getDateValue(value) {
  if (!value || value === 'Date not available') {
    return 0
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return 0
  }

  return parsed.getTime()
}

export default MedicalRecords