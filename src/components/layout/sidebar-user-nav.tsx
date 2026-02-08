"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SidebarUserNav() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const { name, email, image } = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="h-auto py-2 cursor-pointer">
          <Avatar className="h-7 w-7">
            <AvatarImage src={image || undefined} alt={name || "User"} />
            <AvatarFallback className="text-xs">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left leading-tight">
            <span className="text-sm font-medium truncate max-w-[140px] flex items-center gap-1.5">
              {name}
              {session.user.role === "ADMIN" && (
                <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                  Admin
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[140px]">
              {email}
            </span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
