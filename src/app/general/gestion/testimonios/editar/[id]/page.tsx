'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

// Mock data for testimonials
const mockTestimonialsData = {
  1: {
    spanish: {
      author: 'María González',
      role: 'CEO, TechCorp',
      body: 'Esta plataforma ha transformado completamente la forma en que gestionamos nuestros proyectos. La facilidad de uso y las funcionalidades avanzadas nos han permitido aumentar nuestra productividad en un 40%. La implementación fue suave y el equipo de soporte fue excepcional. Los resultados superaron todas nuestras expectativas y ahora somos más eficientes que nunca.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
    },
    english: {
      author: 'María González',
      role: 'CEO, TechCorp',
      body: 'This platform has completely transformed the way we manage our projects. The ease of use and advanced features have allowed us to increase our productivity by 40%. The implementation was smooth and the support team was exceptional. The results exceeded all our expectations and now we are more efficient than ever.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  2: {
    spanish: {
      author: 'Carlos Rodríguez',
      role: 'Director de Marketing, InnovateLab',
      body: 'La implementación de esta solución fue increíblemente suave. El equipo de soporte fue excepcional y los resultados superaron nuestras expectativas. Como empresa de marketing, necesitábamos una herramienta que nos permitiera gestionar múltiples campañas de manera eficiente. Esta plataforma no solo cumple esa expectativa, sino que también nos proporciona insights valiosos sobre el rendimiento de nuestras estrategias.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    english: {
      author: 'Carlos Rodríguez',
      role: 'Marketing Director, InnovateLab',
      body: 'The implementation of this solution was incredibly smooth. The support team was exceptional and the results exceeded our expectations. As a marketing company, we needed a tool that would allow us to manage multiple campaigns efficiently. This platform not only meets that expectation but also provides us with valuable insights into the performance of our strategies.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  3: {
    spanish: {
      author: 'Ana Martínez',
      role: 'Fundadora, StartupHub',
      body: 'Como startup, necesitábamos una herramienta que creciera con nosotros. Esta plataforma no solo cumple esa expectativa, sino que también nos ayuda a escalar de manera eficiente. La flexibilidad y la facilidad de uso nos han permitido enfocarnos en lo que realmente importa: hacer crecer nuestro negocio. Es una inversión que ha valido cada centavo.',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    english: {
      author: 'Ana Martínez',
      role: 'Founder, StartupHub',
      body: 'As a startup, we needed a tool that would grow with us. This platform not only meets that expectation but also helps us scale efficiently. The flexibility and ease of use have allowed us to focus on what really matters: growing our business. It is an investment that has been worth every penny.',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  }
}

interface FormData {
  author: string
  role: string
  body: string
  image: File | null
}

interface FormDataEnglish {
  author: string
  role: string
  body: string
  image: File | null
}

export default function EditarTestimonioPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  
  const testimonialId = params.id as string
  
  // State
  const [formData, setFormData] = useState<FormData>({
    author: '',
    role: '',
    body: '',
    image: null
  })
  
  const [formDataEnglish, setFormDataEnglish] = useState<FormDataEnglish>({
    author: '',
    role: '',
    body: '',
    image: null
  })
  
  const [originalData, setOriginalData] = useState<typeof mockTestimonialsData[keyof typeof mockTestimonialsData] | null>(null)
  const [originalDataEnglish, setOriginalDataEnglish] = useState<typeof mockTestimonialsData[keyof typeof mockTestimonialsData]['english'] | null>(null)
  
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)

  // Load testimonial data
  useEffect(() => {
    const loadTestimonial = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const data = mockTestimonialsData[parseInt(testimonialId) as keyof typeof mockTestimonialsData]
        if (data) {
          setOriginalData(data)
          setOriginalDataEnglish(data.english)
          
          // Set form data
          setFormData({
            author: data.spanish.author,
            role: data.spanish.role,
            body: data.spanish.body,
            image: null
          })
          
          setFormDataEnglish({
            author: data.english.author,
            role: data.english.role,
            body: data.english.body,
            image: null
          })
        }
        setIsLoading(false)
      }, 1000)
    }
    
    loadTestimonial()
  }, [testimonialId])

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isEnglishMode) {
        setFormDataEnglish(prev => ({ ...prev, image: file }))
      } else {
        setFormData(prev => ({ ...prev, image: file }))
      }
    }
  }

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const imageFile = files[0]
      if (imageFile.type.startsWith('image/')) {
        if (isEnglishMode) {
          setFormDataEnglish(prev => ({ ...prev, image: imageFile }))
        } else {
          setFormData(prev => ({ ...prev, image: imageFile }))
        }
      }
    }
  }

  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData

  // Check if there are changes
  const hasChanges = () => {
    if (!originalData) return false
    
    // Check changes in Spanish form
    const spanishChanges = 
      formData.author !== originalData.spanish.author ||
      formData.role !== originalData.spanish.role ||
      formData.body !== originalData.spanish.body ||
      formData.image !== null
    
    // Check changes in English form
    const englishChanges = 
      formDataEnglish.author !== originalData.english.author ||
      formDataEnglish.role !== originalData.english.role ||
      formDataEnglish.body !== originalData.english.body ||
      formDataEnglish.image !== null
    
    return spanishChanges || englishChanges
  }

  // Handle form submission
  const handleUpdate = async () => {
    // Validate required fields in both languages
    const spanishRequired = !formData.author || !formData.role || !formData.body
    const englishRequired = !formDataEnglish.author || !formDataEnglish.role || !formDataEnglish.body
    
    if (spanishRequired || englishRequired) {
      toast.warning('Debes llenar todos los campos obligatorios tanto en español como en inglés')
      return
    }

    setIsUpdating(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      const successMessage = isEnglishMode ? 'Testimonial updated successfully' : 'Testimonio actualizado exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/testimonios')
    }, 2000)
  }

  // Translations
  const translations = {
    editTestimonial: isEnglishMode ? 'Edit Testimonial' : 'Editar Testimonio',
    updateTestimonial: isEnglishMode ? 'Update Testimonial' : 'Actualizar Testimonio',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    role: isEnglishMode ? 'Role/Position' : 'Cargo/Puesto',
    testimonial: isEnglishMode ? 'Testimonial' : 'Testimonio',
    image: isEnglishMode ? 'Profile Image' : 'Imagen de Perfil',
    imageDescription: isEnglishMode 
      ? 'JPG or PNG, Maximum 300 KB. Drag and drop an image here.'
      : 'JPG o PNG, Máximo 300 KB. Arrastra y suelta una imagen aquí.',
    uploadImage: isEnglishMode ? 'Upload Image' : 'Subir Imagen',
    dragDropImage: isEnglishMode ? 'Drag and drop an image here, or click to select' : 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar',
    englishVersion: 'English Version',
    spanishVersion: 'Spanish Version'
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando testimonio...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!originalData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-metropolis font-medium text-[#0D141C] mb-2">
            Testimonio no encontrado
          </h3>
          <button
            onClick={() => router.push('/general/gestion/testimonios')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C]"
          >
            Volver a Testimonios
          </button>
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
          <span>Testimonios</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.editTestimonial}</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          {/* Testimonial Image */}
          <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
            {getCurrentFormData().image ? (
              <img
                src={URL.createObjectURL(getCurrentFormData().image!)}
                alt="Testimonial cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={isEnglishMode ? originalData.english.imageUrl : originalData.spanish.imageUrl}
                alt="Current testimonial image"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Testimonial Info */}
          <div>
            <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
              {translations.editTestimonial}
            </h1>
            <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
              {isEnglishMode ? originalData.english.author : originalData.spanish.author}
            </p>
          </div>
        </div>

        {/* Language Toggle and Update Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEnglishMode(!isEnglishMode)}
            className={`inline-flex items-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium transition-all duration-200 ${
              isEnglishMode 
                ? 'border-[#5A6F80] text-[#5A6F80] bg-white hover:bg-gray-50' 
                : 'border-[#5A6F80] text-white bg-[#5A6F80] hover:bg-[#4A739C]'
            }`}
          >
            {isEnglishMode ? translations.spanishVersion : translations.englishVersion}
          </button>

          <button
            onClick={handleUpdate}
            disabled={isUpdating || !hasChanges()}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:bg-[#4A739C] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#5A6F80', '--tw-ring-color': '#5A6F80' } as React.CSSProperties}
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>{translations.updating}</span>
              </div>
            ) : (
              translations.updateTestimonial
            )}
          </button>
        </div>
      </div>

      {/* Language Mode Indicator */}
      {isEnglishMode && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span className="text-blue-800 font-medium">
              English Mode - Editing English version of the testimonial
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border rounded-lg p-6 shadow-lg" style={{ borderColor: '#CFDBE8' }}>
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Información Básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.author} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.role} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Testimonial Content */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.testimonial}
            </h2>
            <div>
              <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                {translations.testimonial} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={getCurrentFormData().body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
              />
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.image}
            </h2>
            <div className="space-y-4">
              <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                {translations.imageDescription}
              </p>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  getCurrentFormData().image 
                    ? 'border-[#5A6F80] bg-[#F0F4F8]' 
                    : 'border-gray-300 hover:border-[#5A6F80] hover:bg-gray-50'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragOver(true)}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                {getCurrentFormData().image ? (
                  <div className="space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden">
                      <img
                        src={URL.createObjectURL(getCurrentFormData().image!)}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-metropolis font-medium text-[#0D141C]">
                      {getCurrentFormData().image?.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (isEnglishMode) {
                          setFormDataEnglish(prev => ({ ...prev, image: null }))
                        } else {
                          setFormData(prev => ({ ...prev, image: null }))
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-800 font-metropolis font-medium"
                    >
                      {isEnglishMode ? 'Remove' : 'Eliminar'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm font-metropolis font-regular" style={{ color: '#4A739C' }}>
                      {translations.dragDropImage}
                    </p>
                  </div>
                )}
              </div>

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#5A6F80] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A6F80]"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {translations.uploadImage}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
