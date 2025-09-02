'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function UsuariosPage() {
  const { user } = useAuth()
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<any[]>([])
  const [userStats, setUserStats] = useState({ total: 0, admins: 0, editors: 0 })
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const itemsPerPage = 5
  
  const toast = useToast()

  // Show loading state if user is not loaded
  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Verificando permisos...</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if user has admin access
  if (user.role !== 'ADMIN') {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-metropolis font-bold text-[#0D141C] mb-2">
              Acceso Denegado
            </h3>
            <p className="text-sm font-metropolis font-regular text-[#4A739C]">
              No tienes permisos para acceder a esta página. Solo los administradores pueden gestionar usuarios.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (searchText) params.append('search', searchText)
      if (roleFilter) params.append('role', roleFilter)
      
      const response = await fetch(`/api/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      
      const data = await response.json()
      setUsers(data.users)
      setTotalPages(data.totalPages)
      setTotalUsers(data.total)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/users/stats')
      if (!response.ok) throw new Error('Failed to fetch user stats')
      
      const stats = await response.json()
      setUserStats(stats)
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchUsers()
    fetchUserStats()
  }, [currentPage, searchText, roleFilter])

  // Reset to first page when filters change
  const handleSearch = (text: string) => {
    setSearchText(text)
    setCurrentPage(1)
  }

  const handleRoleFilter = (role: string | null) => {
    setRoleFilter(role)
    setCurrentPage(1)
  }





  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
          <span>Inicio</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Gestión de Usuarios</span>
        </nav>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-metropolis font-bold text-4xl mb-2" style={{ color: '#0D141C' }}>
          Gestión de Usuarios
        </h1>
        <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
          Panel de administración - Solo para administradores
        </p>
      </div>

      {/* General Overview Cards */}
      <div className="mb-8">
        <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
          Datos Generales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-base mb-2" style={{ color: '#0D141C' }}>Administradores</h3>
            <p className="font-metropolis font-bold text-3xl" style={{ color: '#0D141C' }}>{userStats.admins}</p>
          </div>
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-base mb-2" style={{ color: '#0D141C' }}>Editores</h3>
            <p className="font-metropolis font-bold text-3xl" style={{ color: '#0D141C' }}>{userStats.editors}</p>
          </div>
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-base mb-2" style={{ color: '#0D141C' }}>Miembros Totales</h3>
            <p className="font-metropolis font-bold text-3xl" style={{ color: '#0D141C' }}>{userStats.total}</p>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div>
        <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
          Usuarios
        </h2>
        
        {/* User Management Controls */}
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
                  placeholder="Buscar por nombre o correo"
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:border-gray-300 sm:text-sm"
                  style={{ '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <button 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  style={{ '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
                  onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                >
                  <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {roleFilter || 'Rol'}
                  <svg className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Role Dropdown Menu */}
                {isRoleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="py-1">
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          roleFilter === null ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          handleRoleFilter(null)
                          setIsRoleMenuOpen(false)
                        }}
                      >
                        Todos los roles
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          roleFilter === 'Admin' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          handleRoleFilter('Admin')
                          setIsRoleMenuOpen(false)
                        }}
                      >
                        Admin
                      </button>
                      <button
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          roleFilter === 'Editor' ? 'bg-[#E8EDF5] text-[#0D141C]' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          handleRoleFilter('Editor')
                          setIsRoleMenuOpen(false)
                        }}
                      >
                        Editor
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add User Button */}
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C]"
                    style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
                    onClick={() => setIsAddUserModalOpen(true)}>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Usuario
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#CFDBE8' }}>
          <table className="min-w-full divide-y" style={{ borderColor: '#CFDBE8' }}>
            <thead className="bg-stroke/20">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Avatar
                </th>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Correo
                </th>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-sm font-metropolis font-regular" style={{ color: '#0D141C' }}>
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y" style={{ borderColor: '#CFDBE8' }}>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <Spinner size="lg" />
                        <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando usuarios...</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12">
                    <div className="text-center">
                      <p className="text-[#4A739C] font-metropolis font-regular">No se encontraron usuarios</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={user.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user.fullName)}`}
                          alt={`Avatar de ${user.fullName}`}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            // Fallback to initials if image fails to load
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const fallback = target.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                        <div 
                          className="h-8 w-8 rounded-full bg-[#5A6F80] flex items-center justify-center text-white text-sm font-medium hidden"
                          style={{ display: 'none' }}
                        >
                          {user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-metropolis font-regular" style={{ color: '#0D141C' }}>
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-sm font-metropolis font-regular rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-[#E8EDF5] text-[#0D141C]' 
                          : 'bg-stroke text-[#4A739C]'
                      }`}>
                        {user.role === 'ADMIN' ? 'Admin' : 'Editor'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setEditingUser(user)
                            setIsEditUserModalOpen(true)
                          }}
                          className="text-[#4A739C] hover:text-[#3A5D80]">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => {
                            setDeletingUser(user)
                            setIsDeleteModalOpen(true)
                          }}
                          className="text-red-600 hover:text-red-900">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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

      {/* Edit User Modal */}
      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Black overlay with 60% opacity */}
          <div 
            className="absolute inset-0 bg-black opacity-60"
            onClick={() => setIsEditUserModalOpen(false)}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#E8EDF5] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-metropolis font-bold text-[#0D141C]">{editingUser.fullName}</h3>
                  <p className="text-sm font-metropolis font-regular text-[#4A739C]">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <form id="editUserForm" className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Nombre
                </label>
                <input
                  name="fullName"
                  type="text"
                  defaultValue={editingUser.fullName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={editingUser.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Rol
                </label>
                <select 
                  name="role"
                  defaultValue={editingUser.role}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent">
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                </select>
              </div>
            </form>

            {/* Modal footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  setIsSaving(true)
                  try {
                    const formData = new FormData(document.getElementById('editUserForm') as HTMLFormElement)
                    const updateData = {
                      fullName: formData.get('fullName') as string,
                      email: formData.get('email') as string,
                      role: formData.get('role') as string
                    }

                    const response = await fetch(`/api/users/${editingUser.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updateData)
                    })

                    if (!response.ok) {
                      const error = await response.json()
                      throw new Error(error.error || 'Failed to update user')
                    }

                    toast.success('Usuario actualizado exitosamente')
                    setIsEditUserModalOpen(false)
                    fetchUsers() // Refresh the list
                  } catch (error: any) {
                    console.error('Error updating user:', error)
                    toast.error(error.message || 'Error al actualizar usuario')
                  } finally {
                    setIsSaving(false)
                  }
                }}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#5A6F80] border border-transparent rounded-md hover:bg-[#4A739C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <Spinner size="sm" />
                    <span>Guardando...</span>
                  </div>
                ) : (
                  'Guardar cambios'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Black overlay with 60% opacity */}
          <div 
            className="absolute inset-0 bg-black opacity-60"
            onClick={() => setIsAddUserModalOpen(false)}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#E8EDF5] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#4A739C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-metropolis font-bold text-[#0D141C]">Nuevo Usuario</h3>
                  <p className="text-sm font-metropolis font-regular text-[#4A739C]">Agregar usuario al sistema</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <form id="addUserForm" className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Nombre
                </label>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Ingrese el nombre completo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Ingrese el correo electrónico"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Contraseña
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Ingrese la contraseña"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Rol
                </label>
                <select name="role" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent">
                  <option value="">Seleccionar rol</option>
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                </select>
              </div>
            </form>

            {/* Modal footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  setIsSaving(true)
                  try {
                    const formData = new FormData(document.getElementById('addUserForm') as HTMLFormElement)
                    const userData = {
                      fullName: formData.get('fullName') as string,
                      email: formData.get('email') as string,
                      password: formData.get('password') as string,
                      role: formData.get('role') as string
                    }

                    const response = await fetch('/api/users', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(userData)
                    })

                    if (!response.ok) {
                      const error = await response.json()
                      throw new Error(error.error || 'Failed to create user')
                    }

                    toast.success('Usuario agregado exitosamente')
                    setIsAddUserModalOpen(false)
                    fetchUsers() // Refresh the list
                    fetchUserStats() // Refresh stats
                  } catch (error: any) {
                    console.error('Error creating user:', error)
                    toast.error(error.message || 'Error al agregar usuario')
                  } finally {
                    setIsSaving(false)
                  }
                }}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#5A6F80] border border-transparent rounded-md hover:bg-[#4A739C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <Spinner size="sm" />
                    <span>Agregando...</span>
                  </div>
                ) : (
                  'Agregar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Black overlay with 60% opacity */}
          <div 
            className="absolute inset-0 bg-black opacity-60"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 z-10">
            {/* Modal body */}
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-metropolis font-bold text-[#0D141C] mb-2">
                ¿Estás seguro que deseas eliminar a este usuario?
              </h3>
              
              <p className="text-sm font-metropolis font-regular text-[#4A739C] mb-6">
                No podrás revertir esta acción.
              </p>

              {/* User info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                  {deletingUser.fullName}
                </p>
                <p className="text-sm font-metropolis font-regular text-[#4A739C]">
                  {deletingUser.email}
                </p>
                <span className={`inline-flex px-2 py-1 text-xs font-metropolis font-regular rounded-full mt-2 ${
                  deletingUser.role === 'ADMIN' 
                    ? 'bg-[#E8EDF5] text-[#0D141C]' 
                    : 'bg-stroke text-[#4A739C]'
                }`}>
                  {deletingUser.role === 'ADMIN' ? 'Admin' : 'Editor'}
                </span>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-center space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
              >
                Cancelar
              </button>
              <button 
                onClick={async () => {
                  setIsDeleting(true)
                  try {
                    const response = await fetch(`/api/users/${deletingUser.id}`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' }
                    })

                    if (!response.ok) {
                      const error = await response.json()
                      throw new Error(error.error || 'Failed to delete user')
                    }

                    toast.success('Usuario eliminado exitosamente')
                    setIsDeleteModalOpen(false)
                    setDeletingUser(null)
                    fetchUsers() // Refresh the list
                    fetchUserStats() // Refresh stats
                  } catch (error: any) {
                    console.error('Error deleting user:', error)
                    toast.error(error.message || 'Error al eliminar usuario')
                  } finally {
                    setIsDeleting(false)
                  }
                }}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#F43F5E] border border-transparent rounded-md hover:bg-[#E11D48] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="flex items-center space-x-2">
                    <Spinner size="sm" />
                    <span>Eliminando...</span>
                  </div>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
