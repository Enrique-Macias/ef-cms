import { useState, useCallback, useRef } from 'react'
import { useToast } from './useToast'
import { FundadorFormData } from './useFundadorForm'

export const useFundadorTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCompleted, setTranslationCompleted] = useState(false)
  const translationInProgress = useRef(false)
  const toast = useToast()

  // Translate Spanish content to English using DeepL
  const translateToEnglish = useCallback(async (
    formData: FundadorFormData,
    setFormDataEnglish: React.Dispatch<React.SetStateAction<FundadorFormData>>
  ) => {
    if (isTranslating || translationInProgress.current) return

    translationInProgress.current = true
    setIsTranslating(true)
    setTranslationCompleted(false)
    
    try {
      // Capture current formData values at the time of translation
      const currentFormData = formData
      
      // Prepare texts to translate - ensure we have valid strings
      const textsToTranslate = [
        currentFormData.role_es || '',
        currentFormData.body_es || ''
      ].filter(text => text && text.trim())

      console.log('Texts to translate:', textsToTranslate)

      if (textsToTranslate.length === 0) {
        toast.warning('No hay contenido en español para traducir')
        setIsTranslating(false)
        return
      }

      console.log('Calling translation API...')
      
      // Translate all texts at once
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textsToTranslate,
          targetLang: 'EN',
          sourceLang: 'ES'
        })
      })

      console.log('Translation response status:', response.status)

      if (!response.ok) {
        const error = await response.json()
        console.error('Translation API error:', error)
        throw new Error(error.error || 'Translation failed')
      }

      const data = await response.json()
      console.log('Translation response data:', data)
      
      const translations = data.translations

      if (translations && translations.length > 0) {
        let translationIndex = 0

        // Prepare the new English form data with translations
        const newEnglishData = {
          ...formData, // Use current formData state
          // Map role_es
          role_es: currentFormData.role_es && currentFormData.role_es.trim() ? translations[translationIndex++] : '',
          // Map body_es
          body_es: currentFormData.body_es && currentFormData.body_es.trim() ? translations[translationIndex++] : ''
        }

        console.log('Prepared new English form data:', newEnglishData)

        // Update English form data with translations in a single call
        setFormDataEnglish(newEnglishData)

        // Mark translation as completed
        setTranslationCompleted(true)
        toast.success('Traducción completada exitosamente')
      } else {
        console.error('No translations received')
        toast.error('No se recibieron traducciones')
      }
    } catch (error: unknown) {
      console.error('Translation error:', error)
      toast.error(`Error en la traducción: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsTranslating(false)
      translationInProgress.current = false
    }
  }, [isTranslating, toast])

  return {
    isTranslating,
    translationCompleted,
    setTranslationCompleted,
    translateToEnglish
  }
}
