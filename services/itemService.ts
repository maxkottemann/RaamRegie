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
