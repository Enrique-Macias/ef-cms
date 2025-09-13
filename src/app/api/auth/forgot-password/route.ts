import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'El correo electrónico es requerido' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({ 
        message: 'Si el correo electrónico existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Store reset token in database
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: expiresAt
      }
    })

    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/configure-password?token=${resetToken}`

    // Send email
    const emailSent = await sendEmail(
      user.email,
      'passwordReset',
      resetLink,
      user.fullName
    )

    if (!emailSent) {
      return NextResponse.json({ error: 'Error al enviar el correo electrónico' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Si el correo electrónico existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.' 
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
