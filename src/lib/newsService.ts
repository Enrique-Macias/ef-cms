import { prisma } from './prisma'

export interface CreateNewsData {
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
  category_en?: string
  tags_en: string[]
  newsImages?: { imageUrl: string; order?: number }[]
}

export interface UpdateNewsData extends Partial<CreateNewsData> {
  id: string
}

export interface NewsWithImages {
  id: string
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
  createdAt: Date
  updatedAt: Date
  category_en?: string | null
  tags_en: string[]
  newsImages: {
    id: string
    newsId: string
    imageUrl: string
    order: number | null
  }[]
}

export interface NewsListParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  dateFilter?: 'hoy' | 'ultima-semana' | 'ultimo-mes' | null
}

// Create a new news item
export async function createNews(data: CreateNewsData): Promise<NewsWithImages> {
  const { newsImages, ...newsData } = data
  
  const news = await prisma.news.create({
    data: {
      ...newsData,
      newsImages: newsImages ? {
        create: newsImages
      } : undefined
    },
    include: {
      newsImages: {
        orderBy: { order: 'asc' }
      }
    }
  })

  return news
}

// Get news by ID
export async function getNewsById(id: string): Promise<NewsWithImages | null> {
  return await prisma.news.findUnique({
    where: { id },
    include: {
      newsImages: {
        orderBy: { order: 'asc' }
      }
    }
  })
}

// Get news list with pagination and filters
export async function getNewsList(params: NewsListParams) {
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
      { author: { contains: search, mode: 'insensitive' } }
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
  const total = await prisma.news.count({ where })

  // Get news with pagination
  const news = await prisma.news.findMany({
    where,
    include: {
      newsImages: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { date: 'desc' },
    skip,
    take: limit
  })

  return {
    news,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  }
}

// Update news
export async function updateNews(id: string, data: UpdateNewsData): Promise<NewsWithImages> {
  const { newsImages, ...newsData } = data

  // If newsImages are provided, delete existing ones and create new ones
  if (newsImages) {
    await prisma.newsImage.deleteMany({
      where: { newsId: id }
    })
  }

  const news = await prisma.news.update({
    where: { id },
    data: {
      ...newsData,
      newsImages: newsImages ? {
        create: newsImages
      } : undefined
    },
    include: {
      newsImages: {
        orderBy: { order: 'asc' }
      }
    }
  })

  return news
}

// Delete news
export async function deleteNews(id: string): Promise<void> {
  // Delete related news images first
  await prisma.newsImage.deleteMany({
    where: { newsId: id }
  })

  // Delete the news
  await prisma.news.delete({
    where: { id }
  })
}

// Get news statistics
export async function getNewsStats() {
  const total = await prisma.news.count()
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [todayCount, weekCount, monthCount] = await Promise.all([
    prisma.news.count({
      where: {
        date: {
          gte: startOfToday,
          lte: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    }),
    prisma.news.count({
      where: { date: { gte: thisWeek } }
    }),
    prisma.news.count({
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
export async function getCategories() {
  const categories = await prisma.news.findMany({
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
