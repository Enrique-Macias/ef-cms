'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useTeamForm } from '@/hooks/useTeamForm'
import { useTeamTranslation } from '@/hooks/useTeamTranslation'
import { createTeamFormHandlers } from '@/utils/teamFormHandlers'
import { notifyAuditLogUpdate } from '@/utils/auditRefresh'


export default function AgregarEquipoPage() {
  const router = useRouter()
  const toast = useToast()
  
  // Custom hooks
  const {
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    handleInputChange: originalHandleInputChange,
    resetForm
  } = useTeamForm()
  
  const {
    isTranslating,
    translateRoleToEnglish,
    setTranslationCompleted
  } = useTeamTranslation()
  
  // State
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // Form handlers with validation
  const {
    handleInputChange,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = createTeamFormHandlers(formData, setFormData, formDataEnglish, setFormDataEnglish, isEnglishMode, toast)

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields in both languages
    const spanishRequired = !formData.name || !formData.role || !formData.image
    const englishRequired = !formDataEnglish.name || !formDataEnglish.role || !formDataEnglish.image
    
    if (spanishRequired || englishRequired) {
      toast.warning('Debes llenar todos los campos obligatorios tanto en español como en inglés')
      return
    }

    setIsPublishing(true)
    
    try {
      // Convert image to base64
      const imageBase64 = await fileToBase64(formData.image!)

      // Prepare team data for API
      const teamData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        role_en: formDataEnglish.role.trim(),
        instagram_url: formData.instagram_url.trim() || null,
        facebook_url: formData.facebook_url.trim() || null,
        x_url: formData.x_url.trim() || null,
        imageUrl: imageBase64
      }

      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(teamData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create team member')
      }

      // Show success toast
      const successMessage = isEnglishMode ? 'Team member added successfully' : 'Miembro del equipo agregado exitosamente'
      toast.success(successMessage)
      
      // Notify audit logs to refresh
      notifyAuditLogUpdate()
      
      // Reset form and redirect
      resetForm()
      router.push('/general/gestion/equipo')
    } catch (error) {
      console.error('Error creating team member:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al crear miembro del equipo'
      toast.error(errorMessage)
    } finally {
      setIsPublishing(false)
    }
  }

  // Translations
  const translations = {
    addTeamMember: isEnglishMode ? 'Add Team Member' : 'Agregar Miembro del Equipo',
    publishMember: isEnglishMode ? 'Add Member' : 'Agregar Miembro',
    publishing: isEnglishMode ? 'Adding...' : 'Agregando...',
    name: isEnglishMode ? 'Member Name' : 'Nombre del miembro',
    role: isEnglishMode ? 'Role/Position' : 'Cargo/Puesto',
    instagram: isEnglishMode ? 'Instagram URL' : 'URL de Instagram',
    facebook: isEnglishMode ? 'Facebook URL' : 'URL de Facebook',
    x: isEnglishMode ? 'X (Twitter) URL' : 'URL de X (Twitter)',
    image: isEnglishMode ? 'Profile Image' : 'Imagen de Perfil',
    imageDescription: isEnglishMode 
      ? 'JPG, JPEG or PNG, Maximum 2MB. Drag and drop an image here.'
      : 'JPG, JPEG o PNG, Máximo 2MB. Arrastra y suelta una imagen aquí.',
    uploadImage: isEnglishMode ? 'Upload Image' : 'Subir Imagen',
    dragDropImage: isEnglishMode ? 'Drag and drop an image here, or click to select' : 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar',
    englishVersion: 'English Version',
    spanishVersion: 'Spanish Version',
    basicInfo: isEnglishMode ? 'Basic Information' : 'Información Básica',
    socialMedia: isEnglishMode ? 'Social Media' : 'Redes Sociales',
    optional: isEnglishMode ? '(Optional)' : '(Opcional)'
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
          <span>Equipo</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.addTeamMember}</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            {translations.addTeamMember}
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Agrega un nuevo miembro al equipo de la plataforma
          </p>
        </div>

        {/* Language Toggle and Publish Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={async () => {
              if (!isEnglishMode) {
                // Switch to English mode and trigger translation
                setIsEnglishMode(true)
                setTranslationCompleted(false)
                
                // Copy all fields from Spanish to English form
                setFormDataEnglish(prev => ({
                  ...prev,
                  name: formData.name,
                  instagram_url: formData.instagram_url,
                  facebook_url: formData.facebook_url,
                  x_url: formData.x_url,
                  image: formData.image
                }))
                
                // Translate role if it exists
                if (formData.role.trim()) {
                  const translatedRole = await translateRoleToEnglish(formData.role)
                  if (translatedRole) {
                    setFormDataEnglish(prev => ({ ...prev, role: translatedRole }))
                  }
                }
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
              translations.publishMember
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
              English Mode - Filling English version of the team member
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.basicInfo}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder={isEnglishMode ? 'Enter member name' : 'Ingresa el nombre del miembro'}
                  disabled={isEnglishMode}
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

          {/* Social Media */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.socialMedia}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.instagram} <span className="text-gray-500 text-xs">{translations.optional}</span>
                </label>
                <input
                  type="url"
                  value={getCurrentFormData().instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://instagram.com/username"
                  disabled={isEnglishMode}
                />
              </div>
              
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.facebook} <span className="text-gray-500 text-xs">{translations.optional}</span>
                </label>
                <input
                  type="url"
                  value={getCurrentFormData().facebook_url}
                  onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://facebook.com/username"
                  disabled={isEnglishMode}
                />
              </div>
              
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.x} <span className="text-gray-500 text-xs">{translations.optional}</span>
                </label>
                <input
                  type="url"
                  value={getCurrentFormData().x_url}
                  onChange={(e) => handleInputChange('x_url', e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://x.com/username"
                  disabled={isEnglishMode}
                />
              </div>
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
                    : isEnglishMode 
                      ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                      : 'border-gray-300 hover:border-[#5A6F80] hover:bg-gray-50'
                }`}
                onDragOver={isEnglishMode ? undefined : handleDragOver}
                onDragLeave={isEnglishMode ? undefined : handleDragLeave}
                onDrop={isEnglishMode ? undefined : handleDrop}
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
                        // Create a synthetic event to remove the image
                        const syntheticEvent = {
                          target: { files: null }
                        } as React.ChangeEvent<HTMLInputElement>
                        handleImageUpload(syntheticEvent)
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
                onChange={handleImageUploadEvent}
                className="hidden"
                id="image-upload"
                disabled={isEnglishMode}
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#5A6F80] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] ${
                  isEnglishMode 
                    ? 'cursor-not-allowed bg-gray-100 opacity-50' 
                    : 'cursor-pointer bg-white hover:bg-gray-50'
                }`}
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
