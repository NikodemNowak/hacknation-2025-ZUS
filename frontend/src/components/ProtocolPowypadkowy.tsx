import { useState, useEffect } from 'react'
import './ProtocolPowypadkowy.css'

interface ProtocolPowypadkowyProps {
  caseId: string
  onBack: () => void
  onFinalize: () => void
}

interface AssessmentPoint {
  met: boolean
  justification: string
}

interface OpinionState {
  suddenness: AssessmentPoint
  externalCause: AssessmentPoint
  injury: AssessmentPoint
  workConnection: AssessmentPoint
  decision: 'uznanie' | 'odmowa'
  finalJustification: string
}

const API_URL = 'http://127.0.0.1:8000'

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.5 15L7.5 10L12.5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PrintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
)

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v18M3 12h18M7.05 7.05l9.9 9.9M7.05 16.95l9.9-9.9" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

export default function ProtocolPowypadkowy({ caseId, onBack, onFinalize }: ProtocolPowypadkowyProps) {
  /* State management */
  const [, setCaseData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loadingAI, setLoadingAI] = useState(false)

  const [opinion, setOpinion] = useState<OpinionState>({
    suddenness: { met: false, justification: '' },
    externalCause: { met: false, justification: '' },
    injury: { met: false, justification: '' },
    workConnection: { met: false, justification: '' },
    decision: 'uznanie',
    finalJustification: ''
  })

  useEffect(() => {
    fetchCaseData()
  }, [caseId])

  const fetchCaseData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cases/${caseId}`)
      if (response.ok) {
        const data = await response.json()
        setCaseData(data)
      }
    } catch (error) {
      console.error('Error fetching case:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateValues = async () => {
    if (!caseId) return
    setLoadingAI(true)
    try {
      const response = await fetch(`${API_URL}/api/cases/${caseId}/analyze-opinion`, {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()

        if (result.error) {
          alert('Błąd analizy: ' + result.message)
          return
        }

        setOpinion({
          suddenness: result.details.suddenness,
          externalCause: result.details.external_cause,
          injury: result.details.injury,
          workConnection: result.details.work_connection,
          decision: result.final_decision,
          finalJustification: result.final_justification || "Brak uzasadnienia."
        })

        alert('Analiza zakończona. Sprawdź proponowaną opinię.')
      } else {
        alert('Błąd serwera podczas analizy')
      }
    } catch (e) {
      console.error(e)
      alert("Błąd połączenia z serwerem.")
    } finally {
      setLoadingAI(false)
    }
  }

  const handlePrint = () => window.print()

  if (loading) return <div className="p-10 text-center">Ładowanie danych sprawy...</div>

  return (
    <div className="protocol-container">
      {/* Navigation */}
      <div className="nav-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeftIcon /> Wróć
        </button>
        <div className="status-actions">
          <button
            className="btn-ai"
            onClick={handleGenerateValues}
            disabled={loadingAI}
            style={{ background: loadingAI ? '#ccc' : '#43a047', color: 'white', marginRight: '10px', cursor: loadingAI ? 'wait' : 'pointer' }}
          >
            <SparklesIcon /> {loadingAI ? 'Analizuję...' : 'Analizuj AI'}
          </button>
          <button className="btn-print" onClick={handlePrint}>
            <PrintIcon /> Drukuj / PDF
          </button>
          <button className="btn-approve" onClick={onFinalize}>
            <CheckCircleIcon /> Zatwierdź Opinię
          </button>
        </div>
      </div>

      <div className="document-sheet">
        {/* Doc Header */}
        <div className="doc-header">
          <div className="zus-logo">ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH</div>
          <div className="doc-meta">
            <div>Nr sprawy: <strong>{caseId}</strong></div>
            <div>Data: <strong>{new Date().toLocaleDateString('pl-PL')}</strong></div>
          </div>
        </div>

        <h1 className="doc-title">OPINIA O PRAWNEJ KWALIFIKACJI ZDARZENIA</h1>
        <h2 className="doc-subtitle">Karta analizy wypadku przy pracy (dla urzędnika ZUS)</h2>

        {/* 1. Completeness */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">1.</span>
            <div className="content">
              <div className="form-label">Analiza kompletności dokumentacji:</div>
              <div className="form-value-box">
                <div className="check-item">☑ Zawiadomienie o wypadku</div>
                <div className="check-item">☑ Wyjaśnienia poszkodowanego</div>
                <div className="check-item">☑ Dokumentacja medyczna</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Assessment of 4 Pillars */}
        <div className="doc-section">
          <h3 style={{ marginLeft: '40px', marginBottom: '15px', color: '#333' }}>Ocena elementów definicji wypadku:</h3>

          {/* Nagłość */}
          <div className="numbered-item">
            <span className="num">2a.</span>
            <div className="content">
              <div className="form-label">Nagłość zdarzenia:</div>
              <div className="opinion-row">
                <div className={`status-pill ${opinion.suddenness.met ? 'met' : 'not-met'}`}>
                  {opinion.suddenness.met ? 'SPEŁNIONO' : 'NIE SPEŁNIONO'}
                </div>
              </div>
              <textarea
                className="opinion-textarea"
                value={opinion.suddenness.justification}
                onChange={e => setOpinion(prev => ({ ...prev, suddenness: { ...prev.suddenness, justification: e.target.value } }))}
                placeholder="Uzasadnienie nagłości..."
              />
            </div>
          </div>

          {/* Przyczyna Zewnętrzna */}
          <div className="numbered-item">
            <span className="num">2b.</span>
            <div className="content">
              <div className="form-label">Przyczyna zewnętrzna:</div>
              <div className="opinion-row">
                <div className={`status-pill ${opinion.externalCause.met ? 'met' : 'not-met'}`}>
                  {opinion.externalCause.met ? 'SPEŁNIONO' : 'NIE SPEŁNIONO'}
                </div>
              </div>
              <textarea
                className="opinion-textarea"
                value={opinion.externalCause.justification}
                onChange={e => setOpinion(prev => ({ ...prev, externalCause: { ...prev.externalCause, justification: e.target.value } }))}
                placeholder="Uzasadnienie przyczyny zewnętrznej..."
              />
            </div>
          </div>

          {/* Uraz */}
          <div className="numbered-item">
            <span className="num">2c.</span>
            <div className="content">
              <div className="form-label">Skutek w postaci urazu:</div>
              <div className="opinion-row">
                <div className={`status-pill ${opinion.injury.met ? 'met' : 'not-met'}`}>
                  {opinion.injury.met ? 'SPEŁNIONO' : 'NIE SPEŁNIONO'}
                </div>
              </div>
              <textarea
                className="opinion-textarea"
                value={opinion.injury.justification}
                onChange={e => setOpinion(prev => ({ ...prev, injury: { ...prev.injury, justification: e.target.value } }))}
                placeholder="Uzasadnienie urazu..."
              />
            </div>
          </div>

          {/* Związek z pracą */}
          <div className="numbered-item">
            <span className="num">2d.</span>
            <div className="content">
              <div className="form-label">Związek z pracą / działalnością:</div>
              <div className="opinion-row">
                <div className={`status-pill ${opinion.workConnection.met ? 'met' : 'not-met'}`}>
                  {opinion.workConnection.met ? 'SPEŁNIONO' : 'NIE SPEŁNIONO'}
                </div>
              </div>
              <textarea
                className="opinion-textarea"
                value={opinion.workConnection.justification}
                onChange={e => setOpinion(prev => ({ ...prev, workConnection: { ...prev.workConnection, justification: e.target.value } }))}
                placeholder="Uzasadnienie związku z pracą..."
              />
            </div>
          </div>
        </div>

        {/* 3. Decision */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">3.</span>
            <div className="content">
              <div className="form-label">Kwalifikacja prawna (Decyzja):</div>

              <div className="decision-box">
                <label className={`decision-option ${opinion.decision === 'uznanie' ? 'selected' : ''}`}>
                  <input type="radio" name="decyzja" value="uznanie" checked={opinion.decision === 'uznanie'} onChange={() => setOpinion(p => ({ ...p, decision: 'uznanie' }))} />
                  <div className="decision-content">
                    <div className="decision-title">✓ UZNANIE ZA WYPADEK PRZY PRACY</div>
                  </div>
                </label>

                <label className={`decision-option rejection ${opinion.decision === 'odmowa' ? 'selected' : ''}`}>
                  <input type="radio" name="decyzja" value="odmowa" checked={opinion.decision === 'odmowa'} onChange={() => setOpinion(p => ({ ...p, decision: 'odmowa' }))} />
                  <div className="decision-content">
                    <div className="decision-title">✗ ODMOWA UZNANIA</div>
                  </div>
                </label>
              </div>

              <div className="form-label mt-2">Uzasadnienie stanowiska:</div>
              <textarea
                className="opinion-textarea large"
                value={opinion.finalJustification}
                onChange={e => setOpinion(prev => ({ ...prev, finalJustification: e.target.value }))}
                placeholder="Szczegółowe uzasadnienie decyzji..."
              />

              <div className="legal-basis">
                <strong>Podstawa prawna:</strong> Art. 3 ust. 3 ustawy z dnia 30 października 2002 r. o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych (Dz.U. z 2022 r. poz. 2189).
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="doc-footer">
          <div className="signature-box right">
            <div className="sign-line">Podpis pracownika ZUS</div>
          </div>
        </div>

      </div>

      <style>{`
        .opinion-textarea {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px;
          min-height: 60px;
          margin-top: 8px;
          font-family: inherit;
        }
        .opinion-textarea.large {
          min-height: 120px;
        }
        .status-pill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 99px;
          font-weight: bold;
          font-size: 0.9em;
        }
        .status-pill.met {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .status-pill.not-met {
          background: #ffebee;
          color: #c62828;
        }
        .check-item {
          margin-bottom: 4px;
        }
        .legal-basis {
           margin-top: 15px;
           font-size: 0.85em;
           color: #666;
           border-top: 1px solid #eee;
           padding-top: 10px;
        }
      `}</style>
    </div>
  )
}
