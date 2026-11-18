create type project_type as enum ('standard','requested','other');

create type project_status as enum ('planned','active','pending_approval','approved','cancelled');

create table public.projects(
    id uuid primary key default gen_random_uuid(),
    location_id uuid not null references locations(id),
    company_id uuid not null references companies(id),
    planned_by uuid not null references profiles(id),
    finished_by uuid referneces profiles(id),
    name text not null,
    description text,
    project_codde text,
    start_date date not null,
    end_date date not null,
    status project_status not null default 'planned',
    type project_type,
    signed_at timestamptz,
    location_name text,
    location_address text,
    client_name text,
    internal_id text,
    external_id text,
    created_at timestamptz default now(),
    updated_at timestamptz,
    deleted_at timestamptz
);

alter table public.projects enable row level security;

create index project_company_idx_ on public.projects(company_id);
create index projects_location_start_idx
  on public.projects (location_id, start_date desc)
  where deleted_at is null;

revoke all on public.projects from anon;
revoke update, delete on public.projects from authenticated;

create policy "company can select own projects"
on public.projects for select
to authenticated
using (
    deleted_at is null and (company_id = (select public.get_company_id()) or (select public.has_role('super_admin')))
);

create policy "clients can select projects at own locations"
on public.projects for select
to authenticated
using (
    deleted_at is null and (location_id in (select public.get_profile_location_ids()))
);


create trigger projects_update_updated_at
before update on public.projects
for each row
execute function public.update_updated_at_column;



create type signature_type as enum ('company','client');

create table public.project_signatures(
    project_id uuid not null references projects(id),
    company_id uuid not null references companies(id),
    location_id uuid not null references locations(id),
    type signature_type not null,
    signature_storage_path text not null,
    created_at timestamptz default now(),  
    primary key (project_id,type)
);

create index project_signatures_company_idx_ on public.projects(company_id);
create index projects_signatures_location_start_idx
  on public.projects (location_id)
  where deleted_at is null;

revoke all on public.project_signatures from anon;
revoke update, delete on public.project_signatures from authenticated;


create policy "company can select own project sigantures"
on public.projects for select
to authenticated
using (
     company_id = (select public.get_company_id()) or (select public.has_role('super_admin'))
);

create policy "clients can select project signatures at own locations"
on public.projects for select
to authenticated
using (
    location_id in (select public.get_profile_location_ids())
);



create table public.cleaning_methods (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies(id),
    name text not null,
    description text,

    water_usage numeric null,
    waste_water numeric null,
    chemical_usage numeric null,
    electricity numeric null,
    packaging numeric null,

    water_usage_old numeric null,
    waste_water_old numeric null,
    chemical_usage_old numeric null,
    electricity_old numeric null,
    packaging_old numeric null,

    is_active boolean not null default true,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted_at timestamp with time zone null,

    -- no negative values
    constraint cleaning_methods_values_non_negative check (
        water_usage >= 0 and waste_water >= 0 and chemical_usage >= 0
        and electricity >= 0 and packaging >= 0
        and water_usage_old >= 0 and waste_water_old >= 0 and chemical_usage_old >= 0
        and electricity_old >= 0 and packaging_old >= 0
    ),

    -- old (baseline) may never be lower than new
    constraint cleaning_methods_water_usage_old_gte    check (water_usage_old    >= water_usage),
    constraint cleaning_methods_waste_water_old_gte    check (waste_water_old    >= waste_water),
    constraint cleaning_methods_chemical_usage_old_gte check (chemical_usage_old >= chemical_usage),
    constraint cleaning_methods_electricity_old_gte    check (electricity_old    >= electricity),
    constraint cleaning_methods_packaging_old_gte      check (packaging_old      >= packaging)
);

create trigger cleaning_methods_updated_at 
before update on public.cleaning_methods
for each row
execute function public.update_updated_at_column;








create table public.project_items(
    project_id
)




