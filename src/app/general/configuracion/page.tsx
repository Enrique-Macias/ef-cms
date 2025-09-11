'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'
import Image from 'next/image'

export default function ConfiguracionPage() {
  const { user, updateUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  
  const toast = useToast()

  // Use real user data from AuthContext
  const userData = {
    name: user?.fullName || '',
    email: user?.email || '',
    role: user?.role === 'ADMIN' ? 'Admin' : 'Editor',
    avatar: user?.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user?.fullName || '')}`
  }

  // Avatar options from the API
  const avatarOptions = [
    { id: 13, url: 'https://avatar.iran.liara.run/public/13', gender: 'female' },
    { id: 27, url: 'https://avatar.iran.liara.run/public/27', gender: 'male' },
    { id: 40, url: 'https://avatar.iran.liara.run/public/40', gender: 'male' },
    { id: 60, url: 'https://avatar.iran.liara.run/public/60', gender: 'female' },
    { id: 91, url: 'https://avatar.iran.liara.run/public/91', gender: 'female' },
    { id: 32, url: 'https://avatar.iran.liara.run/public/32', gender: 'female' },
    { id: 78, url: 'https://avatar.iran.liara.run/public/78', gender: 'male' },
    { id: 7, url: 'https://avatar.iran.liara.run/public/7', gender: 'male' },
    { id: 36, url: 'https://avatar.iran.liara.run/public/36', gender: 'female' },
    { id: 73, url: 'https://avatar.iran.liara.run/public/73', gender: 'male' },
    { id: 55, url: 'https://avatar.iran.liara.run/public/55', gender: 'male' },
    { id: 67, url: 'https://avatar.iran.liara.run/public/67', gender: 'female' },
    { id: 15, url: 'https://avatar.iran.liara.run/public/15', gender: 'male' },
    { id: 19, url: 'https://avatar.iran.liara.run/public/19', gender: 'female' },
    { id: 45, url: 'https://avatar.iran.liara.run/public/45', gender: 'female' },
    { id: 64, url: 'https://avatar.iran.liara.run/public/64', gender: 'male' },
    { id: 56, url: 'https://avatar.iran.liara.run/public/56', gender: 'female' },
    { id: 96, url: 'https://avatar.iran.liara.run/public/96', gender: 'male' },
    { id: 75, url: 'https://avatar.iran.liara.run/public/75', gender: 'female' },
    { id: 22, url: 'https://avatar.iran.liara.run/public/22', gender: 'male' },
    { id: 70, url: 'https://avatar.iran.liara.run/public/70', gender: 'female' },
    { id: 88, url: 'https://avatar.iran.liara.run/public/88', gender: 'male' },
    { id: 53, url: 'https://avatar.iran.liara.run/public/53', gender: 'female' },
    { id: 94, url: 'https://avatar.iran.liara.run/public/94', gender: 'male' },
    { id: 47, url: 'https://avatar.iran.liara.run/public/47', gender: 'female' },
    { id: 99, url: 'https://avatar.iran.liara.run/public/99', gender: 'male' },
    { id: 39, url: 'https://avatar.iran.liara.run/public/39', gender: 'male' },
    { id: 37, url: 'https://avatar.iran.liara.run/public/37', gender: 'female' },
    { id: 76, url: 'https://avatar.iran.liara.run/public/76', gender: 'male' },
    { id: 25, url: 'https://avatar.iran.liara.run/public/25', gender: 'female' },
    { id: 49, url: 'https://avatar.iran.liara.run/public/49', gender: 'male' },
    { id: 30, url: 'https://avatar.iran.liara.run/public/30', gender: 'male' },
    { id: 84, url: 'https://avatar.iran.liara.run/public/84', gender: 'female' },
    { id: 59, url: 'https://avatar.iran.liara.run/public/59', gender: 'male' },
    { id: 43, url: 'https://avatar.iran.liara.run/public/43', gender: 'female' },
    { id: 17, url: 'https://avatar.iran.liara.run/public/17', gender: 'female' },
    { id: 86, url: 'https://avatar.iran.liara.run/public/86', gender: 'male' },
    { id: 97, url: 'https://avatar.iran.liara.run/public/97', gender: 'female' },
    { id: 8, url: 'https://avatar.iran.liara.run/public/8', gender: 'male' },
    { id: 57, url: 'https://avatar.iran.liara.run/public/57', gender: 'female' },
    { id: 46, url: 'https://avatar.iran.liara.run/public/46', gender: 'male' },
    { id: 89, url: 'https://avatar.iran.liara.run/public/89', gender: 'female' },
    { id: 72, url: 'https://avatar.iran.liara.run/public/72', gender: 'male' },
    { id: 11, url: 'https://avatar.iran.liara.run/public/11', gender: 'female' },
    { id: 41, url: 'https://avatar.iran.liara.run/public/41', gender: 'male' },
    { id: 98, url: 'https://avatar.iran.liara.run/public/98', gender: 'female' },
    { id: 12, url: 'https://avatar.iran.liara.run/public/12', gender: 'male' },
    { id: 69, url: 'https://avatar.iran.liara.run/public/69', gender: 'female' },
    { id: 6, url: 'https://avatar.iran.liara.run/public/6', gender: 'male' },
    { id: 20, url: 'https://avatar.iran.liara.run/public/20', gender: 'female' },
    { id: 90, url: 'https://avatar.iran.liara.run/public/90', gender: 'male' },
    { id: 82, url: 'https://avatar.iran.liara.run/public/82', gender: 'female' },
    { id: 83, url: 'https://avatar.iran.liara.run/public/83', gender: 'male' },
    { id: 38, url: 'https://avatar.iran.liara.run/public/38', gender: 'female' },
    { id: 87, url: 'https://avatar.iran.liara.run/public/87', gender: 'male' },
    { id: 81, url: 'https://avatar.iran.liara.run/public/81', gender: 'female' },
    { id: 24, url: 'https://avatar.iran.liara.run/public/24', gender: 'male' },
    { id: 23, url: 'https://avatar.iran.liara.run/public/23', gender: 'female' },
    { id: 5, url: 'https://avatar.iran.liara.run/public/5', gender: 'male' },
    { id: 29, url: 'https://avatar.iran.liara.run/public/29', gender: 'female' },
    { id: 52, url: 'https://avatar.iran.liara.run/public/52', gender: 'male' },
    { id: 44, url: 'https://avatar.iran.liara.run/public/44', gender: 'female' },
    { id: 100, url: 'https://avatar.iran.liara.run/public/100', gender: 'male' },
    { id: 2, url: 'https://avatar.iran.liara.run/public/2', gender: 'female' },
    { id: 61, url: 'https://avatar.iran.liara.run/public/61', gender: 'male' },
    { id: 85, url: 'https://avatar.iran.liara.run/public/85', gender: 'female' },
    { id: 16, url: 'https://avatar.iran.liara.run/public/16', gender: 'male' },
    { id: 10, url: 'https://avatar.iran.liara.run/public/10', gender: 'female' },
    { id: 51, url: 'https://avatar.iran.liara.run/public/51', gender: 'male' },
    { id: 54, url: 'https://avatar.iran.liara.run/public/54', gender: 'female' },
    { id: 21, url: 'https://avatar.iran.liara.run/public/21', gender: 'male' },
    { id: 74, url: 'https://avatar.iran.liara.run/public/74', gender: 'female' },
    { id: 63, url: 'https://avatar.iran.liara.run/public/63', gender: 'male' },
    { id: 3, url: 'https://avatar.iran.liara.run/public/3', gender: 'female' },
    { id: 92, url: 'https://avatar.iran.liara.run/public/92', gender: 'male' },
    { id: 66, url: 'https://avatar.iran.liara.run/public/66', gender: 'female' },
    { id: 68, url: 'https://avatar.iran.liara.run/public/68', gender: 'male' },
    { id: 80, url: 'https://avatar.iran.liara.run/public/80', gender: 'female' },
    { id: 50, url: 'https://avatar.iran.liara.run/public/50', gender: 'male' },
    { id: 79, url: 'https://avatar.iran.liara.run/public/79', gender: 'female' },
    { id: 18, url: 'https://avatar.iran.liara.run/public/18', gender: 'male' },
    { id: 77, url: 'https://avatar.iran.liara.run/public/77', gender: 'female' },
    { id: 42, url: 'https://avatar.iran.liara.run/public/42', gender: 'male' },
    { id: 4, url: 'https://avatar.iran.liara.run/public/4', gender: 'female' },
    { id: 9, url: 'https://avatar.iran.liara.run/public/9', gender: 'male' },
    { id: 1, url: 'https://avatar.iran.liara.run/public/1', gender: 'female' },
    { id: 28, url: 'https://avatar.iran.liara.run/public/28', gender: 'female' },
    { id: 35, url: 'https://avatar.iran.liara.run/public/35', gender: 'male' },
    { id: 31, url: 'https://avatar.iran.liara.run/public/31', gender: 'female' },
    { id: 34, url: 'https://avatar.iran.liara.run/public/34', gender: 'male' },
    { id: 93, url: 'https://avatar.iran.liara.run/public/93', gender: 'female' },
    { id: 65, url: 'https://avatar.iran.liara.run/public/65', gender: 'male' },
    { id: 26, url: 'https://avatar.iran.liara.run/public/26', gender: 'female' },
    { id: 58, url: 'https://avatar.iran.liara.run/public/58', gender: 'male' },
    { id: 14, url: 'https://avatar.iran.liara.run/public/14', gender: 'female' },
    { id: 71, url: 'https://avatar.iran.liara.run/public/71', gender: 'male' },
    { id: 95, url: 'https://avatar.iran.liara.run/public/95', gender: 'female' }
  ]

  // Form state
  const [formData, setFormData] = useState({
    name: userData.name,
    avatar: userData.avatar
  })

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName,
        avatar: user.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user.fullName)}`
      })
    }
  }, [user])

  // Check if there are changes
  const checkForChanges = (newData: typeof formData) => {
    const nameChanged = newData.name !== user?.fullName
    const avatarChanged = newData.avatar !== (user?.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user?.fullName || '')}`)
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
    
    try {
      // Prepare update data
      const updateData: any = {}
      if (formData.name !== user?.fullName) {
        updateData.fullName = formData.name
      }
      if (formData.avatar !== (user?.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user?.fullName || '')}`)) {
        updateData.avatarUrl = formData.avatar
      }

      // Call the updateUser function from AuthContext
      const result = await updateUser(updateData)
      
      if (result.success) {
        setHasChanges(false)
        
        // Show success toast with specific information about what was updated
        const nameChanged = formData.name !== user?.fullName
        const avatarChanged = formData.avatar !== (user?.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user?.fullName || '')}`)
        
        if (nameChanged && avatarChanged) {
          toast.success('Nombre y avatar actualizados exitosamente')
        } else if (nameChanged) {
          toast.success('Nombre actualizado exitosamente')
        } else if (avatarChanged) {
          if (formData.avatar.includes('username?username=')) {
            toast.success('Avatar cambiado a iniciales exitosamente')
          } else {
            toast.success('Avatar actualizado exitosamente')
          }
        } else {
          toast.success('Información del perfil actualizada exitosamente')
        }
      } else {
        toast.error(result.error || 'Error al actualizar el perfil')
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Error de conexión al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.fullName,
        avatar: user.avatarUrl || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(user.fullName)}`
      })
    }
    setHasChanges(false)
  }

  // Handle avatar deletion
  const handleDeleteAvatar = async () => {
    setIsDeletingAvatar(true)
    
    try {
      // Call the updateUser function to remove avatar
      const result = await updateUser({ avatarUrl: null })
      
      if (result.success) {
        handleAvatarChange('')
        toast.success('Avatar eliminado exitosamente')
      } else {
        toast.error(result.error || 'Error al eliminar el avatar')
      }
    } catch (error) {
      console.error('Delete avatar error:', error)
      toast.error('Error de conexión al eliminar avatar')
    } finally {
      setIsDeletingAvatar(false)
    }
  }

  // Handle avatar selection from modal
  const handleAvatarSelect = (avatarUrl: string) => {
    handleAvatarChange(avatarUrl)
    setShowAvatarModal(false)
  }

  // Show loading state if user is not loaded
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      {/* Gradient Banner */}
      <div className="h-42 bg-gradient-to-r from-[#F7FAFC] to-[#5A6F80] relative">
        {/* Breadcrumbs - Overlapping the banner */}
        <div className="absolute top-4 left-6 z-10">
          <nav className="text-base font-metropolis font-regular" style={{ color: '#4A739C' }}>
            <span>Configuración</span>
            <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
            <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Perfil</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8 relative z-10">

        {/* Profile Overview and Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-16">
          {/* Left Column - Profile Summary and Section Header */}
          <div className="lg:col-span-1">
            {/* Profile Overview */}
            <div className="text-left mb-8 pl-6">
              <div className="relative inline-block">
                <Image
                  src={formData.avatar || userData.avatar}
                  alt={userData.name}
                  width={128}
                  height={128}
                  className="h-32 w-32 rounded-full mb-4 border-4 border-white shadow-lg"
                />
                {/* Edit icon - Click to open avatar selection modal */}
                <button 
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-6 right-0 bg-[#5A6F80] text-white p-2 rounded-full shadow-lg hover:bg-[#4A739C] transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-metropolis font-bold text-3xl" style={{ color: '#0D141C' }}>
                  {formData.name}
                </h1>
                <span className="inline-flex px-3 py-1 text-sm font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full">
                  {user?.role === 'ADMIN' ? 'Admin' : 'Editor'}
                </span>
              </div>
              <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
                {user?.email}
              </p>
            </div>

            {/* Personal Information Section Header */}
            <div className="mb-6 pl-6">
              <h2 className="font-metropolis font-bold text-base mb-2" style={{ color: '#0D141C' }}>
                Información Personal
              </h2>
              <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
                Puedes cambiar tu información personal aquí.
              </p>
            </div>
          </div>

          {/* Right Column - Editable Form */}
          <div className="lg:col-span-2">

            <div className="bg-white border rounded-lg p-6 shadow-lg mt-60" style={{ borderColor: '#CFDBE8' }}>
              <div className="space-y-6">
                {/* First Row - Name and Email */}
                <div className="grid grid-cols-2 gap-4">
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
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <path d="M22 6l-10 7L2 6"/>
                        </svg>
                      </div>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Second Row - Password and Role */}
                <div className="grid grid-cols-2 gap-4">
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
                        value="••••••••"
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
                        value={user?.role === 'ADMIN' ? 'Admin' : 'Editor'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar Management */}
                <div>
                  <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                    Cambiar Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={formData.avatar || userData.avatar}
                      alt="Avatar preview"
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full border-2 border-gray-200"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDeleteAvatar}
                        disabled={isDeletingAvatar}
                        className="px-4 py-2 text-sm font-metropolis font-medium text-white bg-[#F43F5E] rounded-md hover:bg-[#E11D48] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <>
                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>
                <div className="flex justify-end space-x-3">
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h3 className="text-xl font-metropolis font-bold text-[#0D141C]">
                Seleccionar Avatar ({avatarOptions.length + 1} opciones)
              </h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
                {/* Default avatar option */}
                <div 
                  className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleAvatarSelect(`https://avatar.iran.liara.run/username?username=${encodeURIComponent(user?.fullName || '')}`)}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm mb-2">
                    AM
                  </div>
                  <span className="text-xs text-gray-600 text-center">Iniciales</span>
                </div>
                
                {/* API avatar options */}
                {avatarOptions.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleAvatarSelect(avatar.url)}
                  >
                    <Image
                      src={avatar.url}
                      alt={`Avatar ${avatar.id}`}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full border-2 border-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end flex-shrink-0 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 text-sm font-metropolis font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
