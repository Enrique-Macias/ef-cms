import { NextRequest, NextResponse } from 'next/server'
import { getTeamStats } from '@/lib/teamService'

// GET /api/team/stats - Get team statistics
export async function GET(request: NextRequest) {
  try {
    const stats = await getTeamStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching team stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team stats' },
      { status: 500 }
    )
  }
}
