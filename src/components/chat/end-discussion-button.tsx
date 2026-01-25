'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Square } from 'lucide-react';

interface EndDiscussionButtonProps {
  discussionId: string;
}

export default function EndDiscussionButton({
  discussionId,
}: EndDiscussionButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEndDiscussion = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/discussions/${discussionId}/end`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/notes?highlight=${data.noteId}`);
      }
    } catch (error) {
      console.error('Failed to end discussion:', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Square className="h-4 w-4 mr-2" />
          End Discussion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Discussion?</DialogTitle>
          <DialogDescription>
            This will analyze your discussion and save a summary to your notes.
            You won&apos;t be able to continue this discussion after ending it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEndDiscussion} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'End & Save Notes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
