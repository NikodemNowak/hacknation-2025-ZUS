import { useState, useEffect } from 'react'
import './FormularzKrokowy.css'

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
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
)

interface Field {
  name: string
  label: string
  type: 'text' | 'tel' | 'date' | 'select'
  placeholder?: string
  maxLength?: number
  minLength?: number
  options?: { value: string; label: string }[]
  hint?: string
}

interface Section {
  title: string
  icon: string
  fields: Field[]
}

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
  }
]

interface FormularzKrokowyProps {
  onSubmit?: (data: Poszkodowany) => void
  onCancel?: () => void
}

export default function FormularzKrokowy({ onSubmit, onCancel }: FormularzKrokowyProps) {
  const [formData, setFormData] = useState<Poszkodowany>(initialFormData)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [animationClass, setAnimationClass] = useState('')

  const currentSection = sections[currentSectionIndex]
  const currentField = currentSection.fields[currentFieldIndex]
  const totalFields = currentSection.fields.length
  const progress = ((currentFieldIndex + 1) / totalFields) * 100

  // Załaduj wartość dla bieżącego pola
  useEffect(() => {
    const value = getFieldValue(currentField.name)
    setInputValue(value)
  }, [currentSectionIndex, currentFieldIndex])

  const getFieldValue = (fieldName: string): string => {
    if (fieldName.startsWith('adres_zamieszkania.')) {
      const adresField = fieldName.replace('adres_zamieszkania.', '')
      return formData.adres_zamieszkania[adresField as keyof Adres] || ''
    }
    return formData[fieldName as keyof Poszkodowany] as string || ''
  }

  const setFieldValue = (fieldName: string, value: string) => {
    if (fieldName.startsWith('adres_zamieszkania.')) {
      const adresField = fieldName.replace('adres_zamieszkania.', '')
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
        [fieldName]: value
      }))
    }
  }

  const handleNext = () => {
    if (!inputValue.trim() && currentField.type !== 'select') {
      return
    }

    setFieldValue(currentField.name, inputValue)
    setAnimationClass('slide-out-left')

    setTimeout(() => {
      if (currentFieldIndex < totalFields - 1) {
        // Następne pole w tej sekcji
        setCurrentFieldIndex(prev => prev + 1)
      } else if (currentSectionIndex < sections.length - 1) {
        // Następna sekcja
        setCurrentSectionIndex(prev => prev + 1)
        setCurrentFieldIndex(0)
      } else {
        // Koniec formularza
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
        // Poprzednie pole w tej sekcji
        setCurrentFieldIndex(prev => prev - 1)
      } else if (currentSectionIndex > 0) {
        // Poprzednia sekcja
        setCurrentSectionIndex(prev => prev - 1)
        setCurrentFieldIndex(sections[currentSectionIndex - 1].fields.length - 1)
      }
      setAnimationClass('slide-in-left')
      setTimeout(() => setAnimationClass(''), 300)
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
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
        {sections.map((section, index) => (
          <>
            <div 
              key={index}
              className={`progress-step ${index === currentSectionIndex ? 'active' : ''} ${index < currentSectionIndex ? 'completed' : ''}`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{section.title}</div>
            </div>
            {index < sections.length - 1 && <div key={`line-${index}`} className="progress-line"></div>}
          </>
        ))}
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
          <span className="required-indicator">*</span>
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
            disabled={!inputValue.trim() && currentField.type !== 'date'}
          >
            <span>{isLastField ? 'Zakończ' : 'Dalej'}</span>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
