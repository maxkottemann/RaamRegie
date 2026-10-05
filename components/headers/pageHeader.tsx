"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  backLabel?: string;
  fallbackHref?: string;
};

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  showBack = false,
  onBack,
  backLabel = "Terug",
  fallbackHref = "/dashboard",
}: PageHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (onBack) return onBack();

    // opened directly (new tab, shared link): there's no page to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {(showBack || onBack) && (
          <button
            type="button"
            onClick={handleBack}
            aria-label={backLabel}
            title={backLabel}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line bg-white text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft strokeWidth={1.75} className="h-4 w-4" />
          </button>
        )}

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
            <Icon strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-ink">{title}</h1>
          {description && <p className="mt-0.5 truncate text-sm text-muted">{description}</p>}
        </div>
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

type SubPageHeaderProps = Omit<PageHeaderProps, "showBack">;

export function SubPageHeader(props: SubPageHeaderProps) {
  return <PageHeader {...props} showBack />;
}
