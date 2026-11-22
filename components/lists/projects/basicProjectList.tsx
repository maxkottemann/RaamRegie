"use client";

import Pagination from "@/components/headers/pageSelector";
import ProjectStatusBadge from "@/components/ui/indicators/projectStatusBadge";
import { formatDate } from "@/lib/format";
import type { BasicProjectitem, BasicProjectList } from "@/services/projectServices/projectService";
import { Building2, ChevronRight, FolderKanban, MapPin, User } from "lucide-react";

interface BasicProjectListProps {
  total: number;
  projects: BasicProjectList;
  onSelect: (project: BasicProjectitem) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

const DAY = 86_400_000;

function toLocalDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateParts(value: string) {
  const d = toLocalDate(value);
  return {
    day: d.getDate(),
    month: new Intl.DateTimeFormat("nl-NL", { month: "short" }).format(d).replace(".", ""),
  };
}

function timing(start: string, end: string) {
  const today = startOfToday().getTime();
  const s = toLocalDate(start).getTime();
  const e = toLocalDate(end).getTime();

  if (today < s) {
    const days = Math.round((s - today) / DAY);
    return { kind: "upcoming" as const, label: days === 1 ? "Morgen" : `Over ${days} dagen` };
  }
  if (today > e) {
    return { kind: "past" as const, label: `Afgelopen ${formatDate(end)}` };
  }
  const total = Math.max(e - s, DAY);
  const pct = Math.min(100, Math.max(0, Math.round(((today - s) / total) * 100)));
  return { kind: "running" as const, label: `${pct}% van de periode`, pct };
}

const GRID =
  "md:grid md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.5fr)_minmax(0,1.3fr)_9rem_1rem] md:items-center md:gap-6";

export default function ProjectListBasic({
  total,
  projects,
  onSelect,
  page,
  pageSize,
  onPageChange,
  isFetching,
}: BasicProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-white px-5 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-muted">
          <FolderKanban strokeWidth={1.75} className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Geen projecten gevonden</p>
          <p className="mt-1 text-sm text-muted">
            Pas de filters aan of maak een nieuw project aan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-white">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-ink">Projecten</h2>
          <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink-soft tabular-nums">
            {total.toLocaleString("nl-NL")}
          </span>
        </div>
        {projects.length < total && (
          <p className="text-xs text-muted tabular-nums">
            {projects.length} van {total.toLocaleString("nl-NL")} getoond
          </p>
        )}
      </header>

      {/* Column headers (desktop) */}
      <div
        className={`hidden border-y border-line bg-surface/50 px-5 py-2 text-[11px] font-medium tracking-wider text-muted/80 uppercase ${GRID}`}
      >
        <span>Project</span>
        <span>Locatie</span>
        <span>Periode</span>
        <span>Status</span>
        <span />
      </div>

      <ul className="divide-y divide-line border-t border-line md:border-t-0">
        {projects.map((project) => {
          const { day, month } = dateParts(project.start_date);
          const t = timing(project.start_date, project.end_date);
          const isCancelled = project.status === "cancelled";

          return (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => onSelect(project)}
                className={`group relative w-full cursor-pointer px-5 py-4 text-left transition-colors hover:bg-surface/50 focus-visible:bg-surface/50 focus-visible:outline-none ${GRID} ${
                  isCancelled ? "opacity-60" : ""
                }`}
              >
                {/* Hover accent */}
                <span
                  aria-hidden="true"
                  className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                />

                {/* Project */}
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    aria-hidden="true"
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 transition-colors ring-inset ${
                      isCancelled
                        ? "bg-surface text-muted ring-line"
                        : "bg-primary-soft text-primary ring-primary/10 group-hover:bg-primary/15 group-hover:ring-primary/25"
                    }`}
                  >
                    <FolderKanban strokeWidth={1.75} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-ink transition-colors group-hover:text-primary">
                        {project.name}
                      </p>

                      {project.project_code && (
                        <span
                          title="Projectcode"
                          className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted uppercase tabular-nums"
                        >
                          {project.project_code}
                        </span>
                      )}

                      {project.internal_id && (
                        <span
                          title="Intern ID"
                          className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-muted tabular-nums sm:inline-block"
                        >
                          #{project.internal_id}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mobile: status + chevron on the right */}
                  <div className="flex shrink-0 items-center gap-2 md:hidden">
                    <ProjectStatusBadge status={project.status} />
                    <ChevronRight className="h-4 w-4 text-muted/50" aria-hidden="true" />
                  </div>
                </div>

                {/* Location */}
                <div className="mt-3 min-w-0 pl-15 md:mt-0 md:pl-0">
                  <p className="flex min-w-0 items-center gap-1.5 text-sm text-ink-soft">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                    <span className="truncate">{project.location_name ?? "—"}</span>
                  </p>
                  {project.client_name && (
                    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-muted">
                      <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{project.client_name}</span>
                    </p>
                  )}
                </div>

                {/* Period */}
                <div className="mt-2.5 min-w-0 pl-15 md:mt-0 md:pl-0">
                  <p className="truncate text-sm text-ink-soft tabular-nums">
                    {formatDate(project.start_date)} – {formatDate(project.end_date)}
                  </p>

                  {t.kind === "running" && project.status === "active" && !isCancelled && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${t.pct}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-[11px] text-muted tabular-nums">{t.pct}%</span>
                    </div>
                  )}
                </div>

                {/* Status (desktop) */}
                <div className="hidden md:block">
                  <ProjectStatusBadge status={project.status} />
                </div>

                {/* Chevron (desktop) */}
                <ChevronRight
                  aria-hidden="true"
                  className="hidden h-4 w-4 text-muted/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary md:block"
                />
              </button>
            </li>
          );
        })}
      </ul>
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        disabled={isFetching}
      />
    </section>
  );
}
