create policy "company can see own modules"
on public.company_modules for select
to authenticated
using (
    company_id = (select public.get_company_id())
)