import { PrismaClient } from '@/generated/prisma'
import { uploadImageFromBase64, deleteImage } from '@/lib/cloudinary'
import { validateServerImagesForContentType } from '@/utils/serverImageValidation'

const prisma = new PrismaClient()

export interface Sponsor {
  id: string
  name: string
  imageUrl: string
  linkUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateSponsorData {
  name: string
  imageUrl: string
  linkUrl?: string
}

export interface UpdateSponsorData {
  name?: string
  imageUrl?: string
  linkUrl?: string
}

export const getAllSponsors = async (): Promise<Sponsor[]> => {
  return prisma.sponsor.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export const getSponsorById = async (id: string): Promise<Sponsor | null> => {
  return prisma.sponsor.findUnique({
    where: { id }
  })
}

export const createSponsor = async (data: CreateSponsorData): Promise<Sponsor> => {
  // Validate image if it's a base64 string
  if (data.imageUrl.startsWith('data:image')) {
    const validation = validateServerImagesForContentType('team', data.imageUrl, true)
    if (!validation.isValid) {
      throw new Error(validation.errorMessage || 'Invalid image')
    }
    
    // Upload image to Cloudinary
    const cloudinaryUrl = await uploadImageFromBase64(data.imageUrl, 'sponsors')
    data.imageUrl = cloudinaryUrl
  }

  return prisma.sponsor.create({
    data
  })
}

export const updateSponsor = async (id: string, data: UpdateSponsorData): Promise<Sponsor> => {
  const existingSponsor = await prisma.sponsor.findUnique({
    where: { id }
  })

  if (!existingSponsor) {
    throw new Error('Sponsor not found')
  }

  // Handle image update
  if (data.imageUrl) {
    if (data.imageUrl.startsWith('data:image')) {
      // Validate new image
      const validation = validateServerImagesForContentType('team', data.imageUrl, true)
      if (!validation.isValid) {
        throw new Error(validation.errorMessage || 'Invalid image')
      }
      
      // Upload new image to Cloudinary
      const cloudinaryUrl = await uploadImageFromBase64(data.imageUrl, 'sponsors')
      data.imageUrl = cloudinaryUrl
      
      // Delete old image from Cloudinary
      if (existingSponsor.imageUrl.includes('cloudinary.com')) {
        await deleteImage(existingSponsor.imageUrl)
      }
    } else {
      // Keep existing image URL
      data.imageUrl = existingSponsor.imageUrl
    }
  } else {
    // Keep existing image URL if no new image provided
    data.imageUrl = existingSponsor.imageUrl
  }

  return prisma.sponsor.update({
    where: { id },
    data
  })
}

export const deleteSponsor = async (id: string): Promise<void> => {
  const sponsor = await prisma.sponsor.findUnique({
    where: { id }
  })

  if (!sponsor) {
    throw new Error('Sponsor not found')
  }

  // Delete image from Cloudinary
  if (sponsor.imageUrl.includes('cloudinary.com')) {
    await deleteImage(sponsor.imageUrl)
  }

  await prisma.sponsor.delete({
    where: { id }
  })
}

export const getSponsorStats = async () => {
  const totalSponsors = await prisma.sponsor.count()
  
  return {
    totalSponsors
  }
}
