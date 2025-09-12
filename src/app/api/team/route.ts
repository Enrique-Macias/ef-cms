import { NextRequest, NextResponse } from 'next/server'
import { createTeam, getAllTeams, getTeamStats } from '@/lib/teamService'
import { uploadImageFromBase64, deleteImage } from '@/lib/cloudinary'
import { validateServerImagesForContentType } from '@/utils/serverImageValidation'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

// GET /api/team - Get all team members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'stats') {
      const stats = await getTeamStats()
      return NextResponse.json(stats)
    }

    const teams = await getAllTeams()
    return NextResponse.json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Error al obtener equipo' },
      { status: 500 }
    )
  }
}

// POST /api/team - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }
    
    const body = await request.json()
    const {
      name,
      role,
      role_en,
      instagram_url,
      facebook_url,
      x_url,
      imageUrl
    } = body

    // Validate required fields
    if (!name || !role || !role_en || !imageUrl) {
      return NextResponse.json(
        { error: 'Campos requeridos faltantes: name, role, role_en, imageUrl' },
        { status: 400 }
      )
    }

    // Upload image to Cloudinary if it's a base64 string
    let finalImageUrl = imageUrl
    if (imageUrl.startsWith('data:image/')) {
      // Validate image before upload
      const imageValidation = validateServerImagesForContentType('team', imageUrl, true)
      if (!imageValidation.isValid) {
        return NextResponse.json(
          { error: imageValidation.errorMessage },
          { status: 400 }
        )
      }

      try {
        finalImageUrl = await uploadImageFromBase64(imageUrl, 'team')
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        return NextResponse.json(
          { error: 'Error al subir imagen' },
          { status: 500 }
        )
      }
    }

    // Create team member
    const team = await createTeam({
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
      action: auditActions.CREATE,
      changes: {
        name: team.name,
        role: team.role,
        teamId: team.id
      }
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Error al crear miembro del equipo' },
      { status: 500 }
    )
  }
}
