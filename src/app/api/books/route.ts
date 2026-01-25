import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/books - List all books
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { discussions: true },
        },
      },
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST /api/books - Create new book
export async function POST(req: Request) {
  try {
    const { title, author, coverImage, summary, keyThemes } = await req.json();

    if (!title || !author || !summary) {
      return NextResponse.json(
        { error: 'Title, author, and summary are required' },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        coverImage,
        summary,
        keyThemes: keyThemes || [],
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
