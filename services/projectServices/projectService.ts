import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getProjectsForList(
  supabase: SupabaseClient<Database>,
  page = 0,
  pageSize = 25,
) {
  const from = page * 25;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("projects")
    .select("id,name,start_date,end_date", { count: "exact" })
    .order("status", { ascending: true })
    .range(from, to);

  if (error) throw error;
  return { projects: data ?? [], count };
}
