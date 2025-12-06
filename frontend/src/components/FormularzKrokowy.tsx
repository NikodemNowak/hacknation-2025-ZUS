import { useState, useEffect } from 'react'
import AIChatAssistant from './AIChatAssistant'
import './FormularzKrokowy.css'

interface Adres {
  ulica: string
  nr_domu: string
  kod_pocztowy: string
  miejscowosc: string
  panstwo: string
}

interface Dzialalnosc {
  nip_regon: string
  nazwa_firmy: string
  kod_pkd?: string
  adres_siedziby: Adres
  adres_prowadzenia_dzialalnosci?: Adres
  licencje?: string
  koncesje?: string
  numer_telefonu?: string
}

interface FormData {
  // Dane poszkodowanego
  pesel: string
  rodzaj_dokumentu: string
  seria_dokumentu: string
  numer_dokumentu: string
  imie: string
  nazwisko: string
  data_urodzenia: string
  miejsce_urodzenia: string
  numer_telefonu: string
  adres_zamieszkania: Adres
  adres_korespondencyjny?: Adres
  adres_korespondencyjny_taki_sam?: boolean

  // Działalność
  dzialalnosc?: Dzialalnosc

  // Opis sytuacji
  opis_okolicznosci: string
  przyczyna_zewnetrzna: string
  zwiazek_z_praca: string

  // Zapis wyjaśnień poszkodowanego
  data_wypadku: string
  godzina_wypadku: string
  miejsce_wypadku: string
  godzina_rozpoczecia_pracy: string
  godzina_zakonczenia_pracy: string
  rodzaj_urazow: string
  rodzaj_czynnosci: string
  okolicznosci_wypadku: string
  przyczyny_wypadku: string
  sekwencja_zdarzen: string
  opis_miejsca_wypadku: string
  czy_wypadek_podczas_obslugi_maszyn: boolean
  nazwa_maszyny?: string
  producent_maszyny?: string
  rok_produkcji_maszyny?: string
  numer_seryjny_maszyny?: string
  czy_stosowane_zabezpieczenia: boolean
  rodzaj_srodkow_ochrony?: string
  czy_srodki_wlasciwe_i_sprawne?: boolean
  czy_stosowana_asekuracja: boolean
  czy_praca_do_wykonania_samodzielnie: boolean
  czy_wymagane_min_2_osoby: boolean
  czy_przestrzegane_zasady_bhp: boolean
  czy_posiada_przygotowanie: boolean
  czy_odbyte_szkolenia_bhp: boolean
  czy_opracowana_ocena_ryzyka: boolean
  srodki_zmniejszajace_ryzyko?: string
  czy_stan_nietrzezwosci: boolean
  czy_pod_wplywem_srodkow: boolean
  czy_badany_stan_trzezwosci: boolean
  przez_kogo_badany?: string
  czy_prowadzone_postepowania: boolean
  czy_na_zwolnieniu_w_dniu_wypadku: boolean
}

const initialFormData: FormData = {
  pesel: '',
  rodzaj_dokumentu: '',
  seria_dokumentu: '',
  numer_dokumentu: '',
  imie: '',
  nazwisko: '',
  data_urodzenia: '',
  miejsce_urodzenia: '',
  numer_telefonu: '',
  adres_zamieszkania: {
    ulica: '',
    nr_domu: '',
    kod_pocztowy: '',
    miejscowosc: '',
    panstwo: 'Polska'
  },
  opis_okolicznosci: '',
  przyczyna_zewnetrzna: '',
  zwiazek_z_praca: '',
  data_wypadku: '',
  godzina_wypadku: '',
  miejsce_wypadku: '',
  godzina_rozpoczecia_pracy: '',
  godzina_zakonczenia_pracy: '',
  rodzaj_urazow: '',
  rodzaj_czynnosci: '',
  okolicznosci_wypadku: '',
  przyczyny_wypadku: '',
  sekwencja_zdarzen: '',
  opis_miejsca_wypadku: '',
  czy_wypadek_podczas_obslugi_maszyn: false,
  nazwa_maszyny: '',
  producent_maszyny: '',
  rok_produkcji_maszyny: '',
  numer_seryjny_maszyny: '',
  czy_stosowane_zabezpieczenia: false,
  czy_stosowana_asekuracja: false,
  czy_praca_do_wykonania_samodzielnie: true,
  czy_wymagane_min_2_osoby: false,
  czy_przestrzegane_zasady_bhp: true,
  czy_posiada_przygotowanie: true,
  czy_odbyte_szkolenia_bhp: true,
  czy_opracowana_ocena_ryzyka: true,
  czy_stan_nietrzezwosci: false,
  czy_pod_wplywem_srodkow: false,
  czy_badany_stan_trzezwosci: false,
  czy_prowadzone_postepowania: false,
  czy_na_zwolnieniu_w_dniu_wypadku: false
}

