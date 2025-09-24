'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Sponsor } from '@/lib/sponsorService'
import { SponsorFormData, createSponsorFormHandlers, validateSponsorForm } from '@/utils/sponsorFormHandlers'
import { useToast } from '@/hooks/useToast'

export default function EditarPatrocinadorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const toast = useToast()
  const [sponsor, setSponsor] = useState<Sponsor | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<SponsorFormData>({
    name: '',
    imageUrl: '' as string | File,
    linkUrl: ''
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('')

  const { handleInputChange, handleImageUpload, handleDragOver, handleDragLeave, handleDrop } = 
    createSponsorFormHandlers(formData, setFormData, toast)

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        const resolvedParams = await params
        const response = await fetch(`/api/sponsors/${resolvedParams.id}`)
        if (response.ok) {
          const sponsorData = await response.json()
          setSponsor(sponsorData)
          setFormData({
            name: sponsorData.name,
            imageUrl: sponsorData.imageUrl,
            linkUrl: sponsorData.linkUrl || ''
          })
          setCurrentImageUrl(sponsorData.imageUrl)
        } else {
          toast.error('Error al cargar patrocinador')
          router.push('/general/gestion/patrocinadores')
        }
      } catch (error) {
        console.error('Error fetching sponsor:', error)
        toast.error('Error al cargar patrocinador')
        router.push('/general/gestion/patrocinadores')
      } finally {
        setLoading(false)
      }
    }

    fetchSponsor()
  }, [params, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateSponsorForm(formData)
    if (!validation.isValid) {
      toast.error(validation.errorMessage || 'Error de validación')
      return
    }

    setIsSubmitting(true)

    try {
      const resolvedParams = await params
      const imageUrl = currentImageUrl // Use the stored current image URL
      
      if (formData.imageUrl instanceof File) {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const response = await fetch(`/api/sponsors/${resolvedParams.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
              },
              body: JSON.stringify({
                name: formData.name,
                imageUrl: reader.result as string,
                linkUrl: formData.linkUrl.trim() || null
              }),
            })

            if (response.ok) {
              toast.success('Patrocinador actualizado exitosamente')
              router.push('/general/gestion/patrocinadores')
            } else {
              const errorData = await response.json()
              toast.error(errorData.error || 'Error al actualizar patrocinador')
            }
          } catch (error) {
            console.error('Error updating sponsor:', error)
            toast.error('Error al actualizar patrocinador')
          } finally {
            setIsSubmitting(false)
          }
        }
        reader.readAsDataURL(formData.imageUrl as File)
        return
      }

      // If no new image, keep the existing one
      const response = await fetch(`/api/sponsors/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          name: formData.name,
          imageUrl: imageUrl || currentImageUrl,
          linkUrl: formData.linkUrl.trim() || null
        }),
      })

      if (response.ok) {
        toast.success('Patrocinador actualizado exitosamente')
        router.push('/general/gestion/patrocinadores')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error al actualizar patrocinador')
      }
    } catch (error) {
      console.error('Error updating sponsor:', error)
      toast.error('Error al actualizar patrocinador')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 pt-20 md:pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A6F80]"></div>
        </div>
      </div>
    )
  }

  if (!sponsor) {
    return (
      <div className="p-6 pt-20 md:pt-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-metropolis font-medium text-gray-900">Patrocinador no encontrado</h3>
          <p className="mt-1 text-sm font-metropolis font-regular text-gray-500">
            El patrocinador que buscas no existe.
          </p>
        </div>
      </div>
    )
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
          <span>Patrocinadores</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Editar</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
          Editar Patrocinador
        </h1>
        <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
          Modifica la información del patrocinador
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h2 className="font-metropolis font-semibold text-xl mb-6" style={{ color: '#0D141C' }}>
            Información del Patrocinador
          </h2>

          {/* Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              Nombre del Patrocinador *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Empresa ABC"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#5A6F80] focus:border-[#5A6F80] sm:text-sm"
            />
            <p className="mt-1 text-xs font-metropolis font-regular text-gray-500">
              Nombre de la empresa o organización patrocinadora
            </p>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              Logo del Patrocinador *
            </label>
            <div className="mt-1">
              {(formData.imageUrl && formData.imageUrl !== currentImageUrl) ? (
                <div className="relative">
                  <div className="aspect-square w-48 h-48 relative">
                    <Image
                      src={formData.imageUrl instanceof File ? URL.createObjectURL(formData.imageUrl) : formData.imageUrl}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg border border-gray-300"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageUrl: currentImageUrl }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-square w-48 h-48 relative">
                    <Image
                      src={currentImageUrl}
                      alt="Current Logo"
                      fill
                      className="object-contain rounded-lg border border-gray-300"
                    />
                  </div>
                  <div
                    className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center hover:border-[#5A6F80] transition-colors ${
                      isDragOver ? 'border-[#5A6F80] bg-[#E8EDF5]' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-metropolis font-medium" style={{ color: '#5A6F80' }}>
                          Haz clic para cambiar o arrastra y suelta
                        </span>
                        <span className="mt-1 block text-xs font-metropolis font-regular text-gray-500">
                          Máximo 2MB, JPG, JPEG o PNG
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Link URL */}
          <div className="mb-6">
            <label htmlFor="linkUrl" className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              URL del Enlace (Opcional)
            </label>
            <input
              type="url"
              id="linkUrl"
              name="linkUrl"
              value={formData.linkUrl}
              onChange={(e) => handleInputChange('linkUrl', e.target.value)}
              placeholder="https://ejemplo.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#5A6F80] focus:border-[#5A6F80] sm:text-sm"
            />
            <p className="mt-1 text-xs font-metropolis font-regular text-gray-500">
              URL del sitio web del patrocinador
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/general/gestion/patrocinadores')}
            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-metropolis font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-metropolis font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80' }}
          >
            {isSubmitting ? 'Actualizando...' : 'Actualizar Patrocinador'}
          </button>
        </div>
      </form>
    </div>
  )
}
