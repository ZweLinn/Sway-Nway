import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

// POST /api/discussions/[id]/messages - Save a message
export async function POST(req: Request, { params }: Params) {
  try {
    const { id: discussionId } = await params;
    const { role, content } = await req.json();

    if (!role || !content) {
      return NextResponse.json(
        { error: 'Role and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        role,
        content,
        discussionId,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Failed to save message' },
      { status: 500 }
    );
  }
}
