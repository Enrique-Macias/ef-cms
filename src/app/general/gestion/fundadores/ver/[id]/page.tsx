'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface Fundador {
  id: string
  name: string
  role_es: string
  role_en: string
  body_es: string
  body_en: string
  imageUrl: string
  facebookUrl: string | null
  instagramUrl: string | null
  createdAt: string
  updatedAt: string
}

export default function VerFundadorPage() {
  const router = useRouter()
  const params = useParams()
  const toast = useToast()
  
  const [fundador, setFundador] = useState<Fundador | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEnglishMode, setIsEnglishMode] = useState(false)

  useEffect(() => {
    const loadFundador = async () => {
      if (!params.id) return
      
      try {
        const response = await fetch(`/api/fundadores/${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Fundador no encontrado')
            router.push('/general/gestion/fundadores')
            return
          }
          throw new Error('Error al obtener el fundador')
        }
        
        const fundadorData = await response.json()
        setFundador(fundadorData)
      } catch (error) {
        console.error('Error loading fundador:', error)
        toast.error('Error al cargar el fundador')
        router.push('/general/gestion/fundadores')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFundador()
  }, [params.id]) // Remove toast dependency to prevent infinite loops

  const handleDelete = async () => {
    if (!fundador) return
    
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este fundador? Esta acción no se puede deshacer.')
    if (!confirmed) return

    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/fundadores/${fundador.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar el fundador')
      }

      toast.success('Fundador eliminado exitosamente')
      router.push('/general/gestion/fundadores')
    } catch (error) {
      console.error('Error deleting fundador:', error)
      toast.error(`Error al eliminar el fundador: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando fundador...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!fundador) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            Fundador no encontrado
          </h3>
          <p className="text-[#4A739C] font-metropolis font-regular">
            El fundador que buscas no existe o ha sido eliminado.
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
          <span>Fundadores</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Ver</span>
        </nav>
      </div>

      {/* Header Section with Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Founder Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={fundador.imageUrl}
              alt={fundador.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Founder Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {fundador.name}
            </h1>
            <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
              {isEnglishMode ? fundador.role_en : fundador.role_es}
            </p>
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
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-4 py-3 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {isDeleting ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">{isEnglishMode ? 'Deleting...' : 'Eliminando...'}</span>
              </>
            ) : (
              isEnglishMode ? 'Delete' : 'Eliminar'
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => router.push(`/general/gestion/fundadores/editar/${fundador.id}`)}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEnglishMode ? 'Edit Founder' : 'Editar Fundador'}
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
              English Mode - Viewing English version of the founder
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-metropolis font-bold mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Image' : 'Imagen'}
            </h2>
            <div className="relative w-full h-64 lg:h-96">
              <Image
                src={fundador.imageUrl}
                alt={fundador.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-metropolis font-bold mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Description' : 'Descripción'}
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {isEnglishMode ? fundador.body_en : fundador.body_es}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Social Media */}
          {(fundador.facebookUrl || fundador.instagramUrl) && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-metropolis font-bold mb-4" style={{ color: '#0D141C' }}>
                {isEnglishMode ? 'Social Networks' : 'Redes Sociales'}
              </h2>
              <div className="space-y-3">
                {fundador.facebookUrl && (
                  <a
                    href={fundador.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 text-blue-600">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Facebook</span>
                  </a>
                )}
                {fundador.instagramUrl && (
                  <a
                    href={fundador.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 text-pink-600">
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span className="text-gray-700">Instagram</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-metropolis font-bold mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Information' : 'Información'}
            </h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  {isEnglishMode ? 'Created:' : 'Creado:'}
                </span>
                <p className="text-gray-700">{formatDate(fundador.createdAt)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  {isEnglishMode ? 'Last updated:' : 'Última actualización:'}
                </span>
                <p className="text-gray-700">{formatDate(fundador.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
