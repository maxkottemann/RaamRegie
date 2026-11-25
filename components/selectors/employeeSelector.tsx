"use client";

import SearchInput from "@/components/ui/inputs/SearchInput";
import Button from "@/components/ui/buttons/Button";
import type { Employee, Employees } from "@/services/staff/employeeService";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Check, KeyRound, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

interface EmployeeSelectorProps {
  open: boolean;
  employees: Employees;
  selectedEmployees: Employee[];
  onChange: (employee: Employee) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function EmployeeSelector({
  open,
  employees,
  selectedEmployees,
  onChange,
  onClose,
  title = "Medewerkers kiezen",
  description = "Selecteer wie er deze dag meegaat",
}: EmployeeSelectorProps) {
  const [search, setSearch] = useState("");

  const selectedIds = useMemo(
    () => new Set(selectedEmployees.map((e) => e.id)),
    [selectedEmployees],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) => e.name.toLowerCase().includes(q));
  }, [employees, search]);

  function handleClose() {
    setSearch("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-[300]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/40 transition-opacity duration-200 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-xl border border-line bg-white shadow-xl transition duration-200 ease-out data-closed:translate-y-2 data-closed:scale-95 data-closed:opacity-0"
        >
          {/* header */}
          <div className="flex items-start gap-4 border-b border-line px-6 py-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Users strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <DialogTitle className="text-base font-semibold text-ink">{title}</DialogTitle>
              <p className="mt-0.5 text-sm text-muted">{description}</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Sluiten"
              className="-mt-1 -mr-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
            >
              <X strokeWidth={1.75} className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* search */}
          {employees.length > 6 && (
            <div className="border-b border-line px-6 py-3">
              <SearchInput
                size="sm"
                value={search}
                onChange={setSearch}
                placeholder="Zoek een medewerker"
              />
            </div>
          )}

          {/* list */}
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {employees.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">
                Nog geen medewerkers toegevoegd.
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted">
                Geen medewerkers gevonden voor &quot;{search}&quot;.
              </p>
            ) : (
              <ul className="space-y-0.5">
                {filtered.map((employee) => {
                  const selected = selectedIds.has(employee.id);

                  return (
                    <li key={employee.id}>
                      <button
                        type="button"
                        onClick={() => onChange(employee)}
                        aria-pressed={selected}
                        className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                          selected ? "bg-primary-soft/60" : "hover:bg-surface/70"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                            selected ? "bg-primary text-white" : "bg-primary-soft text-primary"
                          }`}
                        >
                          {initials(employee.name)}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate text-sm ${selected ? "font-semibold text-ink" : "font-medium text-ink-soft"}`}
                          >
                            {employee.name}
                          </span>
                          {employee.profile_id && (
                            <span className="flex items-center gap-1 text-[11px] text-muted">
                              <KeyRound className="h-3 w-3" aria-hidden="true" />
                              Heeft een account
                            </span>
                          )}
                        </span>

                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-line bg-white group-hover:border-primary/60"
                          }`}
                        >
                          {selected && <Check strokeWidth={3} className="h-3 w-3" />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* footer */}
          <div className="flex items-center justify-between gap-3 border-t border-line bg-surface/50 px-6 py-4">
            <p className="text-sm text-muted tabular-nums">
              <span className="font-semibold text-ink">{selectedEmployees.length}</span>{" "}
              {selectedEmployees.length === 1 ? "medewerker" : "medewerkers"} geselecteerd
            </p>
            <Button type="button" onClick={handleClose}>
              Klaar
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
