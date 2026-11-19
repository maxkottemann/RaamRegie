"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  Settings,
  Truck,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  isAdmin: boolean;
  isCompany: boolean;
};

const menuItems: { label: string; items: MenuItem[] }[] = [
  {
    label: "Gebruikers",
    items: [
      {
        label: "Mijn account",
        href: "/settings/account",
        icon: User,
        isAdmin: false,
        isCompany: false,
      },
      { label: "Team", href: "/settings/team", icon: Users, isAdmin: false, isCompany: true },
    ],
  },
  {
    label: "Voertuigen & medewerkers",
    items: [
      {
        label: "Medewerkers",
        href: "/settings/staff",
        icon: UserCheck,
        isAdmin: false,
        isCompany: true,
      },
      {
        label: "Vloot",
        href: "/settings/fleet",
        icon: Truck,
        isAdmin: false,
        isCompany: true,
      },
    ],
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isVisible = (item: MenuItem) =>
    (!item.isAdmin && !item.isCompany) || (item.isCompany && profile?.role === "company_admin");

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const activeItem = menuItems.flatMap((g) => g.items).find((item) => isActive(item.href));

  function renderMenu(onNavigate?: () => void) {
    return menuItems.map((group) => {
      const visible = group.items.filter(isVisible);
      if (visible.length === 0) return null;

      return (
        <div key={group.label}>
          <p className="mb-1.5 px-3 text-[11px] font-medium tracking-wider text-muted/70 uppercase">
            {group.label}
          </p>

          <ul className="flex flex-col gap-0.5">
            {visible.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-ink-soft hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-primary"
                      />
                    )}
                    <Icon
                      strokeWidth={1.75}
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-primary" : "text-muted group-hover:text-ink-soft"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
  }

  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
      {/* Mobile: collapsible */}
      <div className="xl:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((p) => !p)}
          aria-expanded={mobileMenuOpen}
          aria-controls="settings-menu-mobile"
          className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3 transition-colors hover:border-primary/40"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
              {activeItem ? (
                <activeItem.icon strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Settings strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[11px] text-muted">Instellingen</span>
              <span className="block truncate text-sm font-semibold text-ink">
                {activeItem?.label ?? "Kies een onderdeel"}
              </span>
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
              mobileMenuOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {mobileMenuOpen && (
          <nav
            id="settings-menu-mobile"
            aria-label="Instellingen"
            className="mt-2 flex flex-col gap-4 rounded-xl border border-line bg-white p-2 shadow-float"
          >
            {renderMenu(() => setMobileMenuOpen(false))}
          </nav>
        )}
      </div>

      {/* Desktop: sidebar */}
      <aside className="hidden w-60 shrink-0 xl:sticky xl:top-6 xl:block">
        <nav
          aria-label="Instellingen"
          className="overflow-hidden rounded-xl border border-line bg-white"
        >
          <div className="flex items-center gap-2.5 border-b border-line px-4 py-3.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Settings strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Instellingen</p>
              <p className="truncate text-xs text-muted">Account en organisatie</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-2 pt-3">{renderMenu()}</div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
