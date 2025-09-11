import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageFromBase64 } from '@/lib/cloudinary'

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
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['author', 'role', 'role_en', 'body_es', 'body_en', 'imageUrl']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Handle image upload to Cloudinary
    let imageUrl = body.imageUrl
    if (body.imageUrl && body.imageUrl.startsWith('data:image')) {
      try {
        imageUrl = await uploadImageFromBase64(body.imageUrl, 'ef-cms/testimonials')
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error)
        return NextResponse.json(
          { error: 'Failed to upload image' },
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

    return NextResponse.json({ testimonial }, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
