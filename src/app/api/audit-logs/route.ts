import { NextRequest, NextResponse } from 'next/server'
import { getAuditLogsForActividad } from '@/lib/audit'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/utils/authUtils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const typeFilter = searchParams.get('type') || ''
    const dateFilter = searchParams.get('date') || ''

    const result = await getAuditLogsForActividad(page, limit, search, typeFilter, dateFilter)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Error al obtener registros de auditoría' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Solo los administradores pueden eliminar todos los registros de auditoría' }, { status: 403 });
    }

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
