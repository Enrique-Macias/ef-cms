import { useState, useCallback } from 'react'

export function useContactPersonTranslation() {
  const [isTranslating, setIsTranslating] = useState(false)

  const translateRoleToEnglish = useCallback(async (roleEs: string): Promise<string> => {
    if (!roleEs.trim()) return ''

    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: roleEs,
          targetLang: 'EN'
        }),
      })

      if (!response.ok) {
        throw new Error('Translation failed')
      }

      const data = await response.json()
      return data.translation || ''
    } catch (error) {
      console.error('Error translating role:', error)
      return ''
    } finally {
      setIsTranslating(false)
    }
  }, [])

  return {
    isTranslating,
    translateRoleToEnglish,
  }
}
