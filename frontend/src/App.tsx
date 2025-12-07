import { useState, useEffect } from 'react'
import './App.css'
import zusLogo from './assets/zus.svg'
import FormularzKrokowy from './components/FormularzKrokowy'
import FormularzPoszkodowanego from './components/FormularzPoszkodowanego'
import PanelPracownikaZUS from './components/PanelPracownikaZUS'
import WidokWeryfikacji from './components/WidokWeryfikacji'
import ProtocolPowypadkowy from './components/ProtocolPowypadkowy'
import { submitFullForm, updateCaseStatus } from './services/api'
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

type ViewType = 'dashboard' | 'form-selection' | 'form' | 'zus-panel' | 'verification' | 'protocol'
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

  // Initial load & Refetch on view change
  useEffect(() => {
    if (currentView === 'dashboard' || currentView === 'zus-panel') {
      fetchCases()
    }
  }, [currentView])

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
  const [payerInfo, setPayerInfo] = useState<{ name: string, nip: string } | null>(null)

  const handlePayerChange = (name: string, nip: string) => {
    setPayerInfo({ name, nip })
  }

  const handleStartForm = () => {
    setCurrentView('form-selection')
  }

  const handleSelectMode = (mode: FormMode) => {
    setFormMode(mode)
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

  const handleVerifyForm = async (_formId: number, caseId: string, currentStatus?: string) => {
    // Jeśli sprawa jest już zakończona (Zatwierdzone/Odrzucone), wchodzimy w tryb podglądu BEZ zmiany statusu
    if (currentStatus === 'approved' || currentStatus === 'rejected' || currentStatus === 'Zatwierdzone' || currentStatus === 'Odrzucone') {
      setSelectedCaseId(caseId)
      setCurrentView('verification')
      return // Przerywamy, nie aktualizujemy statusu
    }

    // Aktualizuj status lokalnie na "W weryfikacji"
    setCases(prev => prev.map(c =>
      c.id === caseId ? { ...c, status: 'W weryfikacji' } : c
    ))

    // Aktualizuj status w backendzie
    try {
      await updateCaseStatus(caseId, 'W weryfikacji')
    } catch (err) {
      console.error('Failed to update status in backend', err)
    }

    setSelectedCaseId(caseId)
    setCurrentView('verification')
  }

  const handleBackToPanel = () => {
    setCurrentView('zus-panel')
    setSelectedCaseId(null)
  }

  const handleApproveCase = async () => {
    if (selectedCaseId) {
      setCases(prev => prev.map(c =>
        c.id === selectedCaseId ? { ...c, status: 'Zatwierdzone' } : c
      ))
      // Aktualizuj status w backendzie
      try {
        await updateCaseStatus(selectedCaseId, 'Zatwierdzone')
      } catch (err) {
        console.error('Failed to update status in backend', err)
      }
    }
    setCurrentView('protocol')
  }

  const handleBackFromProtocol = () => {
    setCurrentView('verification')
  }

  const handleFinalizeCase = () => {
    alert('Sprawa została sfinalizowana i zamknięta.')
    setCurrentView('zus-panel')
    setSelectedCaseId(null)
  }

  const handleRejectForm = async (caseId: string) => {
    console.log('Odrzucono sprawę:', caseId)
    setCases(prev => prev.map(c =>
      c.id === caseId ? { ...c, status: 'Odrzucone' } : c
    ))
    // Aktualizuj status w backendzie
    try {
      await updateCaseStatus(caseId, 'Odrzucone')
    } catch (err) {
      console.error('Failed to update status in backend', err)
    }
    handleBackToPanel()
  }

  return (
    <div className="app">
      {/* Top Header Bar */}
      <header className="top-header">
        <div className="top-header-content">
          <div className="header-left">
            <div
              className="logo-container"
              onClick={() => setCurrentView('dashboard')}
              style={{ cursor: 'pointer' }}
              title="Wróć do pulpitu"
            >
              <img src={zusLogo} alt="ZUS - Zakład Ubezpieczeń Społecznych" className="logo-zus" />
            </div>
          </div>

          <div className="header-right">
            <span className="header-user-info">
              {userRole === 'platnik'
                ? (payerInfo && (payerInfo.name || payerInfo.nip)
                  ? `Płatnik: ${payerInfo.name}${payerInfo.nip ? `, NIP: ${payerInfo.nip}` : ''}`
                  : 'Panel Płatnika')
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
            className={`main-nav-item ${currentView === 'zus-panel' || currentView === 'form' || currentView === 'form-selection' || currentView === 'verification' ? 'active' : ''}`}
            onClick={() => userRole === 'pracownik_zus' ? setCurrentView('zus-panel') : setCurrentView('form-selection')}
          >
            <AccidentIcon />
            <span>Formularze</span>
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
                  <h2>Zgłoszenie wypadku</h2>
                  <p>
                    Nowe zgłoszenie wypadku przy pracy.
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
            </>
          )}

          {/* Widok Dashboard Pracownika ZUS */}
          {currentView === 'dashboard' && userRole === 'pracownik_zus' && (
            <>
              <h1 className="page-title">Pulpit Pracownika ZUS</h1>



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
              onApprove={handleApproveCase}
              onReject={handleRejectForm}
            />
          )}

          {/* Widok Protokołu Powypadkowego */}
          {currentView === 'protocol' && userRole === 'pracownik_zus' && selectedCaseId && (
            <ProtocolPowypadkowy
              caseId={selectedCaseId}
              onBack={handleBackFromProtocol}
              onFinalize={handleFinalizeCase}
            />
          )}

          {/* Widok Wyboru Formularza */}
          {currentView === 'form-selection' && (
            <>
              <h1 className="page-title">Wybierz sposób zgłoszenia</h1>
              <p className="page-subtitle" style={{ color: '#666', marginBottom: '32px' }}>
                Wybierz metodę, która najbardziej Ci odpowiada. Możesz skorzystać z prostego kreatora lub zaawansowanego formularza z AI.
              </p>

              <div className="selection-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Krok po Kroku */}
                <div
                  className="card selection-card"
                  onClick={() => handleSelectMode('step-by-step')}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease', border: '2px solid transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#43a047'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div className="card-icon" style={{ background: '#e8f5e9', color: '#2e7d32', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <ListIcon />
                  </div>
                  <h2 style={{ marginBottom: '12px' }}>Kreator Krok po Kroku</h2>
                  <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
                    Idealny dla początkujących. System przeprowadzi Cię przez proces zgłoszenia sekcja po sekcji, wyświetlając tylko jedno pytanie na raz.
                  </p>
                  <ul className="feature-list" style={{ listStyle: 'none', padding: 0, color: '#555' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckIcon /> Prosty i przejrzysty interfejs
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckIcon /> Pomocne opisy w każdym kroku
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckIcon /> Minimalne ryzyko pomyłki
                    </li>
                  </ul>
                  <button className="btn-primary" style={{ marginTop: '24px', width: '100%' }}>
                    WYBIERZ KREATOR
                  </button>
                </div>

                {/* Formularz AI */}
                <div
                  className="card selection-card"
                  onClick={() => handleSelectMode('classic')}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease', border: '2px solid transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#43a047'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div className="card-icon" style={{ background: '#e3f2fd', color: '#1565c0', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <div style={{ position: 'relative' }}>
                      <DocumentIcon />
                      <span style={{ position: 'absolute', top: '-4px', right: '-4px', fontSize: '10px' }}>✨</span>
                    </div>
                  </div>
                  <h2 style={{ marginBottom: '12px' }}>Inteligentny Formularz AI</h2>
                  <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>
                    Klasyczny widok formularza wspierany przez Asystenta AI, który pomoże Ci opisać okoliczności zdarzenia i automatycznie uzupełni dane.
                  </p>
                  <ul className="feature-list" style={{ listStyle: 'none', padding: 0, color: '#555' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckIcon /> Widok całego formularza
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <CheckIcon /> <strong>Asystent AI (Chat)</strong>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckIcon /> Automatyczne uzupełnianie pól
                    </li>
                  </ul>
                  <button className="btn-primary" style={{ marginTop: '24px', width: '100%' }}>
                    WYBIERZ AI
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Widok Formularza */}
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
                  onPayerChange={handlePayerChange}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div >
  )
}

export default App
