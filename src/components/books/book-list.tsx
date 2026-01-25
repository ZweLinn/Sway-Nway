'use client';

import { useState } from 'react';
import BookCard from './book-card';
import StartDiscussionModal from './start-discussion-modal';

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string | null;
  summary: string;
  keyThemes: string[];
}

interface BookListProps {
  books: Book[];
}

export default function BookList({ books }: BookListProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No books available yet. Add books from the Settings page.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>

      <StartDiscussionModal
        book={selectedBook}
        open={!!selectedBook}
        onOpenChange={(open) => !open && setSelectedBook(null)}
      />
    </>
  );
}
