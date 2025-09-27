'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function NoticiasPage() {
  const [searchText, setSearchText] = useState('')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [news, setNews] = useState<Record<string, unknown>[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalNews, setTotalNews] = useState(0)
  const itemsPerPage = 8
  
  const toast = useToast()

  // Fetch news from API
  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (searchText) params.append('search', searchText)
      if (dateFilter) params.append('dateFilter', dateFilter)
      
      const response = await fetch(`/api/news?${params}`)
      if (!response.ok) throw new Error('Error al obtener noticias')
      
      const data = await response.json()
      setNews(data.news)
      setTotalPages(data.totalPages)
      setTotalNews(data.total)
    } catch (error) {
      console.error('Error fetching news:', error)
      toast.error('Error al cargar noticias')
    } finally {
      setIsLoading(false)
    }
  }

    // Load data on component mount and when filters change
  useEffect(() => {
    fetchNews()
  }, [currentPage, searchText, dateFilter])

  // Reset to first page when filters change
  const handleSearch = (text: string) => {
    setSearchText(text)
    setCurrentPage(1)
  }

  // Handle date filter changes
  const handleDateFilter = (filter: string | null) => {
    setDateFilter(filter)
    setCurrentPage(1)
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Noticias</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Noticias Recientes
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Gestiona y visualiza todas las noticias de la plataforma
          </p>
        </div>

        {/* Add News Button */}
        <Link href="/general/gestion/noticias/agregar">
          <button className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
                  style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}>
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Noticia
          </button>
        </Link>
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
                placeholder="Buscar"
                value={searchText}
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

      {/* News Grid */}
      <div className="mb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Buscando noticias...</p>
            </div>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
              {searchText || dateFilter 
                ? 'No se encontraron noticias'
                : 'No hay noticias disponibles'
              }
            </h3>
            <p className="text-[#4A739C] font-metropolis font-regular">
              {searchText || dateFilter 
                ? `No se encontraron noticias ${searchText ? `que coincidan con "${searchText}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
                : 'Comienza creando tu primera noticia usando el botón "Agregar Noticia"'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item: Record<string, unknown>) => (
              <Link key={String(item.id)} href={`/general/gestion/noticias/ver/${item.id}`}>
                <div className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col" style={{ borderColor: '#CFDBE8' }}>
                  {/* News Image */}
                  <div className="relative">
                    <Image
                      src={String(item.coverImageUrl) || 'https://images.unsplash.com/photo-1495020689067-958852a6c2c8?w=400&h=250&fit=crop&crop=center'}
                      alt={String(item.title_es)}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  {/* News Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-metropolis font-bold text-lg mb-2 line-clamp-2" style={{ color: '#0D141C' }}>
                      {String(item.title_es)}
                    </h3>
                    <p className="font-metropolis font-regular text-sm mb-3 flex-grow line-clamp-3" style={{ color: '#4A739C' }}>
                      {String(item.body_es).length > 150 ? `${String(item.body_es).substring(0, 150)}...` : String(item.body_es)}
                    </p>
                    
                    {/* News Meta */}
                    <div className="flex items-center justify-between text-xs mt-auto" style={{ color: '#4A739C' }}>
                      <span className="font-metropolis font-regular">{(() => {
                        const categories = item.category ? String(item.category).split(', ') : []
                        if (categories.length <= 2) {
                          return String(item.category)
                        } else {
                          return categories.slice(0, 2).join(', ') + '...'
                        }
                      })()}</span>
                      <span className="font-metropolis font-regular">{(() => {
                      const formatted = new Date(String(item.date)).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                      // Convert "2 de septiembre de 2025" to "Septiembre 2, 2025"
                      return formatted.replace(/^(\d+)\s+de\s+(\w+)\s+de\s+(\d+)$/, (match, day, month, year) => {
                        return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + day + ', ' + year
                      })
                    })()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
              
              if (totalPages <= maxVisiblePages) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
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
                        onClick={() => setCurrentPage(i)}
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
                      onClick={() => setCurrentPage(totalPages)}
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
                      onClick={() => setCurrentPage(1)}
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
                        onClick={() => setCurrentPage(i)}
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
                      onClick={() => setCurrentPage(1)}
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
                        onClick={() => setCurrentPage(i)}
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
                      onClick={() => setCurrentPage(totalPages)}
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
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
