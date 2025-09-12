import { NextRequest, NextResponse } from 'next/server'
import { getTeamById, updateTeam, deleteTeam } from '@/lib/teamService'
import { uploadImageFromBase64, deleteImage, extractPublicId } from '@/lib/cloudinary'

// GET /api/team/[id] - Get a single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teamId = parseInt(id)

    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: 'Invalid team ID' },
        { status: 400 }
      )
    }

    const team = await getTeamById(teamId)
    
    if (!team) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

// PUT /api/team/[id] - Update a team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teamId = parseInt(id)

    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: 'Invalid team ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const {
      name,
      role,
      role_en,
      instagram_url,
      facebook_url,
      x_url,
      imageUrl,
      originalImageUrl
    } = body

    // Validate required fields
    if (!name || !role || !role_en || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: name, role, role_en, imageUrl' },
        { status: 400 }
      )
    }

    let finalImageUrl = imageUrl

    // Handle image upload/update
    if (imageUrl.startsWith('data:image/')) {
      try {
        // Upload new image
        finalImageUrl = await uploadImageFromBase64(imageUrl, 'team')
        
        // Delete old image if it exists and is different
        if (originalImageUrl && originalImageUrl !== finalImageUrl) {
          const publicId = extractPublicId(originalImageUrl)
          if (publicId) {
            await deleteImage(publicId)
          }
        }
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        )
      }
    }

    // Update team member
    const team = await updateTeam(teamId, {
      id: teamId,
      name,
      role,
      role_en,
      instagram_url: instagram_url || null,
      facebook_url: facebook_url || null,
      x_url: x_url || null,
      imageUrl: finalImageUrl,
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE /api/team/[id] - Delete a team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teamId = parseInt(id)

    if (isNaN(teamId)) {
      return NextResponse.json(
        { error: 'Invalid team ID' },
        { status: 400 }
      )
    }

    // Get team member to access image URL for deletion
    const team = await getTeamById(teamId)
    if (!team) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary if it exists
    if (team.imageUrl) {
      try {
        const publicId = extractPublicId(team.imageUrl)
        if (publicId) {
          await deleteImage(publicId)
        }
      } catch (deleteError) {
        console.error('Error deleting image from Cloudinary:', deleteError)
        // Continue with team deletion even if image deletion fails
      }
    }

    // Delete team member from database
    await deleteTeam(teamId)

    return NextResponse.json({ message: 'Team member deleted successfully' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
