import { prisma } from '@/lib/prisma'

export interface Testimonial {
  id: string
  author: string
  role: string
  role_en: string
  body_es: string
  body_en: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateTestimonialData {
  author: string
  role: string
  role_en: string
  body_es: string
  body_en: string
  imageUrl: string
}

export interface UpdateTestimonialData {
  author?: string
  role?: string
  role_en?: string
  body_es?: string
  body_en?: string
  imageUrl?: string
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return await prisma.testimonial.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  return await prisma.testimonial.findUnique({
    where: { id }
  })
}

export async function createTestimonial(data: CreateTestimonialData): Promise<Testimonial> {
  return await prisma.testimonial.create({
    data
  })
}

export async function updateTestimonial(id: string, data: UpdateTestimonialData): Promise<Testimonial> {
  return await prisma.testimonial.update({
    where: { id },
    data
  })
}

export async function deleteTestimonial(id: string): Promise<void> {
  await prisma.testimonial.delete({
    where: { id }
  })
}
