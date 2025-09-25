import { NextRequest, NextResponse } from 'next/server'
import { getApoyoList, createApoyo } from '@/lib/apoyoService'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined
    const isActive = searchParams.get('isActive') === 'true' ? true : searchParams.get('isActive') === 'false' ? false : undefined

    const result = await getApoyoList({
      page,
      limit,
      search,
      isActive
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching apoyo:', error)
    return NextResponse.json(
      { error: 'Error al obtener elementos de apoyo' },
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
    const requiredFields = ['title', 'widgetCode']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate widget code contains necessary elements
    if (!body.widgetCode.includes('gfm-embed') || !body.widgetCode.includes('embed.js')) {
      return NextResponse.json(
        { error: 'El código del widget debe ser un widget válido de GoFundMe' },
        { status: 400 }
      )
    }

    // Create apoyo data
    const apoyoData = {
      title: body.title,
      description: body.description || null,
      widgetCode: body.widgetCode,
      isActive: body.isActive !== undefined ? body.isActive : true
    }

    const apoyo = await createApoyo(apoyoData)

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.APOYO,
      action: auditActions.CREATE,
      changes: {
        title: apoyo.title,
        description: apoyo.description,
        isActive: apoyo.isActive,
        apoyoId: apoyo.id
      }
    })

    return NextResponse.json({
      message: 'Elemento de apoyo creado exitosamente',
      apoyo
    })
  } catch (error) {
    console.error('Error creating apoyo:', error)
    return NextResponse.json(
      { error: 'Error al crear elemento de apoyo' },
      { status: 500 }
    )
  }
}
