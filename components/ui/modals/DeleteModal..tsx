"use client";

import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Description } from "@headlessui/react";
import { Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/buttons/Button";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string;
}

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmLabel = "Verwijderen",
  cancelLabel = "Annuleren",
  loading = false,
  error,
}: DeleteModalProps) {
  return (
    <Dialog open={open} onClose={loading ? () => {} : onClose} className="relative z-[300]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/40 transition-opacity duration-200 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md overflow-hidden rounded-xl border border-line bg-white shadow-xl transition duration-200 ease-out data-closed:translate-y-2 data-closed:scale-95 data-closed:opacity-0"
        >
          <div className="flex items-start gap-4 px-6 pt-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-danger">
              <Trash2 strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <DialogTitle className="text-base font-semibold text-ink">{title}</DialogTitle>

              {description && (
                <Description as="div" className="mt-1.5 text-sm leading-relaxed text-muted">
                  {description}
                </Description>
              )}

              {children && <div className="mt-3 text-sm text-muted">{children}</div>}
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Sluiten"
              className="-mt-1 -mr-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
            >
              <X strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mx-6 mt-4 rounded-lg bg-danger-soft px-3 py-2.5 text-xs font-medium text-danger-ink"
            >
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-2 border-t border-line bg-surface/50 px-6 py-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              {cancelLabel}
            </Button>
            <Button variant="danger" icon={Trash2} onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
