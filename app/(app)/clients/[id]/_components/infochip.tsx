import type { LucideIcon } from "lucide-react";

type ClientInfoChipProps = {
  title: string;
  value?: string | null;
  icon: LucideIcon;
};

export default function ClientInfoChip({ title, value, icon: Icon }: ClientInfoChipProps) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <Icon strokeWidth={1.75} className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        {title}
      </p>
      <p className={`mt-1 truncate pl-5 text-sm font-medium text-ink`}>{value || "—"}</p>
    </div>
  );
}
