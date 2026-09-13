import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Pill,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../firebase'

function Medicines({ onBack }) {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  // Get the currently logged-in patient
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid)
      } else {
        setUserId(null)
        setMedicines([])
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Load medicines from Firestore
  useEffect(() => {
    if (!userId) return

    setLoading(true)

    const medicineMap = new Map()

    // 1. Listen to medicines collection
    const medicinesRef = collection(db, 'medicines')

    const unsubscribeMedicines = onSnapshot(
      medicinesRef,
      snapshot => {
        snapshot.docs.forEach(docSnapshot => {
          const data = docSnapshot.data()

          // Only use medicines belonging to this patient
          if (
            data.patientId &&
            data.patientId !== userId
          ) {
            return
          }

          const medicine = createMedicineObject(
            docSnapshot.id,
            data
          )

          medicineMap.set(medicine.id, medicine)
        })

        setMedicines(
          Array.from(medicineMap.values()).filter(
            medicine => medicine.status !== 'Completed'
          )
        )

        setLoading(false)
      },
      error => {
        console.error('Error loading medicines:', error)
        setLoading(false)
      }
    )

    // 2. Listen to patient's medical records
    const recordsRef = collection(
      db,
      'patients',
      userId,
      'medicalRecords'
    )

    const unsubscribeRecords = onSnapshot(
      recordsRef,
      snapshot => {
        snapshot.docs.forEach(docSnapshot => {
          const data = docSnapshot.data()

          const medicinesFromRecord =
            normalizeMedicines(data.medicines || data.medicine)

          medicinesFromRecord.forEach((medicine, index) => {
            const medicineId =
              `${docSnapshot.id}-medicine-${index}`

            const medicineObject = {
              id: medicineId,
              recordId: docSnapshot.id,
              patientId: userId,
              name:
                medicine.name ||
                medicine.medicine ||
                medicine.medication ||
                'Medicine',
              purpose:
                medicine.purpose ||
                data.condition ||
                data.diagnosis ||
                'As prescribed by healthcare professional',
              dosage:
                medicine.dosage ||
                data.dosage ||
                'As prescribed',
              timing:
                medicine.timing ||
                medicine.time ||
                'As prescribed',
              frequency:
                medicine.frequency ||
                data.frequency ||
                'As prescribed',
              duration:
                medicine.duration ||
                data.duration ||
                'As prescribed',
              status:
                medicine.status ||
                'Active',
              taken:
                medicine.taken === true
            }

            medicineMap.set(
              medicineId,
              medicineObject
            )
          })
        })

        setMedicines(
          Array.from(medicineMap.values()).filter(
            medicine => medicine.status !== 'Completed'
          )
        )

        setLoading(false)
      },
      error => {
        console.error(
          'Error loading medical records:',
          error
        )
        setLoading(false)
      }
    )

    return () => {
      unsubscribeMedicines()
      unsubscribeRecords()
    }
  }, [userId])

  // Convert different medicine formats into an array
  const normalizeMedicines = value => {
    if (!value) {
      return []
    }

    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'string') {
          return {
            name: item
          }
        }

        if (typeof item === 'object' && item !== null) {
          return item
        }

        return {
          name: String(item)
        }
      })
    }

    if (typeof value === 'string') {
      return [
        {
          name: value
        }
      ]
    }

    if (typeof value === 'object') {
      return [value]
    }

    return []
  }

  // Create a consistent medicine object
  const createMedicineObject = (id, data) => {
    return {
      id,
      patientId: data.patientId || userId,
      name:
        data.name ||
        data.medicine ||
        data.medication ||
        'Medicine',
      purpose:
        data.purpose ||
        data.reason ||
        'As prescribed by healthcare professional',
      dosage:
        data.dosage ||
        'As prescribed',
      timing:
        data.timing ||
        data.time ||
        'As prescribed',
      frequency:
        data.frequency ||
        'As prescribed',
      duration:
        data.duration ||
        'As prescribed',
      status:
        data.status ||
        'Active',
      taken:
        data.taken === true
    }
  }

  // Mark medicine as taken / not taken
  const markTaken = async medicine => {
    const newTakenStatus = !medicine.taken

    // Update screen immediately
    setMedicines(currentMedicines =>
      currentMedicines.map(item =>
        item.id === medicine.id
          ? {
              ...item,
              taken: newTakenStatus
            }
          : item
      )
    )

    try {
      // Medicines stored directly in medicines collection
      const medicineRef = doc(
        db,
        'medicines',
        medicine.id
      )

      await updateDoc(medicineRef, {
        taken: newTakenStatus,
        lastUpdated: serverTimestamp()
      })
    } catch (error) {
      // If the medicine came from a medical record,
      // save today's medicine status separately.
      try {
        await addDoc(collection(db, 'medicineLogs'), {
          patientId: userId,
          medicineId: medicine.id,
          medicineName: medicine.name,
          taken: newTakenStatus,
          date: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp()
        })
      } catch (logError) {
        console.error(
          'Error saving medicine status:',
          logError
        )
      }
    }
  }

  const takenCount = medicines.filter(
    item => item.taken
  ).length

  const activeCount = medicines.filter(
    item =>
      item.status &&
      item.status.toLowerCase() === 'active'
  ).length

  const getNextReminder = () => {
    const pendingMedicine = medicines.find(
      medicine => !medicine.taken
    )

    if (!pendingMedicine) {
      return 'All done'
    }

    return pendingMedicine.timing || 'As prescribed'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 font-semibold"
          >
            <ArrowLeft size={20} />
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-blue-600 font-semibold mb-2">
            PATIENT MEDICINE SUPPORT
          </p>

          <h1 className="text-4xl font-bold text-gray-800">
            My Medicines
          </h1>

          <p className="text-gray-500 mt-2">
            View your medicines, dosage instructions and
            medication reminders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <Pill
              className="text-blue-600"
              size={28}
            />

            <p className="text-gray-500 text-sm mt-4">
              Active Medicines
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-1">
              {activeCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <CheckCircle
              className="text-green-600"
              size={28}
            />

            <p className="text-gray-500 text-sm mt-4">
              Taken Today
            </p>

            <p className="text-3xl font-bold text-green-600 mt-1">
              {takenCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <Clock
              className="text-orange-500"
              size={28}
            />

            <p className="text-gray-500 text-sm mt-4">
              Next Reminder
            </p>

            <p className="text-xl font-bold text-orange-500 mt-2">
              {getNextReminder()}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
            <Pill
              className="text-blue-600 mx-auto animate-pulse"
              size={40}
            />

            <p className="text-gray-600 mt-4">
              Loading your medicines...
            </p>
          </div>
        ) : medicines.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
            <Pill
              className="text-gray-400 mx-auto"
              size={48}
            />

            <h2 className="text-xl font-bold text-gray-700 mt-4">
              No medicines found
            </h2>

            <p className="text-gray-500 mt-2">
              Your prescribed medicines will appear here
              after they are added by your healthcare
              professional.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {medicines.map(medicine => (
              <div
                key={medicine.id}
                className={`bg-white rounded-3xl shadow-lg p-6 border-l-8 ${
                  medicine.taken
                    ? 'border-green-500'
                    : 'border-blue-500'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">
                    <Pill size={32} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {medicine.name}
                      </h2>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {medicine.status}
                      </span>

                      {medicine.taken && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          TAKEN
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 mt-2">
                      {medicine.purpose}
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs text-gray-400">
                          DOSAGE
                        </p>

                        <p className="font-bold text-gray-700 mt-1">
                          {medicine.dosage}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs text-gray-400">
                          TIMING
                        </p>

                        <p className="font-bold text-gray-700 mt-1">
                          {medicine.timing}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs text-gray-400">
                          FREQUENCY
                        </p>

                        <p className="font-bold text-gray-700 mt-1">
                          {medicine.frequency}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-xs text-gray-400">
                          DURATION
                        </p>

                        <p className="font-bold text-gray-700 mt-1">
                          {medicine.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <button
                        onClick={() =>
                          markTaken(medicine)
                        }
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${
                          medicine.taken
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        <CheckCircle size={18} />

                        {medicine.taken
                          ? 'Mark Not Taken'
                          : 'Mark as Taken'}
                      </button>

                      <button
                        onClick={() =>
                          alert(
                            `Reminder set for ${medicine.name}.`
                          )
                        }
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
                      >
                        <Clock size={18} />
                        Set Reminder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-3xl p-7">
          <div className="flex items-start gap-4">
            <AlertCircle
              size={28}
              className="text-orange-600 shrink-0"
            />

            <div>
              <h2 className="text-xl font-bold text-orange-800">
                Medicine Safety
              </h2>

              <p className="text-orange-700 mt-2">
                Take medicines only according to the
                prescription or instructions provided by
                your healthcare professional. Do not
                change the dosage without medical advice.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-lg p-7">
          <div className="flex items-center gap-3">
            <Calendar
              className="text-blue-600"
              size={28}
            />

            <h2 className="text-xl font-bold text-gray-800">
              Medication Support
            </h2>
          </div>

          <p className="text-gray-500 mt-3">
            CareMitra helps patients remember medicines
            and maintain continuity of care even in rural
            and low-connectivity areas.
          </p>
        </div>

        <button
          onClick={onBack}
          className="mt-8 flex items-center gap-2 text-blue-600 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Patient Dashboard
        </button>
      </main>
    </div>
  )
}

export default Medicines