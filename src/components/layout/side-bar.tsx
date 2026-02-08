import { Home, NotebookText, Book, Settings , UserStar } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import SidebarUserNav from "@/components/layout/sidebar-user-nav"
import { getCurrentUser } from "@/lib/auth"

const baseItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Books",
    url: "/books",
    icon: Book,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: NotebookText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  }
]

const settingsItem = {
  title: "Admin",
  url: "/admin/settings",
  icon: UserStar,
}

export default async function SideBar() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"
  const items = isAdmin ? [...baseItems, settingsItem] : baseItems

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">
            <h1 className="font-bold text-lg">Sway Nway</h1>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarUserNav />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
