import { EventFormData } from '@/hooks/useEventForm'

export interface ValidationResult {
  isValid: boolean
  missingFields: string[]
  errorMessage?: string
}

export const validateEventForm = (
  formData: EventFormData,
  formDataEnglish: EventFormData,
  isEnglishMode: boolean
): ValidationResult => {
  // Always validate both Spanish and English versions
  const spanishRequiredFields = {
    title: formData.title.trim(),
    author: formData.author.trim(),
    coverImage: formData.coverImage,
    eventDate: formData.eventDate,
    description: formData.description.trim(),
    phrase: formData.phrase.trim(),
    credits: formData.credits.trim(),
    locationCity: formData.locationCity.trim(),
    locationCountry: formData.locationCountry.trim()
  }
  
  const englishRequiredFields = {
    title: formDataEnglish.title.trim(),
    author: formDataEnglish.author.trim(),
    coverImage: formDataEnglish.coverImage,
    eventDate: formDataEnglish.eventDate,
    description: formDataEnglish.description.trim(),
    phrase: formDataEnglish.phrase.trim(),
    credits: formDataEnglish.credits.trim(),
    locationCity: formDataEnglish.locationCity.trim(),
    locationCountry: formDataEnglish.locationCountry.trim()
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
    eventDate: 'Fecha del Evento',
    description: 'Descripción',
    phrase: 'Frase',
    credits: 'Créditos',
    locationCity: 'Ciudad',
    locationCountry: 'País'
  }
  
  const englishFieldNames = {
    title: 'Title',
    author: 'Author',
    coverImage: 'Cover Image',
    eventDate: 'Event Date',
    description: 'Description',
    phrase: 'Phrase',
    credits: 'Credits',
    locationCity: 'City',
    locationCountry: 'Country'
  }
  
  // Check if we're in Spanish mode and Spanish fields are missing
  if (!isEnglishMode && spanishMissingFields.length > 0) {
    const missingFieldNames = spanishMissingFields.map(field => spanishFieldNames[field as keyof typeof spanishFieldNames])
    return {
      isValid: false,
      missingFields: spanishMissingFields,
      errorMessage: `Debes llenar todos los campos obligatorios: ${missingFieldNames.join(', ')}`
    }
  }
  
  // Check if we're in English mode and English fields are missing
  if (isEnglishMode && englishMissingFields.length > 0) {
    const missingFieldNames = englishMissingFields.map(field => englishFieldNames[field as keyof typeof englishFieldNames])
    return {
      isValid: false,
      missingFields: englishMissingFields,
      errorMessage: `You must fill all required fields: ${missingFieldNames.join(', ')}`
    }
  }
  
  // If we're in Spanish mode, also check English fields
  if (!isEnglishMode) {
    if (englishMissingFields.length > 0) {
      const missingFieldNames = englishMissingFields.map(field => englishFieldNames[field as keyof typeof englishFieldNames])
      return {
        isValid: false,
        missingFields: englishMissingFields,
        errorMessage: `También debes llenar todos los campos obligatorios de la versión en inglés: ${missingFieldNames.join(', ')}`
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
        errorMessage: `You must also fill all required fields in the Spanish version: ${missingFieldNames.join(', ')}`
      }
    }
  }
  
  return {
    isValid: true,
    missingFields: []
  }
}
