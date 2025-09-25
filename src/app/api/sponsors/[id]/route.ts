import { NextRequest, NextResponse } from 'next/server'
import { getSponsorById, updateSponsor, deleteSponsor } from '@/lib/sponsorService'
import { getAuthenticatedUser } from '@/utils/authUtils'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'

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

    // Get current sponsor data for audit log
    const currentSponsor = await getSponsorById(id)
    if (!currentSponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      )
    }

    const sponsor = await updateSponsor(id, {
      name: name?.trim(),
      imageUrl,
      linkUrl
    })

    // Create audit log
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.SPONSORS,
      action: auditActions.UPDATE,
      changes: {
        previous: { name: currentSponsor.name },
        current: { name: sponsor.name },
        sponsorId: sponsor.id
      }
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
    
    // Get sponsor data for audit log before deletion
    const sponsor = await getSponsorById(id)
    if (!sponsor) {
      return NextResponse.json(
        { error: 'Sponsor not found' },
        { status: 404 }
      )
    }

    await deleteSponsor(id)

    // Create audit log
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.SPONSORS,
      action: auditActions.DELETE,
      changes: {
        name: sponsor.name,
        sponsorId: sponsor.id
      }
    })

    return NextResponse.json({ message: 'Sponsor deleted successfully' })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete sponsor' },
      { status: 500 }
    )
  }
}
