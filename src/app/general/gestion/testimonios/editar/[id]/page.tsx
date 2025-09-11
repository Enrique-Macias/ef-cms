'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useTestimonialForm } from '@/hooks/useTestimonialForm'
import { fileToBase64 } from '@/utils/testimonialFileUtils'
import { validateTestimonialForm } from '@/utils/testimonialValidationUtils'
import { createTestimonialInputHandler, createTestimonialImageHandlers, createTestimonialDragHandlers } from '@/utils/testimonialFormHandlers'

export default function EditarTestimonioPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  
  const testimonialId = params.id as string
  
  // Use testimonial form hook
  const {
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    isEnglishMode,
    setIsEnglishMode,
    getCurrentFormData
  } = useTestimonialForm()
  
  // State
  const [testimonial, setTestimonial] = useState<Record<string, unknown> | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)

  // Load testimonial data
  useEffect(() => {
    const loadTestimonial = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/testimonials/${testimonialId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch testimonial')
        }
        const data = await response.json()
        setTestimonial(data)
        setCurrentImageUrl(data.imageUrl) // Store the current image URL
        
        // Set form data
        setFormData({
          author: data.author,
          role: data.role,
          role_en: data.role_en || '',
          body: data.body_es,
          image: null
        })
        
        setFormDataEnglish({
          author: data.author,
          role: data.role,
          role_en: data.role_en || '',
          body: data.body_en,
          image: null
        })
      } catch (error) {
        console.error('Error loading testimonial:', error)
        // Use toast directly without dependency
        toast.error('Error al cargar el testimonio')
        setTestimonial(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTestimonial()
  }, [testimonialId]) // Remove toast dependency to prevent infinite loop

  // Form handlers using utility functions
  const handleInputChange = createTestimonialInputHandler(
    isEnglishMode,
    setFormData,
    setFormDataEnglish
  )

  const { handleImageUpload } = createTestimonialImageHandlers(
    setFormData,
    setFormDataEnglish
  )

  const { handleDragOver, handleDragLeave, handleDrop } = createTestimonialDragHandlers(
    setIsDragOver,
    setFormData,
    setFormDataEnglish
  )

  // Check if there are changes
  const hasChanges = () => {
    if (!testimonial) return false
    
    // Check changes in Spanish form
    const spanishChanges = 
      formData.author !== testimonial.author ||
      formData.role !== testimonial.role ||
      formData.body !== testimonial.body_es ||
      formData.image !== null
    
    // Check changes in English form
    const englishChanges = 
      formDataEnglish.author !== testimonial.author ||
      formDataEnglish.role !== testimonial.role ||
      formDataEnglish.role_en !== testimonial.role_en ||
      formDataEnglish.body !== testimonial.body_en ||
      formDataEnglish.image !== null
    
    return spanishChanges || englishChanges
  }

  // Handle form submission
  const handleUpdate = async () => {
    // Validate form using utility function
    const validation = validateTestimonialForm(formData, formDataEnglish)
    
    if (!validation.isValid) {
      toast.warning(validation.errorMessage!)
      return
    }

    setIsUpdating(true)
    
    try {
      // Convert image to base64 if it's a File
      let imageUrl = testimonial?.imageUrl // Keep existing image by default
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
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update testimonial')
      }
      
      // Show success toast
      const successMessage = isEnglishMode ? 'Testimonial updated successfully' : 'Testimonio actualizado exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/testimonios')
    } catch (error) {
      console.error('Error updating testimonial:', error)
      const errorMessage = isEnglishMode ? 'Failed to update testimonial' : 'Error al actualizar el testimonio'
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  // Translations
  const translations = {
    editTestimonial: isEnglishMode ? 'Edit Testimonial' : 'Editar Testimonio',
    updateTestimonial: isEnglishMode ? 'Update Testimonial' : 'Actualizar Testimonio',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    role: isEnglishMode ? 'Role/Position' : 'Cargo/Puesto',
    testimonial: isEnglishMode ? 'Testimonial' : 'Testimonio',
    image: isEnglishMode ? 'Profile Image' : 'Imagen de Perfil',
    imageDescription: isEnglishMode 
      ? 'JPG or PNG, Maximum 300 KB. Drag and drop an image here.'
      : 'JPG o PNG, Máximo 300 KB. Arrastra y suelta una imagen aquí.',
    uploadImage: isEnglishMode ? 'Upload Image' : 'Subir Imagen',
    dragDropImage: isEnglishMode ? 'Drag and drop an image here, or click to select' : 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar',
    englishVersion: 'English Version',
    spanishVersion: 'Spanish Version'
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando testimonio...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!testimonial) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            Testimonio no encontrado
          </h3>
          <button
            onClick={() => router.push('/general/gestion/testimonios')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C]"
          >
            Volver a Testimonios
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
          <span>Testimonios</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.editTestimonial}</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Testimonial Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
            {getCurrentFormData().image ? (
              <Image
                src={URL.createObjectURL(getCurrentFormData().image!)}
                alt="Testimonial cover preview"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={currentImageUrl || ''}
                alt="Current testimonial image"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Testimonial Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {translations.editTestimonial}
            </h1>
            <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
              {String(testimonial?.author)}
            </p>
          </div>
        </div>

        {/* Language Toggle and Update Buttons */}
        <div className="flex items-center space-x-3">
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
              translations.updateTestimonial
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
              English Mode - Editing English version of the testimonial
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
                  {translations.author} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Content */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.testimonial}
            </h2>
            <div>
              <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                {translations.testimonial} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={getCurrentFormData().body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
              />
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.image}
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                {translations.imageDescription}
              </p>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  getCurrentFormData().image 
                    ? 'border-[#5A6F80] bg-[#F0F4F8]' 
                    : 'border-gray-300 hover:border-[#5A6F80] hover:bg-gray-50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragOver(true)}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                {getCurrentFormData().image ? (
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden">
                      <Image
                        src={URL.createObjectURL(getCurrentFormData().image!)}
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
                ) : currentImageUrl ? (
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden">
                      <Image
                        src={currentImageUrl}
                        alt="Current profile image"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                      Imagen actual
                    </p>
                    <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      {translations.dragDropImage}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      {translations.dragDropImage}
                    </p>
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
