import { useState } from 'react'

export interface FAQFormData {
  question_es: string
  question_en: string
  answer_es: string
  answer_en: string
  order: number
}

export interface FAQFormErrors {
  question_es?: string
  question_en?: string
  answer_es?: string
  answer_en?: string
  order?: string
}

export const useFAQForm = () => {
  const [formData, setFormData] = useState<FAQFormData>({
    question_es: '',
    question_en: '',
    answer_es: '',
    answer_en: '',
    order: 0
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FAQFormErrors>({})

  const handleInputChange = (field: keyof FAQFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateOrder = async (order: number, excludeId?: string): Promise<boolean> => {
    if (order < 0) {
      setErrors(prev => ({
        ...prev,
        order: 'El orden debe ser mayor o igual a 0'
      }))
      return false
    }

    try {
      const params = new URLSearchParams({
        checkOrder: order.toString()
      })
      if (excludeId) {
        params.append('excludeId', excludeId)
      }

      const response = await fetch(`/api/faq?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (!data.available) {
          setErrors(prev => ({
            ...prev,
            order: `Ya existe una pregunta frecuente con el orden ${order}`
          }))
          return false
        } else {
          // Clear order error if available
          setErrors(prev => ({
            ...prev,
            order: undefined
          }))
          return true
        }
      }
    } catch (error) {
      console.error('Error checking order availability:', error)
    }
    
    return true
  }

  const validateForm = async (excludeId?: string): Promise<boolean> => {
    const newErrors: FAQFormErrors = {}

    if (!formData.question_es.trim()) {
      newErrors.question_es = 'La pregunta en español es obligatoria'
    }

    if (!formData.question_en.trim()) {
      newErrors.question_en = 'La pregunta en inglés es obligatoria'
    }

    if (!formData.answer_es.trim()) {
      newErrors.answer_es = 'La respuesta en español es obligatoria'
    }

    if (!formData.answer_en.trim()) {
      newErrors.answer_en = 'La respuesta en inglés es obligatoria'
    }

    if (formData.order < 0) {
      newErrors.order = 'El orden debe ser mayor o igual a 0'
    } else if (formData.order >= 0) {
      // Check if order number is already taken
      try {
        const params = new URLSearchParams({
          checkOrder: formData.order.toString()
        })
        if (excludeId) {
          params.append('excludeId', excludeId)
        }

        const response = await fetch(`/api/faq?${params}`)
        if (response.ok) {
          const data = await response.json()
          if (!data.available) {
            newErrors.order = `Ya existe una pregunta frecuente con el orden ${formData.order}`
          }
        }
      } catch (error) {
        console.error('Error checking order availability:', error)
        // Don't block form submission if order check fails
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData({
      question_es: '',
      question_en: '',
      answer_es: '',
      answer_en: '',
      order: 0
    })
    setErrors({})
  }

  const setFormDataFromApi = (data: {
    question_es: string
    question_en: string
    answer_es: string
    answer_en: string
    order: number
  }) => {
    setFormData({
      question_es: data.question_es,
      question_en: data.question_en,
      answer_es: data.answer_es,
      answer_en: data.answer_en,
      order: data.order
    })
  }

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    errors,
    handleInputChange,
    validateForm,
    validateOrder,
    resetForm,
    setFormDataFromApi
  }
}
