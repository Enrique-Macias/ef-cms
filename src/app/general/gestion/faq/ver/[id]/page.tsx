'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface FAQ {
  id: string
  question_es: string
  question_en: string
  answer_es: string
  answer_en: string
  order: number
  createdAt: string
  updatedAt: string
}

export default function VerFAQPage() {
  const params = useParams()
  const router = useRouter()
  const faqId = params.id as string

  const [faq, setFaq] = useState<FAQ | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  
  const toast = useToast()

  // Load FAQ data on component mount
  useEffect(() => {
    const loadFAQData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/faq/${faqId}`)
        if (!response.ok) {
          throw new Error('Error al obtener pregunta frecuente')
        }
        
        const data = await response.json()
        setFaq(data)
      } catch (error) {
        console.error('Error loading FAQ:', error)
        toast.error('Error al cargar la pregunta frecuente')
        router.push('/general/gestion/faq')
      } finally {
        setIsLoading(false)
      }
    }

    loadFAQData()
  }, [faqId]) // Remove toast dependency to prevent infinite loop

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const formatted = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    // Convert "2 de septiembre de 2025" to "Septiembre 2, 2025"
    return formatted.replace(/^(\d+)\s+de\s+(\w+)\s+de\s+(\d+)$/, (match, day, month, year) => {
      return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + day + ', ' + year
    })
  }

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/faq/${faqId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })

      if (!response.ok) {
        throw new Error('Error al eliminar pregunta frecuente')
      }

      toast.success('Pregunta frecuente eliminada exitosamente')
      router.push('/general/gestion/faq')
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Error al eliminar pregunta frecuente')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 pt-20 md:pt-6">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando pregunta frecuente...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!faq) {
    return (
      <div className="p-6 pt-20 md:pt-6">
        <div className="text-center py-20">
          <h1 className="text-2xl font-metropolis font-bold text-[#0D141C] mb-4">
            Pregunta frecuente no encontrada
          </h1>
          <p className="text-[#4A739C] font-metropolis font-regular mb-6">
            La pregunta frecuente que buscas no existe o ha sido eliminada.
          </p>
          <button
            onClick={() => router.push('/general/gestion/faq')}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            Volver a FAQ
          </button>
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
          <button 
            onClick={() => router.push('/general/gestion/faq')}
            className="hover:text-[#0D141C] transition-colors"
          >
            FAQ
          </button>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Ver</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-start space-x-4 mb-4 lg:mb-0">
          {/* FAQ Icon */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#5A6F80] to-[#4A739C] flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* FAQ Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {isEnglishMode ? faq.question_en : faq.question_es}
            </h1>
            <div className="flex items-center space-x-4 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              <span>Creado: {formatDate(faq.createdAt)}</span>
              <span>•</span>
              <span>Actualizado: {formatDate(faq.updatedAt)}</span>
              <span>•</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Orden: {faq.order}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {/* Language Toggle Button */}
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

          {/* Delete Button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-3 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>

          {/* Edit Button */}
          <button
            onClick={() => router.push(`/general/gestion/faq/editar/${faqId}`)}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar FAQ
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
              English Mode - Viewing English version of the FAQ
            </span>
          </div>
        </div>
      )}

      {/* FAQ Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Question and Answer */}
          <div className="bg-white border rounded-lg shadow-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
            <div className="p-6">
              <h3 className="text-lg font-metropolis font-semibold mb-4" style={{ color: '#0D141C' }}>
                {isEnglishMode ? 'Question' : 'Pregunta'}
              </h3>
              <p className="text-base font-metropolis font-regular mb-6" style={{ color: '#0D141C' }}>
                {isEnglishMode ? faq.question_en : faq.question_es}
              </p>
              
              <h3 className="text-lg font-metropolis font-semibold mb-4" style={{ color: '#0D141C' }}>
                {isEnglishMode ? 'Answer' : 'Respuesta'}
              </h3>
              <div className="prose max-w-none">
                {(isEnglishMode ? faq.answer_en : faq.answer_es).split('\n').map((paragraph, index) => (
                  <p key={index} className="text-base font-metropolis font-regular mb-4" style={{ color: '#4A739C' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="bg-white border rounded-lg shadow-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
            <div className="p-6">
              <h3 className="text-lg font-metropolis font-semibold mb-4" style={{ color: '#0D141C' }}>
                {isEnglishMode ? 'Details' : 'Detalles'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    {isEnglishMode ? 'Question (Spanish)' : 'Pregunta (Español)'}
                  </label>
                  <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {faq.question_es}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    {isEnglishMode ? 'Question (English)' : 'Pregunta (Inglés)'}
                  </label>
                  <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {faq.question_en}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    {isEnglishMode ? 'Order' : 'Orden'}
                  </label>
                  <p className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {faq.order}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    {isEnglishMode ? 'Created Date' : 'Fecha de Creación'}
                  </label>
                  <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {formatDate(faq.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    {isEnglishMode ? 'Last Updated' : 'Última Actualización'}
                  </label>
                  <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {formatDate(faq.updatedAt)}
                  </p>
                </div>
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
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-metropolis font-semibold" style={{ color: '#0D141C' }}>
                  Confirmar Eliminación
                </h3>
              </div>
              
              <p className="text-sm font-metropolis font-regular mb-6" style={{ color: '#4A739C' }}>
                ¿Estás seguro de que quieres eliminar la pregunta frecuente &quot;{isEnglishMode ? faq.question_en : faq.question_es}&quot;? Esta acción no se puede deshacer.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
                >
                  {isDeleting && <Spinner size="sm" />}
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
