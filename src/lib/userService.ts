import { prisma } from './prisma'
import { Role } from '../generated/prisma'

// Helper function to generate avatar URL
export function generateAvatarUrl(fullName: string): string {
  return `https://avatar.iran.liara.run/username?username=${encodeURIComponent(fullName)}`
}

export interface CreateUserData {
  email: string
  passwordHash: string
  role: Role
  fullName: string
  avatarUrl?: string
}

export interface UpdateUserData {
  email?: string
  role?: Role
  fullName?: string
  avatarUrl?: string
}

export interface User {
  id: number
  email: string
  role: Role
  fullName: string
  avatarUrl: string | null
  createdAt: Date
}

// Get all users with pagination and filtering
export async function getUsers(params: {
  page?: number
  limit?: number
  search?: string
  role?: 'ADMIN' | 'EDITOR' | null
}) {
  const { page = 1, limit = 10, search, role } = params
  const skip = (page - 1) * limit

  // Build where clause
  const where: {
    OR?: Array<{
      fullName?: { contains: string; mode: 'insensitive' }
      email?: { contains: string; mode: 'insensitive' }
    }>
    role?: Role
  } = {}
  
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ]
  }
  
  if (role) {
    where.role = role as Role
  }

  // Get users and total count
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        avatarUrl: true,
        createdAt: true
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ])

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  }
}

// Get user by ID
export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      fullName: true,
      avatarUrl: true,
      createdAt: true
    }
  })
}

// Get user by email
export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      role: true,
      fullName: true,
      avatarUrl: true,
      createdAt: true
    }
  })
}

// Create new user
export async function createUser(data: CreateUserData) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      role: true,
      fullName: true,
      avatarUrl: true,
      createdAt: true
    }
  })
}

// Update user
export async function updateUser(id: number, data: UpdateUserData) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      role: true,
      fullName: true,
      avatarUrl: true,
      createdAt: true
    }
  })
}

// Delete user
export async function deleteUser(id: number) {
  // First delete related used tokens
  await prisma.usedToken.deleteMany({
    where: { userId: id }
  })
  
  // Then delete the user
  return prisma.user.delete({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      fullName: true,
      avatarUrl: true,
      createdAt: true
    }
  })
}

// Get user statistics
export async function getUserStats() {
  const [totalUsers, adminCount, editorCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'EDITOR' } })
  ])

  return {
    total: totalUsers,
    admins: adminCount,
    editors: editorCount
  }
}

// Check if email exists
export async function emailExists(email: string, excludeId?: number) {
  const where: {
    email: string
    NOT?: { id: number }
  } = { email }
  if (excludeId) {
    where.NOT = { id: excludeId }
  }
  
  const user = await prisma.user.findFirst({ where })
  return !!user
}
