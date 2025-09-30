import { useState, useCallback } from 'react'

export interface GlobalSettingsFormData {
  location: string
  mail: string
  facebookUrl: string
  instagramUrl: string
  whatsappNumber: string
  web3formsKey: string
  mainLogo: File | null
  contactPersonImageUrl: string
  contactPersonName: string
  contactPersonRoleEs: string
  contactPersonRoleEn: string
}

export interface GlobalSettingsFormErrors {
  location?: string
  mail?: string
  facebookUrl?: string
  instagramUrl?: string
  whatsappNumber?: string
  web3formsKey?: string
  mainLogo?: string
  contactPersonImageUrl?: string
  contactPersonName?: string
  contactPersonRoleEs?: string
  contactPersonRoleEn?: string
}

export function useGlobalSettingsForm() {
  const [formData, setFormData] = useState<GlobalSettingsFormData>({
    location: '',
    mail: '',
    facebookUrl: '',
    instagramUrl: '',
    whatsappNumber: '',
    web3formsKey: '',
    mainLogo: null,
    contactPersonImageUrl: '',
    contactPersonName: '',
    contactPersonRoleEs: '',
    contactPersonRoleEn: '',
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
      web3formsKey: '',
      mainLogo: null,
      contactPersonImageUrl: '',
      contactPersonName: '',
      contactPersonRoleEs: '',
      contactPersonRoleEn: '',
    })
    setErrors({})
  }, [])

  const setFormDataFromApi = useCallback((data: {
    location?: string;
    mail?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNumber?: string;
    web3formsKey?: string;
    mainLogo?: string;
    contactPersonImageUrl?: string;
    contactPersonName?: string;
    contactPersonRoleEs?: string;
    contactPersonRoleEn?: string;
  }) => {
    setFormData({
      location: data.location || '',
      mail: data.mail || '',
      facebookUrl: data.facebookUrl || '',
      instagramUrl: data.instagramUrl || '',
      whatsappNumber: data.whatsappNumber || '',
      web3formsKey: data.web3formsKey || '',
      mainLogo: null, // We don't set the file from API data
      contactPersonImageUrl: data.contactPersonImageUrl || '',
      contactPersonName: data.contactPersonName || '',
      contactPersonRoleEs: data.contactPersonRoleEs || '',
      contactPersonRoleEn: data.contactPersonRoleEn || '',
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
