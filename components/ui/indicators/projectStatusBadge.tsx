import { Database } from "@/types/database.types";

type ProjectStatus = Database["public"]["Enums"]["project_status"];

const STATUS: Record<ProjectStatus, { label: string; pill: string; dot: string; pulse?: boolean }> =
  {
    planned: {
      label: "Gepland",
      pill: "bg-surface text-ink-soft ring-1 ring-inset ring-line",
      dot: "bg-muted",
    },
    active: {
      label: "Actief",

      pulse: true,
      pill: "bg-primary-soft text-primary",
      dot: "bg-primary",
    },
    pending_approval: {
      label: "Wacht op akkoord",
      pill: "bg-warning-soft text-warning-ink",
      dot: "bg-warning",
    },
    approved: { label: "Afgerond", pill: "bg-success-soft text-success-ink", dot: "bg-success" },
    cancelled: {
      label: "Geannuleerd",
      pill: "bg-surface text-muted line-through decoration-muted/40",
      dot: "bg-muted/40",
    },
  };

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export default function ProjectStatusBadge({ status, className = "" }: ProjectStatusBadgeProps) {
  const s = STATUS[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${s.pill} ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
