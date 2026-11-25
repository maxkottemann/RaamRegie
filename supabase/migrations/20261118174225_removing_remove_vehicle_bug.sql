create or replace function public.remove_vehicle(p_vehicle_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare 
v_company_id uuid  := public.get_company_id();
begin 

 if v_company_id is null or not public.is_company_admin() then
    raise exception 'Insufficient permissions' using errcode = '42501', hint = 'not_company_admin';
  end if;

if not exists (
    select 1 from public.vehicles
    where id = p_vehicle_id and company_id = v_company_id and archived_at is null
) then
raise exception 'Vehicle not found'
using errcode = 'R0001', hint = 'vehicle_not_found';
end if; 

  if exists (select 1 from public.project_vehicles where vehicle_id = p_vehicle_id) then
    update public.vehicles set archived_at = now()
    where id = p_vehicle_id and company_id = v_company_id;
    return 'archived';
  end if;


  delete from public.vehicles
  where id = p_vehicle_id and company_id = v_company_id;
  return 'deleted';
  end;
  $$;
