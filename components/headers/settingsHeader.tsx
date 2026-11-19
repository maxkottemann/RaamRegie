import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SettingsHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
}

export default function SettingsHeader({
  title,
  description,
  icon: Icon,
  actions,
  className = "",
}: SettingsHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Icon strokeWidth={1.75} className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-ink">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
