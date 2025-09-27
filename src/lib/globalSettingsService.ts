import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export interface GlobalSettings {
  id: string
  location: string
  mail: string
  facebookUrl: string | null
  instagramUrl: string | null
  whatsappNumber: string | null
  mainLogo: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateGlobalSettingsData {
  location: string
  mail: string
  facebookUrl?: string
  instagramUrl?: string
  whatsappNumber?: string
  mainLogo: string
}

export interface UpdateGlobalSettingsData {
  id: string
  location?: string
  mail?: string
  facebookUrl?: string
  instagramUrl?: string
  whatsappNumber?: string
  mainLogo?: string
}

export async function createGlobalSettings(data: CreateGlobalSettingsData): Promise<GlobalSettings> {
  return await prisma.globalSettings.create({
    data: {
      location: data.location,
      mail: data.mail,
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
      whatsappNumber: data.whatsappNumber,
      mainLogo: data.mainLogo,
    },
  })
}

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  return await prisma.globalSettings.findFirst()
}

export async function updateGlobalSettings(data: UpdateGlobalSettingsData): Promise<GlobalSettings> {
  return await prisma.globalSettings.update({
    where: { id: data.id },
    data: {
      location: data.location,
      mail: data.mail,
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
      whatsappNumber: data.whatsappNumber,
      mainLogo: data.mainLogo,
    },
  })
}

export async function deleteGlobalSettings(id: string): Promise<void> {
  await prisma.globalSettings.delete({
    where: { id },
  })
}
