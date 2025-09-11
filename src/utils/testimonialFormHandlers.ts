import { TestimonialFormData, TestimonialFormDataEnglish } from '@/hooks/useTestimonialForm'

export function createTestimonialInputHandler(
  isEnglishMode: boolean,
  setFormData: (updater: (prev: TestimonialFormData) => TestimonialFormData) => void,
  setFormDataEnglish: (updater: (prev: TestimonialFormDataEnglish) => TestimonialFormDataEnglish) => void
) {
  return (field: string, value: string) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['author']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-sync common fields to English version
      const commonFields = ['author']
      if (commonFields.includes(field)) {
        setFormDataEnglish(prev => ({ ...prev, [field]: value }))
      }
    }
  }
}

export function createTestimonialImageHandlers(
  setFormData: (updater: (prev: TestimonialFormData) => TestimonialFormData) => void,
  setFormDataEnglish: (updater: (prev: TestimonialFormDataEnglish) => TestimonialFormDataEnglish) => void
) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Update both Spanish and English forms to keep images synchronized
      setFormData(prev => ({ ...prev, image: file }))
      setFormDataEnglish(prev => ({ ...prev, image: file }))
    }
  }

  return { handleImageUpload }
}

export function createTestimonialDragHandlers(
  setIsDragOver: (value: boolean) => void,
  setFormData: (updater: (prev: TestimonialFormData) => TestimonialFormData) => void,
  setFormDataEnglish: (updater: (prev: TestimonialFormDataEnglish) => TestimonialFormDataEnglish) => void
) {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) {
      const imageFile = files[0]
      if (imageFile.type.startsWith('image/')) {
        // Update both Spanish and English forms to keep images synchronized
        setFormData(prev => ({ ...prev, image: imageFile }))
        setFormDataEnglish(prev => ({ ...prev, image: imageFile }))
      }
    }
  }

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop
  }
}

export function createTestimonialLanguageToggleHandler(
  isEnglishMode: boolean,
  setIsEnglishMode: (value: boolean) => void,
  formData: TestimonialFormData,
  formDataEnglish: TestimonialFormDataEnglish,
  setFormData: (updater: (prev: TestimonialFormData) => TestimonialFormData) => void,
  setFormDataEnglish: (updater: (prev: TestimonialFormDataEnglish) => TestimonialFormDataEnglish) => void
) {
  return () => {
    const newEnglishMode = !isEnglishMode
    
    if (newEnglishMode) {
      // Switching to English mode - copy image from Spanish to English
      setFormDataEnglish(prev => ({
        ...prev,
        image: formData.image
      }))
    } else {
      // Switching to Spanish mode - copy image from English to Spanish
      setFormData(prev => ({
        ...prev,
        image: formDataEnglish.image
      }))
    }
    
    setIsEnglishMode(newEnglishMode)
  }
}
