import { useState } from 'react'

export interface TestimonialFormData {
  author: string
  role: string
  role_en: string
  body: string
  image: File | null
}

export interface TestimonialFormDataEnglish {
  author: string
  role: string
  role_en: string
  body: string
  image: File | null
}

export function useTestimonialForm() {
  const [formData, setFormData] = useState<TestimonialFormData>({
    author: '',
    role: '',
    role_en: '',
    body: '',
    image: null
  })

  const [formDataEnglish, setFormDataEnglish] = useState<TestimonialFormDataEnglish>({
    author: '',
    role: '',
    role_en: '',
    body: '',
    image: null
  })

  const [isEnglishMode, setIsEnglishMode] = useState(false)

  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData

  return {
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    isEnglishMode,
    setIsEnglishMode,
    getCurrentFormData
  }
}
