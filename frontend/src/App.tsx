import { useState, useEffect } from 'react'
import './App.css'
import zusLogo from './assets/zus.svg'
import FormularzKrokowy from './components/FormularzKrokowy'
import FormularzPoszkodowanego from './components/FormularzPoszkodowanego'
import PanelPracownikaZUS from './components/PanelPracownikaZUS'
import WidokWeryfikacji from './components/WidokWeryfikacji'
import { submitFullForm } from './services/api'
import type { ExtendedFormData } from './components/FormularzPoszkodowanego'

// Ikony jako komponenty SVG
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const AccidentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const SwitchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
)

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

const LayoutGridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
)

// Typy
interface Case {
  id: string
  data_utworzenia: string
  status: string
  poszkodowany?: {
    imie: string
    nazwisko: string
  }
}

// API Config
const API_URL = 'http://127.0.0.1:8000'

type ViewType = 'dashboard' | 'form' | 'zus-panel' | 'verification'
type UserRole = 'platnik' | 'pracownik_zus'
type FormMode = 'classic' | 'step-by-step'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [cases, setCases] = useState<Case[]>([])

  // Pobieranie danych z backendu
  const fetchCases = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cases`)
      if (!response.ok) {
        throw new Error('Błąd pobierania danych')
      }
      const data = await response.json()
      setCases(data)
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    }
  }

  // Initial load
  useEffect(() => {
    fetchCases()
  }, [])

  // Funkcja do generowania danych testowych
  const handleSeedData = async () => {
    try {
      const response = await fetch(`${API_URL}/debug/seed-data`, {
        method: 'POST'
      })
      if (response.ok) {
        alert('Dodano przykładowe dane!')
        fetchCases() // Odśwież listę
      } else {
        alert('Błąd generowania danych')
      }
    } catch (error) {
      console.error('Error seeding data:', error)
      alert('Błąd połączenia z serwerem')
    }
  }

  const [userRole, setUserRole] = useState<UserRole>('platnik')
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<FormMode>('step-by-step')

  const handleStartForm = () => {
    setCurrentView('form')
  }

  const handleCancelForm = () => {
    setCurrentView('dashboard')
  }

  const handleSubmitForm = async (data: unknown) => {
    console.log('Rozpoczynam wysyłanie formularza...', data)

    try {
      // Wyślij dane do backendu
      const caseId = await submitFullForm(data as ExtendedFormData)

      console.log(`Sukces! Utworzono sprawę o ID: ${caseId}`)
      alert(`Sukces! Zgłoszenie zostało wysłane. ID sprawy: ${caseId}`)

      fetchCases() // Odśwież listę na dashboardzie
      setCurrentView('dashboard')

    } catch (error) {
      console.error('Błąd wysyłania formularza:', error)
      alert('Wystąpił błąd podczas wysyłania zgłoszenia. Sprawdź konsolę.')
    }
  }

  const toggleUserRole = () => {
    const newRole = userRole === 'platnik' ? 'pracownik_zus' : 'platnik'
    setUserRole(newRole)
    // Automatycznie przełącz widok na dashboard
    setCurrentView('dashboard')
  }

  const handleVerifyForm = (_formId: number, caseId: string) => {
    setSelectedCaseId(caseId)
    setCurrentView('verification')
  }

  const handleBackToPanel = () => {
    setCurrentView('zus-panel')
    setSelectedCaseId(null)
  }

  const handleApproveForm = (caseId: string) => {
    console.log('Zaakceptowano sprawę:', caseId)
    handleBackToPanel()
  }

  const handleRejectForm = (caseId: string) => {
    console.log('Odrzucono sprawę:', caseId)
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
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
            onClick={() => userRole === 'pracownik_zus' ? setCurrentView('zus-panel') : setCurrentView('form')}
          >
            <AccidentIcon />
            <span>Wypadki przy pracy</span>
          </a>


          {/* Przełącznik widoku formularza - tylko gdy jesteśmy w formularzu */}
          {currentView === 'form' && (
            <div className="nav-form-switch" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={`nav-mode-btn ${formMode === 'step-by-step' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setFormMode('step-by-step')
                }}
                title="Widok krokowy - jedno pole na raz"
              >
                <ListIcon />
                <span>Krok po kroku</span>
              </button>
              <button
                type="button"
                className={`nav-mode-btn ${formMode === 'classic' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setFormMode('classic')
                }}
                title="Widok klasyczny - wszystkie pola widoczne"
              >
                <LayoutGridIcon />
                <span>Klasyczny</span>
              </button>
            </div>
          )}
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
                <h2>Ostatnie zgłoszenia</h2>
                {cases.length === 0 ? (
                  <p style={{ padding: '20px', color: '#666' }}>Brak spraw. Wygeneruj dane testowe lub dodaj nowe zgłoszenie.</p>
                ) : (
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
                      {cases.map((c) => (
                        <tr key={c.id}>
                          <td>{c.data_utworzenia}</td>
                          <td>
                            {c.poszkodowany
                              ? `${c.poszkodowany.imie} ${c.poszkodowany.nazwisko}`
                              : 'Nieznany'}
                          </td>
                          <td>Wypadek przy pracy</td>
                          <td>
                            <span className="status-badge status-draft">
                              {c.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn-action">Szczegóły</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* Widok Dashboard Pracownika ZUS */}
          {currentView === 'dashboard' && userRole === 'pracownik_zus' && (
            <>
              <h1 className="page-title">Pulpit Pracownika ZUS</h1>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                    <ListIcon />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">12</div>
                    <div className="stat-label">Nowych zgłoszeń</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#fff3e0', color: '#f57c00' }}>
                    <LayoutGridIcon />
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">5</div>
                    <div className="stat-label">Do weryfikacji</div>
                  </div>
                </div>
              </div>

              <div className="card new-report-card" style={{ marginTop: '20px' }}>
                <h2>Weryfikacja zgłoszeń</h2>
                <p>Przejdź do listy zgłoszeń oczekujących na weryfikację merytoryczną i formalną.</p>
                <button className="btn-primary" onClick={() => setCurrentView('zus-panel')}>
                  PRZEJDŹ DO WERYFIKACJI
                </button>
              </div>
            </>
          )}

          {/* Widok Panel Pracownika ZUS */}
          {currentView === 'zus-panel' && userRole === 'pracownik_zus' && (
            <PanelPracownikaZUS onVerifyForm={handleVerifyForm} onSeedData={handleSeedData} cases={cases} />
          )}

          {/* Widok Weryfikacji pojedynczego zgłoszenia */}
          {currentView === 'verification' && userRole === 'pracownik_zus' && selectedCaseId && (
            <WidokWeryfikacji 
              formId={1}
              caseId={selectedCaseId}
              onBack={handleBackToPanel}
              onApprove={handleApproveForm}
              onReject={handleRejectForm}
            />
          )}          {/* Widok Formularza */}
          {currentView === 'form' && (
            <>
              <h1 className="page-title">Dane poszkodowanego</h1>
              {formMode === 'step-by-step' ? (
                <FormularzKrokowy
                  onSubmit={handleSubmitForm}
                  onCancel={handleCancelForm}
                />
              ) : (
                <FormularzPoszkodowanego
                  onSubmit={handleSubmitForm}
                  onCancel={handleCancelForm}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
