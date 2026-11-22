"use client";

import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import Toast from "@/components/ui/toast";
import { ProfileProvider, useProfile } from "@/context/ProfileContext";
import { QueryProvider } from "@/context/QueryProvider";
import { ThemeProvider } from "@/context/ThemeProviderContext";
import { ToastProvider, useToast } from "@/context/ToastContext";
import { Brand } from "@/modules/brands";
import { usePathname } from "next/navigation";
import { useState } from "react";

function AppShell({ children, brand }: { children: React.ReactNode; brand: Brand }) {
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

  const title = Object.entries(titles).find(([route]) => pathname.startsWith(route))?.[1] ?? "";

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <Topbar title={title} onMenuToggle={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-auto bg-surface p-3 xl:px-6 xl:py-6">{children}</main>
      </div>
    </div>
  );
}

export default function AppClientShell({
  children,
  brand,
}: {
  children: React.ReactNode;
  brand: Brand;
}) {
  return (
    <QueryProvider>
      <ToastProvider>
        <ProfileProvider>
          <ThemeProvider>
            <AppShell brand={brand}>{children}</AppShell>
          </ThemeProvider>
        </ProfileProvider>
      </ToastProvider>
    </QueryProvider>
  );
}
