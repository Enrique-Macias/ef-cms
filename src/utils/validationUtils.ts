import { NewsFormData } from '@/hooks/useNewsForm'

export interface ValidationResult {
  isValid: boolean
  missingFields: string[]
  message?: string
}

export const validateNewsForm = (
  formData: NewsFormData,
  formDataEnglish: NewsFormData,
  isEnglishMode: boolean
): ValidationResult => {
  // Always validate both Spanish and English versions
  const spanishRequiredFields = {
    title: formData.title.trim(),
    author: formData.author.trim(),
    coverImage: formData.coverImage,
    publicationDate: formData.publicationDate,
    description: formData.description.trim()
  }
  
  const englishRequiredFields = {
    title: formDataEnglish.title.trim(),
    author: formDataEnglish.author.trim(),
    coverImage: formDataEnglish.coverImage,
    publicationDate: formDataEnglish.publicationDate,
    description: formDataEnglish.description.trim()
  }
  
  const spanishMissingFields = Object.entries(spanishRequiredFields)
    .filter(([, value]) => !value)
    .map(([key]) => key)
  
  const englishMissingFields = Object.entries(englishRequiredFields)
    .filter(([, value]) => !value)
    .map(([key]) => key)
  
  // Field names for both languages
  const spanishFieldNames = {
    title: 'Título',
    author: 'Autor',
    coverImage: 'Portada',
    publicationDate: 'Fecha de publicación',
    description: 'Descripción'
  }
  
  const englishFieldNames = {
    title: 'Title',
    author: 'Author',
    coverImage: 'Cover Image',
    publicationDate: 'Publication Date',
    description: 'Description'
  }
  
  // Check if we're in Spanish mode and Spanish fields are missing
  if (!isEnglishMode && spanishMissingFields.length > 0) {
    const missingFieldNames = spanishMissingFields.map(field => spanishFieldNames[field as keyof typeof spanishFieldNames])
    return {
      isValid: false,
      missingFields: spanishMissingFields,
      message: `Debes llenar todos los campos obligatorios: ${missingFieldNames.join(', ')}`
    }
  }
  
  // Check if we're in English mode and English fields are missing
  if (isEnglishMode && englishMissingFields.length > 0) {
    const missingFieldNames = englishMissingFields.map(field => englishFieldNames[field as keyof typeof englishFieldNames])
    return {
      isValid: false,
      missingFields: englishMissingFields,
      message: `You must fill all required fields: ${missingFieldNames.join(', ')}`
    }
  }
  
  // If we're in Spanish mode, also check English fields
  if (!isEnglishMode) {
    if (englishMissingFields.length > 0) {
      const missingFieldNames = englishMissingFields.map(field => englishFieldNames[field as keyof typeof englishFieldNames])
      return {
        isValid: false,
        missingFields: englishMissingFields,
        message: `También debes llenar todos los campos obligatorios de la versión en inglés: ${missingFieldNames.join(', ')}`
      }
    }
  }
  
  // If we're in English mode, also check Spanish fields
  if (isEnglishMode) {
    if (spanishMissingFields.length > 0) {
      const missingFieldNames = spanishMissingFields.map(field => spanishFieldNames[field as keyof typeof spanishFieldNames])
      return {
        isValid: false,
        missingFields: spanishMissingFields,
        message: `You must also fill all required fields in the Spanish version: ${missingFieldNames.join(', ')}`
      }
    }
  }
  
  return {
    isValid: true,
    missingFields: []
  }
}
