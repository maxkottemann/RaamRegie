import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      <dt className="w-24 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="min-w-0 flex-1 truncate text-sm font-medium text-ink">
        {value || <span className="font-normal text-muted/70">—</span>}
      </dd>
    </div>
  );
}
