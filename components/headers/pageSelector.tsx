"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number; // 0-based, same as your service
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

type PageItem = number | "ellipsis-left" | "ellipsis-right";

function getPages(current: number, count: number): PageItem[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i);

  const pages: PageItem[] = [0];
  const start = Math.max(1, current - 1);
  const end = Math.min(count - 2, current + 1);

  if (start > 1) pages.push("ellipsis-left");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < count - 2) pages.push("ellipsis-right");

  pages.push(count - 1);
  return pages;
}

const navButton =
  "flex h-8 items-center gap-1 rounded-md px-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40 cursor-pointer";

export default function Pagination({
  page,
  pageSize,
  total,
  onChange,
  disabled = false,
  className = "",
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;

  const from = page * pageSize + 1;
  const to = Math.min(total, (page + 1) * pageSize);
  const isFirst = page <= 0;
  const isLast = page >= pageCount - 1;

  const go = (p: number) => {
    if (disabled || p < 0 || p > pageCount - 1 || p === page) return;
    onChange(p);
  };

  return (
    <nav
      aria-label="Paginering"
      className={`flex items-center justify-between gap-4 border-t border-line px-5 py-3 ${className}`}
    >
      {/* Range */}
      <p className="text-xs text-muted tabular-nums">
        <span className="font-medium text-ink-soft">
          {from.toLocaleString("nl-NL")}–{to.toLocaleString("nl-NL")}
        </span>{" "}
        van {total.toLocaleString("nl-NL")}
      </p>

      {pageCount > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={isFirst || disabled}
            aria-label="Vorige pagina"
            className={navButton}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Vorige</span>
          </button>

          {/* Pages (desktop) */}
          <ul className="hidden items-center gap-0.5 sm:flex">
            {getPages(page, pageCount).map((item) =>
              typeof item === "number" ? (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => go(item)}
                    disabled={disabled}
                    aria-label={`Pagina ${item + 1}`}
                    aria-current={item === page ? "page" : undefined}
                    className={`flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-md px-2 text-sm tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none ${
                      item === page
                        ? "bg-primary-soft font-semibold text-primary"
                        : "text-ink-soft hover:bg-surface hover:text-ink"
                    }`}
                  >
                    {item + 1}
                  </button>
                </li>
              ) : (
                <li
                  key={item}
                  aria-hidden="true"
                  className="flex h-8 w-6 items-center justify-center text-sm text-muted/60"
                >
                  …
                </li>
              ),
            )}
          </ul>

          {/* Pages (mobile) */}
          <p className="px-2 text-xs text-muted tabular-nums sm:hidden">
            <span className="font-medium text-ink">{page + 1}</span> / {pageCount}
          </p>

          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={isLast || disabled}
            aria-label="Volgende pagina"
            className={navButton}
          >
            <span className="hidden sm:inline">Volgende</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </nav>
  );
}
