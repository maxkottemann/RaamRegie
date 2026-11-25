import { supabase } from "@/lib/browserClient";
import {
  createRoom,
  deleteRoom,
  getRoomsFromStory,
  getRoomsFromStoryWithItemCounts,
  toRoomInsert,
  toRoomUpdate,
  updateRoom,
} from "@/services/roomService";
import { RoomFormvalues } from "@/zodSchemas/roomSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRoomsFromStory(id: string | undefined, page = 0, page_size = 25) {
  return useQuery({
    queryKey: ["stories", id, "rooms", { page, page_size }],
    queryFn: () => getRoomsFromStory(supabase, id!, page, page_size),
    enabled: !!id,
  });
}

export function useRoomsFromStoryWithItemCounts(
  id: string | undefined,
  module: "curtain" | "floor",
) {
  return useQuery({
    queryKey: ["stories", id, "rooms"],
    queryFn: () => getRoomsFromStoryWithItemCounts(supabase, id!, module),
    enabled: !!id,
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: RoomFormvalues }) =>
      updateRoom(supabase, id, toRoomUpdate(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}
export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoom(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      locationId,
      storyId,
      values,
    }: {
      locationId: string;
      storyId: string;
      values: RoomFormvalues;
    }) => {
      console.log(values);
      return createRoom(supabase, toRoomInsert(values, locationId, storyId));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stories"] }),
  });
}
