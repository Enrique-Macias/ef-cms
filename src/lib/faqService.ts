import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export interface FAQ {
  id: string
  question_es: string
  question_en: string
  answer_es: string
  answer_en: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateFAQData {
  question_es: string
  question_en: string
  answer_es: string
  answer_en: string
  order?: number
}

export interface UpdateFAQData {
  question_es?: string
  question_en?: string
  answer_es?: string
  answer_en?: string
  order?: number
}

export const createFAQ = async (data: CreateFAQData): Promise<FAQ> => {
  return await prisma.fAQ.create({
    data: {
      question_es: data.question_es,
      question_en: data.question_en,
      answer_es: data.answer_es,
      answer_en: data.answer_en,
      order: data.order || 0
    }
  })
}

export const getFAQs = async (): Promise<FAQ[]> => {
  return await prisma.fAQ.findMany({
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  })
}

export const getFAQById = async (id: string): Promise<FAQ | null> => {
  return await prisma.fAQ.findUnique({
    where: { id }
  })
}

export const updateFAQ = async (id: string, data: UpdateFAQData): Promise<FAQ> => {
  return await prisma.fAQ.update({
    where: { id },
    data
  })
}

export const deleteFAQ = async (id: string): Promise<void> => {
  await prisma.fAQ.delete({
    where: { id }
  })
}

export const checkOrderExists = async (order: number, excludeId?: string): Promise<boolean> => {
  const existingFAQ = await prisma.fAQ.findFirst({
    where: {
      order,
      ...(excludeId && { id: { not: excludeId } })
    }
  })
  return !!existingFAQ
}
