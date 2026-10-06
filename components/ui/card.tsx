import { Plus, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import Button from "@/components/ui/buttons/Button";

interface CardProps {
  icon?: LucideIcon;
  label?: string;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  onButton?: () => void;
  buttonLabel?: string;
  buttonIcon?: LucideIcon;
  children?: ReactNode;
  footer?: ReactNode;
  flush?: boolean;
  className?: string;
}

export default function Card({
  icon: Icon,
  label,
  title,
  subtitle,
  actions,
  onButton,
  buttonLabel = "Toevoegen",
  buttonIcon = Plus,
  children,
  footer,
  flush = false,
  className = "",
}: CardProps) {
  const hasHeaderText = Boolean(label || title || subtitle);
  const hasHeader = Boolean(Icon || hasHeaderText || actions || onButton);

  return (
    <section className={`overflow-hidden rounded-xl border border-line bg-white ${className}`}>
      {hasHeader && (
        <header
          className={`flex items-center justify-between gap-4 px-5 py-4 ${children ? "border-b border-line" : ""}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
              </div>
            )}

            {hasHeaderText && (
              <div className="min-w-0">
                {label && (
                  <p className="mb-0.5 text-[11px] font-medium tracking-wider text-muted/70 uppercase">
                    {label}
                  </p>
                )}
                {title && <h2 className="truncate text-sm font-semibold text-ink">{title}</h2>}
                {subtitle && <p className="mt-0.5 truncate text-sm text-muted">{subtitle}</p>}
              </div>
            )}
          </div>

          {(actions || onButton) && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
              {onButton && (
                <Button variant="secondary" size="sm" icon={buttonIcon} onClick={onButton}>
                  {buttonLabel}
                </Button>
              )}
            </div>
          )}
        </header>
      )}

      {children && <div className={flush ? "" : "space-y-5 p-5"}>{children}</div>}

      {footer && (
        <footer className="flex items-center justify-end gap-2 border-t border-line bg-surface/50 px-5 py-3">
          {footer}
        </footer>
      )}
    </section>
  );
}
