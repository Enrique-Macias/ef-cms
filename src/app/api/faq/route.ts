import { NextRequest, NextResponse } from 'next/server'
import { createFAQ, getFAQs, checkOrderExists } from '@/lib/faqService'
import { createAuditLog, auditActions } from '@/lib/audit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkOrder = searchParams.get('checkOrder')
    const excludeId = searchParams.get('excludeId')

    if (checkOrder) {
      // Check if order number is available
      const orderNumber = parseInt(checkOrder)
      if (isNaN(orderNumber)) {
        return NextResponse.json(
          { error: 'Número de orden inválido' },
          { status: 400 }
        )
      }

      const orderExists = await checkOrderExists(orderNumber, excludeId || undefined)
      return NextResponse.json({ 
        available: !orderExists,
        order: orderNumber
      })
    }

    const faqs = await getFAQs()
    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      { error: 'Error al obtener preguntas frecuentes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question_es, question_en, answer_es, answer_en, order } = body

    // Validate required fields
    if (!question_es || !question_en || !answer_es || !answer_en) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    // Check if order number already exists
    const orderNumber = order || 0
    const orderExists = await checkOrderExists(orderNumber)
    if (orderExists) {
      return NextResponse.json(
        { error: `Ya existe una pregunta frecuente con el orden ${orderNumber}` },
        { status: 400 }
      )
    }

    const faq = await createFAQ({
      question_es,
      question_en,
      answer_es,
      answer_en,
      order: order || 0
    })

    // Create audit log
    await createAuditLog({
      resource: 'faq',
      action: auditActions.CREATE,
      changes: {
        question_es,
        question_en,
        answer_es,
        answer_en,
        order: order || 0
      }
    })

    return NextResponse.json({
      message: 'Pregunta frecuente creada exitosamente',
      faq
    })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json(
      { error: 'Error al crear pregunta frecuente' },
      { status: 500 }
    )
  }
}
