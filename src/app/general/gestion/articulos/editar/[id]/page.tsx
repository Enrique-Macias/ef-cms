'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface Article {
  id: number
  title: string
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

  const [originalData, setOriginalData] = useState<Article | null>(null)
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)
  
  const toast = useToast()

  // Mock data for articles
  const mockArticles: { [key: number]: Article } = {
    1: {
      id: 1,
      title: 'Innovación Tecnológica en el Siglo XXI',
      body_es: 'Un análisis profundo sobre cómo la tecnología está transformando nuestras vidas y el futuro de la humanidad. Exploramos las tendencias más importantes y sus implicaciones.',
      body_en: 'A deep analysis of how technology is transforming our lives and the future of humanity. We explore the most important trends and their implications.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&crop=center',
      author: 'Dr. Carlos Mendoza',
      date: '2024-01-15',
      linkUrl: 'https://example.com/article1',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    2: {
      id: 2,
      title: 'Sostenibilidad Ambiental: El Camino Hacia el Futuro',
      body_es: 'Un artículo que examina las prácticas sostenibles y su importancia para preservar nuestro planeta para las generaciones futuras.',
      body_en: 'An article examining sustainable practices and their importance for preserving our planet for future generations.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&crop=center',
      author: 'María Elena Torres',
      date: '2024-01-14',
      linkUrl: 'https://example.com/article2',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-14T14:30:00Z'
    }
  }

  // Load article data on component mount
  useEffect(() => {
    const loadArticleData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const articleData = mockArticles[parseInt(articleId)]
        if (articleData) {
          setOriginalData(articleData)
          
          // Populate Spanish form
          setFormData({
            title: articleData.title,
            author: articleData.author,
            coverImage: null,
            publicationDate: articleData.date,
            description: articleData.body_es,
            linkUrl: articleData.linkUrl || ''
          })
          
          // Populate English form
          setFormDataEnglish({
            title: articleData.title,
            author: articleData.author,
            coverImage: null,
            publicationDate: articleData.date,
            description: articleData.body_en,
            linkUrl: articleData.linkUrl || ''
          })
        }
        setIsLoading(false)
      }, 1000)
    }

    loadArticleData()
  }, [articleId])

  // Check if there are changes
  const hasChanges = () => {
    if (!originalData) return false
    
    // Check changes in Spanish form
    const spanishChanges = 
      formData.title !== originalData.title ||
      formData.author !== originalData.author ||
      formData.publicationDate !== originalData.date ||
      formData.description !== originalData.body_es ||
      formData.linkUrl !== (originalData.linkUrl || '') ||
      formData.coverImage !== null
    
    // Check changes in English form
    const englishChanges = 
      formDataEnglish.title !== originalData.title ||
      formDataEnglish.author !== originalData.author ||
      formDataEnglish.publicationDate !== originalData.date ||
      formDataEnglish.description !== originalData.body_en ||
      formDataEnglish.linkUrl !== (originalData.linkUrl || '') ||
      formDataEnglish.coverImage !== null
    
    return spanishChanges || englishChanges
  }

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
  const handleUpdate = async () => {
    // Always validate both Spanish and English versions
    const spanishRequiredFields = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      publicationDate: formData.publicationDate,
      description: formData.description.trim()
    }
    
    const englishRequiredFields = {
      title: formDataEnglish.title.trim(),
      author: formDataEnglish.author.trim(),
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
      publicationDate: 'Fecha de publicación',
      description: 'Descripción'
    }
    
    const englishFieldNames = {
      title: 'Title',
      author: 'Author',
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
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      // Show success toast and redirect
      const successMessage = isEnglishMode ? 'Article updated successfully' : 'Artículo actualizado exitosamente'
      toast.success(successMessage)
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
    editArticle: isEnglishMode ? 'Edit Article' : 'Editar Artículo',
    updateArticle: isEnglishMode ? 'Update Article' : 'Actualizar Artículo',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
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
            {getCurrentFormData().coverImage ? (
              <img
                src={URL.createObjectURL(getCurrentFormData().coverImage!)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={originalData.imageUrl}
                alt="Current article image"
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
              {getCurrentFormData().author} | {new Date(getCurrentFormData().publicationDate).getFullYear()}
            </p>
          </div>
        </div>

        {/* Language Toggle and Update Buttons */}
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
                  {getCurrentFormData().coverImage ? (
                    <img
                      src={URL.createObjectURL(getCurrentFormData().coverImage!)}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={originalData.imageUrl}
                      alt="Current article image"
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
