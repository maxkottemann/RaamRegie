create or replace function public.update_employee(
  p_employee_id uuid,
  p_name        text,
  p_profile_id  uuid   default null,
  p_vehicle_ids uuid[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_company_id  uuid   := public.get_company_id();
  v_vehicle_ids uuid[] := coalesce(p_vehicle_ids, '{}');
  v_employee_id uuid;
begin
  if v_company_id is null or not public.is_company_admin() then
    raise exception 'Insufficient permissions'
      using errcode = '42501', hint = 'not_company_admin';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception 'Name is required'
      using errcode = '22023', hint = 'name_required';
  end if;

  if p_profile_id is not null and not exists (
    select 1 from public.profiles
    where id = p_profile_id and company_id = v_company_id
  ) then
    raise exception 'Profile not found'
      using errcode = 'P0002', hint = 'profile_not_found';
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

  -- 1. the employee itself
  update public.employees
  set name       = trim(p_name),
      profile_id = p_profile_id
  where id = p_employee_id
    and company_id = v_company_id
    and archived_at is null
  returning id into v_employee_id;

  if v_employee_id is null then
    raise exception 'Employee not found'
      using errcode = 'P0002', hint = 'employee_not_found';
  end if;

  -- 2. default vans: replace the whole set
  delete from public.vehicle_default_employees
  where employee_id = v_employee_id;

  insert into public.vehicle_default_employees (vehicle_id, employee_id, company_id)
  select distinct vid, v_employee_id, v_company_id
  from unnest(v_vehicle_ids) as vid;

  return v_employee_id;
end;
$$;

revoke execute on function public.update_employee(uuid, text, uuid, uuid[]) from public, anon;
grant  execute on function public.update_employee(uuid, text, uuid, uuid[]) to authenticated;