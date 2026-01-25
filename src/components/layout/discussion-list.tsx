'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Discussion {
  id: string;
  title: string | null;
  createdAt: string;
  _count: { messages: number };
}

export default function DiscussionList() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchDiscussions = async () => {
    try {
      const res = await fetch('/api/discussions');
      if (res.ok) {
        const data = await res.json();
        setDiscussions(data);
      }
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const createNewDiscussion = async () => {
    try {
      const res = await fetch('/api/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const discussion = await res.json();
        router.push(`/chat/${discussion.id}`);
        fetchDiscussions();
      }
    } catch (error) {
      console.error('Failed to create discussion:', error);
    }
  };

  const deleteDiscussion = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this discussion?')) return;

    try {
      const res = await fetch(`/api/discussions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchDiscussions();
        if (pathname === `/chat/${id}`) {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Failed to delete discussion:', error);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between pr-2">
        <span>Discussions</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={createNewDiscussion}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading ? (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : discussions.length === 0 ? (
            <div className="px-2 py-1 text-sm text-muted-foreground">
              No discussions yet
            </div>
          ) : (
            discussions.map((discussion) => (
              <SidebarMenuItem key={discussion.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === `/chat/${discussion.id}`}
                >
                  <Link
                    href={`/chat/${discussion.id}`}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {discussion.title || 'New Discussion'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={(e) => deleteDiscussion(discussion.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
