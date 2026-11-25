create or replace function public.get_project_co2(p_project_id uuid)
returns table (
  total_distance numeric,
  co2            numeric,
  co2_old        numeric,
  co2_saved      numeric
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    coalesce(sum(pv.distance), 0),
    coalesce(sum(pv.distance * v.co2), 0),
    coalesce(sum(pv.distance * v.co2_old), 0),
    coalesce(sum(pv.distance * (v.co2_old - v.co2)), 0)
  from public.project_vehicles pv
  join public.vehicles v on v.id = pv.vehicle_id
  where pv.project_id = p_project_id;
$$;

grant execute on function public.get_project_co2(uuid) to authenticated;
