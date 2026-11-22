create type public.module_key as enum ('curtains', 'floors', 'chairs');

-- used in company_modules and projects
create table public.company_modules (
  company_id uuid not null references public.companies(id),
  module     public.module_key not null,
  created_at timestamptz not null default now(),
  primary key (company_id, module)
);

alter table public.projects add column project_module public.module_key not null;