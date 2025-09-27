import { useState, useCallback } from 'react'

export interface ApoyoFormData {
  title: string
  description: string
  widgetCode: string
}

export const useApoyoForm = () => {
  const [formData, setFormData] = useState<ApoyoFormData>({
    title: '',
    description: '',
    widgetCode: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<ApoyoFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ApoyoFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }

    if (!formData.widgetCode.trim()) {
      newErrors.widgetCode = 'El código del widget es requerido'
    } else if (!formData.widgetCode.includes('gfm-embed') || !formData.widgetCode.includes('embed.js')) {
      newErrors.widgetCode = 'El código debe ser un widget válido de GoFundMe'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      widgetCode: ''
    })
    setErrors({})
  }

  const updateFormData = useCallback((updates: Partial<ApoyoFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    // Clear errors for updated fields
    if (updates.title !== undefined) {
      setErrors(prev => ({ ...prev, title: undefined }))
    }
    if (updates.widgetCode !== undefined) {
      setErrors(prev => ({ ...prev, widgetCode: undefined }))
    }
  }, [])

  return {
    formData,
    setFormData,
    updateFormData,
    isSubmitting,
    setIsSubmitting,
    errors,
    setErrors,
    validateForm,
    resetForm
  }
}

