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
  (company_id,name,license_plate,city,postal_code,street,number,co2,co2_old)
  values (
    v_company_id,
    trim(p_name),
    nullif(upper(trim(p_license_plate)), ''),
    nullif(trim(p_city), ''),
    nullif(upper(trim(p_postal_code)), ''),
    nullif(trim(p_street), ''),
    nullif(trim(p_number), ''),
    p_co2,
    p_co2_old
  ) 
  returning id into v_id;

  return v_id;

  end;
  $$;