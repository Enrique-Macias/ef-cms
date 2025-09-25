'use client'

import { useState, useEffect } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { GoFundMeWidgetPreview } from '@/components/ui/GoFundMeWidgetPreview'

export default function ApoyoPreviewPage() {
  const [apoyo, setApoyo] = useState<Array<{
    id: string
    title: string
    description: string | null
    widgetCode: string
    isActive: boolean
    createdAt: string
  }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchActiveApoyo = async () => {
      try {
        const response = await fetch('/api/apoyo?isActive=true&limit=10')
        if (!response.ok) {
          throw new Error('Error al cargar elementos de apoyo')
        }
        
        const data = await response.json()
        setApoyo(data.apoyo)
      } catch (error) {
        console.error('Error fetching apoyo:', error)
        toast.error('Error al cargar elementos de apoyo')
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveApoyo()
  }, [toast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="font-metropolis font-bold text-4xl mb-4" style={{ color: '#0D141C' }}>
              Elementos de Apoyo
            </h1>
            <p className="font-metropolis font-regular text-xl" style={{ color: '#4A739C' }}>
              Widgets de GoFundMe para recaudación de fondos
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {apoyo.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-metropolis font-medium" style={{ color: '#0D141C' }}>
              No hay elementos de apoyo activos
            </h3>
            <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              Los widgets de GoFundMe aparecerán aquí cuando estén activos.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {apoyo.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                  {/* Title and Description */}
                  <div className="text-center mb-8">
                    <h2 className="font-metropolis font-bold text-2xl mb-4" style={{ color: '#0D141C' }}>
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Widget Container */}
                  <div className="max-w-4xl mx-auto">
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <GoFundMeWidgetPreview widgetCode={item.widgetCode} />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-6 text-center">
                    <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      Creado: {new Date(item.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
              Esta es una página de prueba para verificar que los widgets de GoFundMe se muestren correctamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
