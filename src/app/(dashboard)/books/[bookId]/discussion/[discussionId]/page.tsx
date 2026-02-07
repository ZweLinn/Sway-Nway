import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import BookDiscussionChat from '@/components/chat/book-discussion-chat';

type Params = {
  params: Promise<{ bookId: string; discussionId: string }>;
};

export default async function BookDiscussionPage({ params }: Params) {
  const user = await getCurrentUser();
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

  if (discussion.userId && discussion.userId !== user?.id) {
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
