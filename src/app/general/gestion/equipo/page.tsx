'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface Team {
  id: string
  name: string
  role: string
  role_en: string
  instagram_url: string | null
  facebook_url: string | null
  x_url: string | null
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export default function EquipoPage() {
  const router = useRouter()
  const toast = useToast()
  
  // State
  const [team, setTeam] = useState<Team[]>([])
  const [filteredTeam, setFilteredTeam] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [teamPerPage] = useState(6)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Load team on mount
  useEffect(() => {
    const loadTeam = async () => {
      setIsInitialLoading(true)
      try {
        const response = await fetch('/api/team')
        if (!response.ok) {
          throw new Error('Error al obtener miembros del equipo')
        }
        const teamData = await response.json()
        setTeam(teamData)
        setFilteredTeam(teamData)
      } catch (error) {
        console.error('Error loading team:', error)
        toast.error('Error al cargar los miembros del equipo')
      } finally {
        setIsInitialLoading(false)
      }
    }
    
    loadTeam()
  }, []) // Removed toast from dependencies

  // Filter team based on search and date
  useEffect(() => {
    setIsLoading(true)
    
    let filtered = team

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Date filter
    if (dateFilter) {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(member => {
        const memberDate = new Date(member.createdAt)
        const memberDay = new Date(memberDate.getFullYear(), memberDate.getMonth(), memberDate.getDate())
        
        switch (dateFilter) {
          case 'hoy':
            return memberDay.getTime() === today.getTime()
          case 'ultima-semana':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
            return memberDay >= weekAgo
          case 'ultimo-mes':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
            return memberDay >= monthAgo
          default:
            return true
        }
      })
    }

    setFilteredTeam(filtered)
    setCurrentPage(1)
    
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 500)
  }, [searchTerm, dateFilter, team])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // Handle date filter
  const handleDateFilter = (filter: string | null) => {
    setDateFilter(filter)
  }


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
  const indexOfLastMember = currentPage * teamPerPage
  const indexOfFirstMember = indexOfLastMember - teamPerPage
  const currentMembers = filteredTeam.slice(indexOfFirstMember, indexOfLastMember)
  const totalPages = Math.ceil(filteredTeam.length / teamPerPage)

  if (isInitialLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando equipo...</p>
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Equipo</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Equipo
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Gestiona y visualiza todos los miembros del equipo
          </p>
        </div>

        {/* Add Team Member Button */}
        <button
          onClick={() => router.push('/general/gestion/equipo/agregar')}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
          style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Miembro
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
                placeholder="Buscar miembros del equipo..."
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

      {/* Team Grid */}
      <div className="mb-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Buscando miembros del equipo...</p>
            </div>
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
              {searchTerm || dateFilter 
                ? 'No se encontraron miembros del equipo'
                : 'No hay miembros del equipo disponibles'
              }
            </h3>
            <p className="text-[#4A739C] font-metropolis font-regular">
              {searchTerm || dateFilter 
                ? `No se encontraron miembros ${searchTerm ? `que coincidan con "${searchTerm}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
                : 'Comienza agregando tu primer miembro del equipo usando el botón "Agregar Miembro"'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMembers.map((member) => (
              <div key={member.id} className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" style={{ borderColor: '#CFDBE8' }} onClick={() => router.push(`/general/gestion/equipo/ver/${member.id}`)}>
                {/* Member Image */}
                <div className="relative">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                {/* Member Content */}
                <div className="p-4">
                  <h3 className="font-metropolis font-bold text-lg mb-2" style={{ color: '#0D141C' }}>
                    {member.name}
                  </h3>
                  <p className="font-metropolis font-regular text-sm mb-3" style={{ color: '#4A739C' }}>
                    {member.role}
                  </p>
                  
                  {/* Social Media Icons */}
                  <div className="flex items-center space-x-3 mb-3">
                    {member.instagram_url && (
                      <div className="w-4 h-4 text-gray-600 hover:text-[#0D141C] transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); window.open(member.instagram_url!, '_blank', 'noopener,noreferrer'); }}>
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    )}
                    {member.facebook_url && (
                      <div className="w-4 h-4 text-gray-600 hover:text-[#0D141C] transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); window.open(member.facebook_url!, '_blank', 'noopener,noreferrer'); }}>
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                    )}
                    {member.x_url && (
                      <div className="w-4 h-4 text-gray-600 hover:text-[#0D141C] transition-colors cursor-pointer" onClick={(e) => { e.stopPropagation(); window.open(member.x_url!, '_blank', 'noopener,noreferrer'); }}>
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                    )}
                    {!member.instagram_url && !member.facebook_url && !member.x_url && (
                      <span className="text-xs text-gray-400">Sin redes sociales</span>
                    )}
                  </div>
                  
                  {/* Member Meta */}
                  <div className="flex items-center justify-between text-xs" style={{ color: '#4A739C' }}>
                    <span className="font-metropolis font-regular">Agregado: {formatDate(member.createdAt)}</span>
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
