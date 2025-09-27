'use client'

import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import { useApoyoForm } from '@/hooks/useApoyoForm'

export default function AgregarApoyoPage() {
  const router = useRouter()
  const toast = useToast()

  const {
    formData,
    updateFormData,
    isSubmitting,
    setIsSubmitting,
    errors,
    validateForm,
    resetForm
  } = useApoyoForm()

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/apoyo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear elemento de apoyo')
      }

      const result = await response.json()
      toast.success(result.message)
      router.push('/general/gestion/apoyo')
    } catch (error) {
      console.error('Error creating apoyo:', error)
      toast.error(error instanceof Error ? error.message : 'Error al crear elemento de apoyo')
    } finally {
      setIsSubmitting(false)
    }
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
          <span>Apoyo</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Agregar</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Agregar Elemento de Apoyo
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Crea un nuevo widget de GoFundMe para recaudación de fondos
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Creando...</span>
              </div>
            ) : (
              'Crear Elemento de Apoyo'
            )}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              Título *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm ${
                errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#5A6F80] focus:ring-[#5A6F80]'
              }`}
              placeholder="Ej: Campaña de Apoyo para..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              Descripción
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-[#5A6F80] focus:ring-[#5A6F80] sm:text-sm"
              placeholder="Descripción opcional del elemento de apoyo..."
            />
          </div>

          {/* Widget Code */}
          <div>
            <label htmlFor="widgetCode" className="block text-sm font-metropolis font-medium mb-2" style={{ color: '#0D141C' }}>
              Código del Widget de GoFundMe *
            </label>
            <textarea
              id="widgetCode"
              rows={6}
              value={formData.widgetCode}
              onChange={(e) => updateFormData({ widgetCode: e.target.value })}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm font-mono text-sm ${
                errors.widgetCode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#5A6F80] focus:ring-[#5A6F80]'
              }`}
              placeholder='Pega aquí el código HTML que te proporcionó GoFundMe, por ejemplo:
<div class="gfm-embed" data-url="https://www.gofundme.com/f/..."></div>
<script defer src="https://www.gofundme.com/static/js/embed.js"></script>'
            />
            {errors.widgetCode && (
              <p className="mt-1 text-sm text-red-600">{errors.widgetCode}</p>
            )}
            <p className="mt-2 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              Copia y pega el código HTML completo que te proporcionó GoFundMe para el widget.
            </p>
          </div>



        </form>
      </div>
    </div>
  )
}
