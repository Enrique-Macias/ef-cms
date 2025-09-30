'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useFundadorForm } from '@/hooks/useFundadorForm'
import { useFundadorTranslation } from '@/hooks/useFundadorTranslation'
import { createFundadorFormHandlers } from '@/utils/fundadorFormHandlers'
import { notifyAuditLogUpdate } from '@/utils/auditRefresh'

export default function AgregarFundadorPage() {
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
    getCurrentFormData,
    handleInputChange: originalHandleInputChange,
    resetForm
  } = useFundadorForm()
  
  const {
    isTranslating,
    translationCompleted,
    setTranslationCompleted,
    translateToEnglish
  } = useFundadorTranslation()
  
  // State
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Form handlers with validation
  const {
    handleInputChange,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = createFundadorFormHandlers(formData, setFormData, formDataEnglish, setFormDataEnglish, isEnglishMode, toast)

  // Handle image upload event
  const handleImageUploadEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(event)
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields in both languages
    const spanishRequired = !formData.name || !formData.role_es || !formData.body_es || !formData.image
    const englishRequired = !formDataEnglish.name || !formDataEnglish.role_es || !formDataEnglish.body_es || !formDataEnglish.image
    
    if (spanishRequired || englishRequired) {
      toast.warning('Debes llenar todos los campos obligatorios tanto en español como en inglés')
      return
    }

    setIsPublishing(true)
    
    try {
      // Convert image to base64
      const imageBase64 = await fileToBase64(formData.image!)

      // Prepare fundador data for API
      const fundadorData = {
        name: formData.name.trim(),
        role_es: formData.role_es.trim(),
        role_en: formDataEnglish.role_es.trim(),
        body_es: formData.body_es.trim(),
        body_en: formDataEnglish.body_es.trim(),
        facebookUrl: formData.facebookUrl.trim() || null,
        instagramUrl: formData.instagramUrl.trim() || null,
        imageUrl: imageBase64
      }

      const response = await fetch('/api/fundadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(fundadorData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear el fundador')
      }

      toast.success('Fundador creado exitosamente')
      resetForm()
      setIsEnglishMode(false)
      
      // Notify audit log update
      await notifyAuditLogUpdate()
      
      router.push('/general/gestion/fundadores')
    } catch (error) {
      console.error('Error creating fundador:', error)
      toast.error(`Error al crear el fundador: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleLanguageToggle = async () => {
    setIsEnglishMode(!isEnglishMode)
    if (!isEnglishMode) {
      setTranslationCompleted(false)
      await translateToEnglish(formData, setFormDataEnglish)
    }
  }

  return (
    <div className="p-6 pt-20 md:pt-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
          <span>Inicio</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>Gestión</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>Fundadores</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Agregar</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Agregar Fundador
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Crea un nuevo fundador para la plataforma
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLanguageToggle}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isEnglishMode ? 'Spanish' : 'English'}
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
                <span>Publicando...</span>
              </div>
            ) : (
              'Publicar Fundador'
            )}
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6 relative">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  value={getCurrentFormData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-[#5A6F80]"
                  placeholder="Nombre del fundador"
                  disabled={isEnglishMode}
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role_es" className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <input
                  type="text"
                  id="role_es"
                  value={getCurrentFormData.role_es}
                  onChange={(e) => handleInputChange('role_es', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-[#5A6F80]"
                  placeholder={isEnglishMode ? "Role" : "Rol del fundador"}
                />
              </div>

              {/* Body */}
              <div>
                <label htmlFor="body_es" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  id="body_es"
                  value={getCurrentFormData.body_es}
                  onChange={(e) => handleInputChange('body_es', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-[#5A6F80]"
                  placeholder={isEnglishMode ? "Description" : "Descripción del fundador"}
                />
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Redes Sociales</h3>
                
                {/* Facebook URL */}
                <div>
                  <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebookUrl"
                    value={getCurrentFormData.facebookUrl}
                    onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-[#5A6F80]"
                    placeholder="https://facebook.com/..."
                    disabled={isEnglishMode}
                  />
                </div>

                {/* Instagram URL */}
                <div>
                  <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    id="instagramUrl"
                    value={getCurrentFormData.instagramUrl}
                    onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-[#5A6F80]"
                    placeholder="https://instagram.com/..."
                    disabled={isEnglishMode}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del Fundador *
                </label>
                
                {/* Image Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? 'border-[#5A6F80] bg-[#E8EDF5]'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {getCurrentFormData.image ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto w-48 h-48">
                        <Image
                          src={URL.createObjectURL(getCurrentFormData.image!)}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: null }))
                            setFormDataEnglish(prev => ({ ...prev, image: null }))
                          }}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Eliminar imagen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">
                          <button
                            type="button"
                            className="font-medium text-[#5A6F80] hover:text-[#4A739C]"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            Haz clic para subir
                          </button>
                          {' '}o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                      </div>
                    </div>
                  )}
                  
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUploadEvent}
                    className="hidden"
                    disabled={isEnglishMode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
