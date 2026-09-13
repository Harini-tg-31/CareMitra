import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowLeft, BarChart3, Bell, Building2, CalendarDays, CircleAlert,
  Clock3, Download, FileText, FlaskConical, HeartPulse, Hospital, MapPin,
  Pill, RefreshCw, Search, ShieldCheck, Stethoscope, Users, X, BedDouble,
  TrendingUp, UserRound
} from 'lucide-react'

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

import { db } from '../firebase'


/* =========================================================
   STATIC FACILITY DATA
   Appearance and facility map remain unchanged
========================================================= */

const facilities = [
  { id:'F001', name:'Government Hospital A', type:'District Hospital', district:'Kanchipuram', state:'Tamil Nadu', doctors:'12/15', lab:true, xray:true, ultrasound:false, beds:12, totalBeds:100, medicine:'Low stock', status:'Critical', updated:'8 min ago', confidence:'High', wait:42, referrals:31 },
  { id:'F002', name:'Primary Health Centre B', type:'PHC', district:'Chengalpattu', state:'Tamil Nadu', doctors:'6/7', lab:true, xray:true, ultrasound:true, beds:8, totalBeds:30, medicine:'Available', status:'Normal', updated:'18 min ago', confidence:'High', wait:18, referrals:14 },
  { id:'F003', name:'Community Health Centre C', type:'CHC', district:'Madurantakam', state:'Tamil Nadu', doctors:'4/8', lab:true, xray:false, ultrasound:false, beds:4, totalBeds:40, medicine:'Low stock', status:'Warning', updated:'2 hrs ago', confidence:'Medium', wait:36, referrals:22 },
  { id:'F004', name:'Government Hospital D', type:'District Hospital', district:'Uthiramerur', state:'Tamil Nadu', doctors:'15/15', lab:true, xray:true, ultrasound:true, beds:22, totalBeds:120, medicine:'Available', status:'Normal', updated:'24 min ago', confidence:'High', wait:15, referrals:9 },
  { id:'F005', name:'Rural Health Centre E', type:'PHC', district:'Kanchipuram', state:'Tamil Nadu', doctors:'3/5', lab:false, xray:false, ultrasound:false, beds:2, totalBeds:20, medicine:'Unavailable', status:'Critical', updated:'9 hrs ago', confidence:'Low', wait:51, referrals:27 },
  { id:'F006', name:'Taluk Hospital F', type:'Taluk Hospital', district:'Chengalpattu', state:'Tamil Nadu', doctors:'10/12', lab:true, xray:true, ultrasound:true, beds:18, totalBeds:80, medicine:'Available', status:'Normal', updated:'41 min ago', confidence:'High', wait:21, referrals:11 }
]

const statusTone = {
  Normal:'bg-emerald-100 text-emerald-700 border-emerald-200',
  Warning:'bg-amber-100 text-amber-700 border-amber-200',
  Critical:'bg-red-100 text-red-700 border-red-200'
}


/* =========================================================
   STATIC USER DATA
   Kept because this is part of your existing UI
========================================================= */

const users = [
  { id:'PT-1042', name:'Lakshmi', role:'Patient', detail:'Patient portal access', status:'Active', location:'Kanchipuram' },
  { id:'PT-1098', name:'Arun Kumar', role:'Patient', detail:'Patient portal access', status:'Active', location:'Chengalpattu' },
  { id:'HW-201', name:'Meena R.', role:'Health Worker', detail:'Field care and follow-up', status:'Active', location:'Madurantakam' },
  { id:'HW-214', name:'Suresh K.', role:'Health Worker', detail:'Triage and facility support', status:'Active', location:'Uthiramerur' },
  { id:'DR-301', name:'Dr. Priya', role:'Doctor', detail:'General Medicine', status:'Available', location:'Government Hospital A' },
  { id:'DR-318', name:'Dr. Anand', role:'Doctor', detail:'Cardiology', status:'Unavailable', location:'District Hospital Network' },
  { id:'GA-001', name:'Government Admin', role:'Government Admin', detail:'System monitoring', status:'Active', location:'State Operations' }
]


/* =========================================================
   STATIC ALERT DATA
========================================================= */

const alerts = [
  { id:'A-001', type:'Critical', title:'Critical facility shortages', summary:'12 facilities have critical shortages.', detail:'Critical conditions are concentrated in medicine, diagnostics, staff availability and waiting-time indicators. Government administrators should inspect the affected facilities and coordinate operational updates.', count:'12 facilities', action:'Review critical facilities' },
  { id:'A-002', type:'Warning', title:'Outdated availability data', summary:'18 facilities have outdated availability data.', detail:'These facilities have not refreshed operational information within the expected freshness window. Current availability may differ from the last reported status.', count:'18 facilities', action:'Notify facilities to update' },
  { id:'A-003', type:'Referral Alert', title:'Overdue referrals', summary:'82 referrals are overdue.', detail:'The referral monitoring system has identified 82 referrals whose expected completion window has passed. Review by district and specialty to identify concentrated delays.', count:'82 referrals', action:'Investigate referral delays' },
  { id:'A-004', type:'Medicine Alert', title:'Medicine unavailability', summary:'6 facilities report medicine unavailability.', detail:'Six facilities currently report one or more medicines as unavailable. Review affected facilities and coordinate stock replenishment or alternate public-facility availability.', count:'6 facilities', action:'Review medicine shortages' }
]


/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function StatCard({ icon:Icon, label, value, note }) {
  return <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
        <Icon size={20}/>
      </div>
      <Activity size={17} className="text-slate-300"/>
    </div>

    <p className="text-sm text-slate-500 mt-4">{label}</p>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>

    {note && (
      <p className="text-xs text-slate-500 mt-1">
        {note}
      </p>
    )}
  </div>
}


function Mini({label,value}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-bold text-slate-800 mt-1 text-sm">{value}</p>
    </div>
  )
}


