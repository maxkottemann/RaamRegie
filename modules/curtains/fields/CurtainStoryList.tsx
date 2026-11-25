import { useItemSelection } from "@/context/SelectItemContext";
import { useLocationStories } from "@/hooks/storyHooks";
import { Check, ChevronDown, Layers, Minus } from "lucide-react";
import CurtainRoomList from "./CurtainRoomlist";
import { useState } from "react";
import { LocationStory } from "@/services/storyService";
import { useQueryClient } from "@tanstack/react-query";
import { getLocationSelectableItems, getStorySelectableItems } from "@/services/itemService";
import { supabase } from "@/lib/browserClient";
import { useItemCountByLocationId, useItemCountByStoryId } from "@/hooks/itemHooks";

export default function CurtainStoryList({ locationId }: { locationId: string }) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data: stories } = useLocationStories(locationId);
  const { data: item_count } = useItemCountByLocationId(locationId, ["curtain"]);
  const { addMany, removeMany, items: selectedItems } = useItemSelection();

  async function toggleLocation() {
    setBusy(true);
    try {
      const items = await queryClient.query({
        queryKey: ["items", locationId],
        queryFn: () => getLocationSelectableItems(supabase, locationId, ["curtain"]),
        staleTime: 60_000,
      });
      if (items.length === selectedItems.length) {
        removeMany(items.map((i) => i.item_id));
      } else {
        addMany(
          items.map((i) => ({
            item_id: i.item_id,
            quantity: i.quantity,
            room_id: i.room_id ?? "",
            story_id: i.story_id,
          })),
        );
      }
    } finally {
      setBusy(false);
    }
  }

  const total = item_count?.item_count ?? 0;
  const selectedCount = selectedItems.length;
  const allSelected = total > 0 && selectedCount >= total;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="overflow-hidden rounded-lg border border-line">
      {/* select whole location */}
      <div className="flex items-center gap-3 border-b border-line bg-surface/50 px-4 py-2.5">
        <button
          type="button"
          role="checkbox"
          aria-checked={allSelected ? "true" : someSelected ? "mixed" : "false"}
          aria-label="Hele locatie selecteren"
          disabled={busy || total === 0}
          onClick={toggleLocation}
          className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 ${
            allSelected || someSelected
              ? "border-primary bg-primary text-white"
              : "border-line bg-white hover:border-primary/60"
          } ${busy ? "animate-pulse" : ""}`}
        >
          {allSelected && <Check strokeWidth={3} className="h-3 w-3" aria-hidden="true" />}
          {someSelected && <Minus strokeWidth={3} className="h-3 w-3" aria-hidden="true" />}
        </button>

        <button
          type="button"
          onClick={toggleLocation}
          disabled={busy || total === 0}
          className="min-w-0 flex-1 cursor-pointer text-left text-sm font-medium text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed"
        >
          {allSelected ? "Alles deselecteren" : "Hele locatie selecteren"}
        </button>

        <span className="shrink-0 text-xs text-muted tabular-nums">
          <span
            className={selectedCount > 0 ? "font-semibold text-primary" : "font-semibold text-ink"}
          >
            {selectedCount}
          </span>{" "}
          / {total} geselecteerd
        </span>
      </div>

      <ul className="divide-y divide-line">
        {stories
          ?.filter((s) => s.room_count > 0)
          .map((story) => (
            <li key={story.id}>
              <StoryListItem story={story} />
            </li>
          ))}
      </ul>
    </div>
  );
}

function StoryListItem({ story }: { story: LocationStory }) {
  const queryClient = useQueryClient();
  const { data: item_count } = useItemCountByStoryId(story.id, "curtain");

  const { selectedInStory, addMany, removeMany } = useItemSelection();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const selected = selectedInStory(story.id);
  const total = item_count ?? 0;
  const allSelected = total > 0 && selected >= total;
  const someSelected = selected > 0 && !allSelected;

  async function toggleStory() {
    setBusy(true);
    try {
      const items = await queryClient.query({
        queryKey: ["stories", story.id, "selectable", "curtain"],
        queryFn: () => getStorySelectableItems(supabase, story.id, ["curtain"]),
        staleTime: 60_000,
      });
      if (allSelected) removeMany(items.map((i) => i.item_id));
      else addMany(items.map((i) => ({ ...i, room_id: i.room_id ?? "" })));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div
        className={`group flex items-center gap-3 px-4 py-3 transition-colors ${
          open ? "bg-surface/40" : "hover:bg-surface/50"
        }`}
      >
        {/* select-all checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={allSelected ? "true" : someSelected ? "mixed" : "false"}
          aria-label={`${story.name} volledig selecteren`}
          disabled={busy || total === 0}
          onClick={toggleStory}
          className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40 ${
            allSelected || someSelected
              ? "border-primary bg-primary text-white"
              : "border-line bg-white hover:border-primary/60"
          } ${busy ? "animate-pulse" : ""}`}
        >
          {allSelected && <Check strokeWidth={3} className="h-3 w-3" aria-hidden="true" />}
          {someSelected && <Minus strokeWidth={3} className="h-3 w-3" aria-hidden="true" />}
        </button>

        {/* expand area */}
        <button
          type="button"
          onClick={() => setOpen((val) => !val)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left focus-visible:outline-none"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ring-1 transition-colors ring-inset ${
              selected > 0
                ? "bg-primary-soft text-primary ring-primary/15"
                : "bg-surface text-muted ring-line group-hover:bg-primary-soft group-hover:text-primary group-hover:ring-primary/15"
            }`}
          >
            <Layers strokeWidth={1.75} className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-ink group-hover:text-primary">
              {story.name}
            </span>
            <span className="block text-xs text-muted tabular-nums">
              {story.room_count} {story.room_count === 1 ? "ruimte" : "ruimtes"}
              {total > 0 && <> · {total} objecten</>}
            </span>
          </span>

          {selected > 0 && (
            <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary tabular-nums">
              {selected}
              <span className="text-primary/50"> / {total}</span>
            </span>
          )}

          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-hover:text-ink-soft ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="pr-4 pb-2">
          <div className="ml-[66px] border-l border-line pl-3">
            <CurtainRoomList storyId={story.id} />
          </div>
        </div>
      )}
    </>
  );
}
