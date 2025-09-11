'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function ArticulosPage() {
  const router = useRouter()
  const toast = useToast()
  
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage] = useState(6)

  // Mock data for articles
  const mockArticles: Article[] = [
    {
      id: 1,
      title: 'Innovación Tecnológica en el Siglo XXI',
      body_es: 'Un análisis profundo sobre cómo la tecnología está transformando nuestras vidas y el futuro de la humanidad. Exploramos las tendencias más importantes y sus implicaciones.',
      body_en: 'A deep analysis of how technology is transforming our lives and the future of humanity. We explore the most important trends and their implications.',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop&crop=center',
      author: 'Dr. Carlos Mendoza',
      date: '2024-01-15',
      linkUrl: 'https://example.com/article1',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Sostenibilidad Ambiental: El Camino Hacia el Futuro',
      body_es: 'Un artículo que examina las prácticas sostenibles y su importancia para preservar nuestro planeta para las generaciones futuras.',
      body_en: 'An article examining sustainable practices and their importance for preserving our planet for future generations.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&crop=center',
      author: 'María Elena Torres',
      date: '2024-01-14',
      linkUrl: 'https://example.com/article2',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-14T14:30:00Z'
    },
    {
      id: 3,
      title: 'El Futuro del Trabajo Remoto',
      body_es: 'Cómo la pandemia cambió para siempre la forma en que trabajamos y qué podemos esperar en los próximos años.',
      body_en: 'How the pandemic forever changed the way we work and what we can expect in the coming years.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center',
      author: 'Ana García',
      date: '2024-01-13',
      linkUrl: 'https://example.com/article3',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z'
    },
    {
      id: 4,
      title: 'Inteligencia Artificial: Oportunidades y Desafíos',
      body_es: 'Un análisis equilibrado sobre los beneficios y riesgos de la IA en nuestra sociedad moderna.',
      body_en: 'A balanced analysis of the benefits and risks of AI in our modern society.',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center',
      author: 'Roberto Silva',
      date: '2024-01-12',
      linkUrl: 'https://example.com/article4',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-12T16:45:00Z'
    },
    {
      id: 5,
      title: 'Educación Digital: Transformando el Aprendizaje',
      body_es: 'Cómo las herramientas digitales están revolucionando la educación y creando nuevas oportunidades de aprendizaje.',
      body_en: 'How digital tools are revolutionizing education and creating new learning opportunities.',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop&crop=center',
      author: 'Carmen Vega',
      date: '2024-01-11',
      linkUrl: 'https://example.com/article5',
      createdAt: '2024-01-11T11:20:00Z',
      updatedAt: '2024-01-11T11:20:00Z'
    },
    {
      id: 6,
      title: 'Emprendimiento en la Era Digital',
      body_es: 'Guía completa para emprendedores que quieren aprovechar las oportunidades del mundo digital.',
      body_en: 'Complete guide for entrepreneurs who want to take advantage of digital world opportunities.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center',
      author: 'Luis Fernández',
      date: '2024-01-10',
      linkUrl: 'https://example.com/article6',
      createdAt: '2024-01-10T13:10:00Z',
      updatedAt: '2024-01-10T13:10:00Z'
    },
    {
      id: 7,
      title: 'Salud Mental en Tiempos Modernos',
      body_es: 'Estrategias prácticas para mantener el bienestar mental en un mundo cada vez más acelerado.',
      body_en: 'Practical strategies for maintaining mental well-being in an increasingly fast-paced world.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center',
      author: 'Sofia Morales',
      date: '2024-01-09',
      linkUrl: 'https://example.com/article7',
      createdAt: '2024-01-09T15:30:00Z',
      updatedAt: '2024-01-09T15:30:00Z'
    },
    {
      id: 8,
      title: 'El Poder de la Creatividad en los Negocios',
      body_es: 'Cómo fomentar la creatividad en el entorno empresarial puede llevar a innovación y crecimiento.',
      body_en: 'How fostering creativity in the business environment can lead to innovation and growth.',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop&crop=center',
      author: 'Diego Ramírez',
      date: '2024-01-08',
      linkUrl: 'https://example.com/article8',
      createdAt: '2024-01-08T10:45:00Z',
      updatedAt: '2024-01-08T10:45:00Z'
    }
  ]

  // Load articles on component mount
  useEffect(() => {
    const loadArticles = async () => {
      setIsInitialLoading(true)
      // Simulate API call
      setTimeout(() => {
        setArticles(mockArticles)
        setFilteredArticles(mockArticles)
        setIsInitialLoading(false)
      }, 1000)
    }

    loadArticles()
  }, [])

  // Filter articles based on search term and date filter
  useEffect(() => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.body_es.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.body_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply date filter
    if (dateFilter) {
      const today = new Date()
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.date)
        
        switch (dateFilter) {
          case 'hoy':
            return articleDate.toDateString() === today.toDateString()
          case 'ultima-semana':
            return articleDate >= oneWeekAgo
          case 'ultimo-mes':
            return articleDate >= oneMonthAgo
          default:
            return true
        }
      })
    }

    setFilteredArticles(filtered)
    setCurrentPage(1)
  }, [searchTerm, dateFilter, articles])

  // Get current articles for pagination
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle)

  // Handle date filter changes
  const handleDateFilter = (filter: string | null) => {
    setIsLoading(true)
    setDateFilter(filter)
    setCurrentPage(1)
    // Simulate API call delay
    setTimeout(() => setIsLoading(false), 500)
  }

  // Handle search changes
  const handleSearch = (text: string) => {
    setIsLoading(true)
    setSearchTerm(text)
    setCurrentPage(1)
    // Simulate API call delay
    setTimeout(() => setIsLoading(false), 500)
  }

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando artículos...</p>
          </div>
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Artículos</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Artículos Recientes
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Gestiona y visualiza todos los artículos de la plataforma
          </p>
        </div>

        {/* Add Article Button */}
        <button
          onClick={() => router.push('/general/gestion/articulos/agregar')}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
          style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Artículo
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:border-gray-300 sm:text-sm"
                style={{ '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <button 
                className={`inline-flex items-center justify-center w-10 h-10 border rounded-full shadow-sm text-sm font-medium transition-colors ${
                  dateFilter 
                    ? 'border-[#5A6F80] bg-[#E8EDF5] text-[#0D141C]' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={{ '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>

              {/* Filter Dropdown Menu */}
              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        dateFilter === null ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        handleDateFilter(null)
                        setIsFilterMenuOpen(false)
                      }}
                    >
                      Todas las fechas
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        dateFilter === 'hoy' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        handleDateFilter('hoy')
                        setIsFilterMenuOpen(false)
                      }}
                    >
                      Hoy
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        dateFilter === 'ultima-semana' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        handleDateFilter('ultima-semana')
                        setIsFilterMenuOpen(false)
                      }}
                    >
                      Última semana
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        dateFilter === 'ultimo-mes' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        handleDateFilter('ultimo-mes')
                        setIsFilterMenuOpen(false)
                      }}
                    >
                      Último mes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="mb-8">
        {isInitialLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando artículos...</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Buscando artículos...</p>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4A739C] font-metropolis font-regular">
              {searchTerm || dateFilter 
                ? `No se encontraron artículos ${searchTerm ? `que coincidan con "${searchTerm}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
                : 'No se encontraron artículos'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                style={{ borderColor: '#CFDBE8' }}
                onClick={() => router.push(`/general/gestion/articulos/ver/${article.id}`)}
              >
                {/* Article Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Article Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-metropolis font-bold text-xl mb-2 line-clamp-2" style={{ color: '#0D141C' }}>
                    {article.title}
                  </h3>

                  {/* Date and Author */}
                  <div className="flex items-center space-x-4 mb-3 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(article.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{article.author}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-metropolis font-regular mb-4 line-clamp-3" style={{ color: '#4A739C' }}>
                    {article.body_es}
                  </p>

                  {/* External Link Badge */}
                  {article.linkUrl && (
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 text-xs font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Enlace Externo
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {Math.ceil(filteredArticles.length / articlesPerPage) > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Page Indicator */}
            <span className="text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
              Página {currentPage} de {Math.ceil(filteredArticles.length / articlesPerPage)}
            </span>
            
            <button 
              onClick={() => paginate(Math.min(Math.ceil(filteredArticles.length / articlesPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(filteredArticles.length / articlesPerPage)}
              className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
