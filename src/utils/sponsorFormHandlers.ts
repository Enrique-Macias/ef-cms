import { validateImagesForContentType } from '@/utils/imageValidationUtils'

export interface SponsorFormData {
  name: string
  imageUrl: string | File
  linkUrl: string
}

export const createSponsorFormHandlers = (
  formData: SponsorFormData,
  setFormData: React.Dispatch<React.SetStateAction<SponsorFormData>>,
  toast?: { warning: (message: string) => void }
) => {
  const handleInputChange = (field: keyof SponsorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validation = validateImagesForContentType('team', file, true)
      if (!validation.isValid) {
        toast?.warning(validation.errorMessage || 'Error de validación de imagen')
        return
      }
      setFormData(prev => ({ ...prev, imageUrl: file }))
    } else {
      setFormData(prev => ({ ...prev, imageUrl: '' }))
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      const validation = validateImagesForContentType('team', imageFile, true)
      if (!validation.isValid) {
        toast?.warning(validation.errorMessage || 'Error de validación de imagen')
        return
      }
      setFormData(prev => ({ ...prev, imageUrl: imageFile }))
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

export const validateSponsorForm = (
  formData: SponsorFormData
): { isValid: boolean; errorMessage?: string } => {
  if (!formData.name.trim()) {
    return { isValid: false, errorMessage: 'El nombre del patrocinador es obligatorio' }
  }

  if (!formData.imageUrl) {
    return { isValid: false, errorMessage: 'La imagen del patrocinador es obligatoria' }
  }

  if (formData.linkUrl && !isValidUrl(formData.linkUrl)) {
    return { isValid: false, errorMessage: 'La URL del enlace no es válida' }
  }

  return { isValid: true }
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
