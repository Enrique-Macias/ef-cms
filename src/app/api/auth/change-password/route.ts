import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getAuthenticatedUser } from '@/utils/authUtils'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Contraseña actual y nueva contraseña son requeridas' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' }, { status: 400 })
    }

    // Get user with password hash
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { passwordHash: true }
    })

    if (!userWithPassword) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.passwordHash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update user password
    await prisma.user.update({
      where: { id: user.userId },
      data: { passwordHash: hashedNewPassword }
    })

    // Create audit log
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.USERS,
      action: auditActions.PASSWORD_CHANGE,
      changes: {
        userId: user.userId,
        userEmail: user.email
      }
    })

    return NextResponse.json({ 
      message: 'Contraseña cambiada exitosamente' 
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
