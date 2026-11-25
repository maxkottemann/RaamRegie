create or replace function public.get_item_count_by_story(
  p_story_id uuid,
  p_category public.item_category default null
)
returns bigint
language sql
stable
security invoker
set search_path = ''
as $$
  select count(*)
  from public.items i
  join public.rooms r on r.id = i.room_id
  where r.story_id = p_story_id
    and r.deleted_at is null
    and i.deleted_at is null
    and (p_category is null or i.category = p_category);
$$;

grant execute on function public.get_item_count_by_story(uuid, public.item_category) to authenticated;