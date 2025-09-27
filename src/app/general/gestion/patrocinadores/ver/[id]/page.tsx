'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Sponsor } from '@/lib/sponsorService'
import { useToast } from '@/hooks/useToast'

export default function VerPatrocinadorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const toast = useToast()
  const [sponsor, setSponsor] = useState<Sponsor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        const resolvedParams = await params
        const response = await fetch(`/api/sponsors/${resolvedParams.id}`)
        if (response.ok) {
          const sponsorData = await response.json()
          setSponsor(sponsorData)
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

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este patrocinador?')) {
      return
    }

    try {
      const resolvedParams = await params
      const response = await fetch(`/api/sponsors/${resolvedParams.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (response.ok) {
        toast.success('Patrocinador eliminado exitosamente')
        router.push('/general/gestion/patrocinadores')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Error al eliminar patrocinador')
      }
    } catch (error) {
      console.error('Error deleting sponsor:', error)
      toast.error('Error al eliminar patrocinador')
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Ver</span>
        </nav>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            {sponsor.name}
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Información detallada del patrocinador
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => router.push(`/general/gestion/patrocinadores/editar/${sponsor.id}`)}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-6 py-3 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Sponsor Details */}
      <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ borderColor: '#CFDBE8' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logo */}
          <div>
            <h3 className="font-metropolis font-semibold text-lg mb-4" style={{ color: '#0D141C' }}>
              Logo del Patrocinador
            </h3>
            <div className="aspect-square max-w-md relative">
              <Image
                src={sponsor.imageUrl}
                alt="Sponsor Logo"
                fill
                className="object-contain rounded-lg border border-gray-200"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-metropolis font-semibold text-lg mb-4" style={{ color: '#0D141C' }}>
                Información
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-metropolis font-medium text-gray-500">
                    Nombre del Patrocinador
                  </label>
                  <div className="mt-1">
                    <span className="text-sm font-metropolis font-regular text-gray-900">
                      {sponsor.name}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium text-gray-500">
                    URL del Enlace
                  </label>
                  <div className="mt-1">
                    {sponsor.linkUrl ? (
                      <a
                        href={sponsor.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-metropolis font-regular text-[#5A6F80] hover:text-[#4A739C] underline"
                      >
                        {sponsor.linkUrl}
                      </a>
                    ) : (
                      <span className="text-sm font-metropolis font-regular text-gray-400">
                        No especificado
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium text-gray-500">
                    Fecha de Creación
                  </label>
                  <div className="mt-1">
                    <span className="text-sm font-metropolis font-regular text-gray-900">
                      {(() => {
                        const formatted = new Date(sponsor.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        // Convert "2 de septiembre de 2025" to "Septiembre 2, 2025"
                        return formatted.replace(/^(\d+)\s+de\s+(\w+)\s+de\s+(\d+),?\s*/, (match, day, month, year) => {
                          return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + day + ', ' + year + ', '
                        })
                      })()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-metropolis font-medium text-gray-500">
                    Última Actualización
                  </label>
                  <div className="mt-1">
                    <span className="text-sm font-metropolis font-regular text-gray-900">
                      {(() => {
                        const formatted = new Date(sponsor.updatedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        // Convert "2 de septiembre de 2025" to "Septiembre 2, 2025"
                        return formatted.replace(/^(\d+)\s+de\s+(\w+)\s+de\s+(\d+),?\s*/, (match, day, month, year) => {
                          return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + day + ', ' + year + ', '
                        })
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
