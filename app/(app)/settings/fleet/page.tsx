"use client";

import SettingsHeader from "@/components/headers/settingsHeader";
import BasicVehicleList from "@/components/lists/vehicles/basicVehicleList";
import Button from "@/components/ui/buttons/Button";
import SearchInput from "@/components/ui/inputs/SearchInput";
import { useVehicleBasics } from "@/hooks/staff/vehicleHooks";
import type { VehicleBasic } from "@/services/staff/vehicleService";
import { Plus, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import VehicleFormModal from "./_components/vehicleModal";
import DeleteVehicleModal from "./_components/DeleteVehicleModal";
import LoadingState from "@/components/states/loadingState";
import ErrorState from "@/components/states/ErrorState";

type VehicleDialog =
  | { type: "create" }
  | { type: "edit"; vehicle: VehicleBasic }
  | { type: "delete"; vehicle: VehicleBasic }
  | null;

const normalize = (s: string) => s.toLowerCase().replace(/[\s-]/g, "");

export default function SettingsFleetPage() {
  const { data: vehicles, isPending, error } = useVehicleBasics();

  const [dialog, setDialog] = useState<VehicleDialog>(null);
  const [search, setSearch] = useState("");

  const filteredVehicles = useMemo(() => {
    const list = vehicles ?? [];
    const q = normalize(search.trim());
    if (!q) return list;

    return list.filter((v) =>
      [v.name, v.license_plate, v.city, v.street]
        .filter((field): field is string => !!field)
        .some((field) => normalize(field).includes(q)),
    );
  }, [vehicles, search]);

  if (isPending) return <LoadingState />;
  if (error || !vehicles) return <ErrorState />;

  const close = () => setDialog(null);

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader
        icon={Truck}
        title="Vloot"
        description="Beheer uw voertuigen"
        actions={
          <Button size="sm" icon={Plus} onClick={() => setDialog({ type: "create" })}>
            Toevoegen
          </Button>
        }
      />

      {vehicles.length > 0 && (
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Zoek op naam, kenteken of plaats"
        />
      )}

      {vehicles.length > 0 && filteredVehicles.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          Geen voertuigen gevonden voor &quot;{search}&quot;.
        </p>
      ) : (
        <BasicVehicleList
          vehicles={filteredVehicles}
          onEdit={(vehicle) => setDialog({ type: "edit", vehicle })}
          onDelete={(vehicle) => setDialog({ type: "delete", vehicle })}
        />
      )}

      <VehicleFormModal
        open={dialog?.type === "create" || dialog?.type === "edit"}
        vehicle={dialog?.type === "edit" ? dialog.vehicle : undefined}
        onClose={close}
      />

      <DeleteVehicleModal
        open={dialog?.type === "delete"}
        vehicle={dialog?.type === "delete" ? dialog.vehicle : undefined}
        onClose={close}
      />
    </div>
  );
}
