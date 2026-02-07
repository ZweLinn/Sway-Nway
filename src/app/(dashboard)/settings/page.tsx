import { prisma } from '@/lib/prisma';
import BookManagement from '@/components/settings/book-management';

export default async function SettingsPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your books and app settings
        </p>
      </div>
      <BookManagement initialBooks={books} />
    </div>
  );
}
