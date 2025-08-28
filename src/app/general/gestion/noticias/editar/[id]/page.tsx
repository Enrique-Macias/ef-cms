'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

export default function EditarNoticiaPage() {
  const params = useParams()
  const router = useRouter()
  const newsId = params.id as string

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    publicationDate: '',
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[]
  })

  const [originalData, setOriginalData] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    publicationDate: '',
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[]
  })

  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isCoverDragOver, setIsCoverDragOver] = useState(false)
  
  const toast = useToast()

  // Mock data for news (in a real app, this would come from an API)
  const mockNewsData = {
    1: {
      title: 'Nueva Tecnología Revoluciona la Industria Local',
      author: 'Alejandro Medina',
      coverImage: null,
      publicationDate: '2024-01-15',
      description: 'Una empresa local ha desarrollado una innovadora tecnología que promete transformar completamente la forma en que trabajamos en la región. Esta innovación representa un avance significativo en la industria y abre nuevas posibilidades para el desarrollo económico local.',
      images: [],
      categories: ['Tecnología', 'Innovación'],
      tags: ['Local', 'Desarrollo', 'Futuro']
    },
    2: {
      title: 'Festival Cultural Atrae Miles de Visitantes',
      author: 'María González',
      coverImage: null,
      publicationDate: '2024-01-14',
      description: 'El evento cultural más importante del año superó todas las expectativas con más de 15,000 asistentes y presentaciones internacionales. El festival se convirtió en un punto de encuentro para artistas de todo el mundo.',
      images: [],
      categories: ['Cultura', 'Eventos'],
      tags: ['Arte', 'Internacional', 'Festival']
    }
  }

  // Load news data on component mount
  useEffect(() => {
    const loadNewsData = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const newsData = mockNewsData[parseInt(newsId) as keyof typeof mockNewsData]
        if (newsData) {
          setFormData(newsData)
          setOriginalData(newsData)
        }
        setIsLoading(false)
      }, 1000)
    }

    loadNewsData()
  }, [newsId])

  // Check if form has changes
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle cover image upload
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }))
    }
  }

  // Handle multiple images upload
  const handleImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
    }
  }

  // Handle drag and drop for multiple images
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...imageFiles] }))
    }
  }

  // Handle drag and drop for cover image
  const handleCoverDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(true)
  }

  const handleCoverDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(false)
  }

  const handleCoverDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsCoverDragOver(false)
    
    const files = Array.from(event.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      setFormData(prev => ({ ...prev, coverImage: imageFile }))
    }
  }

  // Add new category
  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, newCategory.trim()] }))
      setNewCategory('')
    }
  }

  // Remove category
  const removeCategory = (category: string) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
  }

  // Add new tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
      setNewTag('')
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  // Handle form submission (update)
  const handleUpdate = async () => {
    // Validate required fields
    const requiredFields = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      coverImage: formData.coverImage,
      publicationDate: formData.publicationDate,
      description: formData.description.trim()
    }
    
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    if (missingFields.length > 0) {
      // Show warning toast for missing fields
      const fieldNames = {
        title: 'Título',
        author: 'Autor',
        coverImage: 'Portada',
        publicationDate: 'Fecha de publicación',
        description: 'Descripción'
      }
      
      const missingFieldNames = missingFields.map(field => fieldNames[field as keyof typeof fieldNames])
      toast.warning(`Debes llenar todos los campos obligatorios: ${missingFieldNames.join(', ')}`)
      return
    }
    
    setIsUpdating(true)
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      // Update original data to reflect changes
      setOriginalData(formData)
      // Show success toast
      toast.success('Noticia actualizada exitosamente')
    }, 2000)
  }

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true)
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      // Show success toast and redirect
      toast.success('Noticia eliminada exitosamente')
      router.push('/general/gestion/noticias')
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando noticia...</p>
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
          <span>Noticias</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>Editar Noticia</span>
        </nav>
      </div>

      {/* Header Section with Preview and Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Preview Image */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
            {formData.coverImage ? (
              <img
                src={URL.createObjectURL(formData.coverImage)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Preview Info */}
          <div>
            <h1 className="font-metropolis font-bold text-2xl mb-1" style={{ color: '#0D141C' }}>
              {formData.title || 'Titulo Noticia'}
            </h1>
            <p className="font-metropolis font-regular text-sm" style={{ color: '#4A739C' }}>
              {formData.author} | {new Date(formData.publicationDate).getFullYear()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {/* Delete Button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-3 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !hasChanges}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Actualizando...</span>
              </div>
            ) : (
              'Actualizar Noticia'
            )}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ borderColor: '#CFDBE8' }}>
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Información Básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Titulo Noticia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  Autor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Nombre del autor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Cover Image Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Portada <span className="text-red-500">*</span>
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                JPG o PNG, Máximo 300 KB. Arrastra y suelta una imagen aquí.
              </p>
              <div className="flex items-center space-x-4">
                {/* Image Preview */}
                <div 
                  className={`w-32 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-dashed transition-colors cursor-pointer ${
                    isCoverDragOver 
                      ? 'border-[#5A6F80] bg-[#E8EDF5]' 
                      : 'border-gray-300 hover:border-[#5A6F80]'
                  }`}
                  onDragOver={handleCoverDragOver}
                  onDragLeave={handleCoverDragLeave}
                  onDrop={handleCoverDrop}
                  onClick={() => document.getElementById('coverImageInput')?.click()}
                >
                  {formData.coverImage ? (
                    <img
                      src={URL.createObjectURL(formData.coverImage)}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80] cursor-pointer transition-colors">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Subir Imagen
                  <input
                    id="coverImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Publication Date Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Fecha de Publicación <span className="text-red-500">*</span>
            </h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="date"
                value={formData.publicationDate}
                onChange={(e) => handleInputChange('publicationDate', e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
              />
            </div>
          </div>

          {/* Description Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Descripción <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              Descripción general y detallada sobre la noticia.
            </p>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent resize-none"
              placeholder="Escribe la descripción de la noticia..."
            />
          </div>

          {/* Images Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Imágenes
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              JPG o PNG. Máximo 5 fotos de 300 KB c/u.
            </p>
            <label 
              className={`block w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-[#5A6F80] bg-[#E8EDF5]' 
                  : 'border-gray-300 hover:border-[#5A6F80]'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  Presiona aquí para subir imágenes
                </p>
                <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                  o
                  <br />
                  Arrastra y suelta imágenes aquí
                </p>
                {isDragOver && (
                  <p className="text-sm font-metropolis font-medium text-[#5A6F80] animate-pulse">
                    ¡Suelta aquí para subir!
                  </p>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesUpload}
                className="hidden"
              />
            </label>
            
            {/* Uploaded Images Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                                         <button
                       onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                     >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Categorías
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              Ingrese las categorías uno por uno.
            </p>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  placeholder="Nueva categoría"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
                <button
                  onClick={addCategory}
                  className="px-3 py-2 bg-[#5A6F80] text-white rounded-md hover:bg-[#4A739C] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {/* Categories Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.categories.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full"
                  >
                    {category}
                    <button
                      onClick={() => removeCategory(category)}
                      className="ml-2 text-[#4A739C] hover:text-[#0D141C] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Etiquetas
            </h2>
            <p className="text-sm font-metropolis font-regular mb-3" style={{ color: '#4A739C' }}>
              Ingrese las etiquetas uno por uno.
            </p>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Nueva etiqueta"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-[#5A6F80] text-white rounded-md hover:bg-[#4A739C] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-[#4A739C] hover:text-[#0D141C] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
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
                ¿Estás seguro que deseas eliminar esta noticia?
              </h3>
              
              <p className="text-sm font-metropolis font-regular text-[#4A739C] mb-6">
                No podrás revertir esta acción.
              </p>

              {/* News info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                  {formData.title}
                </p>
                <p className="text-sm font-metropolis font-regular text-[#4A739C]">
                  {formData.author}
                </p>
                <span className="inline-flex px-2 py-1 text-xs font-metropolis font-regular rounded-full mt-2 bg-[#E8EDF5] text-[#0D141C]">
                  {formData.categories.join(', ')}
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
                onClick={handleDelete}
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
