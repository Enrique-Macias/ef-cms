import { prisma } from './prisma'

export interface CreateEventData {
  title_es: string
  title_en: string
  body_es: string
  body_en: string
  date: Date
  tags: string[]
  category: string
  author: string
  location_city: string
  location_country: string
  coverImageUrl: string
  phrase?: string
  phrase_en?: string
  credits: string
  credits_en: string
  category_en?: string
  tags_en: string[]
  eventImages?: { imageUrl: string; order?: number }[]
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: number
}

export interface EventWithImages {
  id: number
  title_es: string
  title_en: string
  body_es: string
  body_en: string
  date: Date
  tags: string[]
  category: string
  author: string
  location_city: string
  location_country: string
  coverImageUrl: string
  phrase: string | null
  phrase_en: string | null
  credits: string
  credits_en: string | null
  createdAt: Date
  updatedAt: Date
  category_en: string | null
  tags_en: string[]
  eventImages: {
    id: number
    eventId: number
    imageUrl: string
    order: number | null
  }[]
}

export interface EventListParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  dateFilter?: 'hoy' | 'ultima-semana' | 'ultimo-mes' | null
}

// Create a new event
export async function createEvent(data: CreateEventData): Promise<EventWithImages> {
  const { eventImages, ...eventData } = data
  
  const event = await prisma.event.create({
    data: {
      ...eventData,
      eventImages: eventImages ? {
        create: eventImages
      } : undefined
    },
    include: {
      eventImages: {
        orderBy: { order: 'asc' }
      }
    }
  })

  return event
}

// Get event by ID
export async function getEventById(id: number): Promise<EventWithImages | null> {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      eventImages: {
        orderBy: { order: 'asc' }
      }
    }
  })
}

// Get events list with pagination and filters
export async function getEventsList(params: EventListParams) {
  const { page = 1, limit = 10, search, category, dateFilter } = params
  const skip = (page - 1) * limit

  // Build where clause
  const where: {
    OR?: Array<{
      title_es?: { contains: string; mode: 'insensitive' }
      title_en?: { contains: string; mode: 'insensitive' }
      body_es?: { contains: string; mode: 'insensitive' }
      body_en?: { contains: string; mode: 'insensitive' }
      author?: { contains: string; mode: 'insensitive' }
      location_city?: { contains: string; mode: 'insensitive' }
      location_country?: { contains: string; mode: 'insensitive' }
      category?: { contains: string; mode: 'insensitive' }
      category_en?: { contains: string; mode: 'insensitive' }
    }>
    date?: { gte?: Date; lte?: Date }
  } = {}
  
  if (search) {
    where.OR = [
      { title_es: { contains: search, mode: 'insensitive' } },
      { title_en: { contains: search, mode: 'insensitive' } },
      { body_es: { contains: search, mode: 'insensitive' } },
      { body_en: { contains: search, mode: 'insensitive' } },
      { author: { contains: search, mode: 'insensitive' } },
      { location_city: { contains: search, mode: 'insensitive' } },
      { location_country: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (category) {
    where.OR = [
      { category: { contains: category, mode: 'insensitive' } },
      { category_en: { contains: category, mode: 'insensitive' } }
    ]
  }

  if (dateFilter) {
    const today = new Date()
    let startDate: Date

    switch (dateFilter) {
      case 'hoy':
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        where.date = {
          gte: startDate,
          lte: new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
        }
        break
      case 'ultima-semana':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        where.date = { gte: startDate }
        break
      case 'ultimo-mes':
        startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        where.date = { gte: startDate }
        break
    }
  }

  // Get total count
  const total = await prisma.event.count({ where })

  // Get events with pagination
  const events = await prisma.event.findMany({
    where,
    include: {
      eventImages: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { date: 'desc' },
    skip,
    take: limit
  })

  return {
    events,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  }
}

// Update event
export async function updateEvent(id: number, data: UpdateEventData): Promise<EventWithImages> {
  const { eventImages, ...eventData } = data

  // If eventImages are provided, delete existing ones and create new ones
  if (eventImages) {
    await prisma.eventImage.deleteMany({
      where: { eventId: id }
    })
  }

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...eventData,
      eventImages: eventImages ? {
        create: eventImages
      } : undefined
    },
    include: {
      eventImages: {
        orderBy: { order: 'asc' }
      }
    }
  })

  return event
}

// Delete event
export async function deleteEvent(id: number): Promise<void> {
  // Delete related event images first
  await prisma.eventImage.deleteMany({
    where: { eventId: id }
  })

  // Delete the event
  await prisma.event.delete({
    where: { id }
  })
}

// Get events statistics
export async function getEventsStats() {
  const total = await prisma.event.count()
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [todayCount, weekCount, monthCount] = await Promise.all([
    prisma.event.count({
      where: {
        date: {
          gte: startOfToday,
          lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.event.count({
      where: { date: { gte: thisWeek } }
    }),
    prisma.event.count({
      where: { date: { gte: thisMonth } }
    })
  ])

  return {
    total,
    today: todayCount,
    thisWeek: weekCount,
    thisMonth: monthCount
  }
}

// Get all categories
export async function getEventCategories() {
  const categories = await prisma.event.findMany({
    select: {
      category: true,
      category_en: true
    },
    distinct: ['category']
  })

  return categories.map(cat => ({
    spanish: cat.category,
    english: cat.category_en || cat.category
  }))
}
