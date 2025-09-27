import { NextRequest, NextResponse } from 'next/server'
import { updateGlobalSettings, deleteGlobalSettings, getGlobalSettings } from '@/lib/globalSettingsService'
import { getAuthenticatedUser } from '@/utils/authUtils'
import { createAuditLog, auditActions } from '@/lib/audit'
import { uploadImageFromBase64, deleteImage } from '@/lib/cloudinary'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { location, mail, facebookUrl, instagramUrl, whatsappNumber, mainLogo } = body

    // Get current global settings to compare changes
    const currentGlobalSettings = await getGlobalSettings()
    if (!currentGlobalSettings) {
      return NextResponse.json({ error: 'Global settings not found' }, { status: 404 })
    }

    // Upload main logo to Cloudinary if it's a new base64 string
    let uploadedMainLogo = mainLogo
    if (mainLogo && mainLogo.startsWith('data:image/')) {
      // Delete old logo if it exists
      if (currentGlobalSettings.mainLogo) {
        await deleteImage(currentGlobalSettings.mainLogo)
      }
      uploadedMainLogo = await uploadImageFromBase64(mainLogo, 'global-settings')
    } else if (mainLogo === currentGlobalSettings.mainLogo) {
      // Keep existing logo if no change
      uploadedMainLogo = currentGlobalSettings.mainLogo
    }

    const updatedGlobalSettings = await updateGlobalSettings({
      id,
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
      action: auditActions.UPDATE,
      changes: {
        location,
        mail,
        facebookUrl,
        instagramUrl,
        whatsappNumber,
        mainLogo: uploadedMainLogo,
      },
    })

    return NextResponse.json(updatedGlobalSettings)
  } catch (error) {
    console.error('Error updating global settings:', error)
    return NextResponse.json({ error: 'Error updating global settings' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    // Get current global settings for audit log
    const currentGlobalSettings = await getGlobalSettings()
    if (!currentGlobalSettings) {
      return NextResponse.json({ error: 'Global settings not found' }, { status: 404 })
    }

    // Delete main logo from Cloudinary if it exists
    if (currentGlobalSettings.mainLogo) {
      await deleteImage(currentGlobalSettings.mainLogo)
    }

    await deleteGlobalSettings(id)

    // Create audit log
    await createAuditLog({
      userId: user.userId,
      resource: 'global_settings',
      action: auditActions.DELETE,
      changes: {
        location: currentGlobalSettings.location,
        mail: currentGlobalSettings.mail,
      },
    })

    return NextResponse.json({ message: 'Global settings deleted successfully' })
  } catch (error) {
    console.error('Error deleting global settings:', error)
    return NextResponse.json({ error: 'Error deleting global settings' }, { status: 500 })
  }
}
