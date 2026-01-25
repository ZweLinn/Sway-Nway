import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/notes - List all notes with book info
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        discussion: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                coverImage: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
