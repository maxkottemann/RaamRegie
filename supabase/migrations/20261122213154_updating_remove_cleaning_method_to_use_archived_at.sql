create or replace function public.delete_cleaning_method(
    p_cleaning_method_id uuid
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
    raise exception 'Insufficient permissions'
      using errcode = '42501', hint = 'not_company_admin';
  end if;

  if not exists (
    select 1 from public.cleaning_methods where company_id = v_company_id and id = p_cleaning_method_id and archived_at is null
  )   then
raise exception 'Cleaningmethod not found'
using errcode = 'R0001', hint = 'cleaning_method_not_found';
end if; 

if exists (
    select 1 from public.project_items where cleaning_method_id = p_cleaning_method_id
) then update public.cleaning_methods 
set archived_at = now()
where id = p_cleaning_method_id and company_id = v_company_id;
return 'archived';
end if;

delete from public.cleaning_methods
where id = p_cleaning_method_id and company_id = v_company_id;
return 'deleted';


end;
$$;