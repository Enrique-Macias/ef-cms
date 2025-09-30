import { NextRequest, NextResponse } from 'next/server'
import { updatePagos, deletePagos, getPagos } from '@/lib/pagosService'
import { getAuthenticatedUser } from '@/utils/authUtils'
import { createAuditLog, auditActions } from '@/lib/audit'

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
    const { paystripeCode, paypalUrl } = body

    const updatedPagos = await updatePagos(id, {
      paystripeCode,
      paypalUrl,
    })

    // Create audit log
    await createAuditLog({
      userId: user.userId,
      resource: 'pagos',
      action: auditActions.UPDATE,
      changes: {
        paystripeCode,
        paypalUrl,
      },
    })

    return NextResponse.json(updatedPagos)
  } catch (error) {
    console.error('Error updating pagos:', error)
    return NextResponse.json({ error: 'Error updating pagos' }, { status: 500 })
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

    // Get current pagos for audit log
    const currentPagos = await getPagos()
    if (!currentPagos) {
      return NextResponse.json({ error: 'Pagos not found' }, { status: 404 })
    }

    await deletePagos(id)

    // Create audit log
    await createAuditLog({
      userId: user.userId,
      resource: 'pagos',
      action: auditActions.DELETE,
      changes: {
        paystripeCode: currentPagos.paystripeCode,
        paypalUrl: currentPagos.paypalUrl,
      },
    })

    return NextResponse.json({ message: 'Pagos deleted successfully' })
  } catch (error) {
    console.error('Error deleting pagos:', error)
    return NextResponse.json({ error: 'Error deleting pagos' }, { status: 500 })
  }
}
