"use client";

import { calculateSavingsPCT } from "@/lib/sustainability/co2";
import { getModule } from "@/modules/registry";
import type { ModuleKey } from "@/modules/types/types";
import type { CleaningMethod, CleaningMethods } from "@/services/cleaningMethodsService";
import {
  Droplet,
  FlaskConical,
  Package,
  Pencil,
  Sparkles,
  Trash2,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface CleaningMethodListProps {
  cleaningMethods: CleaningMethods;
  onEdit: (method: CleaningMethod) => void;
  onDelete: (method: CleaningMethod) => void;
  module: ModuleKey;
}

const METRICS: {
  label: string;
  icon: LucideIcon;
  now: keyof CleaningMethod;
  old: keyof CleaningMethod;
}[] = [
  { label: "Water", icon: Droplet, now: "water_usage", old: "water_usage_old" },
  { label: "Afvalwater", icon: Waves, now: "waste_water", old: "waste_water_old" },
  { label: "Chemicaliën", icon: FlaskConical, now: "chemical_usage", old: "chemical_usage_old" },
  { label: "Elektriciteit", icon: Zap, now: "electricity", old: "electricity_old" },
  { label: "Verpakking", icon: Package, now: "packaging", old: "packaging_old" },
];

function savingsFor(method: CleaningMethod) {
  return METRICS.flatMap((m) => {
    const now = method[m.now] as number | null;
    const old = method[m.old] as number | null;
    if (now == null || old == null || old <= 0) return [];
    return [{ ...m, pct: calculateSavingsPCT(now, old) }];
  });
}

export default function CleaningMethodList({
  cleaningMethods,
  onEdit,
  onDelete,
  module,
}: CleaningMethodListProps) {
  const moduleLabel = getModule(module)?.label.toLowerCase() ?? "";

  if (cleaningMethods.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-white px-5 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-muted">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">Nog geen reinigingsmethodes</p>
          <p className="mt-0.5 text-sm text-muted">
            Voeg een methode toe om deze te kunnen kiezen bij het plannen van {moduleLabel}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
      {cleaningMethods.map((method) => {
        const savings = savingsFor(method);

        return (
          <li
            key={method.id}
            className="group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-surface/50 sm:px-5"
          >
            {/* Icon */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Sparkles strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
            </span>

            {/* Main */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{method.name}</p>
              {method.description ? (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">{method.description}</p>
              ) : (
                <p className="mt-0.5 text-xs text-muted/50">Geen omschrijving</p>
              )}

              {savings.length > 0 ? (
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {savings.map(({ label, icon: Icon, pct }) => (
                    <li
                      key={label}
                      title={`${label}: ${pct.toLocaleString("nl-NL", { maximumFractionDigits: 1 })}% minder dan traditioneel`}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${
                        pct > 0 ? "bg-success-soft text-success-ink" : "bg-surface text-muted"
                      }`}
                    >
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {label}
                      <span className="font-semibold">
                        {pct > 0 ? "−" : ""}
                        {pct.toLocaleString("nl-NL", { maximumFractionDigits: 0 })}%
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[11px] text-muted/60">Nog geen besparingsgegevens</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(method)}
                aria-label={`${method.name} bewerken`}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(method)}
                aria-label={`${method.name} verwijderen`}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-danger"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
