import { useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle,
  User,
  MapPin
} from 'lucide-react'

import {
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore'

import { auth, db } from '../firebase'


function Appointment({ onBack }) {
  // --------------------------------------------------
  // Available doctors
  // --------------------------------------------------

  const doctors = [
    {
      id: 1,
      name: 'Dr. Anitha Kumar',
      specialty: 'General Physician',
      hospital: 'Government District Hospital',
      location: 'Kanchipuram'
    },
    {
      id: 2,
      name: 'Dr. Ravi Kumar',
      specialty: 'Family Medicine',
      hospital: 'Primary Health Centre',
      location: 'Kanchipuram'
    },
    {
      id: 3,
      name: 'Dr. Priya Sharma',
      specialty: 'General Medicine',
      hospital: 'Government Hospital',
      location: 'Chengalpattu'
    }
  ]

  // --------------------------------------------------
  // Form state
  // --------------------------------------------------

  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')

  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // --------------------------------------------------
  // Available appointment times
  // --------------------------------------------------

  const times = [
    '10:00 AM',
    '10:20 AM',
    '10:40 AM',
    '11:00 AM',
    '11:20 AM',
    '11:40 AM',
    '12:00 PM',
    '2:00 PM',
    '2:20 PM',
    '2:40 PM',
    '3:00 PM'
  ]

  // --------------------------------------------------
  // Generate a booking ID
  // --------------------------------------------------

  const generateBookingId = () => {
    return `APT-${Date.now().toString().slice(-6)}`
  }

  // --------------------------------------------------
  // Handle appointment booking
  // --------------------------------------------------

  const handleBooking = async (e) => {
    e.preventDefault()

    setErrorMessage('')

    // Check required fields
    if (!doctor || !date || !time || !reason.trim()) {
      setErrorMessage(
        'Please fill all appointment details.'
      )
      return
    }

    // Check Firebase login
    const currentUser = auth.currentUser

    if (!currentUser) {
      setErrorMessage(
        'Please login before booking an appointment.'
      )
      return
    }

    // Find selected doctor
    const selectedDoctor = doctors.find(
      item => item.id === Number(doctor)
    )

    if (!selectedDoctor) {
      setErrorMessage(
        'Please select a valid doctor.'
      )
      return
    }

    setLoading(true)

    try {
      // Get patient information saved during login
      const savedUser = JSON.parse(
        localStorage.getItem('caremitraUser') || 'null'
      )

      // Generate booking ID
      const generatedBookingId = generateBookingId()

      // ------------------------------------------------
      // Appointment document
      // ------------------------------------------------

      const appointment = {
        bookingId: generatedBookingId,

        // Firebase authenticated user's UID
        patientId: currentUser.uid,

        // Patient information
        patient:
          savedUser?.name ||
          currentUser.displayName ||
          'CareMitra Patient',

        mobile:
          savedUser?.mobile || '',

        role:
          savedUser?.role || 'Patient',

        // Doctor information
        doctorId: selectedDoctor.id,
        doctor: selectedDoctor.name,
        specialty: selectedDoctor.specialty,

        // Hospital information
        hospital: selectedDoctor.hospital,
        location: selectedDoctor.location,

        // Appointment information
        date: date,
        time: time,
        reason: reason.trim(),

        // Queue information
        priority: 'Normal',
        status: 'Waiting',
        source: 'Patient Booking',

        // Firebase server timestamp
        createdAt: serverTimestamp()
      }

      // ------------------------------------------------
      // Save appointment to Firestore
      // ------------------------------------------------

      const appointmentRef = await addDoc(
        collection(db, 'appointments'),
        appointment
      )

      console.log(
        'Appointment saved successfully:',
        appointmentRef.id
      )

      // Save booking ID for confirmation screen
      setBookingId(generatedBookingId)

      // ------------------------------------------------
      // Also keep a local copy for the current browser
      // ------------------------------------------------

      const localAppointment = {
        ...appointment,
        createdAt: new Date().toISOString()
      }

      const existing = JSON.parse(
        localStorage.getItem(
          'caremitraAppointments'
        ) || '[]'
      )

      localStorage.setItem(
        'caremitraAppointments',
        JSON.stringify([
          localAppointment,
          ...existing
        ])
      )

      // Show confirmation
      setConfirmed(true)

    } catch (error) {
      console.error(
        'Appointment booking error:',
        error
      )

      let message =
        'Unable to book the appointment. Please try again.'

      if (
        error.code === 'permission-denied'
      ) {
        message =
          'Firebase permission denied. Please check your Firestore rules.'
      }

      if (
        error.code === 'failed-precondition'
      ) {
        message =
          'Firestore is not ready. Please check your Firebase database.'
      }

      if (
        error.code === 'unavailable'
      ) {
        message =
          'Firebase is temporarily unavailable. Please check your internet connection.'
      }

      setErrorMessage(message)

    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------
  // Confirmation screen
  // --------------------------------------------------

  if (confirmed) {
    const selectedDoctor = doctors.find(
      item => item.id === Number(doctor)
    )

    return (
      <div className="min-h-screen bg-sky-50 p-6">

        <div className="max-w-3xl mx-auto">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sky-700 font-semibold mb-6"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>


          <div className="bg-white rounded-3xl shadow-lg border border-green-100 p-8 text-center">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle size={44} />
            </div>


            <h1 className="text-3xl font-bold text-green-700 mt-6">
              Appointment Confirmed
            </h1>


            <p className="text-slate-500 mt-2">
              Your appointment has been added to the health worker queue.
            </p>


            <div className="bg-sky-50 rounded-2xl p-6 mt-8 text-left space-y-4">

              {/* Booking ID */}

              <div className="flex items-center gap-3">

                <Calendar className="text-sky-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Booking ID
                  </p>

                  <p className="font-bold">
                    {bookingId}
                  </p>
                </div>

              </div>


              {/* Doctor */}

              <div className="flex items-center gap-3">

                <Stethoscope className="text-sky-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Doctor
                  </p>

                  <p className="font-bold">
                    {selectedDoctor?.name}
                  </p>
                </div>

              </div>


              {/* Date */}

              <div className="flex items-center gap-3">

                <Calendar className="text-sky-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Date
                  </p>

                  <p className="font-bold">
                    {date}
                  </p>
                </div>

              </div>


              {/* Time */}

              <div className="flex items-center gap-3">

                <Clock className="text-sky-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Time
                  </p>

                  <p className="font-bold">
                    {time}
                  </p>
                </div>

              </div>


              {/* Facility */}

              <div className="flex items-center gap-3">

                <MapPin className="text-sky-600" />

                <div>
                  <p className="text-xs text-slate-500">
                    Facility
                  </p>

                  <p className="font-bold">
                    {selectedDoctor?.hospital}
                  </p>
                </div>

              </div>

            </div>


            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">

              <p className="text-green-700 font-semibold">
                Queue Status: Waiting
              </p>

              <p className="text-sm text-green-600 mt-1">
                The health worker can now see and manage your appointment.
              </p>

            </div>


            <button
              onClick={onBack}
              className="mt-6 px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold"
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>
    )
  }


  // --------------------------------------------------
  // Appointment form
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-sky-50 p-6">

      <div className="max-w-4xl mx-auto">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sky-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>


        <div className="bg-white rounded-3xl shadow-lg border border-sky-100 overflow-hidden">

          {/* Header */}

          <div className="bg-gradient-to-r from-sky-600 to-cyan-500 p-8 text-white">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Calendar size={30} />
              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  Book Appointment
                </h1>

                <p className="text-sky-100 mt-1">
                  Choose a doctor, date and time for your visit.
                </p>

              </div>

            </div>

          </div>


          <form
            onSubmit={handleBooking}
            className="p-8 space-y-6"
          >

            {/* Doctor */}

            <div>

              <label className="block font-semibold mb-2">
                Select Doctor
              </label>

              <select
                value={doctor}
                onChange={e => {
                  setDoctor(e.target.value)
                  setErrorMessage('')
                }}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
              >

                <option value="">
                  Select a doctor
                </option>

                {doctors.map(item => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name} - {item.specialty}
                  </option>

                ))}

              </select>

            </div>


            {/* Selected doctor information */}

            {doctor && (

              <div className="bg-sky-50 rounded-2xl p-5">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600">
                    <User size={24} />
                  </div>


                  <div>

                    <h3 className="font-bold">
                      {
                        doctors.find(
                          item =>
                            item.id === Number(doctor)
                        )?.name
                      }
                    </h3>

                    <p className="text-sm text-slate-500">
                      {
                        doctors.find(
                          item =>
                            item.id === Number(doctor)
                        )?.specialty
                      }
                    </p>

                    <p className="text-sm text-slate-500">
                      {
                        doctors.find(
                          item =>
                            item.id === Number(doctor)
                        )?.hospital
                      }
                    </p>

                  </div>

                </div>

              </div>

            )}


            {/* Date and time */}

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block font-semibold mb-2">
                  Appointment Date
                </label>

                <input
                  type="date"
                  min={
                    new Date()
                      .toISOString()
                      .split('T')[0]
                  }
                  value={date}
                  onChange={e => {
                    setDate(e.target.value)
                    setErrorMessage('')
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                />

              </div>


              <div>

                <label className="block font-semibold mb-2">
                  Appointment Time
                </label>

                <select
                  value={time}
                  onChange={e => {
                    setTime(e.target.value)
                    setErrorMessage('')
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                >

                  <option value="">
                    Select time
                  </option>

                  {times.map(item => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

                </select>

              </div>

            </div>


            {/* Reason */}

            <div>

              <label className="block font-semibold mb-2">
                Reason for Visit
              </label>

              <textarea
                value={reason}
                onChange={e => {
                  setReason(e.target.value)
                  setErrorMessage('')
                }}
                placeholder="Example: Fever, routine checkup, follow-up..."
                rows="4"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 resize-none"
              />

            </div>


            {/* Error message */}

            {errorMessage && (

              <div className="bg-red-50 border border-red-200 rounded-xl p-4">

                <p className="text-red-700 font-semibold">
                  {errorMessage}
                </p>

              </div>

            )}


            {/* Firebase information */}

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">

              <p className="font-semibold text-green-700">
                Connected Queue
              </p>

              <p className="text-sm text-green-600 mt-1">
                Your appointment will be saved securely in the CareMitra
                appointment database.
              </p>

            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-4 rounded-xl font-bold text-lg ${
                loading
                  ? 'bg-sky-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700'
              }`}
            >

              {loading
                ? 'Booking Appointment...'
                : 'Confirm Appointment'}

            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default Appointment