import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import SidebarUserNav from "@/components/layout/sidebar-user-nav"
import { getCurrentUser } from "@/lib/auth"
import { SidebarNavItems } from "./sidebar-nav-items"

export default async function SideBar() {
  const user = await getCurrentUser()
  const isAdmin = user?.role === "ADMIN"

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3">
            <h1 className="font-bold text-lg">Sway Nway</h1>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            {/* We only pass the boolean 'isAdmin' which is a plain value */}
            <SidebarNavItems isAdmin={isAdmin} />
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