import { useState } from 'react'
import './WidokWeryfikacji.css'

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
  onApprove?: (id: number) => void
  onReject?: (id: number) => void
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

export default function WidokWeryfikacji({ formId, onBack, onApprove, onReject }: WidokWeryfikacjiProps) {
  const data = formularzeSzczegoly[formId] || formularzeSzczegoly[1]
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleApprove = () => { if (onApprove) onApprove(formId); alert('Zatwierdzono'); }
  const handleReject = () => { if (onReject) onReject(formId); alert('Odrzucono'); }

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

      {/* Główny dokument "Papier" */}
      <div className="document-sheet">
        
        {/* Nagłówek ZUS */}
        <div className="doc-header">
          <div className="zus-logo">ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH</div>
          <div className="doc-meta">
            <div>Wpłynęło: <strong>{data.meta.dataWplywu}</strong></div>
            <div>Nr zał: <strong>{data.meta.numerZalacznika}</strong></div>
          </div>
        </div>

        <h1 className="doc-title">ZAPIS WYJAŚNIEŃ POSZKODOWANEGO</h1>

        {/* Sekcja wstępna: Dane osobowe */}
        <div className="doc-section section-intro">
          <div className="form-line">
            <span className="label">Ja niżej podpisany/a:</span>
            <span className="value">{data.poszkodowany.imieNazwisko}</span>
          </div>
          <div className="form-row">
            <div className="form-line">
              <span className="label">Urodzony/a:</span>
              <span className="value">{data.poszkodowany.dataUrodzenia}</span>
            </div>
            <div className="form-line">
              <span className="label">w:</span>
              <span className="value">{data.poszkodowany.miejsceUrodzenia}</span>
            </div>
          </div>
          <div className="form-line">
            <span className="label">Zamieszkały/a w:</span>
            <span className="value">{data.poszkodowany.adres}</span>
          </div>
          <div className="form-line">
            <span className="label">Zatrudniony/a w:</span>
            <span className="value">{data.poszkodowany.zatrudnionyW}</span>
          </div>
          <div className="form-line">
            <span className="label">Dokument tożsamości:</span>
            <span className="value">{data.poszkodowany.dokument.rodzaj} {data.poszkodowany.dokument.seriaNumer}</span>
          </div>
          <div className="form-line info-text">
            W związku z wypadkiem jakiemu uległem/am w dniu <strong>{data.wstep.dataWypadku}</strong> uprzedzony/a o odpowiedzialności karnej za składanie fałszywych zeznań oświadczam, co następuje:
          </div>
        </div>

        <hr className="divider" />

        {/* Pkt 1, 2, 3 - Okoliczności */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">1.</span>
            <div className="content">
              <div className="form-label">Data, miejsce i godzina wypadku:</div>
              <div className="form-value-box">
                {data.pkt1_CzasMiejsce.data}, {data.pkt1_CzasMiejsce.miejsce}, godz. {data.pkt1_CzasMiejsce.godzina}
              </div>
            </div>
          </div>

          <div className="numbered-item">
            <span className="num">2.</span>
            <div className="content">
              <div className="form-row">
                <div className="half">
                  <div className="form-label">Planowana godzina rozpoczęcia pracy:</div>
                  <div className="form-value-box">{data.pkt2_GodzinyPracy.rozpoczecie}</div>
                </div>
                <div className="half">
                  <div className="form-label">Planowana godzina zakończenia pracy:</div>
                  <div className="form-value-box">{data.pkt2_GodzinyPracy.zakonczenie}</div>
                </div>
              </div>
              <div className="form-label mt-2">Rodzaj czynności wykonywanych do momentu wypadku:</div>
              <div className="form-value-box">{data.pkt3_Czynnosci.rodzaj}</div>
            </div>
          </div>

          <div className="numbered-item">
            <span className="num">3.</span>
            <div className="content">
              <div className="form-label">Podanie okoliczności i przyczyn wypadku (opis):</div>
              <div className="form-value-box description-box">
                {data.pkt_OpisZdarzenia}
              </div>
            </div>
          </div>
        </div>

        {/* Pkt 4 - 11 - Dane techniczne/BHP */}
        <div className="doc-section">
          <div className="numbered-item">
            <span className="num">4.</span>
            <div className="content">
              <div className="form-label">Wypadek powstał podczas obsługi maszyn/urządzeń?</div>
              <div className="form-value-box">{data.pkt4_Maszyny.dotyczy ? 'TAK' : 'NIE DOTYCZY'}</div>
              {data.pkt4_Maszyny.dotyczy && (
                <div className="sub-answer">
                  Opis: {data.pkt4_Maszyny.opis}<br/>
                  Sprawność: {data.pkt4_Maszyny.sprawnosc}
                </div>
              )}
            </div>
          </div>

          <div className="numbered-item">
            <span className="num">5.</span>
            <div className="content">
              <div className="form-label">Czy były stosowane zabezpieczenia przed wypadkiem?</div>
              <div className="form-value-box">{data.pkt5_Zabezpieczenia.stosowane}</div>
              <div className="sub-answer">
                Rodzaj środków: <strong>{data.pkt5_Zabezpieczenia.rodzaj}</strong><br/>
                Czy były właściwe i sprawne: <strong>{data.pkt5_Zabezpieczenia.wlasciwe}</strong>
              </div>
            </div>
          </div>

          <div className="numbered-item">
            <span className="num">6.</span>
            <div className="content">
              <div className="form-row">
                <div className="half">
                  <div className="form-label">Czy stosowana asekuracja?</div>
                  <div className="form-value-box">{data.pkt6_Asekuracja.stosowana}</div>
                </div>
                <div className="half">
                  <div className="form-label">Obowiązek pracy w 2 osoby?</div>
                  <div className="form-value-box">{data.pkt6_Asekuracja.obowiazek}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
             <div className="numbered-item half">
                <span className="num">7.</span>
                <div className="content">
                  <div className="form-label">Przestrzegałem zasad BHP:</div>
                  <div className="form-value-box">{data.pkt7_PrzestrzeganieBHP}</div>
                </div>
             </div>
             <div className="numbered-item half">
                <span className="num">8.</span>
                <div className="content">
                  <div className="form-label">Posiadam przygotowanie:</div>
                  <div className="form-value-box">{data.pkt8_PrzygotowanieZawodowe}</div>
                </div>
             </div>
          </div>

          <div className="numbered-item">
            <span className="num">9.</span>
            <div className="content">
              <div className="form-label">Szkolenie BHP i ryzyko zawodowe:</div>
              <div className="sub-answer">
                Odbyte szkolenie: <strong>{data.pkt9_SzkolenieBHP.odbyte}</strong><br/>
                Opracowana ocena ryzyka: <strong>{data.pkt9_SzkolenieBHP.ocenaRyzyka}</strong><br/>
                Środki zmniejszające ryzyko: <strong>{data.pkt9_SzkolenieBHP.srodkiZmniejszajace}</strong>
              </div>
            </div>
          </div>

          <div className="numbered-item">
            <span className="num">10.</span>
            <div className="content">
              <div className="form-label">Stan trzeźwości:</div>
              <div className="form-value-box">{data.pkt10_StanTrzezwosci.opis}</div>
              <div className="sub-answer">Badanie: {data.pkt10_StanTrzezwosci.badanie}</div>
            </div>
          </div>

           <div className="numbered-item">
            <span className="num">11.</span>
            <div className="content">
              <div className="form-label">Czynności organów kontroli (Policja, PIP, etc.):</div>
              <div className="form-value-box">{data.pkt11_OrganyKontroli.podjeteCzynnosci}</div>
            </div>
          </div>
        </div>

        {/* Pkt 12 - Medyczne */}
        <div className="doc-section section-medical">
           <div className="numbered-item">
            <span className="num">12.</span>
            <div className="content">
              <h3 className="section-subtitle">Pierwsza pomoc</h3>
              <div className="grid-medical">
                 <div className="med-row">
                   <span className="med-label">Data udzielenia:</span>
                   <span className="med-value">{data.pkt12_PierwszaPomoc.data}</span>
                 </div>
                 <div className="med-row">
                   <span className="med-label">Placówka:</span>
                   <span className="med-value">{data.pkt12_PierwszaPomoc.placowka}</span>
                 </div>
                 <div className="med-row">
                   <span className="med-label">Hospitalizacja:</span>
                   <span className="med-value">{data.pkt12_PierwszaPomoc.hospitalizacja}</span>
                 </div>
                 <div className="med-row full">
                   <span className="med-label">Rozpoznany uraz:</span>
                   <span className="med-value highlight">{data.pkt12_PierwszaPomoc.rozpoznanyUraz}</span>
                 </div>
                 <div className="med-row full">
                   <span className="med-label">Niezdolność do pracy:</span>
                   <span className="med-value">od {data.pkt12_PierwszaPomoc.niezdolnoscOd} do {data.pkt12_PierwszaPomoc.niezdolnoscDo}</span>
                 </div>
                 <div className="med-row full">
                   <span className="med-label">W dacie wypadku przebywałem na zwolnieniu:</span>
                   <span className="med-value">{data.pkt12_PierwszaPomoc.zwolnienieLekarskie}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stopka z podpisami */}
        <div className="doc-footer">
          <div className="signature-box">
             <div className="place-date">Żywiec, 18.06.2025</div>
             <div className="sign-line">(miejscowość i data)</div>
          </div>
          <div className="signature-box">
             <div className="signature-mock">Jan Kowalski</div>
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