"use client";

import type { ModuleKey } from "@/modules/types/types";
import { createContext, use, useMemo, type ReactNode } from "react";

type ModuleContextValue = {
  lockedModule: ModuleKey | null; // set on a branded domain
  companyModules: ModuleKey[]; // what the company has
  available: ModuleKey[]; // what may be shown here
  isSingle: boolean; // exactly one module → no pickers or tabs
};

interface ModuleProviderProps {
  lockedModule: ModuleKey | null;
  companyModules: ModuleKey[];
  children: ReactNode;
}

const ModuleContext = createContext<ModuleContextValue | null>(null);

export function ModuleProvider({ lockedModule, companyModules, children }: ModuleProviderProps) {
  const value = useMemo<ModuleContextValue>(() => {
    const available = lockedModule
      ? companyModules.includes(lockedModule)
        ? [lockedModule]
        : []
      : companyModules;

    return {
      lockedModule,
      companyModules,
      available,
      isSingle: available.length === 1,
    };
  }, [lockedModule, companyModules]);

  return <ModuleContext value={value}>{children}</ModuleContext>;
}

export function useModule() {
  const ctx = use(ModuleContext);
  if (!ctx) throw new Error("useModule must be used inside ModuleProvider");
  return ctx;
}
