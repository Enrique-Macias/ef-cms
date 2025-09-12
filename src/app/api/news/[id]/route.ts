import { NextRequest, NextResponse } from 'next/server'
import { getNewsById, updateNews, deleteNews } from '@/lib/newsService'
import { uploadImageFromBase64, extractPublicId, deleteImage } from '@/lib/cloudinary'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const news = await getNewsById(id)

    if (!news) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ news })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Error al obtener noticia' },
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

    // Check if news exists
    const existingNews = await getNewsById(id)
    if (!existingNews) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      )
    }

    // Handle cover image upload to Cloudinary if it's a base64 data URL
    let coverImageUrl = body.coverImageUrl
    if (body.coverImageUrl && body.coverImageUrl.startsWith('data:image/')) {
      try {
        // Delete old cover image from Cloudinary if it exists
        if (existingNews.coverImageUrl && existingNews.coverImageUrl.includes('cloudinary.com')) {
          const oldPublicId = extractPublicId(existingNews.coverImageUrl)
          if (oldPublicId) {
            try {
              await deleteImage(oldPublicId)
            } catch (error) {
              console.error('Error deleting old cover image:', error)
            }
          }
        }
        
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
      try {
        // Delete old news images from Cloudinary if they exist
        if (existingNews.newsImages && existingNews.newsImages.length > 0) {
          for (const oldImage of existingNews.newsImages) {
            if (oldImage.imageUrl && oldImage.imageUrl.includes('cloudinary.com')) {
              const oldPublicId = extractPublicId(oldImage.imageUrl)
              if (oldPublicId) {
                try {
                  await deleteImage(oldPublicId)
                } catch (error) {
                  console.error('Error deleting old news image:', error)
                }
              }
            }
          }
        }

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

    // Prepare update data
    const updateData: Record<string, unknown> = {}
    
    if (body.title_es !== undefined) updateData.title_es = body.title_es
    if (body.title_en !== undefined) updateData.title_en = body.title_en
    if (body.body_es !== undefined) updateData.body_es = body.body_es
    if (body.body_en !== undefined) updateData.body_en = body.body_en
    if (body.date !== undefined) updateData.date = new Date(body.date)
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.category !== undefined) updateData.category = body.category
    if (body.author !== undefined) updateData.author = body.author
    if (body.location_city !== undefined) updateData.location_city = body.location_city
    if (body.location_country !== undefined) updateData.location_country = body.location_country
    if (coverImageUrl !== undefined) updateData.coverImageUrl = coverImageUrl
    if (body.category_en !== undefined) updateData.category_en = body.category_en
    if (body.tags_en !== undefined) updateData.tags_en = body.tags_en
    if (processedNewsImages.length > 0) updateData.newsImages = processedNewsImages

    const news = await updateNews(id, { ...updateData, id })

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.NEWS,
      action: auditActions.UPDATE,
      changes: {
        title_es: news.title_es,
        title_en: news.title_en,
        author: news.author,
        category: news.category,
        newsId: news.id,
        previousData: {
          title_es: existingNews.title_es,
          title_en: existingNews.title_en,
          author: existingNews.author,
          category: existingNews.category
        }
      }
    })

    return NextResponse.json({
      message: 'Noticia actualizada exitosamente',
      news
    })
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: 'Error al actualizar noticia' },
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

    // Check if news exists
    const existingNews = await getNewsById(id)
    if (!existingNews) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      )
    }

    // Delete images from Cloudinary before deleting the news
    try {
      // Delete cover image
      if (existingNews.coverImageUrl && existingNews.coverImageUrl.includes('cloudinary.com')) {
        const coverPublicId = extractPublicId(existingNews.coverImageUrl)
        if (coverPublicId) {
          await deleteImage(coverPublicId)
        }
      }

      // Delete news images
      if (existingNews.newsImages && existingNews.newsImages.length > 0) {
        for (const image of existingNews.newsImages) {
          if (image.imageUrl && image.imageUrl.includes('cloudinary.com')) {
            const imagePublicId = extractPublicId(image.imageUrl)
            if (imagePublicId) {
              await deleteImage(imagePublicId)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error deleting images from Cloudinary:', error)
    }

    await deleteNews(id)

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.NEWS,
      action: auditActions.DELETE,
      changes: {
        title_es: existingNews.title_es,
        title_en: existingNews.title_en,
        author: existingNews.author,
        category: existingNews.category,
        newsId: existingNews.id
      }
    })

    return NextResponse.json({
      message: 'Noticia eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { error: 'Error al eliminar noticia' },
      { status: 500 }
    )
  }
}
