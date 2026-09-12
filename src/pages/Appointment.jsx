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

function Appointment({ onBack }) {
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

  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState('')

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

  const handleBooking = (e) => {
    e.preventDefault()

    if (!doctor || !date || !time || !reason) {
      alert('Please fill all appointment details.')
      return
    }

    const selectedDoctor = doctors.find(
      item => item.id === Number(doctor)
    )

    const id = `APT-${Date.now().toString().slice(-6)}`

    const appointment = {
      id,
      patientId: 'SC-2026-1048',
      patient: 'SevaCare Patient',
      age: 42,
      village: 'Kanchipuram Village',
      mobile: '+91 98765 43210',
      doctor: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      hospital: selectedDoctor.hospital,
      location: selectedDoctor.location,
      date,
      time,
      reason,
      priority: 'Normal',
      status: 'Waiting',
      source: 'Patient Booking',
      createdAt: new Date().toLocaleString('en-IN')
    }

    const existing = JSON.parse(
      localStorage.getItem('sevacareAppointments') || '[]'
    )

    localStorage.setItem(
      'sevacareAppointments',
      JSON.stringify([appointment, ...existing])
    )

    setBookingId(id)
    setConfirmed(true)
  }

  if (confirmed) {
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

              <div className="flex items-center gap-3">
                <Stethoscope className="text-sky-600" />
                <div>
                  <p className="text-xs text-slate-500">
                    Doctor
                  </p>
                  <p className="font-bold">
                    {doctors.find(item => item.id === Number(doctor))?.name}
                  </p>
                </div>
              </div>

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

              <div className="flex items-center gap-3">
                <MapPin className="text-sky-600" />
                <div>
                  <p className="text-xs text-slate-500">
                    Facility
                  </p>
                  <p className="font-bold">
                    {doctors.find(item => item.id === Number(doctor))?.hospital}
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
            <div>
              <label className="block font-semibold mb-2">
                Select Doctor
              </label>

              <select
                value={doctor}
                onChange={e => setDoctor(e.target.value)}
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

            {doctor && (
              <div className="bg-sky-50 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600">
                    <User size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {doctors.find(
                        item => item.id === Number(doctor)
                      )?.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {doctors.find(
                        item => item.id === Number(doctor)
                      )?.specialty}
                    </p>

                    <p className="text-sm text-slate-500">
                      {doctors.find(
                        item => item.id === Number(doctor)
                      )?.hospital}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold mb-2">
                  Appointment Date
                </label>

                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Appointment Time
                </label>

                <select
                  value={time}
                  onChange={e => setTime(e.target.value)}
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

            <div>
              <label className="block font-semibold mb-2">
                Reason for Visit
              </label>

              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Example: Fever, routine checkup, follow-up..."
                rows="4"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="font-semibold text-green-700">
                Connected Queue
              </p>

              <p className="text-sm text-green-600 mt-1">
                After booking, the health worker will receive this appointment
                in the Appointment & Queue section.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-xl font-bold text-lg"
            >
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Appointment