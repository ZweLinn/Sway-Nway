import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// POST /api/books/[id]/discussions - Create new discussion for a book
export async function POST(req: Request, { params }: Params) {
  try {
    const { id: bookId } = await params;

    // Verify book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    // Create discussion
    const discussion = await prisma.discussion.create({
      data: {
        title: `Discussion: ${book.title}`,
        bookId,
        status: 'active',
      },
    });

    return NextResponse.json(discussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}
