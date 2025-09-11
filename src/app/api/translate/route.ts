import { NextRequest, NextResponse } from 'next/server'
import { getDeepLService } from '@/lib/deepl'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, targetLang = 'EN', sourceLang = 'ES' } = body

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Create DeepL service instance
    const deeplService = getDeepLService()
    
    // Handle both single text and array of texts
    if (Array.isArray(text)) {
      const translations = await deeplService.translateMultipleTexts(text, targetLang, sourceLang)
      return NextResponse.json({ translations })
    } else {
      const translation = await deeplService.translateText(text, targetLang, sourceLang)
      return NextResponse.json({ translation })
    }
  } catch (error: any) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    )
  }
}
