'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function EditarNoticiaPage() {
  const params = useParams()
  const router = useRouter()
  const newsId = params.id as string

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    publicationDate: '',
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[],
    location_city: '',
    location_country: ''
  })

  const [formDataEnglish, setFormDataEnglish] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    publicationDate: '',
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[],
    location_city: '',
    location_country: ''
  })

  const [originalData, setOriginalData] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    publicationDate: '',
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[],
    location_city: '',
    location_country: ''
  })

  const [originalDataEnglish, setOriginalDataEnglish] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    publicationDate: '',
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[],
    location_city: '',
    location_country: ''
  })

  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newCategoryEnglish, setNewCategoryEnglish] = useState('')
  const [newTagEnglish, setNewTagEnglish] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isCoverDragOver, setIsCoverDragOver] = useState(false)
  
  const toast = useToast()

  // Load news data on component mount
  useEffect(() => {
    const loadNewsData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/news/${newsId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        
        const data = await response.json()
        
        // Transform database data to match the expected format
        const spanishData = {
          title: data.news.title_es,
          author: data.news.author,
          coverImage: data.news.coverImageUrl || null,
          publicationDate: data.news.date.split('T')[0],
          description: data.news.body_es,
          images: (data.news.newsImages || []).map((img: any) => img.imageUrl),
          categories: data.news.category ? data.news.category.split(', ').filter((cat: string) => cat.trim()) : [],
          tags: data.news.tags || [],
          location_city: data.news.location_city || '',
          location_country: data.news.location_country || ''
        }
        
        const englishData = {
          title: data.news.title_en,
          author: data.news.author,
          coverImage: data.news.coverImageUrl || null,
          publicationDate: data.news.date.split('T')[0],
          description: data.news.body_en,
          images: (data.news.newsImages || []).map((img: any) => img.imageUrl),
          categories: (data.news.category_en || data.news.category) ? (data.news.category_en || data.news.category).split(', ').filter((cat: string) => cat.trim()) : [],
          tags: data.news.tags_en || [],
          location_city: data.news.location_city || '',
          location_country: data.news.location_country || ''
        }
        
        setFormData(spanishData)
        setFormDataEnglish(englishData)
        setOriginalData(spanishData)
        setOriginalDataEnglish(englishData)
      } catch (error) {
        console.error('Error loading news:', error)
        toast.error('Error al cargar la noticia')
      } finally {
        setIsLoading(false)
      }
    }

    loadNewsData()
  }, [newsId])

  // Check if form has changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData) || 
                    JSON.stringify(formDataEnglish) !== JSON.stringify(originalDataEnglish)

  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData
  const getCurrentNewCategory = () => isEnglishMode ? newCategoryEnglish : newCategory
  const getCurrentNewTag = () => isEnglishMode ? newTagEnglish : newTag
  const setCurrentNewCategory = (value: string) => isEnglishMode ? setNewCategoryEnglish(value) : setNewCategory(value)
  const setCurrentNewTag = (value: string) => isEnglishMode ? setNewTagEnglish(value) : setNewTag(value)

  // Helper function to get image source
  const getImageSrc = (image: File | string | null): string => {
    if (!image) return ''
    if (image instanceof File) return URL.createObjectURL(image)
    return image
  }

  // English translations
  const translations = {
    title: isEnglishMode ? 'News Title' : 'Titulo Noticia',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    coverImage: isEnglishMode ? 'Cover Image' : 'Portada',
    publicationDate: isEnglishMode ? 'Publication Date' : 'Fecha de Publicación',
    description: isEnglishMode ? 'Description' : 'Descripción',
    location_city: isEnglishMode ? 'City' : 'Ciudad',
    location_country: isEnglishMode ? 'State' : 'Estado',
    basicInfo: isEnglishMode ? 'Basic Information' : 'Información Básica',
    cover: isEnglishMode ? 'Cover' : 'Portada',
    images: isEnglishMode ? 'Images' : 'Imágenes',
    categories: isEnglishMode ? 'Categories' : 'Categorías',
    tags: isEnglishMode ? 'Tags' : 'Etiquetas',
    newCategory: isEnglishMode ? 'New category' : 'Nueva categoría',
    newTag: isEnglishMode ? 'New tag' : 'Nueva etiqueta',
    editNews: isEnglishMode ? 'Edit News' : 'Editar Noticia',
    updateNews: isEnglishMode ? 'Update News' : 'Actualizar Noticia',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
    delete: isEnglishMode ? 'Delete' : 'Eliminar',
    coverDescription: isEnglishMode 
      ? 'JPG or PNG, Maximum 300 KB. Drag and drop an image here.'
      : 'JPG o PNG, Máximo 300 KB. Arrastra y suelta una imagen aquí.',
    uploadImage: isEnglishMode ? 'Upload Image' : 'Subir Imagen',
    imagesDescription: isEnglishMode 
      ? 'JPG or PNG. Maximum 5 photos of 300 KB each.'
      : 'JPG o PNG. Máximo 5 fotos de 300 KB c/u.',
    pressToUpload: isEnglishMode ? 'Click here to upload images' : 'Presiona aquí para subir imágenes',
    or: isEnglishMode ? 'or' : 'o',
    dragAndDrop: isEnglishMode ? 'Drag and drop images here' : 'Arrastra y suelta imágenes aquí',
    dropHere: isEnglishMode ? 'Drop here to upload!' : '¡Suelta aquí para subir!',
    categoriesDescription: isEnglishMode 
      ? 'Enter categories one by one.'
      : 'Ingrese las categorías uno por uno.',
    tagsDescription: isEnglishMode 
      ? 'Enter tags one by one.'
      : 'Ingrese las etiquetas uno por uno.',
    descriptionPlaceholder: isEnglishMode 
      ? 'Write the news description...'
      : 'Escribe la descripción de la noticia...',
    descriptionHelp: isEnglishMode 
      ? 'General and detailed description about the news.'
      : 'Descripción general y detallada sobre la noticia.',
    englishVersion: 'English',
    spanishVersion: 'Spanish',
    location: isEnglishMode ? 'Location' : 'Ubicación'
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['author', 'publicationDate', 'location_city', 'location_country']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-sync common fields to English version
      const commonFields = ['author', 'publicationDate', 'location_city', 'location_country']
      if (commonFields.includes(field)) {
        setFormDataEnglish(prev => ({ ...prev, [field]: value }))
      }
    }
  }

  // Handle cover image upload
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Always update both Spanish and English versions with the same image
      setFormData(prev => ({ ...prev, coverImage: file }))
      setFormDataEnglish(prev => ({ ...prev, coverImage: file }))
    }
  }

  // Handle multiple images upload
  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      // Always update both Spanish and English versions with the same images
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
      setFormDataEnglish(prev => ({ ...prev, images: [...prev.images, ...files] }))
    }
  }

  // Handle drag and drop for multiple images
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      // Always update both Spanish and English versions with the same images
      setFormData(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
      setFormDataEnglish(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
    }
  }

  // Handle drag and drop for cover image
  const handleCoverDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(true)
  }

  const handleCoverDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(false)
  }

  const handleCoverDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      // Always update both Spanish and English versions with the same image
      setFormData(prev => ({ ...prev, coverImage: imageFile }))
      setFormDataEnglish(prev => ({ ...prev, coverImage: imageFile }))
    }
  }

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

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Handle form submission (update)
  const handleUpdate = async () => {
    // Always validate both Spanish and English versions
    const spanishRequiredFields = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      coverImage: formData.coverImage,
      publicationDate: formData.publicationDate,
      description: formData.description.trim()
    }
    
    const englishRequiredFields = {
      title: formDataEnglish.title.trim(),
      author: formDataEnglish.author.trim(),
      coverImage: formDataEnglish.coverImage,
      publicationDate: formDataEnglish.publicationDate,
      description: formDataEnglish.description.trim()
    }
    
    const spanishMissingFields = Object.entries(spanishRequiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    const englishMissingFields = Object.entries(englishRequiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    // Field names for both languages
    const spanishFieldNames = {
      title: 'Título',
      author: 'Autor',
      coverImage: 'Portada',
      publicationDate: 'Fecha de publicación',
      description: 'Descripción'
    }
    
    const englishFieldNames = {
      title: 'Title',
      author: 'Author',
      coverImage: 'Cover Image',
      publicationDate: 'Publication Date',
      description: 'Description'
    }
    
    // Check if we're in Spanish mode and Spanish fields are missing
    if (!isEnglishMode && spanishMissingFields.length > 0) {
      const missingFieldNames = spanishMissingFields.map(field => spanishFieldNames[field as keyof typeof spanishFieldNames])
      toast.warning(`Debes llenar todos los campos obligatorios: ${missingFieldNames.join(', ')}`)
      return
    }
    
    // Check if we're in English mode and English fields are missing
    if (isEnglishMode && englishMissingFields.length > 0) {
      const missingFieldNames = englishMissingFields.map(field => englishFieldNames[field as keyof typeof englishFieldNames])
      toast.warning(`You must fill all required fields: ${missingFieldNames.join(', ')}`)
      return
    }
    
    // If we're in Spanish mode, also check English fields
    if (!isEnglishMode) {
      if (englishMissingFields.length > 0) {
        const missingFieldNames = englishMissingFields.map(field => englishFieldNames[field as keyof typeof englishFieldNames])
        toast.warning(`También debes llenar todos los campos obligatorios de la versión en inglés: ${missingFieldNames.join(', ')}`)
        return
      }
    }
    
    // If we're in English mode, also check Spanish fields
    if (isEnglishMode) {
      if (spanishMissingFields.length > 0) {
        const missingFieldNames = spanishMissingFields.map(field => spanishFieldNames[field as keyof typeof spanishFieldNames])
        toast.warning(`You must also fill all required fields in the Spanish version: ${missingFieldNames.join(', ')}`)
        return
      }
    }
    
    setIsUpdating(true)
    
    try {
      // Convert cover image to base64 if it's a File
      let coverImageUrl = 'https://images.unsplash.com/photo-1495020689067-958852a6c2c8?w=400&h=250&fit=crop&crop=center'
      if (formData.coverImage && typeof formData.coverImage === 'object') {
        coverImageUrl = await fileToBase64(formData.coverImage)
      } else if (typeof formData.coverImage === 'string') {
        coverImageUrl = formData.coverImage
      }

      // Convert news images to base64
      const newsImages = []
      for (let i = 0; i < formData.images.length; i++) {
        const image = formData.images[i]
        let imageUrl = ''
        
        if (typeof image === 'object') {
          imageUrl = await fileToBase64(image)
        } else if (typeof image === 'string') {
          imageUrl = image
        }
        
        newsImages.push({
          imageUrl,
          order: i
        })
      }

      // Prepare news data for API
      const newsData = {
        title_es: formData.title.trim(),
        title_en: formDataEnglish.title.trim(),
        body_es: formData.description.trim(),
        body_en: formDataEnglish.description.trim(),
        date: new Date(formData.publicationDate + 'T12:00:00').toISOString(),
        author: formData.author.trim(),
        category: formData.categories.length > 0 ? formData.categories.join(', ') : 'General',
        category_en: formDataEnglish.categories.length > 0 ? formDataEnglish.categories.join(', ') : 'General',
        tags: formData.tags,
        tags_en: formDataEnglish.tags,
        location_city: formData.location_city.trim(),
        location_country: formData.location_country.trim(),
        coverImageUrl,
        newsImages
      }

      const response = await fetch(`/api/news/${newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update news')
      }

      // Update original data to reflect changes
      setOriginalData(formData)
      setOriginalDataEnglish(formDataEnglish)
      // Show success toast and redirect
      const successMessage = isEnglishMode ? 'News updated successfully' : 'Noticia actualizada exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/noticias')
    } catch (error: any) {
      console.error('Error updating news:', error)
      toast.error(error.message || 'Error al actualizar noticia')
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete news')
      }

      setIsDeleteModalOpen(false)
      // Show success toast and redirect
      const successMessage = isEnglishMode ? 'News deleted successfully' : 'Noticia eliminada exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/noticias')
    } catch (error: any) {
      console.error('Error deleting news:', error)
      toast.error(error.message || 'Error al eliminar noticia')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando noticia...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
          <span>Inicio</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>Gestión</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>Noticias</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.editNews}</span>
        </nav>
      </div>

      {/* Header Section with Preview and Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0 flex-1 min-w-0">
          {/* Preview Image */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {getCurrentFormData().coverImage ? (
              <Image
                src={getImageSrc(getCurrentFormData().coverImage)}
                alt="Preview"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Preview Info */}
          <div className="min-w-0 flex-1">
            <h1 className="font-metropolis font-bold text-2xl mb-1 break-words" style={{ color: '#0D141C' }}>
              {getCurrentFormData().title || translations.title}
            </h1>
            <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
              {getCurrentFormData().author} | {new Date(getCurrentFormData().publicationDate).getFullYear()}
            </p>
          </div>
        </div>

        {/* Language Toggle and Action Buttons */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Language Toggle Button */}
          <button
            onClick={() => setIsEnglishMode(!isEnglishMode)}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isEnglishMode ? translations.spanishVersion : translations.englishVersion}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-3 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {translations.delete}
          </button>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !hasChanges}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>{translations.updating}</span>
              </div>
            ) : (
              translations.updateNews
            )}
          </button>
        </div>
      </div>

      {/* Language Mode Indicator */}
      {isEnglishMode && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="text-blue-800 font-medium">
              English Mode - This section will be filled in English. The DeepL translation endpoint will be integrated later.
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ borderColor: '#CFDBE8' }}>
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.basicInfo}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.title} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder={translations.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.author} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={isEnglishMode ? formData.author : getCurrentFormData().author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder={translations.author}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.location}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.location_city}
                </label>
                <input
                  type="text"
                  value={isEnglishMode ? formData.location_city : getCurrentFormData().location_city}
                  onChange={(e) => handleInputChange('location_city', e.target.value)}
                  placeholder={translations.location_city}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.location_country}
                </label>
                <input
                  type="text"
                  value={isEnglishMode ? formData.location_country : getCurrentFormData().location_country}
                  onChange={(e) => handleInputChange('location_country', e.target.value)}
                  placeholder={translations.location_country}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Cover Image Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.cover} <span className="text-red-500">*</span>
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                {translations.coverDescription}
              </p>
              <div className="flex items-center space-x-4">
                {/* Image Preview */}
                <div 
                  className={`w-32 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-dashed transition-colors cursor-pointer ${
                    isCoverDragOver 
                      ? 'border-[#5A6F80] bg-[#E8EDF5]' 
                      : 'border-gray-300 hover:border-[#5A6F80]'
                  }`}
                  onDragOver={handleCoverDragOver}
                  onDragLeave={handleCoverDragLeave}
                  onDrop={handleCoverDrop}
                  onClick={() => document.getElementById('coverImageInput')?.click()}
                >
                  {getCurrentFormData().coverImage ? (
                    <Image
                      src={getImageSrc(getCurrentFormData().coverImage)}
                      alt="Cover preview"
                      width={128}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] cursor-pointer transition-colors">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {translations.uploadImage}
                  <input
                    id="coverImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Publication Date Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.publicationDate} <span className="text-red-500">*</span>
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
                              <input
                  type="date"
                  value={isEnglishMode ? formData.publicationDate : getCurrentFormData().publicationDate}
                  onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                  disabled={isEnglishMode}
                  className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.description} <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              {translations.descriptionHelp}
            </p>
            <textarea
              value={getCurrentFormData().description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent resize-none"
              placeholder={translations.descriptionPlaceholder}
            />
          </div>

          {/* Images Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.images}
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              {translations.imagesDescription}
            </p>
            <label 
              className={`block w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-[#5A6F80] bg-[#E8EDF5]' 
                  : 'border-gray-300 hover:border-[#5A6F80]'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  {translations.pressToUpload}
                </p>
                <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  {translations.or}
                  <br />
                  {translations.dragAndDrop}
                </p>
                {isDragOver && (
                  <p className="text-sm font-metropolis font-medium text-[#5A6F80] animate-pulse">
                    {translations.dropHere}
                  </p>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesUpload}
                className="hidden"
              />
            </label>
            
                        {/* Uploaded Images Preview */}
            {getCurrentFormData().images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                {getCurrentFormData().images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`Uploaded ${index + 1}`}
                      width={120}
                      height={80}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        // Always remove from both Spanish and English versions
                        setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
                        setFormDataEnglish(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.categories}
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              {translations.categoriesDescription}
            </p>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={getCurrentNewCategory()}
                  onChange={(e) => setCurrentNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  placeholder={translations.newCategory}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
                <button
                  onClick={addCategory}
                  className="px-3 py-2 bg-[#5A6F80] text-white rounded-md hover:bg-[#4A739C] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {/* Categories Tags */}
              <div className="flex flex-wrap gap-2">
                {getCurrentFormData().categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full"
                  >
                    {category}
                    <button
                      onClick={() => removeCategory(category)}
                      className="ml-2 text-[#4A739C] hover:text-[#0D141C] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.tags}
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              {translations.tagsDescription}
            </p>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={getCurrentNewTag()}
                  onChange={(e) => setCurrentNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder={translations.newTag}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-[#5A6F80] text-white rounded-md hover:bg-[#4A739C] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {getCurrentFormData().tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-[#4A739C] hover:text-[#0D141C] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Black overlay with 60% opacity */}
          <div 
            className="absolute inset-0 bg-black opacity-60"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 z-10">
            {/* Modal body */}
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-metropolis font-bold text-[#0D141C] mb-2">
                {isEnglishMode ? 'Are you sure you want to delete this news?' : '¿Estás seguro que deseas eliminar esta noticia?'}
              </h3>
              
              <p className="text-sm font-metropolis font-regular text-[#4A739C] mb-6">
                {isEnglishMode ? 'You will not be able to reverse this action.' : 'No podrás revertir esta acción.'}
              </p>

              {/* News info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                  {getCurrentFormData().title}
                </p>
                <p className="text-sm font-metropolis font-regular text-[#4A739C]">
                  {getCurrentFormData().author}
                </p>
                <span className="inline-flex px-2 py-1 text-xs font-metropolis font-regular rounded-full mt-2 bg-[#E8EDF5] text-[#0D141C]">
                  {getCurrentFormData().categories.join(', ')}
                </span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-center space-x-3 p-6 border-t border-gray-200">
                              <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
                >
                  {isEnglishMode ? 'Cancel' : 'Cancelar'}
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#F43F5E] border border-transparent rounded-md hover:bg-[#E11D48] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="flex items-center space-x-2">
                      <Spinner size="sm" />
                      <span>{isEnglishMode ? 'Deleting...' : 'Eliminando...'}</span>
                    </div>
                  ) : (
                    isEnglishMode ? 'Delete' : 'Eliminar'
                  )}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
