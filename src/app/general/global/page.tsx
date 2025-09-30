'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useGlobalSettingsForm } from '@/hooks/useGlobalSettingsForm'
import { usePagosForm } from '@/hooks/usePagosForm'
import { useContactPersonTranslation } from '@/hooks/useContactPersonTranslation'
import { useAuth } from '@/contexts/AuthContext'

export default function GlobalSettingsPage() {
  const router = useRouter()
  const toast = useToast()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  
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

  const {
    formData: pagosFormData,
    isSubmitting: isPagosSubmitting,
    setIsSubmitting: setIsPagosSubmitting,
    errors: pagosErrors,
    handleInputChange: handlePagosInputChange,
    validateForm: validatePagosForm,
    setFormDataFromApi: setPagosFormDataFromApi,
  } = usePagosForm()

  const {
    isTranslating: isTranslatingRole,
    translateRoleToEnglish,
  } = useContactPersonTranslation()

  const [isLoading, setIsLoading] = useState(true)
  const [existingSettings, setExistingSettings] = useState<{
    id: string;
    location: string;
    mail: string;
    facebookUrl?: string;
    instagramUrl?: string;
    whatsappNumber?: string;
    web3formsKey?: string;
    mainLogo: string;
    contactPersonImageUrl?: string;
    contactPersonName?: string;
    contactPersonRoleEs?: string;
    contactPersonRoleEn?: string;
    createdAt: string;
    updatedAt: string;
  } | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [hasPagosChanges, setHasPagosChanges] = useState(false)
  const [activeTab, setActiveTab] = useState<'contacto' | 'marca' | 'pagos'>('contacto')
  const [existingPagos, setExistingPagos] = useState<{
    id: string;
    paystripeCode: string | null;
    paypalUrl: string | null;
    createdAt: string;
    updatedAt: string;
  } | null>(null)
  const [originalData, setOriginalData] = useState<{
    location: string;
    mail: string;
    facebookUrl: string;
    instagramUrl: string;
    whatsappNumber: string;
    web3formsKey: string;
    mainLogo: string;
    contactPersonImageUrl: string;
    contactPersonName: string;
    contactPersonRoleEs: string;
    contactPersonRoleEn: string;
  } | null>(null)
  const [originalPagosData, setOriginalPagosData] = useState<{
    paystripeCode: string;
    paypalUrl: string;
  } | null>(null)

  // Load existing global settings and pagos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        // Load global settings
        const globalResponse = await fetch('/api/global-settings')
        if (globalResponse.ok) {
          const globalData = await globalResponse.json()
          if (globalData) {
            setExistingSettings(globalData)
            setFormDataFromApi(globalData)
            setOriginalData({
              location: globalData.location || '',
              mail: globalData.mail || '',
              facebookUrl: globalData.facebookUrl || '',
              instagramUrl: globalData.instagramUrl || '',
              whatsappNumber: globalData.whatsappNumber || '',
              web3formsKey: globalData.web3formsKey || '',
              mainLogo: globalData.mainLogo || '',
              contactPersonImageUrl: globalData.contactPersonImageUrl || '',
              contactPersonName: globalData.contactPersonName || '',
              contactPersonRoleEs: globalData.contactPersonRoleEs || '',
              contactPersonRoleEn: globalData.contactPersonRoleEn || '',
            })
          }
        }

        // Load pagos
        const pagosResponse = await fetch('/api/pagos')
        if (pagosResponse.ok) {
          const pagosData = await pagosResponse.json()
          if (pagosData) {
            setExistingPagos(pagosData)
            setPagosFormDataFromApi(pagosData)
            setOriginalPagosData({
              paystripeCode: pagosData.paystripeCode || '',
              paypalUrl: pagosData.paypalUrl || '',
            })
          }
        }
      } catch (error) {
        console.error('Error loading data:', error)
        // Use toast directly without dependency to prevent infinite loop
        toast.error('Error al cargar la configuración')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [setFormDataFromApi, setPagosFormDataFromApi]) // Remove toast dependency to prevent infinite loop

  // Check for changes in global settings
  useEffect(() => {
    if (originalData) {
      // Editing existing settings - check if any field has changed
      const hasFormChanges = 
        formData.location !== originalData.location ||
        formData.mail !== originalData.mail ||
        formData.facebookUrl !== originalData.facebookUrl ||
        formData.instagramUrl !== originalData.instagramUrl ||
        formData.whatsappNumber !== originalData.whatsappNumber ||
        formData.web3formsKey !== originalData.web3formsKey ||
        formData.mainLogo !== null || // If mainLogo is not null, it means user uploaded a new image
        formData.contactPersonImageUrl !== originalData.contactPersonImageUrl ||
        formData.contactPersonName !== originalData.contactPersonName ||
        formData.contactPersonRoleEs !== originalData.contactPersonRoleEs ||
        formData.contactPersonRoleEn !== originalData.contactPersonRoleEn
      
      setHasChanges(hasFormChanges)
    } else {
      // Creating new settings - check if any field has content (all fields are optional)
      const hasAnyContent = 
        formData.location.trim() !== '' ||
        formData.mail.trim() !== '' ||
        formData.facebookUrl.trim() !== '' ||
        formData.instagramUrl.trim() !== '' ||
        formData.whatsappNumber.trim() !== '' ||
        formData.web3formsKey.trim() !== '' ||
        formData.mainLogo !== null ||
        formData.contactPersonImageUrl.trim() !== '' ||
        formData.contactPersonName.trim() !== '' ||
        formData.contactPersonRoleEs.trim() !== '' ||
        formData.contactPersonRoleEn.trim() !== ''
      
      setHasChanges(hasAnyContent)
    }
  }, [formData, originalData])

  // Check for changes in pagos
  useEffect(() => {
    if (originalPagosData) {
      // Editing existing pagos - check if any field has changed
      const hasPagosFormChanges = 
        pagosFormData.paystripeCode !== originalPagosData.paystripeCode ||
        pagosFormData.paypalUrl !== originalPagosData.paypalUrl
      
      setHasPagosChanges(hasPagosFormChanges)
    } else {
      // Creating new pagos - check if any field has content (all fields are optional)
      const hasAnyPagosContent = 
        pagosFormData.paystripeCode.trim() !== '' ||
        pagosFormData.paypalUrl.trim() !== ''
      
      setHasPagosChanges(hasAnyPagosContent)
    }
  }, [pagosFormData, originalPagosData])

  // Handle role translation
  const handleRoleChange = async (roleEs: string) => {
    handleInputChange('contactPersonRoleEs', roleEs)
    
    if (roleEs.trim()) {
      const translatedRole = await translateRoleToEnglish(roleEs)
      if (translatedRole) {
        handleInputChange('contactPersonRoleEn', translatedRole)
      }
    } else {
      handleInputChange('contactPersonRoleEn', '')
    }
  }

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
      submitData.append('web3formsKey', formData.web3formsKey)
      submitData.append('contactPersonImageUrl', formData.contactPersonImageUrl)
      submitData.append('contactPersonName', formData.contactPersonName)
      submitData.append('contactPersonRoleEs', formData.contactPersonRoleEs)
      submitData.append('contactPersonRoleEn', formData.contactPersonRoleEn)
      
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
                web3formsKey: formData.web3formsKey,
                mainLogo: base64,
                contactPersonImageUrl: formData.contactPersonImageUrl,
                contactPersonName: formData.contactPersonName,
                contactPersonRoleEs: formData.contactPersonRoleEs,
                contactPersonRoleEn: formData.contactPersonRoleEn,
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
                web3formsKey: formData.web3formsKey,
                mainLogo: base64,
                contactPersonImageUrl: formData.contactPersonImageUrl,
                contactPersonName: formData.contactPersonName,
                contactPersonRoleEs: formData.contactPersonRoleEs,
                contactPersonRoleEn: formData.contactPersonRoleEn,
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
                web3formsKey: formData.web3formsKey,
                mainLogo: existingSettings.mainLogo,
                contactPersonImageUrl: formData.contactPersonImageUrl,
                contactPersonName: formData.contactPersonName,
                contactPersonRoleEs: formData.contactPersonRoleEs,
                contactPersonRoleEn: formData.contactPersonRoleEn,
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

  const handlePagosSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePagosForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    setIsPagosSubmitting(true)

    try {
      if (existingPagos) {
        // Update existing pagos
        const response = await fetch(`/api/pagos/${existingPagos.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paystripeCode: pagosFormData.paystripeCode,
            paypalUrl: pagosFormData.paypalUrl,
          }),
        })

        if (response.ok) {
          toast.success('Configuración de pagos actualizada exitosamente')
          router.refresh()
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || 'Error al actualizar la configuración de pagos')
        }
      } else {
        // Create new pagos
        const response = await fetch('/api/pagos', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paystripeCode: pagosFormData.paystripeCode,
            paypalUrl: pagosFormData.paypalUrl,
          }),
        })

        if (response.ok) {
          toast.success('Configuración de pagos creada exitosamente')
          router.refresh()
        } else {
          const errorData = await response.json()
          toast.error(errorData.error || 'Error al crear la configuración de pagos')
        }
      }
    } catch (error) {
      console.error('Error submitting pagos form:', error)
      toast.error('Error al procesar el formulario de pagos')
    } finally {
      setIsPagosSubmitting(false)
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Verificando permisos...</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-gray-600">
              Debes iniciar sesión para acceder a esta página.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Check if user has ADMIN role
  if (user && user.role !== 'ADMIN') {
    return (
      <div className="p-6 pt-20 md:pt-6">
        {/* Breadcrumbs - Left aligned */}
        <div className="mb-6">
          <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
            <span>Inicio</span>
            <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
            <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Configuración Global</span>
          </nav>
        </div>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            {/* Access Denied Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Access Denied Content */}
            <h1 className="font-metropolis font-bold text-2xl mb-3" style={{ color: '#0D141C' }}>
              Acceso Denegado
            </h1>
            
            <h2 className="font-metropolis font-semibold text-lg mb-4" style={{ color: '#0D141C' }}>
              Configuración Global
            </h2>
            
            <p className="text-base font-metropolis font-regular mb-6" style={{ color: '#4A739C' }}>
              No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar la configuración global del sistema.
            </p>

            {/* Current User Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6" style={{ backgroundColor: '#F8FAFC' }}>
              <p className="text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
                Usuario actual:
              </p>
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {user.fullName}
                  </span>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-metropolis font-regular rounded-full bg-stroke text-[#4A739C]">
                  Editor
                </span>
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 rounded-lg p-4" style={{ backgroundColor: '#EFF6FF' }}>
              <div className="flex items-start space-x-3">
                <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-metropolis font-medium mb-1" style={{ color: '#1E40AF' }}>
                    ¿Necesitas acceso de administrador?
                  </p>
                  <p className="text-sm font-metropolis font-regular" style={{ color: '#3730A3' }}>
                    Contacta a un administrador del sistema para obtener los permisos necesarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
            onClick={activeTab === 'pagos' ? handlePagosSubmit : handleSubmit}
            disabled={
              activeTab === 'pagos' 
                ? (isPagosSubmitting || !hasPagosChanges)
                : (isSubmitting || !hasChanges)
            }
            className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
              (activeTab === 'pagos' 
                ? (isPagosSubmitting || !hasPagosChanges)
                : (isSubmitting || !hasChanges))
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
            style={{ '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {activeTab === 'pagos' ? (
              isPagosSubmitting ? (
                <div className="flex items-center space-x-2">
                  <Spinner size="sm" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {existingPagos ? 'Actualizar Pagos' : 'Crear Pagos'}
                </>
              )
            ) : (
              isSubmitting ? (
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
              )
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border rounded-lg shadow-lg" style={{ borderColor: '#CFDBE8' }}>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('contacto')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contacto'
                  ? 'border-[#5A6F80] text-[#0D141C]'
                  : 'border-transparent text-[#4A739C] hover:text-[#0D141C] hover:border-gray-300'
              }`}
            >
              Contacto
            </button>
            <button
              onClick={() => setActiveTab('marca')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'marca'
                  ? 'border-[#5A6F80] text-[#0D141C]'
                  : 'border-transparent text-[#4A739C] hover:text-[#0D141C] hover:border-gray-300'
              }`}
            >
              Marca
            </button>
            <button
              onClick={() => setActiveTab('pagos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pagos'
                  ? 'border-[#5A6F80] text-[#0D141C]'
                  : 'border-transparent text-[#4A739C] hover:text-[#0D141C] hover:border-gray-300'
              }`}
            >
              Pagos
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contacto Tab */}
            {activeTab === 'contacto' && (
              <div className="space-y-6">
                {/* Contact Person Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-metropolis font-semibold text-[#0D141C] mb-4">
                    Persona de Contacto
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Person Image */}
                    <div>
                      <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                        Imagen de la Persona de Contacto
                      </label>
                      <div className="flex items-start space-x-4">
                        {/* Current/Preview Image */}
                        <div className="flex-shrink-0">
                          {existingSettings?.contactPersonImageUrl && !formData.contactPersonImageUrl ? (
                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                              <Image
                                src={existingSettings.contactPersonImageUrl}
                                alt="Imagen actual"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : formData.contactPersonImageUrl ? (
                            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                              <Image
                                src={formData.contactPersonImageUrl}
                                alt="Nueva imagen"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1">
                          <input
                            type="file"
                            id="contactPersonImage"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = () => {
                                  handleInputChange('contactPersonImageUrl', reader.result as string)
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="contactPersonImage"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] cursor-pointer"
                          >
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {existingSettings?.contactPersonImageUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                          </label>
                          <p className="mt-1 text-xs text-gray-500">
                            Formatos: JPG, PNG, GIF. Máx: 5MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Person Name */}
                    <div>
                      <label htmlFor="contactPersonName" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                        Nombre de la Persona de Contacto
                      </label>
                      <input
                        type="text"
                        id="contactPersonName"
                        value={formData.contactPersonName}
                        onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                  </div>

                  {/* Contact Person Role */}
                  <div className="mt-4">
                    <label htmlFor="contactPersonRoleEs" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                      Rol de la Persona de Contacto
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="contactPersonRoleEs"
                        value={formData.contactPersonRoleEs}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                        placeholder="Ej: Director de Comunicaciones"
                      />
                      {isTranslatingRole && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Spinner size="sm" />
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      El rol se traducirá automáticamente al inglés
                    </p>
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

                {/* Web3Forms Key */}
                <div>
                  <label htmlFor="web3formsKey" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                    Llave de Web3Forms
                  </label>
                  <input
                    type="text"
                    id="web3formsKey"
                    value={formData.web3formsKey}
                    onChange={(e) => handleInputChange('web3formsKey', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                    placeholder="0dc03b04-97f6-4d9f-8e43-66704098d2b6"
                  />
                  {errors.web3formsKey && (
                    <p className="mt-1 text-sm text-red-600">{errors.web3formsKey}</p>
                  )}
                  
                  {/* Tutorial Section */}
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-3">¿Cómo obtener tu llave de Web3Forms?</h4>
                    
                    <div className="space-y-4">
                      {/* Step 1 */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                          1
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-blue-800 font-medium">Navega a Web3Forms</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Ve a <a href="https://web3forms.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">https://web3forms.com/</a> y agrega tu email
                          </p>
                          <div className="mt-2 p-2 bg-white rounded border">
                            <div className="text-xs text-gray-600">Paso 1: Ingresa tu email en el formulario</div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                          2
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-blue-800 font-medium">Revisa tu email</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Web3Forms te enviará un email con tu llave de acceso
                          </p>
                          <div className="mt-2 p-2 bg-white rounded border">
                            <div className="text-xs text-gray-600">Paso 2: Busca el email de Web3Forms en tu bandeja de entrada</div>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                          3
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-blue-800 font-medium">Copia y pega la llave</p>
                          <p className="text-sm text-blue-700 mt-1">
                            Copia la llave de acceso del email y pégala en el campo de arriba
                          </p>
                          <div className="mt-2 p-2 bg-white rounded border">
                            <div className="text-xs text-gray-600">Paso 3: La llave se verá como: 0dc03b04-97f6-4d9f-8e43-66704098d2b6</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Importante:</strong> La llave de Web3Forms es pública y segura de usar en el código del sitio web. No necesitas ocultarla.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Marca Tab */}
            {activeTab === 'marca' && (
              <div className="space-y-6">
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
              </div>
            )}

            {/* Pagos Tab */}
            {activeTab === 'pagos' && (
              <div className="space-y-6">
                {/* Payment Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stripe Code */}
                  <div>
                    <label htmlFor="paystripeCode" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                      Código de Stripe
                    </label>
                    <input
                      type="text"
                      id="paystripeCode"
                      value={pagosFormData.paystripeCode}
                      onChange={(e) => handlePagosInputChange('paystripeCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                      placeholder="pk_test_..."
                    />
                    {pagosErrors.paystripeCode && (
                      <p className="mt-1 text-sm text-red-600">{pagosErrors.paystripeCode}</p>
                    )}
                    
                    {/* Tutorial Section */}
                    <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-900 mb-3">¿Cómo obtener tu código de Stripe?</h4>
                      
                      <div className="space-y-4">
                        {/* Step 1 */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                            1
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-purple-800 font-medium">Accede a tu cuenta de Stripe</p>
                            <p className="text-sm text-purple-700 mt-1">
                              Ve a <a href="https://dashboard.stripe.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-900">https://dashboard.stripe.com/</a> e inicia sesión
                            </p>
                            <div className="mt-2 p-2 bg-white rounded border">
                              <div className="text-xs text-gray-600">Paso 1: Inicia sesión en tu cuenta de Stripe</div>
                            </div>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                            2
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-purple-800 font-medium">Ve a la sección de API Keys</p>
                            <p className="text-sm text-purple-700 mt-1">
                              Navega a &quot;Desarrolladores&quot; → &quot;Claves de API&quot; en el menú lateral
                            </p>
                            <div className="mt-2 p-2 bg-white rounded border">
                              <div className="text-xs text-gray-600">Paso 2: Encuentra la sección de claves de API</div>
                            </div>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-xs font-medium rounded-full flex items-center justify-center">
                            3
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-purple-800 font-medium">Copia tu clave pública</p>
                            <p className="text-sm text-purple-700 mt-1">
                              Copia la clave que comienza con &quot;pk_test_&quot; (modo prueba) o &quot;pk_live_&quot; (modo producción)
                            </p>
                            <div className="mt-2 p-2 bg-white rounded border">
                              <div className="text-xs text-gray-600">Paso 3: La clave se verá como: pk_test_51ABC123...</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-800">
                              <strong>Importante:</strong> Usa &quot;pk_test_&quot; para desarrollo y &quot;pk_live_&quot; para producción. La clave pública es segura de usar en el frontend.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PayPal URL */}
                  <div>
                    <label htmlFor="paypalUrl" className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                      URL de PayPal
                    </label>
                    <input
                      type="url"
                      id="paypalUrl"
                      value={pagosFormData.paypalUrl}
                      onChange={(e) => handlePagosInputChange('paypalUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                      placeholder="https://paypal.me/empresa"
                    />
                    {pagosErrors.paypalUrl && (
                      <p className="mt-1 text-sm text-red-600">{pagosErrors.paypalUrl}</p>
                    )}
                  </div>
                </div>

                {/* Help Text */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Información de Configuración
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>El código de Stripe debe comenzar con &quot;pk_test_&quot; para modo de prueba o &quot;pk_live_&quot; para producción</li>
                          <li>La URL de PayPal debe ser un enlace válido de PayPal.me o PayPal Business</li>
                          <li>Ambos campos son opcionales y se pueden configurar por separado</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
