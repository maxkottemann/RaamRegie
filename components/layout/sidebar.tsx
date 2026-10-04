"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, House, Settings, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useCompany } from "@/hooks/companyHooks";
import { useProfile } from "@/context/ProfileContext";
import { supabase } from "@/lib/browserClient";
import type { Enums } from "@/types/database.types";

type Role = Enums<"role_type">;

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles?: Role[]; 
};

type NavSection = {
  label: string;
  links: NavLink[];
};

const SECTIONS: NavSection[] = [
  {
    label: "Overzicht",
    links: [{ href: "/dashboard", label: "Dashboard", icon: House }],
  }, {
    label: "Locaties",
    links: [{ href: "/locations", label: "Locations", icon: Building2 }],
  },
  {
    label: "Account",
    links: [{ href: "/settings", label: "Instellingen", icon: Settings }],
  },
];

const FALLBACK_LOGO = "/smalllogo.png";
const COMPANY_ROLES: Role[] = ["company_admin", "company_employee", "super_admin"];

interface SidebarProps {
  className?: string;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ className, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { profile } = useProfile();
  const { company } = useCompany();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolveLogo(): Promise<string> {
      if (COMPANY_ROLES.includes(profile.role)) {
        return company?.logo_url ?? FALLBACK_LOGO;
      }

      if (!profile.client_id) return FALLBACK_LOGO;

      const { data } = await supabase
        .from("company_clients")
        .select("companies(logo_url)")
        .eq("client_id", profile.client_id);

      const urls = [
        ...new Set(
          (data ?? [])
            .map((row) => row.companies?.logo_url)
            .filter((url): url is string => Boolean(url)),
        ),
      ];

      return urls.length === 1 ? urls[0] : FALLBACK_LOGO;
    }

    if (COMPANY_ROLES.includes(profile.role) && !company) return;

    resolveLogo()
      .catch(() => FALLBACK_LOGO)
      .then((url) => {
        if (!cancelled) setLogoUrl(url);
      });

    return () => {
      cancelled = true;
    };
  }, [profile, company]);

  const visibleSections = SECTIONS.map((section) => ({
    ...section,
    links: section.links.filter((l) => !l.roles || l.roles.includes(profile.role)),
  })).filter((section) => section.links.length > 0);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-200 bg-ink/30 xl:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="Hoofdmenu"
        className={`
          fixed top-0 left-0 z-200 flex h-dvh w-64 flex-col
          border-r border-line bg-white
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          xl:static xl:translate-x-0
          ${className ?? ""}
        `}
      >
        <div className="flex h-15 justify-center shrink-0 items-center px-6">
          {logoUrl && (
          <div className="h-12 flex items-center justify-center mt-3">
              <img
                src={logoUrl}
                alt="Logo"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>

        <div className="border-gray-100 mt-1 border"></div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-3 pt-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {visibleSections.map((section) => (
            <div key={section.label} className="mb-6">
              <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-muted/70">
                {section.label}
              </p>

              <ul className="space-y-0.5">
                {section.links.map(({ href, label, icon: Icon }) => {
                  const active = pathname.startsWith(href);

                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200
                          ${
                            active
                              ? "bg-primary-soft font-medium text-ink"
                              : "text-muted hover:bg-surface hover:text-ink"
                          }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-full bg-brand from-primary to-secondary transition-opacity duration-200
                            ${active ? "opacity-100" : "opacity-0"}`}
                        />
                        <Icon
                          strokeWidth={1.75}
                          className={`h-4.5 w-4.5 shrink-0 transition-colors duration-200
                            ${active ? "text-primary" : "text-muted/70 group-hover:text-ink"}`}
                        />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}