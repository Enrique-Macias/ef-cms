import { NextRequest, NextResponse } from 'next/server'
import { getSponsorById, updateSponsor, deleteSponsor } from '@/lib/sponsorService'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sponsor = await getSponsorById(id)
    
    if (!sponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(sponsor)
  } catch (error) {
    console.error('Error fetching sponsor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sponsor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, imageUrl, linkUrl } = body

    const sponsor = await updateSponsor(id, {
      name: name?.trim(),
      imageUrl,
      linkUrl
    })

    return NextResponse.json(sponsor)
  } catch (error) {
    console.error('Error updating sponsor:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update sponsor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    await deleteSponsor(id)

    return NextResponse.json({ message: 'Sponsor deleted successfully' })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete sponsor' },
      { status: 500 }
    )
  }
}
