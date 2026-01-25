'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatComponentProps {
  discussionId: string;
}

interface DbMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export default function ChatComponent({ discussionId }: ChatComponentProps) {
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const initialMessagesLoaded = useRef(false);

  const { messages, sendMessage, status, error, setMessages } = useChat();

  // Load existing messages from DB on mount
  useEffect(() => {
    if (initialMessagesLoaded.current) return;
    initialMessagesLoaded.current = true;

    async function loadMessages() {
      try {
        const res = await fetch(`/api/discussions/${discussionId}`);
        if (res.ok) {
          const discussion = await res.json();
          if (discussion.messages?.length > 0) {
            const formattedMessages = discussion.messages.map((m: DbMessage) => ({
              id: m.id,
              role: m.role as 'user' | 'assistant',
              parts: [{ type: 'text', text: m.content }],
              createdAt: new Date(m.createdAt),
            }));
            setMessages(formattedMessages);
          }
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadMessages();
  }, [discussionId, setMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input }, { body: { discussionId } });
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-semibold text-center">Ai Discussion Chat</h1>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        {error && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="text-red-600 font-medium">Error: {error.message}</div>
          </div>
        )}
        {isLoading ? (
          <div className="max-w-2xl mx-auto px-4 py-6 text-center text-muted-foreground">
            Loading conversation...
          </div>
        ) : (
        <div className="max-w-2xl mx-auto px-4 py-6">
          {messages.map(message => (
            <div
              key={message.id}
              className={`py-6 ${message.role === 'user' ? '' : 'bg-muted/50'} -mx-4 px-4`}
            >
              <div className="flex gap-4 max-w-2xl mx-auto">
                <Avatar className="shrink-0 mt-1">
                  <AvatarFallback className={
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }>
                    {message.role === 'user' ? 'U' : 'AI'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-sm">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </p>
                  <div className="prose prose-sm dark:prose-invert">
                    {message.parts.map((part, index) =>
                      part.type === 'text' ? <p key={index} className="m-0">{part.text}</p> : null
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(status === 'submitted' || status === 'streaming') && (
            <div className="py-6  -mx-4 px-4">
              <div className="flex gap-4 max-w-2xl mx-auto">
                <Avatar className="shrink-0 mt-1">
                  <AvatarFallback className="bg-muted">AI</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-sm">Assistant</p>
                  <p className="text-muted-foreground italic">Thinking...</p>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background py-4">
        <div className="max-w-2xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="စာအုပ်အကြောင်း ဆွေးနွေးရအောင်..."
              className="flex-1 min-h-[48px] max-h-[200px] min-w-[400px] max-w-[400px] resize-none"
            />
            <Button type="submit" size="lg" disabled={!input.trim()}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
