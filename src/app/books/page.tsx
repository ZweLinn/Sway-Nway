import { prisma } from '@/lib/prisma';
import BookList from '@/components/books/book-list';

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Books</h1>
        <p className="text-muted-foreground">
          Select a book to start a discussion
        </p>
      </div>
      <BookList books={books} />
    </div>
  );
}
