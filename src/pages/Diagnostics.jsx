import { useState } from 'react'
import {
  ArrowLeft,
  TestTube,
  Calendar,
  MapPin,
  IndianRupee,
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react'

function Diagnostics({ onBack }) {
  const [tests, setTests] = useState([
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      facility: 'District Diagnostic Centre',
      price: 350,
      date: '12 September 2026',
      status: 'Available'
    },
    {
      id: 2,
      name: 'Blood Sugar Test',
      facility: 'Primary Health Centre Lab',
      price: 100,
      date: '12 September 2026',
      status: 'Available'
    },
    {
      id: 3,
      name: 'Lipid Profile',
      facility: 'District Diagnostic Centre',
      price: 500,
      date: '15 September 2026',
      status: 'Available'
    },
    {
      id: 4,
      name: 'Chest X-Ray',
      facility: 'Government District Hospital',
      price: 250,
      date: '13 September 2026',
      status: 'Available'
    }
  ])

  const [bookedTests, setBookedTests] = useState([])

  const bookTest = id => {
    const test = tests.find(item => item.id === id)

    if (!bookedTests.includes(id)) {
      setBookedTests([...bookedTests, id])
      alert(`${test.name} has been booked successfully.`)
    }
  }

  const viewReport = name => {
    alert(`Sample diagnostic report for ${name} will be available here.`)
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
        <section className="mb-8">
          <p className="text-cyan-600 font-semibold mb-2">
            DIAGNOSTIC SERVICES
          </p>

          <h1 className="text-4xl font-bold text-gray-800">
            Diagnostics
          </h1>

          <p className="text-gray-500 mt-2 max-w-2xl">
            Find laboratory tests, diagnostic services and affordable
            healthcare testing facilities.
          </p>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-cyan-100">
            <TestTube className="text-cyan-600" size={30} />

            <p className="text-gray-500 text-sm mt-4">
              Available Tests
            </p>

            <p className="text-3xl font-bold text-cyan-600 mt-1">
              {tests.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <CheckCircle className="text-green-600" size={30} />

            <p className="text-gray-500 text-sm mt-4">
              Booked Tests
            </p>

            <p className="text-3xl font-bold text-green-600 mt-1">
              {bookedTests.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <IndianRupee className="text-blue-600" size={30} />

            <p className="text-gray-500 text-sm mt-4">
              Affordable Testing
            </p>

            <p className="text-lg font-bold text-blue-600 mt-2">
              Government Facilities
            </p>
          </div>
        </section>

        <section className="space-y-5">
          {tests.map(test => {
            const booked = bookedTests.includes(test.id)

            return (
              <div
                key={test.id}
                className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="bg-cyan-100 text-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0">
                    <TestTube size={32} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-800">
                        {test.name}
                      </h2>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {test.status}
                      </span>

                      {booked && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          BOOKED
                        </span>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-blue-600">
                          <MapPin size={18} />
                          <span className="text-xs font-bold">
                            FACILITY
                          </span>
                        </div>

                        <p className="font-semibold text-gray-700 mt-2">
                          {test.facility}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-blue-600">
                          <IndianRupee size={18} />
                          <span className="text-xs font-bold">
                            ESTIMATED COST
                          </span>
                        </div>

                        <p className="font-semibold text-gray-700 mt-2">
                          ₹{test.price}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Calendar size={18} />
                          <span className="text-xs font-bold">
                            AVAILABLE DATE
                          </span>
                        </div>

                        <p className="font-semibold text-gray-700 mt-2">
                          {test.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <button
                        onClick={() => bookTest(test.id)}
                        disabled={booked}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${
                          booked
                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                            : 'bg-cyan-600 text-white'
                        }`}
                      >
                        <Calendar size={18} />
                        {booked ? 'Test Booked' : 'Book Test'}
                      </button>

                      <button
                        onClick={() => viewReport(test.name)}
                        className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-3 rounded-xl font-semibold"
                      >
                        <FileText size={18} />
                        View Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        <section className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-7 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <Clock size={30} className="shrink-0" />

            <div>
              <h2 className="text-xl font-bold">
                Diagnostic Support
              </h2>

              <p className="text-cyan-50 mt-2">
                SevaCare helps patients identify available diagnostic
                services and understand estimated testing costs before
                visiting a healthcare facility.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-green-50 border border-green-200 rounded-3xl p-7">
          <h2 className="text-xl font-bold text-green-800">
            Affordable Healthcare Testing
          </h2>

          <p className="text-green-700 mt-2">
            Government hospitals and PHCs can provide accessible and
            lower-cost diagnostic services for rural communities.
          </p>
        </section>

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

export default Diagnostics