'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function AgregarEventoPage() {
  const router = useRouter()
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

  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newCategoryEnglish, setNewCategoryEnglish] = useState('')
  const [newTagEnglish, setNewTagEnglish] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isCoverDragOver, setIsCoverDragOver] = useState(false)
  
  const toast = useToast()

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
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
      // Update both Spanish and English forms to keep images synchronized
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
      // Update both Spanish and English forms to keep images synchronized
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
  const handleSubmit = async () => {
    // Always validate both Spanish and English versions
    const spanishRequiredFields = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      coverImage: formData.coverImage,
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
      coverImage: formDataEnglish.coverImage,
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
    
    // Field names for both languages
    const spanishFieldNames = {
      title: 'Título',
      author: 'Autor',
      coverImage: 'Portada',
      eventDate: 'Fecha del Evento',
      description: 'Descripción',
      phrase: 'Frase',
      credits: 'Créditos',
      locationCity: 'Ciudad',
      locationCountry: 'País'
    }
    
    const englishFieldNames = {
      title: 'Title',
      author: 'Author',
      coverImage: 'Cover Image',
      eventDate: 'Event Date',
      description: 'Description',
      phrase: 'Phrase',
      credits: 'Credits',
      locationCity: 'City',
      locationCountry: 'Country'
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
    
    setIsPublishing(true)
    
    try {
      // Convert cover image to base64 if it's a File
      let coverImageUrl = null
      if (formData.coverImage instanceof File) {
        coverImageUrl = await fileToBase64(formData.coverImage)
      }
      
      // Convert images to base64 if they are Files
      const images = []
      for (const image of formData.images) {
        if (image instanceof File) {
          const base64Image = await fileToBase64(image)
          images.push(base64Image)
        }
      }
      
      // Prepare event data
      const eventData = {
        title_es: formData.title,
        title_en: formDataEnglish.title,
        body_es: formData.description,
        body_en: formDataEnglish.description,
        date: new Date(formData.eventDate + 'T00:00:00.000Z').toISOString(),
        author: formData.author,
        location_city: formData.locationCity,
        location_country: formData.locationCountry,
        coverImageUrl,
        phrase: formData.phrase,
        phrase_en: formDataEnglish.phrase,
        credits: formData.credits,
        credits_en: formDataEnglish.credits,
        category: formData.categories[0] || '',
        category_en: formDataEnglish.categories[0] || '',
        tags: formData.tags,
        tags_en: formDataEnglish.tags,
        images
      }
      
      // Make API call
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create event')
      }
      
      const result = await response.json()
      
      // Show success toast
      const successMessage = isEnglishMode ? 'Event created successfully' : 'Evento creado exitosamente'
      toast.success(successMessage)
      
      // Redirect to events listing page
      router.push('/general/gestion/eventos')
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error(error instanceof Error ? error.message : 'Error creating event')
    } finally {
      setIsPublishing(false)
    }
  }

  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData
  const getCurrentNewCategory = () => isEnglishMode ? newCategoryEnglish : newCategory
  const getCurrentNewTag = () => isEnglishMode ? newTagEnglish : newTag
  const setCurrentNewCategory = (value: string) => isEnglishMode ? setNewCategoryEnglish(value) : setNewCategory(value)
  const setCurrentNewTag = (value: string) => isEnglishMode ? setNewTagEnglish(value) : setNewTag(value)

  // English translations
  const translations = {
    title: isEnglishMode ? 'Event Title' : 'Título del Evento',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    coverImage: isEnglishMode ? 'Cover Image' : 'Portada',
    eventDate: isEnglishMode ? 'Event Date' : 'Fecha del Evento',
    description: isEnglishMode ? 'Description' : 'Descripción',
    phrase: isEnglishMode ? 'Event Phrase' : 'Frase del Evento',
    credits: isEnglishMode ? 'Credits' : 'Créditos',
    locationCity: isEnglishMode ? 'City' : 'Ciudad',
    locationCountry: isEnglishMode ? 'Country' : 'País',
    basicInfo: isEnglishMode ? 'Basic Information' : 'Información Básica',
    cover: isEnglishMode ? 'Cover' : 'Portada',
    images: isEnglishMode ? 'Images' : 'Imágenes',
    categories: isEnglishMode ? 'Categories' : 'Categorías',
    tags: isEnglishMode ? 'Tags' : 'Etiquetas',
    newCategory: isEnglishMode ? 'New category' : 'Nueva categoría',
    newTag: isEnglishMode ? 'New tag' : 'Nueva etiqueta',
    addEvent: isEnglishMode ? 'Add Event' : 'Agregar Evento',
    publishEvent: isEnglishMode ? 'Publish Event' : 'Publicar Evento',
    publishing: isEnglishMode ? 'Publishing...' : 'Publicando...',
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
      ? 'Write the event description...'
      : 'Escribe la descripción del evento...',
    descriptionHelp: isEnglishMode 
      ? 'General and detailed description about the event.'
      : 'Descripción general y detallada sobre el evento.',
    phrasePlaceholder: isEnglishMode 
      ? 'Enter an inspiring phrase for the event...'
      : 'Ingresa una frase inspiradora para el evento...',
    phraseHelp: isEnglishMode 
      ? 'A short, inspiring phrase that represents the event.'
      : 'Una frase corta e inspiradora que represente el evento.',
    creditsPlaceholder: isEnglishMode 
      ? 'Enter credits (e.g., Photography: Name | Design: Name)'
      : 'Ingresa los créditos (ej: Fotografía: Nombre | Diseño: Nombre)',
    creditsHelp: isEnglishMode 
      ? 'Credit the people who contributed to the event.'
      : 'Acredita a las personas que contribuyeron al evento.',
    englishVersion: 'English',
    spanishVersion: 'Spanish'
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.addEvent}</span>
        </nav>
      </div>

      {/* Header Section with Preview and Publish Button */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Preview Image */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            {getCurrentFormData().coverImage ? (
              <img
                src={URL.createObjectURL(getCurrentFormData().coverImage!)}
                alt="Preview"
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
          
          {/* Preview Info */}
          <div>
            <h1 className="font-metropolis font-bold text-2xl mb-1" style={{ color: '#0D141C' }}>
              {getCurrentFormData().title || translations.title}
            </h1>
            <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
              {getCurrentFormData().author} | {new Date(getCurrentFormData().eventDate).getFullYear()}
            </p>
            {getCurrentFormData().locationCity && (
              <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
                📍 {getCurrentFormData().locationCity}, {getCurrentFormData().locationCountry}
              </p>
            )}
          </div>
        </div>

        {/* Language Toggle and Publish Buttons */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle Button */}
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

          {/* Publish Button */}
          <button
            onClick={handleSubmit}
            disabled={isPublishing}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isPublishing ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>{translations.publishing}</span>
              </div>
            ) : (
              translations.publishEvent
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
                  value={getCurrentFormData().author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder={translations.author}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
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
                <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                  {getCurrentFormData().coverImage ? (
                    <img
                      src={URL.createObjectURL(getCurrentFormData().coverImage!)}
                      alt="Cover preview"
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

          {/* Event Date Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.eventDate} <span className="text-red-500">*</span>
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                value={getCurrentFormData().eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
              />
            </div>
          </div>

          {/* Location Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Ubicación <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.locationCity} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().locationCity}
                  onChange={(e) => handleInputChange('locationCity', e.target.value)}
                  placeholder={translations.locationCity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.locationCountry} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().locationCountry}
                  onChange={(e) => handleInputChange('locationCountry', e.target.value)}
                  placeholder={translations.locationCountry}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
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

          {/* Phrase Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.phrase} <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              {translations.phraseHelp}
            </p>
            <input
              type="text"
              value={getCurrentFormData().phrase}
              onChange={(e) => handleInputChange('phrase', e.target.value)}
              placeholder={translations.phrasePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
            />
          </div>

          {/* Credits Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.credits} <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              {translations.creditsHelp}
            </p>
            <input
              type="text"
              value={getCurrentFormData().credits}
              onChange={(e) => handleInputChange('credits', e.target.value)}
              placeholder={translations.creditsPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
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
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        if (isEnglishMode) {
                          setFormDataEnglish(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
                        } else {
                          setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
                        }
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
