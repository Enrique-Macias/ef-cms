'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

// Mock data for testimonials
const mockTestimonials = [
  {
    id: 1,
    author: 'María González',
    role: 'CEO, TechCorp',
    body_es: 'Esta plataforma ha transformado completamente la forma en que gestionamos nuestros proyectos. La facilidad de uso y las funcionalidades avanzadas nos han permitido aumentar nuestra productividad en un 40%.',
    body_en: 'This platform has completely transformed the way we manage our projects. The ease of use and advanced features have allowed us to increase our productivity by 40%.',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    author: 'Carlos Rodríguez',
    role: 'Director de Marketing, InnovateLab',
    body_es: 'La implementación de esta solución fue increíblemente suave. El equipo de soporte fue excepcional y los resultados superaron nuestras expectativas.',
    body_en: 'The implementation of this solution was incredibly smooth. The support team was exceptional and the results exceeded our expectations.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: 3,
    author: 'Ana Martínez',
    role: 'Fundadora, StartupHub',
    body_es: 'Como startup, necesitábamos una herramienta que creciera con nosotros. Esta plataforma no solo cumple esa expectativa, sino que también nos ayuda a escalar de manera eficiente.',
    body_en: 'As a startup, we needed a tool that would grow with us. This platform not only meets that expectation but also helps us scale efficiently.',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 4,
    author: 'Luis Fernández',
    role: 'CTO, DigitalFlow',
    body_es: 'La arquitectura técnica de esta plataforma es impresionante. La integración con nuestras herramientas existentes fue perfecta y el rendimiento es excepcional.',
    body_en: 'The technical architecture of this platform is impressive. The integration with our existing tools was perfect and the performance is exceptional.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 5,
    author: 'Sofia Herrera',
    role: 'Gerente de Producto, CloudTech',
    body_es: 'La experiencia del usuario es simplemente increíble. Nuestros clientes han notado la diferencia inmediatamente y las métricas de satisfacción han mejorado significativamente.',
    body_en: 'The user experience is simply incredible. Our customers have noticed the difference immediately and satisfaction metrics have improved significantly.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-11T11:20:00Z'
  },
  {
    id: 6,
    author: 'Roberto Silva',
    role: 'Director Ejecutivo, FutureVision',
    body_es: 'Esta plataforma nos ha dado la flexibilidad que necesitábamos para adaptarnos a un mercado en constante cambio. Es una herramienta verdaderamente transformadora.',
    body_en: 'This platform has given us the flexibility we needed to adapt to a constantly changing market. It is a truly transformative tool.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-10T13:10:00Z',
    updatedAt: '2024-01-10T13:10:00Z'
  },
  {
    id: 7,
    author: 'Carmen Vega',
    role: 'VP de Operaciones, GlobalTech',
    body_es: 'La implementación fue rápida y sin problemas. El ROI que hemos visto en los primeros 6 meses ha sido extraordinario.',
    body_en: 'The implementation was quick and trouble-free. The ROI we have seen in the first 6 months has been extraordinary.',
    imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-09T15:30:00Z',
    updatedAt: '2024-01-09T15:30:00Z'
  },
  {
    id: 8,
    author: 'Diego Morales',
    role: 'Fundador, EcoStartup',
    body_es: 'Como empresa enfocada en sostenibilidad, apreciamos que esta plataforma también comparte nuestros valores. Es eficiente y responsable con el medio ambiente.',
    body_en: 'As a sustainability-focused company, we appreciate that this platform also shares our values. It is efficient and environmentally responsible.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    createdAt: '2024-01-08T10:45:00Z',
    updatedAt: '2024-01-08T10:45:00Z'
  }
]

export default function TestimoniosPage() {
  const router = useRouter()
  const toast = useToast()
  
  // State
  const [testimonials, setTestimonials] = useState(mockTestimonials)
  const [filteredTestimonials, setFilteredTestimonials] = useState(mockTestimonials)
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
      // Simulate API call
      setTimeout(() => {
        setTestimonials(mockTestimonials)
        setFilteredTestimonials(mockTestimonials)
        setIsInitialLoading(false)
      }, 1000)
    }
    
    loadTestimonials()
  }, [])

  // Filter testimonials based on search and date
  useEffect(() => {
    setIsLoading(true)
    
    let filtered = testimonials

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.body_es.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.body_en.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(testimonial => {
        const testimonialDate = new Date(testimonial.createdAt)
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
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Pagination calculations
  const indexOfLastTestimonial = currentPage * testimonialsPerPage
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage
  const currentTestimonials = filteredTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial)
  const totalPages = Math.ceil(filteredTestimonials.length / testimonialsPerPage)

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
    <div className="p-6">
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

            {/* Date Filter */}
            <div className="relative">
              <button
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
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
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4A739C] font-metropolis font-regular">
              {searchTerm || dateFilter 
                ? `No se encontraron testimonios ${searchTerm ? `que coincidan con "${searchTerm}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
                : 'No se encontraron testimonios'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" style={{ borderColor: '#CFDBE8' }} onClick={() => router.push(`/general/gestion/testimonios/ver/${testimonial.id}`)}>
                {/* Testimonial Image */}
                <div className="relative">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.author}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                {/* Testimonial Content */}
                <div className="p-4">
                  <h3 className="font-metropolis font-bold text-lg mb-2" style={{ color: '#0D141C' }}>
                    {testimonial.author}
                  </h3>
                  <p className="font-metropolis font-regular text-sm mb-3" style={{ color: '#4A739C' }}>
                    {testimonial.role}
                  </p>
                  <p className="font-metropolis font-regular text-sm mb-3" style={{ color: '#4A739C' }}>
                    {testimonial.body_es.length > 120 
                      ? `${testimonial.body_es.substring(0, 120)}...` 
                      : testimonial.body_es
                    }
                  </p>
                  
                  {/* Testimonial Meta */}
                  <div className="flex items-center justify-between text-xs" style={{ color: '#4A739C' }}>
                    <span className="font-metropolis font-regular">{formatDate(testimonial.createdAt)}</span>
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
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Page Indicator */}
            <span className="text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
              Página {currentPage} de {totalPages}
            </span>
            
            <button 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
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
