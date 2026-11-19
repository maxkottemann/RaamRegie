create or replace function public.create_vehicle(
   p_name          text,
  p_license_plate text default null,
  p_street        text default null,
  p_number        text default null,
  p_postal_code   text default null,
  p_city          text default null,
  p_co2           numeric default null,
  p_co2_old       numeric default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
v_company_id uuid := public.get_company_id();
v_id uuid;
begin
  if v_company_id is null or not public.is_company_admin() then
    raise exception 'Insufficient permissions' using errcode = '42501', hint = 'not_company_admin';
  end if;

  if nullif(trim(p_name),'') is null then
  raise exception 'Name is required' using errcode = '22023', hint = 'name_required';
  end if;

  insert into public.vehicles
  (company_id,name,license_plate,city,postal_code,street_number,co2,co2_old)
  values (
    v_company_id,
    trim(p_name),
    nullif(upper(trim(p_license_plate)), ''),
    nullif(trim(p_street), ''),
    nullif(trim(p_number), ''),
    nullif(upper(trim(p_postal_code)), ''),
    nullif(trim(p_city), ''),
    p_co2,
    p_co2_old
  ) 
  returning id into v_id;

  return v_id;

  end;
  $$;


revoke execute on function public.create_vehicle(text, text, text, text, text, text, numeric, numeric) from public, anon;
grant  execute on function public.create_vehicle(text, text, text, text, text, text, numeric, numeric) to authenticated;

create or replace function public.update_vehicle(
    p_vehicle_id uuid,
    p_name          text,
    p_license_plate text default null,
    p_street        text default null,
    p_number        text default null,
    p_postal_code   text default null,
    p_city          text default null,
    p_co2           numeric default null,
    p_co2_old       numeric default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
v_company_id uuid := public.get_company_id();
v_id uuid;
begin
  if v_company_id is null or not public.is_company_admin() then
    raise exception 'Insufficient permissions' using errcode = '42501', hint = 'not_company_admin';
  end if;

  if nullif(trim(p_name),'') is null then
  raise exception 'Name is required' using errcode = '22023', hint = 'name_required';
  end if;

  update public.vehicles
  set 
  name = trim(p_name),
   license_plate = nullif(upper(trim(p_license_plate)), ''),
      street        = nullif(trim(p_street), ''),
      number        = nullif(trim(p_number), ''),
      postal_code   = nullif(upper(trim(p_postal_code)), ''),
      city          = nullif(trim(p_city), ''),
      co2           = p_co2,
      co2_old       = p_co2_old
  where id = p_vehicle_id
  and company_id = v_company_id
  and archived_at is null
  returning id into v_id;

  if v_id is null then
  raise exception 'Vehicle not found'
  using errcode = 'R0001', hint ='vehicle_not_found';
  end if;

  return v_id;

  end;
  $$;

  revoke execute on function public.update_vehicle(uuid, text, text, text, text, text, text, numeric, numeric) from public, anon;
grant  execute on function public.update_vehicle(uuid, text, text, text, text, text, text, numeric, numeric) to authenticated;


alter table public.vehicle_default_employees
  drop constraint vehicle_default_employees_employee_id_fkey,
  add constraint vehicle_default_employees_employee_id_fkey
    foreign key (employee_id) references public.employees(id) on delete cascade;

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
    select 1 from public.vehciles
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

revoke execute on function public.remove_vehicle(uuid) from public, anon;
grant  execute on function public.remove_vehicle(uuid) to authenticated;