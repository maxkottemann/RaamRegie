"use client";

import { useItemSelection } from "@/context/SelectItemContext";
import { useRoomsFromStoryWithItemCounts } from "@/hooks/roomHooks";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, DoorOpen, Minus } from "lucide-react";
import { useState } from "react";
import CurtainItemList from "./CurtainItemList";
import { getRoomSelectableItems } from "@/services/itemService";
import { supabase } from "@/lib/browserClient";

export default function CurtainRoomList({ storyId }: { storyId: string }) {
  const {
    data: rooms = [],
    isPending,
    error,
  } = useRoomsFromStoryWithItemCounts(storyId, "curtain");
  const [openId, setOpenId] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="space-y-1 py-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
    );
  }

  if (error)
    return <p className="px-2 py-2.5 text-sm text-danger">Ruimtes konden niet worden geladen.</p>;
  if (rooms.length === 0)
    return <p className="px-2 py-2.5 text-sm text-muted">Geen ruimtes met gordijnen.</p>;

  return (
    <ul className="space-y-0.5 py-1">
      {rooms.map((room) => (
        <RoomRow
          key={room.id}
          room={room}
          storyId={storyId}
          isOpen={openId === room.id}
          onToggleOpen={() => setOpenId(openId === room.id ? null : room.id)}
        />
      ))}
    </ul>
  );
}

interface RoomRowProps {
  room: { id: string; name: string; category?: string | null; item_count: number };
  storyId: string;
  isOpen: boolean;
  onToggleOpen: () => void;
}

function RoomRow({ room, storyId, isOpen, onToggleOpen }: RoomRowProps) {
  const queryClient = useQueryClient();
  const { selectedInRoom, addMany, removeMany } = useItemSelection();
  const [busy, setBusy] = useState(false);

  const selected = selectedInRoom(room.id);
  const allSelected = room.item_count > 0 && selected >= room.item_count;
  const someSelected = selected > 0 && !allSelected;

  async function toggleRoom() {
    const items = await queryClient.query({
      queryKey: ["rooms", room.id, "selectable", "curtain"],
      queryFn: () => getRoomSelectableItems(supabase, room.id, ["curtain"]),
      staleTime: 60_000,
    });
    if (allSelected) removeMany(items.map((i) => i.item_id));
    else addMany(items.map((i) => ({ ...i, room_id: i.room_id ?? "" })));
  }

  return (
    <li>
      <div className="group flex items-center gap-2.5 rounded-md px-2 py-2 transition-colors hover:bg-surface/70">
        {/* select-all checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={allSelected ? "true" : someSelected ? "mixed" : "false"}
          aria-label={`${room.name} volledig selecteren`}
          disabled={busy || room.item_count === 0}
          onClick={toggleRoom}
          className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 ${
            allSelected || someSelected
              ? "border-primary bg-primary text-white"
              : "border-line bg-white hover:border-primary/60"
          } ${busy ? "animate-pulse" : ""}`}
        >
          {allSelected && <Check strokeWidth={3} className="h-2.5 w-2.5" aria-hidden="true" />}
          {someSelected && <Minus strokeWidth={3} className="h-2.5 w-2.5" aria-hidden="true" />}
        </button>

        {/* expand area */}
        <button
          type="button"
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left focus-visible:outline-none"
        >
          <DoorOpen
            strokeWidth={1.75}
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 transition-colors ${isOpen ? "text-primary" : "text-muted group-hover:text-ink-soft"}`}
          />

          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={`truncate text-sm ${isOpen ? "font-semibold text-ink" : "font-medium text-ink-soft group-hover:text-ink"}`}
            >
              {room.name}
            </span>
            {room.category && (
              <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-[11px] font-medium text-muted">
                {room.category}
              </span>
            )}
          </span>

          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums transition-colors ${
              selected > 0 ? "bg-primary-soft text-primary" : "bg-surface text-muted"
            }`}
          >
            {selected > 0 ? (
              <>
                {selected}
                <span className="text-primary/50"> / {room.item_count}</span>
              </>
            ) : (
              room.item_count
            )}
          </span>

          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-muted/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="ml-[15px] border-l border-line pl-3">
          <CurtainItemList roomId={room.id} />
        </div>
      )}
    </li>
  );
}
