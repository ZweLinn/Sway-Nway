import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/discussions - List user's discussions
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const discussions = await prisma.discussion.findMany({
      where: { userId: user.id },
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
