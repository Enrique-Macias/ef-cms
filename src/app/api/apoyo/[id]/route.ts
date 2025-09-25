import { NextRequest, NextResponse } from 'next/server'
import { getApoyoById, updateApoyo, deleteApoyo } from '@/lib/apoyoService'
import { createAuditLog, auditActions, auditResources } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const apoyo = await getApoyoById(id)
    
    if (!apoyo) {
      return NextResponse.json(
        { error: 'Elemento de apoyo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(apoyo)
  } catch (error) {
    console.error('Error fetching apoyo:', error)
    return NextResponse.json(
      { error: 'Error al obtener elemento de apoyo' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Get current apoyo to log changes
    const currentApoyo = await getApoyoById(id)
    if (!currentApoyo) {
      return NextResponse.json(
        { error: 'Elemento de apoyo no encontrado' },
        { status: 404 }
      )
    }

    // Update apoyo data
    const updateData = {
      title: body.title,
      description: body.description || null,
      widgetCode: body.widgetCode,
      isActive: body.isActive !== undefined ? body.isActive : currentApoyo.isActive
    }

    const updatedApoyo = await updateApoyo(id, updateData)

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.APOYO,
      action: auditActions.UPDATE,
      changes: {
        title: updatedApoyo.title,
        description: updatedApoyo.description,
        isActive: updatedApoyo.isActive,
        apoyoId: updatedApoyo.id,
        previousValues: {
          title: currentApoyo.title,
          description: currentApoyo.description,
          isActive: currentApoyo.isActive
        }
      }
    })

    return NextResponse.json({
      message: 'Elemento de apoyo actualizado exitosamente',
      apoyo: updatedApoyo
    })
  } catch (error) {
    console.error('Error updating apoyo:', error)
    return NextResponse.json(
      { error: 'Error al actualizar elemento de apoyo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getAuthenticatedUser(request)
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 })
    }

    // Get current apoyo to log changes
    const currentApoyo = await getApoyoById(id)
    if (!currentApoyo) {
      return NextResponse.json(
        { error: 'Elemento de apoyo no encontrado' },
        { status: 404 }
      )
    }

    await deleteApoyo(id)

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.APOYO,
      action: auditActions.DELETE,
      changes: {
        title: currentApoyo.title,
        description: currentApoyo.description,
        isActive: currentApoyo.isActive,
        apoyoId: currentApoyo.id
      }
    })

    return NextResponse.json({
      message: 'Elemento de apoyo eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting apoyo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar elemento de apoyo' },
      { status: 500 }
    )
  }
}
