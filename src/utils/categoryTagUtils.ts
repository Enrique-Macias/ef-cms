import { NewsFormData } from '@/hooks/useNewsForm'

export const createCategoryTagHandlers = (
  formData: NewsFormData,
  setFormData: React.Dispatch<React.SetStateAction<NewsFormData>>,
  formDataEnglish: NewsFormData,
  setFormDataEnglish: React.Dispatch<React.SetStateAction<NewsFormData>>,
  isEnglishMode: boolean,
  newCategory: string,
  setNewCategory: React.Dispatch<React.SetStateAction<string>>,
  newTag: string,
  setNewTag: React.Dispatch<React.SetStateAction<string>>,
  newCategoryEnglish: string,
  setNewCategoryEnglish: React.Dispatch<React.SetStateAction<string>>,
  newTagEnglish: string,
  setNewTagEnglish: React.Dispatch<React.SetStateAction<string>>
) => {
  // Add new category
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

  // Remove category
  const removeCategory = (category: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
    } else {
      setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
    }
  }

  // Add new tag
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

  // Remove tag
  const removeTag = (tag: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    } else {
      setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    }
  }

  return {
    addCategory,
    removeCategory,
    addTag,
    removeTag
  }
}
