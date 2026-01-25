import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BookDiscussionChat from '@/components/chat/book-discussion-chat';

type Params = {
  params: Promise<{ bookId: string; discussionId: string }>;
};

export default async function BookDiscussionPage({ params }: Params) {
  const { bookId, discussionId } = await params;

  const [book, discussion] = await Promise.all([
    prisma.book.findUnique({ where: { id: bookId } }),
    prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
  ]);

  if (!book || !discussion) {
    notFound();
  }

  // Serialize dates for client component
  const serializedDiscussion = {
    ...discussion,
    messages: discussion.messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
  };

  return (
    <BookDiscussionChat
      book={book}
      discussion={serializedDiscussion}
    />
  );
}
