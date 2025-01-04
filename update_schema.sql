-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing tables in reverse dependency order
drop table if exists public.reward_redemptions cascade;
drop table if exists public.rewards cascade;
drop table if exists public.goals cascade;
drop table if exists public.points_log cascade;
drop table if exists public.user_achievements cascade;
drop table if exists public.achievements cascade;
drop table if exists public.daily_streaks cascade;
drop table if exists public.focus_sessions cascade;
drop table if exists public.mood_tracker cascade;
drop table if exists public.habit_logs cascade;
drop table if exists public.habits cascade;
drop table if exists public.journal_entries cascade;
drop table if exists public.user_stats cascade;

-- Create tables in dependency order
create table public.goals (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    category text not null check (category in ('health', 'finance', 'productivity', 'learning', 'other')),
    target_date date,
    target_value numeric,
    current_value numeric default 0,
    status text not null check (status in ('not_started', 'in_progress', 'completed', 'abandoned')) default 'not_started',
    priority text check (priority in ('low', 'medium', 'high')),
    tags text[],
    reminder_frequency text check (reminder_frequency in ('daily', 'weekly', 'monthly', 'none')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.habits (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    category text not null check (category in ('health', 'finance', 'productivity', 'learning', 'other')),
    frequency text not null check (frequency in ('daily', 'weekly', 'monthly')),
    target_value integer default 1,
    current_streak integer default 0,
    longest_streak integer default 0,
    points_per_completion integer default 10,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.habit_logs (
    id uuid default uuid_generate_v4() primary key,
    habit_id uuid references habits(id) not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    value integer default 1,
    notes text
);

create table public.focus_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration_minutes integer,
    task_description text,
    category text check (category in ('work', 'study', 'creative', 'exercise', 'other')),
    success_rating integer check (success_rating between 1 and 5),
    distractions_count integer default 0,
    notes text
);

create table public.mood_tracker (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    mood_rating integer check (mood_rating between 1 and 5) not null,
    energy_level integer check (energy_level between 1 and 5),
    stress_level integer check (stress_level between 1 and 5),
    notes text,
    recorded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.journal_entries (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text,
    content text not null,
    mood_rating integer check (mood_rating between 1 and 5),
    tags text[],
    category text check (category in ('gratitude', 'reflection', 'planning', 'other')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.achievements (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    category text not null,
    requirement_type text not null check (requirement_type in ('streak', 'total', 'milestone')),
    requirement_value integer not null,
    points_reward integer not null default 100,
    badge_icon text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_achievements (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    achievement_id uuid references achievements(id) not null,
    progress integer default 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, achievement_id)
);

create table public.daily_streaks (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    streak_type text not null check (streak_type in ('login', 'goals', 'habits', 'journal')),
    current_streak integer default 0,
    longest_streak integer default 0,
    last_activity_date date not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.points_log (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    points integer not null,
    reason text not null,
    category text not null check (category in ('goal_completion', 'habit_streak', 'achievement', 'reward_redemption', 'focus_session', 'journal')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.user_stats (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    total_points integer default 0,
    goals_completed integer default 0,
    habits_completed integer default 0,
    focus_minutes integer default 0,
    journal_entries integer default 0,
    achievements_earned integer default 0,
    current_streak integer default 0,
    longest_streak integer default 0,
    last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

create table public.rewards (
    id uuid default uuid_generate_v4() primary key,
    title text not null unique,
    description text not null,
    points_cost integer not null check (points_cost > 0),
    reward_type text not null check (reward_type in ('badge', 'feature', 'prize')),
    availability text not null check (availability in ('always', 'limited', 'one_time')),
    stock integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.reward_redemptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    reward_id uuid references rewards(id) not null,
    points_spent integer not null check (points_spent > 0),
    redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.goals enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.mood_tracker enable row level security;
alter table public.journal_entries enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.daily_streaks enable row level security;
alter table public.points_log enable row level security;
alter table public.user_stats enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security; 