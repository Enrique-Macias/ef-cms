import { EventFormData } from '@/hooks/useEventForm'

export const createEventCategoryHandlers = (
  isEnglishMode: boolean,
  formData: EventFormData,
  formDataEnglish: EventFormData,
  setFormData: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void,
  setFormDataEnglish: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void,
  newCategory: string,
  newCategoryEnglish: string,
  setNewCategory: (value: string) => void,
  setNewCategoryEnglish: (value: string) => void
) => {
  const addCategory = () => {
    if (isEnglishMode) {
      if (newCategoryEnglish.trim() && !formDataEnglish.categories.includes(newCategoryEnglish.trim())) {
        setFormDataEnglish(prev => ({ ...prev, categories: [...prev.categories, newCategoryEnglish.trim()] }))
        setNewCategoryEnglish('')
      }
    } else {
      if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
        setFormData(prev => ({ ...prev, categories: [...prev.categories, newCategory.trim()] }))
        setNewCategory('')
      }
    }
  }

  const removeCategory = (category: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
    } else {
      setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
    }
  }

  return {
    addCategory,
    removeCategory
  }
}

export const createEventTagHandlers = (
  isEnglishMode: boolean,
  formData: EventFormData,
  formDataEnglish: EventFormData,
  setFormData: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void,
  setFormDataEnglish: (data: EventFormData | ((prev: EventFormData) => EventFormData)) => void,
  newTag: string,
  newTagEnglish: string,
  setNewTag: (value: string) => void,
  setNewTagEnglish: (value: string) => void
) => {
  const addTag = () => {
    if (isEnglishMode) {
      if (newTagEnglish.trim() && !formDataEnglish.tags.includes(newTagEnglish.trim())) {
        setFormDataEnglish(prev => ({ ...prev, tags: [...prev.tags, newTagEnglish.trim()] }))
        setNewTagEnglish('')
      }
    } else {
      if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
        setNewTag('')
      }
    }
  }

  const removeTag = (tag: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    } else {
      setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    }
  }

  return {
    addTag,
    removeTag
  }
}
