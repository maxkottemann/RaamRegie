revoke truncate on all tables in schema public from anon, authenticated;

-- 2. all future tables you create (as postgres, through migrations)
alter default privileges for role postgres in schema public
  revoke truncate on tables from anon, authenticated;