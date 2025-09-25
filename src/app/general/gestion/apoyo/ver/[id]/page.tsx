'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface ApoyoData {
  id: string
  title: string
  description: string | null
  widgetCode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function VerApoyoPage() {
  const params = useParams()
  const router = useRouter()
  const apoyoId = params.id as string

  const [apoyo, setApoyo] = useState<ApoyoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  const toast = useToast()

  // Load apoyo data on component mount
  useEffect(() => {
    const loadApoyoData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/apoyo/${apoyoId}`)
        if (!response.ok) {
          throw new Error('Error al obtener elemento de apoyo')
        }
        
        const data = await response.json()
        setApoyo(data)
      } catch (error) {
        console.error('Error loading apoyo:', error)
        toast.error('Error al cargar el elemento de apoyo')
        router.push('/general/gestion/apoyo')
      } finally {
        setIsLoading(false)
      }
    }

    loadApoyoData()
  }, [apoyoId])

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/apoyo/${apoyoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })

      if (!response.ok) {
        throw new Error('Error al eliminar elemento de apoyo')
      }

      toast.success('Elemento de apoyo eliminado exitosamente')
      router.push('/general/gestion/apoyo')
    } catch (error) {
      console.error('Error deleting apoyo:', error)
      toast.error('Error al eliminar elemento de apoyo')
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
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando elemento de apoyo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!apoyo) {
    return (
      <div className="p-6 pt-20 md:pt-6">
        <div className="text-center py-20">
          <h1 className="text-2xl font-metropolis font-bold text-[#0D141C] mb-4">
            Elemento de apoyo no encontrado
          </h1>
          <p className="text-[#4A739C] font-metropolis font-regular mb-6">
            El elemento de apoyo que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => router.push('/general/gestion/apoyo')}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            Volver a Apoyo
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
            onClick={() => router.push('/general/gestion/apoyo')}
            className="hover:text-[#0D141C] transition-colors"
          >
            Apoyo
          </button>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Ver</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-start space-x-4 mb-4 lg:mb-0">
          {/* Apoyo Icon */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-[#5A6F80] to-[#4A739C] flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          
          {/* Apoyo Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {apoyo.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              <span>Creado: {formatDate(apoyo.createdAt)}</span>
              <span>•</span>
              <span>Actualizado: {formatDate(apoyo.updatedAt)}</span>
              <span>•</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                apoyo.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {apoyo.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
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
            onClick={() => router.push(`/general/gestion/apoyo/editar/${apoyoId}`)}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Elemento
          </button>
        </div>
      </div>

      {/* Apoyo Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Widget Code */}
          <div className="bg-white border rounded-lg shadow-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
            <div className="p-6">
              <h3 className="text-lg font-metropolis font-semibold mb-4" style={{ color: '#0D141C' }}>
                Código del Widget
              </h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {apoyo.widgetCode}
                </pre>
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
                Detalles
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    Título
                  </label>
                  <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {apoyo.title}
                  </p>
                </div>

                {apoyo.description && (
                  <div>
                    <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                      Descripción
                    </label>
                    <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                      {apoyo.description}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    Estado
                  </label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      apoyo.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {apoyo.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    Fecha de Creación
                  </label>
                  <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {formatDate(apoyo.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium" style={{ color: '#4A739C' }}>
                    Última Actualización
                  </label>
                  <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {formatDate(apoyo.updatedAt)}
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
                ¿Estás seguro de que quieres eliminar el elemento de apoyo &quot;{apoyo.title}&quot;? Esta acción no se puede deshacer.
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
