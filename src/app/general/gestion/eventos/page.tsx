'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
}

export default function EventosPage() {
  const router = useRouter()
  const toast = useToast()
  
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [eventsPerPage] = useState(6)

  // Mock data for events (in a real app, this would come from an API)
  const mockEvents: Event[] = [
    {
      id: 1,
      title_es: 'Festival de Tecnología e Innovación 2024',
      title_en: 'Technology and Innovation Festival 2024',
      body_es: 'Un evento revolucionario que reúne a los mejores expertos en tecnología, innovación y emprendimiento. Tres días de conferencias, talleres y networking con líderes de la industria.',
      body_en: 'A revolutionary event that brings together the best experts in technology, innovation and entrepreneurship. Three days of conferences, workshops and networking with industry leaders.',
      date: '2024-03-15',
      tags: ['Tecnología', 'Innovación', 'Emprendimiento'],
      tags_en: ['Technology', 'Innovation', 'Entrepreneurship'],
      category: 'Tecnología',
      category_en: 'Technology',
      author: 'Equipo EF',
      location_city: 'Monterrey',
      location_country: 'México',
      coverImageUrl: '/images/events/tech-festival.jpg',
      phrase: 'El futuro es ahora',
      phrase_en: 'The future is now',
      credits: 'Fotografía: Carlos Mendoza | Diseño: Ana García',
      credits_en: 'Photography: Carlos Mendoza | Design: Ana García',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title_es: 'Conferencia de Sostenibilidad Ambiental',
      title_en: 'Environmental Sustainability Conference',
      body_es: 'Jornada dedicada a discutir soluciones innovadoras para los desafíos ambientales actuales. Expertos internacionales compartirán sus experiencias y propuestas.',
      body_en: 'A day dedicated to discussing innovative solutions for current environmental challenges. International experts will share their experiences and proposals.',
      date: '2024-04-20',
      tags: ['Sostenibilidad', 'Medio Ambiente', 'Innovación'],
      tags_en: ['Sustainability', 'Environment', 'Innovation'],
      category: 'Medio Ambiente',
      category_en: 'Environment',
      author: 'Equipo EF',
      location_city: 'Guadalajara',
      location_country: 'México',
      coverImageUrl: '/images/events/sustainability.jpg',
      phrase: 'Cuidando el planeta, construyendo el futuro',
      phrase_en: 'Caring for the planet, building the future',
      credits: 'Fotografía: María López | Diseño: Roberto Silva',
      credits_en: 'Photography: María López | Design: Roberto Silva',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-14T14:30:00Z'
    },
    {
      id: 3,
      title_es: 'Expo Arte Contemporáneo',
      title_en: 'Contemporary Art Expo',
      body_es: 'Exposición que celebra la creatividad y la expresión artística moderna. Artistas emergentes y consagrados presentan sus obras más recientes.',
      body_en: 'An exhibition that celebrates creativity and modern artistic expression. Emerging and established artists present their most recent works.',
      date: '2024-05-10',
      tags: ['Arte', 'Cultura', 'Creatividad'],
      tags_en: ['Art', 'Culture', 'Creativity'],
      category: 'Arte',
      category_en: 'Art',
      author: 'Equipo EF',
      location_city: 'Ciudad de México',
      location_country: 'México',
      coverImageUrl: '/images/events/art-expo.jpg',
      phrase: 'El arte transforma realidades',
      phrase_en: 'Art transforms realities',
      credits: 'Fotografía: Diego Ramírez | Diseño: Carmen Vega',
      credits_en: 'Photography: Diego Ramírez | Design: Carmen Vega',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z'
    },
    {
      id: 4,
      title_es: 'Cumbre de Liderazgo Empresarial',
      title_en: 'Business Leadership Summit',
      body_es: 'Encuentro de ejecutivos y empresarios para discutir las tendencias del liderazgo moderno y las estrategias de crecimiento empresarial.',
      body_en: 'Meeting of executives and entrepreneurs to discuss modern leadership trends and business growth strategies.',
      date: '2024-06-05',
      tags: ['Liderazgo', 'Empresarial', 'Estrategia'],
      tags_en: ['Leadership', 'Business', 'Strategy'],
      category: 'Negocios',
      category_en: 'Business',
      author: 'Equipo EF',
      location_city: 'Querétaro',
      location_country: 'México',
      coverImageUrl: '/images/events/leadership.jpg',
      phrase: 'Líderes que inspiran, empresas que crecen',
      phrase_en: 'Leaders who inspire, companies that grow',
      credits: 'Fotografía: Laura Torres | Diseño: Miguel Ángel',
      credits_en: 'Photography: Laura Torres | Design: Miguel Ángel',
      createdAt: '2024-01-12T16:45:00Z',
      updatedAt: '2024-01-12T16:45:00Z'
    },
    {
      id: 5,
      title_es: 'Festival Gastronómico Internacional',
      title_en: 'International Gastronomic Festival',
      body_es: 'Celebración de la diversidad culinaria mundial con chefs reconocidos, degustaciones y talleres de cocina para todos los niveles.',
      body_en: 'Celebration of world culinary diversity with renowned chefs, tastings and cooking workshops for all levels.',
      date: '2024-07-12',
      tags: ['Gastronomía', 'Cultura', 'Internacional'],
      tags_en: ['Gastronomy', 'Culture', 'International'],
      category: 'Gastronomía',
      category_en: 'Gastronomy',
      author: 'Equipo EF',
      location_city: 'Puebla',
      location_country: 'México',
      coverImageUrl: '/images/events/gastronomy.jpg',
      phrase: 'Sabores que unen culturas',
      phrase_en: 'Flavors that unite cultures',
      credits: 'Fotografía: Sofía Morales | Diseño: Juan Carlos',
      credits_en: 'Photography: Sofía Morales | Design: Juan Carlos',
      createdAt: '2024-01-11T11:20:00Z',
      updatedAt: '2024-01-11T11:20:00Z'
    },
    {
      id: 6,
      title_es: 'Conferencia de Salud Mental',
      title_en: 'Mental Health Conference',
      body_es: 'Evento dedicado a promover el bienestar mental y emocional, con expertos en psicología y bienestar compartiendo herramientas prácticas.',
      body_en: 'Event dedicated to promoting mental and emotional well-being, with psychology and wellness experts sharing practical tools.',
      date: '2024-08-25',
      tags: ['Salud Mental', 'Bienestar', 'Psicología'],
      tags_en: ['Mental Health', 'Wellness', 'Psychology'],
      category: 'Salud',
      category_en: 'Health',
      author: 'Equipo EF',
      location_city: 'Mérida',
      location_country: 'México',
      coverImageUrl: '/images/events/mental-health.jpg',
      phrase: 'Mente sana, vida plena',
      phrase_en: 'Healthy mind, full life',
      credits: 'Fotografía: Patricia Ruiz | Diseño: Alejandro Luna',
      credits_en: 'Photography: Patricia Ruiz | Design: Alejandro Luna',
      createdAt: '2024-01-10T13:10:00Z',
      updatedAt: '2024-01-10T13:10:00Z'
    },
    {
      id: 7,
      title_es: 'Workshop de Emprendimiento Digital',
      title_en: 'Digital Entrepreneurship Workshop',
      body_es: 'Taller intensivo de 2 días para emprendedores que quieren lanzar su negocio digital. Incluye mentorías, networking y acceso a recursos exclusivos.',
      body_en: 'Intensive 2-day workshop for entrepreneurs who want to launch their digital business. Includes mentoring, networking and access to exclusive resources.',
      date: '2024-09-15',
      tags: ['Emprendimiento', 'Digital', 'Negocios', 'Mentoría'],
      tags_en: ['Entrepreneurship', 'Digital', 'Business', 'Mentoring'],
      category: 'Negocios',
      category_en: 'Business',
      author: 'Equipo EF',
      location_city: 'Tijuana',
      location_country: 'México',
      coverImageUrl: '/images/events/digital-entrepreneurship.jpg',
      phrase: 'Construye tu futuro digital',
      phrase_en: 'Build your digital future',
      credits: 'Fotografía: Roberto Méndez | Diseño: Carmen Vega | Coordinación: Luis Torres',
      credits_en: 'Photography: Roberto Méndez | Design: Carmen Vega | Coordination: Luis Torres',
      createdAt: '2024-01-09T15:30:00Z',
      updatedAt: '2024-01-09T15:30:00Z'
    }
  ]



  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      setIsInitialLoading(true)
      // Simulate API call
      setTimeout(() => {
        setEvents(mockEvents)
        setFilteredEvents(mockEvents)
        setIsInitialLoading(false)
      }, 1000)
    }

    loadEvents()
  }, [])

  // Filter events based on search term and date filter
  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title_es.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.body_es.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.body_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply date filter
    if (dateFilter) {
      const today = new Date()
      const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        
        switch (dateFilter) {
          case 'hoy':
            return eventDate.toDateString() === today.toDateString()
          case 'ultima-semana':
            return eventDate >= oneWeekAgo
          case 'ultimo-mes':
            return eventDate >= oneMonthAgo
          default:
            return true
        }
      })
    }

    setFilteredEvents(filtered)
    setCurrentPage(1)
  }, [searchTerm, dateFilter, events])

  // Get current events for pagination
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent)

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
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando eventos...</p>
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Eventos</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Eventos Recientes
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Gestiona y visualiza todos los eventos de la plataforma
          </p>
        </div>

        {/* Add Event Button */}
        <button
          onClick={() => router.push('/general/gestion/eventos/agregar')}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
          style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Evento
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
                placeholder="Buscar eventos..."
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

      {/* Events Grid */}
      <div className="mb-8">
        {isInitialLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando eventos...</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Buscando eventos...</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4A739C] font-metropolis font-regular">
              {searchTerm || dateFilter 
                ? `No se encontraron eventos ${searchTerm ? `que coincidan con "${searchTerm}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
                : 'No se encontraron eventos'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentEvents.map((event) => {
              const status = getEventStatus(event.date)
              return (
                <div
                  key={event.id}
                  className="bg-white border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  style={{ borderColor: '#CFDBE8' }}
                  onClick={() => router.push(`/general/gestion/eventos/ver/${event.id}`)}
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-metropolis font-medium text-white ${status.color}`}>
                      {status.status}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="font-metropolis font-bold text-xl mb-2 line-clamp-2" style={{ color: '#0D141C' }}>
                      {event.title_es}
                    </h3>

                    {/* Date and Location */}
                    <div className="flex items-center space-x-4 mb-3 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location_city}, {event.location_country}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm font-metropolis font-regular mb-4 line-clamp-3" style={{ color: '#4A739C' }}>
                      {event.body_es}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 text-xs font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full">
                          +{event.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Author and Category */}
                    <div className="flex items-center justify-between text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      <span>Por {event.author}</span>
                      <span className="px-2 py-1 bg-[#F0F4F8] rounded-full">
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {Math.ceil(filteredEvents.length / eventsPerPage) > 1 && (
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
              Página {currentPage} de {Math.ceil(filteredEvents.length / eventsPerPage)}
            </span>
            
            <button 
              onClick={() => paginate(Math.min(Math.ceil(filteredEvents.length / eventsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(filteredEvents.length / eventsPerPage)}
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
