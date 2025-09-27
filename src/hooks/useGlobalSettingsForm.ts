import { useState, useCallback } from 'react'

export interface GlobalSettingsFormData {
  location: string
  mail: string
  facebookUrl: string
  instagramUrl: string
  whatsappNumber: string
  mainLogo: File | null
}

export interface GlobalSettingsFormErrors {
  location?: string
  mail?: string
  facebookUrl?: string
  instagramUrl?: string
  whatsappNumber?: string
  mainLogo?: string
}

export function useGlobalSettingsForm() {
  const [formData, setFormData] = useState<GlobalSettingsFormData>({
    location: '',
    mail: '',
    facebookUrl: '',
    instagramUrl: '',
    whatsappNumber: '',
    mainLogo: null,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<GlobalSettingsFormErrors>({})

  const handleInputChange = useCallback((field: keyof GlobalSettingsFormData, value: string | File | null) => {
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
  }, [errors])

  const handleImageUpload = useCallback((file: File) => {
    setFormData(prev => ({
      ...prev,
      mainLogo: file
    }))

    // Clear image error when user uploads a new image
    if (errors.mainLogo) {
      setErrors(prev => ({
        ...prev,
        mainLogo: undefined
      }))
    }
  }, [errors])

  const validateForm = useCallback((): boolean => {
    const newErrors: GlobalSettingsFormErrors = {}

    // All fields are optional, but validate email format if provided
    if (formData.mail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
      newErrors.mail = 'El correo electrónico no es válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData({
      location: '',
      mail: '',
      facebookUrl: '',
      instagramUrl: '',
      whatsappNumber: '',
      mainLogo: null,
    })
    setErrors({})
  }, [])

  const setFormDataFromApi = useCallback((data: {
    location?: string;
    mail?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNumber?: string;
    mainLogo?: string;
  }) => {
    setFormData({
      location: data.location || '',
      mail: data.mail || '',
      facebookUrl: data.facebookUrl || '',
      instagramUrl: data.instagramUrl || '',
      whatsappNumber: data.whatsappNumber || '',
      mainLogo: null, // We don't set the file from API data
    })
  }, [])

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    errors,
    handleInputChange,
    handleImageUpload,
    validateForm,
    resetForm,
    setFormDataFromApi,
  }
}
