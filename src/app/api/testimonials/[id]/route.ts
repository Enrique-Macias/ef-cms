import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageFromBase64, deleteImage, extractPublicId } from '@/lib/cloudinary'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const testimonial = await prisma.testimonial.findUnique({
      where: {
        id
      }
    })

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      author: body.author,
      role: body.role,
      role_en: body.role_en,
      body_es: body.body_es,
      body_en: body.body_en
    }

    // Handle image update
    if (body.imageUrl) {
      if (body.imageUrl.startsWith('data:image')) {
        // New image uploaded - upload to Cloudinary
        try {
          const newImageUrl = await uploadImageFromBase64(body.imageUrl, 'ef-cms/testimonials')
          updateData.imageUrl = newImageUrl

          // Delete old image from Cloudinary if it's a Cloudinary URL
          if (existingTestimonial.imageUrl.includes('cloudinary.com')) {
            try {
              const publicId = extractPublicId(existingTestimonial.imageUrl)
              if (publicId) {
                await deleteImage(publicId)
              }
            } catch (deleteError) {
              console.error('Error deleting old image:', deleteError)
              // Don't fail the update if image deletion fails
            }
          }
        } catch (error) {
          console.error('Error uploading new image:', error)
          return NextResponse.json(
            { error: 'Failed to upload new image' },
            { status: 500 }
          )
        }
      } else {
        // Existing image URL - keep it (even if it's the same)
        updateData.imageUrl = body.imageUrl
      }
    } else {
      // If no imageUrl is provided, keep the existing one
      updateData.imageUrl = existingTestimonial.imageUrl
    }

    // Update testimonial
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updatedTestimonial)
  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id }
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary if it's a Cloudinary URL
    if (existingTestimonial.imageUrl.includes('cloudinary.com')) {
      try {
        const publicId = extractPublicId(existingTestimonial.imageUrl)
        if (publicId) {
          await deleteImage(publicId)
        }
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error)
        // Don't fail the deletion if image deletion fails
      }
    }

    // Delete testimonial from database
    await prisma.testimonial.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    )
  }
}
