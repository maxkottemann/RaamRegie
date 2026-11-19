create or replace function public.create_employee(
    p_name text,
    p_profile_id uuid default null,
    p_vehicle_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$ 
declare
v_company_id uuid := public.get_company_id;
v_employee_id uuid;
 v_vehicle_ids uuid[] := coalesce(p_vehicle_ids, '{}');
begin 
 if v_company_id is null or not public.is_company_admin() then
    raise exception 'Insufficient permissions' using errcode = '42501', hint = 'not_company_admin';
  end if;

  if nullif(trim(p_name),'') is null then
  raise exception 'Name is required' using errcode = '22023', hint = 'name_required';
  end if;

if exists (
  select 1
  from unnest(v_vehicle_ids) as vid
  where not exists (
    select 1 from public.vehicles v
    where v.id = vid and v.company_id = v_company_id and v.archived_at is null
  )
) then
  raise exception 'Vehicle not found'
    using errcode = 'P0002', hint = 'vehicle_not_found';
end if;

  insert into public.employees
  (company_id,name,profile_id)
  values (
    v_company_id,
    p_name,
    p_profile_id
  )
  returning id into v_employee_id;

  insert into public.vehicle_default_employees(
    vehicle_id,employee_id,company_id
  ) select distinct vid,v_employee_id,v_company_id
  from unnest(v_vehicle_ids)as vid;

  return v_employee_id;
  end;
  $$;


  create or replace function public.update_employee(
    p_employee_id uuid,
    p_name text,
    p_profile_id uuid default null,
    p_vehicle_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$ 
declare
v_company_id uuid := public.get_company_id;
v_employee_id uuid;
 v_vehicle_ids uuid[] := coalesce(p_vehicle_ids, '{}');
begin

  if v_company_id is null or not public.is_company_admin() then
    raise exception 'Insufficient permissions' using errcode = '42501', hint = 'not_company_admin';
  end if;

  if nullif(trim(p_name),'') is null then
  raise exception 'Name is required' using errcode = '22023', hint = 'name_required';
  end if;

if exists (
  select 1
  from unnest(v_vehicle_ids) as vid
  where not exists (
    select 1 from public.vehicles v
    where v.id = vid and v.company_id = v_company_id and v.archived_at is null
  )
) then
  raise exception 'Vehicle not found'
    using errcode = 'R0001', hint = 'vehicle_not_found';
end if;

update public.employees
set 
name = trim(p_name),
profile_id = p_profile_id
where id = p_employee_id
and company_id = v_company_id
and archived_at is null
returning id into v_employee_id;

if v_employee_id is null then
raise exception 'Employee not found' 
using errcode = 'R0001', hint = 'employee_not_found';
end if;

return v_employee_id;

end;
$$;


create or replace function public.remove_employee(
       p_employee_id uuid
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
v_company_id uuid := public.get_company_id();
begin

if v_company_id is null or not public.is_company_admin() then
    raise exception 'Insufficient permissions' using errcode = '42501', hint = 'not_company_admin';
  end if;


if not exists (
    select 1 from public.employees where id = p_employee_id and company_id = v_company_id and archived_at is null
)
   then
raise exception 'Employee not found'
using errcode = 'R0001', hint = 'employee_not_found';
end if; 

if exists (
select 1 from public.project_vehicle_employees where employee_id = p_employee_id) then
update public.employees 
set archived_at = now()
where id = p_employee_id and company_id = v_company_id;
return 'archived';
end if;

delete from public.employees
where id = p_employee_id and company_id = v_company_id;
return 'deleted';
end;

$$;





