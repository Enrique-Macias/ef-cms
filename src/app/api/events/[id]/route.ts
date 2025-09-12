import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageFromBase64, extractPublicId, deleteImage } from '@/lib/cloudinary'
import { updateEvent, deleteEvent } from '@/lib/eventService'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        eventImages: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
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
      { error: 'Error al obtener evento' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }
    
    const { id } = await params
    const body = await request.json()

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      include: { eventImages: true }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Handle cover image update
    let coverImageUrl = existingEvent.coverImageUrl // Start with existing image
    
    if (body.coverImageUrl && body.coverImageUrl.startsWith('data:image')) {
      // Delete old cover image from Cloudinary if it exists
      if (existingEvent.coverImageUrl && existingEvent.coverImageUrl.includes('cloudinary')) {
        try {
          const publicId = extractPublicId(existingEvent.coverImageUrl)
          if (publicId) {
            await deleteImage(publicId)
          }
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
          { error: 'Error al subir imagen de portada' },
          { status: 500 }
        )
      }
    } else if (body.coverImageUrl && !body.coverImageUrl.startsWith('data:image')) {
      // If it's a URL (existing image), use it directly
      coverImageUrl = body.coverImageUrl
    }

    // Handle event images update
    const processedEventImages = []
    if (body.images !== undefined && Array.isArray(body.images)) {
      try {
        // Delete old event images from Cloudinary if they exist
        if (existingEvent.eventImages && existingEvent.eventImages.length > 0) {
          for (const oldImage of existingEvent.eventImages) {
            if (oldImage.imageUrl && oldImage.imageUrl.includes('cloudinary.com')) {
              const oldPublicId = extractPublicId(oldImage.imageUrl)
              if (oldPublicId) {
                try {
                  await deleteImage(oldPublicId)
                } catch (error) {
                  console.error('Error deleting old event image:', error)
                }
              }
            }
          }
        }

        for (const imageData of body.images) {
          let imageUrl = imageData
          
          // If it's a base64 data URL, upload to Cloudinary
          if (imageData && imageData.startsWith('data:image/')) {
            imageUrl = await uploadImageFromBase64(imageData, 'ef-cms/events/images')
          }
          
          processedEventImages.push({
            imageUrl
          })
        }
      } catch (error) {
        console.error('Error uploading event images:', error)
        return NextResponse.json(
          { error: 'Error al subir imágenes del evento' },
          { status: 500 }
        )
      }
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {}
    
    if (body.title_es !== undefined) updateData.title_es = body.title_es
    if (body.title_en !== undefined) updateData.title_en = body.title_en
    if (body.body_es !== undefined) updateData.body_es = body.body_es
    if (body.body_en !== undefined) updateData.body_en = body.body_en
    if (body.date !== undefined) updateData.date = new Date(body.date)
    if (body.author !== undefined) updateData.author = body.author
    if (body.location_city !== undefined) updateData.location_city = body.location_city
    if (body.location_country !== undefined) updateData.location_country = body.location_country
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl
    if (body.phrase !== undefined) updateData.phrase = body.phrase
    if (body.phrase_en !== undefined) updateData.phrase_en = body.phrase_en
    if (body.credits !== undefined) updateData.credits = body.credits
    if (body.credits_en !== undefined) updateData.credits_en = body.credits_en
    if (body.category !== undefined) updateData.category = body.category
    if (body.category_en !== undefined) updateData.category_en = body.category_en
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.tags_en !== undefined) updateData.tags_en = body.tags_en

    // Handle event images (same as news - only update if images field is present in request)
    if (body.images !== undefined) {
      updateData.eventImages = processedEventImages
    }

    // Update event using the service (same as news)
    const updatedEvent = await updateEvent(id, { ...updateData, id })

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.EVENTS,
      action: auditActions.UPDATE,
      changes: {
        title_es: updatedEvent.title_es,
        title_en: updatedEvent.title_en,
        author: updatedEvent.author,
        location_city: updatedEvent.location_city,
        location_country: updatedEvent.location_country,
        eventId: updatedEvent.id,
        previousData: {
          title_es: existingEvent.title_es,
          title_en: existingEvent.title_en,
          author: existingEvent.author,
          location_city: existingEvent.location_city,
          location_country: existingEvent.location_country
        }
      }
    })

    return NextResponse.json({
      success: true,
      event: updatedEvent,
      message: 'Evento actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Error al actualizar evento' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }
    
    const { id } = await params

    // Get event with images to delete from Cloudinary
    const event = await prisma.event.findUnique({
      where: { id },
      include: { eventImages: true }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    // Delete cover image from Cloudinary if it exists
    if (event.coverImageUrl && event.coverImageUrl.includes('cloudinary')) {
      try {
        const publicId = extractPublicId(event.coverImageUrl)
        if (publicId) {
          await deleteImage(publicId)
        }
      } catch (error) {
        console.error('Error deleting cover image:', error)
      }
    }

    // Delete all event images from Cloudinary
    for (const image of event.eventImages) {
      if (image.imageUrl.includes('cloudinary')) {
        try {
          const publicId = extractPublicId(image.imageUrl)
          if (publicId) {
            await deleteImage(publicId)
          }
        } catch (error) {
          console.error('Error deleting event image:', error)
        }
      }
    }

    // Delete event from database (this will also delete related event images)
    await deleteEvent(id)

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.EVENTS,
      action: auditActions.DELETE,
      changes: {
        title_es: event.title_es,
        title_en: event.title_en,
        author: event.author,
        location_city: event.location_city,
        location_country: event.location_country,
        eventId: event.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Error al eliminar evento' },
      { status: 500 }
    )
  }
}
