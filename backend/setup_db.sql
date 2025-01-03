-- First, disable row level security if it exists
do $$ 
begin
    execute 'alter table if exists points_log disable row level security';
    execute 'alter table if exists user_quiz_responses disable row level security';
    execute 'alter table if exists daily_logs disable row level security';
    execute 'alter table if exists goals disable row level security';
exception when others then null;
end $$;

-- Drop existing policies
do $$ 
begin
    execute 'drop policy if exists "Users can view their own logs" on daily_logs';
    execute 'drop policy if exists "Users can insert their own logs" on daily_logs';
    execute 'drop policy if exists "Users can view their own quiz responses" on user_quiz_responses';
    execute 'drop policy if exists "Users can insert their own quiz responses" on user_quiz_responses';
    execute 'drop policy if exists "Users can view their own points" on points_log';
    execute 'drop policy if exists "Users can insert their own points" on points_log';
    execute 'drop policy if exists "Users can view their own goals" on goals';
    execute 'drop policy if exists "Users can manage their own goals" on goals';
exception when others then null;
end $$;

-- Drop existing tables if they exist (in reverse order of dependencies)
do $$ 
begin
    -- First drop foreign key constraints
    alter table if exists user_quiz_responses drop constraint if exists user_quiz_responses_quiz_id_fkey;
    alter table if exists user_quiz_responses drop constraint if exists user_quiz_responses_user_id_fkey;
    alter table if exists points_log drop constraint if exists points_log_user_id_fkey;
    alter table if exists daily_logs drop constraint if exists daily_logs_user_id_fkey;
    alter table if exists goals drop constraint if exists goals_user_id_fkey;
    
    -- Then drop tables
    drop table if exists points_log cascade;
    drop table if exists user_quiz_responses cascade;
    drop table if exists quizzes cascade;
    drop table if exists daily_logs cascade;
    drop table if exists goals cascade;
exception when others then null;
end $$;

-- Create tables
create table if not exists quizzes (
    id uuid default uuid_generate_v4() primary key,
    question text not null,
    options jsonb not null,
    correct_answer text not null,
    points integer default 10,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists quiz_responses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    quiz_id uuid references quizzes(id) not null,
    selected_answer text not null,
    is_correct boolean not null,
    points_earned integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, quiz_id)
);

create table if not exists daily_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    content text not null,
    mood text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date(created_at))
);

