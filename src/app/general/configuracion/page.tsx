'use client'

import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

export default function ConfiguracionPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Simulated user data
  const userData = {
    name: 'Alejandro Medina',
    email: 'alejandro@admin.com',
    password: 'Hello',
    role: 'Admin',
    avatar: 'https://avatar.iran.liara.run/username?username=Alejandro Medina'
  }

  // Form state
  const [formData, setFormData] = useState({
    name: userData.name,
    avatar: userData.avatar
  })

  // Check if there are changes
  const checkForChanges = (newData: typeof formData) => {
    const nameChanged = newData.name !== userData.name
    const avatarChanged = newData.avatar !== userData.avatar
    setHasChanges(nameChanged || avatarChanged)
  }

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    const newFormData = { ...formData, name: newName }
    setFormData(newFormData)
    checkForChanges(newFormData)
  }

  // Handle avatar change
  const handleAvatarChange = (newAvatar: string) => {
    const newFormData = { ...formData, avatar: newAvatar }
    setFormData(newFormData)
    checkForChanges(newFormData)
  }

  // Handle form submission
  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setHasChanges(false)
      // Update userData with new values
      userData.name = formData.name
      userData.avatar = formData.avatar
    }, 1000)
  }

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      name: userData.name,
      avatar: userData.avatar
    })
    setHasChanges(false)
  }

  // Handle avatar deletion
  const handleDeleteAvatar = async () => {
    setIsDeletingAvatar(true)
    // Simulate API call
    setTimeout(() => {
      setIsDeletingAvatar(false)
      handleAvatarChange('')
    }, 1000)
  }

  return (
    <div>
      {/* Gradient Banner */}
      <div className="h-32 bg-gradient-to-r from-[#F7FAFC] to-[#5A6F80] relative">
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8 relative z-10">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
            <span>Configuración</span>
            <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
            <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Perfil</span>
          </nav>
        </div>

        {/* Profile Overview and Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Profile Summary and Section Header */}
          <div className="lg:col-span-1">
            {/* Profile Overview */}
            <div className="text-center mb-16">
              <div className="relative inline-block">
                <img
                  src={formData.avatar || userData.avatar}
                  alt={userData.name}
                  className="h-32 w-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                />
                {/* Edit and Delete buttons are only for avatar management */}
                <button className="absolute bottom-6 right-0 bg-[#5A6F80] text-white p-2 rounded-full shadow-lg hover:bg-[#4A739C] transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <h1 className="font-metropolis font-bold text-4xl mb-2" style={{ color: '#0D141C' }}>
                {formData.name}
              </h1>
              <span className="inline-flex px-3 py-1 text-sm font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full">
                {userData.role}
              </span>
              <p className="mt-2 font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
                {userData.email}
              </p>
            </div>
          </div>

          {/* Right Column - Editable Form */}
          <div className="lg:col-span-2">
            {/* Personal Information Section Header */}
            <div className="mb-6">
              <h2 className="font-metropolis font-bold text-2xl mb-2" style={{ color: '#0D141C' }}>
                Información Personal
              </h2>
              <p className="font-metropolis font-regular text-base" style={{ color: '#4A739C' }}>
                Puedes cambiar tu información personal aquí.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ borderColor: '#CFDBE8' }}>
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={handleNameChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Field - Read Only */}
                <div>
                  <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Password Field - Read Only */}
                <div>
                  <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={userData.password}
                      disabled
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Role Field - Read Only */}
                <div>
                  <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                    Rol
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userData.role}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Avatar Management */}
                <div>
                  <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                    Cambiar Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={formData.avatar || userData.avatar}
                      alt="Avatar preview"
                      className="h-16 w-16 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex space-x-2">
                      <label className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#5A6F80] rounded-md hover:bg-[#4A739C] transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                const result = e.target?.result as string
                                handleAvatarChange(result)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                        />
                        Editar
                      </label>
                      <button
                        onClick={handleDeleteAvatar}
                        disabled={isDeletingAvatar}
                        className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isDeletingAvatar ? (
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
              </div>
            </div>

            {/* Action Buttons */}
            {hasChanges && (
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancelar</span>
                  </div>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#5A6F80] border border-transparent rounded-md hover:bg-[#4A739C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <Spinner size="sm" />
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4" style={{ color: '#FFFDF6' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Guardar</span>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
