"use client";

import { initials } from "@/components/lists/vehicles/employeeList";
import type { ProjectVehicle } from "@/services/projectServices/projectService";
import { format, parseISO } from "date-fns";
import { nl } from "date-fns/locale";
import { ChevronDown, Truck, Users } from "lucide-react";
import { useMemo, useState } from "react";

export default function VehicleCard({ rows }: { rows: ProjectVehicle[] }) {
  const [open, setOpen] = useState(false);

  const first = rows[0];

  // days sorted, and the unique crew across all days
  const days = useMemo(
    () => [...rows].sort((a, b) => a.work_date.localeCompare(b.work_date)),
    [rows],
  );
  const crew = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) => r.employees.forEach((e) => map.set(e.id, e.name)));
    return [...map.values()];
  }, [rows]);

  if (!first) return null;

  const firstDay = parseISO(days[0].work_date);
  const lastDay = parseISO(days[days.length - 1].work_date);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`group flex w-full cursor-pointer items-center gap-3 px-5 py-4 text-left transition-colors focus-visible:outline-none ${
          open ? "bg-surface/40" : "hover:bg-surface/40 focus-visible:bg-surface/40"
        }`}
      >
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
            open ? "bg-primary text-white" : "bg-primary-soft text-primary"
          }`}
        >
          <Truck strokeWidth={1.75} className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold text-ink group-hover:text-primary">
              {first.vehicle_name}
            </p>
            {first.license_plate && (
              <span className="shrink-0 rounded-md bg-surface px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-ink-soft uppercase">
                {first.license_plate}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted tabular-nums">
            {days.length} {days.length === 1 ? "dag" : "dagen"} ·{" "}
            {format(firstDay, "d MMM", { locale: nl }).replace(".", "")}
            {days.length > 1 && <> – {format(lastDay, "d MMM", { locale: nl }).replace(".", "")}</>}
          </p>
        </div>

        {/* crew avatars */}
        {crew.length > 0 && (
          <div className="hidden shrink-0 items-center sm:flex">
            <div className="flex -space-x-2">
              {crew.slice(0, 4).map((name) => (
                <span
                  key={name}
                  title={name}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold text-primary ring-2 ring-white"
                >
                  {initials(name)}
                </span>
              ))}
            </div>
            {crew.length > 4 && (
              <span className="ml-1.5 text-xs text-muted tabular-nums">+{crew.length - 4}</span>
            )}
          </div>
        )}

        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-hover:text-ink-soft ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* per-day details */}
      {open && (
        <div className="border-t border-line bg-surface/20 px-5 py-3">
          <ul className="space-y-1.5">
            {days.map((day) => {
              const d = parseISO(day.work_date);
              return (
                <li
                  key={day.work_date}
                  className="flex items-start gap-3 rounded-md bg-white px-3 py-2 ring-1 ring-line"
                >
                  <div className="w-20 shrink-0">
                    <p className="text-xs font-semibold text-ink capitalize">
                      {format(d, "EEEE", { locale: nl })}
                    </p>
                    <p className="text-[11px] text-muted tabular-nums">
                      {format(d, "d MMM yyyy", { locale: nl })}
                    </p>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 pt-0.5">
                    {day.employees.length === 0 ? (
                      <span className="text-xs text-muted/60">Geen medewerkers</span>
                    ) : (
                      day.employees.map((e) => (
                        <span
                          key={e.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-surface py-0.5 pr-2 pl-0.5 text-xs text-ink-soft"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-soft text-[9px] font-semibold text-primary">
                            {initials(e.name)}
                          </span>
                          {e.name}
                        </span>
                      ))
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {crew.length > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {crew.length} {crew.length === 1 ? "medewerker" : "medewerkers"} in totaal
            </p>
          )}
        </div>
      )}
    </li>
  );
}
