'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface Event {
  id: number
  title_es: string
  title_en: string
  body_es: string
  body_en: string
  date: string
  tags: string[]
  category: string
  category_en: string
  author: string
  location_city: string
  location_country: string
  coverImageUrl: string
  phrase: string
  phrase_en: string
  credits: string
  credits_en: string
  createdAt: string
  updatedAt: string
  tags_en: string[]
  eventImages?: Array<{ id: number; imageUrl: string; order?: number }>
}

export default function EditarEventoPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    eventDate: new Date().toISOString().split('T')[0],
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[],
    phrase: '',
    credits: '',
    locationCity: '',
    locationCountry: ''
  })

  const [formDataEnglish, setFormDataEnglish] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    eventDate: new Date().toISOString().split('T')[0],
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[],
    phrase: '',
    credits: '',
    locationCity: '',
    locationCountry: ''
  })

  const [originalData, setOriginalData] = useState<Event | null>(null)
  const [originalDataEnglish, setOriginalDataEnglish] = useState<Event | null>(null)
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newCategoryEnglish, setNewCategoryEnglish] = useState('')
  const [newTagEnglish, setNewTagEnglish] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const toast = useToast()



  // Load event data on component mount
  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (response.ok) {
          const data = await response.json()
          const eventData = data.event
          
          setOriginalData(eventData)
          setOriginalDataEnglish(eventData)
          
          // Populate Spanish form
          setFormData({
            title: eventData.title_es,
            author: eventData.author,
            coverImage: eventData.coverImageUrl || null,
            eventDate: eventData.date.split('T')[0], // Convert to YYYY-MM-DD format
            description: eventData.body_es,
            images: eventData.eventImages ? eventData.eventImages.map((img: any) => img.imageUrl) : [],
            categories: eventData.category ? eventData.category.split(', ').filter((cat: string) => cat.trim()) : [],
            tags: eventData.tags,
            phrase: eventData.phrase || '',
            credits: eventData.credits,
            locationCity: eventData.location_city,
            locationCountry: eventData.location_country
          })
          
          // Populate English form
          setFormDataEnglish({
            title: eventData.title_en,
            author: eventData.author,
            coverImage: eventData.coverImageUrl || null,
            eventDate: eventData.date.split('T')[0], // Convert to YYYY-MM-DD format
            description: eventData.body_en,
            images: eventData.eventImages ? eventData.eventImages.map((img: any) => img.imageUrl) : [],
            categories: (eventData.category_en || eventData.category) ? (eventData.category_en || eventData.category).split(', ').filter((cat: string) => cat.trim()) : [],
            tags: eventData.tags_en,
            phrase: eventData.phrase_en || '',
            credits: eventData.credits_en || '',
            locationCity: eventData.location_city,
            locationCountry: eventData.location_country
          })
        } else {
          toast.error('Error loading event')
        }
      } catch (error) {
        console.error('Error loading event:', error)
        toast.error('Error loading event')
      } finally {
        setIsLoading(false)
      }
    }

    loadEventData()
  }, [eventId]) // Remove toast dependency to prevent infinite loops

  // Check if there are changes
  const hasChanges = () => {
    if (!originalData) return false
    
    // Check changes in Spanish form
    const spanishChanges = 
      formData.title !== originalData.title_es ||
      formData.author !== originalData.author ||
      formData.eventDate !== originalData.date ||
      formData.description !== originalData.body_es ||
      formData.phrase !== originalData.phrase ||
      formData.credits !== originalData.credits ||
      formData.locationCity !== originalData.location_city ||
      formData.locationCountry !== originalData.location_country ||
      JSON.stringify(formData.categories) !== JSON.stringify([originalData.category]) ||
      JSON.stringify(formData.tags) !== JSON.stringify(originalData.tags) ||
      (formData.coverImage instanceof File ? true : formData.coverImage !== originalData.coverImageUrl) ||
      JSON.stringify(formData.images) !== JSON.stringify(originalData.eventImages ? originalData.eventImages.map((img: any) => img.imageUrl) : [])
    
    // Check changes in English form
    const englishChanges = 
      formDataEnglish.title !== originalData.title_en ||
      formDataEnglish.author !== originalData.author ||
      formDataEnglish.eventDate !== originalData.date ||
      formDataEnglish.description !== originalData.body_en ||
      formDataEnglish.phrase !== originalData.phrase_en ||
      formDataEnglish.credits !== originalData.credits_en ||
      formDataEnglish.locationCity !== originalData.location_city ||
      formDataEnglish.locationCountry !== originalData.location_country ||
      JSON.stringify(formDataEnglish.categories) !== JSON.stringify([originalData.category_en]) ||
      JSON.stringify(formDataEnglish.tags) !== JSON.stringify(originalData.tags_en) ||
      (formDataEnglish.coverImage instanceof File ? true : formDataEnglish.coverImage !== originalData.coverImageUrl) ||
      JSON.stringify(formDataEnglish.images) !== JSON.stringify(originalData.eventImages ? originalData.eventImages.map((img: any) => img.imageUrl) : [])
    
    return spanishChanges || englishChanges
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (isEnglishMode) {
      // For common fields, don't allow editing in English mode
      const commonFields = ['author', 'eventDate', 'locationCity', 'locationCountry']
      if (commonFields.includes(field)) {
        return // Don't update these fields in English mode
      }
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
      
      // Auto-sync common fields to English version
      const commonFields = ['author', 'eventDate', 'locationCity', 'locationCountry']
      if (commonFields.includes(field)) {
        setFormDataEnglish(prev => ({ ...prev, [field]: value }))
      }
    }
  }

  // Handle language mode toggle - preserve images between modes
  const handleLanguageToggle = () => {
    const newEnglishMode = !isEnglishMode
    
    if (newEnglishMode) {
      // Switching to English mode - copy images from Spanish to English
      setFormDataEnglish(prev => ({
        ...prev,
        coverImage: formData.coverImage,
        images: formData.images
      }))
    } else {
      // Switching to Spanish mode - copy images from English to Spanish
      setFormData(prev => ({
        ...prev,
        coverImage: formDataEnglish.coverImage,
        images: formDataEnglish.images
      }))
    }
    
    setIsEnglishMode(newEnglishMode)
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

  // Handle cover image upload
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Update both Spanish and English forms to keep images synchronized
      setFormData(prev => ({ ...prev, coverImage: file }))
      setFormDataEnglish(prev => ({ ...prev, coverImage: file }))
    }
  }

  // Handle multiple images upload
  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      // Update both Spanish and English forms to keep images synchronized
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
      setFormDataEnglish(prev => ({ ...prev, images: [...prev.images, ...files] }))
    }
  }

  // Remove image from multiple images
  const removeImage = (index: number) => {
    // Remove from both Spanish and English forms to keep images synchronized
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
    setFormDataEnglish(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  // Handle drag and drop for cover image
  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const imageFile = files[0]
      if (imageFile.type.startsWith('image/')) {
        // Update both Spanish and English forms to keep images synchronized
        setFormData(prev => ({ ...prev, coverImage: imageFile }))
        setFormDataEnglish(prev => ({ ...prev, coverImage: imageFile }))
      }
    }
  }

  // Handle drag and drop for multiple images
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      // Update both Spanish and English forms to keep images synchronized
      setFormData(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
      setFormDataEnglish(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
    }
  }

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Handle form submission
  const handleUpdate = async () => {
    // Validate both Spanish and English versions
    const spanishRequiredFields = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      eventDate: formData.eventDate,
      description: formData.description.trim(),
      phrase: formData.phrase.trim(),
      credits: formData.credits.trim(),
      locationCity: formData.locationCity.trim(),
      locationCountry: formData.locationCountry.trim()
    }
    
    const englishRequiredFields = {
      title: formDataEnglish.title.trim(),
      author: formDataEnglish.author.trim(),
      eventDate: formDataEnglish.eventDate,
      description: formDataEnglish.description.trim(),
      phrase: formDataEnglish.phrase.trim(),
      credits: formDataEnglish.credits.trim(),
      locationCity: formDataEnglish.locationCity.trim(),
      locationCountry: formDataEnglish.locationCountry.trim()
    }
    
    const spanishMissingFields = Object.entries(spanishRequiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    const englishMissingFields = Object.entries(englishRequiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    if (spanishMissingFields.length > 0) {
      toast.warning(`Debes llenar todos los campos obligatorios en español: ${spanishMissingFields.join(', ')}`)
      return
    }
    
    if (englishMissingFields.length > 0) {
      toast.warning(`You must fill all required fields in English: ${englishMissingFields.join(', ')}`)
      return
    }
    
    setIsUpdating(true)
    
    try {
      // Convert cover image to base64 if it's a File
      let coverImageUrl = null
      if (formData.coverImage instanceof File) {
        coverImageUrl = await fileToBase64(formData.coverImage)
      }
      
      // Convert images to base64 if they are Files, keep existing URLs
      const images = []
      for (const image of formData.images) {
        if (image instanceof File) {
          const base64Image = await fileToBase64(image)
          images.push(base64Image)
        } else if (typeof image === 'string') {
          // Keep existing image URLs
          images.push(image)
        }
      }
      
      // Prepare event data
      const eventData = {
        title_es: formData.title,
        title_en: formDataEnglish.title,
        body_es: formData.description,
        body_en: formDataEnglish.description,
        date: new Date(formData.eventDate + 'T12:00:00').toISOString(),
        author: formData.author,
        location_city: formData.locationCity,
        location_country: formData.locationCountry,
        coverImageUrl,
        phrase: formData.phrase,
        phrase_en: formDataEnglish.phrase,
        credits: formData.credits,
        credits_en: formDataEnglish.credits,
        category: formData.categories.length > 0 ? formData.categories.join(', ') : '',
        category_en: formDataEnglish.categories.length > 0 ? formDataEnglish.categories.join(', ') : '',
        tags: formData.tags,
        tags_en: formDataEnglish.tags,
        images
      }
      
      // Make API call
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update event')
      }
      
      const result = await response.json()
      
      const successMessage = isEnglishMode ? 'Event updated successfully' : 'Evento actualizado exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/eventos')
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error(error instanceof Error ? error.message : 'Error updating event')
    } finally {
      setIsUpdating(false)
    }
  }

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

  // Translations
  const translations = {
    editEvent: isEnglishMode ? 'Edit Event' : 'Editar Evento',
    updateEvent: isEnglishMode ? 'Update Event' : 'Actualizar Evento',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
    title: isEnglishMode ? 'Event Title' : 'Título del Evento',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    eventDate: isEnglishMode ? 'Event Date' : 'Fecha del Evento',
    description: isEnglishMode ? 'Description' : 'Descripción',
    phrase: isEnglishMode ? 'Event Phrase' : 'Frase del Evento',
    credits: isEnglishMode ? 'Credits' : 'Créditos',
    locationCity: isEnglishMode ? 'City' : 'Ciudad',
    locationCountry: isEnglishMode ? 'State' : 'Estado',
    categories: isEnglishMode ? 'Categories' : 'Categorías',
    tags: isEnglishMode ? 'Tags' : 'Etiquetas',
    newCategory: isEnglishMode ? 'New category' : 'Nueva categoría',
    newTag: isEnglishMode ? 'New tag' : 'Nueva etiqueta',
    coverImage: isEnglishMode ? 'Cover Image' : 'Portada',
    coverDescription: isEnglishMode 
      ? 'JPG or PNG, Maximum 300 KB. Drag and drop an image here.'
      : 'JPG o PNG, Máximo 300 KB. Arrastra y suelta una imagen aquí.',
    uploadImage: isEnglishMode ? 'Upload Image' : 'Subir Imagen',
    images: isEnglishMode ? 'Images' : 'Imágenes',
    imagesDescription: isEnglishMode 
      ? 'JPG or PNG. Maximum 5 photos of 300 KB each.'
      : 'JPG o PNG. Máximo 5 fotos de 300 KB c/u.',
    pressToUpload: isEnglishMode ? 'Click here to upload images' : 'Presiona aquí para subir imágenes',
    or: isEnglishMode ? 'or' : 'o',
    dragAndDrop: isEnglishMode ? 'Drag and drop images here' : 'Arrastra y suelta imágenes aquí',
    dropHere: isEnglishMode ? 'Drop here' : 'Suelta aquí',
    englishVersion: 'English',
    spanishVersion: 'Spanish',
    location: isEnglishMode ? 'Location' : 'Ubicación'
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando evento...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!originalData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            Evento no encontrado
          </h3>
          <button
            onClick={() => router.push('/general/gestion/eventos')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C]"
          >
            Volver a Eventos
          </button>
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
          <span>Eventos</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.editEvent}</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Event Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
            {getCurrentFormData().coverImage ? (
              <Image
                src={getImageSrc(getCurrentFormData().coverImage)}
                alt="Event cover preview"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Event Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {translations.editEvent}
            </h1>
            <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
              {isEnglishMode ? originalData.title_en : originalData.title_es}
            </p>
          </div>
        </div>

        {/* Language Toggle and Update Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLanguageToggle}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isEnglishMode ? translations.spanishVersion : translations.englishVersion}
          </button>

          <button
            onClick={handleUpdate}
            disabled={isUpdating || !hasChanges()}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>{translations.updating}</span>
              </div>
            ) : (
              translations.updateEvent
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
              English Mode - Editing English version of the event
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ borderColor: '#CFDBE8' }}>
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Información Básica
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
              {translations.coverImage} <span className="text-red-500">*</span>
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                {translations.coverDescription}
              </p>
              <div className="flex items-center space-x-4">
                {/* Image Preview */}
                <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

          {/* Event Date */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.eventDate} <span className="text-red-500">*</span>
            </h2>
            <input
              type="date"
              value={isEnglishMode ? formData.eventDate : getCurrentFormData().eventDate}
              onChange={(e) => handleInputChange('eventDate', e.target.value)}
              disabled={isEnglishMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* Location */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.location} <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.locationCity}
                </label>
                <input
                  type="text"
                  value={isEnglishMode ? formData.locationCity : getCurrentFormData().locationCity}
                  onChange={(e) => handleInputChange('locationCity', e.target.value)}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.locationCountry}
                </label>
                <input
                  type="text"
                  value={isEnglishMode ? formData.locationCountry : getCurrentFormData().locationCountry}
                  onChange={(e) => handleInputChange('locationCountry', e.target.value)}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.description} <span className="text-red-500">*</span>
            </h2>
            <textarea
              value={getCurrentFormData().description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent resize-none"
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
                getCurrentFormData().images.length > 0 
                  ? 'border-[#5A6F80] bg-[#E8EDF5]' 
                  : 'border-gray-300 hover:border-[#5A6F80]'
              }`}
              onDragOver={(e) => e.preventDefault()}
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
                      src={getImageSrc(image)}
                      alt={`Uploaded ${index + 1}`}
                      width={120}
                      height={80}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
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

          {/* Phrase */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.phrase} <span className="text-red-500">*</span>
            </h2>
            <input
              type="text"
              value={getCurrentFormData().phrase}
              onChange={(e) => handleInputChange('phrase', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
            />
          </div>

          {/* Credits */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.credits} <span className="text-red-500">*</span>
            </h2>
            <input
              type="text"
              value={getCurrentFormData().credits}
              onChange={(e) => handleInputChange('credits', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.categories}
            </h2>
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

          {/* Tags */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.tags}
            </h2>
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
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </div>
  )
}
