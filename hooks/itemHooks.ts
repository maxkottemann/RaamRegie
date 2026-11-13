import { supabase } from "@/lib/browserClient";
import { createCurtainItem, deleteItem, getRoomitems } from "@/services/itemService";
import { CurtainFormInput, CurtainFormValues } from "@/zodSchemas/itemSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useItemsFromRoom(roomId: string | undefined, page = 0, page_size = 25) {
  return useQuery({
    queryKey: ["rooms", roomId, "items", { page, page_size }],
    queryFn: () => getRoomitems(supabase, roomId!, page, page_size),
    enabled: !!roomId,
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
