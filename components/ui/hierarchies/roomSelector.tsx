"use client";

import { Check, ChevronLeft, ChevronRight, DoorOpen, Pencil, Plus, Trash2 } from "lucide-react";
import type { StoryRoom } from "@/services/roomService";
import Button from "../buttons/Button";
import { IconButton } from "../buttons/IconButton";

interface RoomListProps {
  rooms: StoryRoom[];
  total: number;
  page: number;
  pageSize: number;
  selectedRooms: StoryRoom[];
  onSelectRoom: (room: StoryRoom) => void;
  onPageChange: (page: number) => void;
  onAddRoom: () => void;
  onEdit?: (room: StoryRoom) => void;
  onDelete?: (room: StoryRoom) => void;
  isFetching?: boolean;
}

const COLUMNS = "sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto]";

export default function RoomList({
  rooms,
  total,
  page,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  isFetching = false,
  onAddRoom,
  selectedRooms,
  onSelectRoom,
}: RoomListProps) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const first = total === 0 ? 0 : page * pageSize + 1;
  const last = Math.min((page + 1) * pageSize, total);
  const hasActions = Boolean(onEdit || onDelete);

  /* compare by id: the room objects can be new copies after a refetch */
  const selectedIds = new Set(selectedRooms.map((room) => room.id));

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <DoorOpen strokeWidth={1.75} className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-semibold text-ink">Nog geen ruimtes</p>
        <p className="mt-1 text-sm text-muted">Voeg ruimtes toe aan deze verdieping.</p>
        <div className="mt-4">
          <Button onClick={onAddRoom} icon={Plus} size="sm">
            Ruimte toevoegen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      {/* header row */}
      <div
        className={`hidden gap-4 border-b border-line bg-surface px-4 py-2.5 text-xs font-medium text-muted sm:grid ${COLUMNS}`}
      >
        <span>Ruimte</span>
        <span>Functie</span>
        <span>Categorie</span>
        <span>Afdeling</span>
        {/* keeps the header aligned with the action buttons below */}
        <span className={hasActions ? "w-[4.5rem]" : ""} aria-hidden="true" />
      </div>

      <ul
        className={`divide-y divide-line transition-opacity duration-200 ${isFetching ? "opacity-60" : ""}`}
      >
        {rooms.map((room) => {
          const isSelected = selectedIds.has(room.id);

          return (
            <li
              key={room.id}
              className={`group relative grid grid-cols-1 gap-1 px-4 py-3 transition-colors sm:items-center sm:gap-4 ${COLUMNS} ${
                isSelected
                  ? "bg-primary-soft p-1"
                  : "bg-white hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectRoom(room)}
                aria-pressed={isSelected}
                aria-label={`${room.name} ${isSelected ? "deselecteren" : "selecteren"}`}
                className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              />

              <span
                aria-hidden="true"
                className={`bg-brand-vertical pointer-events-none absolute inset-y-0 left-0 w-[3px] transition-opacity duration-200 ${
                  isSelected ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="pointer-events-none flex min-w-0 items-center gap-3 pr-20 sm:pr-0">
                <span
                  className={`relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors duration-300 ${
                    isSelected
                      ? "text-white"
                      : "bg-primary-soft text-primary group-hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-primary transition-opacity duration-300 ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                  {isSelected ? (
                    <Check strokeWidth={2.5} className="relative h-4 w-4" />
                  ) : (
                    <DoorOpen strokeWidth={1.75} className="relative h-4 w-4" />
                  )}
                </span>
                <span className="truncate text-sm font-medium text-ink">{room.name}</span>
              </div>

              <Cell label="Functie" value={room.function} />
              <Cell label="Categorie" value={room.category} badge />
              <Cell label="Afdeling" value={room.section} />

              {hasActions ? (
                <div className="absolute top-3 right-3 z-10 flex w-[4.5rem] items-center justify-end gap-1 sm:static sm:opacity-60 sm:transition-opacity sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                  {onEdit && (
                    <IconButton label={`${room.name} bewerken`} onClick={() => onEdit(room)}>
                      <Pencil strokeWidth={1.75} className="h-4 w-4" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      label={`${room.name} verwijderen`}
                      onClick={() => onDelete(room)}
                      danger
                    >
                      <Trash2 strokeWidth={1.75} className="h-4 w-4" />
                    </IconButton>
                  )}
                </div>
              ) : (
                <span aria-hidden="true" className="hidden sm:block" />
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
        <p className="text-xs text-muted tabular-nums">
          {first}–{last} van {total} {total === 1 ? "ruimte" : "ruimtes"}
          {selectedRooms.length > 0 && (
            <span className="ml-2 font-medium text-primary">
              · {selectedRooms.length} geselecteerd
            </span>
          )}
        </p>

        <div className="flex items-center gap-1">
          <Button onClick={onAddRoom} variant="secondary" icon={Plus} size="sm">
            Ruimte toevoegen
          </Button>

          <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

          <IconButton
            label="Vorige pagina"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft strokeWidth={1.75} className="h-4 w-4" />
          </IconButton>

          <span className="min-w-16 text-center text-xs font-medium text-ink tabular-nums">
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

/* one value; on mobile it shows its label, on desktop the header row does */
function Cell({
  label,
  value,
  badge = false,
}: {
  label: string;
  value: string | null;
  badge?: boolean;
}) {
  return (
    <div className="pointer-events-none flex min-w-0 items-center gap-2 pl-11 text-sm sm:pl-0">
      <span className="text-xs text-muted sm:hidden">{label}:</span>
      {value ? (
        badge ? (
          <span className="inline-flex max-w-full items-center truncate rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-muted">
            {value}
          </span>
        ) : (
          <span className="truncate text-ink">{value}</span>
        )
      ) : (
        <span className="text-muted/50">—</span>
      )}
    </div>
  );
}
