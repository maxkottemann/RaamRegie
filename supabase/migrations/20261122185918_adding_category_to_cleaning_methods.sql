
alter table public.cleaning_methods
  add column if not exists module public.module_key not null;

create or replace function public.create_cleaning_method(
  p_name               text,
  p_module             public.module_key,
  p_description        text    default null,
  p_water_usage        numeric default null,
  p_waste_water        numeric default null,
  p_chemical_usage     numeric default null,
  p_electricity        numeric default null,
  p_packaging          numeric default null,
  p_water_usage_old    numeric default null,
  p_waste_water_old    numeric default null,
  p_chemical_usage_old numeric default null,
  p_electricity_old    numeric default null,
  p_packaging_old      numeric default null
)
returns uuid 
language plpgsql
security definer
set search_path = ''
as $$
declare
v_company_id uuid := public.get_company_id();
v_cleaning_method_id uuid;
begin
  if v_company_id is null or not public.is_company_admin() then
    raise exception 'Insufficient permissions'
      using errcode = '42501', hint = 'not_company_admin';
  end if;

  if nullif(trim(p_name), '') is null then
    raise exception 'Name is required'
      using errcode = '22023', hint = 'name_required';
  end if;

  if not exists (
    select 1 from public.company_modules where company_id = v_company_id and module = p_module
  ) then raise exception 'No access to this module' using errcode = '42501', hint = 'no_module_access';
  end if;

  insert into public.cleaning_methods (
  company_id,
  name,
  description,
  water_usage,
  waste_water,
  chemical_usage,
  electricity,
  packaging,
  water_usage_old,
  waste_water_old,
  chemical_usage_old,
  electricity_old,
  packaging_old,
  module
)
values (
  v_company_id,
  trim(p_name),
  nullif(trim(p_description), ''),
  p_water_usage,
  p_waste_water,
  p_chemical_usage,
  p_electricity,
  p_packaging,
  p_water_usage_old,
  p_waste_water_old,
  p_chemical_usage_old,
  p_electricity_old,
  p_packaging_old,
  p_module
)
returning id into v_cleaning_method_id;

return v_cleaning_method_id;

end;
$$;

  revoke execute on function public.create_cleaning_method(text, public.module_key, text, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric) from public, anon;
grant  execute on function public.create_cleaning_method(text, public.module_key, text, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric, numeric) to authenticated;