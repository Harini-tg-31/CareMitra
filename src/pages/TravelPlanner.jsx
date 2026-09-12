import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock,
  Route,
  Bus,
  Car,
  Phone,
  Hospital,
  CheckCircle
} from 'lucide-react'

function TravelPlanner({ onBack }) {
  const handleNavigation = () => {
    alert('Navigation started. Route guidance will be available in the full version.')
  }

  const handleTransport = (type) => {
    alert(`${type} transport request sent successfully.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-100">

      <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Travel Planner
            </h1>
            <p className="text-sm text-gray-500">
              Plan your journey to the healthcare facility
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">

        <section className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-7 md:p-9 text-white shadow-xl animate-slide-up">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center animate-pulse-soft">
              <Navigation size={30} />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Your Healthcare Journey
              </h2>

              <p className="text-blue-100 mt-1">
                Find the best way to reach your referred hospital.
              </p>
            </div>

          </div>

        </section>

        <section className="grid lg:grid-cols-3 gap-5 mt-7">

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-blue-50 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Route size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Route Details
                </h2>

                <p className="text-sm text-gray-500">
                  Suggested healthcare route
                </p>
              </div>

            </div>

            <div className="relative">

              <div className="flex gap-4">

                <div className="flex flex-col items-center">

                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <MapPin size={20} />
                  </div>

                  <div className="w-0.5 h-20 bg-blue-100"></div>

                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <Hospital size={20} />
                  </div>

                </div>

                <div className="flex-1">

                  <div>
                    <p className="text-xs text-gray-400 font-semibold">
                      STARTING LOCATION
                    </p>

                    <h3 className="font-bold text-gray-800 mt-1">
                      Your Village
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Rural healthcare service area
                    </p>
                  </div>

                  <div className="mt-12">

                    <p className="text-xs text-gray-400 font-semibold">
                      DESTINATION
                    </p>

                    <h3 className="font-bold text-gray-800 mt-1">
                      Government District Hospital
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Referred healthcare facility
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-7">

              <div className="bg-blue-50 rounded-2xl p-4">

                <div className="flex items-center gap-2 text-blue-600">
                  <MapPin size={18} />
                  <span className="text-sm font-semibold">
                    Distance
                  </span>
                </div>

                <p className="text-xl font-bold text-gray-800 mt-2">
                  18.5 km
                </p>

              </div>

              <div className="bg-purple-50 rounded-2xl p-4">

                <div className="flex items-center gap-2 text-purple-600">
                  <Clock size={18} />
                  <span className="text-sm font-semibold">
                    Travel Time
                  </span>
                </div>

                <p className="text-xl font-bold text-gray-800 mt-2">
                  42 min
                </p>

              </div>

              <div className="bg-green-50 rounded-2xl p-4">

                <div className="flex items-center gap-2 text-green-600">
                  <Route size={18} />
                  <span className="text-sm font-semibold">
                    Route
                  </span>
                </div>

                <p className="text-xl font-bold text-gray-800 mt-2">
                  Recommended
                </p>

              </div>

            </div>

            <button
              onClick={handleNavigation}
              className="w-full mt-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Navigation size={20} />
              Start Navigation
            </button>

          </div>

          <div className="bg-white rounded-3xl shadow-md border border-blue-50 p-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <Bus size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Transport
                </h2>

                <p className="text-sm text-gray-500">
                  Choose your travel option
                </p>
              </div>

            </div>

            <div className="space-y-4 mt-6">

              <button
                onClick={() => handleTransport('Government Bus')}
                className="w-full border border-blue-100 bg-blue-50 rounded-2xl p-4 text-left hover:bg-blue-100"
              >

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 bg-white text-blue-600 rounded-xl flex items-center justify-center">
                    <Bus size={21} />
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-800">
                      Government Bus
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Affordable public transport
                    </p>
                  </div>

                </div>

              </button>

              <button
                onClick={() => handleTransport('Shared Vehicle')}
                className="w-full border border-green-100 bg-green-50 rounded-2xl p-4 text-left hover:bg-green-100"
              >

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 bg-white text-green-600 rounded-xl flex items-center justify-center">
                    <Car size={21} />
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-800">
                      Shared Vehicle
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Community transport option
                    </p>
                  </div>

                </div>

              </button>

              <button
                onClick={() => handleTransport('Emergency Transport')}
                className="w-full border border-red-100 bg-red-50 rounded-2xl p-4 text-left hover:bg-red-100"
              >

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 bg-white text-red-600 rounded-xl flex items-center justify-center">
                    <Phone size={21} />
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-800">
                      Emergency Transport
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Request immediate assistance
                    </p>
                  </div>

                </div>

              </button>

            </div>

          </div>

        </section>

        <section className="mt-7 bg-white rounded-3xl shadow-md border border-blue-50 p-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Journey Information
              </h2>

              <p className="text-sm text-gray-500">
                Important information before travelling
              </p>
            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-semibold">
                FACILITY
              </p>
              <p className="font-bold text-gray-800 mt-1">
                District Hospital
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-semibold">
                ESTIMATED COST
              </p>
              <p className="font-bold text-gray-800 mt-1">
                ₹50 - ₹150
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-semibold">
                ACCESSIBILITY
              </p>
              <p className="font-bold text-green-600 mt-1">
                Available
              </p>
            </div>

          </div>

        </section>

        <div className="mt-7 bg-blue-50 border border-blue-100 rounded-2xl p-5">

          <div className="flex items-start gap-3">

            <Navigation
              size={21}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />

            <div>
              <h3 className="font-bold text-gray-800">
                Smart Travel Support
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                SevaCare can help patients identify nearby healthcare
                facilities, estimate travel time and choose suitable
                transport options.
              </p>
            </div>

          </div>

        </div>

        <button
          onClick={onBack}
          className="w-full mt-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl"
        >
          Back to Dashboard
        </button>

      </main>

    </div>
  )
}

export default TravelPlanner