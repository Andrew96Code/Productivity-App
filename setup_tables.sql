-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    badge_icon VARCHAR(100),
    requirement_type VARCHAR(50) NOT NULL,
    requirement_value INTEGER NOT NULL,
    points_reward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_achievements table for tracking progress
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    progress INTEGER NOT NULL DEFAULT 0,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements table
CREATE POLICY "Allow public read access to achievements" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update achievements" ON achievements
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for user_achievements table
CREATE POLICY "Allow users to view their own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own achievements" ON user_achievements
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert some default achievements
INSERT INTO achievements (title, description, category, badge_icon, requirement_type, requirement_value, points_reward) VALUES
('Early Bird', 'Complete 5 tasks before 10 AM', 'Daily', '🌅', 'early_tasks', 5, 50),
('Focus Master', 'Complete 10 focus sessions', 'Focus', '🎯', 'focus_sessions', 10, 100),
('Goal Setter', 'Create and complete 3 goals', 'Goals', '🎯', 'completed_goals', 3, 75),
('Habit Former', 'Maintain a habit for 21 days', 'Habits', '⭐', 'habit_streak', 21, 150),
('Reflection Guru', 'Write 7 journal entries', 'Journal', '📝', 'journal_entries', 7, 70),
('Mood Tracker', 'Log your mood for 7 consecutive days', 'Mood', '😊', 'mood_streak', 7, 70),
('Point Collector', 'Earn 1000 total points', 'Points', '💎', 'total_points', 1000, 200),
('Task Master', 'Complete 50 tasks', 'Tasks', '✅', 'completed_tasks', 50, 150),
('Reward Redeemer', 'Redeem 5 rewards', 'Rewards', '🎁', 'redeemed_rewards', 5, 100),
('Consistency King', 'Log in for 30 consecutive days', 'Streak', '👑', 'login_streak', 30, 300);

-- Drop existing policies if they exist
drop policy if exists "Users can view their own goals" on public.goals;
drop policy if exists "Users can manage their own goals" on public.goals;
drop policy if exists "Anyone can view rewards" on public.rewards;
drop policy if exists "Users can view their own redemptions" on public.reward_redemptions;
drop policy if exists "Users can redeem rewards" on public.reward_redemptions;

-- Create tables
create table if not exists public.goals (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    category text not null check (category in ('health', 'finance', 'productivity', 'learning', 'other')),
    target_date date,
    target_value numeric,
    current_value numeric default 0,
    status text not null check (status in ('not_started', 'in_progress', 'completed', 'abandoned')) default 'not_started',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.rewards (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    points_cost integer not null check (points_cost > 0),
    reward_type text not null check (reward_type in ('badge', 'feature', 'prize')),
    availability text not null check (availability in ('always', 'limited', 'one_time')),
    stock integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.reward_redemptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    reward_id uuid references rewards(id) not null,
    points_spent integer not null check (points_spent > 0),
    redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better query performance
create index if not exists goals_user_id_status_idx on public.goals(user_id, status);
create index if not exists reward_redemptions_user_id_idx on public.reward_redemptions(user_id);

-- Enable RLS for goals
alter table public.goals enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;

-- Add policies for goals
create policy "Users can view their own goals"
    on public.goals for select
    using (auth.uid() = user_id);

create policy "Users can manage their own goals"
    on public.goals for all
    using (auth.uid() = user_id);

-- Add policies for rewards
create policy "Anyone can view rewards"
    on public.rewards for select
    using (true);

create policy "Users can view their own redemptions"
    on public.reward_redemptions for select
    using (auth.uid() = user_id);

create policy "Users can redeem rewards"
    on public.reward_redemptions for insert
    with check (auth.uid() = user_id);

-- Insert sample rewards if they don't exist
insert into public.rewards (title, description, points_cost, reward_type, availability)
select 'Premium Theme', 'Unlock dark mode and custom color themes', 1000, 'feature', 'one_time'
where not exists (select 1 from public.rewards where title = 'Premium Theme');

insert into public.rewards (title, description, points_cost, reward_type, availability)
select 'Data Analytics', 'Unlock detailed progress analytics and insights', 2000, 'feature', 'one_time'
where not exists (select 1 from public.rewards where title = 'Data Analytics');

insert into public.rewards (title, description, points_cost, reward_type, availability)
select 'Expert Badge', 'Show off your expertise with a special profile badge', 5000, 'badge', 'one_time'
where not exists (select 1 from public.rewards where title = 'Expert Badge');

insert into public.rewards (title, description, points_cost, reward_type, availability)
select 'Weekly Bonus', 'Double points for all activities for one week', 3000, 'feature', 'always'
where not exists (select 1 from public.rewards where title = 'Weekly Bonus');

insert into public.rewards (title, description, points_cost, reward_type, availability)
select 'Custom Goal Icons', 'Unlock custom icons for your goals', 1500, 'feature', 'one_time'
where not exists (select 1 from public.rewards where title = 'Custom Goal Icons');

insert into public.rewards (title, description, points_cost, reward_type, availability)
select 'Premium Template Pack', 'Unlock premium journal templates', 2500, 'feature', 'one_time'
where not exists (select 1 from public.rewards where title = 'Premium Template Pack');

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    frequency TEXT NOT NULL,
    target_value INTEGER DEFAULT 1,
    current_value INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Create habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
    id UUID PRIMARY KEY,
    habit_id UUID NOT NULL,
    user_id UUID NOT NULL,
    completion_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    UNIQUE (habit_id, completion_date)
);

-- Enable Row Level Security (RLS)
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Create policies for habits table
CREATE POLICY "Users can view their own habits"
    ON habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
    ON habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
    ON habits FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
    ON habits FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for habit_completions table
CREATE POLICY "Users can view their own habit completions"
    ON habit_completions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habit completions"
    ON habit_completions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions"
    ON habit_completions FOR DELETE
    USING (auth.uid() = user_id);

-- Create focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    duration INTEGER NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for focus_sessions table
CREATE POLICY "Users can view their own focus sessions"
    ON focus_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own focus sessions"
    ON focus_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own focus sessions"
    ON focus_sessions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own focus sessions"
    ON focus_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    mood_rating INTEGER NOT NULL CHECK (mood_rating BETWEEN 1 AND 5),
    mood_type TEXT NOT NULL,
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
    sleep_hours NUMERIC CHECK (sleep_hours BETWEEN 0 AND 24),
    activities TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable RLS for mood_entries
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for mood_entries
CREATE POLICY "Users can view their own mood entries"
    ON mood_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries"
    ON mood_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries"
    ON mood_entries FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries"
    ON mood_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for mood_entries
CREATE INDEX IF NOT EXISTS mood_entries_user_id_idx ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS mood_entries_created_at_idx ON mood_entries(created_at);
CREATE INDEX IF NOT EXISTS mood_entries_mood_type_idx ON mood_entries(mood_type);

-- Create points_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS points_history (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable RLS for points_history
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;

-- Create policies for points_history
CREATE POLICY "Users can view their own points history"
    ON points_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points"
    ON points_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for points_history
CREATE INDEX IF NOT EXISTS points_history_user_id_idx ON points_history(user_id);
CREATE INDEX IF NOT EXISTS points_history_created_at_idx ON points_history(created_at);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    prompt_type TEXT NOT NULL,
    response TEXT NOT NULL,
    mood_rating INTEGER,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own journal entries"
    ON journal_entries
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
    ON journal_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
    ON journal_entries
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
    ON journal_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_journal_entries_prompt_type ON journal_entries(prompt_type); 