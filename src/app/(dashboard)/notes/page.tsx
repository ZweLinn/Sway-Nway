import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import NoteList from '@/components/notes/note-list';
import { Skeleton } from '@/components/ui/skeleton';

function NoteListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-20 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function NotesPage() {
  const user = await getCurrentUser();

  const notes = await prisma.note.findMany({
    where: {
      discussion: { userId: user?.id },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      discussion: {
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverImage: true,
            },
          },
        },
      },
    },
  });

  // Serialize dates for client component
  const serializedNotes = notes.map((note) => ({
    ...note,
    createdAt: note.createdAt.toISOString(),
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Notes</h1>
        <p className="text-muted-foreground">
          Your discussion summaries and insights
        </p>
      </div>
      <Suspense fallback={<NoteListSkeleton />}>
        <NoteList notes={serializedNotes} />
      </Suspense>
    </div>
  );
}
