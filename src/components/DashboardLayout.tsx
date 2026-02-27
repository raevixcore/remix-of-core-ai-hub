import { ReactNode } from "react";
import { AppSidebar, SidebarProvider } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {!isMobile && <AppSidebar />}
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${isMobile ? "pb-20" : ""}`}>{children}</main>
        </div>
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
