import { useState, useEffect } from 'react'
import './WidokWeryfikacji.css'

const API_URL = 'http://127.0.0.1:8000'



interface WidokWeryfikacjiProps {
  formId: number
  onBack: () => void
  onApprove?: () => void
  onReject?: (id: string) => void
  caseId?: string
}

interface CaseData {
  id: string
  data_utworzenia: string
  status: string
  poszkodowany?: any
  zawiadomienie?: any
  wyjasnienia?: any
}

// Ikony
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const PrintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
)



export default function WidokWeryfikacji({ onBack, onApprove, onReject, caseId }: WidokWeryfikacjiProps) {
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [loading, setLoading] = useState(true)

  // Pobieranie danych z backendu
  useEffect(() => {
    if (caseId) {
      fetchCaseData(caseId)
    } else {
      setLoading(false)
    }
  }, [caseId])

  const fetchCaseData = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/cases/${id}`)
      if (response.ok) {
        const data = await response.json()
        setCaseData(data)
        console.log('Pobrane dane sprawy:', data)
      } else {
        console.error('Błąd pobierania danych sprawy')
      }
    } catch (error) {
      console.error('Error fetching case data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = () => { if (onApprove) onApprove(); }
  const handleReject = () => { if (onReject && caseId) onReject(caseId); alert('Odrzucono'); }
  const handlePrint = () => window.print()


  if (loading) {
    return (
      <div className="widok-weryfikacji-container">
        <div className="nav-header">
          <button className="btn-back" onClick={onBack}>
            <ArrowLeftIcon /> Wróć
          </button>
        </div>
        <div className="document-sheet" style={{ textAlign: 'center', padding: '50px' }}>
          <p>Ładowanie danych sprawy...</p>
        </div>
      </div>
    )
  }

  // Przygotowanie danych z backendu
  const zawiadomienie = caseData?.zawiadomienie || {}
  const wyjasnienia = caseData?.wyjasnienia || {}
  const poszkodowany = caseData?.poszkodowany || {}

  return (
    <div className="widok-weryfikacji-container">
      {/* Pasek nawigacji */}
      <div className="nav-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeftIcon /> Wróć
        </button>
        <div className="status-actions">
          <button className="btn-print" onClick={handlePrint} style={{ marginRight: '10px', background: '#555', color: 'white' }}>
            <PrintIcon /> Drukuj / PDF
          </button>
          <button className="btn-reject" onClick={handleReject}>
            <XIcon /> Odrzuć
          </button>
          <button className="btn-approve" onClick={handleApprove}>
            <CheckIcon /> Sporządź Opinię (Protokół)
          </button>
        </div>
      </div>

      {/* FORMULARZ 1: ZAWIADOMIENIE O WYPADKU */}
      <div className="document-sheet">

        {/* Nagłówek ZUS */}
        <div className="doc-header">
          <div className="zus-logo">ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH</div>
          <div className="doc-meta">
            <div>Wpłynęło: <strong>{caseData?.data_utworzenia || 'Brak danych'}</strong></div>
            <div>Nr sprawy: <strong>{caseData?.id || 'Brak danych'}</strong></div>
          </div>
        </div>

        <h1 className="doc-title">ZAWIADOMIENIE O WYPADKU</h1>

        {/* Pkt 1: Płatnik składek */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">1.</span>
            <div className="content">
              <div className="form-label">Płatnik składek:</div>
              <div className="form-value-box">
                {zawiadomienie.platnik_skladek ?
                  `${zawiadomienie.platnik_skladek.nazwa_firmy || ''} ${zawiadomienie.platnik_skladek.nip_regon ? `(NIP/REGON: ${zawiadomienie.platnik_skladek.nip_regon})` : ''}`
                  : 'Brak danych'}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 2: Dane poszkodowanego */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">2.</span>
            <div className="content">
              <div className="form-label">Dane poszkodowanego:</div>
              <div className="form-value-box">
                <strong>Imię i nazwisko:</strong> {poszkodowany.imie} {poszkodowany.nazwisko || 'Brak danych'}<br />
                <strong>PESEL:</strong> {poszkodowany.pesel || 'Brak danych'}<br />
                <strong>Data urodzenia:</strong> {poszkodowany.data_urodzenia || 'Brak danych'}<br />
                <strong>Adres:</strong> {poszkodowany.adres ?
                  `${poszkodowany.adres.ulica || ''} ${poszkodowany.adres.numer_budynku || ''}, ${poszkodowany.adres.kod_pocztowy || ''} ${poszkodowany.adres.miasto || ''}`
                  : 'Brak danych'}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 3: Informacje o wypadku */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">3.</span>
            <div className="content">
              <div className="form-label">Informacje o wypadku:</div>
              <div className="form-value-box">
                <strong>Data wypadku:</strong> {zawiadomienie.data_wypadku || 'Brak danych'}<br />
                <strong>Godzina wypadku:</strong> {zawiadomienie.godzina_wypadku || 'Brak danych'}<br />
                <strong>Miejsce wypadku:</strong> {zawiadomienie.miejsce_wypadku || 'Brak danych'}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 4: Rodzaj urazów */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">4.</span>
            <div className="content">
              <div className="form-label">Rodzaj urazów:</div>
              <div className="form-value-box">{zawiadomienie.rodzaj_urazow || 'Brak danych'}</div>
            </div>
          </div>
        </div>

        {/* Pkt 5: Okoliczności i przyczyny */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">5.</span>
            <div className="content">
              <div className="form-label">Opis okoliczności wypadku:</div>
              <div className="form-value-box description-box">{zawiadomienie.opis_okolicznosci || 'Brak danych'}</div>

              <div className="form-label mt-2">Związek z pracą:</div>
              <div className="form-value-box">{zawiadomienie.zwiazek_z_praca || 'Brak danych'}</div>
            </div>
          </div>
        </div>

        {/* Pkt 6: Świadkowie */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">6.</span>
            <div className="content">
              <div className="form-label">Świadkowie zdarzenia:</div>
              <div className="form-value-box description-box">
                {zawiadomienie.swiadkowie && zawiadomienie.swiadkowie.length > 0 ? (
                  zawiadomienie.swiadkowie.map((swiadek: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                      {swiadek.imie} {swiadek.nazwisko}<br />
                      {swiadek.telefon && `Tel: ${swiadek.telefon}`}
                      {swiadek.stanowisko && ` - ${swiadek.stanowisko}`}
                    </div>
                  ))
                ) : 'Brak informacji o świadkach'}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 7: Pomoc medyczna */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">7.</span>
            <div className="content">
              <div className="form-label">Czy udzielono pomocy medycznej?</div>
              <div className="form-value-box">
                {zawiadomienie.czy_udzielono_pomocy ? 'TAK' : 'NIE'}
              </div>
              {zawiadomienie.placowka_medyczna && (
                <div className="sub-answer">
                  <strong>Placówka medyczna:</strong> {zawiadomienie.placowka_medyczna}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FORMULARZ 2: WYJAŚNIENIA POSZKODOWANEGO */}
      <div className="document-sheet" style={{ marginTop: '30px' }}>

        {/* Nagłówek ZUS */}
        <div className="doc-header">
          <div className="zus-logo">ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH</div>
          <div className="doc-meta">
            <div>Nr sprawy: <strong>{caseData?.id || 'Brak danych'}</strong></div>
          </div>
        </div>

        <h1 className="doc-title">ZAPIS WYJAŚNIEŃ POSZKODOWANEGO</h1>

        {/* Pkt 1: Data, miejsce i godzina wypadku */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">1.</span>
            <div className="content">
              <div className="form-label">Data, miejsce i godzina wypadku:</div>
              <div className="form-value-box">
                {wyjasnienia.data_wypadku || 'Brak danych'}, {wyjasnienia.miejsce_wypadku || 'Brak danych'}, godz. {wyjasnienia.godzina_wypadku || 'Brak danych'}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 2: Godziny pracy */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">2.</span>
            <div className="content">
              <div className="form-row">
                <div className="half">
                  <div className="form-label">Planowana godzina rozpoczęcia pracy:</div>
                  <div className="form-value-box">{wyjasnienia.godzina_rozpoczecia_pracy || 'Brak danych'}</div>
                </div>
                <div className="half">
                  <div className="form-label">Planowana godzina zakończenia pracy:</div>
                  <div className="form-value-box">{wyjasnienia.godzina_zakonczenia_pracy || 'Brak danych'}</div>
                </div>
              </div>
              <div className="form-label mt-2">Rodzaj czynności wykonywanych do momentu wypadku:</div>
              <div className="form-value-box">{wyjasnienia.rodzaj_czynnosci || 'Brak danych'}</div>
            </div>
          </div>
        </div>

        {/* Pkt 3: Opis zdarzenia */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">3.</span>
            <div className="content">
              <div className="form-label">Okoliczności i przyczyny wypadku:</div>
              <div className="form-value-box description-box">
                <strong>Okoliczności:</strong><br />
                {wyjasnienia.okolicznosci_wypadku || 'Brak danych'}<br /><br />
                <strong>Przyczyny:</strong><br />
                {wyjasnienia.przyczyny_wypadku || 'Brak danych'}<br /><br />
                <strong>Sekwencja zdarzeń:</strong><br />
                {wyjasnienia.sekwencja_zdarzen || 'Brak danych'}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 4: Obsługa maszyn */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">4.</span>
            <div className="content">
              <div className="form-label">Wypadek powstał podczas obsługi maszyn/urządzeń?</div>
              <div className="form-value-box">{wyjasnienia.czy_wypadek_podczas_obslugi_maszyn ? 'TAK' : 'NIE'}</div>
              {wyjasnienia.informacje_o_maszynie && (
                <div className="sub-answer">
                  <strong>Informacje o maszynie:</strong><br />
                  Nazwa: {wyjasnienia.informacje_o_maszynie.nazwa || 'N/A'}<br />
                  Producent: {wyjasnienia.informacje_o_maszynie.producent || 'N/A'}<br />
                  Numer seryjny: {wyjasnienia.informacje_o_maszynie.numer_seryjny || 'N/A'}<br />
                  Rok produkcji: {wyjasnienia.informacje_o_maszynie.rok_produkcji || 'N/A'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pkt 5: Zabezpieczenia */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">5.</span>
            <div className="content">
              <div className="form-label">Czy były stosowane zabezpieczenia przed wypadkiem?</div>
              <div className="form-value-box">{wyjasnienia.czy_stosowane_zabezpieczenia ? 'TAK' : 'NIE'}</div>
              {wyjasnienia.rodzaj_srodkow_ochrony && (
                <div className="sub-answer">
                  <strong>Rodzaj środków ochrony:</strong> {wyjasnienia.rodzaj_srodkow_ochrony}<br />
                  <strong>Czy właściwe i sprawne:</strong> {wyjasnienia.czy_srodki_wlasciwe_i_sprawne ? 'TAK' : 'NIE'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pkt 6: Osoby obecne */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">6.</span>
            <div className="content">
              <div className="form-label">Czy w miejscu wypadku były obecne inne osoby (świadkowie)?</div>
              <div className="form-value-box">{wyjasnienia.swiadkowie && wyjasnienia.swiadkowie.length > 0 ? 'TAK' : 'NIE'}</div>
              {wyjasnienia.swiadkowie && wyjasnienia.swiadkowie.length > 0 && (
                <div className="sub-answer">
                  <strong>Świadkowie:</strong><br />
                  {wyjasnienia.swiadkowie.map((swiadek: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '5px' }}>
                      {swiadek.imie} {swiadek.nazwisko} {swiadek.stanowisko && `- ${swiadek.stanowisko}`}<br />
                      {swiadek.telefon && `Tel: ${swiadek.telefon}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pkt 7: Przygotowanie zawodowe i przestrzeganie BHP */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">7.</span>
            <div className="content">
              <div className="form-label">Czy poszkodowany posiada przygotowanie zawodowe?</div>
              <div className="form-value-box">{wyjasnienia.czy_posiada_przygotowanie ? 'TAK' : 'NIE'}</div>
              <div className="form-label mt-2">Czy przestrzegał zasad BHP?</div>
              <div className="form-value-box">{wyjasnienia.czy_przestrzegane_zasady_bhp ? 'TAK' : 'NIE'}</div>
            </div>
          </div>
        </div>

        {/* Pkt 8: Szkolenia BHP */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">8.</span>
            <div className="content">
              <div className="form-label">Czy poszkodowany odbył szkolenia BHP?</div>
              <div className="form-value-box">{wyjasnienia.czy_odbyte_szkolenia_bhp ? 'TAK' : 'NIE'}</div>
            </div>
          </div>
        </div>

        {/* Pkt 9: Ocena ryzyka */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">9.</span>
            <div className="content">
              <div className="form-label">Czy opracowana ocena ryzyka zawodowego?</div>
              <div className="form-value-box">{wyjasnienia.czy_opracowana_ocena_ryzyka ? 'TAK' : 'NIE'}</div>
              {wyjasnienia.srodki_zmniejszajace_ryzyko && (
                <div className="sub-answer">
                  <strong>Środki zmniejszające ryzyko:</strong> {wyjasnienia.srodki_zmniejszajace_ryzyko}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pkt 10: Stan trzeźwości */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">10.</span>
            <div className="content">
              <div className="form-label">Czy w stanie nietrzeźwości / pod wpływem środków?</div>
              <div className="form-value-box">
                {wyjasnienia.czy_stan_nietrzezwosci || wyjasnienia.czy_pod_wplywem_srodkow ? 'TAK' : 'NIE'}
              </div>
              <div className="form-label mt-2">Czy badany stan trzeźwości?</div>
              <div className="form-value-box">{wyjasnienia.czy_badany_stan_trzeźwosci ? 'TAK' : 'NIE'}</div>
              {wyjasnienia.przez_kogo_badany && (
                <div className="sub-answer">
                  <strong>Badany przez:</strong> {wyjasnienia.przez_kogo_badany}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pkt 11: Postępowanie organów */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">11.</span>
            <div className="content">
              <div className="form-label">Czy prowadzone postępowania przez organy kontroli?</div>
              <div className="form-value-box">{wyjasnienia.czy_prowadzone_postepowania ? 'TAK' : 'NIE'}</div>
              {wyjasnienia.postepowania && wyjasnienia.postepowania.length > 0 && (
                <div className="sub-answer">
                  {wyjasnienia.postepowania.map((postepowanie: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '10px' }}>
                      <strong>Organ:</strong> {postepowanie.nazwa_organu || 'Brak danych'}<br />
                      <strong>Data wszczęcia:</strong> {postepowanie.data_wszczecia || 'Brak danych'}<br />
                      <strong>Sygnatura akt:</strong> {postepowanie.sygnatura_akt || 'Brak danych'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pkt 12: Pomoc medyczna */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">12.</span>
            <div className="content">
              <div className="form-label">Informacje o pierwszej pomocy medycznej:</div>
              {wyjasnienia.pomoc_medyczna ? (
                <>
                  <div className="form-value-box">
                    <strong>Czy udzielono pomocy:</strong> {wyjasnienia.pomoc_medyczna.czy_udzielono_pomocy ? 'TAK' : 'NIE'}
                  </div>
                  {wyjasnienia.pomoc_medyczna.placowka_medyczna && (
                    <div className="form-value-box mt-2">
                      <strong>Placówka medyczna:</strong> {wyjasnienia.pomoc_medyczna.placowka_medyczna}
                    </div>
                  )}
                  {wyjasnienia.pomoc_medyczna.data_udzielenia && (
                    <div className="form-value-box mt-2">
                      <strong>Data udzielenia pomocy:</strong> {wyjasnienia.pomoc_medyczna.data_udzielenia}
                    </div>
                  )}
                  {wyjasnienia.pomoc_medyczna.rozpoznany_uraz && (
                    <div className="form-value-box mt-2">
                      <strong>Rozpoznany uraz:</strong> {wyjasnienia.pomoc_medyczna.rozpoznany_uraz}
                    </div>
                  )}
                  {(wyjasnienia.pomoc_medyczna.niezdolnosc_od || wyjasnienia.pomoc_medyczna.niezdolnosc_do) && (
                    <div className="form-value-box mt-2">
                      <strong>Niezdolność do pracy:</strong> od {wyjasnienia.pomoc_medyczna.niezdolnosc_od || 'N/A'} do {wyjasnienia.pomoc_medyczna.niezdolnosc_do || 'N/A'}
                    </div>
                  )}
                  <div className="form-value-box mt-2">
                    <strong>W dacie wypadku przebywałem na zwolnieniu:</strong> {wyjasnienia.czy_na_zwolnieniu_w_dniu_wypadku ? 'TAK' : 'NIE'}
                  </div>
                </>
              ) : (
                <div className="form-value-box">Brak informacji o pomocy medycznej</div>
              )}
            </div>
          </div>
        </div>

        {/* Stopka z podpisami */}
        <div className="doc-footer">
          <div className="signature-box">
            <div className="place-date">{caseData?.data_utworzenia || 'Data'}</div>
            <div className="sign-line">(miejscowość i data)</div>
          </div>
          <div className="signature-box">
            <div className="signature-mock">{poszkodowany.imie} {poszkodowany.nazwisko}</div>
            <div className="sign-line">(podpis poszkodowanego)</div>
          </div>
        </div>

      </div>


      <style>{`
        @media print {
          .nav-header { display: none !important; }
          .widok-weryfikacji-container { padding: 0 !important; background: white; }
          .document-sheet { margin: 0 !important; box-shadow: none !important; width: 100% !important; max-width: none !important; page-break-after: always; }
          body { background: white; }
        }
      `}</style>
    </div >
  )
}