create table if not exists points_log (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    points integer not null,
    reason text not null,
    category text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists goals (
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

create table if not exists habits (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    category text not null check (category in ('health', 'finance', 'productivity', 'learning', 'other')),
    frequency text not null check (frequency in ('daily', 'weekly', 'monthly')),
    target_value integer,
    current_streak integer default 0,
    longest_streak integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists habit_logs (
    id uuid default uuid_generate_v4() primary key,
    habit_id uuid references habits(id) not null,
    user_id uuid references auth.users(id) not null,
    value integer,
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(habit_id, date(completed_at))
);

create table if not exists transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    type text not null check (type in ('income', 'expense', 'saving', 'investment')),
    category text not null,
    amount numeric not null check (amount >= 0),
    description text,
    date date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert sample quiz questions
insert into quizzes (question, options, correct_answer) values
    ('What is a key benefit of daily journaling?', 
     '["Improved self-reflection", "Better handwriting", "Physical exercise", "Social networking"]',
     'Improved self-reflection'),
    ('Which habit-building strategy is most effective?',
     '["Inconsistent practice", "Setting realistic goals", "Avoiding challenges", "Skipping difficult days"]',
     'Setting realistic goals'),
    ('How can you improve productivity?',
     '["Multitasking constantly", "Working without breaks", "Setting clear priorities", "Avoiding planning"]',
     'Setting clear priorities'),
    ('What is an important aspect of financial planning?',
     '["Spending without tracking", "Regular budgeting", "Avoiding savings", "Ignoring expenses"]',
     'Regular budgeting'),
    ('Which is a healthy stress management technique?',
     '["Avoiding all activities", "Regular exercise", "Constant work", "Skipping meals"]',
     'Regular exercise');

-- Create indexes for better query performance
create index if not exists daily_logs_user_id_date_idx on daily_logs(user_id, date);
create index if not exists user_quiz_responses_user_id_idx on user_quiz_responses(user_id);
create index if not exists points_log_user_id_created_at_idx on points_log(user_id, created_at);

-- Enable Row Level Security (RLS) policies
alter table daily_logs enable row level security;
alter table user_quiz_responses enable row level security;
alter table points_log enable row level security;

-- Create policies
create policy "Users can view their own logs"
    on daily_logs for select
    using (auth.uid() = user_id);

create policy "Users can insert their own logs"
    on daily_logs for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own quiz responses"
    on user_quiz_responses for select
    using (auth.uid() = user_id);

create policy "Users can insert their own quiz responses"
    on user_quiz_responses for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own points"
    on points_log for select
    using (auth.uid() = user_id);

create policy "Users can insert their own points"
    on points_log for insert
    with check (auth.uid() = user_id);

-- Add index for goals
create index if not exists goals_user_id_status_idx on goals(user_id, status);

-- Enable RLS for goals
alter table goals enable row level security;

-- Add policies for goals
create policy "Users can view their own goals"
    on goals for select
    using (auth.uid() = user_id);

create policy "Users can manage their own goals"
    on goals for all
    using (auth.uid() = user_id);

-- Clear existing quiz data
truncate table quizzes cascade;

-- Insert sample quiz data
insert into quizzes (question, options, correct_answer, category, difficulty_level, points, explanation) values
(
    'What is the most effective way to build a new habit?',
    '["Start big and ambitious", "Start small and consistent", "Wait for motivation", "Change everything at once"]'::jsonb,
    'Start small and consistent',
    'productivity',
    'easy',
    10,
    'Starting small and being consistent is key to habit formation. This approach helps build sustainable habits that last.'
),
(
    'Which budgeting rule is commonly recommended for basic financial planning?',
    '["30-30-30-10 Rule", "50-30-20 Rule", "40-40-20 Rule", "60-20-20 Rule"]'::jsonb,
    '50-30-20 Rule',
    'finance',
    'medium',
    15,
    'The 50-30-20 rule suggests using 50% of income for needs, 30% for wants, and 20% for savings and debt repayment.'
),
(
    'What is the recommended daily water intake for most adults?',
    '["2-3 liters", "1 liter", "4-5 liters", "0.5 liters"]'::jsonb,
    '2-3 liters',
    'health',
    'easy',
    10,
    'Most health authorities recommend 2-3 liters of water daily for adults, though needs may vary based on climate and activity level.'
),
(
    'Which technique is most effective for maintaining focus during work?',
    '["Multitasking", "Pomodoro Technique", "Working longer hours", "Constant email checking"]'::jsonb,
    'Pomodoro Technique',
    'productivity',
    'easy',
    10,
    'The Pomodoro Technique, using focused 25-minute work sessions with short breaks, helps maintain concentration and prevent burnout.'
),
(
    'What is compound interest?',
    '["Interest only on principal", "Interest on interest", "Fixed monthly interest", "Simple annual interest"]'::jsonb,
    'Interest on interest',
    'finance',
    'medium',
    15,
    'Compound interest is when you earn interest not only on your initial investment but also on the accumulated interest over time.'
);

-- Drop existing tables if they exist
drop table if exists user_achievements;
drop table if exists achievements;
drop table if exists reward_redemptions;
drop table if exists rewards;
drop table if exists prize_draw_entries;
drop table if exists prize_draws;
drop table if exists points_log;
drop table if exists daily_logs;
drop table if exists quiz_responses;
drop table if exists quizzes;
drop table if exists goals;
drop table if exists habits;
drop table if exists habit_logs;
drop table if exists transactions;

-- Create tables
create table if not exists achievements (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    category text not null check (category in ('general', 'habits', 'goals', 'quiz', 'finance', 'journaling')),
    points_reward integer not null check (points_reward >= 0),
    requirement_type text not null check (requirement_type in ('count', 'streak', 'total', 'milestone')),
    requirement_value integer not null check (requirement_value > 0),
    badge_icon text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists user_achievements (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    achievement_id uuid references achievements(id) not null,
    progress integer not null default 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, achievement_id)
);

create table if not exists rewards (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    points_cost integer not null check (points_cost > 0),
    reward_type text not null check (reward_type in ('badge', 'feature', 'prize')),
    availability text not null check (availability in ('always', 'limited', 'one_time')),
    stock integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists reward_redemptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    reward_id uuid references rewards(id) not null,
    points_spent integer not null check (points_spent > 0),
    redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert sample achievements
insert into achievements (title, description, category, points_reward, requirement_type, requirement_value, badge_icon) values
    ('Early Bird', 'Complete morning journal entries for 7 consecutive days', 'journaling', 100, 'streak', 7, '🌅'),
    ('Quiz Master', 'Answer 50 quiz questions correctly', 'quiz', 200, 'count', 50, '🎓'),
    ('Goal Getter', 'Complete 10 goals', 'goals', 300, 'count', 10, '🎯'),
    ('Habit Hero', 'Maintain any habit for 30 days', 'habits', 500, 'streak', 30, '⭐'),
    ('Savings Sage', 'Save a total of $1000', 'finance', 400, 'total', 1000, '💰'),
    ('Milestone Master', 'Earn 10000 total points', 'general', 1000, 'milestone', 10000, '🏆');

-- Insert sample rewards
insert into rewards (title, description, points_cost, reward_type, availability) values
    ('Premium Theme', 'Unlock dark mode and custom color themes', 1000, 'feature', 'one_time'),
    ('Data Analytics', 'Unlock detailed progress analytics and insights', 2000, 'feature', 'one_time'),
    ('Expert Badge', 'Show off your expertise with a special profile badge', 5000, 'badge', 'one_time'),
    ('Weekly Bonus', 'Double points for all activities for one week', 3000, 'feature', 'always'),
    ('Custom Goal Icons', 'Unlock custom icons for your goals', 1500, 'feature', 'one_time'),
    ('Premium Template Pack', 'Unlock premium journal templates', 2500, 'feature', 'one_time');

-- Learning Paths System
create table if not exists learning_paths (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    category text not null check (category in ('productivity', 'finance', 'health', 'career', 'personal')),
    difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
    estimated_days integer not null,
    points_reward integer not null,
    prerequisites jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists learning_modules (
    id uuid default uuid_generate_v4() primary key,
    path_id uuid references learning_paths(id) not null,
    title text not null,
    description text not null,
    content_type text not null check (content_type in ('video', 'article', 'quiz', 'exercise', 'project')),
    content jsonb not null,
    order_index integer not null,
    points_reward integer not null,
    estimated_minutes integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists user_learning_progress (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    path_id uuid references learning_paths(id) not null,
    module_id uuid references learning_modules(id) not null,
    status text not null check (status in ('not_started', 'in_progress', 'completed')),
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, module_id)
);

-- Insert sample learning paths
insert into learning_paths (title, description, category, difficulty, estimated_days, points_reward, prerequisites) values
(
    'Financial Freedom Fundamentals',
    'Master the basics of personal finance and build a strong financial foundation.',
    'finance',
    'beginner',
    30,
    1000,
    '{"required_paths": [], "min_level": 0}'::jsonb
),
(
    'Productivity Mastery',
    'Learn advanced productivity techniques and time management strategies.',
    'productivity',
    'intermediate',
    21,
    800,
    '{"required_paths": [], "min_level": 2}'::jsonb
),
(
    'Healthy Habits Formation',
    'Develop sustainable healthy habits and understand behavior change.',
    'health',
    'beginner',
    28,
    900,
    '{"required_paths": [], "min_level": 0}'::jsonb
);

-- Insert sample modules for Financial Freedom path
insert into learning_modules (path_id, title, description, content_type, content, order_index, points_reward, estimated_minutes)
select 
    p.id,
    'Budgeting Basics',
    'Learn the fundamentals of creating and maintaining a budget.',
    'video',
    '{"video_url": "path/to/video", "transcript": "Budget basics transcript...", "quiz": [{"question": "What is the 50/30/20 rule?", "options": ["Option 1", "Option 2"], "correct": 0}]}'::jsonb,
    1,
    50,
    30
from learning_paths p
where p.title = 'Financial Freedom Fundamentals';

-- Add indexes for better query performance
create index if not exists learning_paths_category_idx on learning_paths(category);
create index if not exists learning_modules_path_id_idx on learning_modules(path_id);
create index if not exists user_learning_progress_user_id_idx on user_learning_progress(user_id);

-- Social Accountability System
create table if not exists user_profiles (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    display_name text not null,
    bio text,
    avatar_url text,
    level integer default 1,
    total_points integer default 0,
    privacy_settings jsonb default '{"profile": "public", "goals": "friends", "habits": "friends", "achievements": "public"}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

create table if not exists friendships (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    friend_id uuid references auth.users(id) not null,
    status text not null check (status in ('pending', 'accepted', 'blocked')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, friend_id)
);

create table if not exists accountability_groups (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    category text not null check (category in ('productivity', 'finance', 'health', 'learning', 'other')),
    privacy text not null check (privacy in ('public', 'private', 'invite_only')),
    max_members integer,
    created_by uuid references auth.users(id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists group_members (
    id uuid default uuid_generate_v4() primary key,
    group_id uuid references accountability_groups(id) not null,
    user_id uuid references auth.users(id) not null,
    role text not null check (role in ('admin', 'moderator', 'member')),
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(group_id, user_id)
);

create table if not exists group_challenges (
    id uuid default uuid_generate_v4() primary key,
    group_id uuid references accountability_groups(id) not null,
    title text not null,
    description text not null,
    challenge_type text not null check (challenge_type in ('habit', 'goal', 'learning')),
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    points_reward integer not null,
    rules jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists challenge_participants (
    id uuid default uuid_generate_v4() primary key,
    challenge_id uuid references group_challenges(id) not null,
    user_id uuid references auth.users(id) not null,
    status text not null check (status in ('joined', 'in_progress', 'completed', 'failed')),
    progress jsonb,
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone,
    unique(challenge_id, user_id)
);

create table if not exists social_feed (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    content_type text not null check (content_type in ('achievement', 'goal_completed', 'habit_milestone', 'challenge_update', 'learning_progress')),
    content jsonb not null,
    visibility text not null check (visibility in ('public', 'friends', 'group', 'private')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists social_interactions (
    id uuid default uuid_generate_v4() primary key,
    feed_id uuid references social_feed(id) not null,
    user_id uuid references auth.users(id) not null,
    interaction_type text not null check (interaction_type in ('like', 'comment', 'share', 'celebrate')),
    content text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better query performance
create index if not exists user_profiles_user_id_idx on user_profiles(user_id);
create index if not exists friendships_user_id_idx on friendships(user_id);
create index if not exists friendships_friend_id_idx on friendships(friend_id);
create index if not exists group_members_user_id_idx on group_members(user_id);
create index if not exists social_feed_user_id_created_at_idx on social_feed(user_id, created_at);

-- Analytics System
create table if not exists user_analytics (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    metric_type text not null check (metric_type in ('productivity_score', 'focus_time', 'habit_consistency', 'learning_progress', 'financial_health')),
    date date not null,
    value numeric not null,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists productivity_metrics (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    focus_minutes integer default 0,
    tasks_completed integer default 0,
    goals_progressed integer default 0,
    habits_completed integer default 0,
    learning_minutes integer default 0,
    productivity_score numeric generated always as (
        (focus_minutes::numeric / 480 * 40) + 
        (tasks_completed * 15) +
        (goals_progressed * 20) +
        (habits_completed * 10) +
        (learning_minutes::numeric / 60 * 15)
    ) stored,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

create table if not exists focus_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration_minutes integer,
    category text not null,
    task_description text,
    interruptions integer default 0,
    focus_rating integer check (focus_rating between 1 and 5),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists mood_tracking (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    mood_score integer check (mood_score between 1 and 5) not null,
    energy_level integer check (energy_level between 1 and 5) not null,
    stress_level integer check (stress_level between 1 and 5) not null,
    notes text,
    factors jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

create table if not exists insights_generated (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    insight_type text not null check (insight_type in ('productivity_pattern', 'habit_correlation', 'mood_trigger', 'financial_trend', 'learning_optimization')),
    title text not null,
    description text not null,
    data_points jsonb not null,
    relevance_score numeric check (relevance_score between 0 and 1),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better query performance
create index if not exists user_analytics_user_id_date_idx on user_analytics(user_id, date);
create index if not exists productivity_metrics_user_id_date_idx on productivity_metrics(user_id, date);
create index if not exists focus_sessions_user_id_start_time_idx on focus_sessions(user_id, start_time);
create index if not exists mood_tracking_user_id_date_idx on mood_tracking(user_id, date);

-- Create views for common analytics queries
create or replace view user_weekly_stats as
select 
    user_id,
    date_trunc('week', date) as week_start,
    avg(productivity_score) as avg_productivity_score,
    sum(focus_minutes) as total_focus_minutes,
    sum(tasks_completed) as total_tasks_completed,
    sum(habits_completed) as total_habits_completed,
    sum(learning_minutes) as total_learning_minutes
from productivity_metrics
group by user_id, date_trunc('week', date);

create or replace view user_mood_patterns as
select 
    user_id,
    date_trunc('month', date) as month,
    avg(mood_score) as avg_mood,
    avg(energy_level) as avg_energy,
    avg(stress_level) as avg_stress,
    mode() within group (order by mood_score) as most_common_mood
from mood_tracking
group by user_id, date_trunc('month', date);

-- Task Management System
create table if not exists task_lists (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    is_default boolean default false,
    color text,
    icon text,
    sort_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists tasks (
    id uuid default uuid_generate_v4() primary key,
    list_id uuid references task_lists(id) not null,
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
    status text check (status in ('not_started', 'in_progress', 'completed', 'deferred')) default 'not_started',
    due_date timestamp with time zone,
    estimated_minutes integer,
    actual_minutes integer,
    recurrence_rule jsonb,
    parent_task_id uuid references tasks(id),
    sort_order integer default 0,
    tags text[],
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone
);

create table if not exists task_notes (
    id uuid default uuid_generate_v4() primary key,
    task_id uuid references tasks(id) not null,
    user_id uuid references auth.users(id) not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists task_attachments (
    id uuid default uuid_generate_v4() primary key,
    task_id uuid references tasks(id) not null,
    user_id uuid references auth.users(id) not null,
    file_name text not null,
    file_type text not null,
    file_size integer not null,
    file_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists task_time_blocks (
    id uuid default uuid_generate_v4() primary key,
    task_id uuid references tasks(id) not null,
    user_id uuid references auth.users(id) not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    status text check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')) default 'scheduled',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists task_dependencies (
    id uuid default uuid_generate_v4() primary key,
    task_id uuid references tasks(id) not null,
    dependent_task_id uuid references tasks(id) not null,
    dependency_type text check (dependency_type in ('blocks', 'blocked_by', 'related_to')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(task_id, dependent_task_id)
);

create table if not exists task_templates (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    category text not null,
    template_data jsonb not null,
    is_public boolean default false,
    usage_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better query performance
create index if not exists tasks_user_id_status_idx on tasks(user_id, status);
create index if not exists tasks_list_id_sort_order_idx on tasks(list_id, sort_order);
create index if not exists tasks_due_date_idx on tasks(due_date) where due_date is not null;
create index if not exists task_time_blocks_user_id_start_time_idx on task_time_blocks(user_id, start_time);

-- Insert default task lists
insert into task_lists (user_id, title, is_default, color, icon, sort_order)
select 
    id as user_id,
    'Inbox' as title,
    true as is_default,
    '#6366F1' as color,
    '📥' as icon,
    0 as sort_order
from auth.users;

-- Create view for task analytics
create or replace view task_completion_stats as
select 
    user_id,
    date_trunc('day', completed_at) as completion_date,
    count(*) as tasks_completed,
    avg(actual_minutes::float / nullif(estimated_minutes, 0)) as estimation_accuracy,
    sum(actual_minutes) as total_time_spent
from tasks
where status = 'completed'
group by user_id, date_trunc('day', completed_at);

-- Gamification System
create table if not exists experience_levels (
    level integer primary key,
    min_xp integer not null,
    title text not null,
    badge_url text,
    perks jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists user_experience (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    total_xp integer default 0,
    current_level integer references experience_levels(level) default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id)
);

create table if not exists xp_transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    amount integer not null,
    source text not null check (source in ('task_completion', 'habit_streak', 'goal_achievement', 'learning_progress', 'challenge_completion')),
    description text not null,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists skill_trees (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    category text not null,
    prerequisites jsonb,
    max_level integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists skill_nodes (
    id uuid default uuid_generate_v4() primary key,
    tree_id uuid references skill_trees(id) not null,
    title text not null,
    description text not null,
    level integer not null,
    xp_reward integer not null,
    prerequisites jsonb,
    unlocks jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists user_skills (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    node_id uuid references skill_nodes(id) not null,
    level integer not null default 1,
    progress integer not null default 0,
    unlocked_at timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, node_id)
);

create table if not exists quests (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    category text not null,
    difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced', 'expert')),
    requirements jsonb not null,
    rewards jsonb not null,
    time_limit interval,
    is_repeatable boolean default false,
    cooldown_hours integer,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists user_quests (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    quest_id uuid references quests(id) not null,
    status text not null check (status in ('active', 'completed', 'failed', 'abandoned')),
    progress jsonb,
    started_at timestamp with time zone not null,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists daily_challenges (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    category text not null,
    difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
    requirements jsonb not null,
    rewards jsonb not null,
    available_at date not null,
    expires_at date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists user_daily_challenges (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    challenge_id uuid references daily_challenges(id) not null,
    status text not null check (status in ('active', 'completed', 'failed')),
    progress jsonb,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, challenge_id)
);

-- Insert initial experience levels
insert into experience_levels (level, min_xp, title, badge_url, perks) values
(1, 0, 'Novice', '/badges/novice.png', '{"daily_quests": 3, "bonus_points": 0}'::jsonb),
(2, 100, 'Apprentice', '/badges/apprentice.png', '{"daily_quests": 4, "bonus_points": 5}'::jsonb),
(3, 300, 'Journeyman', '/badges/journeyman.png', '{"daily_quests": 5, "bonus_points": 10}'::jsonb),
(4, 600, 'Expert', '/badges/expert.png', '{"daily_quests": 6, "bonus_points": 15}'::jsonb),
(5, 1000, 'Master', '/badges/master.png', '{"daily_quests": 7, "bonus_points": 20}'::jsonb),
(6, 1500, 'Grandmaster', '/badges/grandmaster.png', '{"daily_quests": 8, "bonus_points": 25}'::jsonb),
(7, 2100, 'Legend', '/badges/legend.png', '{"daily_quests": 9, "bonus_points": 30}'::jsonb),
(8, 2800, 'Mythic', '/badges/mythic.png', '{"daily_quests": 10, "bonus_points": 35}'::jsonb),
(9, 3600, 'Divine', '/badges/divine.png', '{"daily_quests": 11, "bonus_points": 40}'::jsonb),
(10, 4500, 'Immortal', '/badges/immortal.png', '{"daily_quests": 12, "bonus_points": 50}'::jsonb);

-- Add indexes for better query performance
create index if not exists user_experience_total_xp_idx on user_experience(total_xp);
create index if not exists xp_transactions_user_id_created_at_idx on xp_transactions(user_id, created_at);
create index if not exists user_skills_user_id_idx on user_skills(user_id);
create index if not exists user_quests_user_id_status_idx on user_quests(user_id, status);
create index if not exists user_daily_challenges_user_id_status_idx on user_daily_challenges(user_id, status); 