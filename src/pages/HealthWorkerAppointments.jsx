import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  Clock,
  FileText,
  Pill,
  Stethoscope,
  User,
  Activity,
  Save,
  ClipboardList
} from 'lucide-react'

const defaultAppointments = [
  {
    id: 'APT-1001',
    patientId: 'SC-2026-1043',
    patient: 'Meena',
    age: 35,
    village: 'Madurantakam',
    mobile: '+91 98765 40103',
    doctor: 'Duty Medical Officer',
    specialty: 'General Medicine',
    hospital: 'Primary Health Centre, Kanchipuram',
    date: '11/09/2026',
    time: '10:00 AM',
    reason: 'Breathing Difficulty',
    symptoms: ['Breathing Difficulty'],
    priority: 'High',
    risk: 'High',
    status: 'Waiting',
    source: 'Health Worker Triage',
    createdAt: '11/09/2026'
  },
  {
    id: 'APT-1002',
    patientId: 'SC-2026-1042',
    patient: 'Kumar',
    age: 58,
    village: 'Chengalpattu',
    mobile: '+91 98765 40102',
    doctor: 'Duty Medical Officer',
    specialty: 'General Medicine',
    hospital: 'Primary Health Centre, Kanchipuram',
    date: '11/09/2026',
    time: '11:30 AM',
    reason: 'High Fever',
    symptoms: ['Fever'],
    priority: 'Medium',
    risk: 'Medium',
    status: 'Waiting',
    source: 'Health Worker Triage',
    createdAt: '11/09/2026'
  }
]

