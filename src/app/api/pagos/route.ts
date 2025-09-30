import { NextRequest, NextResponse } from 'next/server'
import { createPagos, getPagos } from '@/lib/pagosService'
import { getAuthenticatedUser } from '@/utils/authUtils'
import { createAuditLog, auditActions } from '@/lib/audit'

export async function GET() {
  try {
    const pagos = await getPagos()
    return NextResponse.json(pagos)
  } catch (error) {
    console.error('Error fetching pagos:', error)
    return NextResponse.json({ error: 'Error fetching pagos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { paystripeCode, paypalUrl } = body

    const pagos = await createPagos({
      paystripeCode,
      paypalUrl,
    })

    // Create audit log
    await createAuditLog({
      userId: user.userId,
      resource: 'pagos',
      action: auditActions.CREATE,
      changes: {
        paystripeCode,
        paypalUrl,
      },
    })

    return NextResponse.json(pagos, { status: 201 })
  } catch (error) {
    console.error('Error creating pagos:', error)
    return NextResponse.json({ error: 'Error creating pagos' }, { status: 500 })
  }
}
