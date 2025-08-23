interface TranslationOptions {
  text: string;
  sourceLang?: 'ES' | 'EN';
  targetLang?: 'ES' | 'EN';
  formality?: 'more' | 'less' | 'prefer_more' | 'prefer_less';
  preserveFormatting?: boolean;
}

interface DeepLResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

const DEEPL_API_BASE = 'https://api-free.deepl.com/v2/translate';

/**
 * Translate text using DeepL API
 * @param options Translation options
 * @returns Translated text
 */
export async function translateText(options: TranslationOptions): Promise<string> {
  const {
    text,
    sourceLang = 'ES',
    targetLang = 'EN',
    formality = 'default',
    preserveFormatting = true
  } = options;

  if (!process.env.DEEPL_API_KEY) {
    throw new Error('DeepL API key not configured');
  }

  try {
    const params = new URLSearchParams({
      auth_key: process.env.DEEPL_API_KEY,
      text: text,
      source_lang: sourceLang,
      target_lang: targetLang,
      preserve_formatting: preserveFormatting ? '1' : '0'
    });

    if (formality !== 'default') {
      params.append('formality', formality);
    }

    const response = await fetch(`${DEEPL_API_BASE}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status}`);
    }

    const data: DeepLResponse = await response.json();
    return data.translations[0]?.text || text;
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text if translation fails
    return text;
  }
}

/**
 * Translate content from Spanish to English
 * @param spanishText Spanish text to translate
 * @returns English translation
 */
export async function translateToEnglish(spanishText: string): Promise<string> {
  return translateText({
    text: spanishText,
    sourceLang: 'ES',
    targetLang: 'EN'
  });
}

/**
 * Translate content from English to Spanish
 * @param englishText English text to translate
 * @returns Spanish translation
 */
export async function translateToSpanish(englishText: string): Promise<string> {
  return translateText({
    text: englishText,
    sourceLang: 'EN',
    targetLang: 'ES'
  });
}

/**
 * Auto-detect language and translate to target language
 * @param text Text to translate
 * @param targetLang Target language (ES or EN)
 * @returns Translated text
 */
export async function autoTranslate(
  text: string, 
  targetLang: 'ES' | 'EN'
): Promise<string> {
  return translateText({
    text,
    targetLang,
    // Let DeepL auto-detect source language
  });
}

/**
 * Batch translate multiple texts
 * @param texts Array of texts to translate
 * @param sourceLang Source language
 * @param targetLang Target language
 * @returns Array of translated texts
 */
export async function batchTranslate(
  texts: string[],
  sourceLang: 'ES' | 'EN',
  targetLang: 'ES' | 'EN'
): Promise<string[]> {
  const translations = await Promise.all(
    texts.map(text => 
      translateText({ text, sourceLang, targetLang })
    )
  );
  
  return translations;
}

/**
 * Translate content object with multiple fields
 * @param content Object with text fields to translate
 * @param sourceLang Source language
 * @param targetLang Target language
 * @returns Object with translated fields
 */
export async function translateContent<T extends Record<string, string>>(
  content: T,
  sourceLang: 'ES' | 'EN',
  targetLang: 'ES' | 'EN'
): Promise<T> {
  const translatedContent = { ...content };
  
  for (const [key, value] of Object.entries(content)) {
    if (typeof value === 'string' && value.trim()) {
      translatedContent[key] = await translateText({
        text: value,
        sourceLang,
        targetLang
      });
    }
  }
  
  return translatedContent;
}

/**
 * Check if DeepL API is available
 * @returns True if API key is configured
 */
export function isTranslationAvailable(): boolean {
  return !!process.env.DEEPL_API_KEY;
}
