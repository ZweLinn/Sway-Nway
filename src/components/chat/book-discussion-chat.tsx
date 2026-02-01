'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import EndDiscussionButton from './end-discussion-button';

interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  keyThemes: string[];
}

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

interface Discussion {
  id: string;
  title: string | null;
  status: string;
  messages: Message[];
}

interface BookDiscussionChatProps {
  book: Book;
  discussion: Discussion;
}

export default function BookDiscussionChat({
  book,
  discussion,
}: BookDiscussionChatProps) {
  const [input, setInput] = useState<string>('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const initialMessagesLoaded = useRef(false);
  const initializationTriggered = useRef(false);

  const { messages, sendMessage, status, error, setMessages } = useChat();

  // Initialize discussion with AI intro when no messages exist
  const initializeDiscussion = useCallback(async () => {
    if (initializationTriggered.current) return;
    if (discussion.status === 'ended') return;

    initializationTriggered.current = true;
    setIsInitializing(true);

    try {
      await sendMessage(
        { text: '__INIT__' },
        { body: { discussionId: discussion.id, bookId: book.id, isInitialization: true } }
      );
    } catch (err) {
      console.error('Failed to initialize discussion:', err);
      initializationTriggered.current = false; // Allow retry on failure
    } finally {
      setIsInitializing(false);
    }
  }, [sendMessage, discussion.id, discussion.status, book.id]);

  // Load existing messages from DB on mount
  useEffect(() => {
    if (initialMessagesLoaded.current) return;
    initialMessagesLoaded.current = true;

    if (discussion.messages?.length > 0) {
      const formattedMessages = discussion.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        parts: [{ type: 'text' as const, text: m.content }],
        createdAt: new Date(m.createdAt),
      }));
      setMessages(formattedMessages);
    } else {
      // No existing messages, trigger AI initialization
      initializeDiscussion();
    }
    setIsInitialLoading(false);
  }, [discussion.messages, setMessages, initializeDiscussion]);

  // Filter out the __INIT__ placeholder message from display
  const displayMessages = messages.filter((m) => {
    if (m.role === 'user') {
      const text = m.parts?.find((p) => p.type === 'text')?.text;
      return text !== '__INIT__';
    }
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || discussion.status === 'ended') return;
    await sendMessage(
      { text: input },
      { body: { discussionId: discussion.id, bookId: book.id } }
    );
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const isEnded = discussion.status === 'ended';

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{book.title}</h1>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
        {!isEnded && (
          <EndDiscussionButton discussionId={discussion.id} />
        )}
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1">
        {error && (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="text-red-600 font-medium">Error: {error.message}</div>
          </div>
        )}
        {isInitialLoading ? (
          <div className="max-w-2xl mx-auto px-4 py-6 text-center text-muted-foreground">
            Loading conversation...
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-6">
            {displayMessages.length === 0 && !isInitializing && status !== 'streaming' && status !== 'submitted' && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Start the discussion by sending a message
                </p>
              </div>
            )}
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`py-6 ${message.role === 'user' ? '' : 'bg-muted/50'} -mx-4 px-4`}
              >
                <div className="flex gap-4 max-w-2xl mx-auto">
                  <Avatar className="shrink-0 mt-1">
                    <AvatarFallback
                      className={
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }
                    >
                      {message.role === 'user' ? 'U' : 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-sm">
                      {message.role === 'user' ? 'You' : 'Discussion Guide'}
                    </p>
                    <div className="prose prose-sm dark:prose-invert">
                      {message.parts.map((part, index) =>
                        part.type === 'text' ? (
                          <p key={index} className="m-0 whitespace-pre-wrap">
                            {part.text}
                          </p>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {(status === 'submitted' || status === 'streaming' || isInitializing) && displayMessages.length === 0 && (
              <div className="py-6 -mx-4 px-4">
                <div className="flex gap-4 max-w-2xl mx-auto">
                  <Avatar className="shrink-0 mt-1">
                    <AvatarFallback className="bg-muted">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-sm">Discussion Guide</p>
                    <p className="text-muted-foreground italic">Preparing discussion...</p>
                  </div>
                </div>
              </div>
            )}
            {(status === 'submitted' || status === 'streaming') && displayMessages.length > 0 && (
              <div className="py-6 -mx-4 px-4">
                <div className="flex gap-4 max-w-2xl mx-auto">
                  <Avatar className="shrink-0 mt-1">
                    <AvatarFallback className="bg-muted">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-sm">Discussion Guide</p>
                    <p className="text-muted-foreground italic">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      {isEnded ? (
        <div className="border-t bg-muted/50 py-6">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              This discussion has ended. View your notes in the Notes section.
            </p>
          </div>
        </div>
      ) : (
        <div className="border-t bg-background py-4">
          <div className="max-w-2xl mx-auto px-4">
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts about the book..."
                className="flex-1 min-h-[48px] max-h-[200px] resize-none"
              />
              <Button type="submit" size="lg" disabled={!input.trim()}>
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
