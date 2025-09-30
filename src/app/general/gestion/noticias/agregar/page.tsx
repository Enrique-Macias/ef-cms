'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useNewsForm } from '@/hooks/useNewsForm'
import { useTranslation } from '@/hooks/useTranslation'
import { fileToBase64, getImageSrc } from '@/utils/fileUtils'
import { validateNewsForm } from '@/utils/validationUtils'
import { createFormHandlers } from '@/utils/formHandlers'
import { createCategoryTagHandlers } from '@/utils/categoryTagUtils'

export default function AgregarNoticiaPage() {
  const router = useRouter()
  const toast = useToast()

  // Custom hooks
  const {
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
    isPublishing,
    setIsPublishing,
    isDragOver,
    setIsDragOver,
    isCoverDragOver,
    setIsCoverDragOver,
    getCurrentFormData,
    getCurrentNewCategory,
    getCurrentNewTag,
    setCurrentNewCategory,
    setCurrentNewTag
  } = useNewsForm()

  const {
    isTranslating,
    translationCompleted,
    setTranslationCompleted,
    translateToEnglish
  } = useTranslation()

  // Form handlers
  const {
    handleInputChange,
    handleCoverImageUpload,
    handleImagesUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCoverDragOver,
    handleCoverDragLeave,
    handleCoverDrop
  } = createFormHandlers(formData, setFormData, formDataEnglish, setFormDataEnglish, isEnglishMode, toast)

  // Category and tag handlers
  const {
    addCategory,
    removeCategory,
    addTag,
    removeTag
  } = createCategoryTagHandlers(
    formData, setFormData, formDataEnglish, setFormDataEnglish, isEnglishMode,
    newCategory, setNewCategory, newTag, setNewTag,
    newCategoryEnglish, setNewCategoryEnglish, newTagEnglish, setNewTagEnglish
  )

  // Handle form submission
  const handleSubmit = async () => {
    const validation = validateNewsForm(formData, formDataEnglish, isEnglishMode)
    
    if (!validation.isValid) {
      toast.warning(validation.message!)
      return
    }
    
    setIsPublishing(true)
    
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

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(newsData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear noticia')
      }

      // Show success toast
      const successMessage = isEnglishMode ? 'News published successfully' : 'Noticia publicada exitosamente'
      toast.success(successMessage)
      // Redirect to news listing page
      router.push('/general/gestion/noticias')
    } catch (error: unknown) {
      console.error('Error creating news:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al crear noticia'
      toast.error(errorMessage)
    } finally {
      setIsPublishing(false)
    }
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
    addNews: isEnglishMode ? 'Add News' : 'Agregar Noticia',
    publishNews: isEnglishMode ? 'Publish News' : 'Publicar Noticia',
    publishing: isEnglishMode ? 'Publishing...' : 'Publicando...',
    coverDescription: isEnglishMode 
      ? 'JPG, JPEG or PNG, Maximum 2MB. Drag and drop an image here.'
      : 'JPG, JPEG o PNG, Máximo 2MB. Arrastra y suelta una imagen aquí.',
    uploadImage: isEnglishMode ? 'Upload Image' : 'Subir Imagen',
    imagesDescription: isEnglishMode 
      ? 'JPG, JPEG or PNG. Maximum 5 photos of 2MB each.'
      : 'JPG, JPEG o PNG. Máximo 5 fotos de 2MB c/u.',
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.addNews}</span>
        </nav>
      </div>

      {/* Header Section with Preview and Publish Button */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0 flex-1 min-w-0">
          {/* Preview Image */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {getCurrentFormData.coverImage ? (
              <Image
                src={getImageSrc(getCurrentFormData.coverImage)}
                alt="Preview"
                width={64}
                height={64}
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
          <div className="min-w-0 flex-1">
            <h1 className="font-metropolis font-bold text-2xl mb-1 break-words" style={{ color: '#0D141C' }}>
              {getCurrentFormData.title || translations.title}
            </h1>
            <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
              {getCurrentFormData.author} | {new Date(getCurrentFormData.publicationDate).getFullYear()}
            </p>
          </div>
        </div>

        {/* Language Toggle and Publish Buttons */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Language Toggle Button */}
          <button
            onClick={async () => {
              if (!isEnglishMode) {
                // Switch to English mode and trigger translation
                setIsEnglishMode(true)
                setTranslationCompleted(false)
                await translateToEnglish(formData, setFormDataEnglish)
              } else {
                // Switching back to Spanish mode
                setIsEnglishMode(false)
                setTranslationCompleted(false)
              }
            }}
            disabled={isTranslating}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isTranslating ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Traduciendo...</span>
              </div>
            ) : (
              isEnglishMode ? translations.spanishVersion : translations.englishVersion
            )}
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
              translations.publishNews
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
              English Mode - Content has been automatically translated from Spanish using DeepL. You can edit the translations as needed.
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border rounded-lg p-6 shadow-lg relative" style={{ borderColor: '#CFDBE8' }}>
        {/* Translation Loading Overlay */}
        {isTranslating && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-lg font-medium text-gray-700">Traduciendo contenido...</p>
              <p className="mt-2 text-sm text-gray-500">Por favor espera mientras se traduce el contenido al inglés</p>
            </div>
          </div>
        )}
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
                  value={getCurrentFormData.title}
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
                  value={isEnglishMode ? formData.author : getCurrentFormData.author}
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
                  value={isEnglishMode ? formData.location_city : getCurrentFormData.location_city}
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
                  value={isEnglishMode ? formData.location_country : getCurrentFormData.location_country}
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
                <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                  {getCurrentFormData.coverImage ? (
                    <Image
                      src={getImageSrc(getCurrentFormData.coverImage)}
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
                value={isEnglishMode ? formData.publicationDate : getCurrentFormData.publicationDate}
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
              value={getCurrentFormData.description}
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
            {getCurrentFormData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                {getCurrentFormData.images.map((image, index) => (
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
                        const newImages = getCurrentFormData.images.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, images: newImages }))
                        setFormDataEnglish(prev => ({ ...prev, images: newImages }))
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
                {getCurrentFormData.categories.map((category, index) => (
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
                {getCurrentFormData.tags.map((tag, index) => (
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
