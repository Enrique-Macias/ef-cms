import { NewsFormData } from '@/hooks/useNewsForm'

export const createFormHandlers = (
  formData: NewsFormData,
  setFormData: React.Dispatch<React.SetStateAction<NewsFormData>>,
  formDataEnglish: NewsFormData,
  setFormDataEnglish: React.Dispatch<React.SetStateAction<NewsFormData>>,
  isEnglishMode: boolean
) => {
  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['author', 'publicationDate', 'location_city', 'location_country']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      
      // Don't overwrite translated data with empty or undefined values
      if ((value === '' || value === undefined || value === null) && (field === 'title' || field === 'description')) {
        console.log('Preventing overwrite of translated data for field:', field, 'value:', value)
        return
      }
      
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-sync common fields to English version
      const commonFields = ['author', 'publicationDate', 'location_city', 'location_country']
      if (commonFields.includes(field)) {
        setFormDataEnglish(prev => ({ ...prev, [field]: value }))
      }
    }
  }

  // Handle cover image upload
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Always update both Spanish and English versions with the same image
      setFormData(prev => ({ ...prev, coverImage: file }))
      setFormDataEnglish(prev => ({ ...prev, coverImage: file }))
    }
  }

  // Handle multiple images upload
  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      // Always update both Spanish and English versions with the same images
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
      setFormDataEnglish(prev => ({ ...prev, images: [...prev.images, ...files] }))
    }
  }

  // Handle drag and drop for multiple images
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      // Always update both Spanish and English versions with the same images
      setFormData(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
      setFormDataEnglish(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
    }
  }

  // Handle drag and drop for cover image
  const handleCoverDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleCoverDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleCoverDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    const files = Array.from(event.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      // Always update both Spanish and English versions with the same image
      setFormData(prev => ({ ...prev, coverImage: imageFile }))
      setFormDataEnglish(prev => ({ ...prev, coverImage: imageFile }))
    }
  }

  return {
    handleInputChange,
    handleCoverImageUpload,
    handleImagesUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCoverDragOver,
    handleCoverDragLeave,
    handleCoverDrop
  }
}
