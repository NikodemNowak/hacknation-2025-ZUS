import { useState, useEffect } from 'react'
import './WidokWeryfikacji.css'

const API_URL = 'http://127.0.0.1:8000'

// Rozszerzony interfejs danych odpowiadający polom z PDF
interface FormData {
  id: number
  meta: {
    dataWplywu: string
    numerZalacznika: string
  }
  poszkodowany: {
    imieNazwisko: string
    dataUrodzenia: string
    miejsceUrodzenia: string
    adres: string
    zatrudnionyW: string
    dokument: {
      rodzaj: string
      seriaNumer: string
    }
  }
  wstep: {
    dataWypadku: string
  }
  pkt1_CzasMiejsce: {
    data: string
    miejsce: string
    godzina: string
  }
  pkt2_GodzinyPracy: {
    rozpoczecie: string
    zakonczenie: string
  }
  pkt3_Czynnosci: {
    rodzaj: string // np. naprawa samochodu
  }
  pkt_OpisZdarzenia: string // Długi opis
  pkt4_Maszyny: {
    dotyczy: boolean
    opis: string
    sprawnosc: string
  }
  pkt5_Zabezpieczenia: {
    stosowane: string // tak/nie/nie dotyczy
    rodzaj: string
    wlasciwe: string
  }
  pkt6_Asekuracja: {
    stosowana: string
    obowiazek: string
  }
  pkt7_PrzestrzeganieBHP: string
  pkt8_PrzygotowanieZawodowe: string
  pkt9_SzkolenieBHP: {
    odbyte: string
    ocenaRyzyka: string
    srodkiZmniejszajace: string
  }
  pkt10_StanTrzezwosci: {
    opis: string
    badanie: string
  }
  pkt11_OrganyKontroli: {
    podjeteCzynnosci: string
  }
  pkt12_PierwszaPomoc: {
    data: string
    placowka: string
    hospitalizacja: string
    rozpoznanyUraz: string
    niezdolnoscOd: string
    niezdolnoscDo: string
    zwolnienieLekarskie: string
  }
}

interface WidokWeryfikacjiProps {
  formId: number
  onBack: () => void
  onApprove?: (id: string) => void
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
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v18M3 12h18M7.05 7.05l9.9 9.9M7.05 16.95l9.9-9.9"/>
  </svg>
)

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

