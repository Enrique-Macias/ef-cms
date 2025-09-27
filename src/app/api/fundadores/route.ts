import { NextRequest, NextResponse } from 'next/server'
import { createFundador, getAllFundadores } from '@/lib/fundadorService'
import { uploadImageFromBase64 } from '@/lib/cloudinary'
import { validateServerImagesForContentType } from '@/utils/serverImageValidation'
import { createAuditLog, auditActions } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET() {
  try {
    const fundadores = await getAllFundadores()
    return NextResponse.json(fundadores)
  } catch (error) {
    console.error('Error fetching fundadores:', error)
    return NextResponse.json(
      { error: 'Error al obtener los fundadores' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, role_es, role_en, body_es, body_en, imageUrl, facebookUrl, instagramUrl } = body

    // Validate required fields
    if (!name || !role_es || !role_en || !body_es || !body_en || !imageUrl) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Upload image to Cloudinary if it's a base64 string
    let finalImageUrl = imageUrl
    if (imageUrl.startsWith('data:image/')) {
      // Validate image before upload
      const imageValidation = validateServerImagesForContentType('team', imageUrl, true)
      if (!imageValidation.isValid) {
        return NextResponse.json(
          { error: imageValidation.errorMessage },
          { status: 400 }
        )
      }

      try {
        finalImageUrl = await uploadImageFromBase64(imageUrl, 'fundadores')
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        return NextResponse.json(
          { error: 'Error al subir imagen' },
          { status: 500 }
        )
      }
    }

    const fundador = await createFundador({
      name,
      role_es,
      role_en,
      body_es,
      body_en,
      imageUrl: finalImageUrl,
      facebookUrl,
      instagramUrl,
    })

    // Log the action
    await createAuditLog({
      userId: user.userId,
      resource: 'fundadores',
      action: auditActions.CREATE,
      changes: { name, role_es, role_en, body_es, body_en, imageUrl, facebookUrl, instagramUrl },
    })

    return NextResponse.json(fundador, { status: 201 })
  } catch (error) {
    console.error('Error creating fundador:', error)
    return NextResponse.json(
      { error: 'Error al crear el fundador' },
      { status: 500 }
    )
  }
}
