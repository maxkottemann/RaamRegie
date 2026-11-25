import DeleteModal from "@/components/ui/modals/DeleteModal.";
import { useToast } from "@/context/ToastContext";
import { useDeleteCleaningMethod } from "@/hooks/cleaningMethodHooks";
import { getErrorMessage } from "@/lib/dbErrors";
import { CleaningMethod } from "@/services/cleaningMethodsService";
import { Info, Sparkle } from "lucide-react";
import { useEffect } from "react";

interface CleaningMethodModalProps {
  open: boolean;
  cleaningMethod?: CleaningMethod | undefined; // undefined = create, otherwise edit
  onClose: () => void;
}

export default function DeleteCleaningMethodModal({
  open,
  cleaningMethod,
  onClose,
}: CleaningMethodModalProps) {
  const { showToast } = useToast();
  const deleteCleaningMethod = useDeleteCleaningMethod();
  const { reset: resetRemove } = deleteCleaningMethod;

  // clear the previous error each time it opens
  useEffect(() => {
    if (open) resetRemove();
  }, [open, resetRemove]);

  function handleConfirm() {
    if (!cleaningMethod) return;

    deleteCleaningMethod.mutate(cleaningMethod.id, {
      onSuccess: (result) => {
        showToast(
          result === "archived"
            ? `${cleaningMethod.name} is gearchiveerd`
            : `${cleaningMethod.name} is verwijderd`,
          "success",
        );
        onClose();
      },
    });
  }

  function handleClose() {
    if (deleteCleaningMethod.isPending) return;
    onClose();
  }

  return (
    <DeleteModal
      open={open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Reinigingsmethode verwijderen"
      description="Weet u zeker dat u deze reinigingsmethode wilt verwijderen?"
      confirmLabel="Verwijderen"
      loading={deleteCleaningMethod.isPending}
      error={deleteCleaningMethod.error ? getErrorMessage(deleteCleaningMethod.error) : undefined}
    >
      {cleaningMethod && (
        <div className="space-y-3">
          {/* the method */}
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface/60 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-muted ring-1 ring-line">
              <Sparkle strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{cleaningMethod.name}</p>
              {cleaningMethod.description && (
                <p className="truncate text-xs text-muted">{cleaningMethod.description}</p>
              )}
            </div>
          </div>

          {/* archive note */}
          <p className="flex gap-2 text-xs leading-relaxed text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Is deze methode gebruikt in projecten, dan wordt deze gearchiveerd. De milieugegevens
            van eerdere projecten blijven zo kloppen.
          </p>
        </div>
      )}
    </DeleteModal>
  );
}
