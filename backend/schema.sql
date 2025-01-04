-- Users table (managed by Supabase Auth)
-- This is automatically created by Supabase

-- Daily logs table
create table daily_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    morning_prompt_response text,
    midday_prompt_response text,
    evening_prompt_response text,
    date date not null default current_date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

-- Quizzes table
create table quizzes (
    id uuid default uuid_generate_v4() primary key,
    question text not null,
    options jsonb not null,
    correct_answer text not null,
    difficulty_level text not null check (difficulty_level in ('easy', 'medium', 'hard')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User quiz responses table
create table user_quiz_responses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    quiz_id uuid references quizzes(id) not null,
    selected_answer text not null,
    correct boolean not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Points log table
create table points_log (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    points integer not null,
    reason text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Social features tables
create table user_profiles (
    user_id uuid references auth.users(id) primary key,
    username text unique not null,
    avatar_url text,
    bio text,
    total_points integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table challenges (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    challenge_type text not null check (challenge_type in ('daily', 'weekly', 'monthly')),
    points integer not null,
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table user_challenges (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    challenge_id uuid references challenges(id) not null,
    status text not null check (status in ('in_progress', 'completed', 'failed')),
    progress jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, challenge_id)
);

create table leaderboards (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    type text not null check (type in ('daily', 'weekly', 'monthly', 'all_time')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reports and insights tables
create table user_reports (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    report_type text not null check (report_type in ('weekly', 'monthly')),
    start_date date not null,
    end_date date not null,
    metrics jsonb not null,
    insights jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, report_type, start_date)
);

create table ai_recommendations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    recommendation_type text not null,
    content text not null,
    context jsonb,
    is_implemented boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table user_notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text not null,
    message text not null,
    type text not null check (type in ('reminder', 'achievement', 'challenge', 'social', 'system')),
    status text not null check (status in ('unread', 'read', 'dismissed')),
    scheduled_for timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Friend/Connection system
create table friend_connections (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    friend_id uuid references auth.users(id) not null,
    status text not null check (status in ('pending', 'accepted', 'blocked')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, friend_id)
);

-- Direct messaging system
create table direct_messages (
    id uuid default uuid_generate_v4() primary key,
    sender_id uuid references auth.users(id) not null,
    receiver_id uuid references auth.users(id) not null,
    content text not null,
    read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Group challenges
create table challenge_groups (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text,
    creator_id uuid references auth.users(id) not null,
    is_private boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table group_members (
    id uuid default uuid_generate_v4() primary key,
    group_id uuid references challenge_groups(id) not null,
    user_id uuid references auth.users(id) not null,
    role text not null check (role in ('admin', 'member')),
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(group_id, user_id)
);

create table group_challenges (
    id uuid default uuid_generate_v4() primary key,
    group_id uuid references challenge_groups(id) not null,
    challenge_id uuid references challenges(id) not null,
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Achievement sharing and social feed
create table social_activities (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    activity_type text not null check (activity_type in ('achievement', 'challenge_complete', 'milestone', 'custom')),
    content jsonb not null,
    visibility text not null check (visibility in ('public', 'friends', 'private')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table activity_reactions (
    id uuid default uuid_generate_v4() primary key,
    activity_id uuid references social_activities(id) not null,
    user_id uuid references auth.users(id) not null,
    reaction_type text not null check (reaction_type in ('like', 'celebrate', 'support')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(activity_id, user_id)
);

create table activity_comments (
    id uuid default uuid_generate_v4() primary key,
    activity_id uuid references social_activities(id) not null,
    user_id uuid references auth.users(id) not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Time tracking tables
create table time_entries (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    activity_type text not null,
    category text not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration interval,
    notes text,
    tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table productivity_scores (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    score numeric not null check (score >= 0 and score <= 100),
    factors jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

-- Habit streaks and patterns
create table habit_streaks (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    habit_id uuid references habits(id) not null,
    start_date date not null,
    end_date date,
    current_streak integer not null default 1,
    longest_streak integer not null default 1,
    streak_history jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table habit_patterns (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    pattern_type text not null check (pattern_type in ('daily', 'weekly', 'monthly')),
    pattern_data jsonb not null,
    analysis_date date not null,
    insights text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Custom dashboards
create table custom_dashboards (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    name text not null,
    layout jsonb not null,
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table dashboard_widgets (
    id uuid default uuid_generate_v4() primary key,
    dashboard_id uuid references custom_dashboards(id) not null,
    widget_type text not null,
    title text not null,
    config jsonb not null,
    position jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics settings and preferences
create table analytics_preferences (
    user_id uuid references auth.users(id) primary key,
    time_zone text not null default 'UTC',
    working_hours jsonb,
    productivity_weights jsonb,
    custom_categories jsonb,
    export_preferences jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Achievement and Badge System
create table achievement_types (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    category text not null,
    icon_url text,
    requirements jsonb not null,
    points integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table user_achievements (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    achievement_id uuid references achievement_types(id) not null,
    earned_at timestamp with time zone not null,
    progress jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, achievement_id)
);

-- Quest System
create table quest_templates (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    quest_type text not null check (quest_type in ('daily', 'weekly', 'special')),
    requirements jsonb not null,
    rewards jsonb not null,
    difficulty text not null check (difficulty in ('easy', 'medium', 'hard', 'epic')),
    tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table active_quests (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    quest_id uuid references quest_templates(id) not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    progress jsonb not null default '{"completed": false, "progress": 0}'::jsonb,
    status text not null check (status in ('active', 'completed', 'failed', 'expired')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Experience and Level System
create table experience_levels (
    level integer primary key,
    required_xp integer not null,
    rewards jsonb,
    title text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table user_experience (
    user_id uuid references auth.users(id) primary key,
    total_xp integer not null default 0,
    current_level integer references experience_levels(level) not null default 1,
    level_progress jsonb not null default '{"current_xp": 0, "next_level_xp": 100}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table xp_transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    amount integer not null,
    source text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skill Trees
create table skill_trees (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    category text not null,
    icon_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table skill_nodes (
    id uuid default uuid_generate_v4() primary key,
    tree_id uuid references skill_trees(id) not null,
    name text not null,
    description text not null,
    level integer not null default 1,
    max_level integer not null default 1,
    requirements jsonb not null,
    benefits jsonb not null,
    position jsonb not null,
    parent_nodes uuid[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table user_skills (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    node_id uuid references skill_nodes(id) not null,
    current_level integer not null default 0,
    progress jsonb not null default '{"xp": 0, "next_level_xp": 100}'::jsonb,
    unlocked_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, node_id)
);

-- Virtual Rewards and Collectibles
create table collectible_types (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    category text not null,
    rarity text not null check (rarity in ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    image_url text,
    attributes jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table user_collectibles (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    collectible_id uuid references collectible_types(id) not null,
    acquired_at timestamp with time zone not null,
    source text not null,
    is_favorite boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Milestone Celebrations
create table milestone_types (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    category text not null,
    trigger_condition jsonb not null,
    celebration_config jsonb not null,
    rewards jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table user_milestones (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    milestone_id uuid references milestone_types(id) not null,
    achieved_at timestamp with time zone not null,
    celebration_status text not null check (celebration_status in ('pending', 'celebrated', 'skipped')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, milestone_id)
);

-- AI and Automation Tables
create table user_patterns (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    pattern_type text not null check (pattern_type in ('productivity', 'focus', 'energy', 'mood', 'stress')),
    data jsonb not null,
    analysis jsonb,
    period text not null check (period in ('daily', 'weekly', 'monthly')),
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table smart_suggestions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    suggestion_type text not null check (suggestion_type in ('goal', 'schedule', 'task', 'break', 'habit')),
    content jsonb not null,
    context jsonb,
    confidence_score numeric check (confidence_score >= 0 and confidence_score <= 1),
    status text not null check (status in ('pending', 'accepted', 'rejected', 'implemented')),
    feedback text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table schedule_optimizations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    original_schedule jsonb not null,
    optimized_schedule jsonb not null,
    optimization_factors jsonb not null,
    improvement_metrics jsonb,
    is_applied boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table burnout_metrics (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    metrics jsonb not null,
    risk_score numeric not null check (risk_score >= 0 and risk_score <= 100),
    warning_signs text[],
    recommendations jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

create table task_priorities (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    task_id uuid not null,
    original_priority integer,
    calculated_priority integer not null,
    priority_factors jsonb not null,
    valid_until timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table learning_models (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    model_type text not null,
    model_data jsonb not null,
    performance_metrics jsonb,
    last_trained timestamp with time zone,
    version integer not null default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, model_type)
);

create table productivity_insights (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    insight_type text not null,
    content text not null,
    data_points jsonb not null,
    confidence_score numeric check (confidence_score >= 0 and confidence_score <= 1),
    is_actionable boolean default true,
    suggested_actions jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Wellness Features Tables
create table meditation_sessions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    duration interval not null,
    session_type text not null check (session_type in ('guided', 'unguided', 'breathing', 'body_scan', 'walking')),
    mood_before text,
    mood_after text,
    notes text,
    completed boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table mindfulness_stats (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    total_minutes integer not null default 0,
    sessions_completed integer not null default 0,
    streak_days integer not null default 0,
    focus_score numeric check (focus_score >= 0 and focus_score <= 100),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

create table work_life_balance (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    work_hours numeric not null,
    personal_hours numeric not null,
    exercise_minutes integer,
    leisure_activities text[],
    balance_score numeric not null check (balance_score >= 0 and balance_score <= 100),
    factors jsonb not null,
    recommendations jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

create table stress_levels (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    timestamp timestamp with time zone not null,
    level integer not null check (level >= 1 and level <= 5),
    symptoms text[],
    triggers text[],
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table break_recommendations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    recommended_at timestamp with time zone not null,
    break_type text not null check (break_type in ('micro', 'short', 'long', 'exercise', 'meditation')),
    duration interval not null,
    reason text not null,
    taken boolean default false,
    effectiveness_rating integer check (effectiveness_rating >= 1 and effectiveness_rating <= 5),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table sleep_tracking (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    bedtime timestamp with time zone not null,
    wake_time timestamp with time zone not null,
    duration interval not null,
    quality_rating integer check (quality_rating >= 1 and quality_rating <= 5),
    disruptions text[],
    factors jsonb,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

create table energy_levels (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    timestamp timestamp with time zone not null,
    level integer not null check (level >= 1 and level <= 5),
    factors jsonb,
    activities_impact jsonb,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table wellness_insights (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    category text not null check (category in ('sleep', 'stress', 'energy', 'balance', 'mindfulness')),
    metrics jsonb not null,
    correlations jsonb,
    recommendations text[],
    priority integer check (priority >= 1 and priority <= 3),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table wellness_goals (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    category text not null check (category in ('meditation', 'sleep', 'stress', 'exercise', 'breaks')),
    target jsonb not null,
    progress jsonb not null,
    start_date date not null,
    end_date date,
    status text not null check (status in ('active', 'completed', 'abandoned')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Visualization Features Tables
create table visualization_settings (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    visualization_type text not null check (visualization_type in ('heatmap', 'timeline', 'chart', 'matrix', 'dashboard')),
    name text not null,
    config jsonb not null,
    is_favorite boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table productivity_heatmaps (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    date date not null,
    hour_data jsonb not null,
    metrics jsonb not null,
    tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, date)
);

create table visualization_widgets (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    widget_type text not null check (widget_type in ('heatmap', 'timeline', 'chart', 'matrix', 'custom')),
    title text not null,
    description text,
    config jsonb not null,
    data_source jsonb not null,
    refresh_interval interval,
    position jsonb,
    size jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table progress_timelines (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    timeline_type text not null check (timeline_type in ('habit', 'goal', 'task', 'project', 'custom')),
    start_date timestamp with time zone not null,
    end_date timestamp with time zone,
    events jsonb not null,
    milestones jsonb,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table comparative_analyses (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    analysis_type text not null check (analysis_type in ('productivity', 'habits', 'goals', 'time', 'custom')),
    period_start timestamp with time zone not null,
    period_end timestamp with time zone not null,
    comparison_data jsonb not null,
    metrics jsonb not null,
    insights text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table habit_correlations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    habit_pairs jsonb not null,
    correlation_score numeric not null check (correlation_score >= -1 and correlation_score <= 1),
    confidence_score numeric not null check (confidence_score >= 0 and confidence_score <= 1),
    supporting_data jsonb not null,
    analysis_period tstzrange not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table real_time_metrics (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    metric_type text not null,
    current_value jsonb not null,
    historical_values jsonb not null,
    update_frequency interval not null,
    last_updated timestamp with time zone not null,
    alert_thresholds jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Advanced AI Features Tables
create table voice_commands (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    command_text text not null,
    command_type text not null check (command_type in ('task', 'reminder', 'note', 'schedule', 'query')),
    processed_data jsonb not null,
    confidence_score numeric check (confidence_score >= 0 and confidence_score <= 1),
    execution_status text not null check (execution_status in ('pending', 'processed', 'failed', 'executed')),
    execution_result jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table nlp_task_inputs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    input_text text not null,
    parsed_intent text not null,
    extracted_entities jsonb not null,
    confidence_scores jsonb not null,
    processed_result jsonb not null,
    feedback_score integer check (feedback_score >= 1 and feedback_score <= 5),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table task_duration_predictions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    task_id uuid not null,
    predicted_duration interval not null,
    actual_duration interval,
    prediction_factors jsonb not null,
    accuracy_score numeric,
    model_version text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table smart_meetings (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    participants jsonb not null,
    duration interval not null,
    preferred_times jsonb not null,
    constraints jsonb,
    suggested_slots jsonb not null,
    final_schedule timestamp with time zone,
    meeting_type text not null check (meeting_type in ('one_on_one', 'team', 'project', 'custom')),
    status text not null check (status in ('scheduling', 'scheduled', 'cancelled', 'completed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table work_summaries (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    summary_type text not null check (summary_type in ('daily', 'weekly', 'project', 'custom')),
    period_start timestamp with time zone not null,
    period_end timestamp with time zone not null,
    activities jsonb not null,
    key_achievements jsonb not null,
    metrics jsonb not null,
    generated_summary text not null,
    tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table productivity_tips (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    context_type text not null check (context_type in ('time_management', 'focus', 'energy', 'workload', 'breaks')),
    trigger_conditions jsonb not null,
    tip_content text not null,
    relevance_score numeric check (relevance_score >= 0 and relevance_score <= 1),
    effectiveness_rating integer,
    shown_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table ai_models_config (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    model_type text not null check (model_type in ('voice', 'nlp', 'prediction', 'scheduling', 'summary', 'recommendation')),
    model_parameters jsonb not null,
    performance_metrics jsonb,
    last_trained timestamp with time zone,
    next_training_due timestamp with time zone,
    active_version text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, model_type)
);

create table ai_training_data (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    data_type text not null check (data_type in ('voice', 'nlp', 'task', 'schedule', 'productivity')),
    training_data jsonb not null,
    validation_score numeric check (validation_score >= 0 and validation_score <= 1),
    used_in_training boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mobile Features Tables
create table location_reminders (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    task_id uuid not null,
    location_name text not null,
    latitude numeric not null,
    longitude numeric not null,
    radius_meters integer not null,
    trigger_on text not null check (trigger_on in ('enter', 'exit', 'both')),
    is_active boolean default true,
    last_triggered timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table offline_data_queue (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    device_id text not null,
    data_type text not null,
    operation text not null check (operation in ('create', 'update', 'delete')),
    data jsonb not null,
    status text not null check (status in ('pending', 'synced', 'conflict', 'failed')),
    sync_attempts integer default 0,
    last_sync_attempt timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table mobile_widgets (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    widget_type text not null check (widget_type in ('tasks', 'habits', 'stats', 'timer', 'custom')),
    title text not null,
    config jsonb not null,
    refresh_interval interval,
    last_updated timestamp with time zone,
    position integer not null,
    size jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table notification_rules (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    rule_type text not null check (rule_type in ('time', 'location', 'context', 'custom')),
    conditions jsonb not null,
    action jsonb not null,
    priority integer not null check (priority >= 1 and priority <= 5),
    is_active boolean default true,
    last_triggered timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table gesture_shortcuts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    gesture_type text not null,
    action_type text not null,
    action_data jsonb not null,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, gesture_type)
);

create table device_sync_status (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    device_id text not null,
    device_type text not null,
    last_sync timestamp with time zone not null,
    sync_token text not null,
    data_types text[] not null,
    settings jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, device_id)
);

create table sync_conflicts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    data_type text not null,
    entity_id uuid not null,
    device_id text not null,
    server_data jsonb not null,
    client_data jsonb not null,
    resolution_status text not null check (resolution_status in ('pending', 'resolved_server', 'resolved_client', 'resolved_manual')),
    resolved_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Educational Features Tables
create table learning_resources (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    resource_type text not null check (resource_type in ('tutorial', 'course', 'exercise', 'guide', 'article')),
    category text not null check (category in ('productivity', 'time_management', 'focus', 'stress_management', 'personal_development')),
    content jsonb not null,
    difficulty_level text not null check (difficulty_level in ('beginner', 'intermediate', 'advanced')),
    estimated_duration interval,
    prerequisites text[],
    tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table learning_modules (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    category text not null,
    sequence_order integer not null,
    completion_criteria jsonb not null,
    points integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table module_resources (
    module_id uuid references learning_modules(id) not null,
    resource_id uuid references learning_resources(id) not null,
    sequence_order integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (module_id, resource_id)
);

create table user_learning_progress (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    resource_id uuid references learning_resources(id) not null,
    start_date timestamp with time zone not null,
    completion_date timestamp with time zone,
    progress numeric not null check (progress >= 0 and progress <= 100),
    status text not null check (status in ('not_started', 'in_progress', 'completed', 'abandoned')),
    notes text,
    rating integer check (rating >= 1 and rating <= 5),
    feedback text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, resource_id)
);

create table practice_exercises (
    id uuid default uuid_generate_v4() primary key,
    resource_id uuid references learning_resources(id) not null,
    exercise_type text not null check (exercise_type in ('focus', 'time_blocking', 'stress_reduction', 'productivity_audit', 'reflection')),
    instructions text not null,
    duration interval not null,
    expected_outcomes text[],
    metrics jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table exercise_submissions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    exercise_id uuid references practice_exercises(id) not null,
    submission_data jsonb not null,
    reflection_notes text,
    effectiveness_rating integer check (effectiveness_rating >= 1 and effectiveness_rating <= 5),
    completed_at timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table skill_assessments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    category text not null,
    assessment_data jsonb not null,
    strengths text[],
    areas_for_improvement text[],
    recommendations jsonb,
    next_assessment_date timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table learning_paths (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    target_skills text[],
    prerequisites jsonb,
    estimated_completion_time interval,
    certification_criteria jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table path_modules (
    path_id uuid references learning_paths(id) not null,
    module_id uuid references learning_modules(id) not null,
    sequence_order integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (path_id, module_id)
);

create table user_certifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    path_id uuid references learning_paths(id) not null,
    earned_at timestamp with time zone not null,
    certificate_data jsonb not null,
    valid_until timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, path_id)
);

-- Create indexes for better query performance
create index learning_resources_type_category_idx on learning_resources(resource_type, category);
create index learning_modules_category_idx on learning_modules(category);
create index user_learning_progress_user_status_idx on user_learning_progress(user_id, status);
create index practice_exercises_type_idx on practice_exercises(exercise_type);
create index exercise_submissions_user_idx on exercise_submissions(user_id);
create index skill_assessments_user_category_idx on skill_assessments(user_id, category);
create index learning_paths_skills_idx on learning_paths using gin(target_skills);
create index user_certifications_user_idx on user_certifications(user_id);

-- Row Level Security (RLS) policies
alter table learning_resources enable row level security;
alter table learning_modules enable row level security;
alter table user_learning_progress enable row level security;
alter table practice_exercises enable row level security;
alter table exercise_submissions enable row level security;
alter table skill_assessments enable row level security;
alter table learning_paths enable row level security;
alter table user_certifications enable row level security;

-- Policies for learning resources
create policy "Anyone can view learning resources"
    on learning_resources for select
    using (true);

-- Policies for learning modules
create policy "Anyone can view learning modules"
    on learning_modules for select
    using (true);

-- Policies for user learning progress
create policy "Users can view their own learning progress"
    on user_learning_progress for select
    using (auth.uid() = user_id);

create policy "Users can manage their own learning progress"
    on user_learning_progress for all
    using (auth.uid() = user_id);

-- Policies for practice exercises
create policy "Anyone can view practice exercises"
    on practice_exercises for select
    using (true);

-- Policies for exercise submissions
create policy "Users can view their own exercise submissions"
    on exercise_submissions for select
    using (auth.uid() = user_id);

create policy "Users can manage their own exercise submissions"
    on exercise_submissions for all
    using (auth.uid() = user_id);

-- Policies for skill assessments
create policy "Users can view their own skill assessments"
    on skill_assessments for select
    using (auth.uid() = user_id);

create policy "Users can manage their own skill assessments"
    on skill_assessments for all
    using (auth.uid() = user_id);

-- Policies for learning paths
create policy "Anyone can view learning paths"
    on learning_paths for select
    using (true);

-- Policies for user certifications
create policy "Users can view their own certifications"
    on user_certifications for select
    using (auth.uid() = user_id);

create policy "Users can manage their own certifications"
    on user_certifications for all
    using (auth.uid() = user_id);

-- Advanced Automation Tables
create table workflow_templates (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    name text not null,
    description text,
    trigger_type text not null check (trigger_type in ('event', 'schedule', 'condition', 'manual')),
    trigger_config jsonb not null,
    steps jsonb not null,
    is_active boolean default true,
    last_executed timestamp with time zone,
    execution_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table workflow_executions (
    id uuid default uuid_generate_v4() primary key,
    workflow_id uuid references workflow_templates(id) not null,
    user_id uuid references auth.users(id) not null,
    trigger_data jsonb not null,
    execution_status text not null check (execution_status in ('pending', 'in_progress', 'completed', 'failed')),
    step_results jsonb not null default '[]'::jsonb,
    started_at timestamp with time zone not null,
    completed_at timestamp with time zone,
    error_details jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table task_templates (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    name text not null,
    description text,
    category text not null,
    default_priority integer check (default_priority >= 1 and default_priority <= 5),
    estimated_duration interval,
    checklist jsonb,
    default_tags text[],
    custom_fields jsonb,
    smart_suggestions boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table recurring_tasks (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    template_id uuid references task_templates(id),
    name text not null,
    description text,
    recurrence_pattern jsonb not null,
    next_occurrence timestamp with time zone not null,
    last_occurrence timestamp with time zone,
    dynamic_scheduling boolean default false,
    optimization_rules jsonb,
    skip_dates date[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table recurring_task_instances (
    id uuid default uuid_generate_v4() primary key,
    recurring_task_id uuid references recurring_tasks(id) not null,
    user_id uuid references auth.users(id) not null,
    scheduled_date timestamp with time zone not null,
    completion_date timestamp with time zone,
    status text not null check (status in ('pending', 'in_progress', 'completed', 'skipped')),
    optimization_applied boolean default false,
    optimization_details jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table email_integrations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    email_address text not null,
    provider text not null,
    integration_type text not null check (integration_type in ('gmail', 'outlook', 'custom')),
    credentials jsonb not null,
    sync_settings jsonb not null,
    last_sync timestamp with time zone,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, email_address)
);

create table email_rules (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    integration_id uuid references email_integrations(id) not null,
    name text not null,
    conditions jsonb not null,
    actions jsonb not null,
    priority integer not null check (priority >= 1 and priority <= 5),
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table email_tasks (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    email_id text not null,
    subject text not null,
    sender text not null,
    received_at timestamp with time zone not null,
    task_details jsonb not null,
    status text not null check (status in ('pending', 'processed', 'ignored')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table document_processors (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    name text not null,
    processor_type text not null check (processor_type in ('ocr', 'parser', 'extractor', 'classifier')),
    configuration jsonb not null,
    supported_formats text[],
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table document_processing_jobs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    processor_id uuid references document_processors(id) not null,
    document_url text not null,
    document_type text not null,
    processing_status text not null check (processing_status in ('pending', 'processing', 'completed', 'failed')),
    result_data jsonb,
    error_details jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table task_delegations (
    id uuid default uuid_generate_v4() primary key,
    task_id uuid not null,
    delegator_id uuid references auth.users(id) not null,
    delegatee_id uuid references auth.users(id) not null,
    delegation_type text not null check (delegation_type in ('full', 'partial', 'review')),
    permissions jsonb not null,
    status text not null check (status in ('pending', 'accepted', 'rejected', 'completed')),
    due_date timestamp with time zone,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table delegation_rules (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    name text not null,
    conditions jsonb not null,
    delegatee_id uuid references auth.users(id) not null,
    delegation_config jsonb not null,
    priority integer not null check (priority >= 1 and priority <= 5),
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index workflow_templates_user_idx on workflow_templates(user_id);
create index workflow_executions_workflow_idx on workflow_executions(workflow_id);
create index task_templates_user_idx on task_templates(user_id);
create index recurring_tasks_user_idx on recurring_tasks(user_id);
create index recurring_task_instances_task_idx on recurring_task_instances(recurring_task_id);
create index email_integrations_user_idx on email_integrations(user_id);
create index email_rules_integration_idx on email_rules(integration_id);
create index email_tasks_user_idx on email_tasks(user_id);
create index document_processors_user_idx on document_processors(user_id);
create index document_processing_jobs_processor_idx on document_processing_jobs(processor_id);
create index task_delegations_task_idx on task_delegations(task_id);
create index delegation_rules_user_idx on delegation_rules(user_id);

-- Row Level Security (RLS) policies
alter table workflow_templates enable row level security;
alter table workflow_executions enable row level security;
alter table task_templates enable row level security;
alter table recurring_tasks enable row level security;
alter table recurring_task_instances enable row level security;
alter table email_integrations enable row level security;
alter table email_rules enable row level security;
alter table email_tasks enable row level security;
alter table document_processors enable row level security;
alter table document_processing_jobs enable row level security;
alter table task_delegations enable row level security;
alter table delegation_rules enable row level security;

-- Policies for workflow templates
create policy "Users can manage their own workflow templates"
    on workflow_templates for all
    using (auth.uid() = user_id);

-- Policies for workflow executions
create policy "Users can manage their own workflow executions"
    on workflow_executions for all
    using (auth.uid() = user_id);

-- Policies for task templates
create policy "Users can manage their own task templates"
    on task_templates for all
    using (auth.uid() = user_id);

-- Policies for recurring tasks
create policy "Users can manage their own recurring tasks"
    on recurring_tasks for all
    using (auth.uid() = user_id);

-- Policies for recurring task instances
create policy "Users can manage their own recurring task instances"
    on recurring_task_instances for all
    using (auth.uid() = user_id);

-- Policies for email integrations
create policy "Users can manage their own email integrations"
    on email_integrations for all
    using (auth.uid() = user_id);

-- Policies for email rules
create policy "Users can manage their own email rules"
    on email_rules for all
    using (auth.uid() = user_id);

-- Policies for email tasks
create policy "Users can manage their own email tasks"
    on email_tasks for all
    using (auth.uid() = user_id);

-- Policies for document processors
create policy "Users can manage their own document processors"
    on document_processors for all
    using (auth.uid() = user_id);

-- Policies for document processing jobs
create policy "Users can manage their own document processing jobs"
    on document_processing_jobs for all
    using (auth.uid() = user_id);

-- Policies for task delegations
create policy "Users can view delegations they're involved in"
    on task_delegations for select
    using (auth.uid() = delegator_id or auth.uid() = delegatee_id);

create policy "Users can manage delegations they created"
    on task_delegations for all
    using (auth.uid() = delegator_id);

-- Policies for delegation rules
create policy "Users can manage their own delegation rules"
    on delegation_rules for all
    using (auth.uid() = user_id);

-- Enhanced Security Tables
create table two_factor_settings (
    user_id uuid references auth.users(id) primary key,
    is_enabled boolean default false,
    method text not null check (method in ('app', 'sms', 'email')),
    backup_codes text[] not null default array[]::text[],
    secret_key text,
    phone_number text,
    last_verified timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table encryption_keys (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    key_type text not null check (key_type in ('master', 'data', 'backup')),
    public_key text,
    encrypted_private_key text,
    key_version integer not null default 1,
    is_active boolean default true,
    expires_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table data_backups (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    backup_type text not null check (backup_type in ('full', 'incremental', 'selective')),
    data_scope jsonb not null,
    encrypted_data text not null,
    encryption_key_id uuid references encryption_keys(id),
    size_bytes bigint not null,
    checksum text not null,
    status text not null check (status in ('pending', 'completed', 'failed', 'restored')),
    retention_period interval,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table privacy_settings (
    user_id uuid references auth.users(id) primary key,
    data_sharing jsonb not null default '{
        "analytics": false,
        "third_party": false,
        "research": false,
        "marketing": false
    }'::jsonb,
    data_retention jsonb not null default '{
        "activity_logs": "1 year",
        "messages": "2 years",
        "documents": "3 years"
    }'::jsonb,
    visibility_settings jsonb not null default '{
        "profile": "private",
        "activities": "friends",
        "statistics": "private"
    }'::jsonb,
    cookie_preferences jsonb not null default '{
        "essential": true,
        "functional": false,
        "analytics": false,
        "advertising": false
    }'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table audit_logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    event_type text not null,
    event_category text not null check (event_category in ('security', 'data', 'privacy', 'system', 'user')),
    event_data jsonb not null,
    ip_address text,
    user_agent text,
    status text not null check (status in ('success', 'failure', 'warning')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table gdpr_requests (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    request_type text not null check (request_type in ('export', 'delete', 'modify', 'restrict')),
    request_details jsonb not null,
    status text not null check (status in ('pending', 'processing', 'completed', 'rejected')),
    submitted_at timestamp with time zone not null default timezone('utc'::text, now()),
    processed_at timestamp with time zone,
    processor_notes text,
    data_package_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table data_processing_records (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    processing_type text not null,
    legal_basis text not null,
    purpose text not null,
    data_categories text[] not null,
    recipients text[],
    retention_period interval,
    security_measures text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table consent_records (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    consent_type text not null,
    consent_version text not null,
    granted boolean not null,
    ip_address text,
    user_agent text,
    granted_at timestamp with time zone not null default timezone('utc'::text, now()),
    revoked_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table security_questions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    question_hash text not null,
    answer_hash text not null,
    last_updated timestamp with time zone not null default timezone('utc'::text, now()),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index audit_logs_user_type_idx on audit_logs(user_id, event_type);
create index audit_logs_category_idx on audit_logs(event_category);
create index gdpr_requests_user_status_idx on gdpr_requests(user_id, status);
create index data_backups_user_type_idx on data_backups(user_id, backup_type);
create index encryption_keys_user_type_idx on encryption_keys(user_id, key_type);
create index consent_records_user_type_idx on consent_records(user_id, consent_type);

-- Row Level Security (RLS) policies
alter table two_factor_settings enable row level security;
alter table encryption_keys enable row level security;
alter table data_backups enable row level security;
alter table privacy_settings enable row level security;
alter table audit_logs enable row level security;
alter table gdpr_requests enable row level security;
alter table data_processing_records enable row level security;
alter table consent_records enable row level security;
alter table security_questions enable row level security;

-- Policies for two-factor settings
create policy "Users can manage their own 2FA settings"
    on two_factor_settings for all
    using (auth.uid() = user_id);

-- Policies for encryption keys
create policy "Users can manage their own encryption keys"
    on encryption_keys for all
    using (auth.uid() = user_id);

-- Policies for data backups
create policy "Users can manage their own backups"
    on data_backups for all
    using (auth.uid() = user_id);

-- Policies for privacy settings
create policy "Users can manage their own privacy settings"
    on privacy_settings for all
    using (auth.uid() = user_id);

-- Policies for audit logs
create policy "Users can view their own audit logs"
    on audit_logs for select
    using (auth.uid() = user_id);

create policy "System can create audit logs"
    on audit_logs for insert
    with check (true);

-- Policies for GDPR requests
create policy "Users can manage their own GDPR requests"
    on gdpr_requests for all
    using (auth.uid() = user_id);

-- Policies for data processing records
create policy "Users can view their own data processing records"
    on data_processing_records for select
    using (auth.uid() = user_id);

-- Policies for consent records
create policy "Users can manage their own consent records"
    on consent_records for all
    using (auth.uid() = user_id);

-- Policies for security questions
create policy "Users can manage their own security questions"
    on security_questions for all
    using (auth.uid() = user_id);

-- Advanced Reporting Tables
create table report_templates (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    name text not null,
    description text,
    report_type text not null check (report_type in ('custom', 'productivity', 'habits', 'goals', 'time', 'wellness')),
    data_sources text[] not null,
    filters jsonb,
    sorting jsonb,
    grouping jsonb,
    visualizations jsonb,
    custom_calculations jsonb,
    layout jsonb,
    is_public boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table scheduled_reports (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    template_id uuid references report_templates(id) not null,
    name text not null,
    schedule_type text not null check (schedule_type in ('daily', 'weekly', 'monthly', 'custom')),
    cron_expression text,
    timezone text not null default 'UTC',
    recipients jsonb not null,
    export_format text[] not null,
    last_run timestamp with time zone,
    next_run timestamp with time zone not null,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table report_exports (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    template_id uuid references report_templates(id) not null,
    name text not null,
    format text not null check (format in ('pdf', 'csv', 'excel', 'json')),
    data jsonb not null,
    file_url text,
    file_size bigint,
    status text not null check (status in ('pending', 'processing', 'completed', 'failed')),
    error_details text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table report_shares (
    id uuid default uuid_generate_v4() primary key,
    report_id uuid references report_templates(id) not null,
    user_id uuid references auth.users(id) not null,
    shared_by uuid references auth.users(id) not null,
    permissions jsonb not null default '{"view": true, "edit": false, "share": false}'::jsonb,
    access_token text,
    expires_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table report_executions (
    id uuid default uuid_generate_v4() primary key,
    template_id uuid references report_templates(id) not null,
    user_id uuid references auth.users(id) not null,
    scheduled_id uuid references scheduled_reports(id),
    parameters jsonb,
    execution_time interval,
    row_count integer,
    status text not null check (status in ('running', 'completed', 'failed')),
    error_details text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table report_insights (
    id uuid default uuid_generate_v4() primary key,
    report_id uuid references report_templates(id) not null,
    user_id uuid references auth.users(id) not null,
    insight_type text not null check (insight_type in ('trend', 'anomaly', 'correlation', 'summary')),
    content text not null,
    metrics jsonb,
    importance_score numeric check (importance_score >= 0 and importance_score <= 1),
    generated_at timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table report_subscriptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    report_id uuid references report_templates(id) not null,
    frequency text not null check (frequency in ('daily', 'weekly', 'monthly')),
    delivery_method text not null check (delivery_method in ('email', 'notification', 'download')),
    format text not null check (format in ('pdf', 'csv', 'excel', 'json')),
    is_active boolean default true,
    last_delivered timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, report_id, frequency)
);

-- Create indexes for better query performance
create index report_templates_user_type_idx on report_templates(user_id, report_type);
create index scheduled_reports_user_template_idx on scheduled_reports(user_id, template_id);
create index report_exports_user_template_idx on report_exports(user_id, template_id);
create index report_shares_report_idx on report_shares(report_id);
create index report_executions_template_idx on report_executions(template_id);
create index report_insights_report_idx on report_insights(report_id);
create index report_subscriptions_user_idx on report_subscriptions(user_id);

-- Row Level Security (RLS) policies
alter table report_templates enable row level security;
alter table scheduled_reports enable row level security;
alter table report_exports enable row level security;
alter table report_shares enable row level security;
alter table report_executions enable row level security;
alter table report_insights enable row level security;
alter table report_subscriptions enable row level security;

-- Policies for report templates
create policy "Users can manage their own report templates"
    on report_templates for all
    using (auth.uid() = user_id);

create policy "Users can view public report templates"
    on report_templates for select
    using (is_public = true);

-- Policies for scheduled reports
create policy "Users can manage their own scheduled reports"
    on scheduled_reports for all
    using (auth.uid() = user_id);

-- Policies for report exports
create policy "Users can manage their own report exports"
    on report_exports for all
    using (auth.uid() = user_id);

-- Policies for report shares
create policy "Users can view reports shared with them"
    on report_shares for select
    using (auth.uid() = user_id);

create policy "Users can share their own reports"
    on report_shares for insert
    with check (auth.uid() = shared_by);

-- Policies for report executions
create policy "Users can view their own report executions"
    on report_executions for select
    using (auth.uid() = user_id);

-- Policies for report insights
create policy "Users can view insights for their reports"
    on report_insights for select
    using (auth.uid() = user_id);

-- Policies for report subscriptions
create policy "Users can manage their own report subscriptions"
    on report_subscriptions for all
    using (auth.uid() = user_id); 