import { NextRequest, NextResponse } from 'next/server'
import { getFAQById, updateFAQ, deleteFAQ, checkOrderExists } from '@/lib/faqService'
import { createAuditLog, auditActions } from '@/lib/audit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const faq = await getFAQById(id)

    if (!faq) {
      return NextResponse.json(
        { error: 'Pregunta frecuente no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(faq)
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    return NextResponse.json(
      { error: 'Error al obtener pregunta frecuente' },
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
    const body = await request.json()
    const { question_es, question_en, answer_es, answer_en, order } = body

    // Get original FAQ for audit log
    const originalFAQ = await getFAQById(id)
    if (!originalFAQ) {
      return NextResponse.json(
        { error: 'Pregunta frecuente no encontrada' },
        { status: 404 }
      )
    }

    // Check if order number already exists (excluding current FAQ)
    if (order !== undefined && order !== originalFAQ.order) {
      const orderExists = await checkOrderExists(order, id)
      if (orderExists) {
        return NextResponse.json(
          { error: `Ya existe una pregunta frecuente con el orden ${order}` },
          { status: 400 }
        )
      }
    }

    const faq = await updateFAQ(id, {
      question_es,
      question_en,
      answer_es,
      answer_en,
      order
    })

    // Create audit log
    await createAuditLog({
      resource: 'faq',
      action: auditActions.UPDATE,
      changes: {
        before: {
          question_es: originalFAQ.question_es,
          question_en: originalFAQ.question_en,
          answer_es: originalFAQ.answer_es,
          answer_en: originalFAQ.answer_en,
          order: originalFAQ.order
        },
        after: {
          question_es,
          question_en,
          answer_es,
          answer_en,
          order
        }
      }
    })

    return NextResponse.json({
      message: 'Pregunta frecuente actualizada exitosamente',
      faq
    })
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json(
      { error: 'Error al actualizar pregunta frecuente' },
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

    // Get original FAQ for audit log
    const originalFAQ = await getFAQById(id)
    if (!originalFAQ) {
      return NextResponse.json(
        { error: 'Pregunta frecuente no encontrada' },
        { status: 404 }
      )
    }

    await deleteFAQ(id)

    // Create audit log
    await createAuditLog({
      resource: 'faq',
      action: auditActions.DELETE,
      changes: {
        deleted: {
          question_es: originalFAQ.question_es,
          question_en: originalFAQ.question_en,
          answer_es: originalFAQ.answer_es,
          answer_en: originalFAQ.answer_en,
          order: originalFAQ.order
        }
      }
    })

    return NextResponse.json({
      message: 'Pregunta frecuente eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      { error: 'Error al eliminar pregunta frecuente' },
      { status: 500 }
    )
  }
}
