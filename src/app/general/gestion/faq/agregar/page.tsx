'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useFAQForm } from '@/hooks/useFAQForm'
import { useFAQTranslation } from '@/hooks/useFAQTranslation'

export default function AgregarFAQPage() {
  const router = useRouter()
  const toast = useToast()

  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    errors,
    validateForm,
    validateOrder,
    resetForm
  } = useFAQForm()

  const {
    isTranslating,
    translateToEnglish,
    setTranslationCompleted
  } = useFAQTranslation()

  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [formDataEnglish, setFormDataEnglish] = useState({
    question_es: '',
    question_en: '',
    answer_es: '',
    answer_en: '',
    order: 0
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields in both languages
    const spanishRequired = !formData.question_es || !formData.answer_es
    const englishRequired = !formDataEnglish.question_en || !formDataEnglish.answer_en
    
    if (spanishRequired || englishRequired) {
      toast.warning('Debes llenar todos los campos obligatorios tanto en español como en inglés')
      return
    }

    // Validate order number
    const isOrderValid = await validateOrder(formData.order)
    if (!isOrderValid) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare FAQ data for API
      const faqData = {
        question_es: formData.question_es.trim(),
        question_en: formDataEnglish.question_en.trim(),
        answer_es: formData.answer_es.trim(),
        answer_en: formDataEnglish.answer_en.trim(),
        order: formData.order
      }

      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(faqData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear pregunta frecuente')
      }

      const result = await response.json()
      toast.success(result.message)
      router.push('/general/gestion/faq')
    } catch (error) {
      console.error('Error creating FAQ:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear pregunta frecuente')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current form data based on language mode
  const getCurrentFormData = () => {
    if (isEnglishMode) {
      return {
        question: formDataEnglish.question_en,
        answer: formDataEnglish.answer_en
      }
    }
    return {
      question: formData.question_es,
      answer: formData.answer_es
    }
  }

  // Handle input change for current language
  const handleCurrentInputChange = (field: 'question' | 'answer', value: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({
        ...prev,
        [`${field}_en`]: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [`${field}_es`]: value
      }))
    }
  }

  // Translations
  const translations = {
    title: isEnglishMode ? 'Add FAQ' : 'Agregar FAQ',
    question: isEnglishMode ? 'Question' : 'Pregunta',
    answer: isEnglishMode ? 'Answer' : 'Respuesta',
    order: isEnglishMode ? 'Order' : 'Orden',
    createFAQ: isEnglishMode ? 'Create FAQ' : 'Crear FAQ',
    creating: isEnglishMode ? 'Creating...' : 'Creando...',
    questionPlaceholder: isEnglishMode ? 'Enter the question...' : 'Ingresa la pregunta...',
    answerPlaceholder: isEnglishMode ? 'Enter the answer...' : 'Ingresa la respuesta...',
    orderHelp: isEnglishMode ? 'Order for displaying FAQs (0 = first)' : 'Orden para mostrar las preguntas frecuentes (0 = primero)',
    englishVersion: 'English',
    spanishVersion: 'Spanish'
  }

  return (
    <div className="p-6 pt-20 md:pt-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
          <span>Inicio</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>Gestión</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>FAQ</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Agregar</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            {translations.title}
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Crea una nueva pregunta frecuente para la página principal
          </p>
        </div>

        {/* Language Toggle and Create Buttons */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle Button */}
          <button
            onClick={async () => {
              if (!isEnglishMode) {
                // Switch to English mode and trigger translation
                setIsEnglishMode(true)
                setTranslationCompleted(false)
                
                // Copy order from Spanish form
                setFormDataEnglish(prev => ({
                  ...prev,
                  order: formData.order
                }))
                
                // Translate question and answer if they exist
                if (formData.question_es.trim() || formData.answer_es.trim()) {
                  const translated = await translateToEnglish(formData, setFormDataEnglish)
                }
              } else {
                // Switching back to Spanish mode
                setIsEnglishMode(false)
                setTranslationCompleted(false)
              }
            }}
            disabled={isTranslating}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isTranslating ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Traduciendo...</span>
              </div>
            ) : (
              isEnglishMode ? translations.spanishVersion : translations.englishVersion
            )}
          </button>

          {/* Create Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>{translations.creating}</span>
              </div>
            ) : (
              translations.createFAQ
            )}
          </button>
        </div>
      </div>

      {/* Language Mode Indicator */}
      {isEnglishMode && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="text-blue-800 font-medium">
              English Mode - This section will be filled in English. The DeepL translation endpoint will be integrated later.
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
        {/* Translation Loading Overlay */}
        {isTranslating && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-lg font-medium text-gray-700">Traduciendo contenido...</p>
              <p className="mt-2 text-sm text-gray-500">Por favor espera mientras se traduce el contenido al inglés</p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div>
            <label htmlFor="question" className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              {translations.question} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="question"
              value={getCurrentFormData().question}
              onChange={(e) => handleCurrentInputChange('question', e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
                (isEnglishMode ? !formDataEnglish.question_en.trim() : !formData.question_es.trim()) 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-[#5A6F80] focus:ring-[#5A6F80]'
              }`}
              placeholder={translations.questionPlaceholder}
            />
            {(isEnglishMode ? !formDataEnglish.question_en.trim() : !formData.question_es.trim()) && (
              <p className="mt-1 text-sm text-red-600">
                {isEnglishMode ? 'La pregunta en inglés es obligatoria' : 'La pregunta en español es obligatoria'}
              </p>
            )}
          </div>

          {/* Answer */}
          <div>
            <label htmlFor="answer" className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              {translations.answer} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="answer"
              rows={6}
              value={getCurrentFormData().answer}
              onChange={(e) => handleCurrentInputChange('answer', e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm resize-none ${
                (isEnglishMode ? !formDataEnglish.answer_en.trim() : !formData.answer_es.trim()) 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-[#5A6F80] focus:ring-[#5A6F80]'
              }`}
              placeholder={translations.answerPlaceholder}
            />
            {(isEnglishMode ? !formDataEnglish.answer_en.trim() : !formData.answer_es.trim()) && (
              <p className="mt-1 text-sm text-red-600">
                {isEnglishMode ? 'La respuesta en inglés es obligatoria' : 'La respuesta en español es obligatoria'}
              </p>
            )}
          </div>

          {/* Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              {translations.order}
            </label>
            <input
              type="number"
              id="order"
              min="0"
              value={isEnglishMode ? formDataEnglish.order : formData.order}
              onChange={async (e) => {
                const orderValue = parseInt(e.target.value) || 0
                if (isEnglishMode) {
                  setFormDataEnglish(prev => ({ ...prev, order: orderValue }))
                } else {
                  setFormData(prev => ({ ...prev, order: orderValue }))
                }
                
                // Validate order number in real-time
                if (orderValue >= 0) {
                  await validateOrder(orderValue)
                }
              }}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
                errors.order 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-[#5A6F80] focus:ring-[#5A6F80]'
              }`}
              placeholder="0"
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">{errors.order}</p>
            )}
            <p className="mt-2 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              {translations.orderHelp}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
