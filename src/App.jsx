import { useEffect, useState } from 'react'
import Login from './pages/Login'

import PatientDashboard from './pages/PatientDashboard'
import HealthcareSearch from './pages/HealthcareSearch'
import DigitalTriage from './pages/DigitalTriage'
import Appointment from './pages/Appointment'
import TravelPlanner from './pages/TravelPlanner'
import CostEntitlement from './pages/CostEntitlement'
import MedicalRecords from './pages/MedicalRecords'
import Medicines from './pages/Medicines'
import Diagnostics from './pages/Diagnostics'
import PatientProfile from './pages/PatientProfile'
import FollowUps from './pages/FollowUps'
import Notifications from './pages/Notifications'
import VoiceLanguage from './pages/VoiceLanguage'
import OfflineMode from './pages/OfflineMode'
import EmergencySOS from './pages/EmergencySOS'
import HealthSummary from './pages/HealthSummary'

import HealthWorkerDashboard from './pages/HealthWorkerDashboard'
import HealthWorkerProfile from './pages/HealthWorkerProfile'
import RegisterPatient from './pages/RegisterPatient'
import PatientList from './pages/PatientList'
import HealthWorkerTriage from './pages/HealthWorkerTriage'
import HealthWorkerReferrals from './pages/HealthWorkerReferrals'
import HealthWorkerFollowUps from './pages/HealthWorkerFollowUps'
import HighRiskAlerts from './pages/HighRiskAlerts'
import HealthWorkerNotifications from './pages/HealthWorkerNotifications'
import HealthWorkerOfflineRecords from './pages/HealthWorkerOfflineRecords'
import HealthWorkerEmergency from './pages/HealthWorkerEmergency'
import EmergencyAlertCenter from './pages/EmergencyAlertCenter'
import EmergencyTracking from './pages/EmergencyTracking'
import CareJourney from './pages/CareJourney'
import WorkerHealthSummary from './pages/WorkerHealthSummary'
import HealthWorkerAppointments from './pages/HealthWorkerAppointments'
import DoctorDashboard from './pages/DoctorDashboard'
import GovernmentAdminDashboard from './pages/GovernmentAdminDashboard'
import AIHealthAssistant from './pages/AIHealthAssistant'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState('')
  const [page, setPage] = useState('dashboard')
  const [user, setUser] = useState(null)

  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [selectedReferralPatient, setSelectedReferralPatient] = useState(null)
  const [selectedWorkerPatient, setSelectedWorkerPatient] = useState(null)

  useEffect(() => {
    localStorage.removeItem('caremitraActiveRole')
  }, [])

  const handleLogin = (selectedRole, userData) => {
    setRole(selectedRole)
    setUser(userData)
    setLoggedIn(true)
    setPage('dashboard')

    localStorage.setItem(
      'caremitraUser',
      JSON.stringify(userData)
    )

    localStorage.setItem(
      'caremitraActiveRole',
      selectedRole
    )
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setRole('')
    setUser(null)
    setPage('dashboard')
    setSelectedEmergency(null)
    setSelectedReferralPatient(null)
    setSelectedWorkerPatient(null)

    localStorage.removeItem('caremitraUser')
    localStorage.removeItem('caremitraActiveRole')
  }

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />
  }

  if (role === 'Patient') {
    if (page === 'dashboard') {
      return (
        <PatientDashboard
          user={user}
          onSearch={() => setPage('search')}
          onTriage={() => setPage('triage')}
          onAppointment={() => setPage('appointment')}
          onTravel={() => setPage('travel')}
          onCost={() => setPage('cost')}
          onRecords={() => setPage('records')}
          onMedicines={() => setPage('medicines')}
          onDiagnostics={() => setPage('diagnostics')}
          onFollowUps={() => setPage('followups')}
          onNotifications={() => setPage('notifications')}
          onVoice={() => setPage('voice')}
          onAI={() => setPage('ai-assistant')}
          onOffline={() => setPage('offline')}
          onProfile={() => setPage('profile')}
          onEmergency={() => setPage('emergency')}
          onHealthSummary={() => setPage('health-summary')}
          onLogout={handleLogout}
        />
      )
    }

    if (page === 'search') {
      return (
        <HealthcareSearch
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'triage') {
      return (
        <DigitalTriage
          onBack={() => setPage('dashboard')}
          onAppointment={() => setPage('appointment')}
        />
      )
    }

    if (page === 'appointment') {
      return (
        <Appointment
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'travel') {
      return (
        <TravelPlanner
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'cost') {
      return (
        <CostEntitlement
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'records') {
      return (
        <MedicalRecords
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'medicines') {
      return (
        <Medicines
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'diagnostics') {
      return (
        <Diagnostics
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'followups') {
      return (
        <FollowUps
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'notifications') {
      return (
        <Notifications
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'voice') {
      return (
        <VoiceLanguage
          onBack={() => setPage('dashboard')}
        />
      )
    }
    if (page === 'ai-assistant') {
  return (
    <AIHealthAssistant
      onBack={() => setPage('dashboard')}
    />
  )
}

    if (page === 'offline') {
      return (
        <OfflineMode
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'profile') {
      return (
        <PatientProfile
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'health-summary') {
      return (
        <HealthSummary
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'emergency') {
      return (
        <EmergencySOS
          onBack={() => setPage('dashboard')}
        />
      )
    }
  }

  if (role === 'Doctor') {
    return (
      <DoctorDashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  if (role === 'Government Admin') {
    return (
      <GovernmentAdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    )
  }

  if (role === 'Health Worker') {
    if (page === 'dashboard') {
      return (
        <HealthWorkerDashboard
          user={user}
          onRegisterPatient={() => setPage('register-patient')}
          onPatients={() => setPage('patients')}
          onTriage={() => setPage('worker-triage')}
          onRecords={() => setPage('worker-offline')}
          onReferrals={() => setPage('worker-referrals')}
          onFollowUps={() => setPage('worker-followups')}
          onAlerts={() => setPage('high-risk-alerts')}
          onNotifications={() => setPage('worker-notifications')}
          onOffline={() => setPage('worker-offline')}
          onEmergency={() => setPage('worker-emergency')}
          onEmergencyAlerts={() => setPage('emergency-alerts')}
          onEmergencyTracking={() => {
            setSelectedEmergency({
              id: 'EMG-DEMO-1001',
              patient: 'Meena',
              patientId: 'SC-2026-1043',
              age: 35,
              location: 'Madurantakam',
              emergency: 'Breathing Difficulty',
              phone: '+91 98765 40103',
              status: 'New'
            })
            setPage('emergency-tracking')
          }}
          onProfile={() => setPage('worker-profile')}
          onWorkerHealthSummary={() => {
            setSelectedWorkerPatient({
              id: 'SC-2026-1048',
              name: user?.name || 'CareMitra Patient',
              age: 42,
              village: 'Kanchipuram Village',
              mobile: user?.mobile || '+91 98765 43210'
            })
            setPage('worker-health-summary')
          }}
          onAppointments={() => setPage('worker-appointments')}
          onCareJourney={() => setPage('care-journey')}
          onLogout={handleLogout}
        />
      )
    }

    if (page === 'worker-profile') {
      return (
        <HealthWorkerProfile
          user={user}
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'register-patient') {
      return (
        <RegisterPatient
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'patients') {
      return (
        <PatientList
          onBack={() => setPage('dashboard')}
          onTriage={patient => {
            setSelectedWorkerPatient(patient)
            setPage('worker-triage')
          }}
          onHealthSummary={patient => {
            setSelectedWorkerPatient(patient)
            setPage('worker-health-summary')
          }}
          onReferral={patient => {
            setSelectedReferralPatient(patient)
            setPage('worker-referrals')
          }}
        />
      )
    }

    if (page === 'worker-triage') {
      return (
        <HealthWorkerTriage
          prefillPatient={selectedWorkerPatient}
          onBack={() => setPage('dashboard')}
          onReferral={patient => {
            setSelectedReferralPatient(patient)
            setPage('worker-referrals')
          }}
          onHealthSummary={patient => {
            setSelectedWorkerPatient(patient)
            setPage('worker-health-summary')
          }}
          onAppointments={() => setPage('worker-appointments')}
        />
      )
    }

    if (page === 'worker-appointments') {
      return (
        <HealthWorkerAppointments
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'worker-referrals') {
      return (
        <HealthWorkerReferrals
          prefillPatient={selectedReferralPatient}
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'worker-followups') {
      return (
        <HealthWorkerFollowUps
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'high-risk-alerts') {
      return (
        <HighRiskAlerts
          onBack={() => setPage('dashboard')}
          onReferral={patient => {
            setSelectedReferralPatient(patient)
            setPage('worker-referrals')
          }}
        />
      )
    }

    if (page === 'worker-notifications') {
      return (
        <HealthWorkerNotifications
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'worker-offline') {
      return (
        <HealthWorkerOfflineRecords
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'worker-emergency') {
      return (
        <HealthWorkerEmergency
          onBack={() => setPage('dashboard')}
          onReferral={patient => {
            setSelectedReferralPatient(patient)
            setPage('worker-referrals')
          }}
        />
      )
    }

    if (page === 'emergency-alerts') {
      return (
        <EmergencyAlertCenter
          onBack={() => setPage('dashboard')}
          onEmergency={emergency => {
            setSelectedEmergency(emergency)
            setPage('worker-emergency')
          }}
          onTracking={emergency => {
            setSelectedEmergency(emergency)
            setPage('emergency-tracking')
          }}
          onReferral={patient => {
            setSelectedReferralPatient(patient)
            setPage('worker-referrals')
          }}
        />
      )
    }

    if (page === 'emergency-tracking') {
      return (
        <EmergencyTracking
          emergency={selectedEmergency}
          onBack={() => setPage('emergency-alerts')}
          onReferral={patient => {
            setSelectedReferralPatient(patient)
            setPage('worker-referrals')
          }}
        />
      )
    }

    if (page === 'care-journey') {
      return (
        <CareJourney
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'health-summary') {
      return (
        <HealthSummary
          onBack={() => setPage('dashboard')}
        />
      )
    }

    if (page === 'worker-health-summary') {
      return (
        <WorkerHealthSummary
          patient={selectedWorkerPatient}
          onBack={() => setPage('patients')}
        />
      )
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">
          CareMitra
        </h1>

        <p className="text-slate-500 mt-2">
          Page not found
        </p>

        <button
          onClick={() => {
            setLoggedIn(false)
            setRole('')
            setUser(null)
            setPage('dashboard')
            localStorage.removeItem('caremitraUser')
            localStorage.removeItem('caremitraActiveRole')
          }}
          className="mt-5 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default App