import { useState, useMemo } from 'react'

export interface EventFormData {
  title: string
  author: string
  coverImage: File | null
  eventDate: string
  description: string
  images: File[]
  categories: string[]
  tags: string[]
  phrase: string
  credits: string
  locationCity: string
  locationCountry: string
}

export function useEventForm() {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    author: '',
    coverImage: null,
    eventDate: new Date().toISOString().split('T')[0],
    description: '',
    images: [],
    categories: [],
    tags: [],
    phrase: '',
    credits: '',
    locationCity: '',
    locationCountry: ''
  })

  const [formDataEnglish, setFormDataEnglish] = useState<EventFormData>({
    title: '',
    author: '',
    coverImage: null,
    eventDate: new Date().toISOString().split('T')[0],
    description: '',
    images: [],
    categories: [],
    tags: [],
    phrase: '',
    credits: '',
    locationCity: '',
    locationCountry: ''
  })

  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newCategoryEnglish, setNewCategoryEnglish] = useState('')
  const [newTagEnglish, setNewTagEnglish] = useState('')

  // Computed values
  const getCurrentFormData = useMemo(() => {
    return isEnglishMode ? formDataEnglish : formData
  }, [isEnglishMode, formData, formDataEnglish])

  const getCurrentNewCategory = useMemo(() => {
    return isEnglishMode ? newCategoryEnglish : newCategory
  }, [isEnglishMode, newCategoryEnglish, newCategory])

  const getCurrentNewTag = useMemo(() => {
    return isEnglishMode ? newTagEnglish : newTag
  }, [isEnglishMode, newTagEnglish, newTag])

  const setCurrentNewCategory = (value: string) => {
    if (isEnglishMode) {
      setNewCategoryEnglish(value)
    } else {
      setNewCategory(value)
    }
  }

  const setCurrentNewTag = (value: string) => {
    if (isEnglishMode) {
      setNewTagEnglish(value)
    } else {
      setNewTag(value)
    }
  }

  return {
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    isEnglishMode,
    setIsEnglishMode,
    newCategory,
    setNewCategory,
    newTag,
    setNewTag,
    newCategoryEnglish,
    setNewCategoryEnglish,
    newTagEnglish,
    setNewTagEnglish,
    getCurrentFormData,
    getCurrentNewCategory,
    getCurrentNewTag,
    setCurrentNewCategory,
    setCurrentNewTag
  }
}