const rodzajeDokomentow = [
  { value: '', label: 'Wybierz rodzaj dokumentu' },
  { value: 'dowód osobisty', label: 'Dowód osobisty' },
  { value: 'paszport', label: 'Paszport' },
  { value: 'prawo jazdy', label: 'Prawo jazdy' },
  { value: 'karta pobytu', label: 'Karta pobytu' }
]

const takNieOptions = [
  { value: '', label: 'Wybierz odpowiedź' },
  { value: 'tak', label: 'Tak' },
  { value: 'nie', label: 'Nie' }
]

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
)

interface Field {
  name: string
  label: string
  type: 'text' | 'tel' | 'date' | 'time' | 'select' | 'textarea' | 'boolean'
  placeholder?: string
  maxLength?: number
  minLength?: number
  options?: { value: string; label: string }[]
  hint?: string
  skipIf?: (formData: FormData) => boolean
  optional?: boolean
}

interface Section {
  title: string
  icon: string
  fields: Field[]
}

export default function FormularzKrokowy({ onSubmit, onCancel }: { onSubmit?: (data: FormData) => void, onCancel?: () => void }) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [animationClass, setAnimationClass] = useState('')
  const [showAiChat, setShowAiChat] = useState(false)
  const [sectionOffset, setSectionOffset] = useState(0)



  const handleAiText = (text: string) => {
    // Append the generated text to the current input
    const newText = inputValue ? `${inputValue} ${text}` : text
    setInputValue(newText)
    setShowAiChat(false)
  }

  // Dynamiczne sekcje z logiką warunkową
  const getSections = (): Section[] => {
    const sections: Section[] = [
      {
        title: 'Dane osobowe',
        icon: '',
        fields: [
          { name: 'pesel', label: 'Numer PESEL', type: 'text', placeholder: 'np. 90010112345', maxLength: 11, hint: '11 cyfr' },
          { name: 'imie', label: 'Imię', type: 'text', placeholder: 'np. Jan', minLength: 2 },
          { name: 'nazwisko', label: 'Nazwisko', type: 'text', placeholder: 'np. Kowalski', minLength: 2 },
          { name: 'data_urodzenia', label: 'Data urodzenia', type: 'date' },
          { name: 'miejsce_urodzenia', label: 'Miejsce urodzenia', type: 'text', placeholder: 'np. Warszawa' },
          { name: 'numer_telefonu', label: 'Numer telefonu', type: 'tel', placeholder: 'np. +48 123 456 789' }
        ]
      },
      {
        title: 'Dokument tożsamości',
        icon: '',
        fields: [
          { name: 'rodzaj_dokumentu', label: 'Rodzaj dokumentu', type: 'select', options: rodzajeDokomentow },
          { name: 'seria_dokumentu', label: 'Seria dokumentu', type: 'text', placeholder: 'np. ABC' },
          { name: 'numer_dokumentu', label: 'Numer dokumentu', type: 'text', placeholder: 'np. 123456' }
        ]
      },
      {
        title: 'Adres zamieszkania',
        icon: '',
        fields: [
          { name: 'adres_zamieszkania.ulica', label: 'Ulica', type: 'text', placeholder: 'np. Marszałkowska' },
          { name: 'adres_zamieszkania.nr_domu', label: 'Numer domu/mieszkania', type: 'text', placeholder: 'np. 10/24' },
          { name: 'adres_zamieszkania.kod_pocztowy', label: 'Kod pocztowy', type: 'text', placeholder: 'np. 00-001' },
          { name: 'adres_zamieszkania.miejscowosc', label: 'Miejscowość', type: 'text', placeholder: 'np. Warszawa' },
          { name: 'adres_zamieszkania.panstwo', label: 'Państwo', type: 'text', placeholder: 'np. Polska' }
        ]
      },
      {
        title: 'Adres korespondencyjny',
        icon: '',
        fields: [
          {
            name: 'adres_korespondencyjny_taki_sam',
            label: 'Czy adres korespondencyjny jest taki sam jak adres zamieszkania?',
            type: 'select',
            options: takNieOptions
          },
          {
            name: 'adres_korespondencyjny.ulica',
            label: 'Ulica (korespondencyjny)',
            type: 'text',
            placeholder: 'np. Marszałkowska',
            skipIf: (data) => data.adres_korespondencyjny_taki_sam === true
          },
          {
            name: 'adres_korespondencyjny.nr_domu',
            label: 'Numer domu/mieszkania (korespondencyjny)',
            type: 'text',
            placeholder: 'np. 10/24',
            skipIf: (data) => data.adres_korespondencyjny_taki_sam === true
          },
          {
            name: 'adres_korespondencyjny.kod_pocztowy',
            label: 'Kod pocztowy (korespondencyjny)',
            type: 'text',
            placeholder: 'np. 00-001',
            skipIf: (data) => data.adres_korespondencyjny_taki_sam === true
          },
          {
            name: 'adres_korespondencyjny.miejscowosc',
            label: 'Miejscowość (korespondencyjny)',
            type: 'text',
            placeholder: 'np. Warszawa',
            skipIf: (data) => data.adres_korespondencyjny_taki_sam === true
          },
          {
            name: 'adres_korespondencyjny.panstwo',
            label: 'Państwo (korespondencyjny)',
            type: 'text',
            placeholder: 'np. Polska',
            skipIf: (data) => data.adres_korespondencyjny_taki_sam === true
          }
        ]
      },
      {
        title: 'Działalność',
        icon: '',
        fields: [
          { name: 'dzialalnosc.nip_regon', label: 'NIP lub REGON', type: 'text', placeholder: 'np. 1234567890', hint: 'NIP: 10 cyfr, REGON: 9 lub 14 cyfr' },
          { name: 'dzialalnosc.nazwa_firmy', label: 'Nazwa firmy/działalności', type: 'text', placeholder: 'np. Firma Budowlana Kowalski', minLength: 2 },
          { name: 'dzialalnosc.kod_pkd', label: 'Kod PKD (opcjonalnie)', type: 'text', placeholder: 'np. 43.99.Z', optional: true },
          { name: 'dzialalnosc.adres_siedziby.ulica', label: 'Ulica siedziby', type: 'text', placeholder: 'np. Marszałkowska' },
          { name: 'dzialalnosc.adres_siedziby.nr_domu', label: 'Numer domu siedziby', type: 'text', placeholder: 'np. 10/24' },
          { name: 'dzialalnosc.adres_siedziby.kod_pocztowy', label: 'Kod pocztowy siedziby', type: 'text', placeholder: 'np. 00-001' },
          { name: 'dzialalnosc.adres_siedziby.miejscowosc', label: 'Miejscowość siedziby', type: 'text', placeholder: 'np. Warszawa' },
          { name: 'dzialalnosc.adres_siedziby.panstwo', label: 'Państwo siedziby', type: 'text', placeholder: 'np. Polska' },
          { name: 'dzialalnosc.numer_telefonu', label: 'Numer telefonu firmy (opcjonalnie)', type: 'tel', placeholder: 'np. +48 123 456 789', optional: true },
          { name: 'dzialalnosc.licencje', label: 'Licencje (opcjonalnie)', type: 'textarea', placeholder: 'Opisz posiadane licencje', optional: true },
          { name: 'dzialalnosc.koncesje', label: 'Koncesje (opcjonalnie)', type: 'textarea', placeholder: 'Opisz posiadane koncesje', optional: true }
        ]
      },
      {
        title: 'Opis sytuacji',
        icon: '',
        fields: [
          { name: 'opis_okolicznosci', label: 'Opis okoliczności wypadku', type: 'textarea', placeholder: 'Szczegółowy opis w jakich okolicznościach doszło do wypadku...', minLength: 20 },
          { name: 'przyczyna_zewnetrzna', label: 'Przyczyna zewnętrzna', type: 'textarea', placeholder: 'Wskazanie przyczyny zewnętrznej (czynnik sprawczy)...' },
          { name: 'zwiazek_z_praca', label: 'Związek z pracą', type: 'textarea', placeholder: 'Opis związku z prowadzoną działalnością...' }
        ]
      },
      {
        title: 'Zapis wyjaśnień poszkodowanego',
        icon: '',
        fields: [
          { name: 'data_wypadku', label: 'Data wypadku', type: 'date' },
          { name: 'godzina_wypadku', label: 'Godzina wypadku', type: 'time' },
          { name: 'miejsce_wypadku', label: 'Miejsce wypadku', type: 'text', placeholder: 'Dokładny adres/lokalizacja miejsca wypadku' },
          { name: 'godzina_rozpoczecia_pracy', label: 'Planowana godzina rozpoczęcia pracy', type: 'time' },
          { name: 'godzina_zakonczenia_pracy', label: 'Planowana godzina zakończenia pracy', type: 'time' },
          { name: 'rodzaj_urazow', label: 'Rodzaj urazów', type: 'textarea', placeholder: 'Opis urazów jakich doznał poszkodowany' },
          { name: 'rodzaj_czynnosci', label: 'Rodzaj czynności wykonywanych', type: 'textarea', placeholder: 'Rodzaj czynności wykonywanych do momentu wypadku' },
          { name: 'okolicznosci_wypadku', label: 'Okoliczności wypadku', type: 'textarea', placeholder: 'Szczegółowy opis okoliczności wypadku' },
          { name: 'przyczyny_wypadku', label: 'Przyczyny wypadku', type: 'textarea', placeholder: 'Przyczyny wypadku' },
          { name: 'sekwencja_zdarzen', label: 'Sekwencja zdarzeń', type: 'textarea', placeholder: 'Co się działo kolejno, jakie fakty doprowadziły do urazu' },
          { name: 'opis_miejsca_wypadku', label: 'Opis miejsca wypadku', type: 'textarea', placeholder: 'Warunki, stan podłogi, oświetlenie itp.' },
          { name: 'czy_wypadek_podczas_obslugi_maszyn', label: 'Czy wypadek powstał podczas obsługi maszyn/urządzeń?', type: 'select', options: takNieOptions },
          { name: 'nazwa_maszyny', label: 'Nazwa maszyny/urządzenia', type: 'text', placeholder: 'np. Tokarka CNC', skipIf: (data) => data.czy_wypadek_podczas_obslugi_maszyn === false },
          { name: 'producent_maszyny', label: 'Producent', type: 'text', placeholder: 'np. Producent XYZ', skipIf: (data) => data.czy_wypadek_podczas_obslugi_maszyn === false },
          { name: 'rok_produkcji_maszyny', label: 'Rok produkcji', type: 'text', placeholder: 'np. 2018', skipIf: (data) => data.czy_wypadek_podczas_obslugi_maszyn === false },
          { name: 'numer_seryjny_maszyny', label: 'Numer seryjny (opcjonalnie)', type: 'text', placeholder: 'np. SN12345678', skipIf: (data) => data.czy_wypadek_podczas_obslugi_maszyn === false, optional: true },
          { name: 'czy_stosowane_zabezpieczenia', label: 'Czy były stosowane zabezpieczenia przed wypadkiem?', type: 'select', options: takNieOptions },
          { name: 'rodzaj_srodkow_ochrony', label: 'Rodzaj środków ochrony (jeśli tak)', type: 'text', placeholder: 'np. buty, kask, odzież ochronna', skipIf: (data) => data.czy_stosowane_zabezpieczenia === false },
          { name: 'czy_srodki_wlasciwe_i_sprawne', label: 'Czy środki były właściwe i sprawne?', type: 'select', options: takNieOptions, skipIf: (data) => data.czy_stosowane_zabezpieczenia === false },
          { name: 'czy_stosowana_asekuracja', label: 'Czy była stosowana asekuracja podczas pracy?', type: 'select', options: takNieOptions },
          { name: 'czy_praca_do_wykonania_samodzielnie', label: 'Czy pracę można było wykonywać samodzielnie?', type: 'select', options: takNieOptions },
          { name: 'czy_wymagane_min_2_osoby', label: 'Czy pracę musiały wykonywać co najmniej dwie osoby?', type: 'select', options: takNieOptions },
          { name: 'czy_przestrzegane_zasady_bhp', label: 'Czy były przestrzegane zasady BHP?', type: 'select', options: takNieOptions },
          { name: 'czy_posiada_przygotowanie', label: 'Czy poszkodowany posiadał przygotowanie do wykonywania zadań?', type: 'select', options: takNieOptions },
          { name: 'czy_odbyte_szkolenia_bhp', label: 'Czy poszkodowany odbył szkolenia BHP?', type: 'select', options: takNieOptions },
          { name: 'czy_opracowana_ocena_ryzyka', label: 'Czy została opracowana ocena ryzyka zawodowego?', type: 'select', options: takNieOptions },
          { name: 'srodki_zmniejszajace_ryzyko', label: 'Środki zmniejszające ryzyko (opcjonalnie)', type: 'textarea', placeholder: 'Opisz środki stosowane w celu zmniejszenia ryzyka', optional: true },
          { name: 'czy_stan_nietrzezwosci', label: 'Czy w chwili wypadku poszkodowany był w stanie nietrzeźwości?', type: 'select', options: takNieOptions },
          { name: 'czy_pod_wplywem_srodkow', label: 'Czy poszkodowany był pod wpływem środków odurzających?', type: 'select', options: takNieOptions },
          { name: 'czy_badany_stan_trzezwosci', label: 'Czy w dniu wypadku został zbadany stan trzeźwości?', type: 'select', options: takNieOptions },
          { name: 'przez_kogo_badany', label: 'Przez kogo badany stan trzeźwości? (jeśli tak)', type: 'text', placeholder: 'np. policja', skipIf: (data) => data.czy_badany_stan_trzezwosci === false },
          { name: 'czy_prowadzone_postepowania', label: 'Czy zostały podjęte czynności przez organy kontroli?', type: 'select', options: takNieOptions },
          { name: 'czy_na_zwolnieniu_w_dniu_wypadku', label: 'Czy w dniu wypadku przebywał na zwolnieniu lekarskim?', type: 'select', options: takNieOptions }
        ]
      }
    ]

    // Filtruj pola które mają być pominięte
    return sections.map(section => ({
      ...section,
      fields: section.fields.filter(field => !field.skipIf || !field.skipIf(formData))
    }))
  }

  const sections = getSections()
  const currentSection = sections[currentSectionIndex]
  const currentField = currentSection.fields[currentFieldIndex]
  const totalFields = currentSection.fields.length
  const progress = ((currentFieldIndex + 1) / totalFields) * 100
  const visibleSections = 3

  const scrollSectionsLeft = () => {
    if (sectionOffset > 0) {
      setSectionOffset(prev => prev - 1)
    }
  }

  const scrollSectionsRight = () => {
    if (sectionOffset < sections.length - visibleSections) {
      setSectionOffset(prev => prev + 1)
    }
  }

  // Automatyczne przewijanie gdy aktywna sekcja wychodzi poza widok
  useEffect(() => {
    if (currentSectionIndex < sectionOffset) {
      setSectionOffset(currentSectionIndex)
    } else if (currentSectionIndex >= sectionOffset + visibleSections) {
      setSectionOffset(currentSectionIndex - visibleSections + 1)
    }
  }, [currentSectionIndex])

  const visibleSectionsArray = Array.from({ length: visibleSections }, (_, i) => sectionOffset + i).filter(index => index < sections.length)

  // Załaduj wartość dla bieżącego pola
  useEffect(() => {
    const value = getFieldValue(currentField.name)
    setInputValue(value)
  }, [currentSectionIndex, currentFieldIndex])

  // Obsługa zmiany adresu korespondencyjnego
  useEffect(() => {
    if (currentField.name === 'adres_korespondencyjny_taki_sam' && inputValue === 'tak') {
      // Skopiuj adres zamieszkania do korespondencyjnego
      setFormData(prev => ({
        ...prev,
        adres_korespondencyjny: { ...prev.adres_zamieszkania },
        adres_korespondencyjny_taki_sam: true
      }))
    } else if (currentField.name === 'adres_korespondencyjny_taki_sam' && inputValue === 'nie') {
      setFormData(prev => ({
        ...prev,
        adres_korespondencyjny_taki_sam: false,
        adres_korespondencyjny: prev.adres_korespondencyjny || {
          ulica: '',
          nr_domu: '',
          kod_pocztowy: '',
          miejscowosc: '',
          panstwo: 'Polska'
        }
      }))
    }
  }, [inputValue, currentField.name])

  const getFieldValue = (fieldName: string): string => {
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.')
      let value: any = formData

      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = value[part]
        } else {
          return ''
        }
      }

      if (typeof value === 'boolean') {
        return value ? 'tak' : 'nie'
      }
      return value || ''
    }

    const val = formData[fieldName as keyof FormData]
    if (typeof val === 'boolean') {
      return val ? 'tak' : 'nie'
    }
    return (val as string) || ''
  }

  const setFieldValue = (fieldName: string, value: string) => {
    if (fieldName.includes('.')) {
      const parts = fieldName.split('.')
      setFormData(prev => {
        const newData = { ...prev }
        let current: any = newData

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i]
          if (!current[part]) {
            current[part] = {}
          }
          current = current[part]
        }

        const lastPart = parts[parts.length - 1]
        if (value === 'tak' || value === 'nie') {
          current[lastPart] = value === 'tak'
        } else {
          current[lastPart] = value
        }

        return newData
      })
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value === 'tak' || value === 'nie' ? (value === 'tak') : value
      }))
    }
  }

  const handleNext = () => {
    if (!currentField.optional && !inputValue.trim() && currentField.type !== 'select' && currentField.type !== 'date' && currentField.type !== 'time') {
      return
    }

    setFieldValue(currentField.name, inputValue)
    setAnimationClass('slide-out-left')

    setTimeout(() => {
      if (currentFieldIndex < totalFields - 1) {
        setCurrentFieldIndex(prev => prev + 1)
      } else if (currentSectionIndex < sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1)
        setCurrentFieldIndex(0)
      } else {
        handleSubmit()
        return
      }
      setAnimationClass('slide-in-right')
      setTimeout(() => setAnimationClass(''), 300)
    }, 300)
  }

  const handlePrevious = () => {
    setFieldValue(currentField.name, inputValue)
    setAnimationClass('slide-out-right')

    setTimeout(() => {
      if (currentFieldIndex > 0) {
        setCurrentFieldIndex(prev => prev - 1)
      } else if (currentSectionIndex > 0) {
        setCurrentSectionIndex(prev => prev - 1)
        const prevSection = getSections()[currentSectionIndex - 1]
        setCurrentFieldIndex(prevSection.fields.length - 1)
      }
      setAnimationClass('slide-in-left')
      setTimeout(() => setAnimationClass(''), 300)
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (inputValue.trim() || currentField.type === 'date' || currentField.type === 'time')) {
      e.preventDefault()
      handleNext()
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  const isFirstField = currentSectionIndex === 0 && currentFieldIndex === 0
  const isLastField =
    currentSectionIndex === sections.length - 1 &&
    currentFieldIndex === totalFields - 1

  return (
    <div className="form-krokowy-container">


      {/* Wskaźnik wszystkich sekcji */}
      <div className="sections-indicator">
        <button
          type="button"
          className="section-scroll-btn section-scroll-left"
          onClick={scrollSectionsLeft}
          disabled={sectionOffset === 0}
          aria-label="Przewiń sekcje w lewo"
        >
          <ArrowLeftIcon />
        </button>

        <div className="sections-container">
          {visibleSectionsArray.map((index, arrayIndex) => {
            const section = sections[index]
            return (
              <div key={`section-${index}`} style={{ display: 'contents' }}>
                <div
                  className={`progress-step ${index === currentSectionIndex ? 'active' : ''} ${index < currentSectionIndex ? 'completed' : ''}`}
                >
                  <div className="step-number">{index + 1}</div>
                  <div className="step-label">{section.title}</div>
                </div>
                {arrayIndex < visibleSectionsArray.length - 1 && <div className="progress-line"></div>}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          className="section-scroll-btn section-scroll-right"
          onClick={scrollSectionsRight}
          disabled={sectionOffset >= sections.length - visibleSections}
          aria-label="Przewiń sekcje w prawo"
        >
          <ArrowRightIcon />
        </button>
      </div>

      {/* Progress bar dla aktualnej sekcji */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {currentFieldIndex + 1} z {totalFields}
        </div>
      </div>

      {/* Główny input */}
      <div className={`form-krokowy-content ${animationClass}`}>
        <label className="field-label">
          {currentField.label}
          {!currentField.optional && <span className="required-indicator">*</span>}
        </label>

        {currentField.type === 'select' ? (
          <select
            className="field-input field-select"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          >
            {currentField.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : currentField.type === 'textarea' ? (
          <div className="textarea-container">
            <textarea
              className="field-input field-textarea"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={currentField.placeholder}
              maxLength={currentField.maxLength}
              minLength={currentField.minLength}
              rows={6}
              autoFocus
            />
            {currentField.name === 'opis_okolicznosci' && (
              <div className="ai-chat-trigger">
                <button
                  className="btn-ai-chat"
                  onClick={() => setShowAiChat(true)}
                >
                  ✨ Uruchom Asystenta AI (Czat)
                </button>
              </div>
            )}
          </div>
        ) : (
          <input
            type={currentField.type}
            className="field-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={currentField.placeholder}
            maxLength={currentField.maxLength}
            minLength={currentField.minLength}
            autoFocus
            autoComplete="off"
          />
        )}

        {currentField.hint && (
          <div className="field-hint">{currentField.hint}</div>
        )}

        <div className="keyboard-hint">
          Naciśnij <kbd>Enter</kbd> ↵ aby przejść dalej
        </div>
      </div>

      {/* AI Chat Assistant Overlay */}
      {showAiChat && (
        <AIChatAssistant
          currentText={inputValue}
          onClose={() => setShowAiChat(false)}
          onUseText={handleAiText}
        />
      )}

      {/* Przyciski nawigacji */}
      <div className="form-krokowy-actions">
        <div className="actions-left">
          {onCancel && (
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
            >
              Anuluj
            </button>
          )}
        </div>

        <div className="actions-right">
          {!isFirstField && (
            <button
              type="button"
              className="btn-nav btn-prev"
              onClick={handlePrevious}
            >
              <ArrowLeftIcon />
              <span>Wstecz</span>
            </button>
          )}

          <button
            type="button"
            className="btn-nav btn-next"
            onClick={handleNext}
            disabled={!currentField.optional && !inputValue.trim() && currentField.type !== 'date' && currentField.type !== 'time' && currentField.type !== 'select'}
          >
            <span>{isLastField ? 'Zakończ' : 'Dalej'}</span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
