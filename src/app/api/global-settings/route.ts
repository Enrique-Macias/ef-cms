import { NextRequest, NextResponse } from 'next/server'
import { createGlobalSettings, getGlobalSettings } from '@/lib/globalSettingsService'
import { getAuthenticatedUser } from '@/utils/authUtils'
import { createAuditLog, auditActions } from '@/lib/audit'
import { uploadImageFromBase64 } from '@/lib/cloudinary'

export async function GET() {
  try {
    const globalSettings = await getGlobalSettings()
    return NextResponse.json(globalSettings)
  } catch (error) {
    console.error('Error fetching global settings:', error)
    return NextResponse.json({ error: 'Error fetching global settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { location, mail, facebookUrl, instagramUrl, whatsappNumber, mainLogo } = body

    // Validate required fields
    if (!location || !mail || !mainLogo) {
      return NextResponse.json({ error: 'Location, mail, and main logo are required' }, { status: 400 })
    }

    // Upload main logo to Cloudinary if it's a base64 string
    let uploadedMainLogo = mainLogo
    if (mainLogo.startsWith('data:image/')) {
      uploadedMainLogo = await uploadImageFromBase64(mainLogo, 'global-settings')
    }

    const globalSettings = await createGlobalSettings({
      location,
      mail,
      facebookUrl,
      instagramUrl,
      whatsappNumber,
      mainLogo: uploadedMainLogo,
    })

    // Create audit log
    await createAuditLog({
      userId: user.userId,
      resource: 'global_settings',
      action: auditActions.CREATE,
      changes: {
        location,
        mail,
        facebookUrl,
        instagramUrl,
        whatsappNumber,
        mainLogo: uploadedMainLogo,
      },
    })

    return NextResponse.json(globalSettings, { status: 201 })
  } catch (error) {
    console.error('Error creating global settings:', error)
    return NextResponse.json({ error: 'Error creating global settings' }, { status: 500 })
  }
}
