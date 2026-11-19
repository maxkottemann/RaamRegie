"use client";

import SettingsHeader from "@/components/headers/settingsHeader";
import EmployeeList from "@/components/lists/vehicles/employeeList";
import ErrorState from "@/components/states/ErrorState";
import LoadingState from "@/components/states/loadingState";
import Button from "@/components/ui/buttons/Button";
import SearchInput from "@/components/ui/inputs/SearchInput";
import { useEmployees } from "@/hooks/staff/employeeHooks";
import { Employee } from "@/services/staff/employeeService";
import { Plus, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import EmployeeFormModal from "./_components/EmployeeModal";
import DeleteEmployeeModal from "./_components/DeleteEmployeeModal";

type EmployeeDialogue =
  | { type: "create" }
  | { type: "edit"; employee: Employee }
  | { type: "delete"; employee: Employee }
  | null;

export default function SettingsStaffPage() {
  const { data: employees, isPending, error } = useEmployees();

  const [dialog, setDialog] = useState<EmployeeDialogue | null>(null);

  const [search, setSearch] = useState("");

  const filteredEmployees = useMemo(() => {
    const list = employees ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;

    return list.filter((e) => e.name.trim().toLowerCase().includes(q));
  }, [employees, search]);

  if (isPending) return <LoadingState />;
  if (error || !employees) return <ErrorState />;

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader
        icon={UserCheck}
        title="Medewerkers"
        description="Beheer uw medewerkers en standaard bemanning."
        actions={
          <Button size="sm" icon={Plus} onClick={() => setDialog({ type: "create" })}>
            Toevoegen
          </Button>
        }
      />

      {employees.length > 0 && (
        <SearchInput value={search} onChange={setSearch} placeholder="Zoek op naam" />
      )}

      {employees.length > 0 && filteredEmployees.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          Geen medewerkers gevonden voor &quot;{search}&quot;.
        </p>
      ) : (
        <EmployeeList
          employees={filteredEmployees}
          onEdit={(employee) => setDialog({ type: "edit", employee })}
          onDelete={(employee) => setDialog({ type: "delete", employee: employee })}
        />
      )}

      <EmployeeFormModal
        open={dialog?.type === "create" || dialog?.type === "edit"}
        employee={dialog?.type === "edit" ? dialog.employee : undefined}
        onClose={() => setDialog(null)}
      />
      <DeleteEmployeeModal
        onClose={() => setDialog(null)}
        open={dialog?.type === "delete"}
        employee={dialog?.type === "delete" ? dialog.employee : undefined}
      />
    </div>
  );
}
