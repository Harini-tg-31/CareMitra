import {
  ArrowLeft,
  IndianRupee,
  ShieldCheck,
  CheckCircle,
  Hospital,
  FileText,
  Wallet,
  CircleHelp
} from 'lucide-react'

function CostEntitlement({ onBack }) {
  const treatmentCost = 2500
  const schemeCoverage = 2000
  const patientContribution = 500

  const handleAssistance = () => {
    alert('Financial assistance request submitted successfully.')
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
              Cost & Entitlement
            </h1>

            <p className="text-sm text-gray-500">
              Understand your healthcare expenses and benefits
            </p>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">

        <section className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl p-7 md:p-9 text-white shadow-xl animate-slide-up">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center animate-pulse-soft">
              <IndianRupee size={30} />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Know Your Healthcare Cost
              </h2>

              <p className="text-blue-100 mt-1">
                Check estimated expenses and available government support.
              </p>
            </div>

          </div>

        </section>

        <section className="grid lg:grid-cols-3 gap-5 mt-7">

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-blue-50 p-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <FileText size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Treatment Cost
                </h2>

                <p className="text-sm text-gray-500">
                  Estimated cost for your healthcare service
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                <span className="text-gray-600">
                  Doctor Consultation
                </span>
                <span className="font-bold text-gray-800">
                  ₹500
                </span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                <span className="text-gray-600">
                  Diagnostic Tests
                </span>
                <span className="font-bold text-gray-800">
                  ₹1,000
                </span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                <span className="text-gray-600">
                  Medicines
                </span>
                <span className="font-bold text-gray-800">
                  ₹1,000
                </span>
              </div>

            </div>

            <div className="border-t border-gray-100 mt-6 pt-5 flex items-center justify-between">

              <span className="font-bold text-gray-700">
                Estimated Total
              </span>

              <span className="text-2xl font-bold text-blue-600">
                ₹{treatmentCost}
              </span>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-md border border-blue-50 p-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Entitlement
                </h2>

                <p className="text-sm text-gray-500">
                  Available healthcare benefit
                </p>
              </div>

            </div>

            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mt-6">

              <div className="flex items-center gap-2">

                <CheckCircle
                  size={20}
                  className="text-green-600"
                />

                <span className="font-bold text-green-700">
                  Eligible
                </span>

              </div>

              <h3 className="font-bold text-gray-800 mt-4">
                Government Health Scheme
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Your treatment may be covered under an eligible government healthcare scheme.
              </p>

            </div>

            <div className="mt-5 bg-blue-50 rounded-2xl p-5">

              <p className="text-sm text-gray-500">
                Scheme Coverage
              </p>

              <p className="text-3xl font-bold text-blue-600 mt-1">
                ₹{schemeCoverage}
              </p>

            </div>

          </div>

        </section>

        <section className="grid md:grid-cols-2 gap-5 mt-7">

          <div className="bg-white rounded-3xl shadow-md border border-blue-50 p-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Wallet size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Your Contribution
                </h2>

                <p className="text-sm text-gray-500">
                  Amount payable after entitlement
                </p>
              </div>

            </div>

            <div className="bg-purple-50 rounded-2xl p-6 mt-6 text-center">

              <p className="text-sm text-gray-500">
                Estimated Patient Contribution
              </p>

              <p className="text-4xl font-bold text-purple-600 mt-2">
                ₹{patientContribution}
              </p>

              <p className="text-xs text-gray-500 mt-2">
                Final amount may vary based on treatment.
              </p>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-md border border-blue-50 p-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                <CircleHelp size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Need Financial Support?
                </h2>

                <p className="text-sm text-gray-500">
                  Request additional assistance
                </p>
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-6 leading-relaxed">
              Patients who cannot afford their contribution can request
              assistance from available community or welfare programs.
            </p>

            <button
              onClick={handleAssistance}
              className="w-full mt-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3.5 rounded-xl font-bold"
            >
              Request Assistance
            </button>

          </div>

        </section>

        <section className="mt-7 bg-white rounded-3xl shadow-md border border-blue-50 p-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center">
              <Hospital size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Healthcare Facility
              </h2>

              <p className="text-sm text-gray-500">
                Cost information for your referred facility
              </p>
            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-semibold">
                FACILITY
              </p>

              <p className="font-bold text-gray-800 mt-1">
                Government District Hospital
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-semibold">
                SCHEME
              </p>

              <p className="font-bold text-green-600 mt-1">
                Eligible
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 font-semibold">
                ESTIMATED SAVING
              </p>

              <p className="font-bold text-blue-600 mt-1">
                ₹{schemeCoverage}
              </p>
            </div>

          </div>

        </section>

        <div className="mt-7 bg-blue-50 border border-blue-100 rounded-2xl p-5">

          <div className="flex items-start gap-3">

            <ShieldCheck
              size={21}
              className="text-blue-600 mt-0.5 flex-shrink-0"
            />

            <div>

              <h3 className="font-bold text-gray-800">
                Transparent Healthcare Costs
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                SevaCare helps patients understand treatment costs,
                government entitlements and possible financial assistance
                before visiting a healthcare facility.
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

export default CostEntitlement