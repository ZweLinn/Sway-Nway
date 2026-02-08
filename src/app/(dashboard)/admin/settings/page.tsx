import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import BookManagement from '@/components/settings/book-management';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/books');
  }

  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage books and application settings.
        </p>
      </div>
      <BookManagement initialBooks={books} />
    </div>
  );
}
