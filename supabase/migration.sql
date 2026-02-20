-- TradeSignal AI Database Migration
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  id uuid references auth.users primary key,
  username text unique,
  trading_capital numeric default 10000,
  risk_per_trade numeric default 2,
  preferred_markets text[] default '{"crypto"}',
  preferred_timeframes text[] default '{"1h","4h","1d"}',
  created_at timestamptz default now()
);

-- Trades table
create table if not exists trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  symbol text not null,
  direction text not null check (direction in ('long', 'short')),
  entry_price numeric,
  exit_price numeric,
  stop_loss numeric,
  take_profit numeric,
  position_size numeric,
  status text default 'planned' check (status in ('planned', 'open', 'closed', 'cancelled')),
  pnl numeric,
  pnl_percentage numeric,
  timeframe text,
  ai_analysis_id uuid,
  notes text,
  tags text[] default '{}',
  screenshot_url text,
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz default now()
);

-- AI analyses table
create table if not exists ai_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  symbol text not null,
  timeframes text[],
  direction_suggestion text,
  confidence numeric,
  analysis_text text,
  indicators_snapshot jsonb,
  macro_context jsonb,
  risk_params jsonb,
  created_at timestamptz default now()
);

-- Custom indicators table
create table if not exists custom_indicators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  description text,
  pine_script text,
  indicator_type text default 'overlay',
  parameters jsonb default '{}',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Backtests table
create table if not exists backtests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  symbol text,
  strategy_description text,
  timeframe text,
  start_date timestamptz,
  end_date timestamptz,
  total_trades int,
  win_rate numeric,
  avg_pnl numeric,
  max_drawdown numeric,
  sharpe_ratio numeric,
  results_json jsonb,
  created_at timestamptz default now()
);

-- Watchlists table
create table if not exists watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text default 'Default',
  symbols text[] default '{}',
  created_at timestamptz default now()
);

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
alter table profiles enable row level security;
alter table trades enable row level security;
alter table ai_analyses enable row level security;
alter table custom_indicators enable row level security;
alter table backtests enable row level security;
alter table watchlists enable row level security;

-- Profiles: users can only read/update their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Trades: users can only CRUD their own trades
create policy "Users can view own trades" on trades
  for select using (auth.uid() = user_id);

create policy "Users can insert own trades" on trades
  for insert with check (auth.uid() = user_id);

create policy "Users can update own trades" on trades
  for update using (auth.uid() = user_id);

create policy "Users can delete own trades" on trades
  for delete using (auth.uid() = user_id);

-- AI analyses: users can only CRUD their own analyses
create policy "Users can view own analyses" on ai_analyses
  for select using (auth.uid() = user_id);

create policy "Users can insert own analyses" on ai_analyses
  for insert with check (auth.uid() = user_id);

-- Custom indicators: users can only CRUD their own indicators
create policy "Users can view own indicators" on custom_indicators
  for select using (auth.uid() = user_id);

create policy "Users can insert own indicators" on custom_indicators
  for insert with check (auth.uid() = user_id);

create policy "Users can update own indicators" on custom_indicators
  for update using (auth.uid() = user_id);

create policy "Users can delete own indicators" on custom_indicators
  for delete using (auth.uid() = user_id);

-- Backtests: users can only CRUD their own backtests
create policy "Users can view own backtests" on backtests
  for select using (auth.uid() = user_id);

create policy "Users can insert own backtests" on backtests
  for insert with check (auth.uid() = user_id);

-- Watchlists: users can only CRUD their own watchlists
create policy "Users can view own watchlists" on watchlists
  for select using (auth.uid() = user_id);

create policy "Users can insert own watchlists" on watchlists
  for insert with check (auth.uid() = user_id);

create policy "Users can update own watchlists" on watchlists
  for update using (auth.uid() = user_id);

create policy "Users can delete own watchlists" on watchlists
  for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Indexes for performance
create index if not exists idx_trades_user_id on trades(user_id);
create index if not exists idx_trades_symbol on trades(symbol);
create index if not exists idx_trades_status on trades(status);
create index if not exists idx_ai_analyses_user_id on ai_analyses(user_id);
create index if not exists idx_ai_analyses_symbol on ai_analyses(symbol);
create index if not exists idx_custom_indicators_user_id on custom_indicators(user_id);
