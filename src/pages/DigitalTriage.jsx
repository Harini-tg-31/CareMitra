import { useState } from 'react'
import {
  ArrowLeft,
  Activity,
  CheckCircle,
  AlertTriangle,
  Siren,
  RotateCcw,
  ArrowRight
} from 'lucide-react'

import { auth, db } from '../firebase'

import {
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore'

function DigitalTriage({ onBack }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const symptoms = [
    'Fever',
    'Cough',
    'Cold',
    'Headache',
    'Body Pain',
    'Stomach Pain',
    'Vomiting',
    'Breathing Difficulty',
    'Chest Pain',
    'Severe Bleeding',
    'Unconsciousness',
    'Severe Abdominal Pain'
  ]

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((current) => {
      if (current.includes(symptom)) {
        return current.filter((item) => item !== symptom)
      }

      return [...current, symptom]
    })
  }

  const getTriageResult = (selected) => {
    const emergencySymptoms = [
      'Breathing Difficulty',
      'Chest Pain',
      'Severe Bleeding',
      'Unconsciousness'
    ]

    const needsDoctorSymptoms = [
      'Severe Abdominal Pain',
      'Vomiting',
      'Fever',
      'Stomach Pain'
    ]

    if (
      selected.some((symptom) =>
        emergencySymptoms.includes(symptom)
      )
    ) {
      return 'emergency'
    }

    if (
      selected.some((symptom) =>
        needsDoctorSymptoms.includes(symptom)
      )
    ) {
      return 'doctor'
    }

    return 'normal'
  }

  const resultData = {
    normal: {
      title: 'Normal',
      message:
        'Your selected symptoms do not indicate an immediate concern.',
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      button: 'bg-green-600 hover:bg-green-700',
      action:
        'Continue monitoring your symptoms.'
    },

    doctor: {
      title: 'Needs Doctor',
      message:
        'Your symptoms may require medical attention.',
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      action:
        'Consider booking an appointment with a doctor.'
    },

    emergency: {
      title: 'Emergency',
      message:
        'Your symptoms may require immediate medical attention.',
      icon: Siren,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      button: 'bg-red-600 hover:bg-red-700',
      action:
        'Please seek emergency medical help immediately.'
    }
  }

  const saveTriageToFirebase = async (triageResult) => {
    try {
      const user = auth.currentUser

      if (!user) {
        alert('Please login before using Digital Triage.')
        return false
      }

      setSaving(true)

      const triageRecord = {
        patientId: user.uid,

        symptoms: selectedSymptoms,

        result: triageResult,

        recommendation:
          resultData[triageResult].action,

        message:
          resultData[triageResult].message,

        status: 'Completed',

        createdAt: serverTimestamp()
      }

      await addDoc(
        collection(db, 'triageRecords'),
        triageRecord
      )

      setSaved(true)

      return true
    } catch (error) {
      console.error(
        'Error saving triage record:',
        error
      )

      alert(
        'Unable to save triage record. Please try again.'
      )

      return false
    } finally {
      setSaving(false)
    }
  }

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom')
      return
    }

    const triageResult =
      getTriageResult(selectedSymptoms)

    setResult(triageResult)

    await saveTriageToFirebase(triageResult)
  }

  const resetTriage = () => {
    setSelectedSymptoms([])
    setResult(null)
    setSaved(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">

      {/* HEADER */}

      <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">

        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center gap-4">

          <button
            onClick={onBack}
            className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Digital Triage
            </h1>

            <p className="text-sm text-gray-500">
              Check your symptoms and understand the next step
            </p>
          </div>

        </div>

      </header>

      {/* MAIN */}

      <main className="max-w-5xl mx-auto px-5 py-8">

        {/* HERO */}

        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-7 md:p-9 text-white shadow-xl">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">

              <Activity size={30} />

            </div>

            <div>

              <h2 className="text-2xl md:text-3xl font-bold">
                How are you feeling?
              </h2>

              <p className="text-blue-100 mt-1">
                Select all the symptoms you are experiencing.
              </p>

            </div>

          </div>

        </div>

        {/* SYMPTOM SELECTION */}

        {!result && (

          <div className="bg-white rounded-3xl shadow-lg border border-blue-50 p-6 md:p-8 mt-6">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Select Symptoms
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  You can select more than one.
                </p>

              </div>

              <div className="bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-sm font-semibold">

                {selectedSymptoms.length} selected

              </div>

            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">

              {symptoms.map((symptom) => {

                const selected =
                  selectedSymptoms.includes(symptom)

                return (

                  <button
                    key={symptom}
                    onClick={() =>
                      toggleSymptom(symptom)
                    }
                    className={`p-4 rounded-2xl border-2 text-left font-semibold transition-all ${
                      selected
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-gray-100 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                  >

                    <div className="flex items-center justify-between gap-2">

                      <span>
                        {symptom}
                      </span>

                      {selected && (

                        <CheckCircle
                          size={20}
                          className="text-blue-600 flex-shrink-0"
                        />

                      )}

                    </div>

                  </button>

                )
              })}

            </div>

            {/* CHECK BUTTON */}

            <button
              onClick={checkSymptoms}
              disabled={saving}
              className={`w-full mt-8 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                saving
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
            >

              {saving
                ? 'Saving Triage...'
                : 'Check My Symptoms'}

              {!saving && (
                <ArrowRight size={20} />
              )}

            </button>

            <p className="text-xs text-gray-400 text-center mt-4">

              This tool provides guidance and does not replace professional medical advice.

            </p>

          </div>

        )}

        {/* RESULT */}

        {result && (

          <div className="mt-6">

            {(() => {

              const data = resultData[result]

              const Icon = data.icon

              return (

                <div
                  className={`rounded-3xl border ${data.border} ${data.bg} p-7 md:p-9 shadow-lg`}
                >

                  {/* RESULT ICON */}

                  <div className="text-center">

                    <div
                      className={`w-24 h-24 ${data.iconBg} rounded-full flex items-center justify-center mx-auto`}
                    >

                      <Icon
                        size={50}
                        className={data.iconColor}
                      />

                    </div>

                    <h2
                      className={`text-3xl font-bold mt-6 ${data.iconColor}`}
                    >
                      {data.title}
                    </h2>

                    <p className="text-gray-600 mt-3 max-w-xl mx-auto">
                      {data.message}
                    </p>

                  </div>

                  {/* SELECTED SYMPTOMS */}

                  <div className="bg-white rounded-2xl p-5 mt-7">

                    <h3 className="font-bold text-gray-800 mb-3">
                      Selected Symptoms
                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {selectedSymptoms.map(
                        (symptom) => (

                          <span
                            key={symptom}
                            className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-sm font-medium"
                          >
                            {symptom}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                  {/* RECOMMENDATION */}

                  <div className="bg-white rounded-2xl p-5 mt-4">

                    <p className="text-sm text-gray-500">
                      Recommended action
                    </p>

                    <p className="font-bold text-gray-800 mt-1">
                      {data.action}
                    </p>

                  </div>

                  {/* FIREBASE STATUS */}

                  {saved && (

                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mt-4">

                      <div className="flex items-center gap-2 text-green-700">

                        <CheckCircle size={20} />

                        <p className="font-semibold">
                          Triage result saved successfully.
                        </p>

                      </div>

                      <p className="text-sm text-green-600 mt-1">

                        Your healthcare team can now access this triage record.

                      </p>

                    </div>

                  )}

                  {/* BUTTONS */}

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">

                    <button
                      onClick={resetTriage}
                      className="flex-1 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50"
                    >

                      <RotateCcw size={19} />

                      Check Again

                    </button>

                    {/* DOCTOR */}

                    {result === 'doctor' && (

                      <button
                        onClick={onBack}
                        className={`flex-1 ${data.button} text-white py-3.5 rounded-xl font-bold`}
                      >

                        Book Doctor

                      </button>

                    )}

                    {/* EMERGENCY */}

                    {result === 'emergency' && (

                      <button
                        onClick={() =>
                          alert(
                            'Emergency assistance will be contacted.'
                          )
                        }
                        className={`flex-1 ${data.button} text-white py-3.5 rounded-xl font-bold`}
                      >

                        Get Emergency Help

                      </button>

                    )}

                  </div>

                </div>

              )

            })()}

          </div>

        )}

      </main>

    </div>
  )
}

export default DigitalTriage