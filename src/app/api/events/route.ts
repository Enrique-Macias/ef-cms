import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadImageFromBase64 } from '@/lib/cloudinary'
import { validateServerImagesForContentType } from '@/utils/serverImageValidation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Required fields validation
    const requiredFields = [
      'title_es', 'title_en', 'body_es', 'body_en', 'date', 
      'author', 'location_city', 'location_country', 'phrase', 
      'phrase_en', 'credits', 'credits_en'
    ]
    
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Handle cover image upload to Cloudinary
    let coverImageUrl = body.coverImageUrl
    if (body.coverImageUrl && body.coverImageUrl.startsWith('data:image')) {
      // Validate cover image before upload
      const coverValidation = validateServerImagesForContentType('events', body.coverImageUrl, true)
      if (!coverValidation.isValid) {
        return NextResponse.json(
          { error: coverValidation.errorMessage },
          { status: 400 }
        )
      }

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

    // Handle event images upload to Cloudinary
    const eventImages = []
    if (body.images && Array.isArray(body.images)) {
      // Validate all event images before upload
      const base64Images = body.images.filter((img: string) => img.startsWith('data:image/'))
      if (base64Images.length > 0) {
        const imagesValidation = validateServerImagesForContentType('events', base64Images, false)
        if (!imagesValidation.isValid) {
          return NextResponse.json(
            { error: imagesValidation.errorMessage },
            { status: 400 }
          )
        }
      }

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

    // Prepare event data
    const eventData = {
      title_es: body.title_es,
      title_en: body.title_en,
      body_es: body.body_es,
      body_en: body.body_en,
      date: new Date(body.date),
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
      tags_en: body.tags_en || [],
      eventImages: {
        create: eventImages
      }
    }

    // Create event in database
    const event = await prisma.event.create({
      data: eventData,
      include: {
        eventImages: true
      }
    })

    return NextResponse.json({
      success: true,
      event,
      message: 'Event created successfully'
    })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const dateFilter = searchParams.get('dateFilter') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (search) {
      where.OR = [
        { title_es: { contains: search, mode: 'insensitive' } },
        { title_en: { contains: search, mode: 'insensitive' } },
        { body_es: { contains: search, mode: 'insensitive' } },
        { body_en: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { location_city: { contains: search, mode: 'insensitive' } },
        { location_country: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (dateFilter) {
      const today = new Date()
      let startDate: Date

      switch (dateFilter) {
        case 'hoy':
          startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
          where.date = {
            gte: startDate,
            lt: new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
          }
          break
        case 'ultima-semana':
          startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          where.date = { gte: startDate }
          break
        case 'ultimo-mes':
          startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          where.date = { gte: startDate }
          break
      }
    }

    // Get events with pagination
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          eventImages: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.event.count({ where })
    ])

    return NextResponse.json({
      success: true,
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
