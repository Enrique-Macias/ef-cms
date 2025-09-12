'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useArticleForm } from '@/hooks/useArticleForm'
import { createArticleFormHandlers } from '@/utils/articleFormHandlers'

interface Article {
  id: string
  title: string
  title_en: string
  body_es: string
  body_en: string
  imageUrl: string
  author: string
  date: string
  linkUrl: string | null
  createdAt: string
  updatedAt: string
}

export default function EditarArticuloPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string
  const toast = useToast()
  
  // Custom hooks
  const {
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    handleInputChange: originalHandleInputChange,
    handleImageUpload: originalHandleImageUpload
  } = useArticleForm()
  
  
  // State
  const [originalData, setOriginalData] = useState<Article | null>(null)
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)

  // Form handlers with validation
  const {
    handleInputChange,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = createArticleFormHandlers(formData, setFormData, formDataEnglish, setFormDataEnglish, isEnglishMode, toast)

  // Load article data on component mount
  useEffect(() => {
    const loadArticleData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/articles/${articleId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found')
          }
          throw new Error('Error al obtener artículo')
        }
        const data = await response.json()
        setOriginalData(data)
        
        // Populate Spanish form
        setFormData({
          title: data.title,
          body_es: data.body_es,
          author: data.author,
          date: data.date.split('T')[0],
          linkUrl: data.linkUrl || '',
          image: null
        })
        
        // Populate English form
        setFormDataEnglish({
          title: data.title_en,
          body_es: data.body_en,
          author: data.author,
          date: data.date.split('T')[0],
          linkUrl: data.linkUrl || '',
          image: null
        })
      } catch (error) {
        console.error('Error loading article:', error)
        toast.error('Error al cargar el artículo')
      } finally {
        setIsLoading(false)
      }
    }

    loadArticleData()
  }, [articleId, setFormData, setFormDataEnglish]) // Removed toast from dependencies

  // Check if there are changes
  const hasChanges = () => {
    if (!originalData) return false
    
    // Check changes in Spanish form
    const spanishChanges = 
      formData.title !== originalData.title ||
      formData.body_es !== originalData.body_es ||
      formData.author !== originalData.author ||
      formData.date !== originalData.date.split('T')[0] ||
      formData.linkUrl !== (originalData.linkUrl || '') ||
      formData.image !== null
    
    // Check changes in English form
    const englishChanges = 
      formDataEnglish.title !== originalData.title_en ||
      formDataEnglish.body_es !== originalData.body_en ||
      formDataEnglish.author !== originalData.author ||
      formDataEnglish.date !== originalData.date.split('T')[0] ||
      formDataEnglish.linkUrl !== (originalData.linkUrl || '') ||
      formDataEnglish.image !== null
    
    return spanishChanges || englishChanges
  }

  // Handle image upload event
  const handleImageUploadEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(event)
    }
  }


  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData

  // Convert File to base64
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
    // Validate required fields in both languages
    const spanishRequired = !formData.title || !formData.body_es || !formData.author
    const englishRequired = !formDataEnglish.title || !formDataEnglish.body_es || !formDataEnglish.author
    
    if (spanishRequired || englishRequired) {
      toast.warning('Debes llenar todos los campos obligatorios tanto en español como en inglés')
      return
    }

    setIsUpdating(true)
    
    try {
      // Handle image update
      let imageUrl = originalData?.imageUrl || ''
      if (getCurrentFormData().image && typeof getCurrentFormData().image === 'object') {
        imageUrl = await fileToBase64(getCurrentFormData().image!)
      }

      // Prepare article data for API
      const articleData = {
        title: formData.title.trim(),
        title_en: formDataEnglish.title.trim(),
        body_es: formData.body_es.trim(),
        body_en: formDataEnglish.body_es.trim(),
        author: formData.author.trim(),
        date: new Date(formData.date + 'T12:00:00').toISOString(),
        linkUrl: formData.linkUrl.trim() || null,
        imageUrl,
        originalImageUrl: originalData?.imageUrl
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(articleData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar artículo')
      }

      // Show success toast and redirect
      const successMessage = isEnglishMode ? 'Article updated successfully' : 'Artículo actualizado exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/articulos')
    } catch (error) {
      console.error('Error updating article:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar artículo'
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  // Translations
  const translations = {
    title: isEnglishMode ? 'Article Title' : 'Título del Artículo',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    coverImage: isEnglishMode ? 'Cover Image' : 'Imagen de Portada',
    publicationDate: isEnglishMode ? 'Publication Date' : 'Fecha de Publicación',
    description: isEnglishMode ? 'Description' : 'Descripción',
    linkUrl: isEnglishMode ? 'External Link (Optional)' : 'Enlace Externo (Opcional)',
    basicInfo: isEnglishMode ? 'Basic Information' : 'Información Básica',
    cover: isEnglishMode ? 'Cover' : 'Portada',
    editArticle: isEnglishMode ? 'Edit Article' : 'Editar Artículo',
    updateArticle: isEnglishMode ? 'Update Article' : 'Actualizar Artículo',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
    coverDescription: isEnglishMode 
      ? 'JPG, JPEG or PNG, Maximum 2MB. Drag and drop an image here.'
      : 'JPG, JPEG o PNG, Máximo 2MB. Arrastra y suelta una imagen aquí.',
    uploadImage: isEnglishMode ? 'Upload Image' : 'Subir Imagen',
    descriptionPlaceholder: isEnglishMode 
      ? 'Write the article description...'
      : 'Escribe la descripción del artículo...',
    descriptionHelp: isEnglishMode 
      ? 'General and detailed description about the article.'
      : 'Descripción general y detallada sobre el artículo.',
    linkUrlPlaceholder: isEnglishMode 
      ? 'https://example.com/article'
      : 'https://ejemplo.com/articulo',
    linkUrlHelp: isEnglishMode 
      ? 'Optional external link to the full article.'
      : 'Enlace externo opcional al artículo completo.',
    englishVersion: 'English',
    spanishVersion: 'Spanish'
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando artículo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!originalData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            Artículo no encontrado
          </h3>
          <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
            El artículo que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => router.push('/general/gestion/articulos')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
          >
            Volver a Artículos
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
          <span>Artículos</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.editArticle}</span>
        </nav>
      </div>

      {/* Header Section with Preview and Update Button */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Preview Image */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            {getCurrentFormData().image ? (
              <Image
                src={URL.createObjectURL(getCurrentFormData().image!)}
                alt="Preview"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={originalData.imageUrl}
                alt="Current article image"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Preview Info */}
          <div>
            <h1 className="font-metropolis font-bold text-2xl mb-1" style={{ color: '#0D141C' }}>
              {getCurrentFormData().title || translations.title}
            </h1>
            <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
              {getCurrentFormData().author} | {new Date(getCurrentFormData().date).getFullYear()}
            </p>
          </div>
        </div>

        {/* Language Toggle and Update Buttons */}
        <div className="flex items-center space-x-3">
          {/* Language Toggle Button */}
          <button
            onClick={() => {
              setIsEnglishMode(!isEnglishMode)
            }}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isEnglishMode ? translations.spanishVersion : translations.englishVersion}
          </button>

          {/* Update Button */}
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
              translations.updateArticle
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
              English Mode - Editing English version of the article
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border rounded-lg p-6 shadow-lg relative" style={{ borderColor: '#CFDBE8' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-8">
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

          {/* Cover Image Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.cover}
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                {translations.coverDescription}
              </p>
              <div className="flex items-center space-x-4">
                {/* Image Preview */}
                <div 
                  className={`w-32 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-dashed transition-colors cursor-pointer ${
                    isDragOver 
                      ? 'border-[#5A6F80] bg-[#E8EDF5]' 
                      : 'border-gray-300 hover:border-[#5A6F80]'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('coverImageInput')?.click()}
                >
                  {getCurrentFormData().image ? (
                    <Image
                      src={URL.createObjectURL(getCurrentFormData().image!)}
                      alt="Cover preview"
                      width={128}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={originalData?.imageUrl || ''}
                      alt="Current article image"
                      width={128}
                      height={96}
                      className="w-full h-full object-cover"
                    />
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
                    onChange={handleImageUploadEvent}
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
                value={isEnglishMode ? formData.date : getCurrentFormData().date}
                onChange={(e) => handleInputChange('date', e.target.value)}
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
              value={getCurrentFormData().body_es}
              onChange={(e) => handleInputChange('body_es', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent resize-none"
              placeholder={translations.descriptionPlaceholder}
            />
          </div>

          {/* External Link Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.linkUrl}
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              {translations.linkUrlHelp}
            </p>
            <input
              type="url"
              value={isEnglishMode ? formData.linkUrl : getCurrentFormData().linkUrl}
              onChange={(e) => handleInputChange('linkUrl', e.target.value)}
              placeholder={translations.linkUrlPlaceholder}
              disabled={isEnglishMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
