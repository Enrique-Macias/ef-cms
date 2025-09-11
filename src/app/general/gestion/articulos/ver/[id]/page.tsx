'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface Article {
  id: number
  title: string
  body_es: string
  body_en: string
  imageUrl: string
  author: string
  date: string
  linkUrl: string | null
  createdAt: string
  updatedAt: string
}

export default function VerArticuloPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string

  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  
  const toast = useToast()

  // Mock data for articles
  const mockArticles: { [key: number]: Article } = {
    1: {
      id: 1,
      title: 'Innovación Tecnológica en el Siglo XXI',
      body_es: 'Un análisis profundo sobre cómo la tecnología está transformando nuestras vidas y el futuro de la humanidad. Exploramos las tendencias más importantes y sus implicaciones.\n\nEn este artículo, examinamos:\n• El impacto de la inteligencia artificial en la sociedad\n• La evolución del trabajo remoto y la digitalización\n• Los desafíos de la privacidad en la era digital\n• Las oportunidades para el desarrollo sostenible\n• El futuro de la educación y el aprendizaje',
      body_en: 'A deep analysis of how technology is transforming our lives and the future of humanity. We explore the most important trends and their implications.\n\nIn this article, we examine:\n• The impact of artificial intelligence on society\n• The evolution of remote work and digitalization\n• The challenges of privacy in the digital age\n• Opportunities for sustainable development\n• The future of education and learning',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&crop=center',
      author: 'Dr. Carlos Mendoza',
      date: '2024-01-15',
      linkUrl: 'https://example.com/article1',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    2: {
      id: 2,
      title: 'Sostenibilidad Ambiental: El Camino Hacia el Futuro',
      body_es: 'Un artículo que examina las prácticas sostenibles y su importancia para preservar nuestro planeta para las generaciones futuras.\n\nTemas principales:\n• Cambio climático y sus efectos globales\n• Energías renovables y transición energética\n• Economía circular y desarrollo sostenible\n• Conservación de biodiversidad\n• Políticas públicas ambientales',
      body_en: 'An article examining sustainable practices and their importance for preserving our planet for future generations.\n\nMain topics:\n• Climate change and its global effects\n• Renewable energies and energy transition\n• Circular economy and sustainable development\n• Biodiversity conservation\n• Environmental public policies',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&crop=center',
      author: 'María Elena Torres',
      date: '2024-01-14',
      linkUrl: 'https://example.com/article2',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-14T14:30:00Z'
    }
  }

  // Load article data on component mount
  useEffect(() => {
    const loadArticleData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const articleData = mockArticles[parseInt(articleId)]
        if (articleData) {
          setArticle(articleData)
        }
        setIsLoading(false)
      }, 1000)
    }

    loadArticleData()
  }, [articleId])

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true)
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      // Show success toast and redirect
      toast.success('Artículo eliminado exitosamente')
      router.push('/general/gestion/articulos')
    }, 2000)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando artículo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
          </svg>
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            Artículo no encontrado
          </h3>
          <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
            El artículo que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => router.push('/general/gestion/articulos')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
          >
            Volver a Artículos
          </button>
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
          <span>Gestión</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span>Artículos</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Ver Artículo</span>
        </nav>
      </div>

      {/* Header Section with Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Article Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Article Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {isEnglishMode ? article.title : article.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              <span>{isEnglishMode ? 'By ' : 'Por '}{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.date)}</span>
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
            onClick={() => router.push(`/general/gestion/articulos/editar/${article.id}`)}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isEnglishMode ? 'Edit Article' : 'Editar Artículo'}
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
              English Mode - Viewing English version of the article
            </span>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cover Image */}
          <div className="bg-white border rounded-lg shadow-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
            <div className="relative h-80 bg-gray-200">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={800}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Article Description */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h2 className="font-metropolis font-bold text-2xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Article Description' : 'Descripción del Artículo'}
            </h2>
            <div className="prose max-w-none">
              {(isEnglishMode ? article.body_en : article.body_es).split('\n').map((paragraph, index) => (
                <p key={index} className="text-base font-metropolis font-regular mb-4" style={{ color: '#4A739C' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Details Card */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'Article Details' : 'Detalles del Artículo'}
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
                    {formatDate(article.date)}
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
                    {article.author}
                  </p>
                </div>
              </div>

              {/* External Link */}
              {article.linkUrl && (
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <div>
                    <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                      {isEnglishMode ? 'External Link' : 'Enlace Externo'}
                    </p>
                    <a
                      href={article.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-metropolis font-regular text-blue-600 hover:text-blue-800 underline"
                    >
                      {isEnglishMode ? 'View Full Article' : 'Ver Artículo Completo'}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Created/Updated Info */}
          <div className="bg-white border rounded-lg shadow-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {isEnglishMode ? 'System Information' : 'Información del Sistema'}
            </h3>
            <div className="space-y-3 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              <div>
                <span className="font-medium">{isEnglishMode ? 'Created:' : 'Creado:'}</span> {new Date(article.createdAt).toLocaleDateString(isEnglishMode ? 'en-US' : 'es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div>
                <span className="font-medium">{isEnglishMode ? 'Updated:' : 'Actualizado:'}</span> {new Date(article.updatedAt).toLocaleDateString(isEnglishMode ? 'en-US' : 'es-ES', {
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
                ¿Estás seguro que deseas eliminar este artículo?
              </h3>
              
              <p className="text-sm font-metropolis font-regular text-[#4A739C] mb-6">
                No podrás revertir esta acción.
              </p>

              {/* Article info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                  {article.title}
                </p>
                <p className="text-sm font-metropolis font-regular text-[#4A739C]">
                  {article.author}
                </p>
                <span className="inline-flex px-2 py-1 text-xs font-metropolis font-regular rounded-full mt-2 bg-[#E8EDF5] text-[#0D141C]">
                  {formatDate(article.date)}
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