function Info({ok,label}) {
  return (
    <div className={`rounded-xl p-3 ${
      ok
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-red-50 text-red-700'
    }`}>
      {ok ? '✓' : '✕'} {label}
    </div>
  )
}


function Panel({title,children}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-bold mb-4">{title}</h3>
      {children}
    </div>
  )
}


function Bars({data,suffix=''}) {
  return (
    <div className="space-y-4">
      {data.map(([label,val]) => (
        <div key={label}>
          <div className="flex justify-between text-sm mb-1">
            <span>{label}</span>
            <b>{val}{suffix}</b>
          </div>

          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full"
              style={{
                width:`${Math.min(Number(val),100)}%`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}


/* =========================================================
   MAP
========================================================= */

function GovernmentMap({
  filtered,
  selected,
  setSelected,
  layerValue
}) {

  const pointPositions = [
    [20,28],
    [48,22],
    [72,34],
    [32,58],
    [60,60],
    [78,72]
  ]

  return (
    <div className="relative min-h-[360px] rounded-2xl overflow-hidden border border-slate-200 bg-[#eaf6fb]">

      <svg
        viewBox="0 0 800 430"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Healthcare facility operational map"
      >

        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="#cfe7ef"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect
          width="800"
          height="430"
          fill="#eaf6fb"
        />

        <rect
          width="800"
          height="430"
          fill="url(#grid)"
          opacity="0.7"
        />

        <path
          d="M100 70 L230 38 L355 72 L470 50 L620 90 L720 155 L680 270 L735 340 L600 390 L465 350 L350 382 L235 330 L115 350 L65 250 Z"
          fill="#d9eef0"
          stroke="#7fb9c7"
          strokeWidth="4"
        />

        <path
          d="M150 105 C270 160 360 105 500 160 S640 210 690 270"
          fill="none"
          stroke="#9ccbd5"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M170 300 C260 245 370 290 445 215 S560 145 650 125"
          fill="none"
          stroke="#b3d6dd"
          strokeWidth="5"
          strokeDasharray="12 9"
        />

        <path
          d="M290 55 L310 330 M510 70 L485 350"
          stroke="#b7dce3"
          strokeWidth="4"
          strokeDasharray="9 10"
        />

        <text
          x="28"
          y="28"
          fill="#477987"
          fontSize="16"
          fontWeight="700"
        >
          Tamil Nadu • Operational Healthcare Map
        </text>

        <text
          x="615"
          y="405"
          fill="#6b8f98"
          fontSize="13"
        >
          District/service signals
        </text>

      </svg>

      {filtered.map((f,i) => {

        const [
          left,
          top
        ] = pointPositions[
          i % pointPositions.length
        ]

        const tone = layerValue(f)

        const cls =
          tone === 'Critical'
            ? 'bg-red-500'
            : tone === 'Warning'
              ? 'bg-amber-400'
              : 'bg-emerald-500'

        return (
          <button
            key={f.id}
            onClick={() => setSelected(f)}
            style={{
              left:`${left}%`,
              top:`${top}%`
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full ${cls} border-4 border-white shadow-lg flex items-center justify-center text-white font-bold hover:scale-110 transition`}
            title={f.name}
          >
            <MapPin
              size={20}
              fill="currentColor"
            />
          </button>
        )
      })}

      <div className="absolute left-4 bottom-4 bg-white/95 rounded-xl p-3 shadow text-xs space-y-1.5">
        <p className="font-semibold text-slate-700 mb-1">
          Status
        </p>
        <p>🟢 Normal</p>
        <p>🟠 Warning</p>
        <p>🔴 Critical</p>
      </div>

      <div className="absolute right-4 bottom-4 bg-white/95 rounded-xl px-3 py-2 text-xs text-slate-500 shadow">
        Click a marker for facility details
      </div>

    </div>
  )
}


/* =========================================================
   FACILITY REGISTRY
========================================================= */

function FacilityRegistry({
  filtered,
  query,
  setQuery,
  status,
  setStatus,
  district,
  setDistrict,
  selected,
  setSelected,
  notify
}) {

  return (
    <section className="space-y-5">

      <div className="bg-white rounded-2xl border p-5">

        <div className="flex flex-wrap justify-between gap-3">

          <div>
            <h2 className="text-xl font-bold">
              Facility Registry
            </h2>

            <p className="text-sm text-slate-500">
              Operational registry with freshness and service indicators.
            </p>
          </div>

          <button
            onClick={() =>
              notify('Facility status refreshed')
            }
            className="px-4 py-2 rounded-xl bg-sky-600 text-white flex gap-2 items-center"
          >
            <RefreshCw size={16}/>
            Refresh
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-3 mt-5">

          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <input
              value={query}
              onChange={e =>
                setQuery(e.target.value)
              }
              placeholder="Search facility or district"
              className="w-full border rounded-xl pl-10 pr-3 py-2.5"
            />

          </div>

          <select
            value={district}
            onChange={e =>
              setDistrict(e.target.value)
            }
            className="border rounded-xl px-3 py-2.5"
          >
            <option>All</option>
            <option>Kanchipuram</option>
            <option>Chengalpattu</option>
            <option>Madurantakam</option>
            <option>Uthiramerur</option>
          </select>

          <select
            value={status}
            onChange={e =>
              setStatus(e.target.value)
            }
            className="border rounded-xl px-3 py-2.5"
          >
            <option>All</option>
            <option>Normal</option>
            <option>Warning</option>
            <option>Critical</option>
          </select>

        </div>

      </div>


      <div className="grid xl:grid-cols-3 gap-5">

        <div className="xl:col-span-2 bg-white rounded-2xl border overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50">

                <tr>

                  {[
                    'Facility',
                    'Type',
                    'District',
                    'Doctors',
                    'Beds',
                    'Status',
                    'Updated'
                  ].map(h => (
                    <th
                      key={h}
                      className="text-left p-4 font-semibold"
                    >
                      {h}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {filtered.map(f => (

                  <tr
                    key={f.id}
                    onClick={() =>
                      setSelected(f)
                    }
                    className={`border-t cursor-pointer hover:bg-sky-50 ${
                      selected.id === f.id
                        ? 'bg-sky-50'
                        : ''
                    }`}
                  >

                    <td className="p-4 font-semibold">
                      {f.name}
                    </td>

                    <td className="p-4">
                      {f.type}
                    </td>

                    <td className="p-4">
                      {f.district}
                    </td>

                    <td className="p-4">
                      {f.doctors}
                    </td>

                    <td className="p-4">
                      {f.beds}/{f.totalBeds}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-2 py-1 rounded-full text-xs ${statusTone[f.status]}`}
                      >
                        {f.status}
                      </span>

                    </td>

                    <td className="p-4">
                      {f.updated}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        <div className="bg-white rounded-2xl border p-5 h-fit">

          <div className="flex justify-between">

            <div>

              <h3 className="font-bold">
                {selected.name}
              </h3>

              <p className="text-sm text-slate-500">
                {selected.district}, {selected.state}
              </p>

            </div>

            <MapPin className="text-sky-500"/>

          </div>


          <div className="space-y-3 mt-5">

            {[
              ['Doctors',selected.doctors],
              ['Lab',selected.lab?'Available':'Unavailable'],
              ['X-Ray',selected.xray?'Available':'Unavailable'],
              ['Ultrasound',selected.ultrasound?'Available':'Unavailable'],
              ['Beds',`${selected.beds} available of ${selected.totalBeds}`],
              ['Medicine',selected.medicine],
              ['Waiting time',`${selected.wait} min`],
              ['Data confidence',selected.confidence]
            ].map(([a,b]) => (

              <div
                key={a}
                className="flex justify-between text-sm border-b pb-2"
              >
                <span className="text-slate-500">
                  {a}
                </span>

                <b>{b}</b>
              </div>

            ))}

          </div>


          <button
            onClick={() =>
              notify('Facility update request sent')
            }
            className="w-full mt-5 bg-sky-600 text-white py-2.5 rounded-xl"
          >
            Notify facility to update
          </button>

        </div>

      </div>

    </section>
  )
}


/* =========================================================
   MONITORING
========================================================= */

function Monitoring({
  title,
  icon:Icon,
  cards,
  bars
}) {

  return (
    <section>

      <div className="flex items-center gap-3 mb-5">

        <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
          <Icon/>
        </div>

        <div>

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <p className="text-sm text-slate-500">
            Aggregate operational monitoring for authorized administrators.
          </p>

        </div>

      </div>


      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {cards.map(([a,b]) => (

          <StatCard
            key={a}
            icon={Activity}
            label={a}
            value={b}
          />

        ))}

      </div>


      <div className="bg-white border rounded-2xl p-5 mt-5">
        <Bars data={bars}/>
      </div>

    </section>
  )
}


/* =========================================================
   REFERRALS
========================================================= */

function ReferralView({notify, referralCount}) {

  return (
    <section className="space-y-5">

      <Panel title="Referral Performance">

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">

          {[
            ['Created',referralCount || '1,250'],
            ['Accepted','1,102'],
            ['Completed','928'],
            ['Pending',referralCount || '174'],
            ['Overdue','82']
          ].map(([a,b]) => (

            <Mini
              key={a}
              label={a}
              value={b}
            />

          ))}

        </div>


        <div className="mt-5 p-4 rounded-xl bg-sky-50">

          <p className="text-sm">
            Completion rate
          </p>

          <p className="text-3xl font-bold text-sky-700">
            74%
          </p>

        </div>

      </Panel>


      <Panel title="Delayed Referral Detection">

        <Bars
          data={[
            ['District A',24],
            ['District B',18],
            ['District C',11],
            ['District D',8]
          ]}
        />

        <button
          onClick={() =>
            notify('Referral investigation list opened')
          }
          className="mt-5 px-4 py-2 rounded-xl bg-sky-600 text-white"
        >
          Investigate delayed referrals
        </button>

      </Panel>

    </section>
  )
}


/* =========================================================
   ANALYTICS
========================================================= */

function AnalyticsView({
  forecast,
  setForecast
}) {

  return (
    <section className="space-y-5">

      <Panel title="Healthcare Access Score">

        <div className="flex flex-wrap gap-6 items-center">

          <div className="w-32 h-32 rounded-full border-[14px] border-sky-200 flex items-center justify-center">

            <span className="text-3xl font-bold">
              78
            </span>

          </div>


          <div className="grid sm:grid-cols-2 gap-3 flex-1">

            {[
              ['Service availability',85],
              ['Doctor availability',72],
              ['Diagnostic availability',64],
              ['Medicine availability',81],
              ['Waiting time',75],
              ['Accessibility',92]
            ].map(([a,b]) => (

              <Mini
                key={a}
                label={a}
                value={`${b}/100`}
              />

            ))}

          </div>

        </div>

      </Panel>


      <Panel title="Demand Forecasting">

        <div className="flex items-center justify-between gap-3">

          <div>

            <p className="text-sm text-slate-500">
              Forecast horizon: tomorrow
            </p>

            <p className="font-semibold">
              Forecasts are planning estimates, not guarantees.
            </p>

          </div>

          <button
            onClick={() =>
              setForecast(!forecast)
            }
            className="px-4 py-2 rounded-xl bg-sky-600 text-white"
          >
            {forecast
              ? 'Hide forecast'
              : 'Show forecast'}
          </button>

        </div>


        {forecast && (

          <div className="grid md:grid-cols-3 gap-4 mt-5">

            {[
              ['Blood Test','+12%'],
              ['Ultrasound','+21%'],
              ['General OPD','+8%']
            ].map(([a,b]) => (

              <div
                key={a}
                className="border rounded-xl p-5"
              >

                <p className="text-sm text-slate-500">
                  {a}
                </p>

                <p className="text-2xl font-bold mt-1">
                  {b}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Expected demand change
                </p>

              </div>

            ))}

          </div>

        )}

      </Panel>


      <Panel title="Quality Monitoring">

        <Bars
          data={[
            ['Referral completion',78],
            ['Follow-up completion',82],
            ['Medicine availability',91],
            ['Diagnostic availability',84],
            ['Facility data freshness',89]
          ]}
        />

      </Panel>

    </section>
  )
}


/* =========================================================
   ALERTS
========================================================= */

function AlertsView({
  notify,
  onOpenMonitoring,
  activeEmergencyCount
}) {

  const [activeAlert,setActiveAlert] = useState(null)

  return (
    <section className="space-y-4">

      <div>

        <h2 className="text-xl font-bold">
          Admin Alerts
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Open any alert to inspect the operational details and suggested administrative action.
        </p>

      </div>


      {activeEmergencyCount > 0 && (

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-4">

          <div className="p-3 rounded-xl bg-red-100 text-red-600">
            <CircleAlert/>
          </div>

          <div>

            <p className="font-bold text-red-700">
              Active Emergency Requests
            </p>

            <p className="text-sm text-red-600">
              {activeEmergencyCount} active emergency request(s) require monitoring.
            </p>

          </div>

        </div>

      )}


      {alerts.map((a,i) => (

        <div
          key={a.id}
          className="bg-white border rounded-2xl p-5 flex items-center justify-between gap-4"
        >

          <div className="flex gap-4 items-center">

            <div
              className={`p-3 rounded-xl ${
                i===0
                  ? 'bg-red-100 text-red-600'
                  : 'bg-amber-100 text-amber-600'
              }`}
            >
              <CircleAlert/>
            </div>

            <div>

              <p className="font-bold">
                {a.title}
              </p>

              <p className="text-sm text-slate-500">
                {a.summary}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Alert ID: {a.id}
              </p>

            </div>

          </div>


          <button
            onClick={() =>
              setActiveAlert(a)
            }
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
          >
            View details
          </button>

        </div>

      ))}


      {activeAlert && (

        <div
          className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-5"
          onClick={() =>
            setActiveAlert(null)
          }
        >

          <div
            className="bg-white rounded-2xl max-w-xl w-full shadow-2xl"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="p-5 border-b flex items-start justify-between gap-4">

              <div>

                <p className="text-xs uppercase tracking-wide text-sky-600 font-bold">
                  {activeAlert.type}
                </p>

                <h3 className="text-xl font-bold mt-1">
                  {activeAlert.title}
                </h3>

              </div>

              <button
                onClick={() =>
                  setActiveAlert(null)
                }
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={20}/>
              </button>

            </div>


            <div className="p-5 space-y-4">

              <div className="grid grid-cols-2 gap-3">

                <Mini
                  label="Affected"
                  value={activeAlert.count}
                />

                <Mini
                  label="Alert ID"
                  value={activeAlert.id}
                />

              </div>


              <div className="bg-slate-50 rounded-xl p-4">

                <p className="font-semibold mb-1">
                  What is happening?
                </p>

                <p className="text-sm text-slate-600 leading-6">
                  {activeAlert.detail}
                </p>

              </div>


              <div className="bg-sky-50 rounded-xl p-4">

                <p className="font-semibold text-sky-800">
                  Recommended administrative action
                </p>

                <p className="text-sm text-sky-700 mt-1">
                  {activeAlert.action}.
                  Open the relevant monitoring module to inspect the affected facilities or districts.
                </p>

              </div>


              <button
                onClick={() => {
                  setActiveAlert(null)
                  onOpenMonitoring(activeAlert)
                }}
                className="w-full bg-sky-600 text-white py-3 rounded-xl"
              >
                Open related monitoring
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  )
}


/* =========================================================
   REPORTS
========================================================= */

function ReportsView({
  exportCSV,
  notify
}) {

  return (
    <section className="grid md:grid-cols-3 gap-5">

      {[
        ['Daily report','Healthcare Service Report'],
        ['Weekly report','Facility Availability Report'],
        ['Monthly report','Healthcare Quality Report']
      ].map(([a,b]) => (

        <div
          key={a}
          className="bg-white border rounded-2xl p-6"
        >

          <FileText className="text-sky-600"/>

          <h3 className="font-bold mt-4">
            {a}
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            {b}
          </p>

          <button
            onClick={
              a === 'Daily report'
                ? exportCSV
                : () => notify(`${a} generated`)
            }
            className="mt-5 w-full py-2.5 rounded-xl bg-sky-600 text-white flex justify-center gap-2"
          >
            <Download size={17}/>
            Export CSV
          </button>

        </div>

      ))}

    </section>
  )
}


/* =========================================================
   USER MANAGEMENT
========================================================= */

function UserManagement({
  notify,
  firebaseUsers,
  firebasePatients
}) {

  const [role,setRole] = useState('All')

  /*
     Use Firebase users when available.
     Existing demo users remain as fallback.
  */

  const firebaseDisplayUsers = firebaseUsers.length > 0
    ? firebaseUsers.map(u => ({
        id: u.firestoreId,
        name: u.name || u.displayName || u.email || 'User',
        role: u.role || 'User',
        detail: u.email || 'Firebase account',
        status: u.status || 'Active',
        location: u.location || u.village || u.district || 'Not specified'
      }))
    : users

  const filteredUsers =
    role === 'All'
      ? firebaseDisplayUsers
      : firebaseDisplayUsers.filter(
          u => u.role === role
        )

  return (
    <section className="space-y-5">

      <Panel title="User Management">

        <div className="flex flex-wrap gap-2 mb-5">

          {[
            'All',
            'Patient',
            'Health Worker',
            'Doctor',
            'Government Admin'
          ].map(r => (

            <button
              key={r}
              onClick={() =>
                setRole(r)
              }
              className={`px-4 py-2 rounded-xl text-sm ${
                role === r
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {r}
            </button>

          ))}

        </div>


        <div className="grid md:grid-cols-2 gap-3">

          {filteredUsers.map(u => (

            <div
              key={u.id}
              className="border rounded-xl p-4 flex items-center justify-between gap-4"
            >

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <UserRound size={19}/>
                </div>

                <div>

                  <p className="font-semibold">
                    {u.name}
                  </p>

                  <p className="text-sm text-slate-500">
                    {u.role} · {u.detail}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {u.location} · ID {u.id}
                  </p>

                </div>

              </div>


              <button
                onClick={() =>
                  notify(
                    `${u.name}: permission settings opened`
                  )
                }
                className="px-3 py-2 rounded-lg bg-slate-100 whitespace-nowrap"
              >
                Manage
              </button>

            </div>

          ))}

        </div>

      </Panel>


      <Panel title="Role hierarchy & access">

        <div className="grid md:grid-cols-4 gap-3">

          {[
            ['Patient','Own care information'],
            ['Health Worker','Field care and assigned patient information'],
            ['Doctor','Clinical information required for patient care'],
            ['Government Admin','System-level and aggregate operational information']
          ].map(([a,b]) => (

            <div
              key={a}
              className="border rounded-xl p-4"
            >

              <p className="font-semibold">
                {a}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {b}
              </p>

            </div>

          ))}

        </div>


        <div className="mt-5 bg-sky-50 p-4 rounded-xl text-sm">

          <ShieldCheck className="inline mr-2 text-sky-600"/>

          Role-based access limits information to what each role needs.
          Government administrators primarily receive aggregate operational information rather than unrestricted clinical records.

        </div>

      </Panel>

    </section>
  )
}


/* =========================================================
   MAIN GOVERNMENT ADMIN DASHBOARD
========================================================= */

function GovernmentAdminDashboard({
  user,
  onLogout
}) {

  const [tab,setTab] = useState('overview')

  const [selected,setSelected] =
    useState(facilities[0])

  const [query,setQuery] =
    useState('')

  const [status,setStatus] =
    useState('All')

  const [district,setDistrict] =
    useState('All')

  const [mapLayer,setMapLayer] =
    useState('Facility availability')

  const [period,setPeriod] =
    useState('This Week')

  const [forecast,setForecast] =
    useState(true)

  const [toast,setToast] =
    useState('')


  /* =========================================================
     FIREBASE STATES
  ========================================================= */

  const [firebasePatients,setFirebasePatients] =
    useState([])

  const [firebaseUsers,setFirebaseUsers] =
    useState([])

  const [firebaseAppointments,setFirebaseAppointments] =
    useState([])

  const [firebaseReferrals,setFirebaseReferrals] =
    useState([])

  const [firebaseFollowUps,setFirebaseFollowUps] =
    useState([])

  const [firebaseEmergencies,setFirebaseEmergencies] =
    useState([])

  const [firebaseTriage,setFirebaseTriage] =
    useState([])

  const [firebaseNotifications,setFirebaseNotifications] =
    useState([])


  /* =========================================================
     FIREBASE REAL-TIME LISTENERS
  ========================================================= */

  useEffect(() => {

    const unsubPatients = onSnapshot(
      collection(db,'patients'),
      snapshot => {

        setFirebasePatients(
          snapshot.docs.map(doc => ({
            firestoreId:doc.id,
            ...doc.data()
          }))
        )

      },
      error =>
        console.error(
          'Patients Firebase error:',
          error
        )
    )


    const unsubUsers = onSnapshot(
      collection(db,'users'),
      snapshot => {

        setFirebaseUsers(
          snapshot.docs.map(doc => ({
            firestoreId:doc.id,
            ...doc.data()
          }))
        )

      },
      error =>
        console.error(
          'Users Firebase error:',
          error
        )
    )


    const unsubAppointments = onSnapshot(
      collection(db,'appointments'),
      snapshot => {

        setFirebaseAppointments(
          snapshot.docs.map(doc => ({
            firestoreId:doc.id,
            ...doc.data()
          }))
        )

      },
      error =>
        console.error(
          'Appointments Firebase error:',
          error
        )
    )


    const unsubReferrals = onSnapshot(
      collection(db,'referrals'),
      snapshot => {

        setFirebaseReferrals(
          snapshot.docs.map(doc => ({
            firestoreId:doc.id,
            ...doc.data()
          }))
        )

      },
      error =>
        console.error(
          'Referrals Firebase error:',
          error
        )
    )


    const unsubFollowUps = onSnapshot(
      collection(db,'followUps'),
      snapshot => {

        setFirebaseFollowUps(
          snapshot.docs.map(doc => ({
            firestoreId:doc.id,
            ...doc.data()
          }))
        )

      },
      error =>
        console.error(
          'FollowUps Firebase error:',
          error
        )
    )


    const unsubEmergencies = onSnapshot(
      collection(db,'emergencyRequests'),
      snapshot => {

        setFirebaseEmergencies(
          snapshot.docs.map(doc => ({
            firestoreId:doc.id,
            ...doc.data()
          }))
        )

      },
      error =>
        console.error(
          'Emergency Firebase error:',
          error
        )
    )


    const unsubTriage = onSnapshot(
      collection(db,'triageRecords'),
      snapshot => {

        setFirebaseTriage(
          snapshot.docs.map(doc => ({
            firestoreId:doc.id,
            ...doc.data()
          }))
        )

      },
      error =>
        console.error(
          'Triage Firebase error:',
          error
        )
    )


    const unsubNotifications = onSnapshot(
      collection(db,'notifications'),
      snapshot => {

        setFirebaseNotifications(
          snapshot.docs.map(doc => ({
            firestoreId:doc.id,
            ...doc.data()
          }))
        )

      },
      error =>
        console.error(
          'Notifications Firebase error:',
          error
        )
    )


    return () => {

      unsubPatients()
      unsubUsers()
      unsubAppointments()
      unsubReferrals()
      unsubFollowUps()
      unsubEmergencies()
      unsubTriage()
      unsubNotifications()

    }

  }, [])


  /* =========================================================
     FIREBASE CALCULATIONS
  ========================================================= */

  const doctorUsers = useMemo(
    () =>
      firebaseUsers.filter(
        u =>
          String(u.role || '')
            .toLowerCase() === 'doctor'
      ),
    [firebaseUsers]
  )


  const healthWorkerUsers = useMemo(
    () =>
      firebaseUsers.filter(u => {

        const role =
          String(u.role || '')
            .toLowerCase()

        return (
          role === 'healthworker' ||
          role === 'health worker' ||
          role === 'worker'
        )

      }),
    [firebaseUsers]
  )


  const activeEmergencyCount =
    useMemo(
      () =>
        firebaseEmergencies.filter(e => {

          const status =
            String(e.status || '')
              .toLowerCase()

          return (
            status !== 'completed' &&
            status !== 'patient reached' &&
            status !== 'closed'
          )

        }).length,
      [firebaseEmergencies]
    )


  const pendingReferralCount =
    useMemo(
      () =>
        firebaseReferrals.filter(r => {

          const status =
            String(r.status || '')
              .toLowerCase()

          return (
            status !== 'completed' &&
            status !== 'patient reached'
          )

        }).length,
      [firebaseReferrals]
    )


  const highRiskCount =
    useMemo(
      () =>
        firebaseTriage.filter(t => {

          const risk =
            String(
              t.riskLevel ||
              t.priority ||
              ''
            ).toLowerCase()

          return (
            risk === 'high' ||
            risk === 'critical' ||
            risk === 'emergency'
          )

        }).length,
      [firebaseTriage]
    )


  /* =========================================================
     EXISTING FACILITY FILTER
  ========================================================= */

  const filtered =
    useMemo(
      () =>
        facilities.filter(f => {

          const q =
            query.toLowerCase()

          return (
            (
              !q ||
              `${f.name} ${f.district} ${f.type}`
                .toLowerCase()
                .includes(q)
            ) &&
            (
              status === 'All' ||
              f.status === status
            ) &&
            (
              district === 'All' ||
              f.district === district
            )
          )

        }),
      [
        query,
        status,
        district
      ]
    )


  /* =========================================================
     NOTIFICATION / TOAST
  ========================================================= */

  const notify = message => {

    setToast(message)

    setTimeout(
      () => setToast(''),
      2500
    )

  }


  /* =========================================================
     CSV EXPORT
  ========================================================= */

  const exportCSV = () => {

    const rows = [
      [
        'Facility',
        'Type',
        'District',
        'Status',
        'Doctors',
        'Beds Available',
        'Medicine',
        'Wait Minutes',
        'Last Updated'
      ],
      ...filtered.map(f => [
        f.name,
        f.type,
        f.district,
        f.status,
        f.doctors,
        `${f.beds}/${f.totalBeds}`,
        f.medicine,
        f.wait,
        f.updated
      ])
    ]


    const csv =
      rows
        .map(r =>
          r
            .map(v =>
              `"${String(v).replaceAll('"','""')}"`
            )
            .join(',')
        )
        .join('\n')


    const blob =
      new Blob(
        [csv],
        {type:'text/csv'}
      )


    const url =
      URL.createObjectURL(blob)


    const a =
      document.createElement('a')

    a.href = url
    a.download =
      'caremitra-healthcare-report.csv'

    a.click()

    URL.revokeObjectURL(url)

    notify(
      'CSV report generated'
    )

  }


  /* =========================================================
     MAP LAYER
  ========================================================= */

  const layerValue = f => {

    if (
      mapLayer ===
      'Doctor shortage'
    ) {

      return Number(
        f.doctors.split('/')[0]
      ) /
      Number(
        f.doctors.split('/')[1]
      ) < .7
        ? 'Critical'
        : 'Normal'

    }


    if (
      mapLayer ===
      'Medicine shortage'
    ) {

      return f.medicine ===
        'Unavailable'
        ? 'Critical'
        : f.medicine ===
          'Low stock'
          ? 'Warning'
          : 'Normal'

    }


    if (
      mapLayer ===
      'Diagnostic shortage'
    ) {

      return (
        !f.lab ||
        !f.xray
      )
        ? 'Warning'
        : 'Normal'

    }


    if (
      mapLayer ===
      'Long waiting time'
    ) {

      return f.wait > 40
        ? 'Critical'
        : f.wait > 25
          ? 'Warning'
          : 'Normal'

    }


    return f.status

  }


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const nav = [
    ['overview','Overview',BarChart3],
    ['facilities','Facilities',Hospital],
    ['staff','Staff',Users],
    ['diagnostics','Diagnostics',FlaskConical],
    ['medicines','Medicines',Pill],
    ['referrals','Referrals',RefreshCw],
    ['analytics','Analytics',TrendingUp],
    ['alerts','Alerts',Bell],
    ['reports','Reports',FileText],
    ['users','Users',ShieldCheck]
  ]


  /* =========================================================
     MAIN UI
  ========================================================= */

  return (

    <div className="min-h-screen bg-slate-50 flex">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="hidden lg:flex w-64 bg-slate-950 text-white flex-col fixed inset-y-0">

        <div className="p-6 border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">

              <HeartPulse/>

            </div>

            <div>

              <p className="font-bold text-lg">
                CareMitra
              </p>

              <p className="text-xs text-slate-400">
                Government Admin
              </p>

            </div>

          </div>

        </div>


        <nav className="p-3 space-y-1 overflow-y-auto">

          {nav.map(
            ([id,label,Icon]) => (

              <button
                key={id}
                onClick={() =>
                  setTab(id)
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left ${
                  tab === id
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >

                <Icon size={18}/>

                {label}

              </button>

            )
          )}

        </nav>


        <div className="mt-auto p-4 border-t border-white/10">

          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15"
          >
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="lg:ml-64 flex-1">


        {/* HEADER */}

        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">

          <div className="px-5 lg:px-8 py-4 flex items-center justify-between gap-4">

            <div>

              <p className="text-xs uppercase tracking-wider text-sky-600 font-bold">
                System monitoring & decision support
              </p>

              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Public Healthcare Overview
              </h1>

            </div>


            <div className="flex items-center gap-2">

              <span className="hidden md:block text-sm text-slate-500">
                Welcome, {user?.name || 'Government Admin'}
              </span>

              <button
                onClick={() =>
                  setTab('alerts')
                }
                className="relative p-2.5 rounded-xl bg-slate-100 text-slate-600"
              >

                <Bell size={19}/>

                <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] rounded-full bg-red-500 text-white flex items-center justify-center">
                  {activeEmergencyCount > 0
                    ? activeEmergencyCount
                    : 12}
                </span>

              </button>

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="p-5 lg:p-8">

          {toast && (

            <div className="fixed top-20 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl">
              {toast}
            </div>

          )}


          {/* =================================================
              OVERVIEW
          ================================================= */}

          {tab === 'overview' && (

            <>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                <StatCard
                  icon={Hospital}
                  label="Facilities"
                  value="128"
                  note="98 normal · 18 warning · 12 critical"
                />

                <StatCard
                  icon={Users}
                  label="Patients Served Today"
                  value={
                    firebasePatients.length ||
                    '8,426'
                  }
                  note={
                    firebasePatients.length
                      ? 'Live Firebase patient records'
                      : 'Across participating facilities'
                  }
                />

                <StatCard
                  icon={Clock3}
                  label="Average Waiting Time"
                  value="24 min"
                  note="System-wide operational average"
                />

                <StatCard
                  icon={RefreshCw}
                  label="Pending Referrals"
                  value={
                    firebaseReferrals.length
                      ? pendingReferralCount
                      : '342'
                  }
                  note={
                    firebaseReferrals.length
                      ? `${firebaseReferrals.length} total Firebase referrals`
                      : '82 currently overdue'
                  }
                />

              </div>


              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

                <StatCard
                  icon={Pill}
                  label="Medicine Shortages"
                  value="18"
                  note="Facilities reporting shortages"
                />

                <StatCard
                  icon={FlaskConical}
                  label="Diagnostic Shortages"
                  value="11"
                  note="Capacity/service gaps"
                />

                <StatCard
                  icon={Users}
                  label="Staff Availability"
                  value={
                    firebaseUsers.length
                      ? `${doctorUsers.length + healthWorkerUsers.length}`
                      : '278 / 320'
                  }
                  note={
                    firebaseUsers.length
                      ? `${doctorUsers.length} doctors · ${healthWorkerUsers.length} health workers`
                      : '42 staff positions short'
                  }
                />

                <StatCard
                  icon={ShieldCheck}
                  label="Data Freshness"
                  value="89%"
                  note="Updated within the expected window"
                />

              </div>


              {/* =================================================
                  FIREBASE LIVE SUMMARY
              ================================================= */}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

                <StatCard
                  icon={CalendarDays}
                  label="Appointments"
                  value={firebaseAppointments.length}
                  note="Live Firebase appointments"
                />

                <StatCard
                  icon={CircleAlert}
                  label="Active Emergencies"
                  value={activeEmergencyCount}
                  note="Live emergency requests"
                />

                <StatCard
                  icon={HeartPulse}
                  label="High Risk Cases"
                  value={highRiskCount}
                  note="From triage records"
                />

                <StatCard
                  icon={Bell}
                  label="Notifications"
                  value={firebaseNotifications.length}
                  note="System notifications"
                />

              </div>


              {/* =================================================
                  MAP
              ================================================= */}

              <section className="mt-6 bg-white rounded-2xl border border-slate-200 p-5">

                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">

                  <div>

                    <h2 className="font-bold text-lg">
                      Healthcare Shortage Heatmap
                    </h2>

                    <p className="text-sm text-slate-500">
                      Operational map with district-style geography and clickable facility markers; not a hospital ranking.
                    </p>

                  </div>


                  <select
                    value={mapLayer}
                    onChange={e =>
                      setMapLayer(e.target.value)
                    }
                    className="border rounded-xl px-3 py-2 text-sm"
                  >

                    {[
                      'Facility availability',
                      'Doctor shortage',
                      'Medicine shortage',
                      'Diagnostic shortage',
                      'Long waiting time'
                    ].map(x => (
                      <option key={x}>
                        {x}
                      </option>
                    ))}

                  </select>

                </div>


                <div className="grid md:grid-cols-3 gap-4">

                  <GovernmentMap
                    filtered={filtered}
                    selected={selected}
                    setSelected={setSelected}
                    layerValue={layerValue}
                  />


                  <div className="md:col-span-2 border rounded-2xl p-5">

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="font-bold">
                          {selected.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {selected.type} · {selected.district}
                        </p>

                      </div>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-bold ${statusTone[selected.status]}`}
                      >
                        {selected.status}
                      </span>

                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

                      <Mini
                        label="Doctors"
                        value={selected.doctors}
                      />

                      <Mini
                        label="Beds"
                        value={`${selected.beds}/${selected.totalBeds}`}
                      />

                      <Mini
                        label="Wait"
                        value={`${selected.wait} min`}
                      />

                      <Mini
                        label="Medicine"
                        value={selected.medicine}
                      />

                    </div>


                    <div className="grid grid-cols-3 gap-3 mt-4 text-sm">

                      <Info
                        ok={selected.lab}
                        label="Lab"
                      />

                      <Info
                        ok={selected.xray}
                        label="X-Ray"
                      />

                      <Info
                        ok={selected.ultrasound}
                        label="Ultrasound"
                      />

                    </div>


                    <p className="text-xs text-slate-500 mt-4">
                      Last updated {selected.updated} · Data confidence: {selected.confidence}
                    </p>

                  </div>

                </div>

              </section>


              {/* =================================================
                  OVERVIEW PANELS
              ================================================= */}

              <div className="grid lg:grid-cols-2 gap-5 mt-6">

                <Panel title="Staff Availability by District">

                  <Bars
                    data={[
                      ['Kanchipuram',72],
                      ['Chengalpattu',81],
                      ['Madurantakam',64],
                      ['Uthiramerur',91]
                    ]}
                  />

                </Panel>


                <Panel title="Diagnostic Availability">

                  <Bars
                    data={[
                      ['Blood Test',92],
                      ['X-Ray',87],
                      ['Ultrasound',64],
                      ['CT',38]
                    ]}
                  />

                </Panel>


                <Panel title="Medicine Availability">

                  <Bars
                    data={[
                      ['Available',82],
                      ['Low stock',12],
                      ['Unavailable',6]
                    ]}
                  />

                </Panel>


                <Panel
                  title={`Waiting-Time Analytics · ${period}`}
                >

                  <div className="flex gap-2 mb-4 flex-wrap">

                    {[
                      'Today',
                      'Yesterday',
                      'This Week',
                      'This Month'
                    ].map(p => (

                      <button
                        key={p}
                        onClick={() =>
                          setPeriod(p)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs ${
                          period === p
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>

                    ))}

                  </div>


                  <Bars
                    data={[
                      ['District A',18],
                      ['District B',42],
                      ['District C',21],
                      ['District D',15]
                    ]}
                    suffix=" min"
                  />

                </Panel>

              </div>

            </>

          )}


          {/* =================================================
              FACILITIES
          ================================================= */}

          {tab === 'facilities' && (

            <FacilityRegistry
              filtered={filtered}
              query={query}
              setQuery={setQuery}
              status={status}
              setStatus={setStatus}
              district={district}
              setDistrict={setDistrict}
              selected={selected}
              setSelected={setSelected}
              notify={notify}
            />

          )}


          {/* =================================================
              STAFF
          ================================================= */}

          {tab === 'staff' && (

            <Monitoring
              title="Staff Availability Monitoring"
              icon={Users}
              cards={[
                [
                  'Required staff',
                  firebaseUsers.length
                    ? doctorUsers.length +
                      healthWorkerUsers.length
                    : '320'
                ],
                [
                  'Available',
                  firebaseUsers.length
                    ? doctorUsers.length +
                      healthWorkerUsers.length
                    : '278'
                ],
                [
                  'Shortage',
                  firebaseUsers.length
                    ? 'Live'
                    : '42'
                ],
                [
                  'Coverage',
                  firebaseUsers.length
                    ? 'Live'
                    : '86.9%'
                ]
              ]}
              bars={[
                ['Kanchipuram',72],
                ['Chengalpattu',81],
                ['Madurantakam',64],
                ['Uthiramerur',91]
              ]}
            />

          )}


          {/* =================================================
              DIAGNOSTICS
          ================================================= */}

          {tab === 'diagnostics' && (

            <Monitoring
              title="Diagnostic Demand vs Availability"
              icon={FlaskConical}
              cards={[
                ['Blood Test','1,200 / 1,450'],
                ['Ultrasound','900 / 540'],
                ['X-Ray','760 / 920'],
                ['CT','420 / 160']
              ]}
              bars={[
                ['Blood Test',83],
                ['X-Ray',87],
                ['Ultrasound',60],
                ['CT',38]
              ]}
            />

          )}


          {/* =================================================
              MEDICINES
          ================================================= */}

          {tab === 'medicines' && (

            <Monitoring
              title="Medicine Availability Monitoring"
              icon={Pill}
              cards={[
                ['Available','82%'],
                ['Low Stock','12%'],
                ['Unavailable','6%'],
                ['Facilities affected','18']
              ]}
              bars={[
                ['Facility A',30],
                ['Facility C',55],
                ['Facility E',85],
                ['Facility F',20]
              ]}
            />

          )}


          {/* =================================================
              REFERRALS
          ================================================= */}

          {tab === 'referrals' && (

            <ReferralView
              notify={notify}
              referralCount={
                firebaseReferrals.length
                  ? firebaseReferrals.length
                  : null
              }
            />

          )}


          {/* =================================================
              ANALYTICS
          ================================================= */}

          {tab === 'analytics' && (

            <AnalyticsView
              forecast={forecast}
              setForecast={setForecast}
            />

          )}


          {/* =================================================
              ALERTS
          ================================================= */}

          {tab === 'alerts' && (

            <AlertsView
              notify={notify}
              activeEmergencyCount={
                activeEmergencyCount
              }
              onOpenMonitoring={alert => {

                const map = {
                  'Critical facility shortages':
                    'facilities',

                  'Outdated availability data':
                    'facilities',

                  'Overdue referrals':
                    'referrals',

                  'Medicine unavailability':
                    'medicines'
                }

                const target =
                  map[alert.title] ||
                  'overview'

                setTab(target)

                notify(
                  `Opened ${target} monitoring`
                )

              }}
            />

          )}


          {/* =================================================
              REPORTS
          ================================================= */}

          {tab === 'reports' && (

            <ReportsView
              exportCSV={exportCSV}
              notify={notify}
            />

          )}


          {/* =================================================
              USERS
          ================================================= */}

          {tab === 'users' && (

            <UserManagement
              notify={notify}
              firebaseUsers={firebaseUsers}
              firebasePatients={firebasePatients}
            />

          )}

        </div>

      </main>

    </div>

  )
}


export default GovernmentAdminDashboard
