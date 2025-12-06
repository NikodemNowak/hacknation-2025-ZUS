import { useState } from 'react'
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
  </svg>
)

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
)

interface FormularzPoszkodowanegoProps {
  onSubmit?: (data: Poszkodowany) => void
  onCancel?: () => void
}

export default function FormularzPoszkodowanego({ onSubmit, onCancel }: FormularzPoszkodowanegoProps) {
  const [formData, setFormData] = useState<Poszkodowany>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('adres_')) {
      const adresField = name.replace('adres_', '')
      setFormData(prev => ({
        ...prev,
        adres_zamieszkania: {
          ...prev.adres_zamieszkania,
          [adresField]: value
        }
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
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <div className="form-container">
      {/* Progress Steps */}
      <div className="form-progress">
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Dane osobowe</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Dokument tożsamości</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Adres zamieszkania</div>
        </div>
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
                <label htmlFor="adres_ulica">
                  Ulica <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_ulica"
                  name="adres_ulica"
                  value={formData.adres_zamieszkania.ulica}
                  onChange={handleChange}
                  placeholder="np. Marszałkowska"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adres_nr_domu">
                  Numer domu/mieszkania <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_nr_domu"
                  name="adres_nr_domu"
                  value={formData.adres_zamieszkania.nr_domu}
                  onChange={handleChange}
                  placeholder="np. 10/24"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adres_kod_pocztowy">
                  Kod pocztowy <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_kod_pocztowy"
                  name="adres_kod_pocztowy"
                  value={formData.adres_zamieszkania.kod_pocztowy}
                  onChange={handleChange}
                  placeholder="np. 00-001"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="adres_miejscowosc">
                  Miejscowość <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_miejscowosc"
                  name="adres_miejscowosc"
                  value={formData.adres_zamieszkania.miejscowosc}
                  onChange={handleChange}
                  placeholder="np. Warszawa"
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="adres_panstwo">
                  Państwo <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="adres_panstwo"
                  name="adres_panstwo"
                  value={formData.adres_zamieszkania.panstwo}
                  onChange={handleChange}
                  placeholder="np. Polska"
                  required
                />
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

