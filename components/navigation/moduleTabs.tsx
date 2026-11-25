// components/navigation/ModuleTabs.tsx
import Link from "next/link";
import type { ModuleKey } from "@/modules/types/types";
import { getModule } from "@/modules/registry";

export default function ModuleTabs({
  modules,
  current,
}: {
  modules: ModuleKey[];
  current: ModuleKey;
}) {
  return (
    <nav aria-label="Module" className="flex gap-1 border-b border-line">
      {modules.map((key) => {
        const meta = getModule(key)!;
        const Icon = meta.icon;
        const active = key === current;

        return (
          <Link
            key={key}
            href={`?module=${key}`}
            aria-current={active ? "page" : undefined}
            className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:border-line hover:text-ink"
            }`}
          >
            <Icon strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
            {meta.label}
          </Link>
        );
      })}
    </nav>
  );
}
