import { NextResponse } from 'next/server'
import { getFundadorStats } from '@/lib/fundadorService'

export async function GET() {
  try {
    const stats = await getFundadorStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching fundador stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener las estadísticas de fundadores' },
      { status: 500 }
    )
  }
}
