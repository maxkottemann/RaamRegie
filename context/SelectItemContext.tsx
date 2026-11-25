import { PlannedItem } from "@/zodSchemas/projectSchema";
import { createContext, ReactNode, use, useMemo } from "react";

export type NewItem = {
  item_id: string;
  quantity: number;
  room_id: string;
  story_id: string;
};

interface Selection {
  items: PlannedItem[];
  count: number;
  selectedInStory: (storyId: string) => number; // ← was missing
  selectedInRoom: (roomId: string) => number;
  isSelected: (itemId: string) => boolean;
  get: (itemId: string) => PlannedItem | undefined;
  toggle: (item: NewItem) => void;
  addMany: (items: NewItem[]) => void;
  removeMany: (itemIds: string[]) => void;
  update: (itemId: string, patch: Partial<PlannedItem>) => void;
}

const SelectionContext = createContext<Selection | null>(null);

export function SelectionProvider({
  value,
  onChange,
  defaultMethodId = "846edf44-40b3-4d30-9e90-80c05e565bbd",
  children,
}: {
  value: PlannedItem[];
  onChange: (items: PlannedItem[]) => void;
  defaultMethodId: string;
  children: ReactNode;
}) {
  const selection = useMemo<Selection>(() => {
    const byId = new Map(value.map((v) => [v.item_id, v]));
    const toPlanned = (i: NewItem): PlannedItem => ({
      item_id: i.item_id,
      planned_quantity: i.quantity,
      cleaning_method_id: defaultMethodId,
      room_id: i.room_id,
      story_id: i.story_id,
    });

    return {
      items: value,
      count: value.length,
      selectedInStory: (storyId: string) => value.filter((v) => v.story_id === storyId).length,
      selectedInRoom: (roomId: string) => value.filter((v) => v.room_id === roomId).length,
      isSelected: (id) => byId.has(id),
      get: (id) => byId.get(id),

      toggle: (item) =>
        onChange(
          byId.has(item.item_id)
            ? value.filter((v) => v.item_id !== item.item_id)
            : [...value, toPlanned(item)],
        ),

      addMany: (items) =>
        onChange([...value, ...items.filter((i) => !byId.has(i.item_id)).map(toPlanned)]),

      removeMany: (ids) => {
        const remove = new Set(ids);
        onChange(value.filter((v) => !remove.has(v.item_id)));
      },

      update: (id, patch) =>
        onChange(value.map((v) => (v.item_id === id ? { ...v, ...patch } : v))),
    };
  }, [value, onChange, defaultMethodId]);

  return <SelectionContext value={selection}>{children}</SelectionContext>;
}

export function useItemSelection() {
  const context = use(SelectionContext);
  if (!context) throw new Error("useItemselection must be used inside selectionProvider");
  return context;
}
