import { NextRequest, NextResponse } from 'next/server'
import { getAllSponsors, createSponsor, getSponsorStats } from '@/lib/sponsorService'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action')

    if (action === 'stats') {
      const stats = await getSponsorStats()
      return NextResponse.json(stats)
    }

    const sponsors = await getAllSponsors()
    return NextResponse.json(sponsors)
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, imageUrl, linkUrl } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const sponsor = await createSponsor({
      name: name.trim(),
      imageUrl,
      linkUrl
    })

    return NextResponse.json(sponsor, { status: 201 })
  } catch (error) {
    console.error('Error creating sponsor:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create sponsor' },
      { status: 500 }
    )
  }
}
