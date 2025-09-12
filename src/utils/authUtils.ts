import { NextRequest } from 'next/server'
import { verifyAccessToken, extractTokenFromHeader } from '@/lib/auth'

export interface AuthenticatedUser {
  userId: number
  email: string
  role: string
}

export const getAuthenticatedUser = async (request: NextRequest): Promise<AuthenticatedUser | null> => {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization') || undefined)
    
    if (!token) {
      return null
    }

    const payload = verifyAccessToken(token)
    
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    }
  } catch (error) {
    console.error('Error extracting user from token:', error)
    return null
  }
}
