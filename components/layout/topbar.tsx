"use client";

import { ChevronDown, LogOut, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { supabase } from "@/lib/browserClient";

type TopbarProps = {
  title: string;
  onMenuToggle?: () => void;
};

export default function Topbar({ title, onMenuToggle }: TopbarProps) {
  const { profile } = useProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Signout failed:", error);
    window.location.href = "/login";
  }

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="z-40 flex h-16 w-full shrink-0 items-center justify-between bg-brand from-primary to-secondary px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            aria-label="Menu openen"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white xl:hidden"
          >
            <Menu strokeWidth={1.75} className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-base font-semibold tracking-tight text-white">{title}</h1>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((p) => !p)}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          className="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-white/15"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold text-white ring-1 ring-white/30">
            {initials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-tight text-white">{profile.name}</span>
            {profile.email && (
              <span className="block max-w-40 truncate text-xs leading-tight text-white/70">
                {profile.email}
              </span>
            )}
          </span>
          <ChevronDown
            strokeWidth={1.75}
            className={`h-4 w-4 text-white/70 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-[999] mt-2 w-60 overflow-hidden rounded-xl border border-line bg-white shadow-lg"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{profile.name}</p>
                {profile.email && <p className="truncate text-xs text-muted">{profile.email}</p>}
              </div>
            </div>
            <div className="p-1.5">
              <button
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger transition-colors hover:bg-danger/10"
              >
                <LogOut strokeWidth={1.75} className="h-4 w-4 shrink-0" />
                Uitloggen
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}