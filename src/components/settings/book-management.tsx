'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Book } from 'lucide-react';
import BookForm from './book-form';

interface BookData {
  id: string;
  title: string;
  author: string;
  coverImage: string | null;
  summary: string;
  keyThemes: string[];
}

interface BookManagementProps {
  initialBooks: BookData[];
}

export default function BookManagement({ initialBooks }: BookManagementProps) {
  const [books, setBooks] = useState<BookData[]>(initialBooks);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookData | null>(null);

  const handleAddBook = async (data: Omit<BookData, 'id'>) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const newBook = await res.json();
        setBooks([newBook, ...books]);
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const handleUpdateBook = async (data: Omit<BookData, 'id'>) => {
    if (!editingBook) return;

    try {
      const res = await fetch(`/api/books/${editingBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const updatedBook = await res.json();
        setBooks(books.map((b) => (b.id === editingBook.id ? updatedBook : b)));
        setEditingBook(null);
      }
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book? All associated discussions will also be deleted.')) {
      return;
    }

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBooks(books.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Book Library</CardTitle>
            <CardDescription>
              Add and manage books for discussions
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
              </DialogHeader>
              <BookForm onSubmit={handleAddBook} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {books.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No books added yet. Click "Add Book" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="w-12 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <Book className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={editingBook?.id === book.id}
                    onOpenChange={(open) => !open && setEditingBook(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingBook(book)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                      </DialogHeader>
                      <BookForm
                        initialData={editingBook || undefined}
                        onSubmit={handleUpdateBook}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
