'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function TestimoniosPage() {
  const router = useRouter()
  const toast = useToast()
  
  // State
  const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([])
  const [filteredTestimonials, setFilteredTestimonials] = useState<Record<string, unknown>[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [testimonialsPerPage] = useState(6)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Load testimonials on mount
  useEffect(() => {
    const loadTestimonials = async () => {
      setIsInitialLoading(true)
      try {
        const response = await fetch('/api/testimonials')
        if (!response.ok) {
          throw new Error('Error al obtener testimonios')
        }
        const data = await response.json()
        setTestimonials(data)
        setFilteredTestimonials(data)
      } catch (error) {
        console.error('Error loading testimonials:', error)
        // Use toast directly without dependency
        toast.error('Error al cargar los testimonios')
        setTestimonials([])
        setFilteredTestimonials([])
      } finally {
        setIsInitialLoading(false)
      }
    }
    
    loadTestimonials()
  }, []) // Empty dependency array - only run once on mount

  // Filter testimonials based on search and date
  useEffect(() => {
    setIsLoading(true)
    
    // Ensure testimonials is an array
    let filtered = Array.isArray(testimonials) ? testimonials : []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        String(testimonial.author).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(testimonial.role).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (testimonial.body_es && String(testimonial.body_es).toLowerCase().includes(searchTerm.toLowerCase())) ||
        (testimonial.body_en && String(testimonial.body_en).toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(testimonial => {
        const testimonialDate = new Date(String(testimonial.createdAt))
        const testimonialDay = new Date(testimonialDate.getFullYear(), testimonialDate.getMonth(), testimonialDate.getDate())
        
        switch (dateFilter) {
          case 'hoy':
            return testimonialDay.getTime() === today.getTime()
          case 'ultima-semana':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            return testimonialDay >= weekAgo
          case 'ultimo-mes':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
            return testimonialDay >= monthAgo
          default:
            return true
        }
      })
    }

    setFilteredTestimonials(filtered)
    setCurrentPage(1)
    
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 500)
  }, [searchTerm, dateFilter, testimonials])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // Handle date filter
  const handleDateFilter = (filter: string | null) => {
    setDateFilter(filter)
  }

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Spanish version with English-style format (month day, year)
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    const month = months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  // Pagination calculations
  const indexOfLastTestimonial = currentPage * testimonialsPerPage
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage
  const currentTestimonials = Array.isArray(filteredTestimonials) 
    ? filteredTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial)
    : []
  const totalPages = Array.isArray(filteredTestimonials) 
    ? Math.ceil(filteredTestimonials.length / testimonialsPerPage)
    : 0

  if (isInitialLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando testimonios...</p>
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Testimonios</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Testimonios Recientes
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Gestiona y visualiza todos los testimonios de la plataforma
          </p>
        </div>

        {/* Add Testimonial Button */}
        <button
          onClick={() => router.push('/general/gestion/testimonios/agregar')}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
          style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Testimonio
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
                placeholder="Buscar testimonios..."
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

      {/* Testimonials Grid */}
      <div className="mb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Buscando testimonios...</p>
            </div>
          </div>
        ) : Array.isArray(filteredTestimonials) && filteredTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
              {searchTerm || dateFilter 
                ? 'No se encontraron testimonios'
                : 'No hay testimonios disponibles'
              }
            </h3>
            <p className="text-[#4A739C] font-metropolis font-regular">
              {searchTerm || dateFilter 
                ? `No se encontraron testimonios ${searchTerm ? `que coincidan con "${searchTerm}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
                : 'Comienza creando tu primer testimonio usando el botón "Agregar Testimonio"'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTestimonials.map((testimonial) => (
              <div key={String(testimonial.id)} className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" style={{ borderColor: '#CFDBE8' }} onClick={() => router.push(`/general/gestion/testimonios/ver/${testimonial.id}`)}>
                {/* Testimonial Image */}
                <div className="relative">
                  <Image
                    src={String(testimonial.imageUrl)}
                    alt={String(testimonial.author)}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                {/* Testimonial Content */}
                <div className="p-4">
                  <h3 className="font-metropolis font-bold text-lg mb-2" style={{ color: '#0D141C' }}>
                    {String(testimonial.author)}
                  </h3>
                  <p className="font-metropolis font-regular text-sm mb-3" style={{ color: '#4A739C' }}>
                    {String(testimonial.role)}
                  </p>
                  <p className="font-metropolis font-regular text-sm mb-3" style={{ color: '#4A739C' }}>
                    {testimonial.body_es && String(testimonial.body_es).length > 120 
                      ? `${String(testimonial.body_es).substring(0, 120)}...` 
                      : String(testimonial.body_es) || 'Sin contenido'
                    }
                  </p>
                  
                  {/* Testimonial Meta */}
                  <div className="flex items-center justify-between text-xs" style={{ color: '#4A739C' }}>
                    <span className="font-metropolis font-regular">{formatDate(String(testimonial.createdAt))}</span>
                  </div>
                </div>
              </div>
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
