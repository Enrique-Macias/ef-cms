'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function ApoyoPage() {
  const [searchText, setSearchText] = useState('')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [apoyo, setApoyo] = useState<Array<{
    id: string
    title: string
    description: string | null
    widgetCode: string
    isActive: boolean
    createdAt: string
  }>>([])
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 8
  
  const toast = useToast()

  // Fetch apoyo from API - fixed infinite loop
  const fetchApoyo = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (searchText) params.append('search', searchText)
      if (dateFilter) params.append('dateFilter', dateFilter)
      
      const response = await fetch(`/api/apoyo?${params}`)
      if (!response.ok) throw new Error('Error al obtener elementos de apoyo')
      
      const data = await response.json()
      setApoyo(data.apoyo)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching apoyo:', error)
      toast.error('Error al cargar elementos de apoyo')
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchApoyo()
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Apoyo</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Elementos de Apoyo
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Gestiona los widgets de GoFundMe para recaudación de fondos
          </p>
        </div>

        {/* Add Apoyo Button */}
        <Link href="/general/gestion/apoyo/agregar">
          <button className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
                  style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}>
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Apoyo
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
                placeholder="Buscar por título o descripción"
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

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      ) : apoyo.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            No hay elementos de apoyo
          </h3>
          <p className="text-[#4A739C] font-metropolis font-regular">
            Comienza agregando tu primer widget de GoFundMe.
          </p>
          <div className="mt-6">
            <Link href="/general/gestion/apoyo/agregar">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
                      style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}>
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Apoyo
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Apoyo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {apoyo.map((item) => (
              <Link key={item.id} href={`/general/gestion/apoyo/ver/${item.id}`}>
                <div className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" style={{ borderColor: '#CFDBE8' }}>
                  {/* Apoyo Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-metropolis font-bold text-lg mb-2" style={{ color: '#0D141C' }}>
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="font-metropolis font-regular text-sm mb-3" style={{ color: '#4A739C' }}>
                            {item.description.length > 150 ? `${item.description.substring(0, 150)}...` : item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Apoyo Meta */}
                    <div className="text-xs font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      Creado: {(() => {
                        const formatted = new Date(item.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                        // Convert "2 de septiembre de 2025" to "Septiembre 2, 2025"
                        return formatted.replace(/^(\d+)\s+de\s+(\w+)\s+de\s+(\d+)$/, (match, day, month, year) => {
                          return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + day + ', ' + year
                        })
                      })()}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-metropolis font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-metropolis font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
