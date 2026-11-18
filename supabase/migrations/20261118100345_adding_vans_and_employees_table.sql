create table public.employees(
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies(id),
    profile_id uuid references public.profiles(id),
    name text not null,
    is_active boolean not null default true,
    created_at timestamptz default now(),
    updated_at timestamptz,
    archived_at timestamptz,

    constraint employees_profile_unique unique (company_id, profile_id)
);

alter table public.employees enable row level security;

revoke all on public.employees from anon;
revoke insert, update, delete, truncate on public.employees from authenticated;
grant select on public.employees to authenticated;

create unique index employees_name_active_idx
  on public.employees (company_id, lower(name))
  where archived_at is null;

create trigger employees_update_updated_at
  before update on public.employees
  for each row
  execute function public.update_updated_at_column();


create policy "employees_select" on public.employees
  for select to authenticated
  using (company_id = (select public.get_company_id()));

  alter table public.projects
  add constraint projects_id_company_location_unique
  unique (id, company_id, location_id);

  create table public.vehicles(
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references public.companies(id),
    name text not null,
    license_plate text,
    is_active boolean not null default true,
    city text,
    postal_code text,
    street text,
    number text,
    co2 numeric,
    co2_old numeric,
    created_at timestamptz default now(),
    updated_at timestamptz,
    archived_at timestamptz
  );

alter table public.vehicles enable row level security;

revoke all on public.vehicles from anon;
revoke insert, update, delete, truncate on public.vehicles from authenticated;
grant select on public.vehicles to authenticated;

create unique index vehicle_license_plate_active
on public.vehicles(company_id,lower(name),license_plate) where
archived_at is null;

create trigger vehicles_update_updated_at
before update on public.vehicles
for each row
execute function public.update_updated_at_column();

create policy "Company can select own vehicles"
on public.vehicles for select
to authenticated
using (company_id = (select public.get_company_id()));


create table public.vehicle_default_employees (
  vehicle_id  uuid not null references public.vehicles(id) on delete cascade,
  employee_id uuid not null references public.employees(id),
  company_id  uuid not null references public.companies(id),
  created_at  timestamptz not null default now(),
  primary key (vehicle_id, employee_id)
);

create index vehicle_default_employees_employee_idx
  on public.vehicle_default_employees (employee_id);

create index vehicle_default_employees_company_idx
  on public.vehicle_default_employees (company_id);

  revoke all on public.vehicle_default_employees from anon;
  revoke insert,delete,update on public.vehicle_default_employees from authenticated;

  create policy "Companies can see default vehicle employees"
  on public.vehicle_default_employees for select
  to authenticated
  using (company_id = (select public.get_company_id()));

  create table project_vehicles(
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null,
    company_id uuid not null,
    location_id uuid not null,
    vehicle_id uuid references public.vehicles(id),
    distance numeric check (distance >= 0),
    work_date date not null,
    vehicle_name text not null,
    license_plate text,
    created_at timestamptz default now(),

     constraint project_vehicles_unique_vehicle unique (project_id, vehicle_id),
  constraint project_vehicles_id_scope_unique unique (id, company_id, location_id),

    foreign key (project_id, company_id, location_id)
    references public.projects (id, company_id, location_id) on delete cascade
  );

  create index project_vehicles_company_idx  on public.project_vehicles (company_id);
create index project_vehicles_location_idx on public.project_vehicles (location_id);
create index project_vehicles_vehicle_idx  on public.project_vehicles (vehicle_id);

create policy "project_vehicles_select" on public.project_vehicles
  for select to authenticated
  using (
    company_id = (select public.get_company_id())
    or location_id in (select public.get_profile_location_ids())
  );

  alter table public.project_vehicles enable row level security;
revoke all on public.project_vehicles from anon, authenticated;
grant select on public.project_vehicles to authenticated;

  create table project_vehicle_employees(
    project_vehicle_id uuid not null references public.project_vehicles(id),
    employee_id uuid not null references public.employees(id),
    project_id uuid not null references public.projects(id),
    location_id uuid not null references public.locations(id),
    company_id uuid not null references public.companies(id),
    employee_name text not null,
    created_at timestamptz default now(),

    primary key (project_vehicle_id,employee_id)
  );

    alter table public.project_vehicle_employees enable row level security;
revoke all on public.project_vehicle_employees from anon, authenticated;
grant select on public.project_vehicle_employees to authenticated;

create policy "project_vehicle_employees_select" on public.project_vehicle_employees
  for select to authenticated
  using (
    company_id = (select public.get_company_id())
    or location_id in (select public.get_profile_location_ids())
  );
