import { useState, useCallback, useRef } from 'react'
import { TestimonialFormData, TestimonialFormDataEnglish } from './useTestimonialForm'

export function useTestimonialTranslation() {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCompleted, setTranslationCompleted] = useState(false)
  const translationInProgress = useRef(false)

  const translateToEnglish = useCallback(async (
    formData: TestimonialFormData,
    setFormDataEnglish: (updater: (prev: TestimonialFormDataEnglish) => TestimonialFormDataEnglish) => void
  ) => {
    // Prevent multiple simultaneous translations
    if (translationInProgress.current) {
      console.log('Translation already in progress, skipping...')
      return
    }

    translationInProgress.current = true
    setIsTranslating(true)
    setTranslationCompleted(false)

    try {
      // Prepare texts to translate
      const textsToTranslate = [
        formData.author,
        formData.role,
        formData.body
      ].filter(text => text.trim() !== '')

      if (textsToTranslate.length === 0) {
        console.log('No texts to translate')
        setTranslationCompleted(true)
        return
      }

      console.log('Texts to translate:', textsToTranslate)

      // Call translation API
      console.log('Calling translation API...')
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textsToTranslate,
          targetLang: 'EN'
        }),
      })

      console.log('Translation response status:', response.status)

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('Translation response data:', data)

      // Update English form data with translations
      const translations = data.translations || []
      
      const newEnglishData: TestimonialFormDataEnglish = {
        author: translations[0] || formData.author,
        role: formData.role, // Keep Spanish role
        role_en: translations[1] || formData.role, // Translated role
        body: translations[2] || formData.body,
        image: formData.image // Keep the same image
      }

      console.log('Updated English form data:', newEnglishData)
      
      // Use direct state update to prevent overwrites
      setFormDataEnglish(() => newEnglishData)
      
      setTranslationCompleted(true)
    } catch (error) {
      console.error('Translation error:', error)
      // Don't show error to user, just complete translation
      setTranslationCompleted(true)
    } finally {
      setIsTranslating(false)
      translationInProgress.current = false
    }
  }, [])

  return {
    isTranslating,
    translationCompleted,
    setTranslationCompleted,
    translateToEnglish
  }
}
