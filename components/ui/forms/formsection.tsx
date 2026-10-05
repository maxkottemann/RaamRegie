import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
};

export default function FormSection({
  title,
  description,
  icon: Icon,
  children,
}: FormSectionProps) {
  return (
    <section className="rounded-xl border border-line bg-white">
      <header className="flex items-center gap-3 border-b border-line px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Icon strokeWidth={1.75} className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          {description && <p className="text-xs text-muted">{description}</p>}
        </div>
      </header>
      <div className="space-y-5 p-5">{children}</div>
    </section>
  );
}
