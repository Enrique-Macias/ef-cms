export interface DeepLTranslationResponse {
  translations: Array<{
    detected_source_language: string
    text: string
  }>
}

export interface DeepLTranslationRequest {
  text: string[]
  target_lang: string
  source_lang?: string
}

export class DeepLService {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.DEEPL_API_KEY || ''
    this.baseUrl = 'https://api-free.deepl.com/v2'
    
    if (!this.apiKey) {
      throw new Error('DeepL API key is not configured')
    }
  }

  async translateText(text: string, targetLang: string = 'EN', sourceLang: string = 'ES'): Promise<string> {
    if (!text.trim()) return ''

    try {
      console.log('DeepL API Key:', this.apiKey ? 'Present' : 'Missing')
      console.log('DeepL Base URL:', this.baseUrl)
      console.log('Text to translate:', text)
      console.log('Target language:', targetLang)
      console.log('Source language:', sourceLang)

      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          target_lang: targetLang,
          source_lang: sourceLang,
        }),
      })

      console.log('DeepL Response Status:', response.status)
      console.log('DeepL Response Headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('DeepL API Error Response:', errorText)
        throw new Error(`DeepL API error: ${response.status} - ${errorText}`)
      }

      const data: DeepLTranslationResponse = await response.json()
      console.log('DeepL Translation Response:', data)
      
      if (data.translations && data.translations.length > 0) {
        return data.translations[0].text
      }
      
      return text
    } catch (error) {
      console.error('DeepL translation error:', error)
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async translateMultipleTexts(texts: string[], targetLang: string = 'EN', sourceLang: string = 'ES'): Promise<string[]> {
    if (texts.length === 0) return []

    try {
      console.log('DeepL Multiple Texts - API Key:', this.apiKey ? 'Present' : 'Missing')
      console.log('DeepL Multiple Texts - Base URL:', this.baseUrl)
      console.log('DeepL Multiple Texts - Texts to translate:', texts)
      console.log('DeepL Multiple Texts - Target language:', targetLang)
      console.log('DeepL Multiple Texts - Source language:', sourceLang)

      const params = new URLSearchParams()
      texts.forEach(text => params.append('text', text))
      params.append('target_lang', targetLang)
      params.append('source_lang', sourceLang)

      console.log('DeepL Multiple Texts - Request body:', params.toString())

      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })

      console.log('DeepL Multiple Texts - Response Status:', response.status)
      console.log('DeepL Multiple Texts - Response Headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('DeepL Multiple Texts - API Error Response:', errorText)
        throw new Error(`DeepL API error: ${response.status} - ${errorText}`)
      }

      const data: DeepLTranslationResponse = await response.json()
      console.log('DeepL Multiple Texts - Translation Response:', data)
      
      if (data.translations && data.translations.length > 0) {
        return data.translations.map(translation => translation.text)
      }
      
      return texts
    } catch (error) {
      console.error('DeepL translation error:', error)
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Create a function to get DeepL service instance
export const getDeepLService = () => {
  return new DeepLService()
}
