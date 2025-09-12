import { useState, useCallback, useRef } from 'react'
import { useToast } from './useToast'

export const useTeamTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCompleted, setTranslationCompleted] = useState(false)
  const translationInProgress = useRef(false)
  const toast = useToast()

  const translateRoleToEnglish = useCallback(async (role: string) => {
    if (isTranslating || translationInProgress.current || !role.trim()) return ''

    translationInProgress.current = true
    setIsTranslating(true)
    setTranslationCompleted(false)
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: [role.trim()],
          targetLang: 'EN',
          sourceLang: 'ES'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Translation failed')
      }

      const data = await response.json()
      const translations = data.translations

      if (translations && translations.length > 0) {
        setTranslationCompleted(true)
        toast.success('Traducción completada exitosamente')
        return translations[0]
      } else {
        throw new Error('No translations received')
      }
    } catch (error) {
      console.error('Translation error:', error)
      toast.error(`Error en la traducción: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return ''
    } finally {
      setIsTranslating(false)
      translationInProgress.current = false
    }
  }, [isTranslating, toast])

  return {
    isTranslating,
    translationCompleted,
    translateRoleToEnglish,
    setTranslationCompleted
  }
}
