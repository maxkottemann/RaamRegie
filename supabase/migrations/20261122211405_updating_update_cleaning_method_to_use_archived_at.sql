create or replace function public.update_cleaning_method(
    p_cleaning_method_id uuid,
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


update public.cleaning_methods
set
  name               = trim(p_name),
  description        = nullif(trim(p_description), ''),
  water_usage        = p_water_usage,
  waste_water        = p_waste_water,
  chemical_usage     = p_chemical_usage,
  electricity        = p_electricity,
  packaging          = p_packaging,
  water_usage_old    = p_water_usage_old,
  waste_water_old    = p_waste_water_old,
  chemical_usage_old = p_chemical_usage_old,
  electricity_old    = p_electricity_old,
  packaging_old      = p_packaging_old
where id = p_cleaning_method_id
  and company_id = v_company_id
  and archived_at is null
returning id into v_cleaning_method_id;

if v_cleaning_method_id is null then
  raise exception 'Cleaning method not found'
    using errcode = 'P0002', hint = 'cleaning_method_not_found';
end if;

return v_cleaning_method_id;

end;
$$;