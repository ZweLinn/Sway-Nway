import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/discussions - List all discussions
export async function GET() {
  try {
    const discussions = await prisma.discussion.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    });
    return NextResponse.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discussions' },
      { status: 500 }
    );
  }
}
