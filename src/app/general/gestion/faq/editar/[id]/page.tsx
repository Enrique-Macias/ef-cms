'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useFAQForm } from '@/hooks/useFAQForm'

interface FAQ {
  id: string
  question_es: string
  question_en: string
  answer_es: string
  answer_en: string
  order: number
  createdAt: string
  updatedAt: string
}

export default function EditarFAQPage() {
  const params = useParams()
  const router = useRouter()
  const faqId = params.id as string
  const toast = useToast()

  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    errors,
    validateForm,
    validateOrder,
    setFormDataFromApi
  } = useFAQForm()


  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [originalData, setOriginalData] = useState<FAQ | null>(null)
  const [formDataEnglish, setFormDataEnglish] = useState({
    question_es: '',
    question_en: '',
    answer_es: '',
    answer_en: '',
    order: 0
  })

  // Load FAQ data on component mount
  useEffect(() => {
    const loadFAQData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/faq/${faqId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('FAQ not found')
          }
          throw new Error('Error al obtener pregunta frecuente')
        }
        const data = await response.json()
        setOriginalData(data)
        setFormDataFromApi(data)
        
        // Populate English form
        setFormDataEnglish({
          question_es: data.question_es,
          question_en: data.question_en,
          answer_es: data.answer_es,
          answer_en: data.answer_en,
          order: data.order
        })
      } catch (error) {
        console.error('Error loading FAQ:', error)
        toast.error('Error al cargar la pregunta frecuente')
        router.push('/general/gestion/faq')
      } finally {
        setIsLoading(false)
      }
    }

    loadFAQData()
  }, [faqId]) // Remove setFormDataFromApi and router dependencies to prevent infinite loop

  // Check if there are changes
  const hasChanges = () => {
    if (!originalData) return false
    
    return (
      formData.question_es !== originalData.question_es ||
      formDataEnglish.question_en !== originalData.question_en ||
      formData.answer_es !== originalData.answer_es ||
      formDataEnglish.answer_en !== originalData.answer_en ||
      formData.order !== originalData.order
    )
  }

  // Handle form submission
  const handleUpdate = async () => {
    // Validate required fields in both languages
    const spanishRequired = !formData.question_es || !formData.answer_es
    const englishRequired = !formDataEnglish.question_en || !formDataEnglish.answer_en
    
    if (spanishRequired || englishRequired) {
      toast.warning('Debes llenar todos los campos obligatorios tanto en español como en inglés')
      return
    }

    // Validate order number (excluding current FAQ)
    const isOrderValid = await validateOrder(formData.order, faqId)
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

      const response = await fetch(`/api/faq/${faqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(faqData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar pregunta frecuente')
      }

      const result = await response.json()
      toast.success(result.message)
      router.push('/general/gestion/faq')
    } catch (error) {
      console.error('Error updating FAQ:', error)
      toast.error(error instanceof Error ? error.message : 'Error al actualizar pregunta frecuente')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current form data based on language mode
  const getCurrentFormData = () => {
    if (isEnglishMode) {
      return {
        question: formDataEnglish.question_en,
        answer: formDataEnglish.answer_en,
        order: formData.order
      }
    } else {
      return {
        question: formData.question_es,
        answer: formData.answer_es,
        order: formData.order
      }
    }
  }

  // Handle input change for current language
  const handleCurrentInputChange = async (field: 'question' | 'answer' | 'order', value: string | number) => {
    if (isEnglishMode) {
      if (field === 'order') {
        const orderValue = typeof value === 'number' ? value : parseInt(value.toString()) || 0
        setFormData(prev => ({
          ...prev,
          order: orderValue
        }))
        
        // Validate order number in real-time (excluding current FAQ)
        if (orderValue >= 0) {
          await validateOrder(orderValue, faqId)
        }
      } else {
        setFormDataEnglish(prev => ({
          ...prev,
          [`${field}_en`]: value as string
        }))
      }
    } else {
      if (field === 'order') {
        const orderValue = typeof value === 'number' ? value : parseInt(value.toString()) || 0
        setFormData(prev => ({
          ...prev,
          order: orderValue
        }))
        
        // Validate order number in real-time (excluding current FAQ)
        if (orderValue >= 0) {
          await validateOrder(orderValue, faqId)
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [`${field}_es`]: value as string
        }))
      }
    }
  }

  // Handle language toggle
  const handleLanguageToggle = () => {
    setIsEnglishMode(!isEnglishMode)
  }

  // Translations
  const translations = {
    title: isEnglishMode ? 'Edit FAQ' : 'Editar FAQ',
    question: isEnglishMode ? 'Question' : 'Pregunta',
    answer: isEnglishMode ? 'Answer' : 'Respuesta',
    order: isEnglishMode ? 'Order' : 'Orden',
    updateFAQ: isEnglishMode ? 'Update FAQ' : 'Actualizar FAQ',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
    questionPlaceholder: isEnglishMode ? 'Enter the question...' : 'Ingresa la pregunta...',
    answerPlaceholder: isEnglishMode ? 'Enter the answer...' : 'Ingresa la respuesta...',
    orderHelp: isEnglishMode ? 'Order for displaying FAQs (0 = first)' : 'Orden para mostrar las preguntas frecuentes (0 = primero)',
    englishVersion: 'English',
    spanishVersion: 'Spanish'
  }

  if (isLoading) {
    return (
      <div className="p-6 pt-20 md:pt-6">
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      </div>
    )
  }

  if (!originalData) {
    return (
      <div className="p-6 pt-20 md:pt-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-metropolis font-bold text-[#0D141C] mb-4">
            Pregunta frecuente no encontrada
          </h1>
          <p className="text-[#4A739C] font-metropolis font-regular mb-6">
            La pregunta frecuente que buscas no existe o ha sido eliminada.
          </p>
          <button
            onClick={() => router.push('/general/gestion/faq')}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            Volver a FAQ
          </button>
        </div>
      </div>
    )
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Editar</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            {translations.title}
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Modifica la pregunta frecuente existente
          </p>
        </div>

        {/* Language Toggle and Update Buttons */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle Button */}
          <button
            onClick={handleLanguageToggle}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isEnglishMode ? translations.spanishVersion : translations.englishVersion}
          </button>

          {/* Update Button */}
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isSubmitting || !hasChanges()}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>{translations.updating}</span>
              </div>
            ) : (
              translations.updateFAQ
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
              English Mode - Editing English version of the FAQ
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-6">
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
                (isEnglishMode ? errors.question_en : errors.question_es) 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-[#5A6F80] focus:ring-[#5A6F80]'
              }`}
              placeholder={translations.questionPlaceholder}
            />
            {(isEnglishMode ? errors.question_en : errors.question_es) && (
              <p className="mt-1 text-sm text-red-600">
                {isEnglishMode ? errors.question_en : errors.question_es}
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
                (isEnglishMode ? errors.answer_en : errors.answer_es) 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-[#5A6F80] focus:ring-[#5A6F80]'
              }`}
              placeholder={translations.answerPlaceholder}
            />
            {(isEnglishMode ? errors.answer_en : errors.answer_es) && (
              <p className="mt-1 text-sm text-red-600">
                {isEnglishMode ? errors.answer_en : errors.answer_es}
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
              value={getCurrentFormData().order}
              onChange={(e) => handleCurrentInputChange('order', parseInt(e.target.value) || 0)}
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
