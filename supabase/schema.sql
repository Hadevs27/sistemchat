create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id),
  role text not null,
  agent text,
  content text not null,
  input_tokens integer default 0,
  output_tokens integer default 0,
  total_tokens integer default 0,
  created_at timestamptz default now()
);
