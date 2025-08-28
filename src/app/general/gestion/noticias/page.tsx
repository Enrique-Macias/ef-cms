'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function NoticiasPage() {
  const [searchText, setSearchText] = useState('')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  
  const toast = useToast()
  


  // Mock data for news
  const news = [
    {
      id: 1,
      title: 'Nueva Tecnología Revoluciona la Industria Local',
      excerpt: 'Una empresa local ha desarrollado una innovadora tecnología que promete transformar completamente la forma en que trabajamos en la región...',
      image: 'https://5092991.fs1.hubspotusercontent-na1.net/hubfs/5092991/Blog%20notas%20maestrias%20y%20diplomados/Innovaci%C3%B3n%20tecnol%C3%B3gica.jpg',
      date: '2024-01-15',
      category: 'Tecnología'
    },
    {
      id: 2,
      title: 'Festival Cultural Atrae Miles de Visitantes',
      excerpt: 'El evento cultural más importante del año superó todas las expectativas con más de 15,000 asistentes y presentaciones internacionales...',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-14',
      category: 'Cultura'
    },
    {
      id: 3,
      title: 'Inauguración del Nuevo Centro Comercial',
      excerpt: 'El centro comercial más grande de la ciudad abrió sus puertas hoy, ofreciendo más de 200 tiendas y restaurantes para los residentes...',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-13',
      category: 'Negocios'
    },
    {
      id: 4,
      title: 'Equipo Deportivo Local Gana Campeonato',
      excerpt: 'En una emocionante final, nuestro equipo local se coronó campeón regional después de una temporada llena de logros y superación...',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-12',
      category: 'Deportes'
    },
    {
      id: 5,
      title: 'Nuevas Medidas Ambientales Implementadas',
      excerpt: 'El gobierno municipal anunció hoy un paquete de medidas ambientales que incluye la instalación de paneles solares en edificios públicos...',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-15',
      category: 'Medio Ambiente'
    },
    {
      id: 6,
      title: 'Exposición de Arte Contemporáneo',
      excerpt: 'La galería municipal presenta una nueva exposición que reúne obras de artistas locales e internacionales, explorando temas de identidad...',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-10',
      category: 'Arte'
    },
    {
      id: 7,
      title: 'Conferencia sobre Innovación Empresarial',
      excerpt: 'Expertos internacionales se reunirán en nuestra ciudad para discutir las últimas tendencias en innovación empresarial y desarrollo sostenible...',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-09',
      category: 'Negocios'
    },
    {
      id: 8,
      title: 'Nuevo Parque Recreativo Abre sus Puertas',
      excerpt: 'Las familias de la ciudad ahora pueden disfrutar de un nuevo parque recreativo con áreas de juego, senderos para caminar y espacios para picnic...',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-08',
      category: 'Comunidad'
    },
    {
      id: 9,
      title: 'Programa de Educación Digital para Jóvenes',
      excerpt: 'Se lanzó un nuevo programa educativo que busca capacitar a jóvenes en habilidades digitales y prepararlos para el mercado laboral del futuro...',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-07',
      category: 'Educación'
    },
    {
      id: 10,
      title: 'Celebración del Día de la Independencia',
      excerpt: 'La ciudad se prepara para celebrar el Día de la Independencia con un desfile histórico, conciertos al aire libre y actividades culturales...',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop&crop=center',
      date: '2024-01-06',
      category: 'Cultura'
    }
  ]

  // Filter news based on search text and date filter
  const filteredNews = news.filter(item => {
    const matchesSearch = !searchText || 
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchText.toLowerCase())
    
    if (!matchesSearch) return false
    
    if (!dateFilter) return true
    
    const itemDate = new Date(item.date)
    const today = new Date()
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    switch (dateFilter) {
      case 'hoy':
        return itemDate.toDateString() === today.toDateString()
      case 'ultima-semana':
        return itemDate >= oneWeekAgo
      case 'ultimo-mes':
        return itemDate >= oneMonthAgo
      default:
        return true
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNews = filteredNews.slice(startIndex, endIndex)

  // Reset to first page when search changes
  const handleSearch = (text: string) => {
    setIsLoading(true)
    setSearchText(text)
    setCurrentPage(1)
    // Simulate API call delay
    setTimeout(() => setIsLoading(false), 500)
  }

  // Handle date filter changes
  const handleDateFilter = (filter: string | null) => {
    setIsLoading(true)
    setDateFilter(filter)
    setCurrentPage(1)
    // Simulate API call delay
    setTimeout(() => setIsLoading(false), 500)
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Noticias</span>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-4xl mb-2" style={{ color: '#0D141C' }}>
          Noticias Recientes
        </h1>
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

          {/* Add News Button */}
          <Link href="/general/gestion/noticias/agregar">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
                    style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Noticia
            </button>
          </Link>
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
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#4A739C] font-metropolis font-regular">
              {searchText || dateFilter 
                ? `No se encontraron noticias ${searchText ? `que coincidan con "${searchText}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
                : 'No se encontraron noticias'
              }
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentNews.map((item) => (
              <div key={item.id} className="bg-white border rounded-lg overflow-hidden shadow-lg" style={{ borderColor: '#CFDBE8' }}>
                {/* News Image */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                {/* News Content */}
                <div className="p-4">
                  <h3 className="font-metropolis font-bold text-lg mb-2" style={{ color: '#0D141C' }}>
                    {item.title}
                  </h3>
                  <p className="font-metropolis font-regular text-sm mb-3" style={{ color: '#4A739C' }}>
                    {item.excerpt}
                  </p>
                  
                  {/* News Meta */}
                  <div className="flex items-center justify-between text-xs mb-4" style={{ color: '#4A739C' }}>
                    <span className="font-metropolis font-regular">{item.category}</span>
                    <span className="font-metropolis font-regular">{new Date(item.date).toLocaleDateString('es-ES')}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/general/gestion/noticias/ver/${item.id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C] transition-colors"
                    >
                      Ver Noticia
                    </Link>
                    <Link
                      href={`/general/gestion/noticias/editar/${item.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#5A6F80] bg-white hover:bg-gray-50 transition-colors"
                    >
                      Editar Noticia
                    </Link>
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
