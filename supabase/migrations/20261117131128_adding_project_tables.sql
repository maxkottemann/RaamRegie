create type project_type as enum ('standard','requested','other');

create type project_status as enum ('planned','active','pending_approval','approved','cancelled');

create table public.projects(
    id uuid primary key default gen_random_uuid(),
    location_id uuid not null references locations(id),
    company_id uuid not null references companies(id),
    planned_by uuid not null references profiles(id),
    finished_by uuid references profiles(id),
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
    deleted_at timestamptz,

    unique(id,location_id)
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
execute function public.update_updated_at_column();



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

alter table public.project_signatures enable row level security;


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

    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted_at timestamp with time zone null,

    -- no negative values
    constraint cleaning_methods_values_non_negative check (
        water_usage >= 0 and waste_water >= 0 and chemical_usage >= 0
        and electricity >= 0 and packaging >= 0
        and water_usage_old >= 0 and waste_water_old >= 0 and chemical_usage_old >= 0
        and electricity_old >= 0 and packaging_old >= 0
    )

);

alter table public.cleaning_methods enable row level security;


create trigger cleaning_methods_updated_at 
before update on public.cleaning_methods
for each row
execute function public.update_updated_at_column();

revoke all on public.cleaning_methods from anon;
revoke update,insert,delete on public.cleaning_methods from authenticated;

grant update (name,description,water_usage,waste_water,chemical_usage,electricity,packaging,
water_usage_old,waste_water_old,chemical_usage_old,electricity_old,packaging_old) on public.cleaning_methods to authenticated;


grant insert (company_id,name,description,water_usage,waste_water,chemical_usage,electricity,packaging,
water_usage_old,waste_water_old,chemical_usage_old,electricity_old,packaging_old) on public.cleaning_methods to authenticated;



create type public.project_item_status as enum ('planned', 'done', 'skipped');

create table public.project_items(
    id uuid primary key default gen_random_uuid(),
    project_id uuid,
    company_id uuid not null references companies(id),
    location_id uuid,
    item_id uuid not null references items(id),
    room_id uuid not null references rooms(id),
    cleaning_method_id uuid not null references cleaning_methods(id),
    status public.project_item_status not null default 'planned',

    planned_quantity numeric not null check (planned_quantity > 0),

    quantity             numeric check (quantity > 0),
    area_m2              numeric check (area_m2 >= 0),
    height               numeric check (height > 0),
    upper_width          numeric check (upper_width > 0),
    lower_width          numeric check (lower_width > 0),
    status_after         public.item_status,
    performed_by         uuid references public.profiles(id),
    performed_at         timestamptz,
    skip_reason          text,
    note                 text,

    item_name            text not null,
    item_category        public.item_category not null,
    building_name        text,
    story_name           text,
    room_name            text,

    created_at           timestamptz not null default now(),

     constraint project_items_project_fk
    foreign key (project_id, location_id)
    references public.projects (id, location_id) on delete cascade,

  constraint project_items_done_has_values check (
    status <> 'done' or (quantity is not null and performed_at is not null)
  ),
  constraint project_items_skipped_has_reason check (
    status <> 'skipped' or skip_reason is not null
  )

);


create index project_items_location_idx on public.project_items (location_id);
create index project_items_method_idx   on public.project_items (cleaning_method_id, location_id);
create index project_items_item_idx     on public.project_items (item_id);

alter table public.project_items enable row level security;
revoke all on public.project_items from anon;
revoke insert, update, delete on public.project_items from authenticated;
grant select on public.project_items to authenticated;

create policy "companies can see own project_items"
on public.project_items for select
to authenticated
using (
     company_id = (select public.get_company_id()) or (select public.has_role('super_admin'))
);

create policy "Clients can see project_items at own locations"
on public.project_items for select
to authenticated
using (
    location_id in (select public.get_profile_location_ids())
);


create or replace function public.client_can_read_cleaning_method(p_method_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$ 
select exists (
    select 1 from  public.project_items pi
    where pi.cleaning_method_id = p_method_id
    and location_id in (select public.get_profile_location_ids())
);
$$;

create policy "cleaning_methods_select" on public.cleaning_methods
  for select to authenticated
  using (
    company_id = (select public.get_company_id())
    or public.client_can_read_cleaning_method(id)
  );





