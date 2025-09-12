import { NextRequest, NextResponse } from 'next/server'
import { getTeamById, updateTeam, deleteTeam } from '@/lib/teamService'
import { uploadImageFromBase64, deleteImage, extractPublicId } from '@/lib/cloudinary'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

// GET /api/team/[id] - Get a single team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const team = await getTeamById(id)
    
    if (!team) {
      return NextResponse.json(
        { error: 'Miembro del equipo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { error: 'Error al obtener miembro del equipo' },
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
    const user = await getAuthenticatedUser(request)
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }
    
    const { id } = await params
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
        { error: 'Campos requeridos faltantes: name, role, role_en, imageUrl' },
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
          { error: 'Error al subir imagen' },
          { status: 500 }
        )
      }
    }

    // Get existing team member for audit log
    const existingTeam = await getTeamById(id)
    if (!existingTeam) {
      return NextResponse.json(
        { error: 'Miembro del equipo no encontrado' },
        { status: 404 }
      )
    }

    // Update team member
    const team = await updateTeam(id, {
      id,
      name,
      role,
      role_en,
      instagram_url: instagram_url || null,
      facebook_url: facebook_url || null,
      x_url: x_url || null,
      imageUrl: finalImageUrl,
    })

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.TEAM,
      action: auditActions.UPDATE,
      changes: {
        name: team.name,
        role: team.role,
        teamId: team.id,
        previousData: {
          name: existingTeam.name,
          role: existingTeam.role
        }
      }
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Error al actualizar miembro del equipo' },
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
    const user = await getAuthenticatedUser(request)
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }
    
    const { id } = await params

    // Get team member to access image URL for deletion
    const team = await getTeamById(id)
    if (!team) {
      return NextResponse.json(
        { error: 'Miembro del equipo no encontrado' },
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
    await deleteTeam(id)

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.TEAM,
      action: auditActions.DELETE,
      changes: {
        name: team.name,
        role: team.role,
        teamId: team.id
      }
    })

    return NextResponse.json({ message: 'Miembro del equipo eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Error al eliminar miembro del equipo' },
      { status: 500 }
    )
  }
}
