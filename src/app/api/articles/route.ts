import { NextRequest, NextResponse } from 'next/server';
import { createArticle, getAllArticles } from '@/lib/articleService';
import { createAuditLog, auditActions, auditResources } from '@/lib/audit';
import { getAuthenticatedUser } from '@/utils/authUtils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    
    // Check if user is authenticated
    if (!user) {
      return NextResponse.json({ error: 'Autenticación requerida' }, { status: 401 });
    }
    
    const data = await request.json();
    const newArticle = await createArticle(data);

    // Log audit action
    await createAuditLog({
      userId: user.userId,
      resource: auditResources.ARTICLES,
      action: auditActions.CREATE,
      changes: {
        title: newArticle.title,
        title_en: newArticle.title_en,
        author: newArticle.author,
        articleId: newArticle.id
      }
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching articles:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
