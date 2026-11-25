"use client";

import { useProjectCo2Data } from "@/hooks/projectHooks/projectHooks";
import { formatNumber2Decimals } from "@/lib/format";
import { calculateSavingsPCT } from "@/lib/sustainability/co2";
import { Leaf, Route } from "lucide-react";

// CO₂ values per km in grams → show in kg

export default function ProjectCo2ImpactCard({ projectId }: { projectId: string }) {
  const { data: co2, isPending, error } = useProjectCo2Data(projectId);

  const distance = Number(co2?.total_distance ?? 0);
  const now = Number(co2?.co2 ?? 0);
  const old = Number(co2?.co2_old ?? 0);
  const saved = Math.max(0, old - now);
  const pct = old > 0 ? calculateSavingsPCT(now, old) : 0;

  const max = Math.max(now, old, 1);

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      {/* header */}
      <header className="flex items-center gap-3 border-b border-line px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-soft text-success-ink">
          <Leaf strokeWidth={1.75} className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-ink">CO₂-impact</h2>
          <p className="text-xs text-muted">Transport voor dit project</p>
        </div>
      </header>

      {isPending ? (
        <div className="space-y-3 p-5">
          <div className="h-10 w-32 animate-pulse rounded-md bg-surface" />
          <div className="h-2 animate-pulse rounded-full bg-surface" />
          <div className="h-2 animate-pulse rounded-full bg-surface" />
        </div>
      ) : error ? (
        <p className="px-5 py-6 text-sm text-danger">CO₂-gegevens konden niet worden geladen.</p>
      ) : distance === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-8 text-center">
          <Route className="h-5 w-5 text-muted" aria-hidden="true" />
          <p className="text-sm font-medium text-ink">Nog geen ritten</p>
          <p className="text-sm text-muted">
            De CO₂-impact verschijnt zodra er afstanden zijn geregistreerd.
          </p>
        </div>
      ) : (
        <div className="space-y-5 p-5">
          {/* headline */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted">Bespaard</p>
              <p className="mt-0.5 text-3xl font-semibold tracking-tight text-ink tabular-nums">
                {formatNumber2Decimals(saved)}
                <span className="ml-1 text-base font-medium text-muted">kg CO₂</span>
              </p>
            </div>
            {pct > 0 && (
              <span className="mb-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success-ink tabular-nums">
                −{pct.toLocaleString("nl-NL", { maximumFractionDigits: 0 })}%
              </span>
            )}
          </div>

          {/* comparison */}
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 flex items-baseline justify-between text-xs">
                <span className="font-medium text-ink-soft">Dit project</span>
                <span className="font-semibold text-ink tabular-nums">
                  {formatNumber2Decimals(now)} kg
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${(now / max) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between text-xs">
                <span className="font-medium text-ink-soft">Traditioneel</span>
                <span className="font-semibold text-muted tabular-nums">
                  {formatNumber2Decimals(old)} kg
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-muted/40"
                  style={{ width: `${(old / max) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* footer */}
          <p className="flex items-center gap-1.5 border-t border-line pt-4 text-xs text-muted">
            <Route className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="tabular-nums">{distance.toLocaleString("nl-NL")} km</span> afgelegd
          </p>
        </div>
      )}
    </section>
  );
}
