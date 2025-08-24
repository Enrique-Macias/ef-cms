'use client'

import { useState } from 'react'

export default function UsuariosPage() {
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<any>(null)

  // Datos de usuarios
  const users = [
    { id: 1, name: 'Alejandro Medina', email: 'alejandro.medina@example.com', role: 'Admin' },
    { id: 2, name: 'Guillermo Morales', email: 'guillermo.morales@example.com', role: 'Editor' },
    { id: 3, name: 'Miguel Castellano', email: 'miguel.castellano@example.com', role: 'Editor' },
    { id: 4, name: 'Sergio Elías', email: 'sergio.elias@example.com', role: 'Editor' },
    { id: 5, name: 'Enrique Macías', email: 'enrique.macias@example.com', role: 'Editor' },
  ]

  // Filtrar usuarios basado en el rol seleccionado y texto de búsqueda
  const filteredUsers = users.filter(user => {
    const matchesRole = !roleFilter || user.role === roleFilter
    const matchesSearch = !searchText || 
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    
    return matchesRole && matchesSearch
  })

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
      </div>

      {/* General Overview Cards */}
      <div className="mb-8">
        <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
          Datos Generales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-base mb-2" style={{ color: '#0D141C' }}>Administradores</h3>
            <p className="font-metropolis font-bold text-3xl" style={{ color: '#0D141C' }}>3</p>
          </div>
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-base mb-2" style={{ color: '#0D141C' }}>Editores</h3>
            <p className="font-metropolis font-bold text-3xl" style={{ color: '#0D141C' }}>14</p>
          </div>
          <div className="bg-white border rounded-lg p-6" style={{ borderColor: '#CFDBE8' }}>
            <h3 className="font-metropolis font-regular text-base mb-2" style={{ color: '#0D141C' }}>Miembros Totales</h3>
            <p className="font-metropolis font-bold text-3xl" style={{ color: '#0D141C' }}>17</p>
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
                  onChange={(e) => setSearchText(e.target.value)}
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
                          setRoleFilter(null)
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
                          setRoleFilter('Admin')
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
                          setRoleFilter('Editor')
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
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-metropolis font-regular" style={{ color: '#0D141C' }}>
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-sm font-metropolis font-regular rounded-full ${
                      user.role === 'Admin' 
                        ? 'bg-[#E8EDF5] text-[#0D141C]' 
                        : 'bg-stroke text-[#4A739C]'
                    }`}>
                      {user.role}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              Página 1 de 10
            </span>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
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
                  <h3 className="text-lg font-metropolis font-bold text-[#0D141C]">{editingUser.name}</h3>
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
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  defaultValue={editingUser.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Email
                </label>
                <input
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
                  defaultValue={editingUser.role}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent">
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#5A6F80] border border-transparent rounded-md hover:bg-[#4A739C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] transition-colors">
                Guardar cambios
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
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Nombre
                </label>
                <input
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
                  type="password"
                  placeholder="Ingrese la contraseña"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Rol
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent">
                  <option value="">Seleccionar rol</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                </select>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#5A6F80] border border-transparent rounded-md hover:bg-[#4A739C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] transition-colors">
                Agregar
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
                  {deletingUser.name}
                </p>
                <p className="text-sm font-metropolis font-regular text-[#4A739C]">
                  {deletingUser.email}
                </p>
                <span className={`inline-flex px-2 py-1 text-xs font-metropolis font-regular rounded-full mt-2 ${
                  deletingUser.role === 'Admin' 
                    ? 'bg-[#E8EDF5] text-[#0D141C]' 
                    : 'bg-stroke text-[#4A739C]'
                }`}>
                  {deletingUser.role}
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
                onClick={() => {
                  // TODO: Implement actual delete functionality
                  setIsDeleteModalOpen(false)
                  setDeletingUser(null)
                }}
                className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
