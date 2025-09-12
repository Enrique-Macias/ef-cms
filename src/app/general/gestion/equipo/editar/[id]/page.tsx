'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useTeamForm } from '@/hooks/useTeamForm'
import { createTeamFormHandlers } from '@/utils/teamFormHandlers'

interface Team {
  id: string
  name: string
  role: string
  role_en: string
  instagram_url: string | null
  facebook_url: string | null
  x_url: string | null
  imageUrl: string
  createdAt: string
  updatedAt: string
}


export default function EditarEquipoPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  
  const memberId = params.id as string
  
  // Custom hooks
  const {
    formData,
    setFormData,
    formDataEnglish,
    setFormDataEnglish,
    handleInputChange: originalHandleInputChange,
    handleImageUpload: originalHandleImageUpload
  } = useTeamForm()
  
  
  // State
  const [originalData, setOriginalData] = useState<Team | null>(null)
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
  } = createTeamFormHandlers(formData, setFormData, formDataEnglish, setFormDataEnglish, isEnglishMode, toast)

  // Load team member data
  useEffect(() => {
    const loadTeamMember = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/team/${memberId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Team member not found')
          }
          throw new Error('Failed to fetch team member')
        }
        const data = await response.json()
        setOriginalData(data)
        
        // Set form data
        setFormData({
          name: data.name,
          role: data.role,
          instagram_url: data.instagram_url || '',
          facebook_url: data.facebook_url || '',
          x_url: data.x_url || '',
          image: null
        })
        
        setFormDataEnglish({
          name: data.name,
          role: data.role_en,
          instagram_url: data.instagram_url || '',
          facebook_url: data.facebook_url || '',
          x_url: data.x_url || '',
          image: null
        })
      } catch (error) {
        console.error('Error loading team member:', error)
        toast.error('Error al cargar el miembro del equipo')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTeamMember()
  }, [memberId, setFormData, setFormDataEnglish]) // Removed toast from dependencies

  // Handle image upload event
  const handleImageUploadEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(event)
    }
  }

  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData

  // Check if there are changes
  const hasChanges = () => {
    if (!originalData) return false
    
    // Check changes in Spanish form
    const spanishChanges = 
      formData.name !== originalData.name ||
      formData.role !== originalData.role ||
      formData.instagram_url !== (originalData.instagram_url || '') ||
      formData.facebook_url !== (originalData.facebook_url || '') ||
      formData.x_url !== (originalData.x_url || '') ||
      formData.image !== null
    
    // Check changes in English form
    const englishChanges = 
      formDataEnglish.name !== originalData.name ||
      formDataEnglish.role !== originalData.role_en ||
      formDataEnglish.instagram_url !== (originalData.instagram_url || '') ||
      formDataEnglish.facebook_url !== (originalData.facebook_url || '') ||
      formDataEnglish.x_url !== (originalData.x_url || '') ||
      formDataEnglish.image !== null
    
    return spanishChanges || englishChanges
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
  const handleUpdate = async () => {
    // Validate required fields in both languages
    const spanishRequired = !formData.name || !formData.role
    const englishRequired = !formDataEnglish.name || !formDataEnglish.role
    
    if (spanishRequired || englishRequired) {
      toast.warning('Debes llenar todos los campos obligatorios tanto en español como en inglés')
      return
    }

    setIsUpdating(true)
    
    try {
      // Convert image to base64 if it's a File
      let imageUrl = originalData?.imageUrl || ''
      if (getCurrentFormData().image && typeof getCurrentFormData().image === 'object') {
        imageUrl = await fileToBase64(getCurrentFormData().image!)
      }

      // Prepare team data for API
      const teamData = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        role_en: formDataEnglish.role.trim(),
        instagram_url: formData.instagram_url.trim() || null,
        facebook_url: formData.facebook_url.trim() || null,
        x_url: formData.x_url.trim() || null,
        imageUrl,
        originalImageUrl: originalData?.imageUrl
      }

      const response = await fetch(`/api/team/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update team member')
      }

      // Show success toast
      const successMessage = isEnglishMode ? 'Team member updated successfully' : 'Miembro del equipo actualizado exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/equipo')
    } catch (error) {
      console.error('Error updating team member:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar miembro del equipo'
      toast.error(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  // Translations
  const translations = {
    editTeamMember: isEnglishMode ? 'Edit Team Member' : 'Editar Miembro del Equipo',
    updateMember: isEnglishMode ? 'Update Member' : 'Actualizar Miembro',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando miembro del equipo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!originalData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            Miembro del equipo no encontrado
          </h3>
          <button
            onClick={() => router.push('/general/gestion/equipo')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C]"
          >
            Volver a Equipo
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
          <span>Equipo</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.editTeamMember}</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Team Member Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
            {getCurrentFormData().image ? (
              <Image
                src={URL.createObjectURL(getCurrentFormData().image!)}
                alt="Team member cover preview"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={originalData?.imageUrl || ''}
                alt="Current team member image"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Team Member Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {translations.editTeamMember}
            </h1>
            <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
              {originalData?.name}
            </p>
          </div>
        </div>

        {/* Language Toggle and Update Buttons */}
        <div className="flex items-center space-x-3">
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
              translations.updateMember
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
              English Mode - Editing English version of the team member
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border rounded-lg p-6 shadow-lg relative" style={{ borderColor: '#CFDBE8' }}>
        <div className="space-y-8">
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
                  value={isEnglishMode ? formData.name : getCurrentFormData().name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                  value={getCurrentFormData().role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
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
                  value={isEnglishMode ? formData.instagram_url : getCurrentFormData().instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://instagram.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.facebook} <span className="text-gray-500 text-xs">{translations.optional}</span>
                </label>
                <input
                  type="url"
                  value={isEnglishMode ? formData.facebook_url : getCurrentFormData().facebook_url}
                  onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://facebook.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.x} <span className="text-gray-500 text-xs">{translations.optional}</span>
                </label>
                <input
                  type="url"
                  value={isEnglishMode ? formData.x_url : getCurrentFormData().x_url}
                  onChange={(e) => handleInputChange('x_url', e.target.value)}
                  disabled={isEnglishMode}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent ${
                    isEnglishMode ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="https://x.com/username"
                />
              </div>
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
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
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
                ) : originalData?.imageUrl ? (
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden">
                      <Image
                        src={originalData.imageUrl}
                        alt="Current profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                      Imagen actual
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
                onChange={handleImageUploadEvent}
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
