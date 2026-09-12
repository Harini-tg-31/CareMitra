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

function MedicalRecords({ onBack }) {
  const defaultRecords = [
    {
      id: 'REC-1001',
      date: '10 Sep 2026',
      hospital: 'Government District Hospital',
      doctor: 'Dr. Anitha Kumar',
      condition: 'Seasonal Fever',
      medicine: 'Paracetamol 500mg',
      dosage: 'As directed',
      instructions: 'Take adequate rest and fluids.',
      type: 'Consultation'
    },
    {
      id: 'REC-1002',
      date: '28 Aug 2026',
      hospital: 'Primary Health Centre',
      doctor: 'Dr. Ravi Kumar',
      condition: 'General Health Checkup',
      medicine: 'Vitamin Supplement',
      dosage: 'As directed',
      instructions: 'Continue regular health monitoring.',
      type: 'Checkup'
    },
    {
      id: 'REC-1003',
      date: '15 Aug 2026',
      hospital: 'District Diagnostic Centre',
      doctor: 'Laboratory Department',
      condition: 'Routine Blood Test',
      medicine: 'No prescription',
      dosage: '-',
      instructions: 'Review laboratory report with doctor.',
      type: 'Lab Report'
    }
  ]

  const [records, setRecords] = useState(defaultRecords)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const loadRecords = () => {
    const saved = JSON.parse(
      localStorage.getItem('sevacareMedicalRecords') || '[]'
    )

    const patientRecords = saved.filter(
      record => record.patientId === 'SC-2026-1048'
    )

    const combined = [...patientRecords, ...defaultRecords].filter(
      (record, index, array) =>
        array.findIndex(item => item.id === record.id) === index
    )

    setRecords(combined)
  }

  useEffect(() => {
    loadRecords()

    const interval = setInterval(loadRecords, 2000)

    return () => clearInterval(interval)
  }, [])

  const viewRecord = record => {
    setSelectedRecord(record)
  }

  const downloadRecord = record => {
    const text = `
SEVACARE MEDICAL RECORD

Record ID: ${record.id}
Patient ID: ${record.patientId || 'SC-2026-1048'}
Patient: ${record.patient || 'SevaCare Patient'}
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

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${record.id}.txt`
    link.click()

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
              <p className="text-sm text-slate-500">Total Records</p>
              <p className="text-3xl font-bold text-sky-700">
                {records.length}
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              <p className="text-sm text-slate-500">Consultations</p>
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
              <p className="text-sm text-slate-500">Prescriptions</p>
              <p className="text-3xl font-bold text-indigo-700">
                {
                  records.filter(
                    record =>
                      record.medicine &&
                      record.medicine !== 'No prescription'
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {records.map(record => (
              <div
                key={record.id}
                className="border border-slate-200 rounded-2xl p-5 bg-white"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-sky-100 rounded-xl">
                      <FileText className="text-sky-600" size={25} />
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

          <div className="mt-8 bg-sky-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Connected Digital Health Record
            </h2>

            <p className="text-slate-600">
              Doctor consultations completed through the SevaCare doctor
              queue are automatically added to your medical records.
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
                <p className="text-sm text-slate-500">Patient</p>
                <p className="font-bold text-slate-800">
                  {selectedRecord.patient || 'SevaCare Patient'}
                </p>
                <p className="text-sm text-slate-600">
                  {selectedRecord.patientId || 'SC-2026-1048'}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-bold">{selectedRecord.date}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Doctor</p>
                  <p className="font-bold">{selectedRecord.doctor}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Condition</p>
                  <p className="font-bold">
                    {selectedRecord.condition}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500">Hospital</p>
                  <p className="font-bold">
                    {selectedRecord.hospital}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Prescription</p>
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

export default MedicalRecords