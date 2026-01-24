import { streamText } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { UIMessage, convertToModelMessages } from 'ai';
const openrouter = createOpenRouter({
    apiKey: process.env.OPEN_ROUTER_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        const stream = streamText({
            model: openrouter('deepseek/deepseek-r1-0528:free'),
            messages: await convertToModelMessages(messages),
            system: 'You are a helpful assistant',
        });
        return stream.toUIMessageStreamResponse()
    }
    catch (error) {
        console.error('Error in completion route:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};
