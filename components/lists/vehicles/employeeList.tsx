import ActiveBadge from "@/components/ui/indicators/activeBadge";
import { formatDate } from "@/lib/format";
import type { Employee, Employees } from "@/services/staff/employeeService";
import { CalendarDays, KeyRound, Pencil, Trash2, Users } from "lucide-react";

interface EmployeeListProps {
  employees: Employees;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-white px-5 py-12 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-muted">
          <Users className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">Nog geen medewerkers</p>
          <p className="mt-0.5 text-sm text-muted">
            Voeg een medewerker toe om deze aan voertuigen en projecten te koppelen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
      {employees.map((employee) => (
        <li
          key={employee.id}
          className={`group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-surface/60 sm:px-5 ${
            employee.is_active ? "" : "opacity-70"
          }`}
        >
          {/* Avatar */}
          <span
            aria-hidden="true"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              employee.is_active ? "bg-primary-soft text-primary" : "bg-surface text-muted"
            }`}
          >
            {initials(employee.name)}
          </span>

          {/* Main */}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-semibold text-ink">{employee.name}</p>
              {employee.profile_id && (
                <span
                  title="Heeft een account"
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-soft px-1.5 py-0.5 text-[11px] font-medium text-primary"
                >
                  <KeyRound className="h-3 w-3" aria-hidden="true" />
                  Account
                </span>
              )}
            </div>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Toegevoegd op {formatDate(employee.created_at ?? "")}
            </p>
          </div>

          {/* Status */}
          <ActiveBadge active={employee.is_active} className="hidden sm:inline-flex" />

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(employee)}
              aria-label={`${employee.name} bewerken`}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(employee)}
              aria-label={`${employee.name} verwijderen`}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-danger"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
