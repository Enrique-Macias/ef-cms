'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function ApoyoPage() {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
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
  const [totalApoyo, setTotalApoyo] = useState(0)
  const itemsPerPage = 8
  
  const toast = useToast()

  // Fetch apoyo from API
  const fetchApoyo = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (searchText) params.append('search', searchText)
      if (statusFilter) params.append('isActive', statusFilter)
      
      const response = await fetch(`/api/apoyo?${params}`)
      if (!response.ok) throw new Error('Error al obtener elementos de apoyo')
      
      const data = await response.json()
      setApoyo(data.apoyo)
      setTotalPages(data.totalPages)
      setTotalApoyo(data.total)
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
  }, [currentPage, searchText, statusFilter])

  // Reset to first page when filters change
  const handleSearch = (text: string) => {
    setSearchText(text)
    setCurrentPage(1)
  }

  // Handle status filter changes
  const handleStatusFilter = (filter: string | null) => {
    setStatusFilter(filter)
    setCurrentPage(1)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento de apoyo?')) {
      return
    }

    try {
      const response = await fetch(`/api/apoyo/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      })

      if (!response.ok) throw new Error('Error al eliminar elemento de apoyo')

      toast.success('Elemento de apoyo eliminado exitosamente')
      fetchApoyo() // Refresh the list
    } catch (error) {
      console.error('Error deleting apoyo:', error)
      toast.error('Error al eliminar elemento de apoyo')
    }
  }

  // Handle toggle active status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/apoyo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          isActive: !currentStatus
        })
      })

      if (!response.ok) throw new Error('Error al actualizar estado')

      toast.success(`Elemento de apoyo ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`)
      fetchApoyo() // Refresh the list
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Error al actualizar estado')
    }
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
                  statusFilter 
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
                        statusFilter === null ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        handleStatusFilter(null)
                        setIsFilterMenuOpen(false)
                      }}
                    >
                      Todos los estados
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        statusFilter === 'true' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        handleStatusFilter('true')
                        setIsFilterMenuOpen(false)
                      }}
                    >
                      Solo activos
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        statusFilter === 'false' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        handleStatusFilter('false')
                        setIsFilterMenuOpen(false)
                      }}
                    >
                      Solo inactivos
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
            {totalApoyo} elemento{totalApoyo !== 1 ? 's' : ''} encontrado{totalApoyo !== 1 ? 's' : ''}
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
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-metropolis font-medium" style={{ color: '#0D141C' }}>
            No hay elementos de apoyo
          </h3>
          <p className="mt-1 text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
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
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-metropolis font-semibold mb-2" style={{ color: '#0D141C' }}>
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
                          {item.description}
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

                  <div className="text-xs font-metropolis font-regular mb-4" style={{ color: '#4A739C' }}>
                    Creado: {new Date(item.createdAt).toLocaleDateString('es-ES')}
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/general/gestion/apoyo/editar/${item.id}`}>
                      <button className="flex-1 bg-[#E8EDF5] text-[#0D141C] px-3 py-2 rounded-md text-sm font-metropolis font-medium hover:bg-[#D1D9E8] transition-colors">
                        Editar
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleToggleStatus(item.id, item.isActive)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-metropolis font-medium transition-colors ${
                        item.isActive 
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {item.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-100 text-red-800 px-3 py-2 rounded-md text-sm font-metropolis font-medium hover:bg-red-200 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
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
