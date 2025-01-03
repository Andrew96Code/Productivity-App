-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Temporarily disable RLS
alter table if exists public.goals disable row level security;
alter table if exists public.rewards disable row level security;
alter table if exists public.reward_redemptions disable row level security;

-- Drop existing policies
drop policy if exists "Users can view their own goals" on public.goals;
drop policy if exists "Users can manage their own goals" on public.goals;
drop policy if exists "Anyone can view rewards" on public.rewards;
drop policy if exists "Users can view their own redemptions" on public.reward_redemptions;
drop policy if exists "Users can redeem rewards" on public.reward_redemptions;

-- Drop existing tables
drop table if exists public.reward_redemptions cascade;
drop table if exists public.rewards cascade;
drop table if exists public.goals cascade;
drop table if exists public.points_log cascade;
drop table if exists public.achievements cascade;
drop table if exists public.user_achievements cascade;
drop table if exists public.daily_streaks cascade;
drop table if exists public.focus_sessions cascade;
drop table if exists public.mood_tracker cascade;
drop table if exists public.habit_logs cascade;
drop table if exists public.habits cascade;
drop table if exists public.journal_entries cascade;
drop table if exists public.user_stats cascade;

-- Create tables
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

-- Add indexes
create index goals_user_id_status_idx on public.goals(user_id, status);
create index habits_user_id_idx on public.habits(user_id);
create index habit_logs_habit_id_idx on public.habit_logs(habit_id);
create index focus_sessions_user_id_idx on public.focus_sessions(user_id);
create index mood_tracker_user_id_idx on public.mood_tracker(user_id);
create index journal_entries_user_id_idx on public.journal_entries(user_id);
create index achievements_category_idx on public.achievements(category);
create index user_achievements_user_id_idx on public.user_achievements(user_id);
create index daily_streaks_user_id_idx on public.daily_streaks(user_id);
create index points_log_user_id_idx on public.points_log(user_id);
create index reward_redemptions_user_id_idx on public.reward_redemptions(user_id);

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

-- Create policies
create policy "Users can view their own data"
    on public.goals for select
    using (auth.uid() = user_id);

create policy "Users can manage their own data"
    on public.goals for all
    using (auth.uid() = user_id);

create policy "Users can view their own habits"
    on public.habits for select
    using (auth.uid() = user_id);

create policy "Users can manage their own habits"
    on public.habits for all
    using (auth.uid() = user_id);

create policy "Users can view their own habit logs"
    on public.habit_logs for select
    using (exists (
        select 1 from habits
        where habits.id = habit_logs.habit_id
        and habits.user_id = auth.uid()
    ));

create policy "Users can manage their own habit logs"
    on public.habit_logs for all
    using (exists (
        select 1 from habits
        where habits.id = habit_logs.habit_id
        and habits.user_id = auth.uid()
    ));

create policy "Users can view their own focus sessions"
    on public.focus_sessions for select
    using (auth.uid() = user_id);

create policy "Users can manage their own focus sessions"
    on public.focus_sessions for all
    using (auth.uid() = user_id);

create policy "Users can view their own mood entries"
    on public.mood_tracker for select
    using (auth.uid() = user_id);

create policy "Users can manage their own mood entries"
    on public.mood_tracker for all
    using (auth.uid() = user_id);

create policy "Users can view their own journal entries"
    on public.journal_entries for select
    using (auth.uid() = user_id);

create policy "Users can manage their own journal entries"
    on public.journal_entries for all
    using (auth.uid() = user_id);

create policy "Anyone can view achievements"
    on public.achievements for select
    using (true);

create policy "Users can view their own achievement progress"
    on public.user_achievements for select
    using (auth.uid() = user_id);

create policy "Users can view their own streaks"
    on public.daily_streaks for select
    using (auth.uid() = user_id);

create policy "Users can view their own points"
    on public.points_log for select
    using (auth.uid() = user_id);

create policy "Users can view their own stats"
    on public.user_stats for select
    using (auth.uid() = user_id);

create policy "Anyone can view rewards"
    on public.rewards for select
    using (true);

create policy "Users can view their own redemptions"
    on public.reward_redemptions for select
    using (auth.uid() = user_id);

create policy "Users can redeem rewards"
    on public.reward_redemptions for insert
    with check (auth.uid() = user_id);

-- Insert sample achievements
insert into public.achievements (title, description, category, requirement_type, requirement_value, points_reward, badge_icon) values
    ('Early Bird', 'Complete 5 tasks before 10 AM', 'productivity', 'total', 5, 100, '🌅'),
    ('Streak Master', 'Maintain a 7-day streak', 'consistency', 'streak', 7, 200, '🔥'),
    ('Goal Crusher', 'Complete 10 goals', 'goals', 'total', 10, 300, '🎯'),
    ('Mindfulness Guru', 'Log mood for 30 consecutive days', 'wellbeing', 'streak', 30, 500, '🧘'),
    ('Focus Champion', 'Complete 20 focus sessions', 'productivity', 'total', 20, 400, '🎯'),
    ('Journal Master', 'Write 50 journal entries', 'reflection', 'total', 50, 600, '📔'),
    ('Habit Builder', 'Complete all daily habits for 14 days', 'habits', 'streak', 14, 700, '⚡');

-- Insert sample rewards
insert into public.rewards (title, description, points_cost, reward_type, availability)
values
    ('Premium Theme', 'Unlock dark mode and custom color themes', 1000, 'feature', 'one_time'),
    ('Data Analytics', 'Unlock detailed progress analytics and insights', 2000, 'feature', 'one_time'),
    ('Expert Badge', 'Show off your expertise with a special profile badge', 5000, 'badge', 'one_time'),
    ('Weekly Bonus', 'Double points for all activities for one week', 3000, 'feature', 'always'),
    ('Custom Goal Icons', 'Unlock custom icons for your goals', 1500, 'feature', 'one_time'),
    ('Premium Template Pack', 'Unlock premium journal templates', 2500, 'feature', 'one_time'),
    ('Productivity Coach', 'One-hour session with a productivity coach', 10000, 'prize', 'limited'),
    ('Custom Dashboard', 'Create your own personalized dashboard layout', 3500, 'feature', 'one_time'),
    ('Time Travel', 'Ability to backdate entries for missed days', 2000, 'feature', 'one_time'),
    ('Insights Pro', 'Advanced analytics and personalized recommendations', 4000, 'feature', 'one_time')
on conflict (title) do update set
    description = EXCLUDED.description,
    points_cost = EXCLUDED.points_cost,
    reward_type = EXCLUDED.reward_type,
    availability = EXCLUDED.availability; 