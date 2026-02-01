'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from 'lucide-react';

interface StartDiscussionModalProps {
  book: {
    id: string;
    title: string;
    author: string;
    coverImage: string | null;
    summary: string;
    keyThemes: string[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StartDiscussionModal({
  book,
  open,
  onOpenChange,
}: StartDiscussionModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDiscussion = async () => {
    if (!book) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/books/${book.id}/discussions`, {
        method: 'POST',
      });

      if (res.ok) {
        const discussion = await res.json();
        router.push(`/books/${book.id}/discussion/${discussion.id}`);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to start discussion:', error);
      setIsLoading(false);
    }
  };

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Start Discussion</DialogTitle>
          <DialogDescription>
            Begin an AI-guided discussion about this book
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 py-4">
          <div className="w-24 h-32 bg-muted rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <Book className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
            {book.keyThemes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {book.keyThemes.slice(0, 3).map((theme) => (
                  <Badge key={theme} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartDiscussion} disabled={isLoading}>
            {isLoading ? 'Starting...' : 'Start Discussion'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
