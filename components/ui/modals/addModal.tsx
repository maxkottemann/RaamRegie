"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Plus, X, type LucideIcon } from "lucide-react";
import type { FormEventHandler, ReactNode } from "react";
import Button from "@/components/ui/buttons/Button";

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  submitDisabled?: boolean;
  error?: string;
  size?: "md" | "lg";
}

export default function AddModal({
  open,
  onClose,
  onSubmit,
  title,
  description,
  icon: Icon = Plus,
  children,
  submitLabel = "Toevoegen",
  cancelLabel = "Annuleren",
  loading = false,
  submitDisabled = false,
  error,
  size = "md",
}: AddModalProps) {
  return (
    <Dialog open={open} onClose={loading ? () => {} : onClose} className="relative z-[300]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/40 transition-opacity duration-200 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-xl transition duration-200 ease-out data-closed:translate-y-2 data-closed:scale-95 data-closed:opacity-0 ${
            size === "lg" ? "max-w-2xl" : "max-w-lg"
          }`}
        >
          <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            {/* header */}
            <div className="flex items-start gap-4 border-b border-line px-6 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon strokeWidth={1.75} className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1 pt-0.5">
                <DialogTitle className="truncate text-base font-semibold text-ink">
                  {title}
                </DialogTitle>
                {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                aria-label="Sluiten"
                className="-mt-1 -mr-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
              >
                <X strokeWidth={1.75} className="h-4 w-4" />
              </button>
            </div>

            {/* fields; scrolls when the form is taller than the screen */}
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">{children}</div>

            {error && (
              <p
                role="alert"
                className="mx-6 mb-4 rounded-lg bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger"
              >
                {error}
              </p>
            )}

            {/* footer */}
            <div className="flex justify-end gap-2 border-t border-line bg-surface/50 px-6 py-4">
              <Button variant="secondary" onClick={onClose} disabled={loading}>
                {cancelLabel}
              </Button>
              <Button type="submit" icon={Plus} loading={loading} disabled={submitDisabled}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
