import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, deleteUser, generateAvatarUrl } from '@/lib/userService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    const user = await getUserById(id)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { email, role, fullName, avatarUrl } = body

    // Check if user exists
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Generate avatar URL if name is updated and no avatar URL is provided
    let finalAvatarUrl = avatarUrl
    if (fullName && fullName !== existingUser.fullName && !avatarUrl) {
      finalAvatarUrl = generateAvatarUrl(fullName)
    }

    // Update user
    const user = await updateUser(id, {
      email,
      role,
      fullName,
      avatarUrl: finalAvatarUrl
    })

    return NextResponse.json(user)
  } catch (error: unknown) {
    console.error('Error updating user:', error)
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya existe' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Delete user
    const user = await deleteUser(id)

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Error al eliminar usuario' },
      { status: 500 }
    )
  }
}
