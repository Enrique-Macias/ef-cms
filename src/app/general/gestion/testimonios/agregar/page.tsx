'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface FormData {
  author: string
  role: string
  body: string
  image: File | null
}

interface FormDataEnglish {
  author: string
  role: string
  body: string
  image: File | null
}

export default function AgregarTestimonioPage() {
  const router = useRouter()
  const toast = useToast()
  
  // State
  const [formData, setFormData] = useState<FormData>({
    author: '',
    role: '',
    body: '',
    image: null
  })
  
  const [formDataEnglish, setFormDataEnglish] = useState<FormDataEnglish>({
    author: '',
    role: '',
    body: '',
    image: null
  })
  
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isEnglishMode) {
        setFormDataEnglish(prev => ({ ...prev, image: file }))
      } else {
        setFormData(prev => ({ ...prev, image: file }))
      }
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const imageFile = files[0]
      if (imageFile.type.startsWith('image/')) {
        if (isEnglishMode) {
          setFormDataEnglish(prev => ({ ...prev, image: imageFile }))
        } else {
          setFormData(prev => ({ ...prev, image: imageFile }))
        }
      }
    }
  }

  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields in both languages
    const spanishRequired = !formData.author || !formData.role || !formData.body || !formData.image
    const englishRequired = !formDataEnglish.author || !formDataEnglish.role || !formDataEnglish.body || !formDataEnglish.image
    
    if (spanishRequired || englishRequired) {
      toast.warning('Debes llenar todos los campos obligatorios tanto en español como en inglés')
      return
    }

    setIsPublishing(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsPublishing(false)
      toast.success('Testimonio publicado exitosamente')
      router.push('/general/gestion/testimonios')
    }, 2000)
  }

  // Translations
  const translations = {
    addTestimonial: isEnglishMode ? 'Add Testimonial' : 'Agregar Testimonio',
    publishTestimonial: isEnglishMode ? 'Publish Testimonial' : 'Publicar Testimonio',
    publishing: isEnglishMode ? 'Publishing...' : 'Publicando...',
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

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            {translations.addTestimonial}
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Crea un nuevo testimonio para la plataforma
          </p>
        </div>

        {/* Language Toggle and Publish Buttons */}
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
              English Mode - Filling English version of the testimonial
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ borderColor: '#CFDBE8' }}>
        <form onSubmit={handleSubmit} className="space-y-8">
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
                  placeholder={isEnglishMode ? 'Enter author name' : 'Ingresa el nombre del autor'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.role} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                  placeholder={isEnglishMode ? 'Enter role/position' : 'Ingresa el cargo o puesto'}
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
                placeholder={isEnglishMode ? 'Enter the testimonial content' : 'Ingresa el contenido del testimonio'}
              />
            </div>
          </div>

          {/* Profile Image */}
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
                      <img
                        src={URL.createObjectURL(getCurrentFormData().image!)}
                        alt="Profile preview"
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
        </form>
      </div>
    </div>
  )
}
