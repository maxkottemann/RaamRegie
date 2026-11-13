"use client";

import { Box, Check, ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/buttons/Button";
import type { Item } from "@/services/itemService";
import { IconButton } from "../buttons/IconButton";
import { ITEM_CATEGORY, ITEM_STATE, QUALITY } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { QualityIndicator } from "../indicators/qualityIndicator";

interface ItemListProps {
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
  selectedItems: Item[];
  onSelectItem: (item: Item) => void;
  onPageChange: (page: number) => void;
  onAddItem: () => void;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
  isFetching?: boolean;
}

/* object · status · kwaliteit · aantal · laatste onderhoud · actions */
const COLUMNS =
  "md:grid-cols-[minmax(0,2.4fr)_minmax(0,1.2fr)_5.5rem_minmax(0,0.7fr)_minmax(0,1.2fr)_4.5rem]";

export default function ItemList({
  items,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  isFetching = false,
  onAddItem,
  selectedItems,
  onSelectItem,
}: ItemListProps) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const first = total === 0 ? 0 : page * pageSize + 1;
  const last = Math.min((page + 1) * pageSize, total);
  const hasActions = Boolean(onEdit || onDelete);
  const selectedIds = new Set(selectedItems.map((item) => item.id));

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Box strokeWidth={1.75} className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm font-semibold text-ink">Nog geen objecten</p>
        <p className="mt-1 text-sm text-muted">
          Voeg gordijnen, stoelen of andere objecten toe aan deze ruimte.
        </p>
        <div className="mt-5">
          <Button onClick={onAddItem} icon={Plus} size="sm">
            Object toevoegen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-card">
      {/* column headers (desktop) */}
      <div
        className={`hidden gap-4 border-b border-line bg-surface px-4 py-2.5 text-xs font-semibold text-ink md:grid ${COLUMNS}`}
      >
        <span>Object</span>
        <span>Status</span>
        <span>Kwaliteit</span>
        <span className="text-right">Aantal</span>
        <span>Laatste onderhoud</span>
        <span aria-hidden="true" />
      </div>

      <ul
        className={`divide-y divide-line transition-opacity duration-200 ${isFetching ? "opacity-60" : ""}`}
      >
        {items.map((item) => {
          const isSelected = selectedIds.has(item.id);
          const category = ITEM_CATEGORY[item.category] ?? ITEM_CATEGORY.other;
          const state = item.state ? ITEM_STATE[item.state] : undefined;
          const lastMaintenance = formatDate(item.last_maintenance ?? "");
          const Icon = category.icon;

          return (
            <li
              key={item.id}
              className={`group relative grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors md:gap-y-0 ${COLUMNS} ${
                isSelected ? "bg-primary-soft" : "hover:bg-surface/60"
              }`}
            >
              {/* the whole row selects; edit/delete sit on top of it (z-10) */}
              <button
                type="button"
                onClick={() => onSelectItem(item)}
                aria-pressed={isSelected}
                aria-label={`${item.name} ${isSelected ? "deselecteren" : "selecteren"}`}
                className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              />

              {/* accent bar when selected */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-primary transition-opacity duration-150 ${
                  isSelected ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* object: category icon, name, category label */}
              <div className="pointer-events-none flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ring-1 transition-colors duration-150 ${
                    isSelected
                      ? "bg-primary text-white ring-primary"
                      : "bg-primary-soft text-primary ring-primary/10 group-hover:bg-primary/15"
                  }`}
                >
                  {isSelected ? (
                    <Check strokeWidth={2.5} className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Icon strokeWidth={1.75} className="h-[18px] w-[18px]" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ink">{item.name}</span>
                  <span className="block truncate text-xs text-muted">{category.label}</span>
                </span>
              </div>

              <div
                className={`relative z-10 col-start-2 row-start-1 flex items-center justify-end gap-0.5 md:col-start-6 ${
                  hasActions
                    ? "md:opacity-70 md:transition-opacity md:group-hover:opacity-100 md:focus-within:opacity-100"
                    : ""
                }`}
              >
                {onEdit && (
                  <IconButton label={`${item.name} bewerken`} onClick={() => onEdit(item)}>
                    <Pencil strokeWidth={1.75} className="h-4 w-4" />
                  </IconButton>
                )}
                {onDelete && (
                  <IconButton
                    label={`${item.name} verwijderen`}
                    onClick={() => onDelete(item)}
                    danger
                  >
                    <Trash2 strokeWidth={1.75} className="h-4 w-4" />
                  </IconButton>
                )}
              </div>

              {/* on mobile these three wrap into one meta line under the name */}
              <div className="pointer-events-none col-span-2 flex flex-wrap items-center gap-x-4 gap-y-1 pl-12 md:contents">
                <div className="flex min-w-0 items-center md:col-start-2 md:row-start-1">
                  {state ? (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold ${state.pill}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${state.dot}`}
                      />
                      {state.label}
                    </span>
                  ) : item.status ? (
                    <span className="inline-flex rounded bg-surface px-2 py-0.5 text-xs font-semibold text-muted">
                      {item.status}
                    </span>
                  ) : (
                    <span className="text-sm text-muted/60">—</span>
                  )}
                </div>

                <div className="flex items-center md:col-start-3 md:row-start-1">
                  <QualityIndicator value={item.status} />
                </div>

                <div className="text-sm text-ink-soft tabular-nums md:col-start-4 md:row-start-1 md:text-right">
                  <span className="text-xs text-muted md:hidden">Aantal: </span>
                  {item.quantity ?? "—"}
                </div>

                <div className="min-w-0 truncate text-sm text-ink-soft md:col-start-5 md:row-start-1">
                  <span className="text-xs text-muted md:hidden">Onderhoud: </span>
                  {lastMaintenance ?? <span className="text-muted/60">Nog niet</span>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* footer: count + add + pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface/40 px-4 py-3">
        <p className="text-xs text-muted tabular-nums">
          {first}–{last} van {total} {total === 1 ? "object" : "objecten"}
          {selectedItems.length > 0 && (
            <span className="ml-2 font-semibold text-primary">
              · {selectedItems.length} geselecteerd
            </span>
          )}
        </p>

        <div className="flex items-center gap-1">
          <Button onClick={onAddItem} variant="secondary" icon={Plus} size="sm">
            Object toevoegen
          </Button>

          <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

          <IconButton
            label="Vorige pagina"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft strokeWidth={1.75} className="h-4 w-4" />
          </IconButton>

          <span className="min-w-14 text-center text-xs font-medium text-ink tabular-nums">
            {page + 1} / {totalPages}
          </span>

          <IconButton
            label="Volgende pagina"
            onClick={() => onPageChange(page + 1)}
            disabled={page + 1 >= totalPages}
          >
            <ChevronRight strokeWidth={1.75} className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
