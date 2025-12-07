import { useState } from 'react'
import './ProtocolPowypadkowy.css'

interface ProtocolPowypadkowyProps {
  caseId?: string
  onBack: () => void
  onFinalize: () => void
}

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PrintIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 7V3H15V7M5 14H3C2.46957 14 1.96086 13.7893 1.58579 13.4142C1.21071 13.0391 1 12.5304 1 12V9C1 8.46957 1.21071 7.96086 1.58579 7.58579C1.96086 7.21071 2.46957 7 3 7H17C17.5304 7 18.0391 7.21071 18.4142 7.58579C18.7893 7.96086 19 8.46957 19 9V12C19 12.5304 18.7893 13.0391 18.4142 13.4142C18.0391 13.7893 17.5304 14 17 14H15M5 11H15V17H5V11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function ProtocolPowypadkowy({ caseId, onBack, onFinalize }: ProtocolPowypadkowyProps) {
  const [decyzja, setDecyzja] = useState<string>('uznanie')

  // Mock data dla protokołu
  const protocolData = {
    numerProtokolu: `P/${new Date().getFullYear()}/0001`,
    dataSporzadzenia: new Date().toLocaleDateString('pl-PL'),
    numerSprawy: caseId || 'ZUS/2025/001',
    
    poszkodowany: {
      imieNazwisko: 'Jan Kowalski',
      pesel: '85010112345',
      dataUrodzenia: '01.01.1985'
    },
    
    platnik: {
      nazwa: 'Firma Budowlana "Kowalski i Syn" Sp. z o.o.',
      nip: '1234567890',
      adres: 'ul. Główna 15, 34-300 Żywiec'
    },
    
    wypadek: {
      data: '15.11.2023',
      godzina: '10:15',
      miejsce: 'Hala produkcyjna nr 2, stanowisko montażu',
      opis: 'W trakcie wykonywania prac montażowych, poszkodowany doznał urazu prawej ręki w wyniku kontaktu z ostrzem piły tarczowej. Uraz nastąpił podczas cięcia elementu drewnianego, gdy materiał się zaklinował i poszkodowany próbował go uwolnić bez wyłączenia urządzenia.'
    },
    
    ocenaBHP: {
      instruktaz: 'Poszkodowany przeszedł instruktaż BHP w dniu 05.01.2023',
      szkolenia: 'Szkolenie okresowe BHP przeprowadzone 10.01.2023',
      ocenaRyzyka: 'Na stanowisku istniała aktualna ocena ryzyka zawodowego',
      naruszenia: [
        'Brak zastosowania ochraniaczy na maszynie w momencie wypadku',
        'Nieprzestrzeganie procedury wyłączania urządzenia przed interwencją',
        'Brak środków ochrony indywidualnej (rękawice antyprzecięciowe)'
      ]
    },
    
    skutki: {
      rodzajUrazu: 'Głębokie cięcie prawej ręki z uszkodzeniem ścięgien',
      niezdolnosc: 'od 15.11.2023 do 28.02.2024 (105 dni)',
      placowka: 'Szpital Powiatowy w Żywcu, Oddział Chirurgii'
    },
    
    swiadkowie: [
      { imieNazwisko: 'Piotr Nowak', stanowisko: 'Brygadzista' },
      { imieNazwisko: 'Marek Wiśniewski', stanowisko: 'Pracownik produkcji' }
    ],
    
    ustaleniaKomisji: [
      'Wypadek został spowodowany przez nieprzestrzeganie przez poszkodowanego procedur bezpieczeństwa',
      'Maszyna była sprawna technicznie, posiadała aktualne przeglądy',
      'Pracodawca zapewnił odpowiednie środki ochrony indywidualnej',
      'Poszkodowany został przeszkolony w zakresie BHP',
      'Stanowisko pracy posiadało aktualną ocenę ryzyka zawodowego'
    ],
    
    przyczyny: {
      bezposrednia: 'Próba usunięcia zaklinowanego materiału bez wyłączenia maszyny',
      podstawowa: 'Nieprzestrzeganie procedur bezpieczeństwa przez poszkodowanego',
      organizacyjne: 'Brak skutecznego nadzoru nad przestrzeganiem procedur BHP'
    },
    
    zalecenia: [
      'Przeprowadzenie dodatkowego szkolenia dla wszystkich pracowników obsługujących maszyny z ostrymi narzędziami',
      'Wzmożenie nadzoru nad przestrzeganiem procedur bezpieczeństwa',
      'Umieszczenie dodatkowych instrukcji bezpieczeństwa przy stanowiskach pracy',
      'Przeprowadzenie kontroli stanu i dostępności środków ochrony indywidualnej'
    ],
    
    komisja: [
      { imieNazwisko: 'Anna Nowak', funkcja: 'Przewodnicząca komisji - Inspektor BHP' },
      { imieNazwisko: 'Tomasz Kowalczyk', funkcja: 'Członek komisji - Kierownik produkcji' },
      { imieNazwisko: 'Maria Lewandowska', funkcja: 'Członek komisji - Przedstawiciel pracowników' }
    ]
  }

  const handlePrint = () => {
    window.print()
  }

  const handleFinalize = () => {
    onFinalize()
  }

  return (
    <div className="protocol-container">
      {/* Pasek nawigacji */}
      <div className="nav-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeftIcon /> Wróć
        </button>
        <div className="status-actions">
          <button className="btn-print" onClick={handlePrint}>
            <PrintIcon /> Drukuj
          </button>
          <button className="btn-approve" onClick={handleFinalize}>
            <CheckIcon /> Finalizuj sprawę
          </button>
        </div>
      </div>

      {/* Dokument protokołu */}
      <div className="document-sheet">
        
        {/* Nagłówek ZUS */}
        <div className="doc-header">
          <div className="zus-logo">ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH</div>
          <div className="doc-meta">
            <div>Data sporządzenia: <strong>{protocolData.dataSporzadzenia}</strong></div>
            <div>Nr protokołu: <strong>{protocolData.numerProtokolu}</strong></div>
          </div>
        </div>

        <h1 className="doc-title">PROTOKÓŁ POWYPADKOWY</h1>
        <h2 className="doc-subtitle">Ustalenie okoliczności i przyczyn wypadku przy pracy</h2>

        {/* Pkt 1: Dane podstawowe */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">1.</span>
            <div className="content">
              <div className="form-label">Dane podstawowe sprawy:</div>
              <div className="form-value-box">
                <strong>Numer sprawy:</strong> {protocolData.numerSprawy}<br/>
                <strong>Data sporządzenia protokołu:</strong> {protocolData.dataSporzadzenia}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 2: Poszkodowany */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">2.</span>
            <div className="content">
              <div className="form-label">Dane poszkodowanego:</div>
              <div className="form-value-box">
                <strong>Imię i nazwisko:</strong> {protocolData.poszkodowany.imieNazwisko}<br/>
                <strong>PESEL:</strong> {protocolData.poszkodowany.pesel}<br/>
                <strong>Data urodzenia:</strong> {protocolData.poszkodowany.dataUrodzenia}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 3: Płatnik składek */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">3.</span>
            <div className="content">
              <div className="form-label">Płatnik składek (pracodawca):</div>
              <div className="form-value-box">
                <strong>Nazwa:</strong> {protocolData.platnik.nazwa}<br/>
                <strong>NIP:</strong> {protocolData.platnik.nip}<br/>
                <strong>Adres:</strong> {protocolData.platnik.adres}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 4: Okoliczności wypadku */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">4.</span>
            <div className="content">
              <div className="form-label">Okoliczności wypadku:</div>
              <div className="form-value-box">
                <strong>Data wypadku:</strong> {protocolData.wypadek.data}<br/>
                <strong>Godzina wypadku:</strong> {protocolData.wypadek.godzina}<br/>
                <strong>Miejsce wypadku:</strong> {protocolData.wypadek.miejsce}
              </div>
              <div className="form-label mt-2">Opis zdarzenia:</div>
              <div className="form-value-box description-box">
                {protocolData.wypadek.opis}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 5: Ocena BHP */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">5.</span>
            <div className="content">
              <div className="form-label">Ocena stanu bezpieczeństwa i higieny pracy:</div>
              <div className="form-value-box">
                <strong>Instruktaż stanowiskowy:</strong> {protocolData.ocenaBHP.instruktaz}<br/>
                <strong>Szkolenia BHP:</strong> {protocolData.ocenaBHP.szkolenia}<br/>
                <strong>Ocena ryzyka zawodowego:</strong> {protocolData.ocenaBHP.ocenaRyzyka}
              </div>
              <div className="form-label mt-2">Stwierdzone naruszenia przepisów BHP:</div>
              <div className="form-value-box">
                {protocolData.ocenaBHP.naruszenia.map((naruszenie, idx) => (
                  <div key={idx}>• {naruszenie}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 6: Skutki wypadku */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">6.</span>
            <div className="content">
              <div className="form-label">Skutki wypadku:</div>
              <div className="form-value-box">
                <strong>Rodzaj urazu:</strong> {protocolData.skutki.rodzajUrazu}<br/>
                <strong>Niezdolność do pracy:</strong> {protocolData.skutki.niezdolnosc}<br/>
                <strong>Miejsce udzielenia pomocy:</strong> {protocolData.skutki.placowka}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 7: Świadkowie */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">7.</span>
            <div className="content">
              <div className="form-label">Świadkowie zdarzenia:</div>
              <div className="form-value-box">
                {protocolData.swiadkowie.map((swiadek, idx) => (
                  <div key={idx}>
                    {idx + 1}. {swiadek.imieNazwisko} - {swiadek.stanowisko}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 8: Ustalenia komisji */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">8.</span>
            <div className="content">
              <div className="form-label">Ustalenia komisji powypadkowej:</div>
              <div className="form-value-box">
                {protocolData.ustaleniaKomisji.map((ustalenie, idx) => (
                  <div key={idx} style={{ marginBottom: '8px' }}>
                    {idx + 1}. {ustalenie}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 9: Analiza przyczyn */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">9.</span>
            <div className="content">
              <div className="form-label">Analiza przyczyn wypadku:</div>
              <div className="form-value-box">
                <strong>Przyczyna bezpośrednia:</strong><br/>
                {protocolData.przyczyny.bezposrednia}
              </div>
              <div className="form-value-box mt-2">
                <strong>Przyczyna podstawowa:</strong><br/>
                {protocolData.przyczyny.podstawowa}
              </div>
              <div className="form-value-box mt-2">
                <strong>Przyczyny organizacyjne:</strong><br/>
                {protocolData.przyczyny.organizacyjne}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 10: Decyzja */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">10.</span>
            <div className="content">
              <div className="form-label">Kwalifikacja zdarzenia:</div>
              <div className="decision-box">
                <label className={`decision-option ${decyzja === 'uznanie' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="decyzja"
                    value="uznanie"
                    checked={decyzja === 'uznanie'}
                    onChange={(e) => setDecyzja(e.target.value)}
                  />
                  <div className="decision-content">
                    <div className="decision-title">✓ UZNANIE ZA WYPADEK PRZY PRACY</div>
                    <div className="decision-desc">
                      Zdarzenie spełnia definicję wypadku przy pracy zgodnie z art. 3 ustawy z dnia 30 października 2002 r. o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych.
                    </div>
                  </div>
                </label>
                <label className={`decision-option rejection ${decyzja === 'odmowa' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="decyzja"
                    value="odmowa"
                    checked={decyzja === 'odmowa'}
                    onChange={(e) => setDecyzja(e.target.value)}
                  />
                  <div className="decision-content">
                    <div className="decision-title">✗ ODMOWA UZNANIA ZA WYPADEK PRZY PRACY</div>
                    <div className="decision-desc">
                      Zdarzenie nie spełnia przesłanek wypadku przy pracy określonych w przepisach prawa.
                    </div>
                  </div>
                </label>
              </div>
              {decyzja === 'uznanie' && (
                <div className="form-value-box mt-2" style={{ backgroundColor: '#e8f5e9' }}>
                  <strong>Uzasadnienie:</strong> Wypadek nastąpił podczas wykonywania obowiązków służbowych, w miejscu pracy, w godzinach pracy. Istnieje związek przyczynowo-skutkowy między wykonywaną pracą a powstałym urazem.
                </div>
              )}
              {decyzja === 'odmowa' && (
                <div className="form-value-box mt-2" style={{ backgroundColor: '#ffebee' }}>
                  <strong>Uzasadnienie odmowy:</strong> Po przeanalizowaniu okoliczności zdarzenia komisja ustaliła, że nie zostały spełnione przesłanki określone w art. 3 ustawy o ubezpieczeniu społecznym z tytułu wypadków przy pracy. Zdarzenie nie nastąpiło w związku z wykonywaniem zwykłych czynności lub poleceń przełożonych.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pkt 11: Zalecenia */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">11.</span>
            <div className="content">
              <div className="form-label">Zalecenia profilaktyczne:</div>
              <div className="form-value-box">
                {protocolData.zalecenia.map((zalecenie, idx) => (
                  <div key={idx} style={{ marginBottom: '8px' }}>
                    {idx + 1}. {zalecenie}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 12: Komisja */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">12.</span>
            <div className="content">
              <div className="form-label">Skład komisji powypadkowej:</div>
              <div className="form-value-box">
                {protocolData.komisja.map((czlonek, idx) => (
                  <div key={idx} style={{ marginBottom: '10px' }}>
                    <strong>{czlonek.imieNazwisko}</strong><br/>
                    {czlonek.funkcja}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stopka z podpisem */}
        <div className="doc-footer">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
            <div className="signature-box">
              <div className="signature-line"></div>
              <div className="sign-line">
                {protocolData.komisja[0].imieNazwisko}<br/>
                <small>{protocolData.komisja[0].funkcja}</small>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
