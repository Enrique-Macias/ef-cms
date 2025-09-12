import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageFromBase64 } from '@/lib/cloudinary'
import { validateServerImagesForContentType } from '@/utils/serverImageValidation'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Error al obtener testimonios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }
    
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['author', 'role', 'role_en', 'body_es', 'body_en', 'imageUrl']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    // Handle image upload to Cloudinary
    let imageUrl = body.imageUrl
    if (body.imageUrl && body.imageUrl.startsWith('data:image')) {
      // Validate image before upload
      const imageValidation = validateServerImagesForContentType('testimonials', body.imageUrl, true)
      if (!imageValidation.isValid) {
        return NextResponse.json(
          { error: imageValidation.errorMessage },
          { status: 400 }
        )
      }

      try {
        imageUrl = await uploadImageFromBase64(body.imageUrl, 'ef-cms/testimonials')
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        return NextResponse.json(
          { error: 'Error al subir imagen' },
          { status: 500 }
        )
      }
    }

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        author: body.author,
        role: body.role,
        role_en: body.role_en,
        body_es: body.body_es,
        body_en: body.body_en,
        imageUrl: imageUrl
      }
    })

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.TESTIMONIALS,
      action: auditActions.CREATE,
      changes: {
        author: testimonial.author,
        role: testimonial.role,
        testimonialId: testimonial.id
      }
    })

    return NextResponse.json({ testimonial }, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Error al crear testimonio' },
      { status: 500 }
    )
  }
}
