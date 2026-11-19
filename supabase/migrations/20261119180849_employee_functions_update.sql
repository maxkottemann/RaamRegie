create or replace function public.create_employee(
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

  insert into public.employees (company_id, name, profile_id)
  values (v_company_id, trim(p_name), p_profile_id)
  returning id into v_employee_id;

  insert into public.vehicle_default_employees (vehicle_id, employee_id, company_id)
  select distinct vid, v_employee_id, v_company_id
  from unnest(v_vehicle_ids) as vid;

  return v_employee_id;
end;
$$;

revoke execute on function public.create_employee(text, uuid, uuid[]) from public, anon;
grant  execute on function public.create_employee(text, uuid, uuid[]) to authenticated;