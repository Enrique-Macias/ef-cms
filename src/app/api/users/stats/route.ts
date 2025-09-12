import { NextRequest, NextResponse } from 'next/server'
import { getUserStats } from '@/lib/userService'

export async function GET(request: NextRequest) {
  try {
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
