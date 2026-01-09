import { generateText } from "ai";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
    apiKey: process.env.OPEN_ROUTER_API_KEY!,
});
export async function POST() {
    const { text } = await generateText({
        model: openrouter('deepseek/deepseek-r1-0528:free'),
        prompt: 'LLM အကြောင်းကို မြန်မာလို ရေးပြပါ။',
    });
    return Response.json({ text });
}