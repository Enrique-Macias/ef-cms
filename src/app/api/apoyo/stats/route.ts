import { NextRequest, NextResponse } from 'next/server'
import { getApoyoStats } from '@/lib/apoyoService'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }

    const stats = await getApoyoStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching apoyo stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de apoyo' },
      { status: 500 }
    )
  }
}

