import { EventFormData } from '@/hooks/useEventForm'

export const createEventInputHandler = (
  isEnglishMode: boolean,
  setFormData: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void,
  setFormDataEnglish: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void
) => {
  return (field: string, value: string) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['author', 'eventDate', 'locationCity', 'locationCountry']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-sync common fields to English version
      const commonFields = ['author', 'eventDate', 'locationCity', 'locationCountry']
      if (commonFields.includes(field)) {
        setFormDataEnglish(prev => ({ ...prev, [field]: value }))
      }
    }
  }
}

export const createEventImageHandlers = (
  setFormData: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void,
  setFormDataEnglish: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void
) => {
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Update both Spanish and English forms to keep images synchronized
      setFormData(prev => ({ ...prev, coverImage: file }))
      setFormDataEnglish(prev => ({ ...prev, coverImage: file }))
    }
  }

  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      // Update both Spanish and English forms to keep images synchronized
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
      setFormDataEnglish(prev => ({ ...prev, images: [...prev.images, ...files] }))
    }
  }

  return {
    handleCoverImageUpload,
    handleImagesUpload
  }
}

export const createEventDragHandlers = (
  setIsDragOver: (value: boolean) => void,
  setIsCoverDragOver: (value: boolean) => void,
  setFormData: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void,
  setFormDataEnglish: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void
) => {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      // Update both Spanish and English forms to keep images synchronized
      setFormData(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
      setFormDataEnglish(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
    }
  }

  const handleCoverDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(true)
  }

  const handleCoverDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(false)
  }

  const handleCoverDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      // Update both Spanish and English forms to keep images synchronized
      setFormData(prev => ({ ...prev, coverImage: imageFile }))
      setFormDataEnglish(prev => ({ ...prev, coverImage: imageFile }))
    }
  }

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCoverDragOver,
    handleCoverDragLeave,
    handleCoverDrop
  }
}

export const createEventLanguageToggleHandler = (
  isEnglishMode: boolean,
  setIsEnglishMode: (value: boolean) => void,
  formData: EventFormData,
  formDataEnglish: EventFormData,
  setFormData: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void,
  setFormDataEnglish: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void
) => {
  return async () => {
    const newEnglishMode = !isEnglishMode
    
    if (newEnglishMode) {
      // Switching to English mode - copy images from Spanish to English
      setFormDataEnglish(prev => ({
        ...prev,
        coverImage: formData.coverImage,
        images: formData.images
      }))
    } else {
      // Switching to Spanish mode - copy images from English to Spanish
      setFormData(prev => ({
        ...prev,
        coverImage: formDataEnglish.coverImage,
        images: formDataEnglish.images
      }))
    }
    
    setIsEnglishMode(newEnglishMode)
  }
}
