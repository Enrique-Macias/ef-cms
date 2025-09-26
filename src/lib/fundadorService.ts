import { prisma } from './prisma'

export interface Fundador {
  id: string
  name: string
  role_es: string
  role_en: string
  body_es: string
  body_en: string
  imageUrl: string
  facebookUrl: string | null
  instagramUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateFundadorData {
  name: string
  role_es: string
  role_en: string
  body_es: string
  body_en: string
  imageUrl: string
  facebookUrl?: string | null
  instagramUrl?: string | null
}

export interface UpdateFundadorData {
  id: string
  name?: string
  role_es?: string
  role_en?: string
  body_es?: string
  body_en?: string
  imageUrl?: string
  facebookUrl?: string | null
  instagramUrl?: string | null
}

// Create a new fundador
export const createFundador = async (data: CreateFundadorData): Promise<Fundador> => {
  const fundador = await prisma.fundador.create({
    data: {
      name: data.name,
      role_es: data.role_es,
      role_en: data.role_en,
      body_es: data.body_es,
      body_en: data.body_en,
      imageUrl: data.imageUrl,
      facebookUrl: data.facebookUrl || null,
      instagramUrl: data.instagramUrl || null,
    },
  })
  return fundador
}

// Get all fundadores
export const getAllFundadores = async (): Promise<Fundador[]> => {
  const fundadores = await prisma.fundador.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return fundadores
}

// Get a single fundador by ID
export const getFundadorById = async (id: string): Promise<Fundador | null> => {
  const fundador = await prisma.fundador.findUnique({
    where: { id },
  })
  return fundador
}

// Update a fundador
export const updateFundador = async (id: string, data: UpdateFundadorData): Promise<Fundador> => {
  const fundador = await prisma.fundador.update({
    where: { id },
    data: {
      name: data.name,
      role_es: data.role_es,
      role_en: data.role_en,
      body_es: data.body_es,
      body_en: data.body_en,
      imageUrl: data.imageUrl,
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
    },
  })
  return fundador
}

// Delete a fundador
export const deleteFundador = async (id: string): Promise<void> => {
  await prisma.fundador.delete({
    where: { id },
  })
}

// Get fundador statistics
export const getFundadorStats = async () => {
  const totalFundadores = await prisma.fundador.count()
  
  return {
    totalFundadores,
  }
}
