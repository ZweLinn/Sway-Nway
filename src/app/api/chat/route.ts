import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { UIMessage, convertToModelMessages } from 'ai';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { messages, discussionId }: { messages: UIMessage[]; discussionId?: string } = await req.json();

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

        const stream = streamText({
            model: google('gemini-2.5-flash'),
            messages: await convertToModelMessages(messages),
            system: 'You are a helpful assistant',
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
