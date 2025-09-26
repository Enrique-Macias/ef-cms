import { useState, useCallback, useMemo } from 'react'

export interface FundadorFormData {
  name: string
  role_es: string
  body_es: string
  facebookUrl: string
  instagramUrl: string
  image: File | null
}

export const useFundadorForm = () => {
  const [formData, setFormData] = useState<FundadorFormData>({
    name: '',
    role_es: '',
    body_es: '',
    facebookUrl: '',
    instagramUrl: '',
    image: null
  })
  
  const [formDataEnglish, setFormDataEnglish] = useState<FundadorFormData>({
    name: '',
    role_es: '',
    body_es: '',
    facebookUrl: '',
    instagramUrl: '',
    image: null
  })

  const [isEnglishMode, setIsEnglishMode] = useState(false)

  // Computed values
  const getCurrentFormData = useMemo(() => {
    return isEnglishMode ? formDataEnglish : formData
  }, [isEnglishMode, formData, formDataEnglish])

  const handleInputChange = useCallback((field: keyof FundadorFormData, value: string, isEnglishMode: boolean) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['name', 'facebookUrl', 'instagramUrl', 'image']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-sync common fields to English version
      const commonFields = ['name', 'facebookUrl', 'instagramUrl', 'image']
      if (commonFields.includes(field)) {
        setFormDataEnglish(prev => ({ ...prev, [field]: value }))
      }
    }
  }, [])

  const handleImageUpload = useCallback((file: File | null, isEnglishMode: boolean) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, image: file }))
    } else {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      role_es: '',
      body_es: '',
      facebookUrl: '',
      instagramUrl: '',
      image: null
    })
    setFormDataEnglish({
      name: '',
      role_es: '',
      body_es: '',
      facebookUrl: '',
      instagramUrl: '',
      image: null
    })
  }, [])

  return {
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    isEnglishMode,
    setIsEnglishMode,
    getCurrentFormData,
    handleInputChange,
    handleImageUpload,
    resetForm
  }
}
