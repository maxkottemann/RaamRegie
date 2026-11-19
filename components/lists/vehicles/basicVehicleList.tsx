import { formatAddress, formatNumber2Decimals } from "@/lib/format";
import { calculateSavingsPCT } from "@/lib/sustainability/co2";
import { VehicleBasic, VehicleBasics } from "@/services/staff/vehicleService";
import { MapPin, Pencil, Trash2, Truck, Leaf } from "lucide-react";

interface VehicleListProps {
  vehicles: VehicleBasics;
  onEdit: (vehicle: VehicleBasic) => void;
  onDelete: (vehicle: VehicleBasic) => void;
}

export default function VehicleList({ vehicles, onEdit, onDelete }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-white px-5 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-muted">
          <Truck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">Nog geen voertuigen</p>
          <p className="mt-0.5 text-sm text-muted">
            Voeg een voertuig toe om het te kunnen inplannen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
      {vehicles.map((vehicle) => {
        const address = formatAddress({
          city: vehicle.city,
          postal_code: vehicle.postal_code,
          street: vehicle.street,
          number: vehicle.number,
        });

        const hasCo2 = vehicle.co2 != null && vehicle.co2_old != null;
        const co2Saved = hasCo2
          ? calculateSavingsPCT(vehicle.co2 ?? 0, vehicle.co2_old ?? 0)
          : null;
        const co2SavedLabel = formatNumber2Decimals(co2Saved ?? 0);

        return (
          <li
            key={vehicle.id}
            className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface/60 sm:px-5"
          >
            {/* Icon */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Truck strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
            </span>

            {/* Main */}
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-sm font-semibold text-ink">{vehicle.name}</p>
                {vehicle.license_plate && (
                  <>
                    <span className="text-muted/40" aria-hidden="true">
                      •
                    </span>
                    <span className="shrink-0 text-xs font-semibold tracking-wider text-ink-soft uppercase tabular-nums">
                      {vehicle.license_plate}
                    </span>
                  </>
                )}
              </div>

              {address && (
                <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{address}</span>
                </p>
              )}
            </div>

            {/* CO2 */}
            {co2Saved != null && co2Saved > 0 && (
              <span
                className="hidden shrink-0 items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success-ink sm:inline-flex"
                title="CO₂-besparing t.o.v. oude situatie"
              >
                <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                {co2SavedLabel}% CO₂
              </span>
            )}

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(vehicle)}
                aria-label={`${vehicle.name} bewerken`}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(vehicle)}
                aria-label={`${vehicle.name} verwijderen`}
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
