import { ItemCategory } from "@/types/constantsTypes";
import { Database } from "@/types/database.types";
import { CurtainFormValues } from "@/zodSchemas/itemSchema";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getRoomitems(
  supabase: SupabaseClient<Database>,
  roomId: string,
  page = 0,
  pageSize = 25,
) {
  const from = page * 25;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("items")
    .select("id,name,state,status,quantity,last_maintenance,category", { count: "exact" })
    .eq("room_id", roomId)
    .order("name", { ascending: true })
    .range(from, to);

  if (error) throw error;
  return { items: data, total: count ?? 0 };
}

export async function getRoomItemsByCategory(
  supabase: SupabaseClient<Database>,
  roomId: string,
  page = 0,
  pageSize = 25,
  module: "curtain" | "floor",
) {
  const from = page * 25;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("items")
    .select(
      "id,name,state,status,quantity,last_maintenance,category,qr_code_id,curtain_details(height,lower_width,curtain_types(name)),rooms(id,stories(id))",
      {
        count: "exact",
      },
    )
    .eq("room_id", roomId)
    .eq("category", module)
    .order("name", { ascending: true })
    .range(from, to);

  if (error) throw error;
  return { items: data, total: count ?? 0 };
}

export async function getRoomSelectableItems(
  supabase: SupabaseClient<Database>,
  roomId: string,
  categories: ItemCategory[],
) {
  const { data, error } = await supabase
    .from("items")
    .select("id,quantity,room_id,rooms!inner(story_id)")
    .eq("room_id", roomId)
    .in("category", categories);

  if (error) throw error;

  return data.map((d) => ({
    item_id: d.id,
    quantity: d.quantity,
    room_id: d.room_id,
    story_id: d.rooms.story_id,
  }));
}

export async function getItemCountByStory(
  supabase: SupabaseClient<Database>,
  storyId: string,
  category: ItemCategory,
) {
  const { data, error } = await supabase.rpc("get_item_count_by_story", {
    p_story_id: storyId,
    p_category: category,
  });

  if (error) throw error;
  return data;
}

export async function getStorySelectableItems(
  supabase: SupabaseClient<Database>,
  storyId: string,
  categories: ItemCategory[],
) {
  const { data, error } = await supabase
    .from("items")
    .select("id,quantity,room_id,rooms!inner(story_id)")
    .eq("rooms.story_id", storyId)
    .in("category", categories);

  if (error) throw error;
  return data.map((d) => ({
    item_id: d.id,
    quantity: d.quantity,
    room_id: d.room_id,
    story_id: d.rooms.story_id,
  }));
}

export async function getLocationSelectableItems(
  supabase: SupabaseClient<Database>,
  locationId: string,
  categories: ItemCategory[],
) {
  const { data, error } = await supabase
    .from("items")
    .select("id,quantity,room_id,rooms!inner(story_id)")
    .eq("location_id", locationId)
    .in("category", categories);

  if (error) throw error;
  return data.map((d) => ({
    item_id: d.id,
    quantity: d.quantity,
    room_id: d.room_id,
    story_id: d.rooms.story_id,
  }));
}

export async function getLocationSelectableItemsCount(
  supabase: SupabaseClient<Database>,
  locationId: string,
  categories: ItemCategory[],
) {
  const { count } = await supabase
    .from("items")
    .select("id", { count: "exact" })
    .eq("location_id", locationId)
    .in("category", categories);

  return { item_count: count ?? 0 };
}

export async function deleteItem(supabase: SupabaseClient<Database>, itemId: string) {
  const { error } = await supabase.rpc("soft_delete_item", {
    p_item_id: itemId,
  });

  if (error) throw error;
}

export async function createCurtainItem(
  supabase: SupabaseClient,
  roomId: string,
  values: CurtainFormValues,
) {
  const { data, error } = await supabase.rpc(
    "create_curtain_item",
    toCreateCurtainArgs(roomId, values),
  );

  console.log(error);

  if (error) throw error;

  return data;
}

export function toCreateCurtainArgs(roomId: string, values: CurtainFormValues) {
  return {
    p_room_id: roomId,
    p_name: values.item.name,
    p_height: values.details.height,
    p_lower_width: values.details.lower_width,
    p_quantity: values.item.quantity,
    p_manufacturer_id: values.item.manufacturer_id,
    p_qr_code_id: values.item.qr_code_id,
    p_rfid_code: values.item.rfid_code,
    p_color: values.details.color,
    p_purchase_date: values.details.purchase_date,
    p_upper_width: values.details.upper_width,
    p_curtain_type_id: values.details.curtain_type_id,
    p_material_id: values.details.material_id,
  };
}
export type ItemPage = Awaited<ReturnType<typeof getRoomitems>>;
export type Items = ItemPage["items"];
export type Item = Items[number];
