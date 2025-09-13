import { NextRequest, NextResponse } from 'next/server'
import { getUserStats } from '@/lib/userService'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo los administradores pueden ver estadísticas de usuarios' }, { status: 403 });
    }

    const stats = await getUserStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de usuarios' },
      { status: 500 }
    )
  }
}
