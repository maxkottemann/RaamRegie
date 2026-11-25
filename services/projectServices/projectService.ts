import { ModuleKey } from "@/modules/types/types";
import { Database } from "@/types/database.types";
import { ProjectFormValues } from "@/zodSchemas/projectSchema";
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

type CreateProjectArgs = Database["public"]["Functions"]["create_project"]["Args"];

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
function toCreateProjectArgs(module: ModuleKey, values: ProjectFormValues): CreateProjectArgs {
  return {
    p_module: module,
    p_name: values.name,
    p_location_id: values.location_id,
    p_start_date: values.start_date,
    p_end_date: values.end_date,
    p_description: values.description ?? undefined,
    p_project_code: values.projectCode ?? undefined,
    p_items: values.items.map(({ item_id, planned_quantity, cleaning_method_id }) => ({
      item_id,
      planned_quantity,
      cleaning_method_id,
    })),
    p_vehicles: values.vehicles.map(({ vehicle_id, date, employee_ids }) => ({
      vehicle_id,
      date,
      employee_ids,
    })),
  };
}
export async function createProject(
  supabase: SupabaseClient<Database>,
  module: ModuleKey,
  values: ProjectFormValues,
) {
  const { data, error } = await supabase.rpc("create_project", toCreateProjectArgs(module, values));

  if (error) throw error;
  return data;
}

export async function getProject(supabase: SupabaseClient<Database>, projectId: string) {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "name,profiles!projects_planned_by_fkey(id,name),name,description,start_date,end_date,status,type,location_name,location_address,client_name,internal_id,external_id,project_code,project_items!inner(count)",
    )
    .eq("id", projectId)
    .single();

  if (error) throw error;
  return { ...data, item_count: data.project_items.length };
}

export async function getProjectVehicles(supabase: SupabaseClient<Database>, projectId: string) {
  const { data, error } = await supabase
    .from("project_vehicles")
    .select(
      "distance,work_date,vehicle_id,vehicle_name,license_plate,vehicles!inner(co2,co2_old),project_vehicle_employees(employees(id,name))",
    )
    .eq("project_id", projectId);

  if (error) throw error;
  return data.map((d) => ({
    ...d,
    employees: d.project_vehicle_employees.map((pve) => pve.employees),
    co2Data: d.vehicles,
  }));
}

export async function getProjectCo2Data(supabase: SupabaseClient<Database>, projectId: string) {
  const { data, error } = await supabase
    .rpc("get_project_co2", { p_project_id: projectId })
    .single();

  if (error) throw error;
  return data;
}

export type BasicProjectPage = Awaited<ReturnType<typeof getProjectsForList>>;
export type BasicProjectList = BasicProjectPage["projects"];
export type BasicProjectitem = BasicProjectList[number];

export type ProjectDetail = Awaited<ReturnType<typeof getProject>>;

export type ProjectVehicles = Awaited<ReturnType<typeof getProjectVehicles>>;
export type ProjectVehicle = ProjectVehicles[number];
