alter table public.projects
drop column if exists project_codde,
add column project_code text