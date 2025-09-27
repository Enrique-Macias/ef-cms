'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useGlobalSettingsForm } from '@/hooks/useGlobalSettingsForm'

export default function GlobalSettingsPage() {
  const router = useRouter()
  const toast = useToast()
  
  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    errors,
    handleInputChange,
    handleImageUpload,
    validateForm,
    setFormDataFromApi,
  } = useGlobalSettingsForm()

  const [isLoading, setIsLoading] = useState(true)
  const [existingSettings, setExistingSettings] = useState<{
    id: string;
    location: string;
    mail: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNumber?: string;
    mainLogo: string;
    createdAt: string;
    updatedAt: string;
  } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalData, setOriginalData] = useState<{
    location: string;
    mail: string;
    facebookUrl: string;
    instagramUrl: string;
    whatsappNumber: string;
    mainLogo: string;
  } | null>(null)

  // Load existing global settings
  useEffect(() => {
    const loadGlobalSettings = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/global-settings')
        if (response.ok) {
          const data = await response.json()
          if (data) {
            setExistingSettings(data)
            setFormDataFromApi(data)
            setOriginalData({
              location: data.location || '',
              mail: data.mail || '',
              facebookUrl: data.facebookUrl || '',
              instagramUrl: data.instagramUrl || '',
              whatsappNumber: data.whatsappNumber || '',
              mainLogo: data.mainLogo || '',
            })
          }
        }
      } catch (error) {
        console.error('Error loading global settings:', error)
        // Use toast directly without dependency to prevent infinite loop
        toast.error('Error al cargar la configuración global')
      } finally {
        setIsLoading(false)
      }
    }

    loadGlobalSettings()
  }, [setFormDataFromApi]) // Remove toast dependency to prevent infinite loop

  // Check for changes
  useEffect(() => {
    if (originalData) {
      // Editing existing settings - check if any field has changed
      const hasFormChanges = 
        formData.location !== originalData.location ||
        formData.mail !== originalData.mail ||
        formData.facebookUrl !== originalData.facebookUrl ||
        formData.instagramUrl !== originalData.instagramUrl ||
        formData.whatsappNumber !== originalData.whatsappNumber ||
        formData.mainLogo !== null // If mainLogo is not null, it means user uploaded a new image
      
      setHasChanges(hasFormChanges)
    } else {
      // Creating new settings - check if any field has content (all fields are optional)
      const hasAnyContent = 
        formData.location.trim() !== '' ||
        formData.mail.trim() !== '' ||
        formData.facebookUrl.trim() !== '' ||
        formData.instagramUrl.trim() !== '' ||
        formData.whatsappNumber.trim() !== '' ||
        formData.mainLogo !== null
      
      setHasChanges(hasAnyContent)
    }
  }, [formData, originalData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = new FormData()
      submitData.append('location', formData.location)
      submitData.append('mail', formData.mail)
      submitData.append('facebookUrl', formData.facebookUrl)
      submitData.append('instagramUrl', formData.instagramUrl)
      submitData.append('whatsappNumber', formData.whatsappNumber)
      
      if (formData.mainLogo) {
        // Convert file to base64
        const reader = new FileReader()
        reader.onload = async () => {
          const base64 = reader.result as string
          submitData.append('mainLogo', base64)
          
          if (existingSettings) {
            // Update existing settings
            const response = await fetch(`/api/global-settings/${existingSettings.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              },
              body: JSON.stringify({
                location: formData.location,
                mail: formData.mail,
                facebookUrl: formData.facebookUrl,
                instagramUrl: formData.instagramUrl,
                whatsappNumber: formData.whatsappNumber,
                mainLogo: base64,
              }),
            })

            if (response.ok) {
              toast.success('Configuración global actualizada exitosamente')
              router.refresh()
            } else {
              const errorData = await response.json()
              toast.error(errorData.error || 'Error al actualizar la configuración')
            }
          } else {
            // Create new settings
            const response = await fetch('/api/global-settings', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                location: formData.location,
                mail: formData.mail,
                facebookUrl: formData.facebookUrl,
                instagramUrl: formData.instagramUrl,
                whatsappNumber: formData.whatsappNumber,
                mainLogo: base64,
              }),
            })

            if (response.ok) {
              toast.success('Configuración global creada exitosamente')
              router.refresh()
            } else {
              const errorData = await response.json()
              toast.error(errorData.error || 'Error al crear la configuración')
            }
          }
          
          setIsSubmitting(false)
        }
        reader.readAsDataURL(formData.mainLogo)
      } else {
        // No new image uploaded, use existing one
        if (existingSettings) {
          const response = await fetch(`/api/global-settings/${existingSettings.id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location: formData.location,
              mail: formData.mail,
              facebookUrl: formData.facebookUrl,
              instagramUrl: formData.instagramUrl,
              whatsappNumber: formData.whatsappNumber,
              mainLogo: existingSettings.mainLogo,
            }),
          })

          if (response.ok) {
            toast.success('Configuración global actualizada exitosamente')
            router.refresh()
          } else {
            const errorData = await response.json()
            toast.error(errorData.error || 'Error al actualizar la configuración')
          }
        }
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error al procesar el formulario')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando configuración...</p>
          </div>
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>
            Configuración Global
          </span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Configuración Global
          </h1>
          <p className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
            Configura los ajustes generales de la aplicación
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4 lg:mt-0">
          {/* Save Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !hasChanges}
            className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
              isSubmitting || !hasChanges
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
            style={{ '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Guardando...</span>
              </div>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {existingSettings ? 'Actualizar Configuración' : 'Crear Configuración'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Section */}
          <div>
            <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
              Logo Principal
            </label>
            <div className="flex items-start space-x-6">
              {/* Current/Preview Image */}
              <div className="flex-shrink-0">
                {existingSettings?.mainLogo && !formData.mainLogo ? (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={existingSettings.mainLogo}
                      alt="Logo actual"
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : formData.mainLogo ? (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(formData.mainLogo)}
                      alt="Nuevo logo"
                      width={128}
                      height={128}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  type="file"
                  id="mainLogo"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file)
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="mainLogo"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] cursor-pointer"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {existingSettings?.mainLogo ? 'Cambiar Logo' : 'Seleccionar Logo'}
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
                {errors.mainLogo && (
                  <p className="mt-1 text-sm text-red-600">{errors.mainLogo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                placeholder="Ej: Ciudad, País"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="mail" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="mail"
                value={formData.mail}
                onChange={(e) => handleInputChange('mail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                placeholder="contacto@empresa.com"
              />
              {errors.mail && (
                <p className="mt-1 text-sm text-red-600">{errors.mail}</p>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook URL */}
            <div>
              <label htmlFor="facebookUrl" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                URL de Facebook
              </label>
              <input
                type="url"
                id="facebookUrl"
                value={formData.facebookUrl}
                onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                placeholder="https://facebook.com/empresa"
              />
            </div>

            {/* Instagram URL */}
            <div>
              <label htmlFor="instagramUrl" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                URL de Instagram
              </label>
              <input
                type="url"
                id="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                placeholder="https://instagram.com/empresa"
              />
            </div>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
              Número de WhatsApp
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
