'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface Event {
  id: number
  title_es: string
  title_en: string
  body_es: string
  body_en: string
  date: string
  tags: string[]
  category: string
  category_en: string
  author: string
  location_city: string
  location_country: string
  coverImageUrl: string
  phrase: string
  phrase_en: string
  credits: string
  credits_en: string
  createdAt: string
  updatedAt: string
  tags_en: string[]
  eventImages: Array<{ id: number; imageUrl: string; order?: number }>
}

export default function VerEventoPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  
  const toast = useToast()



  // Load event data on component mount
  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/events/${eventId}`)
        if (response.ok) {
          const data = await response.json()
          setEvent(data.event)
        } else {
          toast.error('Error loading event')
        }
      } catch (error) {
        console.error('Error loading event:', error)
        toast.error('Error loading event')
      } finally {
        setIsLoading(false)
      }
    }

    loadEventData()
  }, [eventId]) // Remove toast dependency to prevent infinite loops

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Evento eliminado exitosamente')
        router.push('/general/gestion/eventos')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error deleting event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Error deleting event')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  // Format date

  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isEnglishMode) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } else {
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
  }

  // Get event status
  const getEventStatus = (dateString: string) => {
    const eventDate = new Date(dateString)
    const now = new Date()
    const diffTime = eventDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { status: 'Completado', color: 'bg-gray-500' }
    } else if (diffDays <= 7) {
      return { status: 'Próximo', color: 'bg-red-500' }
    } else if (diffDays <= 30) {
      return { status: 'En 30 días', color: 'bg-yellow-500' }
    } else {
      return { status: 'Programado', color: 'bg-green-500' }
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando evento...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            Evento no encontrado
          </h3>
          <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
            El evento que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => router.push('/general/gestion/eventos')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    )
  }

  const status = getEventStatus(event.date)

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
          <span>Inicio</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>Gestión</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>Eventos</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Ver Evento</span>
        </nav>
      </div>

      {/* Header Section with Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Event Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
            {event.coverImageUrl ? (
              <img
                src={event.coverImageUrl}
                alt="Event cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Event Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {isEnglishMode ? event.title_en : event.title_es}
            </h1>
            <div className="flex items-center space-x-4 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              <span>{isEnglishMode ? 'By ' : 'Por '}{event.author}</span>
              <span>•</span>
              <span>{formatDate(event.date)}</span>
              <span>•</span>
              <span>{event.location_city}, {event.location_country}</span>
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
            {isEnglishMode ? 'Delete' : 'Eliminar'}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => router.push(`/general/gestion/eventos/editar/${event.id}`)}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEnglishMode ? 'Edit Event' : 'Editar Evento'}
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
              English Mode - Viewing English version of the event
            </span>
          </div>
        </div>
      )}

      {/* Event Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cover Image */}
          <div className="bg-white border rounded-lg shadow-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
            <div className="relative h-80 bg-gray-200">
              {event.coverImageUrl ? (
                <img
                  src={event.coverImageUrl}
                  alt="Event cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-metropolis font-medium text-white ${status.color}`}>
                {status.status}
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h2 className="font-metropolis font-bold text-2xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Event Description' : 'Descripción del Evento'}
            </h2>
            <div className="prose max-w-none">
              {(isEnglishMode ? event.body_en : event.body_es).split('\n').map((paragraph, index) => (
                <p key={index} className="text-base font-metropolis font-regular mb-4" style={{ color: '#4A739C' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Event Images */}
          {event.eventImages && event.eventImages.length > 0 && (
            <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
              <h2 className="font-metropolis font-bold text-2xl mb-4" style={{ color: '#0D141C' }}>
                {isEnglishMode ? 'Event Images' : 'Imágenes del Evento'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.eventImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={`Event image ${image.id}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h2 className="font-metropolis font-bold text-2xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Tags' : 'Etiquetas'}
            </h2>
            <div className="flex flex-wrap gap-3">
              {(isEnglishMode ? event.tags_en : event.tags).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 text-sm font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details Card */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Event Details' : 'Detalles del Evento'}
            </h3>
            <div className="space-y-4">
              {/* Date */}
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-metropolis font-medium text-[#0D141C]">{isEnglishMode ? 'Date' : 'Fecha'}</p>
                  <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-metropolis font-medium text-[#0D141C]">{isEnglishMode ? 'Location' : 'Ubicación'}</p>
                  <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {event.location_city}, {event.location_country}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.5 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div>
                  <p className="text-sm font-metropolis font-medium text-[#0D141C]">{isEnglishMode ? 'Category' : 'Categoría'}</p>
                  <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {isEnglishMode ? event.category_en : event.category}
                  </p>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p className="text-sm font-metropolis font-medium text-[#0D141C]">{isEnglishMode ? 'Author' : 'Autor'}</p>
                  <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {event.author}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Phrase Card */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Event Phrase' : 'Frase del Evento'}
            </h3>
            <div className="text-center">
              <p className="text-lg font-metropolis font-medium italic" style={{ color: '#5A6F80' }}>
                "{isEnglishMode ? event.phrase_en : event.phrase}"
              </p>
            </div>
          </div>

          {/* Credits Card */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Credits' : 'Créditos'}
            </h3>
            <div className="space-y-2">
              {(isEnglishMode ? event.credits_en : event.credits).split('|').map((credit, index) => (
                <p key={index} className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  {credit.trim()}
                </p>
              ))}
            </div>
          </div>

          {/* Created/Updated Info */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'System Information' : 'Información del Sistema'}
            </h3>
            <div className="space-y-3 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              <div>
                <span className="font-medium">{isEnglishMode ? 'Created:' : 'Creado:'}</span> {new Date(event.createdAt).toLocaleDateString(isEnglishMode ? 'en-US' : 'es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div>
                <span className="font-medium">{isEnglishMode ? 'Updated:' : 'Actualizado:'}</span> {new Date(event.updatedAt).toLocaleDateString(isEnglishMode ? 'en-US' : 'es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
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
                ¿Estás seguro que deseas eliminar este evento?
              </h3>
              
              <p className="text-sm font-metropolis font-regular text-[#4A739C] mb-6">
                No podrás revertir esta acción.
              </p>

              {/* Event info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                  {event.title_es}
                </p>
                <p className="text-sm font-metropolis font-regular text-[#4A739C]">
                  {event.author}
                </p>
                <span className="inline-flex px-2 py-1 text-xs font-metropolis font-regular rounded-full mt-2 bg-[#E8EDF5] text-[#0D141C]">
                  {event.category}
                </span>
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
