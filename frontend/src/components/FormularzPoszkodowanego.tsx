import { useState, useEffect } from 'react'
import './FormularzPoszkodowanego.css'

interface Adres {
  ulica: string
  nr_domu: string
  kod_pocztowy: string
  miejscowosc: string
  panstwo: string
}

interface Poszkodowany {
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
}

const initialFormData: Poszkodowany = {
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
  }
}

const rodzajeDokomentow = [
  { value: '', label: 'Wybierz rodzaj dokumentu' },
  { value: 'dowód osobisty', label: 'Dowód osobisty' },
  { value: 'paszport', label: 'Paszport' },
  { value: 'prawo jazdy', label: 'Prawo jazdy' },
  { value: 'karta pobytu', label: 'Karta pobytu' }
]

// Ikony
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
  </svg>
)

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12,5 19,12 12,19" />
  </svg>
)

interface FormularzPoszkodowanegoProps {
  onSubmit?: (data: Poszkodowany) => void
  onCancel?: () => void
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

export interface ExtendedFormData extends Poszkodowany {
  adres_korespondencyjny?: Adres
  adres_korespondencyjny_taki_sam?: boolean
  dzialalnosc?: Dzialalnosc
  opis_okolicznosci: string
  przyczyna_zewnetrzna: string
  zwiazek_z_praca: string
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

const extendedInitialFormData: ExtendedFormData = {
  ...initialFormData,
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

const takNieOptions = [
  { value: '', label: 'Wybierz odpowiedź' },
  { value: 'tak', label: 'Tak' },
  { value: 'nie', label: 'Nie' }
]

export default function FormularzPoszkodowanego({ onSubmit, onCancel }: FormularzPoszkodowanegoProps) {
  const [formData, setFormData] = useState<ExtendedFormData>(extendedInitialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [stepOffset, setStepOffset] = useState(0)
  const totalSteps = 7
  const visibleSteps = 3

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith('adres_zamieszkania_')) {
      const adresField = name.replace('adres_zamieszkania_', '')
      setFormData(prev => {
        const newAdresZamieszkania = {
          ...prev.adres_zamieszkania,
          [adresField]: value
        }
        return {
          ...prev,
          adres_zamieszkania: newAdresZamieszkania,
          adres_korespondencyjny: prev.adres_korespondencyjny_taki_sam
            ? { ...newAdresZamieszkania }
            : prev.adres_korespondencyjny
        }
      })
    } else if (name === 'adres_korespondencyjny_taki_sam') {
      const isSame = value === 'tak'
      setFormData(prev => ({
        ...prev,
        adres_korespondencyjny_taki_sam: isSame,
        // Jeśli zaznaczono "tak", skopiuj dane z adresu zamieszkania, w przeciwnym razie zachowaj obecne (lub wyczyść przy pierwszej zmianie)
        adres_korespondencyjny: isSame ? { ...prev.adres_zamieszkania } : prev.adres_korespondencyjny
      }))
    } else if (name.startsWith('adres_korespondencyjny_')) {
      const adresField = name.replace('adres_korespondencyjny_', '')
      setFormData(prev => ({
        ...prev,
        adres_korespondencyjny: {
          ...(prev.adres_korespondencyjny || {
            ulica: '',
            nr_domu: '',
            kod_pocztowy: '',
            miejscowosc: '',
            panstwo: 'Polska'
          }),
          [adresField]: value
        }
      }))

    } else if (name.startsWith('dzialalnosc_')) {
      const fieldName = name.replace('dzialalnosc_', '')
      if (fieldName.startsWith('adres_siedziby_')) {
        const adresField = fieldName.replace('adres_siedziby_', '')
        setFormData(prev => ({
          ...prev,
          dzialalnosc: {
            ...(prev.dzialalnosc || {
              nip_regon: '',
              nazwa_firmy: '',
              adres_siedziby: {
                ulica: '',
                nr_domu: '',
                kod_pocztowy: '',
                miejscowosc: '',
                panstwo: 'Polska'
              }
            }),
            adres_siedziby: {
              ...(prev.dzialalnosc?.adres_siedziby || {
                ulica: '',
                nr_domu: '',
                kod_pocztowy: '',
                miejscowosc: '',
                panstwo: 'Polska'
              }),
              [adresField]: value
            }
          }
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          dzialalnosc: {
            ...(prev.dzialalnosc || {
              nip_regon: '',
              nazwa_firmy: '',
              adres_siedziby: {
                ulica: '',
                nr_domu: '',
                kod_pocztowy: '',
                miejscowosc: '',
                panstwo: 'Polska'
              }
            }),
            [fieldName]: value
          }
        }))
      }
    } else if (name.startsWith('czy_')) {
      setFormData(prev => ({
        ...prev,
        [name]: value === 'tak' || value === 'nie' ? (value === 'tak') : value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  const nextStep = () => {
    const form = document.querySelector('form')
    if (form && !form.checkValidity()) {
      form.reportValidity()
      return
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const scrollStepsLeft = () => {
    if (stepOffset > 0) {
      setStepOffset(prev => prev - 1)
    }
  }

  const scrollStepsRight = () => {
    if (stepOffset < totalSteps - visibleSteps) {
      setStepOffset(prev => prev + 1)
    }
  }

  // Automatyczne przewijanie gdy aktywny krok wychodzi poza widok
  useEffect(() => {
    if (currentStep - 1 < stepOffset) {
      setStepOffset(currentStep - 1)
    } else if (currentStep - 1 >= stepOffset + visibleSteps) {
      setStepOffset(currentStep - visibleSteps)
    }
  }, [currentStep])

  const visibleStepsArray = Array.from({ length: visibleSteps }, (_, i) => stepOffset + i + 1).filter(step => step <= totalSteps)

  return (
    <div className="form-container">
      {/* Progress Steps */}
      <div className="form-progress">
        <button
          type="button"
          className="step-scroll-btn step-scroll-left"
          onClick={scrollStepsLeft}
          disabled={stepOffset === 0}
          aria-label="Przewiń kroki w lewo"
        >
          <ArrowLeftIcon />
        </button>

        <div className="progress-steps-container">
          {visibleStepsArray.map((step, index) => {
            const stepLabels = [
              'Dane osobowe',
              'Dokument',
              'Adres zamieszkania',
              'Adres korespondencyjny',
              'Działalność',
              'Opis sytuacji',
              'Wyjaśnienia'
            ]
            return (
              <div key={step}>
                <div className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                  <div className="step-number">{step}</div>
                  <div className="step-label">{stepLabels[step - 1]}</div>
                </div>
                {index < visibleStepsArray.length - 1 && <div className="progress-line"></div>}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          className="step-scroll-btn step-scroll-right"
          onClick={scrollStepsRight}
          disabled={stepOffset >= totalSteps - visibleSteps}
          aria-label="Przewiń kroki w prawo"
        >
          <ArrowRightIcon />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Krok 1: Dane osobowe */}
        {currentStep === 1 && (
          <div className="form-section">
            <div className="section-header">
              <UserIcon />
              <h2>Dane osobowe poszkodowanego</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="pesel">
                  Numer PESEL <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="pesel"
                  name="pesel"
                  value={formData.pesel}
                  onChange={handleChange}
                  placeholder="np. 90010112345"
                  maxLength={11}
                  required
                />
                <span className="field-hint">11 cyfr</span>
              </div>

              <div className="form-group">
                <label htmlFor="numer_telefonu">
                  Numer telefonu <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="numer_telefonu"
                  name="numer_telefonu"
                  value={formData.numer_telefonu}
                  onChange={handleChange}
                  placeholder="np. +48 123 456 789"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="imie">
                  Imię <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="imie"
                  name="imie"
                  value={formData.imie}
                  onChange={handleChange}
                  placeholder="np. Jan"
                  minLength={2}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nazwisko">
                  Nazwisko <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nazwisko"
                  name="nazwisko"
                  value={formData.nazwisko}
                  onChange={handleChange}
                  placeholder="np. Kowalski"
                  minLength={2}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="data_urodzenia">
                  Data urodzenia <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="data_urodzenia"
                  name="data_urodzenia"
                  value={formData.data_urodzenia}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="miejsce_urodzenia">
                  Miejsce urodzenia <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="miejsce_urodzenia"
                  name="miejsce_urodzenia"
                  value={formData.miejsce_urodzenia}
                  onChange={handleChange}
                  placeholder="np. Warszawa"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Krok 2: Dokument tożsamości */}
        {currentStep === 2 && (
          <div className="form-section">
            <div className="section-header">
              <DocumentIcon />
              <h2>Dokument tożsamości</h2>
            </div>

            <div className="form-grid">
              <div className="form-group form-group-full">
                <label htmlFor="rodzaj_dokumentu">
                  Rodzaj dokumentu <span className="required">*</span>
                </label>
                <select
                  id="rodzaj_dokumentu"
                  name="rodzaj_dokumentu"
                  value={formData.rodzaj_dokumentu}
                  onChange={handleChange}
                  required
                >
                  {rodzajeDokomentow.map(doc => (
                    <option key={doc.value} value={doc.value}>
                      {doc.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="seria_dokumentu">
                  Seria dokumentu <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="seria_dokumentu"
                  name="seria_dokumentu"
                  value={formData.seria_dokumentu}
                  onChange={handleChange}
                  placeholder="np. ABC"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="numer_dokumentu">
                  Numer dokumentu <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="numer_dokumentu"
                  name="numer_dokumentu"
                  value={formData.numer_dokumentu}
                  onChange={handleChange}
                  placeholder="np. 123456"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Krok 3: Adres zamieszkania */}
        {currentStep === 3 && (
          <div className="form-section">
            <div className="section-header">
              <HomeIcon />
              <h2>Adres zamieszkania</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="adres_zamieszkania_ulica">
                  Ulica <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_zamieszkania_ulica"
                  name="adres_zamieszkania_ulica"
                  value={formData.adres_zamieszkania.ulica}
                  onChange={handleChange}
                  placeholder="np. Marszałkowska"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adres_zamieszkania_nr_domu">
                  Numer domu/mieszkania <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_zamieszkania_nr_domu"
                  name="adres_zamieszkania_nr_domu"
                  value={formData.adres_zamieszkania.nr_domu}
                  onChange={handleChange}
                  placeholder="np. 10/24"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adres_zamieszkania_kod_pocztowy">
                  Kod pocztowy <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_zamieszkania_kod_pocztowy"
                  name="adres_zamieszkania_kod_pocztowy"
                  value={formData.adres_zamieszkania.kod_pocztowy}
                  onChange={handleChange}
                  placeholder="np. 00-001"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adres_zamieszkania_miejscowosc">
                  Miejscowość <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_zamieszkania_miejscowosc"
                  name="adres_zamieszkania_miejscowosc"
                  value={formData.adres_zamieszkania.miejscowosc}
                  onChange={handleChange}
                  placeholder="np. Warszawa"
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="adres_zamieszkania_panstwo">
                  Państwo <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_zamieszkania_panstwo"
                  name="adres_zamieszkania_panstwo"
                  value={formData.adres_zamieszkania.panstwo}
                  onChange={handleChange}
                  placeholder="np. Polska"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Krok 4: Adres korespondencyjny */}
        {currentStep === 4 && (
          <div className="form-section">
            <div className="section-header">
              <HomeIcon />
              <h2>Adres korespondencyjny</h2>
            </div>

            <div className="form-grid">
              <div className="form-group form-group-full">
                <label htmlFor="adres_korespondencyjny_taki_sam">
                  Czy adres korespondencyjny jest taki sam jak adres zamieszkania? <span className="required">*</span>
                </label>
                <select
                  id="adres_korespondencyjny_taki_sam"
                  name="adres_korespondencyjny_taki_sam"
                  value={formData.adres_korespondencyjny_taki_sam ? 'tak' : formData.adres_korespondencyjny_taki_sam === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.adres_korespondencyjny_taki_sam === false && (
                <>
                  <div className="form-group">
                    <label htmlFor="adres_korespondencyjny_ulica">
                      Ulica (korespondencyjny) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="adres_korespondencyjny_ulica"
                      name="adres_korespondencyjny_ulica"
                      value={formData.adres_korespondencyjny?.ulica || ''}
                      onChange={handleChange}
                      placeholder="np. Marszałkowska"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adres_korespondencyjny_nr_domu">
                      Numer domu/mieszkania (korespondencyjny) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="adres_korespondencyjny_nr_domu"
                      name="adres_korespondencyjny_nr_domu"
                      value={formData.adres_korespondencyjny?.nr_domu || ''}
                      onChange={handleChange}
                      placeholder="np. 10/24"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adres_korespondencyjny_kod_pocztowy">
                      Kod pocztowy (korespondencyjny) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="adres_korespondencyjny_kod_pocztowy"
                      name="adres_korespondencyjny_kod_pocztowy"
                      value={formData.adres_korespondencyjny?.kod_pocztowy || ''}
                      onChange={handleChange}
                      placeholder="np. 00-001"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="adres_korespondencyjny_miejscowosc">
                      Miejscowość (korespondencyjny) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="adres_korespondencyjny_miejscowosc"
                      name="adres_korespondencyjny_miejscowosc"
                      value={formData.adres_korespondencyjny?.miejscowosc || ''}
                      onChange={handleChange}
                      placeholder="np. Warszawa"
                      required
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="adres_korespondencyjny_panstwo">
                      Państwo (korespondencyjny) <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="adres_korespondencyjny_panstwo"
                      name="adres_korespondencyjny_panstwo"
                      value={formData.adres_korespondencyjny?.panstwo || ''}
                      onChange={handleChange}
                      placeholder="np. Polska"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Krok 5: Działalność */}
        {currentStep === 5 && (
          <div className="form-section">
            <div className="section-header">
              <DocumentIcon />
              <h2>Działalność</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="dzialalnosc_nip_regon">
                  NIP lub REGON <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="dzialalnosc_nip_regon"
                  name="dzialalnosc_nip_regon"
                  value={formData.dzialalnosc?.nip_regon || ''}
                  onChange={handleChange}
                  placeholder="np. 1234567890"
                  required
                />
                <span className="field-hint">NIP: 10 cyfr, REGON: 9 lub 14 cyfr</span>
              </div>

              <div className="form-group">
                <label htmlFor="dzialalnosc_nazwa_firmy">
                  Nazwa firmy/działalności <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="dzialalnosc_nazwa_firmy"
                  name="dzialalnosc_nazwa_firmy"
                  value={formData.dzialalnosc?.nazwa_firmy || ''}
                  onChange={handleChange}
                  placeholder="np. Firma Budowlana Kowalski"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dzialalnosc_kod_pkd">
                  Kod PKD (opcjonalnie)
                </label>
                <input
                  type="text"
                  id="dzialalnosc_kod_pkd"
                  name="dzialalnosc_kod_pkd"
                  value={formData.dzialalnosc?.kod_pkd || ''}
                  onChange={handleChange}
                  placeholder="np. 43.99.Z"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dzialalnosc_adres_siedziby_ulica">
                  Ulica siedziby <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="dzialalnosc_adres_siedziby_ulica"
                  name="dzialalnosc_adres_siedziby_ulica"
                  value={formData.dzialalnosc?.adres_siedziby?.ulica || ''}
                  onChange={handleChange}
                  placeholder="np. Marszałkowska"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dzialalnosc_adres_siedziby_nr_domu">
                  Numer domu siedziby <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="dzialalnosc_adres_siedziby_nr_domu"
                  name="dzialalnosc_adres_siedziby_nr_domu"
                  value={formData.dzialalnosc?.adres_siedziby?.nr_domu || ''}
                  onChange={handleChange}
                  placeholder="np. 10/24"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dzialalnosc_adres_siedziby_kod_pocztowy">
                  Kod pocztowy siedziby <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="dzialalnosc_adres_siedziby_kod_pocztowy"
                  name="dzialalnosc_adres_siedziby_kod_pocztowy"
                  value={formData.dzialalnosc?.adres_siedziby?.kod_pocztowy || ''}
                  onChange={handleChange}
                  placeholder="np. 00-001"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dzialalnosc_adres_siedziby_miejscowosc">
                  Miejscowość siedziby <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="dzialalnosc_adres_siedziby_miejscowosc"
                  name="dzialalnosc_adres_siedziby_miejscowosc"
                  value={formData.dzialalnosc?.adres_siedziby?.miejscowosc || ''}
                  onChange={handleChange}
                  placeholder="np. Warszawa"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dzialalnosc_adres_siedziby_panstwo">
                  Państwo siedziby <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="dzialalnosc_adres_siedziby_panstwo"
                  name="dzialalnosc_adres_siedziby_panstwo"
                  value={formData.dzialalnosc?.adres_siedziby?.panstwo || ''}
                  onChange={handleChange}
                  placeholder="np. Polska"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dzialalnosc_numer_telefonu">
                  Numer telefonu firmy (opcjonalnie)
                </label>
                <input
                  type="tel"
                  id="dzialalnosc_numer_telefonu"
                  name="dzialalnosc_numer_telefonu"
                  value={formData.dzialalnosc?.numer_telefonu || ''}
                  onChange={handleChange}
                  placeholder="np. +48 123 456 789"
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="dzialalnosc_licencje">
                  Licencje (opcjonalnie)
                </label>
                <textarea
                  id="dzialalnosc_licencje"
                  name="dzialalnosc_licencje"
                  value={formData.dzialalnosc?.licencje || ''}
                  onChange={handleChange}
                  placeholder="Opisz posiadane licencje"
                  rows={3}
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="dzialalnosc_koncesje">
                  Koncesje (opcjonalnie)
                </label>
                <textarea
                  id="dzialalnosc_koncesje"
                  name="dzialalnosc_koncesje"
                  value={formData.dzialalnosc?.koncesje || ''}
                  onChange={handleChange}
                  placeholder="Opisz posiadane koncesje"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {/* Krok 6: Opis sytuacji */}
        {currentStep === 6 && (
          <div className="form-section">
            <div className="section-header">
              <DocumentIcon />
              <h2>Opis sytuacji</h2>
            </div>

            <div className="form-grid">
              <div className="form-group form-group-full">
                <label htmlFor="opis_okolicznosci">
                  Opis okoliczności wypadku <span className="required">*</span>
                </label>
                <textarea
                  id="opis_okolicznosci"
                  name="opis_okolicznosci"
                  value={formData.opis_okolicznosci}
                  onChange={handleChange}
                  placeholder="Szczegółowy opis w jakich okolicznościach doszło do wypadku..."
                  minLength={20}
                  rows={6}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="przyczyna_zewnetrzna">
                  Przyczyna zewnętrzna <span className="required">*</span>
                </label>
                <textarea
                  id="przyczyna_zewnetrzna"
                  name="przyczyna_zewnetrzna"
                  value={formData.przyczyna_zewnetrzna}
                  onChange={handleChange}
                  placeholder="Wskazanie przyczyny zewnętrznej (czynnik sprawczy)..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="zwiazek_z_praca">
                  Związek z pracą <span className="required">*</span>
                </label>
                <textarea
                  id="zwiazek_z_praca"
                  name="zwiazek_z_praca"
                  value={formData.zwiazek_z_praca}
                  onChange={handleChange}
                  placeholder="Opis związku z prowadzoną działalnością..."
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Krok 7: Zapis wyjaśnień poszkodowanego */}
        {currentStep === 7 && (
          <div className="form-section">
            <div className="section-header">
              <DocumentIcon />
              <h2>Zapis wyjaśnień poszkodowanego</h2>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="data_wypadku">
                  Data wypadku <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="data_wypadku"
                  name="data_wypadku"
                  value={formData.data_wypadku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="godzina_wypadku">
                  Godzina wypadku <span className="required">*</span>
                </label>
                <input
                  type="time"
                  id="godzina_wypadku"
                  name="godzina_wypadku"
                  value={formData.godzina_wypadku}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="miejsce_wypadku">
                  Miejsce wypadku <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="miejsce_wypadku"
                  name="miejsce_wypadku"
                  value={formData.miejsce_wypadku}
                  onChange={handleChange}
                  placeholder="Dokładny adres/lokalizacja miejsca wypadku"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="godzina_rozpoczecia_pracy">
                  Planowana godzina rozpoczęcia pracy <span className="required">*</span>
                </label>
                <input
                  type="time"
                  id="godzina_rozpoczecia_pracy"
                  name="godzina_rozpoczecia_pracy"
                  value={formData.godzina_rozpoczecia_pracy}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="godzina_zakonczenia_pracy">
                  Planowana godzina zakończenia pracy <span className="required">*</span>
                </label>
                <input
                  type="time"
                  id="godzina_zakonczenia_pracy"
                  name="godzina_zakonczenia_pracy"
                  value={formData.godzina_zakonczenia_pracy}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="rodzaj_urazow">
                  Rodzaj urazów <span className="required">*</span>
                </label>
                <textarea
                  id="rodzaj_urazow"
                  name="rodzaj_urazow"
                  value={formData.rodzaj_urazow}
                  onChange={handleChange}
                  placeholder="Opis urazów jakich doznał poszkodowany"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="rodzaj_czynnosci">
                  Rodzaj czynności wykonywanych <span className="required">*</span>
                </label>
                <textarea
                  id="rodzaj_czynnosci"
                  name="rodzaj_czynnosci"
                  value={formData.rodzaj_czynnosci}
                  onChange={handleChange}
                  placeholder="Rodzaj czynności wykonywanych do momentu wypadku"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="okolicznosci_wypadku">
                  Okoliczności wypadku <span className="required">*</span>
                </label>
                <textarea
                  id="okolicznosci_wypadku"
                  name="okolicznosci_wypadku"
                  value={formData.okolicznosci_wypadku}
                  onChange={handleChange}
                  placeholder="Szczegółowy opis okoliczności wypadku"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="przyczyny_wypadku">
                  Przyczyny wypadku <span className="required">*</span>
                </label>
                <textarea
                  id="przyczyny_wypadku"
                  name="przyczyny_wypadku"
                  value={formData.przyczyny_wypadku}
                  onChange={handleChange}
                  placeholder="Przyczyny wypadku"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="sekwencja_zdarzen">
                  Sekwencja zdarzeń <span className="required">*</span>
                </label>
                <textarea
                  id="sekwencja_zdarzen"
                  name="sekwencja_zdarzen"
                  value={formData.sekwencja_zdarzen}
                  onChange={handleChange}
                  placeholder="Co się działo kolejno, jakie fakty doprowadziły do urazu"
                  rows={4}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="opis_miejsca_wypadku">
                  Opis miejsca wypadku <span className="required">*</span>
                </label>
                <textarea
                  id="opis_miejsca_wypadku"
                  name="opis_miejsca_wypadku"
                  value={formData.opis_miejsca_wypadku}
                  onChange={handleChange}
                  placeholder="Warunki, stan podłogi, oświetlenie itp."
                  rows={4}
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_wypadek_podczas_obslugi_maszyn">
                  Czy wypadek powstał podczas obsługi maszyn/urządzeń? <span className="required">*</span>
                </label>
                <select
                  id="czy_wypadek_podczas_obslugi_maszyn"
                  name="czy_wypadek_podczas_obslugi_maszyn"
                  value={formData.czy_wypadek_podczas_obslugi_maszyn === true ? 'tak' : formData.czy_wypadek_podczas_obslugi_maszyn === false ? 'nie' : formData.czy_wypadek_podczas_obslugi_maszyn === 'tak' ? 'tak' : formData.czy_wypadek_podczas_obslugi_maszyn === 'nie' ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.czy_wypadek_podczas_obslugi_maszyn && (
                <>
                  <div className="form-group">
                    <label htmlFor="nazwa_maszyny">
                      Nazwa maszyny/urządzenia
                    </label>
                    <input
                      type="text"
                      id="nazwa_maszyny"
                      name="nazwa_maszyny"
                      value={formData.nazwa_maszyny || ''}
                      onChange={handleChange}
                      placeholder="Np. piła tarczowa, wózek widłowy"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="producent_maszyny">
                      Producent maszyny
                    </label>
                    <input
                      type="text"
                      id="producent_maszyny"
                      name="producent_maszyny"
                      value={formData.producent_maszyny || ''}
                      onChange={handleChange}
                      placeholder="Nazwa producenta"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rok_produkcji_maszyny">
                      Rok produkcji
                    </label>
                    <input
                      type="text"
                      id="rok_produkcji_maszyny"
                      name="rok_produkcji_maszyny"
                      value={formData.rok_produkcji_maszyny || ''}
                      onChange={handleChange}
                      placeholder="RRRR"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numer_seryjny_maszyny">
                      Numer seryjny maszyny
                    </label>
                    <input
                      type="text"
                      id="numer_seryjny_maszyny"
                      name="numer_seryjny_maszyny"
                      value={formData.numer_seryjny_maszyny || ''}
                      onChange={handleChange}
                      placeholder="Numer seryjny"
                    />
                  </div>
                </>
              )}

              <div className="form-group form-group-full">
                <label htmlFor="czy_stosowane_zabezpieczenia">
                  Czy były stosowane zabezpieczenia przed wypadkiem? <span className="required">*</span>
                </label>
                <select
                  id="czy_stosowane_zabezpieczenia"
                  name="czy_stosowane_zabezpieczenia"
                  value={formData.czy_stosowane_zabezpieczenia ? 'tak' : formData.czy_stosowane_zabezpieczenia === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.czy_stosowane_zabezpieczenia && (
                <>
                  <div className="form-group form-group-full">
                    <label htmlFor="rodzaj_srodkow_ochrony">
                      Rodzaj środków ochrony
                    </label>
                    <input
                      type="text"
                      id="rodzaj_srodkow_ochrony"
                      name="rodzaj_srodkow_ochrony"
                      value={formData.rodzaj_srodkow_ochrony || ''}
                      onChange={handleChange}
                      placeholder="np. buty, kask, odzież ochronna"
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="czy_srodki_wlasciwe_i_sprawne">
                      Czy środki były właściwe i sprawne?
                    </label>
                    <select
                      id="czy_srodki_wlasciwe_i_sprawne"
                      name="czy_srodki_wlasciwe_i_sprawne"
                      value={formData.czy_srodki_wlasciwe_i_sprawne ? 'tak' : formData.czy_srodki_wlasciwe_i_sprawne === false ? 'nie' : ''}
                      onChange={handleChange}
                    >
                      {takNieOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-group form-group-full">
                <label htmlFor="czy_stosowana_asekuracja">
                  Czy była stosowana asekuracja podczas pracy? <span className="required">*</span>
                </label>
                <select
                  id="czy_stosowana_asekuracja"
                  name="czy_stosowana_asekuracja"
                  value={formData.czy_stosowana_asekuracja ? 'tak' : formData.czy_stosowana_asekuracja === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_praca_do_wykonania_samodzielnie">
                  Czy pracę można było wykonywać samodzielnie? <span className="required">*</span>
                </label>
                <select
                  id="czy_praca_do_wykonania_samodzielnie"
                  name="czy_praca_do_wykonania_samodzielnie"
                  value={formData.czy_praca_do_wykonania_samodzielnie ? 'tak' : formData.czy_praca_do_wykonania_samodzielnie === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_wymagane_min_2_osoby">
                  Czy pracę musiały wykonywać co najmniej dwie osoby? <span className="required">*</span>
                </label>
                <select
                  id="czy_wymagane_min_2_osoby"
                  name="czy_wymagane_min_2_osoby"
                  value={formData.czy_wymagane_min_2_osoby ? 'tak' : formData.czy_wymagane_min_2_osoby === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_przestrzegane_zasady_bhp">
                  Czy były przestrzegane zasady BHP? <span className="required">*</span>
                </label>
                <select
                  id="czy_przestrzegane_zasady_bhp"
                  name="czy_przestrzegane_zasady_bhp"
                  value={formData.czy_przestrzegane_zasady_bhp ? 'tak' : formData.czy_przestrzegane_zasady_bhp === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_posiada_przygotowanie">
                  Czy poszkodowany posiadał przygotowanie do wykonywania zadań? <span className="required">*</span>
                </label>
                <select
                  id="czy_posiada_przygotowanie"
                  name="czy_posiada_przygotowanie"
                  value={formData.czy_posiada_przygotowanie ? 'tak' : formData.czy_posiada_przygotowanie === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_odbyte_szkolenia_bhp">
                  Czy poszkodowany odbył szkolenia BHP? <span className="required">*</span>
                </label>
                <select
                  id="czy_odbyte_szkolenia_bhp"
                  name="czy_odbyte_szkolenia_bhp"
                  value={formData.czy_odbyte_szkolenia_bhp ? 'tak' : formData.czy_odbyte_szkolenia_bhp === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_opracowana_ocena_ryzyka">
                  Czy została opracowana ocena ryzyka zawodowego? <span className="required">*</span>
                </label>
                <select
                  id="czy_opracowana_ocena_ryzyka"
                  name="czy_opracowana_ocena_ryzyka"
                  value={formData.czy_opracowana_ocena_ryzyka ? 'tak' : formData.czy_opracowana_ocena_ryzyka === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="srodki_zmniejszajace_ryzyko">
                  Środki zmniejszające ryzyko (opcjonalnie)
                </label>
                <textarea
                  id="srodki_zmniejszajace_ryzyko"
                  name="srodki_zmniejszajace_ryzyko"
                  value={formData.srodki_zmniejszajace_ryzyko || ''}
                  onChange={handleChange}
                  placeholder="Opisz środki stosowane w celu zmniejszenia ryzyka"
                  rows={3}
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_stan_nietrzezwosci">
                  Czy w chwili wypadku poszkodowany był w stanie nietrzeźwości? <span className="required">*</span>
                </label>
                <select
                  id="czy_stan_nietrzezwosci"
                  name="czy_stan_nietrzezwosci"
                  value={formData.czy_stan_nietrzezwosci ? 'tak' : formData.czy_stan_nietrzezwosci === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_pod_wplywem_srodkow">
                  Czy poszkodowany był pod wpływem środków odurzających? <span className="required">*</span>
                </label>
                <select
                  id="czy_pod_wplywem_srodkow"
                  name="czy_pod_wplywem_srodkow"
                  value={formData.czy_pod_wplywem_srodkow ? 'tak' : formData.czy_pod_wplywem_srodkow === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_badany_stan_trzezwosci">
                  Czy w dniu wypadku został zbadany stan trzeźwości? <span className="required">*</span>
                </label>
                <select
                  id="czy_badany_stan_trzezwosci"
                  name="czy_badany_stan_trzezwosci"
                  value={formData.czy_badany_stan_trzezwosci ? 'tak' : formData.czy_badany_stan_trzezwosci === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.czy_badany_stan_trzezwosci && (
                <div className="form-group form-group-full">
                  <label htmlFor="przez_kogo_badany">
                    Przez kogo badany stan trzeźwości?
                  </label>
                  <input
                    type="text"
                    id="przez_kogo_badany"
                    name="przez_kogo_badany"
                    value={formData.przez_kogo_badany || ''}
                    onChange={handleChange}
                    placeholder="np. policja"
                  />
                </div>
              )}

              <div className="form-group form-group-full">
                <label htmlFor="czy_prowadzone_postepowania">
                  Czy zostały podjęte czynności przez organy kontroli? <span className="required">*</span>
                </label>
                <select
                  id="czy_prowadzone_postepowania"
                  name="czy_prowadzone_postepowania"
                  value={formData.czy_prowadzone_postepowania ? 'tak' : formData.czy_prowadzone_postepowania === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="czy_na_zwolnieniu_w_dniu_wypadku">
                  Czy w dniu wypadku przebywał na zwolnieniu lekarskim? <span className="required">*</span>
                </label>
                <select
                  id="czy_na_zwolnieniu_w_dniu_wypadku"
                  name="czy_na_zwolnieniu_w_dniu_wypadku"
                  value={formData.czy_na_zwolnieniu_w_dniu_wypadku ? 'tak' : formData.czy_na_zwolnieniu_w_dniu_wypadku === false ? 'nie' : ''}
                  onChange={handleChange}
                  required
                >
                  {takNieOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Przyciski nawigacji */}
        <div className="form-actions">
          <div className="form-actions-left">
            {onCancel && (
              <button type="button" className="btn-secondary" onClick={onCancel}>
                Anuluj
              </button>
            )}
          </div>

          <div className="form-actions-right">
            {currentStep > 1 && (
              <button type="button" className="btn-outline" onClick={prevStep}>
                <ArrowLeftIcon />
                Wstecz
              </button>
            )}

            {currentStep < totalSteps ? (
              <button type="button" className="btn-primary" onClick={nextStep}>
                Dalej
                <ArrowRightIcon />
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Zapisz dane
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

