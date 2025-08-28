'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/useToast'

interface Event {
  id: number
  title_es: string
  title_en: string
  body_es: string
  body_en: string
  date: string
  tags: string[]
  category: string
  category_en: string
  author: string
  location_city: string
  location_country: string
  coverImageUrl: string
  phrase: string
  phrase_en: string
  credits: string
  credits_en: string
  createdAt: string
  updatedAt: string
  tags_en: string[]
}

export default function EditarEventoPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    eventDate: new Date().toISOString().split('T')[0],
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[],
    phrase: '',
    credits: '',
    locationCity: '',
    locationCountry: ''
  })

  const [formDataEnglish, setFormDataEnglish] = useState({
    title: '',
    author: '',
    coverImage: null as File | null,
    eventDate: new Date().toISOString().split('T')[0],
    description: '',
    images: [] as File[],
    categories: [] as string[],
    tags: [] as string[],
    phrase: '',
    credits: '',
    locationCity: '',
    locationCountry: ''
  })

  const [originalData, setOriginalData] = useState<Event | null>(null)
  const [originalDataEnglish, setOriginalDataEnglish] = useState<Event | null>(null)
  const [isEnglishMode, setIsEnglishMode] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newCategoryEnglish, setNewCategoryEnglish] = useState('')
  const [newTagEnglish, setNewTagEnglish] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const toast = useToast()

  // Mock data for events
  const mockEvents: { [key: number]: Event } = {
    1: {
      id: 1,
      title_es: 'Festival de Tecnología e Innovación 2024',
      title_en: 'Technology and Innovation Festival 2024',
      body_es: 'Un evento revolucionario que reúne a los mejores expertos en tecnología, innovación y emprendimiento.',
      body_en: 'A revolutionary event that brings together the best experts in technology, innovation and entrepreneurship.',
      date: '2024-03-15',
      tags: ['Tecnología', 'Innovación', 'Emprendimiento'],
      tags_en: ['Technology', 'Innovation', 'Entrepreneurship'],
      category: 'Tecnología',
      category_en: 'Technology',
      author: 'Equipo EF',
      location_city: 'Monterrey',
      location_country: 'México',
      coverImageUrl: '/images/events/tech-festival.jpg',
      phrase: 'El futuro es ahora',
      phrase_en: 'The future is now',
      credits: 'Fotografía: Carlos Mendoza | Diseño: Ana García',
      credits_en: 'Photography: Carlos Mendoza | Design: Ana García',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    }
  }

  // Load event data on component mount
  useEffect(() => {
    const loadEventData = async () => {
      setIsLoading(true)
      setTimeout(() => {
        const eventData = mockEvents[parseInt(eventId)]
        if (eventData) {
          setOriginalData(eventData)
          setOriginalDataEnglish(eventData)
          
          // Populate Spanish form
          setFormData({
            title: eventData.title_es,
            author: eventData.author,
            coverImage: null,
            eventDate: eventData.date,
            description: eventData.body_es,
            images: [],
            categories: [eventData.category],
            tags: eventData.tags,
            phrase: eventData.phrase,
            credits: eventData.credits,
            locationCity: eventData.location_city,
            locationCountry: eventData.location_country
          })
          
          // Populate English form
          setFormDataEnglish({
            title: eventData.title_en,
            author: eventData.author,
            coverImage: null,
            eventDate: eventData.date,
            description: eventData.body_en,
            images: [],
            categories: [eventData.category_en],
            tags: eventData.tags_en,
            phrase: eventData.phrase_en,
            credits: eventData.credits_en,
            locationCity: eventData.location_city,
            locationCountry: eventData.location_country
          })
        }
        setIsLoading(false)
      }, 1000)
    }

    loadEventData()
  }, [eventId])

  // Check if there are changes
  const hasChanges = () => {
    if (!originalData) return false
    
    // Check changes in Spanish form
    const spanishChanges = 
      formData.title !== originalData.title_es ||
      formData.author !== originalData.author ||
      formData.eventDate !== originalData.date ||
      formData.description !== originalData.body_es ||
      formData.phrase !== originalData.phrase ||
      formData.credits !== originalData.credits ||
      formData.locationCity !== originalData.location_city ||
      formData.locationCountry !== originalData.location_country ||
      JSON.stringify(formData.categories) !== JSON.stringify([originalData.category]) ||
      JSON.stringify(formData.tags) !== JSON.stringify(originalData.tags)
    
    // Check changes in English form
    const englishChanges = 
      formDataEnglish.title !== originalData.title_en ||
      formDataEnglish.author !== originalData.author ||
      formDataEnglish.eventDate !== originalData.date ||
      formDataEnglish.description !== originalData.body_en ||
      formDataEnglish.phrase !== originalData.phrase_en ||
      formDataEnglish.credits !== originalData.credits_en ||
      formDataEnglish.locationCity !== originalData.location_city ||
      formDataEnglish.locationCountry !== originalData.location_country ||
      JSON.stringify(formDataEnglish.categories) !== JSON.stringify([originalData.category_en]) ||
      JSON.stringify(formDataEnglish.tags) !== JSON.stringify(originalData.tags_en)
    
    return spanishChanges || englishChanges
  }

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, [field]: value }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  // Add new category
  const addCategory = () => {
    if (isEnglishMode) {
      if (newCategoryEnglish.trim() && !formDataEnglish.categories.includes(newCategoryEnglish.trim())) {
        setFormDataEnglish(prev => ({ ...prev, categories: [...prev.categories, newCategoryEnglish.trim()] }))
        setNewCategoryEnglish('')
      }
    } else {
      if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
        setFormData(prev => ({ ...prev, categories: [...prev.categories, newCategory.trim()] }))
        setNewCategory('')
      }
    }
  }

  // Remove category
  const removeCategory = (category: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
    } else {
      setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }))
    }
  }

  // Add new tag
  const addTag = () => {
    if (isEnglishMode) {
      if (newTagEnglish.trim() && !formDataEnglish.tags.includes(newTagEnglish.trim())) {
        setFormDataEnglish(prev => ({ ...prev, tags: [...prev.tags, newTagEnglish.trim()] }))
        setNewTagEnglish('')
      }
    } else {
      if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }))
        setNewTag('')
      }
    }
  }

  // Remove tag
  const removeTag = (tag: string) => {
    if (isEnglishMode) {
      setFormDataEnglish(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    } else {
      setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
    }
  }

  // Handle form submission
  const handleUpdate = async () => {
    // Validate both Spanish and English versions
    const spanishRequiredFields = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      eventDate: formData.eventDate,
      description: formData.description.trim(),
      phrase: formData.phrase.trim(),
      credits: formData.credits.trim(),
      locationCity: formData.locationCity.trim(),
      locationCountry: formData.locationCountry.trim()
    }
    
    const englishRequiredFields = {
      title: formDataEnglish.title.trim(),
      author: formDataEnglish.author.trim(),
      eventDate: formDataEnglish.eventDate,
      description: formDataEnglish.description.trim(),
      phrase: formDataEnglish.phrase.trim(),
      credits: formDataEnglish.credits.trim(),
      locationCity: formDataEnglish.locationCity.trim(),
      locationCountry: formDataEnglish.locationCountry.trim()
    }
    
    const spanishMissingFields = Object.entries(spanishRequiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    const englishMissingFields = Object.entries(englishRequiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    if (spanishMissingFields.length > 0) {
      toast.warning(`Debes llenar todos los campos obligatorios en español: ${spanishMissingFields.join(', ')}`)
      return
    }
    
    if (englishMissingFields.length > 0) {
      toast.warning(`You must fill all required fields in English: ${englishMissingFields.join(', ')}`)
      return
    }
    
    setIsUpdating(true)
    setTimeout(() => {
      setIsUpdating(false)
      const successMessage = isEnglishMode ? 'Event updated successfully' : 'Evento actualizado exitosamente'
      toast.success(successMessage)
      router.push('/general/gestion/eventos')
    }, 2000)
  }

  // Get current form data based on language mode
  const getCurrentFormData = () => isEnglishMode ? formDataEnglish : formData
  const getCurrentNewCategory = () => isEnglishMode ? newCategoryEnglish : newCategory
  const getCurrentNewTag = () => isEnglishMode ? newTagEnglish : newTag
  const setCurrentNewCategory = (value: string) => isEnglishMode ? setNewCategoryEnglish(value) : setNewCategory(value)
  const setCurrentNewTag = (value: string) => isEnglishMode ? setNewTagEnglish(value) : setNewTag(value)

  // Translations
  const translations = {
    editEvent: isEnglishMode ? 'Edit Event' : 'Editar Evento',
    updateEvent: isEnglishMode ? 'Update Event' : 'Actualizar Evento',
    updating: isEnglishMode ? 'Updating...' : 'Actualizando...',
    title: isEnglishMode ? 'Event Title' : 'Título del Evento',
    author: isEnglishMode ? 'Author Name' : 'Nombre del autor',
    eventDate: isEnglishMode ? 'Event Date' : 'Fecha del Evento',
    description: isEnglishMode ? 'Description' : 'Descripción',
    phrase: isEnglishMode ? 'Event Phrase' : 'Frase del Evento',
    credits: isEnglishMode ? 'Credits' : 'Créditos',
    locationCity: isEnglishMode ? 'City' : 'Ciudad',
    locationCountry: isEnglishMode ? 'Country' : 'País',
    categories: isEnglishMode ? 'Categories' : 'Categorías',
    tags: isEnglishMode ? 'Tags' : 'Etiquetas',
    newCategory: isEnglishMode ? 'New category' : 'Nueva categoría',
    newTag: isEnglishMode ? 'New tag' : 'Nueva etiqueta',
    englishVersion: 'English Version',
    spanishVersion: 'Spanish Version'
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-[#4A739C] font-metropolis font-regular">Cargando evento...</p>
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
            Evento no encontrado
          </h3>
          <button
            onClick={() => router.push('/general/gestion/eventos')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A6F80] hover:bg-[#4A739C]"
          >
            Volver a Eventos
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
          <span>Eventos</span>
          <span className="mx-2 font-metropolis font-medium" style={{ color: '#4A739C' }}>/</span>
          <span className="font-metropolis font-medium" style={{ color: '#0D141C' }}>{translations.editEvent}</span>
        </nav>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="font-metropolis font-bold text-3xl mb-2" style={{ color: '#0D141C' }}>
            {translations.editEvent}
          </h1>
          <p className="font-metropolis font-regular text-lg" style={{ color: '#4A739C' }}>
            {originalData.title_es}
          </p>
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
              translations.updateEvent
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
              English Mode - Editing English version of the event
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
                  {translations.title} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
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
            </div>
          </div>

          {/* Event Date */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.eventDate} <span className="text-red-500">*</span>
            </h2>
            <input
              type="date"
              value={getCurrentFormData().eventDate}
              onChange={(e) => handleInputChange('eventDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              Ubicación <span className="text-red-500">*</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.locationCity}
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().locationCity}
                  onChange={(e) => handleInputChange('locationCity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-metropolis font-medium text-[#0D141C] mb-2">
                  {translations.locationCountry}
                </label>
                <input
                  type="text"
                  value={getCurrentFormData().locationCountry}
                  onChange={(e) => handleInputChange('locationCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.description} <span className="text-red-500">*</span>
            </h2>
            <textarea
              value={getCurrentFormData().description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent resize-none"
            />
          </div>

          {/* Phrase */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.phrase} <span className="text-red-500">*</span>
            </h2>
            <input
              type="text"
              value={getCurrentFormData().phrase}
              onChange={(e) => handleInputChange('phrase', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
            />
          </div>

          {/* Credits */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.credits} <span className="text-red-500">*</span>
            </h2>
            <input
              type="text"
              value={getCurrentFormData().credits}
              onChange={(e) => handleInputChange('credits', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5A6F80] focus:border-transparent"
            />
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.categories}
            </h2>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={getCurrentNewCategory()}
                  onChange={(e) => setCurrentNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  placeholder={translations.newCategory}
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
              
              <div className="flex flex-wrap gap-2">
                {getCurrentFormData().categories.map((category, index) => (
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

          {/* Tags */}
          <div>
            <h2 className="font-metropolis font-bold text-xl mb-4" style={{ color: '#0D141C' }}>
              {translations.tags}
            </h2>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={getCurrentNewTag()}
                  onChange={(e) => setCurrentNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  placeholder={translations.newTag}
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
              
              <div className="flex flex-wrap gap-2">
                {getCurrentFormData().tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-metropolis font-medium bg-[#E8EDF5] text-[#0D141C] rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
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
        </div>
      </div>
    </div>
  )
}
