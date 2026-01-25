'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BookFormData {
  title: string;
  author: string;
  coverImage: string | null;
  summary: string;
  keyThemes: string[];
}

interface BookFormProps {
  initialData?: BookFormData;
  onSubmit: (data: BookFormData) => void;
}

export default function BookForm({ initialData, onSubmit }: BookFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [keyThemes, setKeyThemes] = useState(
    initialData?.keyThemes.join(', ') || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        author,
        coverImage: coverImage || null,
        summary,
        keyThemes: keyThemes
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter book title"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="author" className="text-sm font-medium">
          Author <span className="text-red-500">*</span>
        </label>
        <Input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="coverImage" className="text-sm font-medium">
          Cover Image URL
        </label>
        <Input
          id="coverImage"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/cover.jpg"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="summary" className="text-sm font-medium">
          Summary <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter a detailed summary of the book (this helps the AI understand the book for discussions)"
          className='max-h-32'
          rows={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          Provide a comprehensive summary including main plot, themes, and key ideas.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="keyThemes" className="text-sm font-medium">
          Key Themes
        </label>
        <Input
          id="keyThemes"
          value={keyThemes}
          onChange={(e) => setKeyThemes(e.target.value)}
          placeholder="Theme 1, Theme 2, Theme 3"
        />
        <p className="text-xs text-muted-foreground">
          Separate themes with commas
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : initialData
            ? 'Update Book'
            : 'Add Book'}
        </Button>
      </div>
    </form>
  );
}
