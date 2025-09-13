'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface Article {
  id: string
  title: string
  title_en: string
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

  // Load articles on component mount
  useEffect(() => {
    const loadArticles = async () => {
      setIsInitialLoading(true)
      try {
        const response = await fetch('/api/articles')
        if (!response.ok) {
          throw new Error('Error al obtener artículos')
        }
        const articlesData = await response.json()
        setArticles(articlesData)
        setFilteredArticles(articlesData)
      } catch (error) {
        console.error('Error loading articles:', error)
        toast.error('Error al cargar los artículos')
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadArticles()
  }, [])

  // Filter articles based on search term and date filter
  useEffect(() => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="p-6 pt-20 md:pt-6">
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
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
              {searchTerm || dateFilter 
                ? 'No se encontraron artículos'
                : 'No hay artículos disponibles'
              }
            </h3>
            <p className="text-[#4A739C] font-metropolis font-regular">
              {searchTerm || dateFilter 
                ? `No se encontraron artículos ${searchTerm ? `que coincidan con "${searchTerm}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
                : 'Comienza creando tu primer artículo usando el botón "Agregar Artículo"'
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
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Page numbers with ellipsis */}
            {(() => {
              const pages = []
              const maxVisiblePages = 7 // Show max 7 page numbers
              const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
              
              if (totalPages <= maxVisiblePages) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => paginate(i)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === i
                          ? 'bg-[#5A6F80] text-white border border-[#5A6F80]'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i}
                    </button>
                  )
                }
              } else {
                // Smart pagination with ellipsis for large numbers
                if (currentPage <= 4) {
                  // Show first 5 pages + ellipsis + last page
                  for (let i = 1; i <= 5; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === i
                            ? 'bg-[#5A6F80] text-white border border-[#5A6F80]'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i}
                      </button>
                    )
                  }
                  pages.push(
                    <span key="ellipsis1" className="px-2 py-2 text-gray-500">...</span>
                  )
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => paginate(totalPages)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  )
                } else if (currentPage >= totalPages - 3) {
                  // Show first page + ellipsis + last 5 pages
                  pages.push(
                    <button
                      key={1}
                      onClick={() => paginate(1)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      1
                    </button>
                  )
                  pages.push(
                    <span key="ellipsis2" className="px-2 py-2 text-gray-500">...</span>
                  )
                  for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === i
                            ? 'bg-[#5A6F80] text-white border border-[#5A6F80]'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i}
                      </button>
                    )
                  }
                } else {
                  // Show first page + ellipsis + current-2 to current+2 + ellipsis + last page
                  pages.push(
                    <button
                      key={1}
                      onClick={() => paginate(1)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      1
                    </button>
                  )
                  pages.push(
                    <span key="ellipsis3" className="px-2 py-2 text-gray-500">...</span>
                  )
                  for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => paginate(i)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === i
                            ? 'bg-[#5A6F80] text-white border border-[#5A6F80]'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i}
                      </button>
                    )
                  }
                  pages.push(
                    <span key="ellipsis4" className="px-2 py-2 text-gray-500">...</span>
                  )
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => paginate(totalPages)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  )
                }
              }
              
              return pages
            })()}
            
            <button 
              onClick={() => paginate(Math.min(Math.ceil(filteredArticles.length / articlesPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(filteredArticles.length / articlesPerPage)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
