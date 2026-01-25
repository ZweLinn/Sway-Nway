import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// GET /api/books/[id] - Get single book details
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        discussions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    );
  }
}

// PUT /api/books/[id] - Update book
export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { title, author, coverImage, summary, keyThemes } = await req.json();

    const book = await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        coverImage,
        summary,
        keyThemes,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] - Delete book
export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
}
