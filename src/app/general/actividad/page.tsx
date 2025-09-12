'use client'

import { useState, useEffect } from 'react'

interface AuditLog {
  id: number
  title: string
  type: string
  action: string
  author: string
  date: string
  createdAt: string
}

interface AuditLogResponse {
  auditLogs: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ActividadPage() {
  const [searchText, setSearchText] = useState('')
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const itemsPerPage = 8

  // Fetch audit logs from API
  const fetchAuditLogs = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/audit-logs?page=${page}&limit=${itemsPerPage}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }
      
      const data: AuditLogResponse = await response.json()
      setAuditLogs(data.auditLogs)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }

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

  // Fetch audit logs on component mount and when page changes
  useEffect(() => {
    fetchAuditLogs(currentPage)
  }, [currentPage])

  // Auto-refresh audit logs every 30 seconds when page is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAuditLogs(currentPage)
      }
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [currentPage])

  // Listen for custom events to refresh audit logs (for cross-page communication)
  useEffect(() => {
    const handleAuditRefresh = () => {
      fetchAuditLogs(currentPage)
    }

    window.addEventListener('auditLogsUpdated', handleAuditRefresh)
    return () => window.removeEventListener('auditLogsUpdated', handleAuditRefresh)
  }, [currentPage])

  // Filter audit logs based on search and filters
  const filteredActivity = auditLogs.filter(item => {
    const matchesSearch = !searchText || 
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.author.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesType = !typeFilter || item.type === typeFilter
    
    let matchesDate = true
    if (dateFilter) {
      const itemDate = new Date(item.createdAt)
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
  })

  // Search and filter functions with pagination reset
  const handleSearch = (text: string) => {
    setSearchText(text)
    setCurrentPage(1)
    fetchAuditLogs(1)
  }

  const handleTypeFilter = (type: string | null) => {
    setTypeFilter(type)
    setCurrentPage(1)
    fetchAuditLogs(1)
  }

  const handleDateFilter = (date: string | null) => {
    setDateFilter(date)
    setCurrentPage(1)
    fetchAuditLogs(1)
  }

  const clearAllFilters = () => {
    setSearchText('')
    setTypeFilter(null)
    setDateFilter(null)
    setCurrentPage(1)
    fetchAuditLogs(1)
  }

  // Delete all audit logs
  const deleteAllAuditLogs = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos los registros de actividad? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setDeleting(true)
      setError(null)
      
      const response = await fetch('/api/audit-logs', {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete audit logs')
      }
      
      // Refresh the data
      await fetchAuditLogs(1)
      
      // Show success message (you might want to add a toast notification here)
      alert('Todos los registros de actividad han sido eliminados correctamente.')
    } catch (err) {
      console.error('Error deleting audit logs:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete audit logs')
      alert('Error al eliminar los registros de actividad. Por favor, inténtalo de nuevo.')
    } finally {
      setDeleting(false)
    }
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

            {/* Delete All Button */}
            <button 
              onClick={deleteAllAuditLogs}
              disabled={deleting || loading}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Eliminando...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar Todo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#4A739C' }}></div>
            <p className="mt-2 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
              Cargando actividad...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 font-metropolis font-regular">
              Error: {error}
            </p>
            <button 
              onClick={() => fetchAuditLogs(currentPage)}
              className="mt-2 px-4 py-2 bg-[#4A739C] text-white rounded-md hover:bg-[#3A5F7A] transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
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
              {filteredActivity.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    No se encontraron registros de actividad
                  </td>
                </tr>
              ) : (
                filteredActivity.map((item) => (
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
                          : item.action === 'Actualización'
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                const newPage = Math.max(1, currentPage - 1)
                setCurrentPage(newPage)
                fetchAuditLogs(newPage)
              }}
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
                      onClick={() => {
                        setCurrentPage(i)
                        fetchAuditLogs(i)
                      }}
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
                        onClick={() => {
                        setCurrentPage(i)
                        fetchAuditLogs(i)
                      }}
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
                      onClick={() => {
                        setCurrentPage(totalPages)
                        fetchAuditLogs(totalPages)
                      }}
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
                      onClick={() => {
                        setCurrentPage(1)
                        fetchAuditLogs(1)
                      }}
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
                        onClick={() => {
                        setCurrentPage(i)
                        fetchAuditLogs(i)
                      }}
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
                      onClick={() => {
                        setCurrentPage(1)
                        fetchAuditLogs(1)
                      }}
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
                        onClick={() => {
                        setCurrentPage(i)
                        fetchAuditLogs(i)
                      }}
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
                      onClick={() => {
                        setCurrentPage(totalPages)
                        fetchAuditLogs(totalPages)
                      }}
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
              onClick={() => {
                const newPage = Math.min(totalPages, currentPage + 1)
                setCurrentPage(newPage)
                fetchAuditLogs(newPage)
              }}
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