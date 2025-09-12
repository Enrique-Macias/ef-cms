import { NextRequest, NextResponse } from 'next/server'
import { getEventsStats } from '@/lib/eventService'

export async function GET(request: NextRequest) {
  try {
    const stats = await getEventsStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching events stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de eventos' },
      { status: 500 }
    )
  }
}
