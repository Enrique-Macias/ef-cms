'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function AgregarArticuloPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    publicationDate: new Date().toISOString().split('T')[0],
    description: '',
    linkUrl: ''
  })

  const [formDataEnglish, setFormDataEnglish] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    publicationDate: new Date().toISOString().split('T')[0],
    description: '',
    linkUrl: ''
  })

  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  
  const toast = useToast()

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  // Handle cover image upload
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isEnglishMode) {
        setFormDataEnglish(prev => ({ ...prev, coverImage: file }))
      } else {
        setFormData(prev => ({ ...prev, coverImage: file }))
      }
    }
  }

  // Handle drag and drop for cover image
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
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      if (isEnglishMode) {
        setFormDataEnglish(prev => ({ ...prev, coverImage: imageFile }))
      } else {
        setFormData(prev => ({ ...prev, coverImage: imageFile }))
      }
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
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
      coverImage: 'Imagen de Portada',
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
    
    setIsPublishing(true)
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false)
      // Show success toast
      const successMessage = isEnglishMode ? 'Article published successfully' : 'Artículo publicado exitosamente'
      toast.success(successMessage)
      // Redirect to articles listing page
      router.push('/general/gestion/articulos')
    }, 2000)
  }

  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData

  // English translations
  const translations = {
    title: isEnglishMode ? 'Article Title' : 'Título del Artículo',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    coverImage: isEnglishMode ? 'Cover Image' : 'Imagen de Portada',
    publicationDate: isEnglishMode ? 'Publication Date' : 'Fecha de Publicación',
    description: isEnglishMode ? 'Description' : 'Descripción',
    linkUrl: isEnglishMode ? 'External Link (Optional)' : 'Enlace Externo (Opcional)',
    basicInfo: isEnglishMode ? 'Basic Information' : 'Información Básica',
    cover: isEnglishMode ? 'Cover' : 'Portada',
    addArticle: isEnglishMode ? 'Add Article' : 'Agregar Artículo',
    publishArticle: isEnglishMode ? 'Publish Article' : 'Publicar Artículo',
    publishing: isEnglishMode ? 'Publishing...' : 'Publicando...',
    coverDescription: isEnglishMode 
      ? 'JPG or PNG, Maximum 300 KB. Drag and drop an image here.'
      : 'JPG o PNG, Máximo 300 KB. Arrastra y suelta una imagen aquí.',
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.addArticle}</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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
              {getCurrentFormData().author} | {new Date(getCurrentFormData().publicationDate).getFullYear()}
            </p>
          </div>
        </div>

        {/* Language Toggle and Publish Buttons */}
        <div className="flex items-center space-x-3">
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
              translations.publishArticle
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
                  {getCurrentFormData().coverImage ? (
                    <img
                      src={URL.createObjectURL(getCurrentFormData().coverImage!)}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
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
                value={getCurrentFormData().publicationDate}
                onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
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
              value={getCurrentFormData().linkUrl}
              onChange={(e) => handleInputChange('linkUrl', e.target.value)}
              placeholder={translations.linkUrlPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
