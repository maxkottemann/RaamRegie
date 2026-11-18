
create or replace function public.get_location_item_counts(p_location_id uuid)
returns table (
    category public.item_category,
    item_count bigint,
    total_quantity bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
    select
        i.category,
        count(*) as item_count,
        coalesce(sum(i.quantity), 0)::bigint as total_quantity
    from public.items as i
    where i.deleted_at is null
      and i.location_id = p_location_id
    group by i.category
    order by i.category;
$$;

grant execute on function public.get_location_item_counts(uuid)
to authenticated;
