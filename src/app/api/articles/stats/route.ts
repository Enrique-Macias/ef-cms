import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalArticles = await prisma.article.count();
    // Add more stats as needed
    return NextResponse.json({ totalArticles }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching article stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