// Mockowe dane odwzorowujące PDF z OCR
const formularzeSzczegoly: Record<number, FormData> = {
  1: {
    id: 1,
    meta: {
      dataWplywu: '2025-06-18',
      numerZalacznika: '1'
    },
    poszkodowany: {
      imieNazwisko: 'Jan Kowalski', // Mock (w PDF zamazane)
      dataUrodzenia: '15.05.1980', // Mock
      miejsceUrodzenia: 'Żywiec', // Mock
      adres: 'ul. Dworcowa 15, 34-300 Żywiec', // Mock
      zatrudnionyW: 'MECHANIKA POJAZDOWA',
      dokument: {
        rodzaj: 'Dowód osobisty',
        seriaNumer: 'ABC 123456'
      }
    },
    wstep: {
      dataWypadku: '10.04.2025r.'
    },
    pkt1_CzasMiejsce: {
      data: '10.04.2025r.',
      miejsce: 'warsztat samochodowy',
      godzina: 'około 9:30'
    },
    pkt2_GodzinyPracy: {
      rozpoczecie: '8:00',
      zakonczenie: '16:00'
    },
    pkt3_Czynnosci: {
      rodzaj: 'naprawa samochodu VW Passat nr rejestr SZY 12345'
    },
    pkt_OpisZdarzenia: 'W dniu wypadku 10.04.2025r. rozpocząłem pracę w zakładzie MECHANIKA POJAZDOWA której jestem właścicielem. Około godz. 9:30 zjechałem z kanału diagnostycznego na zewnątrz warsztatu. Wróciłem do warsztatu ponieważ zapomniałem zabrać osłonę silnika. Przechodząc koło kanału, w pewnym momencie poślizgnęła mi się noga, straciłem równowagę i wpadłem do kanału uderzając ciałem w najazd kanału. Wyszedłem o własnych siłach mocno obolały. Później zauważyłem, że była rozlana niewielka plama płynu chłodniczego co było przyczyną mojego poślizgnięcia. Poszedłem do pracownika pana X, który naprawiał inny samochód i powiedziałem mu o zdarzeniu. Ponieważ odczuwałem mocny ból w ramieniu i klatce piersiowej pan X zawiózł mnie na Izbę Przyjęć szpitala w Żywcu.',
    pkt4_Maszyny: {
      dotyczy: false,
      opis: 'nie dotyczy',
      sprawnosc: 'nie dotyczy'
    },
    pkt5_Zabezpieczenia: {
      stosowane: 'tak',
      rodzaj: 'buty robocze, ubranie robocze',
      wlasciwe: 'tak'
    },
    pkt6_Asekuracja: {
      stosowana: 'nie dotyczy',
      obowiazek: 'nie'
    },
    pkt7_PrzestrzeganieBHP: 'tak',
    pkt8_PrzygotowanieZawodowe: 'tak',
    pkt9_SzkolenieBHP: {
      odbyte: 'tak',
      ocenaRyzyka: 'tak',
      srodkiZmniejszajace: 'buty robocze antypoślizgowe'
    },
    pkt10_StanTrzezwosci: {
      opis: 'W chwili wypadku byłem trzeźwy',
      badanie: 'nie był badany'
    },
    pkt11_OrganyKontroli: {
      podjeteCzynnosci: 'nie dotyczy'
    },
    pkt12_PierwszaPomoc: {
      data: '10.04.2025r.',
      placowka: 'SZPITAL 2, Izba Przyjęć',
      hospitalizacja: 'nie dotyczy',
      rozpoznanyUraz: 'stłuczenie stawu ramiennego lewego, uraz kręgosłupa oraz klatki piersiowej',
      niezdolnoscOd: '10.04.2025',
      niezdolnoscDo: 'nadal',
      zwolnienieLekarskie: 'nie przebywałem'
    }
  }
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Mockowe odpowiedzi AI
const aiResponses: Record<string, string> = {
  'default': 'Przeanalizowałem dokument. Zgłoszenie dotyczy wypadku w warsztacie samochodowym. Poszkodowany Jan Kowalski uległ poślizgnięciu i wpadł do kanału diagnostycznego. Czy chcesz wiedzieć więcej o konkretnym aspekcie?',
  'analiza': 'Analiza dokumentu:\n\n✓ Kompletność danych: Wszystkie wymagane pola wypełnione\n✓ Spójność informacji: Brak rozbieżności w datach i opisach\n⚠️ Uwaga: Wypadek spowodowany rozlanym płynem - możliwe naruszenie procedur BHP\n✓ Dokumentacja medyczna: Pełna i zgodna\n\nRekomendacja: Wymaga weryfikacji procedur bezpieczeństwa w zakładzie.',
  'bhp': 'Ocena zgodności z BHP:\n\n✓ Poszkodowany posiadał szkolenie BHP\n✓ Stosował środki ochronne (buty robocze, odzież robocza)\n⚠️ Potencjalny problem: Niezabezpieczony kanał diagnostyczny\n⚠️ Rozlany płyn nie został natychmiast usunięty\n\nWniosek: Należy sprawdzić procedury sprzątania i zabezpieczenia miejsc niebezpiecznych.',
  'obrażenia': 'Analiza obrażeń:\n\n- Stłuczenie stawu ramiennego lewego\n- Uraz kręgosłupa\n- Uraz klatki piersiowej\n\nPomoć medyczna: Udzielona w dniu wypadku w Szpitalu w Żywcu\nNiezdolność do pracy: Od 10.04.2025 (trwa nadal)\n\nObrażenia są spójne z opisanym mechanizmem wypadku (upadek do kanału).',
  'rekomendacja': 'Rekomendacje:\n\n1. ✅ ZATWIERDZIĆ zgłoszenie - dokumentacja kompletna\n2. 📝 ZALECIĆ kontrolę PIP w zakładzie\n3. ⚠️ ZAŻĄDAĆ opisu działań prewencyjnych (zapobieganie rozlewaniu płynów)\n4. 📋 SPRAWDZIĆ historię wypadków w tym zakładzie\n\nDokument spełnia formalne wymogi do akceptacji.'
}

export default function WidokWeryfikacji({ formId, onBack, onApprove, onReject, caseId }: WidokWeryfikacjiProps) {
  const data = formularzeSzczegoly[formId] || formularzeSzczegoly[1]
  const [caseData, setCaseData] = useState<CaseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

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

  const handleApprove = () => { if (onApprove && caseId) onApprove(caseId); alert('Zatwierdzono'); }
  const handleReject = () => { if (onReject && caseId) onReject(caseId); alert('Odrzucono'); }

  const handleOpenAiPanel = () => {
    setShowAiPanel(true)
    if (messages.length === 0) {
      // Automatyczna pierwsza analiza
      setIsAnalyzing(true)
      setTimeout(() => {
        setMessages([{
          role: 'assistant',
          content: aiResponses['default'],
          timestamp: new Date()
        }])
        setIsAnalyzing(false)
      }, 1500)
    }
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsAnalyzing(true)

    // Mockowa logika odpowiedzi AI
    setTimeout(() => {
      const lowerInput = inputMessage.toLowerCase()
      let response = aiResponses['default']

      if (lowerInput.includes('analiz') || lowerInput.includes('oceń') || lowerInput.includes('sprawdź')) {
        response = aiResponses['analiza']
      } else if (lowerInput.includes('bhp') || lowerInput.includes('bezpieczeń')) {
        response = aiResponses['bhp']
      } else if (lowerInput.includes('obraż') || lowerInput.includes('uraz') || lowerInput.includes('medycz')) {
        response = aiResponses['obrażenia']
      } else if (lowerInput.includes('rekomend') || lowerInput.includes('decyzj') || lowerInput.includes('co radzisz')) {
        response = aiResponses['rekomendacja']
      } else {
        response = `Rozumiem pytanie o: "${inputMessage}". ${aiResponses['default']}`
      }

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsAnalyzing(false)
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question)
    setTimeout(() => handleSendMessage(), 100)
  }

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

  // Przygotowanie danych z backendu lub fallback na mock
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
          <button className="btn-ai" onClick={handleOpenAiPanel}>
            <SparklesIcon /> Analizuj AI
          </button>
          <button className="btn-reject" onClick={handleReject}>
            <XIcon /> Odrzuć
          </button>
          <button className="btn-approve" onClick={handleApprove}>
            <CheckIcon /> Zatwierdź
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
                <strong>Imię i nazwisko:</strong> {poszkodowany.imie} {poszkodowany.nazwisko || 'Brak danych'}<br/>
                <strong>PESEL:</strong> {poszkodowany.pesel || 'Brak danych'}<br/>
                <strong>Data urodzenia:</strong> {poszkodowany.data_urodzenia || 'Brak danych'}<br/>
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
                <strong>Data wypadku:</strong> {zawiadomienie.data_wypadku || 'Brak danych'}<br/>
                <strong>Godzina wypadku:</strong> {zawiadomienie.godzina_wypadku || 'Brak danych'}<br/>
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
                      {swiadek.imie} {swiadek.nazwisko}<br/>
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
                <strong>Okoliczności:</strong><br/>
                {wyjasnienia.okolicznosci_wypadku || 'Brak danych'}<br/><br/>
                <strong>Przyczyny:</strong><br/>
                {wyjasnienia.przyczyny_wypadku || 'Brak danych'}<br/><br/>
                <strong>Sekwencja zdarzeń:</strong><br/>
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
                  <strong>Informacje o maszynie:</strong><br/>
                  Nazwa: {wyjasnienia.informacje_o_maszynie.nazwa || 'N/A'}<br/>
                  Producent: {wyjasnienia.informacje_o_maszynie.producent || 'N/A'}<br/>
                  Numer seryjny: {wyjasnienia.informacje_o_maszynie.numer_seryjny || 'N/A'}<br/>
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
                  <strong>Rodzaj środków ochrony:</strong> {wyjasnienia.rodzaj_srodkow_ochrony}<br/>
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
                  <strong>Świadkowie:</strong><br/>
                  {wyjasnienia.swiadkowie.map((swiadek: any, idx: number) => (
                    <div key={idx} style={{ marginBottom: '5px' }}>
                      {swiadek.imie} {swiadek.nazwisko} {swiadek.stanowisko && `- ${swiadek.stanowisko}`}<br/>
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
                      <strong>Organ:</strong> {postepowanie.nazwa_organu || 'Brak danych'}<br/>
                      <strong>Data wszczęcia:</strong> {postepowanie.data_wszczecia || 'Brak danych'}<br/>
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



       {/* Panel AI - Sliding Panel */}
       <div className={`ai-panel ${showAiPanel ? 'open' : ''}`}>
         <div className="ai-panel-header">
           <div className="ai-header-title">
             <SparklesIcon />
             <h3>Asystent AI - Analiza Dokumentu</h3>
           </div>
           <button className="btn-close-ai" onClick={() => setShowAiPanel(false)}>
             <XIcon />
           </button>
         </div>

         <div className="ai-chat-container">
           {messages.length === 0 && !isAnalyzing && (
             <div className="ai-welcome">
               <SparklesIcon />
               <p>Witaj! Jestem asystentem AI ZUS.</p>
               <p>Kliknij poniżej, aby rozpocząć analizę dokumentu lub zadaj mi pytanie.</p>
               <div className="quick-questions">
                 <button onClick={() => handleQuickQuestion('Przeprowadź pełną analizę dokumentu')}>
                   📋 Pełna analiza
                 </button>
                 <button onClick={() => handleQuickQuestion('Oceń zgodność z BHP')}>
                   ⚠️ Ocena BHP
                 </button>
                 <button onClick={() => handleQuickQuestion('Przeanalizuj obrażenia')}>
                   🏥 Analiza medyczna
                 </button>
                 <button onClick={() => handleQuickQuestion('Jaką rekomendację wydać?')}>
                   ✅ Rekomendacja
                 </button>
               </div>
             </div>
           )}

           <div className="ai-messages">
             {messages.map((msg, idx) => (
               <div key={idx} className={`ai-message ${msg.role}`}>
                 <div className="message-content">
                   {msg.role === 'assistant' && (
                     <div className="ai-avatar">
                       <SparklesIcon />
                     </div>
                   )}
                   <div className="message-bubble">
                     <div className="message-text">{msg.content}</div>
                     <div className="message-time">
                       {msg.timestamp.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                     </div>
                   </div>
                 </div>
               </div>
             ))}
             {isAnalyzing && (
               <div className="ai-message assistant">
                 <div className="message-content">
                   <div className="ai-avatar">
                     <SparklesIcon />
                   </div>
                   <div className="message-bubble analyzing">
                     <div className="typing-indicator">
                       <span></span>
                       <span></span>
                       <span></span>
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>
         </div>

         <div className="ai-input-container">
           <input
             type="text"
             className="ai-input"
             placeholder="Zadaj pytanie o dokument..."
             value={inputMessage}
             onChange={(e) => setInputMessage(e.target.value)}
             onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
             disabled={isAnalyzing}
           />
           <button 
             className="btn-send" 
             onClick={handleSendMessage}
             disabled={isAnalyzing || !inputMessage.trim()}
           >
             <SendIcon />
           </button>
         </div>
       </div>
     </div>
   )
 }