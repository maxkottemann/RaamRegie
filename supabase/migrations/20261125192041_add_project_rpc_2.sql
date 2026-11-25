
  create or replace function public.module_categories(p_module public.module_key)
returns public.item_category[]
language sql
immutable
set search_path = ''
as $$
  select case p_module
    when 'curtains' then array['curtain']::public.item_category[]
    else array[]::public.item_category[]
  end;
$$;

  create or replace function public.create_project(
    p_module public.module_key,
    p_location_id uuid,
    p_name text,
    p_start_date date,
    p_end_date date,
    p_items jsonb,
    p_vehicles jsonb default '[]',
    p_description text default null,
    p_project_code text default null
  )
  returns uuid
  language plpgsql
  security definer
  set search_path = ''
  as $$
  declare
    v_company_id uuid := public.get_company_id();
    v_user_id uuid := auth.uid();
  v_categories  public.item_category[] := public.module_categories(p_module);
    v_items       jsonb := coalesce(p_items, '[]');
    v_vehicles    jsonb := coalesce(p_vehicles, '[]');
    v_location record;
    v_project_id uuid;
  begin
  /*basic auth*/
    if v_company_id is null or v_user_id is null then
    raise exception 'Insufficient permissions' using errcode ='42501', hint = 'Geen toegang';
    end if;

    if not public.is_company_admin() then
    raise exception 'Insufficient permissions' using errcode = '42501', hint = 'Geen toegang';
    end if;

    if not exists (
        select 1 from public.company_modules
        where company_id = v_company_id and module = p_module
    ) then raise exception 'No access to this module' using errcode = '42501', hint = 'Geen toegang tot module';
    end if;

/* input validation */
    if nullif(trim(p_name),'') is null then
    raise exception 'Name is required' using errcode = '22023', hint = 'Naam is verplicht';
    end if;

    if p_start_date is null or p_end_date is null then
  raise exception 'Period is required' using errcode = '22023', hint = 'Start en einddatum verplicht';
  end if;

   if p_end_date < p_start_date then
    raise exception 'End date before start date' using errcode = '22023', hint = 'Einddatum mag niet voor startdatum liggen';
  end if;

  if jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) = 0 then
  raise exception 'At least one item is required' using errcode = '22023', hint = 'Selecteer minimaal 1 object';
  end if;

     if jsonb_typeof(v_vehicles) <> 'array' then
    raise exception 'Invalid vehicles' using errcode = '22023', hint = 'vehicles_invalid';
  end if;

  if not exists (
  select 1
  from public.get_company_location_ids() as l(id)
  where l.id = p_location_id
) then
  raise exception 'Location not found'
    using errcode = 'P0002', hint = 'location_not_found';
end if;

  select l.id,
  l.name,
  nullif(concat_ws(' ', l.postal_code, l.city), '') as address,
    c.name as client_name
    into v_location
    from public.locations l
    left join public.clients on c.id = l.client_id
    where l.id = p_location_id
    and l.deleted_at is null;

      if not found then
    raise exception 'Location not found' using errcode = 'P0002', hint = 'locatie niet gevonden';
  end if;

  if exists (
    select 1 
    from jsonb_array_elements(v_items) as p
    left join public.items i
    on i.id = (p->>'item_id')::uuid
    and i.location_id = p_location_id
    and i.category = any(v_categories)
    and i.deleted_at is null
    and i_room_id is not null
    where i.id is null
    or coalesce((p->>'planned_quantity')::numeric,0)<= 0
  )then
    raise exception 'Item not found or invalid' using errcode = 'P0002', hint = 'item_not_found';
  end if;

  if(select count(*)from jsonb_array_elements(v_item)) <> (select count (distinct ->> 'item_id')from jsonb_array_elements) as p  then
    raise exception 'Duplicate items' using errcode = '22023', hint = 'items_duplicate';
  end if;

  if exists (
    select 1 from jsonb_array_elements(v_items) as p
    left join public.cleaning_methods m
    on m.id = (p->>'cleaing_method_id')::uuid
    and m.company_id = v_company_id
    and m.module = p_module
    and m.archived_at is null
    where m.id is null
  )then
    raise exception 'Cleaning method not found' using errcode = 'P0002', hint = 'cleaning_method_not_found';
  end if;

  if exists (
    select 1 from jsonb_array_elements(v_vehicles) as v
    left join public.vehicles x
    on x.id = (v->>'vehicle_id')::uuid
    and x.company_id = v_company_id
    and x.archived_at is null
    where x.id is null or (v->>'date')::date not between p_start_date and p_end_date
  )then
    raise exception 'Vehicle not found or date outside period' using errcode = 'P0002', hint = 'vehicle_not_found';
  end if;

    if exists (
    select 1
    from jsonb_array_elements(v_vehicles) as v
    cross join jsonb_array_elements_text(coalesce(v->'employee_ids', '[]')) as e(employee_id)
    left join public.employees emp
      on emp.id = e.employee_id::uuid
     and emp.company_id = v_company_id
     and emp.archived_at is null
    where emp.id is null
  ) then
    raise exception 'Employee not found' using errcode = 'P0002', hint = 'employee_not_found';
  end if;

  insert into public.projects(
    company_id,location_id,module,planned_by,
    name,description,project_code,start_date,end_date,
    location_name,location_address,client_name
  ) values (
    v_company_id, p_location_id, p_module, v_user_id,
    trim(p_name), nullif(trim(p_description), ''), nullif(trim(p_project_code), ''),
    p_start_date, p_end_date,
    v_location.name, v_location.address, v_location.client_name
  )
  returning id into v_project_id;

  insert into public.project_items(
    project_id,company_id,location_id,item_id,item_category,room_id,
    cleaning_method_id,planned_quantity,
    item_name,sotry_name,room_name
  ) select 
     v_project_id, v_company_id, p_location_id, i.id, i.category, i.room_id,
    (p->>'cleaning_method_id')::uuid, (p->>'planned_quantity')::numeric,
    i.name, s.name, r.name
  from jsonb_array_elements(v_items) as p
  join public.items i on i.id = (p->>'item_id')::uuid
  join public.rooms r on i.room_id = r.id
  join public.stories s on r.story_id = s.id;


with inserted as (
    insert into public.project_vehicles (
      project_id, company_id, location_id, vehicle_id, work_date, vehicle_name, license_plate
    )
    select distinct on ((v->>'vehicle_id')::uuid, (v->>'date')::date)
      v_project_id, v_company_id, p_location_id,
      x.id, (v->>'date')::date, x.name, x.license_plate
    from jsonb_array_elements(v_vehicles) as v
    join public.vehicles x on x.id = (v->>'vehicle_id')::uuid
    returning id, vehicle_id, date
  )
  insert into public.project_vehicle_employees (
    project_vehicle_id, company_id, location_id, employee_id, employee_name
  )
  select distinct
    ins.id, v_company_id, p_location_id, emp.id, emp.name
  from inserted ins
  join jsonb_array_elements(v_vehicles) as v
    on (v->>'vehicle_id')::uuid = ins.vehicle_id
   and (v->>'date')::date = ins.date
  cross join jsonb_array_elements_text(coalesce(v->'employee_ids', '[]')) as e(employee_id)
  join public.employees emp on emp.id = e.employee_id::uuid;

  return v_project_id;

  end;
  $$;

  revoke execute on function public.create_project(
  public.module_key, uuid, text, date, date, jsonb, jsonb, text, text
) from public, anon;

grant execute on function public.create_project(
  public.module_key, uuid, text, date, date, jsonb, jsonb, text, text
) to authenticated;