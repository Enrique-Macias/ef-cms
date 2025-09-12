import { useState, useCallback } from 'react';

export interface ArticleFormData {
  title: string;
  body_es: string;
  author: string;
  date: string;
  linkUrl: string;
  image: File | null;
}

export const useArticleForm = () => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    body_es: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    linkUrl: '',
    image: null
  });

  const [formDataEnglish, setFormDataEnglish] = useState<ArticleFormData>({
    title: '',
    body_es: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    linkUrl: '',
    image: null
  });

  const handleInputChange = useCallback((field: keyof ArticleFormData, value: string, isEnglishMode: boolean) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['author', 'date', 'image', 'linkUrl']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      setFormDataEnglish(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Auto-sync common fields to English version
      const commonFields = ['author', 'date', 'image', 'linkUrl']
      if (commonFields.includes(field)) {
        setFormDataEnglish(prev => ({ ...prev, [field]: value }));
      }
    }
  }, []);

  const handleImageUpload = useCallback((file: File | null, isEnglishMode: boolean) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, image: file }));
    } else {
      setFormData(prev => ({ ...prev, image: file }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      body_es: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      linkUrl: '',
      image: null
    });
    setFormDataEnglish({
      title: '',
      body_es: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      linkUrl: '',
      image: null
    });
  }, []);

  return {
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    handleInputChange,
    handleImageUpload,
    resetForm
  };
};
