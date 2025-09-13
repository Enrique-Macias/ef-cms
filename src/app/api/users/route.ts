import { NextRequest, NextResponse } from 'next/server'
import { getUsers, createUser, getUserStats, generateAvatarUrl } from '@/lib/userService'
import { hash } from 'bcryptjs'
import { getAuthenticatedUser } from '@/utils/authUtils'
import { userCreateSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo los administradores pueden ver la lista de usuarios' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const roleParam = searchParams.get('role') || undefined

    // Convert role string to enum value
    let role: 'ADMIN' | 'EDITOR' | null = null
    if (roleParam === 'Admin') {
      role = 'ADMIN'
    } else if (roleParam === 'Editor') {
      role = 'EDITOR'
    }

    const result = await getUsers({
      page,
      limit,
      search,
      role
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo los administradores pueden crear usuarios' }, { status: 403 });
    }

    const body = await request.json()
    
    // Validate request body with Zod
    const validationResult = userCreateSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(err => err.message).join(', ')
      return NextResponse.json(
        { error: `Error de validación: ${errors}` },
        { status: 400 }
      )
    }

    const { email, password, role, fullName } = validationResult.data

    // Hash password
    const passwordHash = await hash(password, 12)

    // Generate default avatar URL
    const defaultAvatarUrl = generateAvatarUrl(fullName)

    // Create user
    const newUser = await createUser({
      email,
      passwordHash,
      role,
      fullName,
      avatarUrl: defaultAvatarUrl
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating user:', error)
    
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya existe' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear usuario' },
      { status: 500 }
    )
  }
}