function HealthWorkerAppointments({ onBack }) {
  const [appointments, setAppointments] = useState([])
  const [selected, setSelected] = useState(null)
  const [consulting, setConsulting] = useState(false)
  const [saved, setSaved] = useState(false)

  const [condition, setCondition] = useState('')
  const [medicine, setMedicine] = useState('')
  const [dosage, setDosage] = useState('')
  const [instructions, setInstructions] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  const loadAppointments = () => {
    const savedAppointments = JSON.parse(
      localStorage.getItem('sevacareAppointments') || '[]'
    )

    const all = [...savedAppointments, ...defaultAppointments]
    const unique = all.filter(
      (item, index, self) =>
        index === self.findIndex(x => x.id === item.id)
    )

    setAppointments(unique)
  }

  useEffect(() => {
    loadAppointments()

    const interval = setInterval(loadAppointments, 2000)

    return () => clearInterval(interval)
  }, [])

  const priorityClass = priority => {
    if (priority === 'High') return 'bg-red-100 text-red-700'
    if (priority === 'Medium') return 'bg-orange-100 text-orange-700'
    return 'bg-green-100 text-green-700'
  }

  const startConsultation = appointment => {
    setSelected(appointment)
    setConsulting(true)
    setSaved(false)

    const triageRecords = JSON.parse(
      localStorage.getItem('sevacareTriageRecords') || '[]'
    )

    const triage = triageRecords
      .filter(item => item.patientId === appointment.patientId)
      .sort((a, b) => b.createdAt?.localeCompare(a.createdAt || '') || 0)[0]

    setCondition('')
    setMedicine('')
    setDosage('')
    setInstructions('')
    setFollowUpDate('')

    const updated = appointments.map(item =>
      item.id === appointment.id
        ? { ...item, status: 'In Consultation' }
        : item
    )

    setAppointments(updated)

    const savedAppointments = JSON.parse(
      localStorage.getItem('sevacareAppointments') || '[]'
    )

    const updatedSaved = savedAppointments.map(item =>
      item.id === appointment.id
        ? { ...item, status: 'In Consultation' }
        : item
    )

    if (triage) {
      setCondition(triage.recommendation || '')
    }

    localStorage.setItem(
      'sevacareAppointments',
      JSON.stringify(updatedSaved)
    )
  }

  const saveConsultation = () => {
    if (!condition || !medicine || !dosage) {
      alert('Please enter condition, medicine and dosage')
      return
    }

    const recordId = `REC-${Date.now()}`
    const followId = `FOLLOW-${Date.now()}`

    const record = {
      id: recordId,
      patientId: selected.patientId,
      patient: selected.patient,
      age: selected.age,
      village: selected.village,
      mobile: selected.mobile,
      date: new Date().toLocaleDateString('en-IN'),
      hospital: selected.hospital,
      doctor: selected.doctor,
      condition,
      medicine,
      dosage,
      instructions: instructions || 'Follow doctor instructions.',
      type: 'Doctor Consultation',
      source: 'Health Worker Consultation',
      appointmentId: selected.id,
      createdAt: new Date().toLocaleString('en-IN')
    }

    const records = JSON.parse(
      localStorage.getItem('sevacareMedicalRecords') || '[]'
    )

    records.unshift(record)

    localStorage.setItem(
      'sevacareMedicalRecords',
      JSON.stringify(records)
    )

    const followUps = JSON.parse(
      localStorage.getItem('sevacareFollowUps') || '[]'
    )

    followUps.unshift({
      id: followId,
      patientId: selected.patientId,
      patient: selected.patient,
      age: selected.age,
      village: selected.village,
      mobile: selected.mobile,
      type: 'Medication Follow-up',
      title: 'Prescription Follow-up',
      description: `Follow up regarding ${medicine} prescribed for ${condition}.`,
      date: followUpDate || 'After consultation',
      status: 'Pending',
      priority: selected.priority || 'Normal',
      hospital: selected.hospital,
      doctor: selected.doctor,
      appointmentId: selected.id,
      recordId,
      createdAt: new Date().toLocaleString('en-IN')
    })

    localStorage.setItem(
      'sevacareFollowUps',
      JSON.stringify(followUps)
    )

    const appointmentsData = JSON.parse(
      localStorage.getItem('sevacareAppointments') || '[]'
    )

    const updatedAppointments = appointmentsData.map(item =>
      item.id === selected.id
        ? {
            ...item,
            status: 'Completed',
            consultationCompleted: true,
            recordId
          }
        : item
    )

    localStorage.setItem(
      'sevacareAppointments',
      JSON.stringify(updatedAppointments)
    )

    const statusMap = JSON.parse(
      localStorage.getItem('sevacareMedicineStatus') || '{}'
    )

    const medicineId = `RX-${recordId}`

    statusMap[medicineId] = false

    localStorage.setItem(
      'sevacareMedicineStatus',
      JSON.stringify(statusMap)
    )

    setAppointments(prev =>
      prev.map(item =>
        item.id === selected.id
          ? {
              ...item,
              status: 'Completed',
              consultationCompleted: true,
              recordId
            }
          : item
      )
    )

    setSaved(true)
  }

  if (consulting && selected) {
    return (
      <div className="min-h-screen bg-sky-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">

          <button
            onClick={() => setConsulting(false)}
            className="flex items-center gap-2 text-sky-700 font-semibold mb-6"
          >
            <ArrowLeft size={20} />
            Back to Doctor Queue
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 p-3 rounded-2xl">
                    <Stethoscope className="text-sky-600" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                      Doctor Consultation
                    </h1>
                    <p className="text-slate-500">
                      Enter consultation and prescription details
                    </p>
                  </div>
                </div>
              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                {selected.id}
              </span>
            </div>

            <div className="bg-sky-50 rounded-2xl p-5 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-sky-600" />
                <h2 className="font-bold text-lg text-slate-800">
                  Patient Details
                </h2>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Patient</p>
                  <p className="font-semibold">{selected.patient}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Patient ID</p>
                  <p className="font-semibold">{selected.patientId}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Age</p>
                  <p className="font-semibold">{selected.age} years</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Village</p>
                  <p className="font-semibold">{selected.village}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              <div className="border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-red-500" />
                  <h2 className="font-bold text-lg">
                    Clinical Information
                  </h2>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Symptoms
                  </label>

                  <div className="bg-slate-50 rounded-xl p-4">
                    {selected.symptoms?.length
                      ? selected.symptoms.join(', ')
                      : selected.reason || 'No symptoms recorded'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Diagnosis / Condition *
                  </label>

                  <input
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                    placeholder="Enter diagnosis or condition"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </div>
              </div>

              <div className="border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Pill className="text-green-600" />
                  <h2 className="font-bold text-lg">
                    Prescription
                  </h2>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Medicine *
                  </label>

                  <input
                    value={medicine}
                    onChange={e => setMedicine(e.target.value)}
                    placeholder="Example: Paracetamol 500mg"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Dosage *
                  </label>

                  <input
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                    placeholder="Example: 1 tablet twice daily"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Instructions
                  </label>

                  <textarea
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="Example: Take after food"
                    rows="3"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 resize-none"
                  />
                </div>
              </div>

            </div>

            <div className="border rounded-2xl p-5 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="text-purple-600" />
                <h2 className="font-bold text-lg">
                  Follow-up
                </h2>
              </div>

              <label className="block text-sm font-semibold mb-2">
                Follow-up Date
              </label>

              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {!saved ? (
              <button
                onClick={saveConsultation}
                className="mt-6 w-full bg-sky-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Consultation & Prescription
              </button>
            ) : (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <CheckCircle
                  className="text-green-600 mx-auto mb-3"
                  size={42}
                />

                <h2 className="text-xl font-bold text-green-700">
                  Consultation Completed
                </h2>

                <p className="text-green-700 mt-2">
                  Prescription saved successfully.
                </p>

                <div className="grid md:grid-cols-3 gap-3 mt-5">
                  <div className="bg-white rounded-xl p-4">
                    <FileText className="mx-auto text-sky-600 mb-2" />
                    <p className="font-semibold">
                      Medical Record
                    </p>
                    <p className="text-xs text-slate-500">
                      Created automatically
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <Pill className="mx-auto text-green-600 mb-2" />
                    <p className="font-semibold">
                      Medicines
                    </p>
                    <p className="text-xs text-slate-500">
                      Prescription added
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <CalendarClock className="mx-auto text-purple-600 mb-2" />
                    <p className="font-semibold">
                      Follow-up
                    </p>
                    <p className="text-xs text-slate-500">
                      Follow-up created
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setConsulting(false)}
                  className="mt-6 bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Back to Doctor Queue
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    )
  }

  const waiting = appointments.filter(
    item => item.status === 'Waiting'
  )

  const consultation = appointments.filter(
    item => item.status === 'In Consultation'
  )

  const completed = appointments.filter(
    item => item.status === 'Completed'
  )

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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-sky-100 p-3 rounded-2xl">
                  <ClipboardList
                    className="text-sky-600"
                    size={30}
                  />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Doctor Appointment & Queue
                  </h1>

                  <p className="text-slate-500">
                    Manage patients waiting for consultation
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full font-semibold">
              Live Queue
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

            <div className="bg-blue-50 rounded-2xl p-5">
              <Clock className="text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {waiting.length}
              </p>
              <p className="text-sm text-slate-500">
                Waiting
              </p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-5">
              <Stethoscope className="text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {consultation.length}
              </p>
              <p className="text-sm text-slate-500">
                In Consultation
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-5">
              <CheckCircle className="text-green-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {completed.length}
              </p>
              <p className="text-sm text-slate-500">
                Completed
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-5">
              <CalendarClock className="text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-slate-800">
                {appointments.length}
              </p>
              <p className="text-sm text-slate-500">
                Total Appointments
              </p>
            </div>

          </div>

          <div className="mt-8">

            <div className="flex items-center gap-2 mb-5">
              <Clock className="text-sky-600" />
              <h2 className="text-xl font-bold text-slate-800">
                Today's Queue
              </h2>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center bg-slate-50 rounded-2xl p-10">
                <ClipboardList
                  className="mx-auto text-slate-400 mb-3"
                  size={42}
                />

                <p className="font-semibold text-slate-600">
                  No patients in the queue
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="border rounded-2xl p-5 hover:shadow-md"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                      <div className="flex items-start gap-4">

                        <div className="bg-sky-100 rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-sky-700">
                          {index + 1}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-lg text-slate-800">
                              {appointment.patient}
                            </h3>

                            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
                              {appointment.patientId}
                            </span>

                            <span
                              className={`text-xs px-3 py-1 rounded-full font-semibold ${priorityClass(
                                appointment.priority
                              )}`}
                            >
                              {appointment.priority}
                            </span>
                          </div>

                          <p className="text-sm text-slate-500 mt-1">
                            Age {appointment.age} • {appointment.village}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock size={15} />
                              {appointment.time}
                            </span>

                            <span>
                              {appointment.reason || 'General Consultation'}
                            </span>

                            <span>
                              {appointment.specialty}
                            </span>
                          </div>
                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            appointment.status === 'Waiting'
                              ? 'bg-blue-100 text-blue-700'
                              : appointment.status === 'In Consultation'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {appointment.status}
                        </span>

                        {appointment.status !== 'Completed' && (
                          <button
                            onClick={() =>
                              startConsultation(appointment)
                            }
                            className="bg-sky-600 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
                          >
                            <Stethoscope size={18} />
                            {appointment.status === 'In Consultation'
                              ? 'Continue'
                              : 'Start Consultation'}
                          </button>
                        )}

                        {appointment.status === 'Completed' && (
                          <span className="flex items-center gap-2 text-green-600 font-semibold">
                            <CheckCircle size={20} />
                            Completed
                          </span>
                        )}

                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

          <div className="mt-8 bg-sky-50 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <FileText className="text-sky-600 mt-1" />

              <div>
                <h3 className="font-bold text-slate-800">
                  Connected Digital Care
                </h3>

                <p className="text-sm text-slate-600 mt-1">
                  Consultation prescriptions are automatically added to
                  the patient's Medical Records, Medicines and Follow-up
                  modules.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HealthWorkerAppointments