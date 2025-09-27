import { prisma } from './prisma'

export interface CreateApoyoData {
  title: string
  description?: string
  widgetCode: string
  isActive?: boolean
}

export type UpdateApoyoData = Partial<CreateApoyoData>

export interface ApoyoWithDetails {
  id: string
  title: string
  description: string | null
  widgetCode: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ApoyoListParams {
  page?: number
  limit?: number
  search?: string
  dateFilter?: string
  isActive?: boolean
}

// Create a new apoyo item
export async function createApoyo(data: CreateApoyoData): Promise<ApoyoWithDetails> {
  const apoyo = await prisma.apoyo.create({
    data: {
      ...data,
      isActive: data.isActive ?? true
    }
  })

  return apoyo
}

// Get apoyo by ID
export async function getApoyoById(id: string): Promise<ApoyoWithDetails | null> {
  return await prisma.apoyo.findUnique({
    where: { id }
  })
}

// Get all active apoyo items
export async function getActiveApoyo(): Promise<ApoyoWithDetails[]> {
  return await prisma.apoyo.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })
}

// Get apoyo list with pagination and filters
export async function getApoyoList(params: ApoyoListParams) {
  const { page = 1, limit = 10, search, dateFilter, isActive } = params
  const skip = (page - 1) * limit

  // Build where clause
  const where: {
    OR?: Array<{
      title?: { contains: string; mode: 'insensitive' }
      description?: { contains: string; mode: 'insensitive' }
    }>
    isActive?: boolean
    createdAt?: {
      gte?: Date
    }
  } = {}
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  if (isActive !== undefined) {
    where.isActive = isActive
  }

  // Apply date filter
  if (dateFilter) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (dateFilter) {
      case 'hoy':
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        where.createdAt = {
          gte: today
        }
        // Add a condition to exclude tomorrow
        break
      case 'ultima-semana':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        where.createdAt = {
          gte: weekAgo
        }
        break
      case 'ultimo-mes':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        where.createdAt = {
          gte: monthAgo
        }
        break
    }
  }

  // Get total count
  const total = await prisma.apoyo.count({ where })

  // Get apoyo with pagination
  const apoyo = await prisma.apoyo.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit
  })

  return {
    apoyo,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  }
}

// Update apoyo
export async function updateApoyo(id: string, data: UpdateApoyoData): Promise<ApoyoWithDetails> {
  const apoyo = await prisma.apoyo.update({
    where: { id },
    data
  })

  return apoyo
}

// Delete apoyo
export async function deleteApoyo(id: string): Promise<void> {
  await prisma.apoyo.delete({
    where: { id }
  })
}

// Get apoyo statistics
export async function getApoyoStats() {
  const total = await prisma.apoyo.count()
  const active = await prisma.apoyo.count({
    where: { isActive: true }
  })
  const inactive = await prisma.apoyo.count({
    where: { isActive: false }
  })

  return {
    total,
    active,
    inactive
  }
}
