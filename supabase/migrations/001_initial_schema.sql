-- SignalStack Database Schema
-- Run this in Supabase SQL Editor or via `supabase db push`

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  tier text not null default 'free' check (tier in ('free', 'starter', 'growth', 'team')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  products_limit integer not null default 1,
  signals_daily_limit integer not null default 10,
  ai_drafts_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
