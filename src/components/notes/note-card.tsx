'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Book, ChevronDown, ChevronUp, Lightbulb, Brain, BookOpen } from 'lucide-react';

interface NoteCardProps {
  note: {
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
  };
  highlighted?: boolean;
}

export default function NoteCard({ note, highlighted = false }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(highlighted);

  useEffect(() => {
    if (highlighted) {
      setIsExpanded(true);
      // Scroll to the highlighted card
      const element = document.getElementById(`note-${note.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlighted, note.id]);

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card
      id={`note-${note.id}`}
      className={`transition-all ${highlighted ? 'ring-2 ring-primary' : ''}`}
    >
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-16 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
            {note.discussion.book.coverImage ? (
              <img
                src={note.discussion.book.coverImage}
                alt={note.discussion.book.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <Book className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">
              {note.title || 'Discussion Notes'}
            </CardTitle>
            <CardDescription className="mt-1">
              {note.discussion.book.title} by {note.discussion.book.author}
            </CardDescription>
            <p className="text-xs text-muted-foreground mt-2">{formattedDate}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Summary */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Summary</h4>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {note.content}
            </p>
          </div>

          <Separator />

          {/* Knowledge Assessment */}
          {note.knowledgeAssessment && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Knowledge Assessment</h4>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {note.knowledgeAssessment}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Perspective Insights */}
          {note.perspectiveInsights && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Your Insights</h4>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {note.perspectiveInsights}
                </p>
              </div>
              <Separator />
            </>
          )}

          {/* Key Takeaways */}
          {note.keyTakeaways.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Key Takeaways</h4>
              <div className="flex flex-wrap gap-2">
                {note.keyTakeaways.map((takeaway, index) => (
                  <span key={index}  className="text-[12px] text-muted-foreground whitespace-pre-wrap">
                    {takeaway}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
