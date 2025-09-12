import { ArticleFormData } from '@/hooks/useArticleForm'
import { validateImagesForContentType } from '@/utils/imageValidationUtils'

export const createArticleFormHandlers = (
  formData: ArticleFormData,
  setFormData: React.Dispatch<React.SetStateAction<ArticleFormData>>,
  formDataEnglish: ArticleFormData,
  setFormDataEnglish: React.Dispatch<React.SetStateAction<ArticleFormData>>,
  isEnglishMode: boolean,
  toast?: { warning: (message: string) => void }
) => {
  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['author', 'date', 'image', 'linkUrl']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-sync common fields to English version
      const commonFields = ['author', 'date', 'image', 'linkUrl']
      if (commonFields.includes(field)) {
        setFormDataEnglish(prev => ({ ...prev, [field]: value }))
      }
    }
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate image
      const validation = validateImagesForContentType('articles', file, true)
      if (!validation.isValid) {
        toast?.warning(validation.errorMessage || 'Error de validación de imagen')
        return
      }
      
      // Always update both Spanish and English versions with the same image
      setFormData(prev => ({ ...prev, image: file }))
      setFormDataEnglish(prev => ({ ...prev, image: file }))
    }
  }

  // Handle drag and drop for image
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
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      // Validate image
      const validation = validateImagesForContentType('articles', imageFile, true)
      if (!validation.isValid) {
        toast?.warning(validation.errorMessage || 'Error de validación de imagen')
        return
      }
      
      // Always update both Spanish and English versions with the same image
      setFormData(prev => ({ ...prev, image: imageFile }))
      setFormDataEnglish(prev => ({ ...prev, image: imageFile }))
    }
  }

  return {
    handleInputChange,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  }
}
