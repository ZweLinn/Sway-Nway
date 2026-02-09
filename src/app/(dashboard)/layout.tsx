import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBar from "@/components/layout/side-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SideBar />
      <SidebarTrigger className="p-5" />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
