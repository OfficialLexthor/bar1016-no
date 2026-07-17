-- ---------------------------------------------------------------------------
-- VAKTPLAN: ansatte + vakter
-- Offentlig visning skjer via service-role på /vakt/[token] — derfor INGEN
-- anon-policies her. share_token er dermed aldri spørrbar med anon-nøkkelen.
-- ---------------------------------------------------------------------------

create table public.employees (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  neon_color  text not null default 'cyan',
  share_token uuid unique not null default gen_random_uuid(),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.employees enable row level security;

create trigger employees_updated_at
  before update on public.employees
  for each row
  execute function public.handle_updated_at();

create policy "Admins have full access to employees"
  on public.employees for all
  to authenticated
  using (public.is_admin());

create table public.shifts (
  id          uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  shift_date  date not null,
  -- Ingen start < end-constraint: vakter over midnatt (20:00–03:00) er normalt
  start_time  time not null,
  end_time    time not null,
  role        text,
  note        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.shifts enable row level security;

create trigger shifts_updated_at
  before update on public.shifts
  for each row
  execute function public.handle_updated_at();

create policy "Admins have full access to shifts"
  on public.shifts for all
  to authenticated
  using (public.is_admin());

create index shifts_shift_date_idx on public.shifts (shift_date);
create index shifts_employee_id_idx on public.shifts (employee_id);
