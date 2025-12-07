import { useState } from 'react'
import './PanelPracownikaZUS.css'

interface Case {
  id: string
  data_utworzenia: string
  status: string
  poszkodowany?: {
    imie: string
    nazwisko: string
    pesel?: string
  }
  zawiadomienie?: {
    platnik_skladek?: {
      nazwa_firmy: string
      nip_regon?: string
    }
  }
}

interface PanelPracownikaZUSProps {
  onVerifyForm: (id: number, caseId: string) => void
  onSeedData?: () => void
  cases?: Case[]
}

// Ikony
const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const AccidentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
  </svg>
)



export default function PanelPracownikaZUS({ onVerifyForm, onSeedData, cases = [] }: PanelPracownikaZUSProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  
  // Konwersja cases z backendu na format używany w komponencie
  const formulazeDoRecenzji = cases.map((c, index) => ({
    id: index + 1,
    caseId: c.id,
    dataZgloszenia: c.data_utworzenia || 'Brak daty',
    platnik: c.zawiadomienie?.platnik_skladek?.nazwa_firmy || 'Nieznany płatnik',
    nip: c.zawiadomienie?.platnik_skladek?.nip_regon || 'Brak NIP',
    poszkodowany: c.poszkodowany ? `${c.poszkodowany.imie} ${c.poszkodowany.nazwisko}` : 'Nieznany',
    pesel: c.poszkodowany?.pesel || 'Brak PESEL',
    status: c.status === 'Weryfikacja' ? 'pending' : c.status === 'W trakcie' ? 'in_review' : c.status === 'Wysłano' ? 'approved' : 'rejected',
    priorytet: 'normal'
  }))

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Oczekuje na weryfikację'
      case 'in_review': return 'W trakcie weryfikacji'
      case 'approved': return 'Zaakceptowano'
      case 'rejected': return 'Odrzucono'
      default: return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Wysoki'
      case 'normal': return 'Normalny'
      case 'low': return 'Niski'
      default: return priority
    }
  }

  const handleVerifyForm = (id: number, caseId: string) => {
    onVerifyForm(id, caseId)
  }

  const filteredFormularze = formulazeDoRecenzji.filter(form => {
    const statusMatch = statusFilter === 'all' || form.status === statusFilter
    const priorityMatch = priorityFilter === 'all' || form.priorytet === priorityFilter
    return statusMatch && priorityMatch
  })

  const stats = {
    pending: formulazeDoRecenzji.filter(f => f.status === 'pending').length,
    inReview: formulazeDoRecenzji.filter(f => f.status === 'in_review').length,
    highPriority: formulazeDoRecenzji.filter(f => f.priorytet === 'high').length,
  }

  return (
    <div className="panel-pracownika-zus">
      <h1 className="page-title">Panel Pracownika ZUS - Weryfikacja Zgłoszeń</h1>

      {/* Przycisk generowania danych testowych */}
      {onSeedData && (
        <div style={{ marginBottom: '20px' }}>
          <button onClick={onSeedData} style={{ padding: '8px 16px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
            🛠 Generuj dane testowe (Debug)
          </button>
        </div>
      )}

      {/* Statystyki */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">
            <ClipboardIcon />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Oczekujące</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon review">
            <EyeIcon />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.inReview}</div>
            <div className="stat-label">W weryfikacji</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon urgent">
            <AccidentIcon />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.highPriority}</div>
            <div className="stat-label">Wysoki priorytet</div>
          </div>
        </div>
      </div>

      {/* Filtry */}
      <div className="card filters-card">
        <div className="filters-header">
          <FilterIcon />
          <h3>Filtruj formularze</h3>
        </div>
        <div className="filters-content">
          <div className="filter-group">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Wszystkie</option>
              <option value="pending">Oczekujące</option>
              <option value="in_review">W weryfikacji</option>
              <option value="approved">Zaakceptowane</option>
              <option value="rejected">Odrzucone</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="priority-filter">Priorytet:</label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Wszystkie</option>
              <option value="high">Wysoki</option>
              <option value="normal">Normalny</option>
              <option value="low">Niski</option>
            </select>
          </div>

          <div className="filter-results">
            Znaleziono: <strong>{filteredFormularze.length}</strong> formularzy
          </div>
        </div>
      </div>

      {/* Tabela formularzy */}
      <div className="card table-card">
        <h2>Formularze wymagające weryfikacji</h2>
        <div className="table-responsive">
          <table className="reports-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data zgłoszenia</th>
                <th>Płatnik</th>
                <th>Poszkodowany</th>
                <th>Priorytet</th>
                <th>Status</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {filteredFormularze.length > 0 ? (
                filteredFormularze.map((form) => (
                  <tr key={form.id}>
                    <td className="td-id">#{form.id}</td>
                    <td>{form.dataZgloszenia}</td>
                    <td>
                      <div className="company-info">
                        <div className="company-name">{form.platnik}</div>
                        <div className="company-nip">NIP: {form.nip}</div>
                      </div>
                    </td>
                    <td>
                      <div className="person-info">
                        <div className="person-name">{form.poszkodowany}</div>
                        <div className="person-pesel">PESEL: {form.pesel}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`priority-badge priority-${form.priorytet}`}>
                        {getPriorityLabel(form.priorytet)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge review-status-${form.status}`}>
                        {getStatusLabel(form.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-action"
                        onClick={() => handleVerifyForm(form.id, form.caseId)}
                      >
                        Weryfikuj
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-results">
                    Brak formularzy spełniających kryteria filtrowania
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

