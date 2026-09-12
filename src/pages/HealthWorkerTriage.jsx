import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Activity,
  User,
  Thermometer,
  HeartPulse,
  Wind,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  CalendarClock,
  ClipboardPlus,
  Users
} from 'lucide-react'

function HealthWorkerTriage({
  onBack,
  onReferral,
  onHealthSummary,
  onAppointments,
  prefillPatient
}) {
  const defaultPatients = [
    {
      id: 'SC-2026-1041',
      name: 'Lakshmi',
      age: 42,
      village: 'Kanchipuram Village',
      mobile: '+91 98765 40101'
    },
    {
      id: 'SC-2026-1042',
      name: 'Kumar',
      age: 58,
      village: 'Chengalpattu Village',
      mobile: '+91 98765 40102'
    },
    {
      id: 'SC-2026-1043',
      name: 'Meena',
      age: 35,
      village: 'Madurantakam Village',
      mobile: '+91 98765 40103'
    },
    {
      id: 'SC-2026-1044',
      name: 'Ravi',
      age: 67,
      village: 'Uthiramerur Village',
      mobile: '+91 98765 40104'
    },
    {
      id: 'SC-2026-1046',
      name: 'Murugan',
      age: 61,
      village: 'Walajabad Village',
      mobile: '+91 98765 40106'
    }
  ]

  const [patients, setPatients] = useState(defaultPatients)
  const [selectedPatient, setSelectedPatient] = useState(prefillPatient || null)
  const [symptoms, setSymptoms] = useState([])
  const [temperature, setTemperature] = useState('')
  const [pulse, setPulse] = useState('')
  const [oxygen, setOxygen] = useState('')
  const [result, setResult] = useState(null)
  const [queueAdded, setQueueAdded] = useState(false)
  const [queueAppointment, setQueueAppointment] = useState(null)

  const symptomList = [
    'Fever',
    'Cough',
    'Breathing Difficulty',
    'Chest Pain',
    'Headache',
    'Vomiting',
    'Diarrhea',
    'Dizziness',
    'Weakness'
  ]

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sevacarePatients') || '[]')
    const combined = [...saved, ...defaultPatients].filter(
      (patient, index, array) =>
        array.findIndex(item => item.id === patient.id) === index
    )
    setPatients(combined)

    if (prefillPatient) {
      const found = combined.find(patient => patient.id === prefillPatient.id)
      setSelectedPatient(found || prefillPatient)
    }
  }, [prefillPatient])

  const toggleSymptom = symptom => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(item => item !== symptom)
        : [...prev, symptom]
    )
  }

  const assessRisk = () => {
    if (!selectedPatient) {
      alert('Please select a patient')
      return
    }

    if (symptoms.length === 0) {
      alert('Please select at least one symptom')
      return
    }

    let risk = 'Low'
    let recommendation = 'Routine monitoring and follow-up are recommended.'

    const highRisk =
      symptoms.includes('Chest Pain') ||
      symptoms.includes('Breathing Difficulty') ||
      (oxygen && Number(oxygen) < 92)

    const mediumRisk =
      (temperature && Number(temperature) >= 101) ||
      (pulse && (Number(pulse) > 100 || Number(pulse) < 60)) ||
      symptoms.length >= 3

    if (highRisk) {
      risk = 'High'
      recommendation =
        'Immediate medical attention is recommended. Consider emergency response or hospital referral.'
    } else if (mediumRisk) {
      risk = 'Medium'
      recommendation =
        'Doctor consultation is recommended. Monitor the patient closely.'
    }

    const triageResult = {
      id: `TRIAGE-${Date.now()}`,
      patientId: selectedPatient.id,
      patient: selectedPatient.name,
      age: selectedPatient.age,
      village: selectedPatient.village,
      mobile: selectedPatient.mobile,
      symptoms,
      temperature: temperature || 'Not recorded',
      pulse: pulse || 'Not recorded',
      oxygen: oxygen || 'Not recorded',
      risk,
      recommendation,
      date: new Date().toLocaleString('en-IN')
    }

    const records = JSON.parse(
      localStorage.getItem('sevacareTriageRecords') || '[]'
    )

    localStorage.setItem(
      'sevacareTriageRecords',
      JSON.stringify([triageResult, ...records])
    )

    if (risk === 'High') {
      const alerts = JSON.parse(
        localStorage.getItem('sevacareHighRiskAlerts') || '[]'
      )

      const riskAlert = {
        id: `RISK-${Date.now()}`,
        patientId: selectedPatient.id,
        patient: selectedPatient.name,
        age: selectedPatient.age,
        village: selectedPatient.village,
        mobile: selectedPatient.mobile,
        reason: symptoms.join(', '),
        oxygen: oxygen || 'Not recorded',
        status: 'Pending Review',
        source: 'Health Worker Triage',
        createdAt: new Date().toLocaleString('en-IN')
      }

      localStorage.setItem(
        'sevacareHighRiskAlerts',
        JSON.stringify([riskAlert, ...alerts])
      )

      const emergencies = JSON.parse(
        localStorage.getItem('sevacareEmergencyAlerts') || '[]'
      )

      const existingEmergency = emergencies.find(
        alert =>
          alert.patientId === selectedPatient.id &&
          alert.status !== 'Handled'
      )

      if (!existingEmergency) {
        const emergency = {
          id: `TRIAGE-SOS-${Date.now()}`,
          patient: selectedPatient.name,
          patientId: selectedPatient.id,
          age: selectedPatient.age,
          location: selectedPatient.village,
          emergency: symptoms.join(', '),
          time: new Date().toLocaleString('en-IN'),
          phone: selectedPatient.mobile,
          status: 'New',
          source: 'Health Worker Triage'
        }

        localStorage.setItem(
          'sevacareEmergencyAlerts',
          JSON.stringify([emergency, ...emergencies])
        )
      }
    }

    setResult(triageResult)
    setQueueAdded(false)
    setQueueAppointment(null)
  }

  const addToDoctorQueue = () => {
    if (!result) return

    const appointments = JSON.parse(
      localStorage.getItem('sevacareAppointments') || '[]'
    )

    const existing = appointments.find(
      appointment => appointment.triageId === result.id
    )

    if (existing) {
      setQueueAppointment(existing)
      setQueueAdded(true)
      return
    }

    const priority =
      result.risk === 'High'
        ? 'High'
        : result.risk === 'Medium'
          ? 'Medium'
          : 'Normal'

    const appointment = {
      id: `APT-TRIAGE-${Date.now()}`,
      patientId: result.patientId,
      patient: result.patient,
      age: result.age,
      village: result.village,
      mobile: result.mobile,
      doctor: 'Duty Medical Officer',
      specialty: 'General Medicine',
      hospital: 'Primary Health Centre, Kanchipuram',
      location: 'Kanchipuram',
      date: new Date().toLocaleDateString('en-IN'),
      time: 'Next Available',
      reason: result.symptoms.join(', '),
      symptoms: result.symptoms,
      priority,
      risk: result.risk,
      status: 'Waiting',
      source: 'Health Worker Triage',
      triageId: result.id,
      createdAt: new Date().toLocaleString('en-IN')
    }

    localStorage.setItem(
      'sevacareAppointments',
      JSON.stringify([appointment, ...appointments])
    )

    setQueueAppointment(appointment)
    setQueueAdded(true)
  }

  const resetTriage = () => {
    setSymptoms([])
    setTemperature('')
    setPulse('')
    setOxygen('')
    setResult(null)
    setQueueAdded(false)
    setQueueAppointment(null)
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
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-100 rounded-2xl">
                  <Stethoscope className="text-sky-600" size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    Patient Triage
                  </h1>
                  <p className="text-slate-500">
                    Assess symptoms, risk and connect the patient to care.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 rounded-2xl px-5 py-3">
              <p className="text-sm text-slate-500">Health Worker</p>
              <p className="font-bold text-sky-700">SevaCare Health Worker</p>
            </div>
          </div>

          {!result ? (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Select Patient
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.map(patient => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`text-left p-4 rounded-2xl border-2 ${
                        selectedPatient?.id === patient.id
                          ? 'border-sky-500 bg-sky-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-100 rounded-xl">
                          <User className="text-sky-600" size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {patient.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {patient.id}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-slate-600">
                        <p>Age: {patient.age}</p>
                        <p>{patient.village}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPatient && (
                <div className="bg-sky-50 rounded-2xl p-5 mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="text-sky-600" />
                    <h2 className="text-xl font-bold text-slate-800">
                      Selected Patient
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="font-bold">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Patient ID</p>
                      <p className="font-bold">{selectedPatient.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Age</p>
                      <p className="font-bold">{selectedPatient.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Village</p>
                      <p className="font-bold">{selectedPatient.village}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Symptoms
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {symptomList.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-4 rounded-xl border-2 text-left ${
                        symptoms.includes(symptom)
                          ? 'border-sky-500 bg-sky-50 text-sky-700'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {symptoms.includes(symptom) ? (
                          <CheckCircle size={18} />
                        ) : (
                          <Activity size={18} />
                        )}
                        <span className="font-medium">{symptom}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Vital Signs
                </h2>

                <div className="grid md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      Temperature °F
                    </label>
                    <div className="relative">
                      <Thermometer
                        size={20}
                        className="absolute left-3 top-3 text-slate-400"
                      />
                      <input
                        type="number"
                        value={temperature}
                        onChange={e => setTemperature(e.target.value)}
                        placeholder="98.6"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      Pulse BPM
                    </label>
                    <div className="relative">
                      <HeartPulse
                        size={20}
                        className="absolute left-3 top-3 text-slate-400"
                      />
                      <input
                        type="number"
                        value={pulse}
                        onChange={e => setPulse(e.target.value)}
                        placeholder="72"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      Oxygen %
                    </label>
                    <div className="relative">
                      <Wind
                        size={20}
                        className="absolute left-3 top-3 text-slate-400"
                      />
                      <input
                        type="number"
                        value={oxygen}
                        onChange={e => setOxygen(e.target.value)}
                        placeholder="98"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={assessRisk}
                className="w-full md:w-auto bg-sky-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <Activity size={20} />
                Complete Triage Assessment
              </button>
            </>
          ) : (
            <div>
              <div
                className={`rounded-3xl p-6 mb-6 ${
                  result.risk === 'High'
                    ? 'bg-red-50 border border-red-200'
                    : result.risk === 'Medium'
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-green-50 border border-green-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  {result.risk === 'High' ? (
                    <AlertTriangle className="text-red-600" size={40} />
                  ) : (
                    <CheckCircle
                      className={
                        result.risk === 'Medium'
                          ? 'text-amber-600'
                          : 'text-green-600'
                      }
                      size={40}
                    />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Triage Result
                    </p>
                    <h2
                      className={`text-3xl font-bold ${
                        result.risk === 'High'
                          ? 'text-red-700'
                          : result.risk === 'Medium'
                            ? 'text-amber-700'
                            : 'text-green-700'
                      }`}
                    >
                      {result.risk} Risk
                    </h2>
                  </div>
                </div>

                <p className="mt-5 text-slate-700">
                  {result.recommendation}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="font-bold text-lg mb-4">Patient Details</h3>
                  <div className="space-y-2 text-slate-600">
                    <p>
                      <strong>Name:</strong> {result.patient}
                    </p>
                    <p>
                      <strong>ID:</strong> {result.patientId}
                    </p>
                    <p>
                      <strong>Age:</strong> {result.age}
                    </p>
                    <p>
                      <strong>Village:</strong> {result.village}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {result.mobile}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5">
                  <h3 className="font-bold text-lg mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl p-3 text-center">
                      <Thermometer className="mx-auto text-red-500 mb-1" size={20} />
                      <p className="text-xs text-slate-500">Temp</p>
                      <p className="font-bold">{result.temperature}</p>
                    </div>

                    <div className="bg-white rounded-xl p-3 text-center">
                      <HeartPulse className="mx-auto text-pink-500 mb-1" size={20} />
                      <p className="text-xs text-slate-500">Pulse</p>
                      <p className="font-bold">{result.pulse}</p>
                    </div>

                    <div className="bg-white rounded-xl p-3 text-center">
                      <Wind className="mx-auto text-sky-500 mb-1" size={20} />
                      <p className="text-xs text-slate-500">Oxygen</p>
                      <p className="font-bold">{result.oxygen}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
                <h3 className="font-bold text-lg mb-4">Reported Symptoms</h3>

                <div className="flex flex-wrap gap-2">
                  {result.symptoms.map(symptom => (
                    <span
                      key={symptom}
                      className="bg-sky-100 text-sky-700 px-3 py-2 rounded-full text-sm font-semibold"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              {result.risk === 'High' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-red-600" />
                    <div>
                      <h3 className="font-bold text-red-700">
                        Emergency Alert Created
                      </h3>
                      <p className="text-sm text-red-600">
                        The Emergency Response Centre has been notified.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!queueAdded ? (
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl">
                      <ClipboardPlus className="text-sky-600" size={28} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800">
                        Connect to Doctor Queue
                      </h3>
                      <p className="text-slate-600 mt-1 mb-4">
                        Add this triaged patient directly to the doctor queue.
                        Patient details, symptoms and risk level will be carried
                        automatically.
                      </p>

                      <button
                        onClick={addToDoctorQueue}
                        className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                      >
                        <Users size={20} />
                        Add to Doctor Queue
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="text-green-600" size={32} />

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-700">
                        Added to Doctor Queue
                      </h3>

                      <p className="text-green-700 mt-1">
                        {queueAppointment?.patient} has been successfully added
                        to the doctor queue.
                      </p>

                      <div className="grid md:grid-cols-3 gap-3 mt-4">
                        <div className="bg-white rounded-xl p-3">
                          <p className="text-xs text-slate-500">Queue ID</p>
                          <p className="font-bold text-slate-800">
                            {queueAppointment?.id}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-3">
                          <p className="text-xs text-slate-500">Priority</p>
                          <p className="font-bold text-slate-800">
                            {queueAppointment?.priority}
                          </p>
                        </div>

                        <div className="bg-white rounded-xl p-3">
                          <p className="text-xs text-slate-500">Status</p>
                          <p className="font-bold text-green-700">
                            {queueAppointment?.status}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={onAppointments}
                        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                      >
                        <CalendarClock size={20} />
                        Open Doctor Queue
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => onHealthSummary(selectedPatient)}
                  className="bg-indigo-600 text-white p-4 rounded-xl font-bold"
                >
                  View Health Summary
                </button>

                <button
                  onClick={() => onReferral(selectedPatient)}
                  className="bg-orange-500 text-white p-4 rounded-xl font-bold"
                >
                  Create Hospital Referral
                </button>

                <button
                  onClick={resetTriage}
                  className="bg-slate-700 text-white p-4 rounded-xl font-bold"
                >
                  New Triage
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HealthWorkerTriage