import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/lib/userService'
import { verifyAccessToken, extractTokenFromHeader } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization') || undefined)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token de acceso requerido' },
        { status: 401 }
      )
    }

    const payload = verifyAccessToken(token)
    
    // Get user data
    const user = await getUserById(payload.userId)
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      }
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Token inválido o expirado' },
      { status: 401 }
    )
  }
}
