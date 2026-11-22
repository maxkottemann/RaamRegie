import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export type ProjectFilters = {
  search?: string;
  status?: Database["public"]["Enums"]["project_status"];
  locationId?: string;
  from?: string; // "YYYY-MM-DD"
  to?: string;
  page?: number;
};

const PAGE_SIZE = 25;

export async function getProjectsForList(
  supabase: SupabaseClient<Database>,
  filters: ProjectFilters,
) {
  const page = filters.page ?? 0;

  let query = supabase
    .from("projects")
    .select(
      "id, name, project_code, description,status, start_date, end_date, location_name, client_name,internal_id",
      {
        count: "exact",
      },
    )
    .is("deleted_at", null)
    .order("start_date", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.locationId) query = query.eq("location_id", filters.locationId);
  if (filters.from) query = query.gte("start_date", filters.from);
  if (filters.to) query = query.lte("start_date", filters.to);

  const q = filters.search?.trim().replace(/[%,()]/g, "");
  if (q) {
    query = query.or(
      `name.ilike.%${q}%,project_code.ilike.%${q}%,location_name.ilike.%${q}%,client_name.ilike.%${q}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) throw error;
  return { projects: data ?? [], count: count ?? 0, pageSize: PAGE_SIZE };
}

export type BasicProjectPage = Awaited<ReturnType<typeof getProjectsForList>>;
export type BasicProjectList = BasicProjectPage["projects"];
export type BasicProjectitem = BasicProjectList[number];
