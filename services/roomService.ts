import { Database, TablesInsert, TablesUpdate } from "@/types/database.types";
import { RoomFormvalues } from "@/zodSchemas/roomSchema";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getRoomsFromStory(
  supabase: SupabaseClient<Database>,
  storyId: string,
  page = 0,
  pageSize = 25,
) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("rooms")
    .select("id, name, function, category, section", { count: "exact" })
    .eq("story_id", storyId)
    .order("name", { ascending: true })
    .range(from, to);

  if (error) throw error;
  return { rooms: data, total: count ?? 0 };
}

export async function createRoom(supabase: SupabaseClient, values: TablesInsert<"rooms">) {
  const { data, error } = await supabase.from("rooms").insert(values);

  if (error) throw error;
  return data;
}

export async function updateRoom(
  supabase: SupabaseClient<Database>,
  roomId: string,
  values: TablesUpdate<"rooms">,
) {
  const { data, error } = await supabase.from("rooms").update(values).eq("id", roomId);

  if (error) throw error;
  return data;
}

export async function deleteRoom(supabase: SupabaseClient<Database>, roomId: string) {
  const { error } = await supabase.rpc("soft_delete_room_with_items", {
    p_room_id: roomId,
  });

  if (error) throw error;
}

export function toRoomUpdate(values: RoomFormvalues): TablesUpdate<"rooms"> {
  return {
    name: values.name,
    function: values.function,
    category: values.category,
    section: values.section,
  };
}

export function toRoomInsert(
  values: RoomFormvalues,
  locationId: string,
  storyId: string,
): TablesInsert<"rooms"> {
  return {
    name: values.name,
    function: values.function,
    category: values.category,
    section: values.section,
    location_id: locationId,
    story_id: storyId,
  };
}

export type StoryRoomsPage = Awaited<ReturnType<typeof getRoomsFromStory>>;
export type StoryRooms = StoryRoomsPage["rooms"];
export type StoryRoom = StoryRooms[number];
