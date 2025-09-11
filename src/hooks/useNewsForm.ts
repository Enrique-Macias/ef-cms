import { useState, useMemo } from 'react'

export interface NewsFormData {
  title: string
  author: string
  coverImage: File | null
  publicationDate: string
  description: string
  images: File[]
  categories: string[]
  tags: string[]
  location_city: string
  location_country: string
}

export const useNewsForm = () => {
  const [formData, setFormData] = useState<NewsFormData>({
    title: '',
    author: '',
    coverImage: null,
    publicationDate: new Date().toISOString().split('T')[0],
    description: '',
    images: [],
    categories: [],
    tags: [],
    location_city: '',
    location_country: ''
  })

  const [formDataEnglish, setFormDataEnglish] = useState<NewsFormData>({
    title: '',
    author: '',
    coverImage: null,
    publicationDate: new Date().toISOString().split('T')[0],
    description: '',
    images: [],
    categories: [],
    tags: [],
    location_city: '',
    location_country: ''
  })

  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newCategoryEnglish, setNewCategoryEnglish] = useState('')
  const [newTagEnglish, setNewTagEnglish] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isCoverDragOver, setIsCoverDragOver] = useState(false)

  // Get current form data based on language mode (memoized to prevent excessive re-renders)
  const getCurrentFormData = useMemo(() => {
    const currentData = isEnglishMode ? formDataEnglish : formData
    
    if (isEnglishMode) {
      // For English mode, only show translated data if translation is completed
      return {
        ...currentData,
        title: currentData.title || '',
        description: currentData.description || '',
        categories: currentData.categories || [],
        tags: currentData.tags || [],
        location_city: currentData.location_city || '',
        location_country: currentData.location_country || '',
        publicationDate: currentData.publicationDate || new Date().toISOString().split('T')[0],
        author: currentData.author || ''
      }
    } else {
      // For Spanish mode, use the normal logic
      return {
        ...currentData,
        title: currentData.title || '',
        description: currentData.description || '',
        categories: currentData.categories || [],
        tags: currentData.tags || [],
        location_city: currentData.location_city || '',
        location_country: currentData.location_country || '',
        publicationDate: currentData.publicationDate || new Date().toISOString().split('T')[0],
        author: currentData.author || ''
      }
    }
  }, [isEnglishMode, formData, formDataEnglish])

  const getCurrentNewCategory = () => isEnglishMode ? newCategoryEnglish : newCategory
  const getCurrentNewTag = () => isEnglishMode ? newTagEnglish : newTag
  const setCurrentNewCategory = (value: string) => isEnglishMode ? setNewCategoryEnglish(value) : setNewCategory(value)
  const setCurrentNewTag = (value: string) => isEnglishMode ? setNewTagEnglish(value) : setNewTag(value)

  return {
    // Form data
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    
    // Language mode
    isEnglishMode,
    setIsEnglishMode,
    
    // Input states
    newCategory,
    setNewCategory,
    newTag,
    setNewTag,
    newCategoryEnglish,
    setNewCategoryEnglish,
    newTagEnglish,
    setNewTagEnglish,
    
    // UI states
    isPublishing,
    setIsPublishing,
    isDragOver,
    setIsDragOver,
    isCoverDragOver,
    setIsCoverDragOver,
    
    // Computed values
    getCurrentFormData,
    getCurrentNewCategory,
    getCurrentNewTag,
    setCurrentNewCategory,
    setCurrentNewTag
  }
}
