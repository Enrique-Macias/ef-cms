import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, deleteUser, generateAvatarUrl } from '@/lib/userService'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/utils/authUtils'
import { userUpdateSchema } from '@/lib/validations'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticatedUser = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }

    // Check if user is admin
    if (authenticatedUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo los administradores pueden ver usuarios' }, { status: 403 });
    }

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
    const authenticatedUser = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }

    // Check if user is admin OR updating their own profile
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      )
    }

    // Allow users to update their own profile, or admins to update any user
    if (authenticatedUser.role !== 'ADMIN' && authenticatedUser.userId !== id) {
      return NextResponse.json({ error: 'Solo puedes actualizar tu propio perfil' }, { status: 403 });
    }

    const body = await request.json()
    
    // Validate request body with Zod
    const validationResult = userUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => err.message).join(', ')
      return NextResponse.json(
        { error: `Error de validación: ${errors}` },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Check if user exists
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Non-admin users can only update their own name and avatar
    if (authenticatedUser.role !== 'ADMIN') {
      if (validatedData.email !== undefined && validatedData.email !== existingUser.email) {
        return NextResponse.json({ error: 'Solo los administradores pueden cambiar el email' }, { status: 403 });
      }
      if (validatedData.role !== undefined && validatedData.role !== existingUser.role) {
        return NextResponse.json({ error: 'Solo los administradores pueden cambiar el rol' }, { status: 403 });
      }
    }

    // Check if trying to change the last admin's role
    if (existingUser.role === 'ADMIN' && validatedData.role === 'EDITOR') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      })
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'No se puede cambiar el rol del último administrador del sistema' },
          { status: 400 }
        )
      }
    }

    // Additional protection: prevent changing role to anything other than ADMIN if this is the last admin
    if (existingUser.role === 'ADMIN' && validatedData.role && validatedData.role !== 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      })
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'No se puede cambiar el rol del último administrador del sistema' },
          { status: 400 }
        )
      }
    }

    // Generate avatar URL if name is updated and no avatar URL is provided
    let finalAvatarUrl = validatedData.avatarUrl
    if (validatedData.fullName && validatedData.fullName !== existingUser.fullName && !validatedData.avatarUrl) {
      finalAvatarUrl = generateAvatarUrl(validatedData.fullName)
    }

    // Update user
    const user = await updateUser(id, {
      email: validatedData.email,
      role: validatedData.role,
      fullName: validatedData.fullName,
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
    const authenticatedUser = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!authenticatedUser) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }

    // Check if user is admin
    if (authenticatedUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo los administradores pueden eliminar usuarios' }, { status: 403 });
    }

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

    // Check if this is the last admin
    if (existingUser.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      })
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'No se puede eliminar el último administrador del sistema' },
          { status: 400 }
        )
      }
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
