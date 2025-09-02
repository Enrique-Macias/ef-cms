import { NextRequest, NextResponse } from 'next/server'
import { getUsers, createUser, getUserStats, generateAvatarUrl } from '@/lib/userService'
import { hash } from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
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
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role, fullName, avatarUrl } = body

    // Validate required fields
    if (!email || !password || !role || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Generate default avatar URL if not provided
    const defaultAvatarUrl = avatarUrl || generateAvatarUrl(fullName)

    // Create user
    const user = await createUser({
      email,
      passwordHash,
      role,
      fullName,
      avatarUrl: defaultAvatarUrl
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
