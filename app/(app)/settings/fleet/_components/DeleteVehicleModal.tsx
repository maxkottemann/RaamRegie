"use client";

import DeleteModal from "@/components/ui/modals/DeleteModal.";
import { useToast } from "@/context/ToastContext";
import { useRemoveVehicle } from "@/hooks/staff/vehicleHooks";
import { getErrorMessage } from "@/lib/dbErrors";
import type { VehicleBasic } from "@/services/staff/vehicleService";
import { Info, Truck } from "lucide-react";
import { useEffect } from "react";

interface DeleteVehicleModalProps {
  open: boolean;
  vehicle: VehicleBasic | undefined;
  onClose: () => void;
}

export default function DeleteVehicleModal({ vehicle, open, onClose }: DeleteVehicleModalProps) {
  const { showToast } = useToast();
  const removeVehicle = useRemoveVehicle();
  const { reset: resetRemove } = removeVehicle;

  // clear the previous error each time it opens
  useEffect(() => {
    if (open) resetRemove();
  }, [open, resetRemove]);

  function handleConfirm() {
    if (!vehicle) return;

    removeVehicle.mutate(vehicle.id, {
      onSuccess: (result) => {
        showToast(
          result === "archived"
            ? `${vehicle.name} is gearchiveerd`
            : `${vehicle.name} is verwijderd`,
          "success",
        );
        onClose();
      },
    });
  }

  function handleClose() {
    if (removeVehicle.isPending) return;
    onClose();
  }

  return (
    <DeleteModal
      open={open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Voertuig verwijderen"
      description="Weet u zeker dat u dit voertuig wilt verwijderen?"
      confirmLabel="Verwijderen"
      loading={removeVehicle.isPending}
      error={removeVehicle.error ? getErrorMessage(removeVehicle.error) : undefined}
    >
      {vehicle && (
        <div className="space-y-3">
          {/* the vehicle */}
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface/60 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-muted ring-1 ring-line">
              <Truck strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{vehicle.name}</p>
              {vehicle.license_plate && (
                <p className="text-xs font-medium tracking-wider text-muted uppercase">
                  {vehicle.license_plate}
                </p>
              )}
            </div>
          </div>

          {/* archive note */}
          <p className="flex gap-2 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Komt dit voertuig voor in projecten, dan wordt het gearchiveerd zodat de
            projectgeschiedenis bewaard blijft.
          </p>
        </div>
      )}
    </DeleteModal>
  );
}
