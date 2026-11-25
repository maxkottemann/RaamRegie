SET local check_function_bodies = off;

CREATE TABLE "public"."clients" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"             text                     NOT NULL,
  "logo_url"         text,
  "primary_color"    text                     DEFAULT '#6a4cf0'::text,
  "secondary_color"  text                     DEFAULT '#158cf9'::text,
  "accent_color"     text                     DEFAULT 'FFFFFF'::text,
  "city"             text                     NOT NULL,
  "postal_code"      text                     NOT NULL,
  "street"           text                     NOT NULL,
  "number"           text                     NOT NULL,
  "email"            text,
  "website"          text,
  "kvk"              text,
  "btw_num"          text,
  "is_active"        boolean                  DEFAULT true,
  "created_at"       timestamp with time zone DEFAULT now(),
  "updated_at"       timestamp with time zone,
  "deleted_at"       timestamp with time zone,
  "owner_company_id" uuid,
  CONSTRAINT "clients_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."clients"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."companies" (
  "id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"            text                     NOT NULL,
  "logo_url"        text,
  "primary_color"   text                     DEFAULT '#6a4cf0'::text,
  "secondary_color" text                     DEFAULT '#3b6ff0'::text,
  "accent_color"    text                     DEFAULT 'FFFFFF'::text,
  "city"            text                     NOT NULL,
  "postal_code"     text                     NOT NULL,
  "street"          text                     NOT NULL,
  "number"          text                     NOT NULL,
  "email"           text,
  "website"         text,
  "kvk"             text,
  "btw_num"         text,
  "is_active"       boolean                  DEFAULT true,
  "created_at"      timestamp with time zone DEFAULT now(),
  "updated_at"      timestamp with time zone,
  "deleted_at"      timestamp with time zone,
  CONSTRAINT "companies_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."companies"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."company_clients" (
  "company_id" uuid                     NOT NULL,
  "client_id"  uuid                     NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "company_clients_pkey" PRIMARY KEY (company_id, client_id)
);

ALTER TABLE "public"."company_clients"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."company_locations" (
  "location_id" uuid                     NOT NULL,
  "company_id"  uuid                     NOT NULL,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "company_locations_pkey" PRIMARY KEY (company_id, location_id, created_at)
);

ALTER TABLE "public"."company_locations"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."curtain_details" (
  "item_id"         uuid                     NOT NULL,
  "color"           text,
  "purchase_date"   date,
  "height"          numeric                  NOT NULL,
  "upper_width"     numeric,
  "lower_width"     numeric                  NOT NULL,
  "created_at"      timestamp with time zone DEFAULT now(),
  "updated_at"      timestamp with time zone,
  "curtain_type_id" uuid                     NOT NULL,
  "material_id"     uuid,
  "location_id"     uuid                     NOT NULL,
  CONSTRAINT "curtain_details_pkey" PRIMARY KEY (item_id)
);

ALTER TABLE "public"."curtain_details"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."curtain_details" FROM "anon";

