import { NextRequest, NextResponse } from 'next/server'
import { getAuditLogsForActividad } from '@/lib/audit'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await getAuditLogsForActividad(page, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Error al obtener registros de auditoría' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    // Delete all audit logs
    await prisma.auditLog.deleteMany({})

    return NextResponse.json({
      message: 'Todos los registros de auditoría eliminados exitosamente'
    })
  } catch (error) {
    console.error('Error deleting audit logs:', error)
    return NextResponse.json(
      { error: 'Error al eliminar registros de auditoría' },
      { status: 500 }
    )
  }
}
