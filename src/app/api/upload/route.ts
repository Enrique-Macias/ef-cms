import { NextRequest, NextResponse } from 'next/server'
import { uploadImageFromBase64 } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData, folder } = body

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      )
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImageFromBase64(imageData, folder || 'ef-cms')

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully'
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    )
  }
}
