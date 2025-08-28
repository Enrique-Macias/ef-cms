'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

// Mock data for team members
const mockTeamData = {
  1: {
    spanish: {
      name: 'María González',
      role: 'CEO & Fundadora',
      instagram_url: 'https://instagram.com/mariagonzalez',
      facebook_url: 'https://facebook.com/mariagonzalez',
      x_url: 'https://x.com/mariagonzalez',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
    },
    english: {
      name: 'María González',
      role: 'CEO & Founder',
      instagram_url: 'https://instagram.com/mariagonzalez',
      facebook_url: 'https://facebook.com/mariagonzalez',
      x_url: 'https://x.com/mariagonzalez',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  2: {
    spanish: {
      name: 'Carlos Rodríguez',
      role: 'Director de Tecnología',
      instagram_url: 'https://instagram.com/carlosrodriguez',
      facebook_url: null,
      x_url: 'https://x.com/carlosrodriguez',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    english: {
      name: 'Carlos Rodríguez',
      role: 'Technology Director',
      instagram_url: 'https://instagram.com/carlosrodriguez',
      facebook_url: null,
      x_url: 'https://x.com/carlosrodriguez',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  3: {
    spanish: {
      name: 'Ana Martínez',
      role: 'Directora de Marketing',
      instagram_url: 'https://instagram.com/anamartinez',
      facebook_url: 'https://facebook.com/anamartinez',
      x_url: null,
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    english: {
      name: 'Ana Martínez',
      role: 'Marketing Director',
      instagram_url: 'https://instagram.com/anamartinez',
      facebook_url: 'https://facebook.com/anamartinez',
      x_url: null,
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  }
}

interface FormData {
  name: string
  role: string
  instagram_url: string
  facebook_url: string
  x_url: string
  image: File | null
}

interface FormDataEnglish {
  name: string
  role: string
  instagram_url: string
  facebook_url: string
  x_url: string
  image: File | null
}

export default function EditarEquipoPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  
  const memberId = params.id as string
  
  // State
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    instagram_url: '',
    facebook_url: '',
    x_url: '',
    image: null
  })
  
  const [formDataEnglish, setFormDataEnglish] = useState<FormDataEnglish>({
    name: '',
    role: '',
    instagram_url: '',
    facebook_url: '',
    x_url: '',
    image: null
  })
  
  const [originalData, setOriginalData] = useState<typeof mockTeamData[keyof typeof mockTeamData] | null>(null)
  const [originalDataEnglish, setOriginalDataEnglish] = useState<typeof mockTeamData[keyof typeof mockTeamData]['english'] | null>(null)
  
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)

  // Load team member data
  useEffect(() => {
    const loadTeamMember = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const data = mockTeamData[memberId as '1' | '2' | '3']
        if (data) {
          setOriginalData(data)
          setOriginalDataEnglish(data.english)
          
          // Set form data
          setFormData({
            name: data.spanish.name,
            role: data.spanish.role,
            instagram_url: data.spanish.instagram_url || '',
            facebook_url: data.spanish.facebook_url || '',
            x_url: data.spanish.x_url || '',
            image: null
          })
          
          setFormDataEnglish({
            name: data.english.name,
            role: data.english.role,
            instagram_url: data.english.instagram_url || '',
            facebook_url: data.english.facebook_url || '',
            x_url: data.english.x_url || '',
            image: null
          })
        }
        setIsLoading(false)
      }, 1000)
    }
    
    loadTeamMember()
  }, [memberId])

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

  // Check if there are changes
  const hasChanges = () => {
    if (!originalData) return false
    
    // Check changes in Spanish form
    const spanishChanges = 
      formData.name !== originalData.spanish.name ||
      formData.role !== originalData.spanish.role ||
      formData.instagram_url !== (originalData.spanish.instagram_url || '') ||
      formData.facebook_url !== (originalData.spanish.facebook_url || '') ||
      formData.x_url !== (originalData.spanish.x_url || '') ||
      formData.image !== null
    
    // Check changes in English form
    const englishChanges = 
      formDataEnglish.name !== originalData.english.name ||
      formDataEnglish.role !== originalData.english.role ||
      formDataEnglish.instagram_url !== (originalData.english.instagram_url || '') ||
      formDataEnglish.facebook_url !== (originalData.english.facebook_url || '') ||
      formDataEnglish.x_url !== (originalData.english.x_url || '') ||
      formDataEnglish.image !== null
    
    return spanishChanges || englishChanges
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
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      const successMessage = isEnglishMode ? 'Team member updated successfully' : 'Miembro del equipo actualizado exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/equipo')
    }, 2000)
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
      ? 'JPG or PNG, Maximum 300 KB. Drag and drop an image here.'
      : 'JPG o PNG, Máximo 300 KB. Arrastra y suelta una imagen aquí.',
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
              <img
                src={URL.createObjectURL(getCurrentFormData().image!)}
                alt="Team member cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={isEnglishMode ? originalData.english.imageUrl : originalData.spanish.imageUrl}
                alt="Current team member image"
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
              {isEnglishMode ? originalData.english.name : originalData.spanish.name}
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
      <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ borderColor: '#CFDBE8' }}>
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
                  value={getCurrentFormData().name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
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
                  value={getCurrentFormData().instagram_url}
                  onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                  placeholder="https://instagram.com/username"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                  placeholder="https://facebook.com/username"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
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
        </div>
      </div>
    </div>
  )
}
