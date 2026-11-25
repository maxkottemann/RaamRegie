import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  invalid?: boolean;
  icon?: LucideIcon;
};

export default function Input({
  invalid = false,
  icon: Icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="group relative">
      {Icon && (
        <Icon
          strokeWidth={1.75}
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors ${invalid ? "text-danger" : "text-muted/60 group-focus-within:text-primary"}`}
        />
      )}
      <input
        aria-invalid={invalid || undefined}
        className={`h-10 w-full rounded-lg border bg-surface/70 text-sm text-ink transition outline-none placeholder:text-muted/50 hover:bg-white focus:bg-white focus:ring-4 ${Icon ? "pr-3 pl-9" : "px-3"} ${
          invalid
            ? "border-danger bg-danger/5 focus:border-danger focus:ring-danger/10"
            : "border-line hover:border-muted/30 focus:border-primary focus:ring-primary/10"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
