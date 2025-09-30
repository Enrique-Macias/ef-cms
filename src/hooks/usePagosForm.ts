import { useState, useCallback } from 'react'

export interface PagosFormData {
  paystripeCode: string
  paypalUrl: string
}

export interface PagosFormErrors {
  paystripeCode?: string
  paypalUrl?: string
}

export const usePagosForm = () => {
  const [formData, setFormData] = useState<PagosFormData>({
    paystripeCode: '',
    paypalUrl: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<PagosFormErrors>({})

  const handleInputChange = useCallback((field: keyof PagosFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }, [errors])

  const validateForm = useCallback((): boolean => {
    const newErrors: PagosFormErrors = {}

    // All fields are optional, but validate URL format if provided
    if (formData.paypalUrl.trim() && !/^https?:\/\/.+/.test(formData.paypalUrl)) {
      newErrors.paypalUrl = 'La URL de PayPal debe ser válida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData({
      paystripeCode: '',
      paypalUrl: '',
    })
    setErrors({})
  }, [])

  const setFormDataFromApi = useCallback((data: { paystripeCode?: string; paypalUrl?: string }) => {
    setFormData({
      paystripeCode: data.paystripeCode || '',
      paypalUrl: data.paypalUrl || '',
    })
  }, [])

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    errors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormDataFromApi,
  }
}
