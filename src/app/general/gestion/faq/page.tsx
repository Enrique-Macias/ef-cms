'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface FAQ {
  id: string
  question_es: string
  question_en: string
  answer_es: string
  answer_en: string
  order: number
  createdAt: string
  updatedAt: string
}

export default function FAQPage() {
  const [searchText, setSearchText] = useState('')
  const [dateFilter, setDateFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 8
  
  const toast = useToast()

  // Fetch FAQs from API
  const fetchFAQs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/faq')
      if (!response.ok) throw new Error('Error al obtener preguntas frecuentes')
      
      const data = await response.json()
      setFaqs(data)
      setTotalPages(Math.ceil(data.length / itemsPerPage))
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      toast.error('Error al cargar preguntas frecuentes')
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchFAQs()
  }, [])

  // Filter FAQs based on search term and date filter
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = !searchText || 
      faq.question_es.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.question_en.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer_es.toLowerCase().includes(searchText.toLowerCase()) ||
      faq.answer_en.toLowerCase().includes(searchText.toLowerCase())

    const matchesDate = !dateFilter || (() => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const faqDate = new Date(faq.createdAt)
      const faqDay = new Date(faqDate.getFullYear(), faqDate.getMonth(), faqDate.getDate())

      switch (dateFilter) {
        case 'hoy':
          return faqDay.getTime() === today.getTime()
        case 'ultima-semana':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return faqDay >= weekAgo
        case 'ultimo-mes':
          const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
          return faqDay >= monthAgo
        default:
          return true
      }
    })()

    return matchesSearch && matchesDate
  })

  // Get current FAQs for pagination
  const indexOfLastFAQ = currentPage * itemsPerPage
  const indexOfFirstFAQ = indexOfLastFAQ - itemsPerPage
  const currentFAQs = filteredFAQs.slice(indexOfFirstFAQ, indexOfLastFAQ)
  const totalFilteredPages = Math.ceil(filteredFAQs.length / itemsPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, dateFilter])

  // Handle date filter changes
  const handleDateFilter = (filter: string | null) => {
    setDateFilter(filter)
    setCurrentPage(1)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const formatted = date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    // Convert "2 de septiembre de 2025" to "Septiembre 2, 2025"
    return formatted.replace(/^(\d+)\s+de\s+(\w+)\s+de\s+(\d+)$/, (match, day, month, year) => {
      return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + day + ', ' + year
    })
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
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>FAQ</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            Preguntas Frecuentes
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            Gestiona las preguntas y respuestas para la página principal
          </p>
        </div>

        {/* Add FAQ Button */}
        <Link href="/general/gestion/faq/agregar">
          <button className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
                  style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}>
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar FAQ
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
                placeholder="Buscar por pregunta o respuesta"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
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
      ) : currentFAQs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            {searchText || dateFilter ? 'No se encontraron preguntas frecuentes' : 'No hay preguntas frecuentes'}
          </h3>
          <p className="text-[#4A739C] font-metropolis font-regular">
            {searchText || dateFilter 
              ? `No se encontraron preguntas frecuentes ${searchText ? `que coincidan con "${searchText}"` : ''} ${dateFilter ? `en el período seleccionado` : ''}`
              : 'Comienza agregando tu primera pregunta frecuente.'
            }
          </p>
          {!searchText && !dateFilter && (
            <div className="mt-6">
              <Link href="/general/gestion/faq/agregar">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
                        style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}>
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar FAQ
                </button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentFAQs.map((faq) => (
              <Link key={faq.id} href={`/general/gestion/faq/ver/${faq.id}`}>
                <div className="bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer" style={{ borderColor: '#CFDBE8' }}>
                  {/* FAQ Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-metropolis font-bold text-lg mb-2 line-clamp-2" style={{ color: '#0D141C' }}>
                          {faq.question_es}
                        </h3>
                        <p className="font-metropolis font-regular text-sm mb-3 line-clamp-3" style={{ color: '#4A739C' }}>
                          {faq.answer_es.length > 150 ? `${faq.answer_es.substring(0, 150)}...` : faq.answer_es}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Orden: {faq.order}
                        </span>
                      </div>
                    </div>
                    
                    {/* FAQ Meta */}
                    <div className="text-xs font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      Creado: {formatDate(faq.createdAt)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalFilteredPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                Página {currentPage} de {totalFilteredPages}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalFilteredPages))}
                  disabled={currentPage === totalFilteredPages}
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
