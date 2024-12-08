-- Add migration script here
create table if not exists users (
  id text primary key,
  name text not null,
  email text unique not null,
  pwd_hash text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tenants (
  id text primary key,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists lists (
  id text primary key,
  tenant_id text references tenants (id),
  user_id text references users (id),
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists categories (
  id text primary key,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tasks (
  id text primary key,
  list_id text references lists (id),
  category_id text references categories (id),
  name text not null,
  description text,
  due_date date,
  priority smallint check (priority >= 0 AND priority <= 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


