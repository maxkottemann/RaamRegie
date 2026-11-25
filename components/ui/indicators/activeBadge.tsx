interface ActiveBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

export default function ActiveBadge({
  active,
  activeLabel = "Actief",
  inactiveLabel = "Inactief",
  className = "",
}: ActiveBadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? "bg-success-soft text-success-ink" : "bg-surface text-muted"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-muted/50"}`}
      />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
