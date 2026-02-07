import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { getCurrentUser } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

interface DbMessage {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
  discussionId: string;
}

interface DiscussionWithMessages {
  id: string;
  title: string | null;
  userId: string | null;
  createdAt: Date;
  messages: DbMessage[];
}

// POST /api/discussions/[id]/summarize - AI summarize discussion & save as note
export async function POST(req: Request, { params }: Params) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: discussionId } = await params;

    // Fetch all messages from the discussion
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    }) as DiscussionWithMessages | null;

    if (!discussion) {
      return NextResponse.json(
        { error: 'Discussion not found' },
        { status: 404 }
      );
    }

    if (discussion.userId && discussion.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (discussion.messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages to summarize' },
        { status: 400 }
      );
    }

    // Format messages for the AI
    const conversationText = discussion.messages
      .map((m: DbMessage) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    // Generate summary using AI
    const { text: summary } = await generateText({
      model: google('gemini-2.5-flash-lite'),
      system: 'You are a helpful assistant that summarizes conversations. Create a concise, clear summary of the key points discussed. Use bullet points for clarity. IMPORTANT: You MUST write the entire summary in Burmese (Myanmar/မြန်မာဘာသာ). Use Myanmar script throughout.',
      prompt: `Please summarize the following discussion in Burmese:\n\n${conversationText}`,
    });

    // Save summary as a note
    const note = await prisma.note.create({
      data: {
        content: summary,
        discussionId,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error summarizing discussion:', error);
    return NextResponse.json(
      { error: 'Failed to summarize discussion' },
      { status: 500 }
    );
  }
}
