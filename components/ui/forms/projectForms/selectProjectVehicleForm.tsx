import { useActiveVehiclesWithEmployees } from "@/hooks/staff/vehicleHooks";
import { ProjectFormInput } from "@/zodSchemas/projectSchema";
import { eachDayOfInterval, format, isToday, isWeekend, parseISO } from "date-fns";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import FormSection from "../formsection";
import { CalendarDays, Check, Copy, Eraser, Truck, Users, X } from "lucide-react";
import { nl } from "date-fns/locale";
import { useEffect, useState } from "react";
import LoadingState from "@/components/states/loadingState";
import ErrorState from "@/components/states/ErrorState";

export default function SelectProjectVehicleForm() {
  const {
    register,
    control,
    getValues,
    formState: { errors },
  } = useFormContext<ProjectFormInput>();
  const { fields, append, remove, update, replace } = useFieldArray({ control, name: "vehicles" });
  const [days, setDays] = useState<string[]>([]);
  const values = useWatch({ control });
  const startDate = values.start_date;
  const endDate = values.end_date;

  useEffect(() => {
    if (!startDate || !endDate) return;
    const days = eachDayOfInterval({ start: startDate, end: endDate }).map((d) =>
      format(d, "yyyy-MM-dd"),
    );
    setDays(days);
  }, [startDate, endDate]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!startDate || !endDate || !days) return;
    setSelectedDate(days[0]);
  }, [startDate, endDate]);

  const { data: vehicles, isPending, error } = useActiveVehiclesWithEmployees();

  if (isPending) return <LoadingState />;
  if (error || !vehicles) return <ErrorState />;

  const vehiclesOnDay = (date: string) => fields.filter((p) => p.date === date);
  const isOnDay = (date: string, vehicleId: string) =>
    fields.some((f) => f.date === date && f.vehicle_id === vehicleId);

  async function toggleVehicleOnDay(date: string, vehicleId: string) {
    const index = fields.findIndex((f) => f.date === date && f.vehicle_id === vehicleId);

    if (index >= 0) {
      remove(index);
    } else {
      const vehicle = vehicles?.find((v) => v.id === vehicleId);
      append({
        vehicle_id: vehicleId,
        date,
        employee_ids: vehicle?.employees?.map((e) => e.id) ?? [],
      });
    }
  }

  function removeVanDay(date: string) {
    setDays((prev) => prev.filter((d) => d !== date));
  }

  function clearVansFromDay(date: string) {
    replace(getValues("vehicles").filter((v) => v.date !== date));
  }

  function copyToAllDays(fromDate: string) {
    const current = getValues("vehicles");
    const template = current.filter((v) => v.date === fromDate);

    const next = days.flatMap((date) =>
      date === fromDate
        ? template
        : template.map((t) => ({ ...t, date, employee_ids: [...t.employee_ids] })),
    );

    replace(next);
  }
  return (
    <div className="space-y-6">
      <FormSection
        title="Voertuigen selecteren"
        icon={Truck}
        description="Kies een dag en selecteer de voertuigen"
      >
        {days.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-line px-4 py-6 text-sm text-muted">
            <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
            Kies eerst een start- en einddatum om voertuigen in te plannen.
          </div>
        ) : (
          <div className="space-y-4">
            {/* day pills */}
            <div
              className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
              role="tablist"
              aria-label="Projectdagen"
            >
              {days.map((date) => {
                const d = parseISO(date);
                const selected = date === selectedDate;
                const count = vehiclesOnDay(date).length;

                return (
                  <div key={date} className="group relative shrink-0 pt-1.5 pr-1.5">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setSelectedDate(date)}
                      className={`flex w-12 cursor-pointer flex-col items-center rounded-md border py-1.5 leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary ${
                        selected
                          ? "border-primary bg-primary text-white"
                          : isWeekend(d)
                            ? "border-line bg-surface/60 text-muted hover:border-primary/40"
                            : "border-line bg-white text-ink-soft hover:border-primary/40 hover:text-ink"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-medium uppercase ${selected ? "text-white/80" : "text-muted"}`}
                      >
                        {format(d, "EEEEEE", { locale: nl })}
                      </span>
                      <span className="mt-1 text-sm font-semibold tabular-nums">
                        {format(d, "d")}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`mt-1 h-1 w-1 rounded-full ${
                          count > 0 ? (selected ? "bg-white" : "bg-primary") : "bg-transparent"
                        }`}
                      />
                      {count > 0 && <span className="sr-only">{count} voertuigen</span>}
                    </button>

                    {/* clear day */}
                    <button
                      type="button"
                      onClick={() => removeVanDay(date)}
                      aria-label={`Voertuigen op ${format(d, "d MMMM", { locale: nl })} verwijderen`}
                      className={`absolute top-0 right-0 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-line bg-white text-muted shadow-card transition-all hover:border-danger/40 hover:bg-danger hover:text-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-danger ${
                        selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <X strokeWidth={3} className="h-2.5 w-2.5" aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* vehicle list for the selected day */}
            {selectedDate && (
              <div className="overflow-hidden rounded-lg border border-line">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface/50 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink capitalize">
                      {format(parseISO(selectedDate), "EEEE d MMMM", { locale: nl })}
                    </p>
                    <p className="text-xs text-muted tabular-nums">
                      {vehiclesOnDay(selectedDate).length} ingepland
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => copyToAllDays(selectedDate)}
                      type="button"
                      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-line bg-white px-2.5 text-xs font-medium text-ink-soft transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      Kopieer naar alle dagen
                    </button>

                    <button
                      onClick={() => clearVansFromDay(selectedDate)}
                      type="button"
                      className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-danger disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
                      Dag legen
                    </button>
                  </div>
                </div>

                {vehicles?.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-muted">Nog geen voertuigen in de vloot.</p>
                ) : (
                  <ul className="divide-y divide-line">
                    {vehicles?.map((vehicle) => {
                      const active = isOnDay(selectedDate, vehicle.id);
                      const crew = active
                        ? (vehiclesOnDay(selectedDate).find((p) => p.vehicle_id === vehicle.id)
                            ?.employee_ids.length ?? 0)
                        : (vehicle.employees?.length ?? 0);

                      return (
                        <li key={vehicle.id}>
                          <button
                            type="button"
                            onClick={() => toggleVehicleOnDay(selectedDate, vehicle.id)}
                            aria-pressed={active}
                            className={`group flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors focus-visible:outline-none ${
                              active
                                ? "bg-primary-soft/50"
                                : "hover:bg-surface/60 focus-visible:bg-surface/60"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                active
                                  ? "border-primary bg-primary text-white"
                                  : "border-line bg-white group-hover:border-primary/60"
                              }`}
                            >
                              {active && <Check strokeWidth={3} className="h-3 w-3" />}
                            </span>

                            <Truck
                              strokeWidth={1.75}
                              aria-hidden="true"
                              className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted"}`}
                            />

                            <span className="min-w-0 flex-1">
                              <span
                                className={`block truncate text-sm ${active ? "font-semibold text-ink" : "font-medium text-ink-soft"}`}
                              >
                                {vehicle.name}
                              </span>
                              {vehicle.license_plate && (
                                <span className="block text-[11px] font-medium tracking-wider text-muted uppercase">
                                  {vehicle.license_plate}
                                </span>
                              )}
                            </span>

                            <span className="flex shrink-0 items-center gap-1 text-xs text-muted tabular-nums">
                              <Users className="h-3.5 w-3.5" aria-hidden="true" />
                              {crew}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </FormSection>
    </div>
  );
}
