import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageFromBase64, extractPublicId, deleteImage } from '@/lib/cloudinary'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        eventImages: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      event
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)
    const body = await request.json()
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { eventImages: true }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Handle cover image update
    let coverImageUrl = body.coverImageUrl
    if (body.coverImageUrl && body.coverImageUrl.startsWith('data:image')) {
      // Delete old cover image from Cloudinary if it exists
      if (existingEvent.coverImageUrl && existingEvent.coverImageUrl.includes('cloudinary')) {
        try {
          const publicId = extractPublicId(existingEvent.coverImageUrl)
          await deleteImage(publicId)
        } catch (error) {
          console.error('Error deleting old cover image:', error)
        }
      }
      
      // Upload new cover image
      try {
        coverImageUrl = await uploadImageFromBase64(body.coverImageUrl, 'ef-cms/events/covers')
      } catch (error) {
        console.error('Error uploading cover image:', error)
        return NextResponse.json(
          { error: 'Failed to upload cover image' },
          { status: 500 }
        )
      }
    }

    // Handle event images update
    let eventImages = []
    if (body.images && Array.isArray(body.images)) {
      // Delete all existing event images from Cloudinary
      for (const existingImage of existingEvent.eventImages) {
        if (existingImage.imageUrl.includes('cloudinary')) {
          try {
            const publicId = extractPublicId(existingImage.imageUrl)
            await deleteImage(publicId)
          } catch (error) {
            console.error('Error deleting old event image:', error)
          }
        }
      }

      // Upload new event images
      for (const image of body.images) {
        if (image.startsWith('data:image')) {
          try {
            const imageUrl = await uploadImageFromBase64(image, 'ef-cms/events/images')
            eventImages.push({ imageUrl })
          } catch (error) {
            console.error('Error uploading event image:', error)
            return NextResponse.json(
              { error: 'Failed to upload event image' },
              { status: 500 }
            )
          }
        } else {
          eventImages.push({ imageUrl: image })
        }
      }
    }

    // Prepare update data
    const updateData = {
      title_es: body.title_es,
      title_en: body.title_en,
      body_es: body.body_es,
      body_en: body.body_en,
      date: body.date,
      author: body.author,
      location_city: body.location_city,
      location_country: body.location_country,
      coverImageUrl,
      phrase: body.phrase,
      phrase_en: body.phrase_en,
      credits: body.credits,
      credits_en: body.credits_en,
      category: body.category || '',
      category_en: body.category_en || '',
      tags: body.tags || [],
      tags_en: body.tags_en || []
    }

    // Update event and replace all images
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...updateData,
        eventImages: {
          deleteMany: {},
          create: eventImages
        }
      },
      include: {
        eventImages: true
      }
    })

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      message: 'Event updated successfully'
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      )
    }

    // Get event with images to delete from Cloudinary
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { eventImages: true }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Delete cover image from Cloudinary if it exists
    if (event.coverImageUrl && event.coverImageUrl.includes('cloudinary')) {
      try {
        const publicId = extractPublicId(event.coverImageUrl)
        await deleteImage(publicId)
      } catch (error) {
        console.error('Error deleting cover image:', error)
      }
    }

    // Delete all event images from Cloudinary
    for (const image of event.eventImages) {
      if (image.imageUrl.includes('cloudinary')) {
        try {
          const publicId = extractPublicId(image.imageUrl)
          await deleteImage(publicId)
        } catch (error) {
          console.error('Error deleting event image:', error)
        }
      }
    }

    // Delete event from database
    await prisma.event.delete({
      where: { id: eventId }
    })

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
