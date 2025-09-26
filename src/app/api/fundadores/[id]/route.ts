import { NextRequest, NextResponse } from 'next/server'
import { getFundadorById, updateFundador, deleteFundador } from '@/lib/fundadorService'
import { createAuditLog, auditActions } from '@/lib/audit'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fundador = await getFundadorById(id)
    
    if (!fundador) {
      return NextResponse.json(
        { error: 'Fundador no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(fundador)
  } catch (error) {
    console.error('Error fetching fundador:', error)
    return NextResponse.json(
      { error: 'Error al obtener el fundador' },
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
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { name, role_es, role_en, body_es, body_en, imageUrl, facebookUrl, instagramUrl } = body

    // Get the current fundador to log changes
    const currentFundador = await getFundadorById(id)
    if (!currentFundador) {
      return NextResponse.json(
        { error: 'Fundador no encontrado' },
        { status: 404 }
      )
    }

    const fundador = await updateFundador(id, {
      id,
      name,
      role_es,
      role_en,
      body_es,
      body_en,
      imageUrl,
      facebookUrl,
      instagramUrl,
    })

    // Log the action
    await createAuditLog({
      userId: user.userId,
      resource: 'fundadores',
      action: auditActions.UPDATE,
      changes: { 
        name: name, // Include name at top level for audit log title
        before: currentFundador,
        after: { name, role_es, role_en, body_es, body_en, imageUrl, facebookUrl, instagramUrl }
      },
    })

    return NextResponse.json(fundador)
  } catch (error) {
    console.error('Error updating fundador:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el fundador' },
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
    if (!user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get the current fundador to log changes
    const currentFundador = await getFundadorById(id)
    if (!currentFundador) {
      return NextResponse.json(
        { error: 'Fundador no encontrado' },
        { status: 404 }
      )
    }

    await deleteFundador(id)

    // Log the action
    await createAuditLog({
      userId: user.userId,
      resource: 'fundadores',
      action: auditActions.DELETE,
      changes: { 
        name: currentFundador.name, // Include name at top level for audit log title
        deleted: currentFundador 
      },
    })

    return NextResponse.json({ message: 'Fundador eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting fundador:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el fundador' },
      { status: 500 }
    )
  }
}
