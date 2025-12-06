import { useState } from 'react'
import './App.css'
import zusLogo from './assets/zus.svg'
import FormularzKrokowy from './components/FormularzKrokowy'
import FormularzPoszkodowanego from './components/FormularzPoszkodowanego'
import PanelPracownikaZUS from './components/PanelPracownikaZUS'
import WidokWeryfikacji from './components/WidokWeryfikacji'

// Ikony jako komponenty SVG
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

const AccidentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const MedicalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
)

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
)

const SwitchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17,1 21,5 17,9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7,23 3,19 7,15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
)

// Dane przykładowe
const recentReports = [
  { id: 1, date: '07.03.2021', employee: 'Janran Kowalski', type: 'Wypadki przy pracy', status: 'draft' },
  { id: 2, date: '20.03.2021', employee: 'Janran Kowalski', type: 'Wypadki przy pracy', status: 'sent' },
  { id: 3, date: '20.03.2021', employee: 'Janran Kowalski', type: 'Wypadki przy pracy', status: 'draft' },
]

type ViewType = 'dashboard' | 'form' | 'zus-panel' | 'verification'
type UserRole = 'platnik' | 'pracownik_zus'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [userRole, setUserRole] = useState<UserRole>('platnik')
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null)

  const handleStartForm = () => {
    setCurrentView('form')
  }

  const handleCancelForm = () => {
    setCurrentView('dashboard')
  }

  const handleSubmitForm = (data: unknown) => {
    console.log('Dane formularza:', data)
    alert('Dane poszkodowanego zostały zapisane!')
    setCurrentView('dashboard')
  }

  const toggleUserRole = () => {
    const newRole = userRole === 'platnik' ? 'pracownik_zus' : 'platnik'
    setUserRole(newRole)
    // Automatycznie przełącz widok
    if (newRole === 'pracownik_zus') {
      setCurrentView('zus-panel')
    } else {
      setCurrentView('dashboard')
    }
  }

  const handleVerifyForm = (formId: number) => {
    setSelectedFormId(formId)
    setCurrentView('verification')
  }

  const handleBackToPanel = () => {
    setCurrentView('zus-panel')
    setSelectedFormId(null)
  }

  const handleApproveForm = (formId: number) => {
    console.log('Zaakceptowano formularz:', formId)
    handleBackToPanel()
  }

  const handleRejectForm = (formId: number) => {
    console.log('Odrzucono formularz:', formId)
    handleBackToPanel()
  }

  return (
    <div className="app">
      {/* Top Header Bar */}
      <header className="top-header">
        <div className="top-header-content">
          <div className="header-left">
            <div className="logo-container">
              <img src={zusLogo} alt="ZUS - Zakład Ubezpieczeń Społecznych" className="logo-zus" />
            </div>
          </div>
          
          <div className="header-right">
            <span className="header-user-info">
              {userRole === 'platnik' 
                ? 'Płatnik: Jan Kowalski Usługi Budowlane, NIP: 1234567890'
                : 'Pracownik ZUS: Anna Nowak, ID: ZUS-12345'
              }
            </span>
            
            {/* Przycisk przełączania trybu */}
            <button 
              className="btn-role-switch" 
              onClick={toggleUserRole}
              title={`Przełącz na: ${userRole === 'platnik' ? 'Pracownik ZUS' : 'Płatnik'}`}
            >
              <SwitchIcon />
              <span className="role-label">
                {userRole === 'platnik' ? 'Płatnik' : 'ZUS'}
              </span>
            </button>

            <button className="header-notification">
              <BellIcon />
              <span className="notification-badge">{userRole === 'pracownik_zus' ? '5' : '1'}</span>
            </button>
            <button className="header-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <button className="header-search">
              <SearchIcon />
              <span>Szukaj</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="main-nav-content">
          <a 
            href="#" 
            className={`main-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <DashboardIcon />
            <span>Pulpit</span>
          </a>
          <a href="#" className="main-nav-item">
            <DocumentIcon />
            <span>Dokumenty ZUS</span>
          </a>
          <a 
            href="#" 
            className={`main-nav-item ${currentView === 'zus-panel' || currentView === 'form' || currentView === 'verification' ? 'active' : ''}`}
            onClick={() => userRole === 'pracownik_zus' ? setCurrentView('zus-panel') : null}
          >
            <AccidentIcon />
            <span>Wypadki przy pracy</span>
          </a>
          <a href="#" className="main-nav-item">
            <MedicalIcon />
            <span>e-ZLA</span>
          </a>
          <a href="#" className="main-nav-item">
            <HelpIcon />
            <span>Pomoc</span>
          </a>
          <a href="#" className="main-nav-item">
            <SettingsIcon />
            <span>Ustawienia</span>
          </a>
        </div>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        <div className="content-container">
          {/* Widok Dashboard Płatnika */}
          {currentView === 'dashboard' && userRole === 'platnik' && (
            <>
              <h1 className="page-title">Zgłoszenia wypadków przy pracy</h1>

              <div className="content-grid">
                {/* New Report Card */}
                <div className="card new-report-card">
                  <h2>Nowe zgłoszenie wypadku</h2>
                  <p>
                    Nowe zgłoszenie wypadku wyróżnisią do opratym zgłoszenie i 
                    wypadku przy pracy, zoeniemientu przy pracy świacego.
                  </p>
                  <button className="btn-primary" onClick={handleStartForm}>
                    ROZPOCZNIJ ZGŁOSZENIE (ASYSTENT)
                  </button>
                </div>

                {/* Checklist Card */}
                <div className="card checklist-card">
                  <h3>Zanim zaczniesz, przygotuj:</h3>
                  <ul className="checklist">
                    <li>
                      <span className="check-icon"><CheckIcon /></span>
                      Dane osobowe i PESEL
                    </li>
                    <li>
                      <span className="check-icon"><CheckIcon /></span>
                      Data i godzina zdarzenia
                    </li>
                    <li>
                      <span className="check-icon"><CheckIcon /></span>
                      Opis okoliczności
                    </li>
                    <li>
                      <span className="check-icon"><CheckIcon /></span>
                      Dane świadków
                    </li>
                  </ul>
                </div>
              </div>

              {/* Recent Reports Table */}
              <div className="card table-card">
                <h2>Ostatnie zgłoszenia i wersje robocze</h2>
                <table className="reports-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Pracownik</th>
                      <th>Typ wypadku</th>
                      <th>Status</th>
                      <th>Akcja</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.id}>
                        <td>{report.date}</td>
                        <td>{report.employee}</td>
                        <td>{report.type}</td>
                        <td>
                          <span className={`status-badge status-${report.status}`}>
                            {report.status === 'draft' ? 'Wersja robocza' : 'Wysłano do ZUS'}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action">Akcja</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Widok Dashboard Pracownika ZUS */}
          {currentView === 'dashboard' && userRole === 'pracownik_zus' && (
            <>
              <h1 className="page-title">Panel Pracownika ZUS</h1>
              <div className="info-box">
                <p>Witaj w panelu pracownika ZUS. Kliknij <strong>"Wypadki przy pracy"</strong> w menu, aby przejść do recenzji formularzy.</p>
              </div>
            </>
          )}

          {/* Widok Panel Pracownika ZUS */}
          {currentView === 'zus-panel' && userRole === 'pracownik_zus' && (
            <PanelPracownikaZUS onVerifyForm={handleVerifyForm} />
          )}

          {/* Widok Weryfikacji pojedynczego zgłoszenia */}
          {currentView === 'verification' && userRole === 'pracownik_zus' && selectedFormId && (
            <WidokWeryfikacji 
              formId={selectedFormId}
              onBack={handleBackToPanel}
              onApprove={handleApproveForm}
              onReject={handleRejectForm}
            />
          )}

          {/* Widok Formularza */}
          {currentView === 'form' && (
            <>
              <FormularzKrokowy 
                onSubmit={handleSubmitForm}
                onCancel={handleCancelForm}
              />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
