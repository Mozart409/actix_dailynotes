-- Add migration script here
create index if not exists idx_lists_tenant_id ON lists (tenant_id);
create index if not exists idx_lists_user_id ON lists (user_id);
create index if not exists idx_tasks_list_id ON tasks (list_id);
create index if not exists idx_tasks_category_id ON tasks (category_id);