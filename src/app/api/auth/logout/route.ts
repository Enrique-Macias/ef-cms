import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // For now, just return success
    // In a more complex implementation, you might want to invalidate tokens
    return NextResponse.json({
      message: 'Cierre de sesión exitoso'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
