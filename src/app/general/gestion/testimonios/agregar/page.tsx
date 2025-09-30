'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useTestimonialForm } from '@/hooks/useTestimonialForm'
import { useTestimonialTranslation } from '@/hooks/useTestimonialTranslation'
import { fileToBase64, getImageSrc } from '@/utils/testimonialFileUtils'
import { validateTestimonialForm } from '@/utils/testimonialValidationUtils'
import { createTestimonialFormHandlers } from '@/utils/testimonialFormHandlers'
import { notifyAuditLogUpdate } from '@/utils/auditRefresh'

export default function AgregarTestimonioPage() {
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
    getCurrentFormData
  } = useTestimonialForm()

  const {
    isTranslating,
    translationCompleted,
    setTranslationCompleted,
    translateToEnglish
  } = useTestimonialTranslation()

  // State for UI
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Event handlers using utility functions
  const {
    handleInputChange,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = createTestimonialFormHandlers(formData, setFormData, formDataEnglish, setFormDataEnglish, isEnglishMode, toast)
  
  const handleLanguageToggle = async () => {
    setIsEnglishMode(!isEnglishMode)
    if (!isEnglishMode) {
      setTranslationCompleted(false)
      await translateToEnglish(formData, setFormDataEnglish)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form using utility function
    const validation = validateTestimonialForm(formData, formDataEnglish)
    
    if (!validation.isValid) {
      toast.warning(validation.errorMessage!)
      return
    }
    
    setIsPublishing(true)
    
    try {
      // Convert image to base64 if it's a File
      let imageUrl = null
      if (formData.image instanceof File) {
        imageUrl = await fileToBase64(formData.image)
      }
      
      // Prepare testimonial data
      const testimonialData = {
        author: formData.author,
        role: formData.role,
        role_en: formDataEnglish.role_en,
        body_es: formData.body,
        body_en: formDataEnglish.body,
        imageUrl
      }
      
      // Make API call
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(testimonialData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear testimonio')
      }
      
      const result = await response.json()
      
      // Show success toast
      const successMessage = isEnglishMode ? 'Testimonial created successfully' : 'Testimonio creado exitosamente'
      toast.success(successMessage)
      
      // Notify audit logs to refresh
      notifyAuditLogUpdate()
      
      // Redirect to testimonials listing page
      router.push('/general/gestion/testimonios')
    } catch (error) {
      console.error('Error creating testimonial:', error)
      toast.error(error instanceof Error ? error.message : 'Error creating testimonial')
    } finally {
      setIsPublishing(false)
    }
  }

  // English translations
  const translations = {
    title: isEnglishMode ? 'Testimonial Title' : 'Título del Testimonio',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    role: isEnglishMode ? 'Role/Position' : 'Cargo/Puesto',
    testimonial: isEnglishMode ? 'Testimonial' : 'Testimonio',
    image: isEnglishMode ? 'Profile Image' : 'Imagen de Perfil',
    basicInfo: isEnglishMode ? 'Basic Information' : 'Información Básica',
    addTestimonial: isEnglishMode ? 'Add Testimonial' : 'Agregar Testimonio',
    publishTestimonial: isEnglishMode ? 'Publish Testimonial' : 'Publicar Testimonio',
    publishing: isEnglishMode ? 'Publishing...' : 'Publicando...',
    imageDescription: isEnglishMode 
      ? 'JPG, JPEG or PNG, Maximum 2MB. Drag and drop an image here.'
      : 'JPG, JPEG o PNG, Máximo 2MB. Arrastra y suelta una imagen aquí.',
    uploadImage: isEnglishMode ? 'Upload Image' : 'Subir Imagen',
    dragDropImage: isEnglishMode ? 'Drag and drop an image here, or click to select' : 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar',
    englishVersion: 'English',
    spanishVersion: 'Spanish',
    testimonialPlaceholder: isEnglishMode 
      ? 'Enter the testimonial content...'
      : 'Ingresa el contenido del testimonio...',
    testimonialHelp: isEnglishMode 
      ? 'Share your experience and thoughts about our organization.'
      : 'Comparte tu experiencia y opiniones sobre nuestra organización.'
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
          <span>Testimonios</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.addTestimonial}</span>
        </nav>
      </div>

      {/* Header Section with Preview and Publish Button */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Preview Image */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            {getCurrentFormData().image ? (
              <Image
                src={getImageSrc(getCurrentFormData().image)!}
                alt="Preview"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Preview Info */}
          <div>
            <h1 className="font-metropolis font-bold text-2xl mb-1" style={{ color: '#0D141C' }}>
              {getCurrentFormData().author || translations.author}
            </h1>
            <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
              {getCurrentFormData().role || translations.role}
            </p>
          </div>
        </div>

        {/* Language Toggle and Publish Buttons */}
        <div className="flex items-center space-x-3">
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
              translations.publishTestimonial
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
                  {translations.author} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={isEnglishMode ? formData.author : getCurrentFormData().author || ''}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder={translations.author}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.role} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={isEnglishMode ? (getCurrentFormData().role_en || '') : (getCurrentFormData().role || '')}
                  onChange={(e) => handleInputChange(isEnglishMode ? 'role_en' : 'role', e.target.value)}
                  placeholder={translations.role}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Content Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.testimonial} <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              {translations.testimonialHelp}
            </p>
            <textarea
              value={getCurrentFormData().body || ''}
              onChange={(e) => handleInputChange('body', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent resize-none"
              placeholder={translations.testimonialPlaceholder}
            />
          </div>

          {/* Profile Image Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.image} <span className="text-red-500">*</span>
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                {translations.imageDescription}
              </p>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  isDragOver 
                    ? 'border-[#5A6F80] bg-[#E8EDF5]' 
                    : getCurrentFormData().image 
                      ? 'border-[#5A6F80] bg-[#F0F4F8]' 
                      : 'border-gray-300 hover:border-[#5A6F80] hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {getCurrentFormData().image ? (
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden">
                      <Image
                        src={getImageSrc(getCurrentFormData().image)!}
                        alt="Profile preview"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                      {getCurrentFormData().image?.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (isEnglishMode) {
                          setFormDataEnglish(prev => ({ ...prev, image: null }))
                        } else {
                          setFormData(prev => ({ ...prev, image: null }))
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-800 font-metropolis font-medium"
                    >
                      {isEnglishMode ? 'Remove' : 'Eliminar'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      {translations.dragDropImage}
                    </p>
                    {isDragOver && (
                      <p className="text-sm font-metropolis font-medium text-[#5A6F80] animate-pulse">
                        {isEnglishMode ? 'Drop here to upload!' : '¡Suelta aquí para subir!'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#5A6F80] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {translations.uploadImage}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
