"use client";

import VehicleCard from "@/components/ui/cards/vehicleCard";
import { useProjectVehicles } from "@/hooks/projectHooks/projectHooks";
import { ProjectVehicle } from "@/services/projectServices/projectService";
import { Truck } from "lucide-react";
import { useMemo } from "react";

export default function ProjectVehicleCard({ projectId }: { projectId: string }) {
  const { data: rows = [], isPending, error } = useProjectVehicles(projectId);

  // group the day rows per vehicle
  const vehicles = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string; plate: string | null; days: string[]; crew: Map<string, string> }
    >();

    for (const row of rows) {
      const key = row.vehicle_id ?? row.vehicle_name;
      const group = map.get(key) ?? {
        id: key,
        name: row.vehicle_name,
        plate: row.license_plate,
        days: [],
        crew: new Map<string, string>(),
      };
      group.days.push(row.work_date);
      row.employees.forEach((e) => group.crew.set(e.id, e.name));
      map.set(key, group);
    }

    return [...map.values()].map((g) => ({ ...g, days: g.days.sort() }));
  }, [rows]);

  const groups = useMemo(() => {
    const map = new Map<string, ProjectVehicle[]>();
    for (const row of rows) {
      const key = row.vehicle_id ?? row.vehicle_name;
      map.set(key, [...(map.get(key) ?? []), row]);
    }
    return [...map.entries()];
  }, [rows]);

  <ul className="divide-y divide-line">
    {groups.map(([key, vehicleRows]) => (
      <VehicleCard key={key} rows={vehicleRows} />
    ))}
  </ul>;

  const totalDays = rows.length;

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      {/* header */}
      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Truck strokeWidth={1.75} className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-ink">Voertuigen</h2>
            <p className="text-xs text-muted tabular-nums">
              {vehicles.length} {vehicles.length === 1 ? "voertuig" : "voertuigen"} · {totalDays}{" "}
              {totalDays === 1 ? "inzetdag" : "inzetdagen"}
            </p>
          </div>
        </div>
      </header>

      {/* content */}
      {isPending ? (
        <div className="space-y-2 p-5">
          {[0, 1].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-surface" />
          ))}
        </div>
      ) : error ? (
        <p className="px-5 py-6 text-sm text-danger">Voertuigen konden niet worden geladen.</p>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <Truck className="h-5 w-5 text-muted" aria-hidden="true" />
          <p className="text-sm font-medium text-ink">Geen voertuigen ingepland</p>
          <p className="text-sm text-muted">Voor dit project zijn nog geen voertuigen gekoppeld.</p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {groups.map(([key, vehicleRows]) => (
            <VehicleCard key={key} rows={vehicleRows} />
          ))}
        </ul>
      )}
    </section>
  );
}
