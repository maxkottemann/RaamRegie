"use client";

import { useState } from "react";
import { ToastProvider, useToast } from "@/context/ToastContext";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { usePathname } from "next/navigation";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
import { ThemeProvider } from "@/context/ThemeProviderContext";
import Toast from "@/components/ui/toast";
import { QueryProvider } from "@/context/QueryProvider";

function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast, hideToast } = useToast();
  const { profile } = useProfile();
  const pathname = usePathname();

  const titles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/client": "Klanten",
    "/projects": "Projecten",
    "/locations": "Locaties",
    "/settings": "Instellingen",
    "/qualitychecks": "Steekproeven",
    "/questioncenter": "Vragencentrum",
    "/status": "Livestatus",
    "/floorpassport": "Vloerpaspoort",
    "/requests": "Onderhoudsaanvragen",
    "/users": "Gebruikers",
    "/rapports": "Rapportages",
    "/floorscans": "Vloerscans",
    "/sustainability": "Duurzaamheid",
    "/analysis": "Analysecentrum",
  };

  const title =
    Object.entries(titles).find(([route]) => pathname.startsWith(route))?.[1] ??
    "";

  return (
    <div className="min-h-screen flex bg-[#f5f5f5]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Topbar title={title} onMenuToggle={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-auto bg-surface p-3 xl:py-6 xl:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
    <ToastProvider>
      <ProfileProvider>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </ProfileProvider>
    </ToastProvider>
    </QueryProvider>
  );
}
