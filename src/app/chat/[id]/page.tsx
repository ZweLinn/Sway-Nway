import ChatComponent from "@/components/chat/chat-component";

type Params = { params: Promise<{ id: string }> };

export default async function ChatPage({ params }: Params) {
    const { id } = await params;

    return (
        <div className="flex min-h-screen items-center justify-center">
            <ChatComponent discussionId={id} />
        </div>
    );
}