CREATE TABLE "public"."curtain_materials" (
  "id"              uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "company_id"      uuid                     NOT NULL,
  "manufacturer_id" uuid,
  "name"            text                     NOT NULL,
  "composition"     text,
  "fire_class"      text,
  "max_wash_temp_c" integer,
  "notes"           text,
  "created_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"      timestamp with time zone NOT NULL DEFAULT now(),
  "archived_at"     timestamp with time zone,
  CONSTRAINT "curtain_materials_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."curtain_materials"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."curtain_materials" FROM "anon";

CREATE TABLE "public"."curtain_types" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "company_id"        uuid                     NOT NULL,
  "name"              text                     NOT NULL,
  "description"       text,
  "default_width_cm"  integer,
  "default_height_cm" integer,
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "archived_at"       timestamp with time zone,
  CONSTRAINT "curtain_types_default_height_cm_check" CHECK ((default_height_cm > 0)),
  CONSTRAINT "curtain_types_default_width_cm_check" CHECK ((default_width_cm > 0)),
  CONSTRAINT "curtain_types_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."curtain_types"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."curtain_types" FROM "anon";

CREATE TABLE "public"."departments" (
  "id"                            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "location_id"                   uuid                     NOT NULL,
  "name"                          text                     NOT NULL,
  "curtain_maintenance_frequency" integer                  NOT NULL,
  "created_at"                    timestamp with time zone DEFAULT now(),
  "updated_at"                    timestamp with time zone,
  "deleted_at"                    timestamp with time zone,
  CONSTRAINT "departments_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."departments"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."departments" FROM "anon";

CREATE TABLE "public"."items" (
  "id"          uuid NOT NULL DEFAULT gen_random_uuid(),
  "location_id" uuid NOT NULL,
  "room_id"     uuid,
  CONSTRAINT "items_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."items"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."items" FROM "anon";

CREATE TABLE "public"."locations" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "client_id"         uuid                     NOT NULL,
  "name"              text                     NOT NULL,
  "checkin_procedure" boolean                  DEFAULT false,
  "city"              text                     NOT NULL,
  "postal_code"       text                     NOT NULL,
  "street"            text                     NOT NULL,
  "number"            text                     NOT NULL,
  "is_active"         boolean                  DEFAULT true,
  "created_at"        timestamp with time zone DEFAULT now(),
  "updated_at"        timestamp with time zone,
  "deleted_at"        timestamp with time zone,
  "internal_id"       text,
  "external_id"       text,
  CONSTRAINT "locations_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."locations"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."manufacturers" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "company_id"  uuid                     NOT NULL,
  "name"        text                     NOT NULL,
  "address"     text,
  "kvk"         text,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "archived_at" timestamp with time zone,
  CONSTRAINT "manufacturers_kvk_check" CHECK ((kvk ~ '^[0-9]{8}$'::text)),
  CONSTRAINT "manufacturers_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."manufacturers"
  ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."manufacturers" FROM "anon";

CREATE TABLE "public"."profile_locations" (
  "profile_id"  uuid                     NOT NULL,
  "location_id" uuid                     NOT NULL,
  "created_at"  timestamp with time zone DEFAULT now(),
  CONSTRAINT "profile_locations_pkey" PRIMARY KEY (profile_id, location_id)
);

ALTER TABLE "public"."profile_locations"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"      uuid NOT NULL DEFAULT gen_random_uuid(),
  "auth_id" uuid NOT NULL,
  "name"    text NOT NULL,
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."rooms" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "location_id"   uuid                     NOT NULL,
  "story_id"      uuid                     NOT NULL,
  "name"          text                     NOT NULL,
  "function"      text,
  "category"      text,
  "section"       text,
  "is_active"     boolean                  NOT NULL DEFAULT true,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"    timestamp with time zone NOT NULL DEFAULT now(),
  "deleted_at"    timestamp with time zone,
  "department_id" uuid,
  CONSTRAINT "rooms_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."rooms"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."stories" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "location_id" uuid                     NOT NULL,
  "name"        text                     NOT NULL,
  "created_at"  timestamp with time zone DEFAULT now(),
  "updated_at"  timestamp with time zone,
  "deleted_at"  timestamp with time zone,
  CONSTRAINT "stories_id_location_unique" UNIQUE (id, location_id),
  CONSTRAINT "stories_location_id_name_key" UNIQUE (location_id, name),
  CONSTRAINT "stories_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."stories"
  ENABLE ROW LEVEL SECURITY;

CREATE TYPE "public"."item_category" AS ENUM (
  'curtain',
  'floor',
  'chair',
  'bed',
  'lighting',
  'sheets',
  'closet'
);

ALTER TABLE "public"."curtain_details"
  ADD COLUMN "category" public.item_category NOT NULL DEFAULT 'curtain'::public.item_category;

ALTER TABLE "public"."manufacturers"
  ADD COLUMN "category" public.item_category NOT NULL;

CREATE TYPE "public"."item_state" AS ENUM (
  'in_room',
  'in_laundry',
  'in_storage',
  'in_repair',
  'retired'
);

CREATE TYPE "public"."item_status" AS ENUM (
  'good',
  'moderate',
  'poor'
);

ALTER TABLE "public"."items"
  ADD COLUMN "status" public.item_status NOT NULL DEFAULT 'good'::public.item_status;

ALTER TABLE "public"."items"
  ADD COLUMN "category" public.item_category NOT NULL;

ALTER TABLE "public"."items"
  ADD COLUMN "quantity" integer NOT NULL DEFAULT 1;

ALTER TABLE "public"."items"
  ADD COLUMN "last_maintenance" timestamp WITH time zone;

ALTER TABLE "public"."items"
  ADD COLUMN "last_maintained_by" uuid;

ALTER TABLE "public"."items"
  ADD COLUMN "created_at" timestamp WITH time zone DEFAULT now();

ALTER TABLE "public"."items"
  ADD COLUMN "updated_at" timestamp WITH time zone;

ALTER TABLE "public"."items"
  ADD COLUMN "deleted_at" timestamp WITH time zone;

ALTER TABLE "public"."items"
  ADD COLUMN "state" public.item_state NOT NULL DEFAULT 'in_room'::public.item_state;

ALTER TABLE "public"."items"
  ADD COLUMN "manufacturer_id" uuid;

ALTER TABLE "public"."items"
  ADD COLUMN "qr_code_id" text;

ALTER TABLE "public"."items"
  ADD COLUMN "name" text NOT NULL;

ALTER TABLE "public"."items"
  ADD COLUMN "rfid_code" text;

CREATE TYPE "public"."role_type" AS ENUM (
  'super_admin',
  'client_admin',
  'company_admin',
  'client_viewer',
  'company_employee',
  'company_planner',
  'client_sub_admin'
);

ALTER TABLE "public"."profiles"
  ADD COLUMN "role" public.role_type NOT NULL;

ALTER TABLE "public"."profiles"
  ADD COLUMN "company_id" uuid;

ALTER TABLE "public"."profiles"
  ADD COLUMN "client_id" uuid;

ALTER TABLE "public"."profiles"
  ADD COLUMN "email" text NOT NULL;

ALTER TABLE "public"."profiles"
  ADD COLUMN "is_active" boolean DEFAULT true;

ALTER TABLE "public"."profiles"
  ADD COLUMN "created_at" timestamp WITH time zone DEFAULT now();

ALTER TABLE "public"."profiles"
  ADD COLUMN "updated_at" timestamp WITH time zone;

ALTER TABLE "public"."profiles"
  ADD COLUMN "deleted_at" timestamp WITH time zone;

CREATE OR REPLACE FUNCTION public.create_client (
  p_name            text,
  p_city            text,
  p_postal_code     text,
  p_street          text,
  p_number          text,
  p_logo_url        text DEFAULT NULL::text,
  p_primary_color   text DEFAULT NULL::text,
  p_secondary_color text DEFAULT NULL::text,
  p_accent_color    text DEFAULT NULL::text,
  p_email           text DEFAULT NULL::text,
  p_website         text DEFAULT NULL::text,
  p_kvk             text DEFAULT NULL::text,
  p_btw_num         text DEFAULT NULL::text
)
  RETURNS public.clients
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_company_id uuid := public.get_company_id();
  v_client public.clients;
begin
  if not (
    public.has_role('super_admin')
    or (public.has_role('company_admin') and v_company_id is not null)
  ) then
    raise exception 'Not allowed to create clients'
      using errcode = '42501';
  end if;

  insert into public.clients (
    name, city, postal_code, street, number,
    logo_url, primary_color, secondary_color, accent_color,
    email, website, kvk, btw_num, owner_company_id
  )
  values (
    p_name, p_city, p_postal_code, p_street, p_number,
    p_logo_url, p_primary_color, p_secondary_color, p_accent_color,
    p_email, p_website, p_kvk, p_btw_num, v_company_id
  )
  returning * into v_client;

  if v_company_id is not null then
    insert into public.company_clients (company_id, client_id)
    values (v_company_id, v_client.id);
  end if;

  return v_client;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."create_client"(text, text, text, text, text, text, text, text, text, text, text, text, text) FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.create_curtain_item (
  p_room_id         uuid,
  p_name            text,
  p_height          numeric,
  p_lower_width     numeric,
  p_quantity        numeric DEFAULT 1,
  p_manufacturer_id uuid    DEFAULT NULL::uuid,
  p_qr_code_id      text    DEFAULT NULL::text,
  p_rfid_code       text    DEFAULT NULL::text,
  p_color           text    DEFAULT NULL::text,
  p_purchase_date   date    DEFAULT NULL::date,
  p_upper_width     numeric DEFAULT NULL::numeric,
  p_curtain_type_id uuid    DEFAULT NULL::uuid,
  p_material_id     uuid    DEFAULT NULL::uuid
)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
v_location_id uuid;
v_company_id uuid := public.get_company_id();
v_item_id uuid;
begin 

select r.location_id into v_location_id
from public.rooms r
where r.id = p_room_id and r.deleted_at is null;

if v_location_id is null then
raise exception 'Ruimte niet gevonden' using errcode = 'R0001';
end if;

if not (
  (v_location_id in (select public.get_company_location_ids()) and public.has_role('company_admin')) or public.has_role('super_admin')
) then
raise exception 'Geen toegang' using errcode = '42501';
end if;

if nullif(trim(p_name),'') is null then
raise exception 'Naam is verplicht' using errcode = '22023';
end if;

if p_manufacturer_id is not null and not exists (
  select 1 from public.manufacturers m
  where m.id = p_manufacturer_id
  and m.company_id = v_company_id
  and m.archived_at is null
) then raise exception 'Onbekende fabrikant' using errcode = '22023';
  end if;

if p_curtain_type_id is not null and not exists (
  select 1 from public.curtain_types ct
  where ct.id = p_curtain_type_id
  and ct.company_id = v_company_id
  and archived_at is null
) then raise exception 'Onbekend gordijn type' using errcode = '22023';
end if;

if p_material_id is not null and not exists (
  select 1 from public.curtain_materials cm
  where cm.id = p_material_id
  and cm.company_id = v_company_id
  and archived_at is null
) then raise exception 'Onbekend gordijn materiaal' using errcode = '22023';
end if;

insert into public.items (
  location_id,room_id,category,state,status,name,quantity,
  manufacturer_id,qr_code_id,rfid_code
) values (
  v_location_id,p_room_id,'curtain','in_room','good',p_name,p_quantity,
  p_manufacturer_id,nullif(trim(p_qr_code_id),''),nullif(trim(p_rfid_code),'')
)
returning id into v_item_id;

insert into public.curtain_details (
  item_id,location_id,color,purchase_date,height,upper_width,lower_width,curtain_type_id,material_id,category
) values (
  v_item_id,v_location_id,p_color,p_purchase_date,p_height,p_upper_width,p_lower_width,p_curtain_type_id,p_material_id,'curtain'
);

return v_item_id;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."create_curtain_item"(uuid, text, numeric, numeric, numeric, uuid, text, text, text, date, numeric, uuid, uuid) FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.create_location (
  p_client_id         uuid,
  p_name              text,
  p_city              text,
  p_postal_code       text,
  p_street            text,
  p_number            text,
  p_checkin_procedure boolean,
  p_internal_id       text    DEFAULT NULL::text,
  p_external_id       text    DEFAULT NULL::text
)
  RETURNS public.locations
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
v_company_id uuid := public.get_company_id();
v_location public.locations;
begin
if not (
  public.has_role('super_admin')
  or (
    public.has_role('company_admin')
    and exists(
      select 1 from public.company_clients cc
      where cc.client_id = p_client_id and cc.company_id = v_company_id
    )
  )
) then 
raise exception 'Not allowed to create locations for this client'
using errcode = '42501';
end if;

insert into public.locations (
  client_id,name,city,postal_code,street,number,checkin_procedure,internal_id,external_id
) values (
  p_client_id,p_name,p_city,p_postal_code,p_street,p_number,p_checkin_procedure,p_internal_id,p_external_id
)
returning * into v_location;

if v_company_id is not null then
insert into public.company_locations (company_id, location_id)
values (v_company_id, v_location.id);
end if;

return v_location;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."create_location"(uuid, text, text, text, text, text, boolean, text, text) FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.custom_access_token_hook (
  event jsonb
)
  RETURNS jsonb
  LANGUAGE plpgsql
  STABLE
  AS $function$
declare
  user_role public.role_type;
begin
  select role
  into user_role
  from public.profiles
  where auth_id = (event->>'user_id')::uuid
    and is_active
    and deleted_at is null;

  if user_role is not null then
    event := jsonb_set(event, '{claims,user_role}', to_jsonb(user_role));
  else
    event := jsonb_set(event, '{claims,user_role}', 'null'::jsonb);
  end if;

  return event;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."custom_access_token_hook"(jsonb) FROM PUBLIC, "anon", "authenticated";

CREATE OR REPLACE FUNCTION public.get_accessible_location_ids()
  RETURNS SETOF uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select l.id
  from public.locations l
  where l.deleted_at is null
    and (
      l.id in (select public.get_company_location_ids())
      or l.id in (select public.get_profile_location_ids())
      or public.has_role('super_admin')
    )
$function$;

CREATE OR REPLACE FUNCTION public.get_client_curtain_material_ids()
  RETURNS SETOF uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select distinct cd.material_id
  from public.curtain_details cd
  join public.items i on i.id = cd.item_id
  where i.location_id in (select public.get_profile_location_ids())
    and i.deleted_at is null
    and cd.material_id is not null;
$function$;

REVOKE ALL ON FUNCTION "public"."get_client_curtain_material_ids"() FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.get_client_curtain_type_ids()
  RETURNS SETOF uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select distinct cd.curtain_type_id
  from public.curtain_details cd
  join public.items i on i.id = cd.item_id
  where i.location_id in (select public.get_profile_location_ids())
    and i.deleted_at is null
    and cd.curtain_type_id is not null;
$function$;

REVOKE ALL ON FUNCTION "public"."get_client_curtain_type_ids"() FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.get_client_id()
  RETURNS uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select client_id
  from public.profiles
  where auth_id = auth.uid()
    and deleted_at is null
    and is_active
$function$;

CREATE OR REPLACE FUNCTION public.get_client_manufacturer_ids()
  RETURNS SETOF uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select distinct i.manufacturer_id
  from public.items i
  where i.location_id in (select public.get_profile_location_ids())
    and i.deleted_at is null
    and i.manufacturer_id is not null;
$function$;

CREATE OR REPLACE FUNCTION public.get_company_id()
  RETURNS uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select company_id
  from public.profiles
  where auth_id = auth.uid()
    and deleted_at is null
    and is_active
$function$;

CREATE OR REPLACE FUNCTION public.get_company_location_ids()
  RETURNS SETOF uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select cl.location_id
  from public.company_locations cl
  where cl.company_id = public.get_company_id()
$function$;

CREATE OR REPLACE FUNCTION public.get_company_location_profile_ids()
  RETURNS SETOF uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select pl.profile_id
  from public.profile_locations pl
  join public.company_locations cl on cl.location_id = pl.location_id
  join public.profiles p on p.id = pl.profile_id
  where cl.company_id = public.get_company_id()
    and p.client_id is not null
$function$;

CREATE OR REPLACE FUNCTION public.get_profile_id()
  RETURNS uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select id
  from public.profiles
  where auth_id = auth.uid()
    and deleted_at is null
    and is_active
$function$;

CREATE OR REPLACE FUNCTION public.get_profile_location_ids()
  RETURNS SETOF uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
select pl.location_id
from public.profile_locations pl where pl.profile_id = public.get_profile_id()
$function$;

CREATE OR REPLACE FUNCTION public.has_role (
  check_role public.role_type
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select exists (
    select 1
    from public.profiles
    where auth_id = auth.uid()
      and role = check_role
      and deleted_at is null
      and is_active
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_client_user()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$

select exists (
  select 1 from public.profiles
  where auth_id = auth.uid()
  and role in ('client_admin','client_sub_admin','client_sub_admin')
  and deleted_at is null
  and is_active
)
$function$;

CREATE OR REPLACE FUNCTION public.is_company_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  select exists (
    select 1
    from public.profiles
    where auth_id = auth.uid()
      and role = 'company_admin'
      and deleted_at is null
      and is_active
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_company_user()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
select exists (
  select 1 from public.profiles 
  where auth_id = auth.uid()
  and role in ('company_admin','company_planner','company_employee')
  and deleted_at is null
  and is_active = true
);
$function$;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.soft_delete_item (
  p_item_id uuid
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_location_id uuid;
begin

select r.location_id into v_location_id
from public.items i
where i.id = p_item_id and deleted_at is null;

if v_location_id is null then
raise exception 'Ruimte niet gevonden' using errcode = 'R0001';
end if;

if not (
  (v_location_id in (select public.get_company_location_ids()) and public.has_role('company_admin'))
  or public.has_role('super_admin')
) then
raise exception 'Geen toegang' using errcode = '42501';
end if;

update public.items
set deleted_at = now()
where id = p_item_id;

end;
$function$;

REVOKE ALL ON FUNCTION "public"."soft_delete_item"(uuid) FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.soft_delete_room_with_items (
  p_room_id uuid
)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
declare
  v_location_id uuid;
begin

select r.location_id into v_location_id
from public.rooms r
where r.id = p_room_id and deleted_at is null;

if v_location_id is null then
raise exception 'Ruimte niet gevonden' using errcode = 'R0001';
end if;

if not (
  (v_location_id in (select public.get_company_location_ids()) and public.has_role('company_admin'))
  or public.has_role('super_admin')
) then
raise exception 'Geen toegang' using errcode = '42501';
end if;

update public.items
set deleted_at = now()
where room_id = p_room_id
and deleted_at is null;

update public.rooms
set deleted_at = now()
where id = p_room_id;

end;
$function$;

REVOKE ALL ON FUNCTION "public"."soft_delete_room_with_items"(uuid) FROM PUBLIC, "anon";

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
  begin
  new.updated_at = now();
  return new;
  end;
$function$;

ALTER TABLE "public"."clients"
  ADD CONSTRAINT "clients_owner_company_id_fkey" FOREIGN KEY (owner_company_id) REFERENCES public.companies(id);

ALTER TABLE "public"."company_clients"
  ADD CONSTRAINT "company_clients_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id);

ALTER TABLE "public"."company_clients"
  ADD CONSTRAINT "company_clients_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id);

ALTER TABLE "public"."company_locations"
  ADD CONSTRAINT "company_locations_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id);

ALTER TABLE "public"."curtain_details"
  ADD CONSTRAINT "curtain_details_category_check" CHECK ((category = 'curtain'::public.item_category));

ALTER TABLE "public"."curtain_materials"
  ADD CONSTRAINT "curtain_materials_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id);

ALTER TABLE "public"."curtain_details"
  ADD CONSTRAINT "curtain_details_material_id_fkey" FOREIGN KEY (material_id) REFERENCES public.curtain_materials(id);

ALTER TABLE "public"."curtain_types"
  ADD CONSTRAINT "curtain_types_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id);

ALTER TABLE "public"."curtain_details"
  ADD CONSTRAINT "curtain_details_curtain_type_id_fkey" FOREIGN KEY (curtain_type_id) REFERENCES public.curtain_types(id);

ALTER TABLE "public"."items"
  ADD CONSTRAINT "items_id_location_category_unique" UNIQUE (id, location_id, category);

ALTER TABLE "public"."curtain_details"
  ADD CONSTRAINT "curtain_details_item_fk" FOREIGN KEY (item_id, location_id, category) REFERENCES public.items(id, location_id, category) ON DELETE CASCADE;

ALTER TABLE "public"."curtain_details"
  ADD CONSTRAINT "curtain_details_item_id_fkey" FOREIGN KEY (item_id) REFERENCES public.items(id);

ALTER TABLE "public"."items"
  ADD CONSTRAINT "items_state_room_check" CHECK ((((state = 'in_room'::public.item_state) AND (room_id IS
    NOT NULL)) OR ((state <> 'in_room'::public.item_state) AND (room_id IS NULL))));

ALTER TABLE "public"."locations"
  ADD CONSTRAINT "locations_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id);

ALTER TABLE "public"."company_locations"
  ADD CONSTRAINT "company_locations_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE "public"."curtain_details"
  ADD CONSTRAINT "curtain_details_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE "public"."departments"
  ADD CONSTRAINT "departments_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE "public"."items"
  ADD CONSTRAINT "items_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE "public"."manufacturers"
  ADD CONSTRAINT "manufacturers_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id);

ALTER TABLE "public"."curtain_materials"
  ADD CONSTRAINT "curtain_materials_manufacturer_id_fkey" FOREIGN KEY (manufacturer_id) REFERENCES public.manufacturers(id);

ALTER TABLE "public"."items"
  ADD CONSTRAINT "items_manufacturer_id_fkey" FOREIGN KEY (manufacturer_id) REFERENCES public.manufacturers(id);

ALTER TABLE "public"."profile_locations"
  ADD CONSTRAINT "profile_locations_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profile_role_scope" CHECK (((((role = 'company_admin'::public.role_type) OR (role = 'company_employee'::public.role_type)) AND (company_id IS
    NOT NULL) AND (client_id IS NULL)) OR (((role = 'client_admin'::public.role_type) OR (role = 'client_viewer'::public.role_type)) AND (company_id IS NULL) AND (client_id IS
    NOT NULL)) OR ((role = 'super_admin'::public.role_type) AND (company_id IS NULL) AND (client_id IS NULL))));

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users(id);

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_client_id_fkey" FOREIGN KEY (client_id) REFERENCES public.clients(id);

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_company_id_fkey" FOREIGN KEY (company_id) REFERENCES public.companies(id);

ALTER TABLE "public"."items"
  ADD CONSTRAINT "items_last_maintained_by_fkey" FOREIGN KEY (last_maintained_by) REFERENCES public.profiles(id);

ALTER TABLE "public"."profile_locations"
  ADD CONSTRAINT "profile_locations_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profiles(id);

ALTER TABLE "public"."rooms"
  ADD CONSTRAINT "rooms_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public.departments(id);

ALTER TABLE "public"."rooms"
  ADD CONSTRAINT "rooms_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id);

ALTER TABLE "public"."items"
  ADD CONSTRAINT "items_room_id_fkey" FOREIGN KEY (room_id) REFERENCES public.rooms(id);

ALTER TABLE "public"."rooms"
  ADD CONSTRAINT "rooms_story_location_fk" FOREIGN KEY (story_id, location_id) REFERENCES public.stories(id, location_id);

ALTER TABLE "public"."stories"
  ADD CONSTRAINT "stories_location_id_fkey" FOREIGN KEY (location_id) REFERENCES public.locations(id);

CREATE INDEX curtain_details_curtain_type_id_idx ON public.curtain_details USING btree (curtain_type_id);

CREATE INDEX curtain_details_material_id_idx ON public.curtain_details USING btree (material_id);

CREATE INDEX curtain_materials_company_id_idx ON public.curtain_materials USING btree (company_id);

CREATE UNIQUE INDEX curtain_materials_company_name_unique ON public.curtain_materials USING btree (company_id, lower(name))
  WHERE (archived_at IS NULL);

CREATE INDEX curtain_materials_manufacturer_id_idx ON public.curtain_materials USING btree (manufacturer_id);

CREATE INDEX curtain_types_company_id_idx ON public.curtain_types USING btree (company_id);

CREATE UNIQUE INDEX curtain_types_company_name_unique ON public.curtain_types USING btree (company_id, lower(name))
  WHERE (archived_at IS NULL);

CREATE INDEX deparments_location_id_idx ON public.departments USING btree (location_id);

CREATE UNIQUE INDEX departments_location_name_unique ON public.departments USING btree (location_id, lower(name))
  WHERE (deleted_at IS NULL);

CREATE INDEX manufacturers_company_id_idx ON public.manufacturers USING btree (company_id);

CREATE UNIQUE INDEX manufacturers_company_name_unique ON public.manufacturers USING btree (company_id, lower(name))
  WHERE (archived_at IS NULL);

CREATE INDEX rooms_location_id_idx ON public.rooms USING btree (location_id);

CREATE INDEX rooms_story_id_idx ON public.rooms USING btree (story_id);

CREATE UNIQUE INDEX rooms_story_name_unique ON public.rooms USING btree (story_id, name)
  WHERE (deleted_at IS NULL);

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER curtain_details_updated_at
  BEFORE UPDATE ON public.curtain_details
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER curtain_materials_updated_at
  BEFORE UPDATE ON public.curtain_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER curtain_types_updated_at
  BEFORE UPDATE ON public.curtain_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER manufacturers_updated_at
  BEFORE UPDATE ON public.manufacturers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "can see own client or relevant client rows" ON "public"."clients"
  FOR SELECT
  TO "authenticated"
  USING (((deleted_at IS NULL) AND ((id = ( SELECT public.get_client_id() AS get_client_id)) OR (id IN ( SELECT company_clients.client_id
   FROM public.company_clients
  WHERE (company_clients.company_id = ( SELECT public.get_company_id() AS get_company_id)))) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "company admins can update owned clients data" ON "public"."clients"
  FOR UPDATE
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND (((owner_company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.has_role('company_admin'::public.role_type) AS
    has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))))
  WITH
    CHECK
    (((deleted_at IS NULL) AND (((owner_company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.has_role('company_admin'::public.role_type) AS
    has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "company admins can update their own company rows" ON "public"."companies"
  FOR UPDATE
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND (((id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.has_role('company_admin'::public.role_type) AS has_role)) OR (
    SELECT public.has_role('super_admin'::public.role_type) AS has_role))))
  WITH
    CHECK
    (((deleted_at IS NULL) AND (((id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.has_role('company_admin'::public.role_type) AS has_role)) OR (
    SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "company can see own company and clients can see companies manag" ON "public"."companies"
  FOR SELECT
  TO "authenticated"
  USING (((deleted_at IS NULL) AND ((id = ( SELECT public.get_company_id() AS get_company_id)) OR (id IN ( SELECT company_clients.company_id
   FROM public.company_clients
  WHERE (company_clients.client_id = ( SELECT public.get_client_id() AS get_client_id)))) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "superadmins can insert company rows" ON "public"."companies"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((deleted_at IS NULL) AND ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "company and clients can see own rows" ON "public"."company_clients"
  FOR SELECT
  TO "authenticated"
  USING
    (((company_id = ( SELECT public.get_company_id() AS get_company_id)) OR (client_id = ( SELECT public.get_client_id() AS get_client_id)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "client can see companies linked to their locations" ON "public"."company_locations"
  FOR SELECT
  TO "authenticated"
  USING ((location_id IN ( SELECT locations.id
   FROM public.locations
  WHERE (locations.client_id = ( SELECT public.get_client_id() AS get_client_id)))));

CREATE POLICY "company can see own linked companies" ON "public"."company_locations"
  FOR SELECT
  TO "authenticated"
  USING (((company_id = ( SELECT public.get_company_id() AS get_company_id)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "companies and clients can select curtain_details at own locatio" ON "public"."curtain_details"
  FOR SELECT
  TO "authenticated"
  USING (((location_id IN ( SELECT public.get_accessible_location_ids() AS get_accessible_location_ids)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "companies can update curtain_details at own locations" ON "public"."curtain_details"
  FOR UPDATE
  TO "authenticated"
  USING
    ((((location_id IN ( SELECT public.get_accessible_location_ids() AS get_accessible_location_ids)) AND ( SELECT public.has_role('company_admin'::public.role_type) AS has_role))
    OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)))
  WITH
    CHECK
    ((((location_id IN ( SELECT public.get_accessible_location_ids() AS get_accessible_location_ids)) AND ( SELECT public.has_role('company_admin'::public.role_type) AS has_role))
    OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "clients can see curtain materials linked to their items" ON "public"."curtain_materials"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT public.is_client_user() AS is_client_user) AND (id IN ( SELECT public.get_client_curtain_material_ids() AS get_client_curtain_material_ids))));

CREATE POLICY "company admins can add curtain materials" ON "public"."curtain_materials"
  FOR INSERT
  TO "authenticated"
  WITH
    CHECK
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "company admins can update curtain materials" ON "public"."curtain_materials"
  FOR UPDATE
  TO "authenticated"
  USING
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)))
  WITH
    CHECK
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "company can see own curtain materials" ON "public"."curtain_materials"
  FOR SELECT
  TO "authenticated"
  USING
    (((( SELECT public.is_company_user() AS is_company_user) AND (company_id = ( SELECT public.get_company_id() AS get_company_id))) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "clients can see curtain types linked to their items" ON "public"."curtain_types"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT public.is_client_user() AS is_client_user) AND (id IN ( SELECT public.get_client_curtain_type_ids() AS get_client_curtain_type_ids))));

CREATE POLICY "company admins can add curtain types" ON "public"."curtain_types"
  FOR INSERT
  TO "authenticated"
  WITH
    CHECK
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "company admins can update curtain types" ON "public"."curtain_types"
  FOR UPDATE
  TO "authenticated"
  USING
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)))
  WITH
    CHECK
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "company can see own curtain types" ON "public"."curtain_types"
  FOR SELECT
  TO "authenticated"
  USING
    (((( SELECT public.is_company_user() AS is_company_user) AND (company_id = ( SELECT public.get_company_id() AS get_company_id))) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "company admins can insert departments" ON "public"."departments"
  FOR INSERT
  TO "authenticated"
  WITH
    CHECK
    (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT (public.has_role('company_admin'::public.role_type) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)))));

CREATE POLICY "company admins can update departments" ON "public"."departments"
  FOR UPDATE
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND (location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    (public.has_role('company_admin'::public.role_type) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)))))
  WITH
    CHECK
    (((deleted_at IS NULL) AND (location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    (public.has_role('company_admin'::public.role_type) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)))));

CREATE POLICY "company and clients can see deparmtents at their own locations" ON "public"."departments"
  FOR SELECT
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND ((location_id IN ( SELECT public.get_accessible_location_ids() AS get_accessible_location_ids)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "company admins can update items at their own locations" ON "public"."items"
  FOR UPDATE
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    public.has_role('company_admin'::public.role_type) AS has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))))
  WITH
    CHECK
    (((deleted_at IS NULL) AND (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    public.has_role('company_admin'::public.role_type) AS has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "company and clients can see items at their own locations" ON "public"."items"
  FOR SELECT
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND ((location_id IN ( SELECT public.get_accessible_location_ids() AS get_accessible_location_ids)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "clients can see linked locations" ON "public"."locations"
  FOR SELECT
  TO "authenticated"
  USING (((deleted_at IS NULL) AND (id IN ( SELECT public.get_profile_location_ids() AS get_profile_location_ids))));

CREATE POLICY "companies can update locations" ON "public"."locations"
  FOR UPDATE
  TO "authenticated"
  USING ((((client_id IN ( SELECT company_clients.client_id
   FROM public.company_clients
  WHERE (company_clients.company_id = ( SELECT public.get_company_id() AS get_company_id)))) AND ( SELECT public.has_role('company_admin'::public.role_type) AS has_role)) OR
    ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)))
  WITH CHECK ((((client_id IN ( SELECT company_clients.client_id
   FROM public.company_clients
  WHERE (company_clients.company_id = ( SELECT public.get_company_id() AS get_company_id)))) AND ( SELECT public.has_role('company_admin'::public.role_type) AS has_role)) OR
    ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "company can see owned locations" ON "public"."locations"
  FOR SELECT
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND ((id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS
    has_role))));

CREATE POLICY "clients can see manufacturers linked to their items" ON "public"."manufacturers"
  FOR SELECT
  TO "authenticated"
  USING
    (((( SELECT public.is_client_user() AS is_client_user) AND (id IN ( SELECT public.get_client_manufacturer_ids() AS get_client_manufacturer_ids))) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "companies can insert new manufacturers" ON "public"."manufacturers"
  FOR INSERT
  TO "authenticated"
  WITH
    CHECK
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "companies can update manufacturers" ON "public"."manufacturers"
  FOR UPDATE
  TO "authenticated"
  USING
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)))
  WITH
    CHECK
    ((((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.is_company_admin() AS is_company_admin)) OR ( SELECT
    public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "company can see own manufacturers" ON "public"."manufacturers"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT public.is_company_user() AS is_company_user) AND (company_id = ( SELECT public.get_company_id() AS get_company_id))));

CREATE POLICY "companies can see profiles linked to their locations" ON "public"."profile_locations"
  FOR SELECT
  TO "authenticated"
  USING ((location_id IN ( SELECT company_locations.location_id
   FROM public.company_locations
  WHERE (company_locations.company_id = public.get_company_id()))));

CREATE POLICY "profile can see own locations" ON "public"."profile_locations"
  FOR SELECT
  TO "authenticated"
  USING (((profile_id = ( SELECT public.get_profile_id() AS get_profile_id)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)));

CREATE POLICY "auth admin can read profiles for token hook" ON "public"."profiles"
  FOR SELECT
  TO "supabase_auth_admin"
  USING (true);

CREATE POLICY "users see relevant profiles" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING
    (((auth_id = ( SELECT auth.uid() AS uid)) OR ((deleted_at IS NULL) AND (((client_id = ( SELECT public.get_client_id() AS get_client_id)) AND ( SELECT
    public.has_role('client_admin'::public.role_type) AS has_role)) OR
    ((company_id = ( SELECT public.get_company_id() AS get_company_id)) AND ( SELECT public.has_role('company_admin'::public.role_type) AS has_role)) OR
    (id IN ( SELECT public.get_company_location_profile_ids() AS get_company_location_profile_ids)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role)))));

CREATE POLICY "admins can insert rooms at their own locations" ON "public"."rooms"
  FOR INSERT
  TO "authenticated"
  WITH
    CHECK
    (((deleted_at IS NULL) AND (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    public.has_role('company_admin'::public.role_type) AS has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "admins can update rooms at their own locations" ON "public"."rooms"
  FOR UPDATE
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    public.has_role('company_admin'::public.role_type) AS has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))))
  WITH
    CHECK
    (((deleted_at IS NULL) AND (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    public.has_role('company_admin'::public.role_type) AS has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "users can select rooms at their own locations" ON "public"."rooms"
  FOR SELECT
  TO "authenticated"
  USING (((deleted_at IS NULL) AND (location_id IN ( SELECT public.get_accessible_location_ids() AS get_accessible_location_ids))));

CREATE POLICY "admins can insert stories" ON "public"."stories"
  FOR INSERT
  TO "authenticated"
  WITH
    CHECK
    (((deleted_at IS NULL) AND (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    public.has_role('company_admin'::public.role_type) AS has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "admins can update stories" ON "public"."stories"
  FOR UPDATE
  TO "authenticated"
  USING
    (((deleted_at IS NULL) AND (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    public.has_role('company_admin'::public.role_type) AS has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))))
  WITH
    CHECK
    (((deleted_at IS NULL) AND (((location_id IN ( SELECT public.get_company_location_ids() AS get_company_location_ids)) AND ( SELECT
    public.has_role('company_admin'::public.role_type) AS has_role)) OR ( SELECT public.has_role('super_admin'::public.role_type) AS has_role))));

CREATE POLICY "users see stories of accessible locations" ON "public"."stories"
  FOR SELECT
  TO "authenticated"
  USING (((deleted_at IS NULL) AND (location_id IN ( SELECT public.get_accessible_location_ids() AS get_accessible_location_ids))));

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION "public"."rls_auto_enable"();

GRANT EXECUTE ON FUNCTION "public"."create_client"(text, text, text, text, text, text, text, text, text, text, text, text, text) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."create_client"(text, text, text, text, text, text, text, text, text, text, text, text, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_client"(text, text, text, text, text, text, text, text, text, text, text, text, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_client"(text, text, text, text, text, text, text, text, text, text, text, text, text) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."create_curtain_item"(uuid, text, numeric, numeric, numeric, uuid, text, text, text, date, numeric, uuid, uuid) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."create_curtain_item"(uuid, text, numeric, numeric, numeric, uuid, text, text, text, date, numeric, uuid, uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_curtain_item"(uuid, text, numeric, numeric, numeric, uuid, text, text, text, date, numeric, uuid, uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_curtain_item"(uuid, text, numeric, numeric, numeric, uuid, text, text, text, date, numeric, uuid, uuid) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."create_location"(uuid, text, text, text, text, text, boolean, text, text) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."create_location"(uuid, text, text, text, text, text, boolean, text, text) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_location"(uuid, text, text, text, text, text, boolean, text, text) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_location"(uuid, text, text, text, text, text, boolean, text, text) TO "service_role";

REVOKE ALL ON FUNCTION "public"."custom_access_token_hook"(jsonb) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."custom_access_token_hook"(jsonb) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."custom_access_token_hook"(jsonb) TO "service_role", "supabase_auth_admin";

GRANT EXECUTE ON FUNCTION "public"."get_accessible_location_ids"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_accessible_location_ids"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_accessible_location_ids"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_accessible_location_ids"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_client_curtain_material_ids"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."get_client_curtain_material_ids"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_client_curtain_material_ids"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_client_curtain_material_ids"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_client_curtain_type_ids"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."get_client_curtain_type_ids"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_client_curtain_type_ids"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_client_curtain_type_ids"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_client_id"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_client_id"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_client_id"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_client_id"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_client_manufacturer_ids"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_client_manufacturer_ids"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_client_manufacturer_ids"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_client_manufacturer_ids"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_company_id"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_company_id"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_company_id"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_company_id"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_company_location_ids"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_company_location_ids"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_company_location_ids"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_company_location_ids"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_company_location_profile_ids"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_company_location_profile_ids"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_company_location_profile_ids"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_company_location_profile_ids"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_profile_id"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_profile_id"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_profile_id"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_profile_id"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."get_profile_location_ids"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."get_profile_location_ids"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_profile_location_ids"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."get_profile_location_ids"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."has_role"(public.role_type) TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."has_role"(public.role_type) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."has_role"(public.role_type) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."has_role"(public.role_type) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_client_user"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_client_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_client_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_client_user"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_company_admin"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_company_admin"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_company_admin"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_company_admin"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_company_user"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."is_company_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_company_user"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_company_user"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."soft_delete_item"(uuid) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."soft_delete_item"(uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."soft_delete_item"(uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."soft_delete_item"(uuid) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."soft_delete_room_with_items"(uuid) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."soft_delete_room_with_items"(uuid) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."soft_delete_room_with_items"(uuid) TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."soft_delete_room_with_items"(uuid) TO "service_role";

GRANT EXECUTE ON FUNCTION "public"."update_updated_at_column"() TO PUBLIC, "anon", "authenticated";

REVOKE ALL ON FUNCTION "public"."update_updated_at_column"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_updated_at_column"() TO "postgres";

GRANT EXECUTE ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

REVOKE ALL ON SCHEMA "public" FROM "supabase_auth_admin";

GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."clients" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."clients" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."clients" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."clients" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."companies" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."companies" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."companies" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."companies" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."company_clients" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."company_clients" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."company_clients" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."company_clients" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."company_locations" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."company_locations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."company_locations" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."company_locations" TO "service_role";

REVOKE ALL ON TABLE "public"."curtain_details" FROM "authenticated";

REVOKE ALL ("color") ON TABLE "public"."curtain_details" FROM "authenticated";

GRANT UPDATE ("color") ON TABLE "public"."curtain_details" TO "authenticated";

REVOKE ALL ("curtain_type_id") ON TABLE "public"."curtain_details" FROM "authenticated";

GRANT UPDATE ("curtain_type_id") ON TABLE "public"."curtain_details" TO "authenticated";

REVOKE ALL ("height") ON TABLE "public"."curtain_details" FROM "authenticated";

GRANT UPDATE ("height") ON TABLE "public"."curtain_details" TO "authenticated";

REVOKE ALL ("lower_width") ON TABLE "public"."curtain_details" FROM "authenticated";

GRANT UPDATE ("lower_width") ON TABLE "public"."curtain_details" TO "authenticated";

REVOKE ALL ("material_id") ON TABLE "public"."curtain_details" FROM "authenticated";

GRANT UPDATE ("material_id") ON TABLE "public"."curtain_details" TO "authenticated";

REVOKE ALL ("purchase_date") ON TABLE "public"."curtain_details" FROM "authenticated";

GRANT UPDATE ("purchase_date") ON TABLE "public"."curtain_details" TO "authenticated";

REVOKE ALL ("upper_width") ON TABLE "public"."curtain_details" FROM "authenticated";

GRANT UPDATE ("upper_width") ON TABLE "public"."curtain_details" TO "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."curtain_details" TO "authenticated";

REVOKE ALL ON TABLE "public"."curtain_details" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."curtain_details" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."curtain_details" TO "service_role";

REVOKE ALL ON TABLE "public"."curtain_materials" FROM "authenticated";

REVOKE ALL ("company_id") ON TABLE "public"."curtain_materials" FROM "authenticated";

GRANT INSERT ("company_id") ON TABLE "public"."curtain_materials" TO "authenticated";

REVOKE ALL ("composition") ON TABLE "public"."curtain_materials" FROM "authenticated";

GRANT INSERT ("composition"), UPDATE ("composition") ON TABLE "public"."curtain_materials" TO "authenticated";

REVOKE ALL ("fire_class") ON TABLE "public"."curtain_materials" FROM "authenticated";

GRANT INSERT ("fire_class"), UPDATE ("fire_class") ON TABLE "public"."curtain_materials" TO "authenticated";

REVOKE ALL ("manufacturer_id") ON TABLE "public"."curtain_materials" FROM "authenticated";

GRANT INSERT ("manufacturer_id"), UPDATE ("manufacturer_id") ON TABLE "public"."curtain_materials" TO "authenticated";

REVOKE ALL ("max_wash_temp_c") ON TABLE "public"."curtain_materials" FROM "authenticated";

GRANT INSERT ("max_wash_temp_c"), UPDATE ("max_wash_temp_c") ON TABLE "public"."curtain_materials" TO "authenticated";

REVOKE ALL ("name") ON TABLE "public"."curtain_materials" FROM "authenticated";

GRANT INSERT ("name"), UPDATE ("name") ON TABLE "public"."curtain_materials" TO "authenticated";

REVOKE ALL ("notes") ON TABLE "public"."curtain_materials" FROM "authenticated";

GRANT INSERT ("notes"), UPDATE ("notes") ON TABLE "public"."curtain_materials" TO "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."curtain_materials" TO "authenticated";

REVOKE ALL ON TABLE "public"."curtain_materials" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."curtain_materials" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."curtain_materials" TO "service_role";

REVOKE ALL ON TABLE "public"."curtain_types" FROM "authenticated";

REVOKE ALL ("company_id") ON TABLE "public"."curtain_types" FROM "authenticated";

GRANT INSERT ("company_id") ON TABLE "public"."curtain_types" TO "authenticated";

REVOKE ALL ("default_height_cm") ON TABLE "public"."curtain_types" FROM "authenticated";

GRANT INSERT ("default_height_cm"), UPDATE ("default_height_cm") ON TABLE "public"."curtain_types" TO "authenticated";

REVOKE ALL ("default_width_cm") ON TABLE "public"."curtain_types" FROM "authenticated";

GRANT INSERT ("default_width_cm"), UPDATE ("default_width_cm") ON TABLE "public"."curtain_types" TO "authenticated";

REVOKE ALL ("description") ON TABLE "public"."curtain_types" FROM "authenticated";

GRANT INSERT ("description"), UPDATE ("description") ON TABLE "public"."curtain_types" TO "authenticated";

REVOKE ALL ("name") ON TABLE "public"."curtain_types" FROM "authenticated";

GRANT INSERT ("name"), UPDATE ("name") ON TABLE "public"."curtain_types" TO "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."curtain_types" TO "authenticated";

REVOKE ALL ON TABLE "public"."curtain_types" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."curtain_types" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."curtain_types" TO "service_role";

REVOKE ALL ON TABLE "public"."departments" FROM "authenticated";

REVOKE ALL ("curtain_maintenance_frequency") ON TABLE "public"."departments" FROM "authenticated";

GRANT INSERT ("curtain_maintenance_frequency"), UPDATE ("curtain_maintenance_frequency") ON TABLE "public"."departments" TO "authenticated";

REVOKE ALL ("location_id") ON TABLE "public"."departments" FROM "authenticated";

GRANT INSERT ("location_id") ON TABLE "public"."departments" TO "authenticated";

REVOKE ALL ("name") ON TABLE "public"."departments" FROM "authenticated";

GRANT INSERT ("name"), UPDATE ("name") ON TABLE "public"."departments" TO "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."departments" TO "authenticated";

REVOKE ALL ON TABLE "public"."departments" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."departments" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."departments" TO "service_role";

REVOKE ALL ON TABLE "public"."items" FROM "authenticated";

REVOKE ALL ("manufacturer_id") ON TABLE "public"."items" FROM "authenticated";

GRANT UPDATE ("manufacturer_id") ON TABLE "public"."items" TO "authenticated";

REVOKE ALL ("name") ON TABLE "public"."items" FROM "authenticated";

GRANT UPDATE ("name") ON TABLE "public"."items" TO "authenticated";

REVOKE ALL ("qr_code_id") ON TABLE "public"."items" FROM "authenticated";

GRANT UPDATE ("qr_code_id") ON TABLE "public"."items" TO "authenticated";

REVOKE ALL ("quantity") ON TABLE "public"."items" FROM "authenticated";

GRANT UPDATE ("quantity") ON TABLE "public"."items" TO "authenticated";

REVOKE ALL ("rfid_code") ON TABLE "public"."items" FROM "authenticated";

GRANT UPDATE ("rfid_code") ON TABLE "public"."items" TO "authenticated";

REVOKE ALL ("room_id") ON TABLE "public"."items" FROM "authenticated";

GRANT UPDATE ("room_id") ON TABLE "public"."items" TO "authenticated";

REVOKE ALL ("state") ON TABLE "public"."items" FROM "authenticated";

GRANT UPDATE ("state") ON TABLE "public"."items" TO "authenticated";

REVOKE ALL ("status") ON TABLE "public"."items" FROM "authenticated";

GRANT UPDATE ("status") ON TABLE "public"."items" TO "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."items" TO "authenticated";

REVOKE ALL ON TABLE "public"."items" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."items" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."items" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."locations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "service_role";

REVOKE ALL ON TABLE "public"."manufacturers" FROM "authenticated";

REVOKE ALL ("address") ON TABLE "public"."manufacturers" FROM "authenticated";

GRANT INSERT ("address"), UPDATE ("address") ON TABLE "public"."manufacturers" TO "authenticated";

REVOKE ALL ("category") ON TABLE "public"."manufacturers" FROM "authenticated";

GRANT INSERT ("category"), UPDATE ("category") ON TABLE "public"."manufacturers" TO "authenticated";

REVOKE ALL ("company_id") ON TABLE "public"."manufacturers" FROM "authenticated";

GRANT INSERT ("company_id") ON TABLE "public"."manufacturers" TO "authenticated";

REVOKE ALL ("kvk") ON TABLE "public"."manufacturers" FROM "authenticated";

GRANT INSERT ("kvk"), UPDATE ("kvk") ON TABLE "public"."manufacturers" TO "authenticated";

REVOKE ALL ("name") ON TABLE "public"."manufacturers" FROM "authenticated";

GRANT INSERT ("name"), UPDATE ("name") ON TABLE "public"."manufacturers" TO "authenticated";

GRANT MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE ON TABLE "public"."manufacturers" TO "authenticated";

REVOKE ALL ON TABLE "public"."manufacturers" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."manufacturers" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."manufacturers" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile_locations" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profile_locations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile_locations" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profile_locations" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

GRANT SELECT ON TABLE "public"."profiles" TO "supabase_auth_admin";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."rooms" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."rooms" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."rooms" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."rooms" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."stories" TO "anon", "authenticated";

REVOKE ALL ON TABLE "public"."stories" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."stories" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."stories" TO "service_role";

