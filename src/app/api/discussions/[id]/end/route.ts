import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

type Params = { params: Promise<{ id: string }> };

interface AnalysisResult {
  summary: string;
  knowledgeAssessment: string;
  perspectiveInsights: string;
  keyTakeaways: string[];
}

// POST /api/discussions/[id]/end - End discussion and create analysis
export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    // Fetch discussion with messages and book
    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        book: true,
      },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: 'Discussion not found' },
        { status: 404 }
      );
    }

    if (discussion.status === 'ended') {
      return NextResponse.json(
        { error: 'Discussion already ended' },
        { status: 400 }
      );
    }

    // Format conversation for analysis
    const conversationText = discussion.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    // Analyze the discussion with AI
    const analysisPrompt = `Analyze this book discussion about "${discussion.book.title}" by ${discussion.book.author}.

CONVERSATION:
${conversationText}

Provide a JSON response with the following structure:
{
  "summary": "A concise summary of the key points discussed (2-3 paragraphs)",
  "knowledgeAssessment": "An evaluation of the user's understanding of the book's concepts, themes, and ideas",
  "perspectiveInsights": "Notable personal perspectives, interpretations, or unique insights the user shared",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3", ...]
}

Focus on what was actually discussed. Be constructive and encouraging in the assessment.
Respond ONLY with valid JSON, no markdown formatting.`;

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: analysisPrompt,
    });

    // Parse the analysis
    let analysis: AnalysisResult;
    try {
      // Clean up potential markdown formatting
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanedText);
    } catch {
      // Fallback if parsing fails
      analysis = {
        summary: text,
        knowledgeAssessment: 'Analysis could not be fully processed.',
        perspectiveInsights: '',
        keyTakeaways: [],
      };
    }

    // Update discussion status and create note in a transaction
    const [updatedDiscussion, note] = await prisma.$transaction([
      prisma.discussion.update({
        where: { id },
        data: {
          status: 'ended',
          endedAt: new Date(),
        },
      }),
      prisma.note.create({
        data: {
          title: `Discussion Notes: ${discussion.book.title}`,
          content: analysis.summary,
          knowledgeAssessment: analysis.knowledgeAssessment,
          perspectiveInsights: analysis.perspectiveInsights,
          keyTakeaways: analysis.keyTakeaways,
          discussionId: id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      discussionId: updatedDiscussion.id,
      noteId: note.id,
    });
  } catch (error) {
    console.error('Error ending discussion:', error);
    return NextResponse.json(
      { error: 'Failed to end discussion' },
      { status: 500 }
    );
  }
}
