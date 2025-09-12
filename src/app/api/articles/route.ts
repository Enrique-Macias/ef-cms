import { NextResponse } from 'next/server';
import { createArticle, getAllArticles } from '@/lib/articleService';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newArticle = await createArticle(data);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating article:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching articles:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
