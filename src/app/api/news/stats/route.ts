import { NextRequest, NextResponse } from 'next/server'
import { getNewsStats } from '@/lib/newsService'

export async function GET(request: NextRequest) {
  try {
    const stats = await getNewsStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching news stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de noticias' },
      { status: 500 }
    )
  }
}
