import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { UIMessage, convertToModelMessages } from 'ai';
import { prisma } from '@/lib/prisma';

interface Book {
    title: string;
    author: string;
    summary: string;
    keyThemes: string[];
}

function getBookDiscussionPrompt(book: Book): string {
    return `You are an engaging discussion facilitator for "${book.title}" by ${book.author}.

BOOK CONTENT: ${book.summary}
KEY THEMES: ${book.keyThemes.join(', ')}

YOUR APPROACH:
- Ask thought-provoking questions about the book
- Use Socratic method - guide through questions
- Assess user's understanding of key concepts
- Explore their personal perspectives and insights
- Connect ideas to real-life experiences

STYLE:
- Start by asking what interests them about this book
- After each response, ask a follow-up question
- Keep responses concise (2-3 paragraphs)
- Always end with a question to continue discussion
- Be encouraging and supportive of their thoughts

LANGUAGE:
- If the user writes in Burmese (Myanmar), respond in Burmese
- Otherwise, respond in the same language as the user`;
}

function getInitializationPrompt(book: Book): string {
    return `You are starting a book discussion about "${book.title}" by ${book.author}.

BOOK CONTENT: ${book.summary}
KEY THEMES: ${book.keyThemes.join(', ')}

YOUR TASK:
1. Provide a SHORT engaging description of the book (2-3 sentences max)
2. Ask ONE thought-provoking question to begin the discussion

IMPORTANT RULES:
- Keep introduction brief and inviting
- Ask only ONE clear, open-ended question
- Make the reader feel excited to share their thoughts

LANGUAGE: You MUST respond entirely in Burmese (Myanmar/မြန်မာဘာသာ). Use Myanmar script throughout.`;
}

export async function POST(req: Request) {
    try {
        const { messages, discussionId, bookId, isInitialization }: {
            messages: UIMessage[];
            discussionId?: string;
            bookId?: string;
            isInitialization?: boolean;
        } = await req.json();

        // Get book details if bookId is provided
        let book: Book | null = null;
        if (bookId) {
            book = await prisma.book.findUnique({
                where: { id: bookId },
                select: {
                    title: true,
                    author: true,
                    summary: true,
                    keyThemes: true,
                },
            });
        }

        // Handle AI initialization (no prior user message needed)
        if (isInitialization && book && discussionId) {
            const stream = streamText({
                model: google('gemini-2.5-flash'),
                messages: [{ role: 'user', content: 'Start the discussion.' }],
                system: getInitializationPrompt(book),
                async onFinish({ text }) {
                    if (text) {
                        await prisma.message.create({
                            data: {
                                role: 'assistant',
                                content: text,
                                discussionId,
                            },
                        });
                    }
                },
            });
            return stream.toUIMessageStreamResponse();
        }

        // Save user message to DB if discussionId is provided
        const lastMessage = messages[messages.length - 1];
        if (discussionId && lastMessage?.role === 'user') {
            const userContent = lastMessage.parts
                ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                .map((p) => p.text)
                .join('') || '';

            if (userContent) {
                await prisma.message.create({
                    data: {
                        role: 'user',
                        content: userContent,
                        discussionId,
                    },
                });
            }
        }

        // Determine system prompt based on context
        const systemPrompt = book
            ? getBookDiscussionPrompt(book)
            : 'You are a helpful assistant';

        const stream = streamText({
            model: google('gemini-2.5-flash'),
            messages: await convertToModelMessages(messages),
            system: systemPrompt,
            async onFinish({ text }) {
                // Save AI response to DB after streaming completes
                if (discussionId && text) {
                    await prisma.message.create({
                        data: {
                            role: 'assistant',
                            content: text,
                            discussionId,
                        },
                    });
                }
            },
        });
        return stream.toUIMessageStreamResponse()
    }
    catch (error) {
        console.error('Error in completion route:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
