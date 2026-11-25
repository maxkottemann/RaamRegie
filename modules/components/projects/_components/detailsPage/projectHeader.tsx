import ProjectStatusBadge from "@/components/ui/indicators/projectStatusBadge";
import { formatDate } from "@/lib/format";
import type { ProjectDetail } from "@/services/projectServices/projectService";
import { Box, Building2, CalendarDays, ChevronLeft, MapPin, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface ProjectDetailPageHeaderProps {
  project: ProjectDetail;
  backHref?: string;
  actions?: ReactNode;
}

function Meta({
  icon: Icon,
  label,
  children,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="min-w-0 bg-white px-5 py-4 sm:px-6">
      <dt className="flex items-center gap-1.5 text-xs text-muted">
        <Icon strokeWidth={1.75} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-medium text-ink">{children}</dd>
      {sub && <dd className="mt-0.5 truncate text-xs text-muted">{sub}</dd>}
    </div>
  );
}

const empty = <span className="font-normal text-muted/50">—</span>;

export default function ProjectDetailPageHeader({
  project,
  backHref = "/projects",
  actions,
}: ProjectDetailPageHeaderProps) {
  return (
    <header className="overflow-hidden rounded-xl border border-line bg-white">
      {/* title */}
      <div className="flex flex-col gap-4 px-5 pt-4 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="min-w-0">
          <Link
            href={backHref}
            className="-ml-1 inline-flex items-center gap-0.5 rounded text-xs font-medium text-muted transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Projecten
          </Link>

          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-3">
            <h1 className="truncate text-2xl font-bold tracking-tight text-ink">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>

          {(project.project_code || project.description) && (
            <p className="mt-1.5 max-w-2xl text-sm text-muted">
              {project.project_code && (
                <span className="font-medium text-ink-soft tabular-nums">
                  #{project.project_code}
                </span>
              )}
              {project.project_code && project.description && (
                <span className="mx-2 text-line">|</span>
              )}
              {project.description}
            </p>
          )}
        </div>

        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {/* meta */}
      <dl className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
        <Meta icon={CalendarDays} label="Periode">
          <span className="tabular-nums">
            {formatDate(project.start_date)} – {formatDate(project.end_date)}
          </span>
        </Meta>

        <Meta icon={MapPin} label="Locatie" sub={project.location_address}>
          {project.location_name ?? empty}
        </Meta>

        <Meta icon={Building2} label="Klant">
          {project.client_name ?? empty}
        </Meta>

        <Meta icon={Box} label="Objecten">
          <span className="tabular-nums">{(project.item_count ?? 0).toLocaleString("nl-NL")}</span>
        </Meta>
      </dl>
    </header>
  );
}
