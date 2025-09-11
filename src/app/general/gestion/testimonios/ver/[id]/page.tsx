'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function VerTestimonioPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  
  const testimonialId = params.id as string
  
  // State
  const [testimonial, setTestimonial] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEnglishMode, setIsEnglishMode] = useState(false)

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

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Handle delete testimonial
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete testimonial')
      }
      
      toast.success('Testimonio eliminado exitosamente')
      router.push('/general/gestion/testimonios')
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Error al eliminar el testimonio')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  // Get current testimonial data based on language mode
  const getCurrentTestimonialData = () => {
    if (!testimonial) return null
    return {
      author: testimonial.author,
      role: isEnglishMode ? testimonial.role_en : testimonial.role,
      body: isEnglishMode ? testimonial.body_en : testimonial.body_es,
      imageUrl: testimonial.imageUrl
    }
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

  const currentTestimonial = getCurrentTestimonialData()!

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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>
            {isEnglishMode ? 'View Testimonial' : 'Ver Testimonio'}
          </span>
        </nav>
      </div>

      {/* Header Section with Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Testimonial Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
            <Image
              src={String(currentTestimonial.imageUrl)}
              alt={String(currentTestimonial.author)}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Testimonial Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {String(currentTestimonial.author)}
            </h1>
            <div className="flex items-center space-x-4 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              <span>{String(currentTestimonial.role)}</span>
              <span>•</span>
              <span>{formatDate(String(testimonial.createdAt))}</span>
            </div>
          </div>
        </div>

        {/* Language Toggle and Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEnglishMode(!isEnglishMode)}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isEnglishMode ? 'Spanish' : 'English'}
          </button>

          <button
            onClick={() => router.push(`/general/gestion/testimonios/editar/${testimonialId}`)}
            className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#5A6F80] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEnglishMode ? 'Edit Testimonial' : 'Editar Testimonio'}
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isEnglishMode ? 'Delete' : 'Eliminar'}
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
              English Mode - Viewing English version of the testimonial
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Testimonial Content */}
        <div className="lg:col-span-2">
          {/* Testimonial Text */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h2 className="font-metropolis font-bold text-2xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Testimonial' : 'Testimonio'}
            </h2>
            <div className="prose max-w-none">
              {currentTestimonial.body ? String(currentTestimonial.body).split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-base font-metropolis font-regular mb-4" style={{ color: '#4A739C' }}>
                  {paragraph}
                </p>
              )) : (
                <p className="text-base font-metropolis font-regular mb-4" style={{ color: '#4A739C' }}>
                  Sin contenido disponible
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Testimonial Details */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Testimonial Details' : 'Detalles del Testimonio'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-metropolis font-medium text-[#0D141C]">{isEnglishMode ? 'Date' : 'Fecha'}</p>
                  <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {formatDate(String(testimonial.createdAt))}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-sm font-metropolis font-medium text-[#0D141C]">{isEnglishMode ? 'Author' : 'Autor'}</p>
                  <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {String(currentTestimonial.author)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div>
                  <p className="text-sm font-metropolis font-medium text-[#0D141C]">{isEnglishMode ? 'Role' : 'Cargo'}</p>
                  <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {String(currentTestimonial.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'System Information' : 'Información del Sistema'}
            </h3>
            <div className="space-y-3 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              <div>
                <span className="font-medium">{isEnglishMode ? 'Created:' : 'Creado:'}</span> {formatDate(String(testimonial.createdAt))}
              </div>
              <div>
                <span className="font-medium">{isEnglishMode ? 'Updated:' : 'Actualizado:'}</span> {formatDate(String(testimonial.updatedAt))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Black overlay with 60% opacity */}
          <div 
            className="absolute inset-0 bg-black opacity-60"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 z-10">
            {/* Modal body */}
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-metropolis font-bold text-[#0D141C] mb-2">
                ¿Estás seguro que deseas eliminar este testimonio?
              </h3>
              
              <p className="text-sm font-metropolis font-regular text-[#4A739C] mb-6">
                No podrás revertir esta acción.
              </p>

              {/* Testimonial info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                  {String(currentTestimonial.author)}
                </p>
                <p className="text-sm font-metropolis font-regular text-[#4A739C]">
                  {String(currentTestimonial.role)}
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-center space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#F43F5E] border border-transparent rounded-md hover:bg-[#E11D48] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="flex items-center space-x-2">
                    <Spinner size="sm" />
                    <span>Eliminando...</span>
                  </div>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
