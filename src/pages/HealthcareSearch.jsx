import { useState } from 'react'
import {
  Search,
  ArrowLeft,
  MapPin,
  Stethoscope,
  Hospital,
  FlaskConical,
  Building2,
  Phone,
  Clock,
  Navigation
} from 'lucide-react'

function HealthcareSearch({ onBack }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const facilities = [
    {
      name: 'Dr. Anitha Kumar',
      type: 'Doctor',
      specialty: 'General Physician',
      location: 'Government Hospital',
      distance: '2.4 km',
      availability: 'Available Today',
      icon: Stethoscope
    },
    {
      name: 'Dr. Rahul Sharma',
      type: 'Doctor',
      specialty: 'Cardiologist',
      location: 'District Hospital',
      distance: '4.1 km',
      availability: 'Available Tomorrow',
      icon: Stethoscope
    },
    {
      name: 'Government Primary Health Centre',
      type: 'PHC',
      specialty: 'Primary Healthcare',
      location: 'Village Health Centre',
      distance: '1.8 km',
      availability: 'Open Now',
      icon: Building2
    },
    {
      name: 'District Government Hospital',
      type: 'Hospital',
      specialty: 'Multi-Speciality',
      location: 'District Centre',
      distance: '5.2 km',
      availability: 'Open Now',
      icon: Hospital
    },
    {
      name: 'Government Diagnostic Centre',
      type: 'Diagnostics',
      specialty: 'Blood Test, X-Ray, ECG',
      location: 'Health Complex',
      distance: '3.6 km',
      availability: 'Open Today',
      icon: FlaskConical
    }
  ]

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(search.toLowerCase()) ||
      facility.specialty.toLowerCase().includes(search.toLowerCase()) ||
      facility.location.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || facility.type === category

    return matchesSearch && matchesCategory
  })

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
              Find Healthcare
            </h1>

            <p className="text-sm text-gray-500">
              Find doctors, hospitals and healthcare facilities
            </p>
          </div>

        </div>

      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">

        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-7 md:p-9 text-white shadow-xl animate-slide-up">

          <h2 className="text-2xl md:text-3xl font-bold">
            Find healthcare near you
          </h2>

          <p className="text-blue-100 mt-2">
            Search doctors, hospitals, PHCs and diagnostic centres.
          </p>

          <div className="relative mt-6">

            <Search
              size={21}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor, hospital, PHC..."
              className="w-full bg-white text-gray-700 rounded-2xl py-4 pl-12 pr-5 outline-none shadow-lg placeholder:text-gray-400"
            />

          </div>

        </div>

        <div className="flex gap-3 overflow-x-auto py-6">

          {['All', 'Doctor', 'Hospital', 'PHC', 'Diagnostics'].map(
            (item) => (

              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap ${
                  category === item
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-blue-100 hover:bg-blue-50'
                }`}
              >
                {item}
              </button>

            )
          )}

        </div>

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Healthcare Facilities
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {filteredFacilities.length} results found
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm text-blue-600">
            <MapPin size={18} />
            Nearby
          </div>

        </div>

        {filteredFacilities.length === 0 ? (

          <div className="bg-white rounded-3xl p-12 text-center shadow-md">

            <Search
              size={45}
              className="mx-auto text-gray-300 mb-4"
            />

            <h3 className="text-xl font-bold text-gray-700">
              No healthcare facilities found
            </h3>

            <p className="text-gray-500 mt-2">
              Try another doctor, hospital or service.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-5">

            {filteredFacilities.map((facility, index) => {

              const Icon = facility.icon

              return (
                <div
                  key={facility.name}
                  className="bg-white rounded-3xl p-6 shadow-md border border-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >

                  <div className="flex gap-4">

                    <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon size={27} />
                    </div>

                    <div className="flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <div>

                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            {facility.type}
                          </span>

                          <h3 className="text-lg font-bold text-gray-800 mt-2">
                            {facility.name}
                          </h3>

                        </div>

                      </div>

                      <p className="text-gray-500 text-sm mt-1">
                        {facility.specialty}
                      </p>

                    </div>

                  </div>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin size={17} className="text-blue-500" />
                      {facility.location}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Navigation size={17} className="text-blue-500" />
                      {facility.distance}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Clock size={17} />
                      {facility.availability}
                    </div>

                  </div>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        alert(
                          `${facility.name}\n\n${facility.specialty}\n${facility.location}\n${facility.distance}`
                        )
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() =>
                        alert(`Calling ${facility.name}`)
                      }
                      className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-100"
                    >
                      <Phone size={20} />
                    </button>

                  </div>

                </div>
              )

            })}

          </div>

        )}

      </main>

    </div>
  )
}

export default HealthcareSearch