"use client";

import { MODULES } from "@/modules/registry";
import type { ModuleDefinition, ModuleKey } from "@/modules/types/types";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ChevronRight, X } from "lucide-react";

interface ModulePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (module: ModuleKey) => void;
  /** modules this company may use here; the rest are shown disabled */
  available: ModuleKey[];
  title?: string;
  description?: string;
}

const ALL_MODULES = Object.values(MODULES) as ModuleDefinition[];

export default function ModulePickerModal({
  open,
  onClose,
  onSelect,
  available,
  title = "Nieuw project",
  description = "Voor welke dienst wil je een project plannen?",
}: ModulePickerModalProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[300]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/45 transition-opacity duration-150 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-float transition duration-150 ease-out data-closed:translate-y-2 data-closed:opacity-0"
        >
          <div className="flex items-start gap-3 border-b border-line px-6 pt-5 pb-4">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg font-bold text-ink">{title}</DialogTitle>
              <p className="mt-0.5 text-sm text-muted">{description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Sluiten"
              className="-mt-0.5 -mr-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X strokeWidth={1.75} className="h-5 w-5" />
            </button>
          </div>

          <ul className="grid gap-2 p-4 sm:grid-cols-2">
            {ALL_MODULES.map(({ key, label, description: moduleDescription, icon: Icon }) => {
              const enabled = available.includes(key);

              return (
                <li key={key}>
                  <button
                    type="button"
                    disabled={!enabled}
                    onClick={() => onSelect(key)}
                    className="group flex w-full cursor-pointer items-center gap-3 rounded-lg border border-line bg-white p-3 text-left transition duration-150 hover:border-primary/40 hover:shadow-card hover:ring-1 hover:ring-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-surface/50 disabled:hover:border-line disabled:hover:shadow-none disabled:hover:ring-0"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ring-1 transition-colors duration-150 ${
                        enabled
                          ? "bg-primary-soft text-primary ring-primary/10 group-hover:bg-primary/15"
                          : "bg-surface text-muted/60 ring-line"
                      }`}
                    >
                      <Icon strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-semibold ${
                          enabled ? "text-ink group-hover:text-primary" : "text-muted"
                        }`}
                      >
                        {label}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {enabled ? moduleDescription : "Niet in uw abonnement"}
                      </span>
                    </span>

                    {enabled && (
                      <ChevronRight
                        strokeWidth={1.75}
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-primary"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
