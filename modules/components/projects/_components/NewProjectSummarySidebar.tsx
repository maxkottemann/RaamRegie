"use client";

import Button from "@/components/ui/buttons/Button";
import { useLocationOptionsForPlanning } from "@/hooks/locationHooks";
import { formatDate } from "@/lib/format";
import type { ProjectFormInput } from "@/zodSchemas/projectSchema";
import { Check, Circle } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

interface Props {
  loading?: boolean;
}

export default function NewProjectSummarySideBar({ loading = false }: Props) {
  const { control } = useFormContext<ProjectFormInput>();
  const project = useWatch({ control });
  const { data: locations = [] } = useLocationOptionsForPlanning();

  const name = project.name?.trim();
  const location = locations.find((l) => l.id === project.location_id);
  const hasPeriod = !!project.start_date && !!project.end_date;
  const items = project.items ?? [];
  const vehicles = project.vehicles ?? [];

  const totalQuantity = items.reduce((sum, i) => sum + (Number(i?.planned_quantity) || 0), 0);
  const vehicleCount = new Set(vehicles.map((v) => v?.vehicle_id)).size;
  const employeeCount = new Set(vehicles.flatMap((v) => v?.employee_ids ?? [])).size;

  const steps = [
    {
      label: "Projectnaam",
      done: !!name,
      value: name,
      required: true,
    },
    {
      label: "Locatie",
      done: !!project.location_id,
      value: location ? `${location.name}${location.city ? ` · ${location.city}` : ""}` : undefined,
      required: true,
    },
    {
      label: "Periode",
      done: hasPeriod,
      value: hasPeriod
        ? `${formatDate(project.start_date!)} – ${formatDate(project.end_date!)}`
        : undefined,
      required: true,
    },
    {
      label: "Objecten",
      done: items.length > 0,
      value: items.length ? `${items.length} objecten · ${totalQuantity} stuks` : undefined,
      required: true,
    },
    {
      label: "Voertuigen",
      done: vehicles.length > 0,
      value: vehicles.length
        ? `${vehicleCount} ${vehicleCount === 1 ? "voertuig" : "voertuigen"} · ${employeeCount} medewerkers`
        : undefined,
      required: false,
    },
  ];

  const required = steps.filter((s) => s.required);
  const doneCount = required.filter((s) => s.done).length;
  const pct = Math.round((doneCount / required.length) * 100);
  const ready = doneCount === required.length;

  return (
    <div className="sticky top-6 flex flex-col gap-4">
      <aside className="overflow-hidden rounded-xl border border-line bg-white">
        {/* header + progress */}
        <div className="border-b border-line px-5 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Samenvatting</p>
            <p className="text-xs text-muted tabular-nums">
              {doneCount} / {required.length} stappen
            </p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full transition-all duration-300 ${ready ? "bg-success" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* steps */}
        <ol className="divide-y divide-line">
          {steps.map((step) => (
            <li key={step.label} className="flex items-start gap-3 px-5 py-3">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${
                  step.done ? "bg-success text-white" : "text-muted/40"
                }`}
              >
                {step.done ? (
                  <Check strokeWidth={3} className="h-3 w-3" />
                ) : (
                  <Circle strokeWidth={2} className="h-5 w-5" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className={`text-sm ${step.done ? "font-medium text-ink" : "text-ink-soft"}`}>
                  {step.label}
                  {!step.required && (
                    <span className="ml-1.5 text-xs font-normal text-muted">optioneel</span>
                  )}
                </p>
                <p
                  className={`mt-0.5 truncate text-xs ${step.done ? "text-muted" : "text-muted/60"}`}
                >
                  {step.value ??
                    (step.required ? "Nog niet ingevuld" : "Geen voertuigen ingepland")}
                </p>
              </div>

              <span className="sr-only">{step.done ? "Ingevuld" : "Nog niet ingevuld"}</span>
            </li>
          ))}
        </ol>
      </aside>

      <Button type="submit" form="project-form" icon={Check} loading={loading} className="w-full">
        Project aanmaken
      </Button>

      {!ready && (
        <p className="text-center text-xs text-muted">
          Vul de verplichte stappen in om het project aan te maken.
        </p>
      )}
    </div>
  );
}
