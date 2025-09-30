import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export interface Pagos {
  id: string
  paystripeCode: string | null
  paypalUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreatePagosData {
  paystripeCode?: string
  paypalUrl?: string
}

export interface UpdatePagosData {
  paystripeCode?: string
  paypalUrl?: string
}

export async function createPagos(data: CreatePagosData): Promise<Pagos> {
  return await prisma.pagos.create({
    data: {
      paystripeCode: data.paystripeCode || null,
      paypalUrl: data.paypalUrl || null,
    },
  })
}

export async function getPagos(): Promise<Pagos | null> {
  return await prisma.pagos.findFirst()
}

export async function updatePagos(id: string, data: UpdatePagosData): Promise<Pagos> {
  return await prisma.pagos.update({
    where: { id },
    data: {
      paystripeCode: data.paystripeCode,
      paypalUrl: data.paypalUrl,
    },
  })
}

export async function deletePagos(id: string): Promise<void> {
  await prisma.pagos.delete({
    where: { id },
  })
}
