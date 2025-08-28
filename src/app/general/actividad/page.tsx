'use client'

import { useState, useEffect } from 'react'

export default function ActividadPage() {
  const [searchText, setSearchText] = useState('')
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterMenuOpen && !(event.target as Element).closest('.filter-menu')) {
        setIsFilterMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isFilterMenuOpen])

  // Simulated activity data
  const activity = [
    {
      id: 1,
      title: 'Design landing page',
      type: 'Noticia',
      action: 'Creación',
      author: 'Sergio Elías',
      date: '2024-08-15'
    },
    {
      id: 2,
      title: 'Implement user authentication',
      type: 'Noticia',
      action: 'Actualizar',
      author: 'Alejandro Medina',
      date: '2024-07-20'
    },
    {
      id: 3,
      title: 'Write documentation',
      type: 'Evento',
      action: 'Eliminar',
      author: 'Enrique Macias',
      date: '2024-06-10'
    },
    {
      id: 4,
      title: 'Create user management system',
      type: 'Noticia',
      action: 'Creación',
      author: 'Guillermo Morales',
      date: '2024-08-12'
    },
    {
      id: 5,
      title: 'Update team information',
      type: 'Equipo',
      action: 'Actualizar',
      author: 'Miguel Castellano',
      date: '2024-08-08'
    },
    {
      id: 6,
      title: 'Add new testimonials',
      type: 'Testimonio',
      action: 'Creación',
      author: 'Sergio Elías',
      date: '2024-08-05'
    },
    {
      id: 7,
      title: 'Fix navigation bugs',
      type: 'Noticia',
      action: 'Actualizar',
      author: 'Alejandro Medina',
      date: '2024-07-28'
    },
    {
      id: 8,
      title: 'Remove outdated content',
      type: 'Evento',
      action: 'Eliminar',
      author: 'Enrique Macias',
      date: '2024-07-15'
    },
    {
      id: 9,
      title: 'Optimize database queries',
      type: 'Noticia',
      action: 'Actualizar',
      author: 'Carlos Rodríguez',
      date: '2024-07-10'
    },
    {
      id: 10,
      title: 'Add new team member',
      type: 'Equipo',
      action: 'Creación',
      author: 'Ana Martínez',
      date: '2024-07-08'
    },
    {
      id: 11,
      title: 'Update privacy policy',
      type: 'Evento',
      action: 'Actualizar',
      author: 'Luis González',
      date: '2024-07-05'
    },
    {
      id: 12,
      title: 'Create backup system',
      type: 'Noticia',
      action: 'Creación',
      author: 'María López',
      date: '2024-07-01'
    },
    {
      id: 13,
      title: 'Fix security vulnerabilities',
      type: 'Noticia',
      action: 'Actualizar',
      author: 'Pedro Sánchez',
      date: '2024-06-28'
    },
    {
      id: 14,
      title: 'Add new testimonials',
      type: 'Testimonio',
      action: 'Creación',
      author: 'Carmen Torres',
      date: '2024-06-25'
    },
    {
      id: 15,
      title: 'Update contact information',
      type: 'Equipo',
      action: 'Actualizar',
      author: 'Javier Ruiz',
      date: '2024-06-20'
    },
    {
      id: 16,
      title: 'Remove old blog posts',
      type: 'Evento',
      action: 'Eliminar',
      author: 'Isabel Moreno',
      date: '2024-06-15'
    },
    {
      id: 17,
      title: 'Implement search functionality',
      type: 'Noticia',
      action: 'Creación',
      author: 'Roberto Jiménez',
      date: '2024-06-10'
    },
    {
      id: 18,
      title: 'Update user interface',
      type: 'Noticia',
      action: 'Actualizar',
      author: 'Elena Castro',
      date: '2024-06-05'
    },
    {
      id: 19,
      title: 'Add new event calendar',
      type: 'Evento',
      action: 'Creación',
      author: 'Fernando Silva',
      date: '2024-06-01'
    },
    {
      id: 20,
      title: 'Fix mobile responsiveness',
      type: 'Noticia',
      action: 'Actualizar',
      author: 'Patricia Vega',
      date: '2024-05-28'
    }
  ]

  // Filter activity based on search and filters, then sort by date (newest first)
  const filteredActivity = activity.filter(item => {
    const matchesSearch = !searchText || 
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.author.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesType = !typeFilter || item.type === typeFilter
    
    let matchesDate = true
    if (dateFilter) {
      const itemDate = new Date(item.date)
      const today = new Date()
      
      switch (dateFilter) {
        case 'today':
          matchesDate = itemDate.toDateString() === today.toDateString()
          break
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = itemDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = itemDate >= monthAgo
          break
      }
    }
    
    return matchesSearch && matchesType && matchesDate
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Pagination logic
  const totalPages = Math.ceil(filteredActivity.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentActivity = filteredActivity.slice(startIndex, endIndex)

  // Search and filter functions with pagination reset
  const handleSearch = (text: string) => {
    setSearchText(text)
    setCurrentPage(1)
  }

  const handleTypeFilter = (type: string | null) => {
    setTypeFilter(type)
    setCurrentPage(1)
  }

  const handleDateFilter = (date: string | null) => {
    setDateFilter(date)
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setSearchText('')
    setTypeFilter(null)
    setDateFilter(null)
    setCurrentPage(1)
  }

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
          <span>Actividad</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Registros</span>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-4xl mb-2" style={{ color: '#0D141C' }}>
          Actividad Reciente
        </h1>
      </div>

      {/* Search and Filter Section */}
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
                placeholder="Buscar por título o autor"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:border-gray-300 sm:text-sm"
                style={{ '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
              />
            </div>

            {/* Filter Button */}
            <div className="relative filter-menu">
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                style={{ '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
              >
                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L6.293 13H5a1 1 0 01-1-1V4z" />
                </svg>
                Filtros
                <svg className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${isFilterMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Filter Dropdown Menu */}
              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  <div className="py-1">
                    {/* Type Filter */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-metropolis font-medium text-[#0D141C] mb-2">Tipo</h3>
                      <div className="space-y-2">
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            typeFilter === null ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleTypeFilter(null)}
                        >
                          Todos los tipos
                        </button>
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            typeFilter === 'Noticia' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleTypeFilter('Noticia')}
                        >
                          Noticia
                        </button>
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            typeFilter === 'Evento' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleTypeFilter('Evento')}
                        >
                          Evento
                        </button>
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            typeFilter === 'Testimonio' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleTypeFilter('Testimonio')}
                        >
                          Testimonio
                        </button>
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            typeFilter === 'Equipo' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleTypeFilter('Equipo')}
                        >
                          Equipo
                        </button>
                      </div>
                    </div>

                    {/* Date Filter */}
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-metropolis font-medium text-[#0D141C] mb-2">Fecha</h3>
                      <div className="space-y-2">
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            dateFilter === null ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleDateFilter(null)}
                        >
                          Todas las fechas
                        </button>
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            dateFilter === 'today' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleDateFilter('today')}
                        >
                          Hoy
                        </button>
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            dateFilter === 'week' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleDateFilter('week')}
                        >
                          Última semana
                        </button>
                        <button
                          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            dateFilter === 'month' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => handleDateFilter('month')}
                        >
                          Último mes
                        </button>
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="px-4 py-2">
                      <button
                        onClick={clearAllFilters}
                        className="w-full px-3 py-2 text-sm text-[#4A739C] hover:bg-[#E8EDF5] rounded-md transition-colors"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
        <table className="min-w-full divide-y" style={{ borderColor: '#CFDBE8' }}>
          <thead className="bg-stroke/20">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                Título
              </th>
              <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                Acción
              </th>
              <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                Autor
              </th>
              <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y" style={{ borderColor: '#CFDBE8' }}>
            {currentActivity.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-base font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  {item.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-sm font-metropolis font-regular rounded-full ${
                    item.action === 'Creación' 
                      ? 'bg-green-100 text-green-800' 
                      : item.action === 'Actualizar'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  {item.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  // Show first page + ellipsis + current page ± 1 + ellipsis + last page
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
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
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