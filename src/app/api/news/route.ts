import { NextRequest, NextResponse } from 'next/server'
import { getNewsList, createNews, getNewsStats } from '@/lib/newsService'
import { uploadImageFromBase64, extractPublicId } from '@/lib/cloudinary'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const category = searchParams.get('category') || undefined
    const dateFilter = searchParams.get('dateFilter') as 'hoy' | 'ultima-semana' | 'ultimo-mes' | null || null

    const result = await getNewsList({
      page,
      limit,
      search,
      category,
      dateFilter
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title_es', 'title_en', 'body_es', 'body_en', 'date', 'author', 'category']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    let coverImageUrl = body.coverImageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a6c2c8?w=400&h=250&fit=crop&crop=center'
    
    // Handle cover image upload to Cloudinary if it's a base64 data URL
    if (body.coverImageUrl && body.coverImageUrl.startsWith('data:image/')) {
      try {
        coverImageUrl = await uploadImageFromBase64(body.coverImageUrl, 'ef-cms/covers')
      } catch (error) {
        console.error('Error uploading cover image:', error)
        return NextResponse.json(
          { error: 'Failed to upload cover image' },
          { status: 500 }
        )
      }
    }

    // Handle news images upload to Cloudinary
    let processedNewsImages = []
    if (body.newsImages && body.newsImages.length > 0) {
      try {
        for (const imageData of body.newsImages) {
          let imageUrl = imageData.imageUrl
          
          // If it's a base64 data URL, upload to Cloudinary
          if (imageData.imageUrl && imageData.imageUrl.startsWith('data:image/')) {
            imageUrl = await uploadImageFromBase64(imageData.imageUrl, 'ef-cms/news-images')
          }
          
          processedNewsImages.push({
            imageUrl,
            order: imageData.order || 0
          })
        }
      } catch (error) {
        console.error('Error uploading news images:', error)
        return NextResponse.json(
          { error: 'Failed to upload news images' },
          { status: 500 }
        )
      }
    }

    // Create news data
    const newsData = {
      title_es: body.title_es,
      title_en: body.title_en,
      body_es: body.body_es,
      body_en: body.body_en,
      date: new Date(body.date),
      tags: body.tags || [],
      category: body.category,
      author: body.author,
      location_city: body.location_city || '',
      location_country: body.location_country || '',
      coverImageUrl,
      category_en: body.category_en,
      tags_en: body.tags_en || [],
      newsImages: processedNewsImages
    }

    const news = await createNews(newsData)

    return NextResponse.json({
      message: 'News created successfully',
      news
    })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    )
  }
}
