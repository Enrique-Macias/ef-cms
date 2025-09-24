import { NextRequest, NextResponse } from 'next/server'
import { getSponsorStats } from '@/lib/sponsorService'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const stats = await getSponsorStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching sponsor stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsor stats' },
      { status: 500 }
    )
  }
}
