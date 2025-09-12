import { useState, useCallback } from 'react'

export interface TeamFormData {
  name: string
  role: string
  instagram_url: string
  facebook_url: string
  x_url: string
  image: File | null
}

export interface TeamFormDataEnglish {
  name: string
  role: string
  instagram_url: string
  facebook_url: string
  x_url: string
  image: File | null
}

export const useTeamForm = () => {
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    role: '',
    instagram_url: '',
    facebook_url: '',
    x_url: '',
    image: null
  })
  
  const [formDataEnglish, setFormDataEnglish] = useState<TeamFormDataEnglish>({
    name: '',
    role: '',
    instagram_url: '',
    facebook_url: '',
    x_url: '',
    image: null
  })

  const handleInputChange = useCallback((field: keyof TeamFormData, value: string, isEnglishMode: boolean) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['name', 'instagram_url', 'facebook_url', 'x_url', 'image']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-sync common fields to English version
      const commonFields = ['name', 'instagram_url', 'facebook_url', 'x_url', 'image']
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
      role: '',
      instagram_url: '',
      facebook_url: '',
      x_url: '',
      image: null
    })
    setFormDataEnglish({
      name: '',
      role: '',
      instagram_url: '',
      facebook_url: '',
      x_url: '',
      image: null
    })
  }, [])

  return {
    formData,
    formDataEnglish,
    setFormData,
    setFormDataEnglish,
    handleInputChange,
    handleImageUpload,
    resetForm
  }
}
