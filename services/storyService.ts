import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

type CreateStoryArgs = Database["public"]["Tables"]["stories"]["Insert"];

export async function getStoriesFromLocation(
  supabase: SupabaseClient<Database>,
  locationId: string,
) {
  const { data, error } = await supabase
    .from("stories")
    .select("id, location_id, name, rooms(count)")
    .eq("location_id", locationId)
    .order("name");

  if (error) throw error;

  return data.map(({ rooms, ...story }) => ({
    ...story,
    room_count: rooms[0]?.count ?? 0,
  }));
}
export async function createStory(supabase: SupabaseClient<Database>, args: CreateStoryArgs) {
  const { error } = await supabase.from("stories").insert(args);

  if (error) throw error;
}

export type LocationStories = Awaited<ReturnType<typeof getStoriesFromLocation>>;
export type LocationStory = LocationStories[number];
