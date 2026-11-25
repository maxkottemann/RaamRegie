import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  hint?: ReactNode;
  loading?: boolean;
  className?: string;
}

export default function KpiCard({
  label,
  value,
  icon: Icon,
  hint,
  loading = false,
  className = "",
}: KpiCardProps) {
  const display = typeof value === "number" ? value.toLocaleString("nl-NL") : value;

  return (
    <div
      className={`relative flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-white py-3 pr-4 pl-5 ${className}`}
    >
      {/* Accent edge */}
      <span
        aria-hidden="true"
        className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-primary"
      />

      {Icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon strokeWidth={1.75} className="h-[18px] w-[18px]" aria-hidden="true" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted">{label}</p>

        <div className="flex min-w-0 items-baseline gap-1.5">
          {loading ? (
            <span className="my-1 block h-4 w-10 animate-pulse rounded bg-surface" />
          ) : (
            <span className="text-base leading-6 font-semibold text-ink tabular-nums">
              {display}
            </span>
          )}
          {hint && !loading && <span className="truncate text-xs text-muted/80">{hint}</span>}
        </div>
      </div>
    </div>
  );
}
