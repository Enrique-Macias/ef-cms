import { NextRequest, NextResponse } from 'next/server'
import { getNewsList, createNews, getNewsStats } from '@/lib/newsService'
import { uploadImageFromBase64, extractPublicId } from '@/lib/cloudinary'
import { validateServerImagesForContentType } from '@/utils/serverImageValidation'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

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
      { error: 'Error al obtener noticias' },
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
    const requiredFields = ['title_es', 'title_en', 'body_es', 'body_en', 'date', 'author', 'category']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    let coverImageUrl = body.coverImageUrl || 'https://images.unsplash.com/photo-1495020689067-958852a6c2c8?w=400&h=250&fit=crop&crop=center'
    
    // Handle cover image upload to Cloudinary if it's a base64 data URL
    if (body.coverImageUrl && body.coverImageUrl.startsWith('data:image/')) {
      // Validate cover image before upload
      const coverValidation = validateServerImagesForContentType('news', body.coverImageUrl, true)
      if (!coverValidation.isValid) {
        return NextResponse.json(
          { error: coverValidation.errorMessage },
          { status: 400 }
        )
      }

      try {
        coverImageUrl = await uploadImageFromBase64(body.coverImageUrl, 'ef-cms/covers')
      } catch (error) {
        console.error('Error uploading cover image:', error)
        return NextResponse.json(
          { error: 'Error al subir imagen de portada' },
          { status: 500 }
        )
      }
    }

    // Handle news images upload to Cloudinary
    const processedNewsImages = []
    if (body.newsImages && body.newsImages.length > 0) {
      // Validate all news images before upload
      const imageUrls = body.newsImages.map((img: { imageUrl: string }) => img.imageUrl).filter((url: string) => url && url.startsWith('data:image/'))
      if (imageUrls.length > 0) {
        const imagesValidation = validateServerImagesForContentType('news', imageUrls, false)
        if (!imagesValidation.isValid) {
          return NextResponse.json(
            { error: imagesValidation.errorMessage },
            { status: 400 }
          )
        }
      }

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
          { error: 'Error al subir imágenes de noticia' },
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

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.NEWS,
      action: auditActions.CREATE,
      changes: {
        title_es: news.title_es,
        title_en: news.title_en,
        author: news.author,
        category: news.category,
        newsId: news.id
      }
    })

    return NextResponse.json({
      message: 'Noticia creada exitosamente',
      news
    })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: 'Error al crear noticia' },
      { status: 500 }
    )
  }
}
