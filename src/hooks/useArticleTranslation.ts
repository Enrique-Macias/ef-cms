import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/useToast';

export const useArticleTranslation = () => {
  const toast = useToast();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCompleted, setTranslationCompleted] = useState(false);
  const translationInProgress = useRef(false);

  const translateToEnglish = useCallback(async (spanishTexts: { title: string; body: string }): Promise<{ title: string; body: string } | null> => {
    if (isTranslating || translationInProgress.current) return null;

    translationInProgress.current = true;
    setIsTranslating(true);
    setTranslationCompleted(false);

    try {
      if (!spanishTexts.title.trim() && !spanishTexts.body.trim()) {
        toast.warning('No hay contenido en español para traducir');
        return null;
      }

      const textsToTranslate = [];
      if (spanishTexts.title.trim()) textsToTranslate.push(spanishTexts.title);
      if (spanishTexts.body.trim()) textsToTranslate.push(spanishTexts.body);

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
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Translation failed');
      }

      const data = await response.json();
      const translations = data.translations || [];

      if (translations.length === 0) {
        console.error('No translations received');
        toast.error('No se recibieron traducciones');
        return null;
      }

      const result = {
        title: spanishTexts.title.trim() ? translations[0] : '',
        body: spanishTexts.body.trim() ? translations[spanishTexts.title.trim() ? 1 : 0] : ''
      };

      setTranslationCompleted(true);
      toast.success('Traducción completada exitosamente');
      return result;
    } catch (error: unknown) {
      console.error('Translation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Error en la traducción: ${errorMessage}`);
      return null;
    } finally {
      setIsTranslating(false);
      translationInProgress.current = false;
    }
  }, [isTranslating, toast]);

  return {
    isTranslating,
    translationCompleted,
    setTranslationCompleted,
    translateToEnglish
  };
};
