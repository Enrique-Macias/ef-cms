import { NextRequest, NextResponse } from 'next/server'
import { createTeam, getAllTeams, getTeamStats } from '@/lib/teamService'
import { uploadImageFromBase64, deleteImage } from '@/lib/cloudinary'

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
      { error: 'Failed to fetch teams' },
      { status: 500 }
    )
  }
}

// POST /api/team - Create a new team member
export async function POST(request: NextRequest) {
  try {
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
        { error: 'Missing required fields: name, role, role_en, imageUrl' },
        { status: 400 }
      )
    }

    // Upload image to Cloudinary if it's a base64 string
    let finalImageUrl = imageUrl
    if (imageUrl.startsWith('data:image/')) {
      try {
        finalImageUrl = await uploadImageFromBase64(imageUrl, 'team')
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
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

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
