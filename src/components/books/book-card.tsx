'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book } from 'lucide-react';

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverImage: string | null;
  };
  onClick: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader>
        <div className="aspect-[3/4] relative bg-muted rounded-md flex items-center justify-center overflow-hidden mb-3">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="object-cover w-full h-full"
            />
          ) : (
            <Book className="h-16 w-16 text-muted-foreground" />
          )}
        </div>
        <CardTitle className="line-clamp-2 text-base text-sm sm:text-base">{book.title}</CardTitle>
      </CardHeader>
      <CardContent >
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardContent>
    </Card>
  );
}
