import { NextRequest, NextResponse } from 'next/server';
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articleService';
import { createAuditLog, auditActions, auditResources } from '@/lib/audit';
import { getAuthenticatedUser } from '@/utils/authUtils';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }
    
    const { id } = await params;
    const data = await request.json();

    // Get existing article for audit log
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    const updatedArticle = await updateArticle(id, data);

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.ARTICLES,
      action: auditActions.UPDATE,
      changes: {
        title: updatedArticle.title,
        title_en: updatedArticle.title_en,
        author: updatedArticle.author,
        articleId: updatedArticle.id,
        previousData: {
          title: existingArticle.title,
          title_en: existingArticle.title_en,
          author: existingArticle.author
        }
      }
    });

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }
    
    const { id } = await params;

    // Get existing article for audit log
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 });
    }

    await deleteArticle(id);

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.ARTICLES,
      action: auditActions.DELETE,
      changes: {
        title: existingArticle.title,
        title_en: existingArticle.title_en,
        author: existingArticle.author,
        articleId: existingArticle.id
      }
    });

    return NextResponse.json({ message: 'Artículo eliminado exitosamente' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error deleting article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
