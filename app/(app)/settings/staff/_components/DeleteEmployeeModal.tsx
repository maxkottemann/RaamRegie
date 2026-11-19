import DeleteModal from "@/components/ui/modals/DeleteModal.";
import { useToast } from "@/context/ToastContext";
import { useRemoveEmployee } from "@/hooks/staff/employeeHooks";
import { getErrorMessage } from "@/lib/dbErrors";
import { Employee } from "@/services/staff/employeeService";
import { Info, UserPlus } from "lucide-react";
import { useEffect } from "react";

interface DeleteEmployeeModalProps {
  open: boolean;
  employee: Employee | undefined;
  onClose: () => void;
}

export default function DeleteEmployeeModal({ employee, open, onClose }: DeleteEmployeeModalProps) {
  const { showToast } = useToast();
  const removeVehicle = useRemoveEmployee();
  const { reset: resetRemove } = removeVehicle;

  useEffect(() => {
    if (open) resetRemove();
  }, [open, resetRemove]);

  function handleRemove() {
    if (!employee) return;

    removeVehicle.mutate(employee.id, {
      onSuccess: (result) => {
        showToast(
          result === "archived"
            ? `${employee.name} is gearchiveerd`
            : `${employee.name} is verwijderd`,
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
      onConfirm={handleRemove}
      title="Medewerler verwijderen"
      description="Weet u zeker dat u deze medewerker wilt verwijderen?"
      confirmLabel="Verwijderen"
      loading={removeVehicle.isPending}
      error={removeVehicle.error ? getErrorMessage(removeVehicle.error) : undefined}
    >
      {employee && (
        <div className="space-y-3">
          {/* the vehicle */}
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface/60 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-muted ring-1 ring-line">
              <UserPlus strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{employee.name}</p>
            </div>
          </div>

          {/* archive note */}
          <p className="flex gap-2 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Komt deze medewerker voor in projecten, dan wordt hij/zij gearchiveerd zodat de
            projectgeschiedenis bewaard blijft.
          </p>
        </div>
      )}
    </DeleteModal>
  );
}
