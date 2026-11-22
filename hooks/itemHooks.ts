import { supabase } from "@/lib/browserClient";
import {
  createCurtainItem,
  deleteItem,
  getItemCountByStory,
  getLocationSelectableItemsCount,
  getRoomitems,
  getRoomItemsByCategory,
} from "@/services/itemService";
import { ItemCategory } from "@/types/constantsTypes";
import { CurtainFormInput, CurtainFormValues } from "@/zodSchemas/itemSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useItemsFromRoom(roomId: string | undefined, page = 0, page_size = 25) {
  return useQuery({
    queryKey: ["rooms", roomId, "items", { page, page_size }],
    queryFn: () => getRoomitems(supabase, roomId!, page, page_size),
    enabled: !!roomId,
  });
}

export function useItemsFromRoomsByCategory(
  roomId: string | undefined,
  page = 0,
  page_size = 25,
  module: "curtain" | "floor",
) {
  return useQuery({
    queryKey: ["rooms", roomId, "items", { page, page_size }],
    queryFn: () => getRoomItemsByCategory(supabase, roomId!, page, page_size, module),
    enabled: !!roomId,
  });
}

export function useItemCountByStoryId(storyId: string | undefined, category: ItemCategory) {
  return useQuery({
    queryKey: ["items", storyId],
    queryFn: () => getItemCountByStory(supabase, storyId!, category),
    enabled: !!storyId,
  });
}

export function useItemCountByLocationId(
  locationId: string | undefined,
  categories: ItemCategory[],
) {
  return useQuery({
    queryKey: ["items", locationId, "counts"],
    queryFn: () => getLocationSelectableItemsCount(supabase, locationId!, categories),
    enabled: !!locationId,
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteItem(supabase, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Rooms"] });
      queryClient.invalidateQueries({ queryKey: ["Items"] });
    },
  });
}

export function useCreateCurtainItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, values }: { roomId: string; values: CurtainFormValues }) =>
      createCurtainItem(supabase, roomId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
}
