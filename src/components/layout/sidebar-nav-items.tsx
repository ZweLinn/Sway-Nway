"use client"

import Link from "next/link"
import { useSidebar } from "@/components/ui/sidebar"
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar"
import { Home, NotebookText, Book, Settings, UserStar } from "lucide-react"

// Define the items inside the Client Component
const baseItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Books", url: "/books", icon: Book },
  { title: "Notes", url: "/notes", icon: NotebookText },
  { title: "Settings", url: "/settings", icon: Settings },
]

const adminItem = {
  title: "Admin",
  url: "/admin/settings",
  icon: UserStar,
}

export function SidebarNavItems({ isAdmin }: { isAdmin: boolean }) {
  const { setOpenMobile } = useSidebar()

  // Determine which items to show
  const items = isAdmin ? [...baseItems, adminItem] : baseItems

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link 
              href={item.url} 
              onClick={() => setOpenMobile(false)} // This closes the mobile sidebar
            >
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}