'use client';

import { useSearchParams } from 'next/navigation';
import NoteCard from './note-card';

interface Note {
  id: string;
  title: string | null;
  content: string;
  knowledgeAssessment: string | null;
  perspectiveInsights: string | null;
  keyTakeaways: string[];
  createdAt: string;
  discussion: {
    book: {
      id: string;
      title: string;
      author: string;
      coverImage: string | null;
    };
  };
}

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No notes yet. Complete a book discussion to create your first note.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          highlighted={note.id === highlightId}
        />
      ))}
    </div>
  );
}
