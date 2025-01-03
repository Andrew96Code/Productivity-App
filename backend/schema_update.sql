-- Disable RLS temporarily
do $$ 
begin
    execute 'alter table if exists points_log disable row level security';
    execute 'alter table if exists goals disable row level security';
    execute 'alter table if exists habits disable row level security';
    execute 'alter table if exists transactions disable row level security';
    execute 'alter table if exists prize_draws disable row level security';
    execute 'alter table if exists prize_draw_entries disable row level security';
    execute 'alter table if exists rewards disable row level security';
    execute 'alter table if exists reward_redemptions disable row level security';
    execute 'alter table if exists achievements disable row level security';
    execute 'alter table if exists user_achievements disable row level security';
exception when others then null;
end $$;

-- Create missing tables
create table if not exists transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    type text not null check (type in ('income', 'expense', 'saving', 'investment')),
    category text not null,
    amount numeric not null,
    description text,
    date date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists prize_draws (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    prize text not null,
    points_required integer not null,
    status text not null check (status in ('active', 'completed', 'cancelled')) default 'active',
    start_date timestamp with time zone not null default now(),
    end_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists prize_draw_entries (
    id uuid default uuid_generate_v4() primary key,
    draw_id uuid references prize_draws(id) not null,
    user_id uuid references auth.users(id) not null,
    tickets integer not null check (tickets > 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists rewards (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    points_cost integer not null check (points_cost > 0),
    availability text not null check (availability in ('unlimited', 'limited', 'one_time')),
    stock integer check (stock >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists reward_redemptions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    reward_id uuid references rewards(id) not null,
    points_spent integer not null check (points_spent > 0),
    redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists achievements (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    category text not null,
    points_reward integer not null,
    requirement_type text not null,
    requirement_value integer not null,
    badge_icon text,
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

-- Create indexes
create index if not exists transactions_user_id_date_idx on transactions(user_id, date);
create index if not exists prize_draws_status_end_date_idx on prize_draws(status, end_date);
create index if not exists prize_draw_entries_draw_id_idx on prize_draw_entries(draw_id);
create index if not exists reward_redemptions_user_id_idx on reward_redemptions(user_id);
create index if not exists user_achievements_user_id_idx on user_achievements(user_id);

-- Enable RLS
alter table transactions enable row level security;
alter table prize_draws enable row level security;
alter table prize_draw_entries enable row level security;
alter table rewards enable row level security;
alter table reward_redemptions enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;

-- Create RLS policies
create policy "Users can view their own transactions"
    on transactions for select
    using (auth.uid() = user_id);

create policy "Users can manage their own transactions"
    on transactions for all
    using (auth.uid() = user_id);

create policy "Anyone can view active prize draws"
    on prize_draws for select
    using (status = 'active' and end_date > now());

create policy "Users can view their own draw entries"
    on prize_draw_entries for select
    using (auth.uid() = user_id);

create policy "Users can enter draws"
    on prize_draw_entries for insert
    with check (auth.uid() = user_id);

create policy "Anyone can view rewards"
    on rewards for select
    using (true);

create policy "Users can view their own redemptions"
    on reward_redemptions for select
    using (auth.uid() = user_id);

create policy "Users can redeem rewards"
    on reward_redemptions for insert
    with check (auth.uid() = user_id);

create policy "Anyone can view achievements"
    on achievements for select
    using (true);

create policy "Users can view their own achievement progress"
    on user_achievements for select
    using (auth.uid() = user_id);

create policy "System can update user achievements"
    on user_achievements for all
    using (true);

-- Insert sample data
insert into achievements (title, description, category, points_reward, requirement_type, requirement_value, badge_icon) values
    ('Early Bird', 'Complete morning journal entries for 7 consecutive days', 'journaling', 100, 'streak', 7, '🌅'),
    ('Quiz Master', 'Answer 50 quiz questions correctly', 'quiz', 200, 'count', 50, '🎓'),
    ('Goal Getter', 'Complete 10 goals', 'goals', 300, 'count', 10, '🎯'),
    ('Habit Hero', 'Maintain any habit for 30 days', 'habits', 500, 'streak', 30, '⭐'),
    ('Savings Sage', 'Save a total of $1000', 'finance', 400, 'total', 1000, '💰'),
    ('Milestone Master', 'Earn 10000 total points', 'general', 1000, 'milestone', 10000, '🏆');

insert into rewards (title, description, points_cost, availability) values
    ('Premium Theme', 'Unlock dark mode and custom color themes', 1000, 'one_time'),
    ('Data Analytics', 'Unlock detailed progress analytics and insights', 2000, 'one_time'),
    ('Expert Badge', 'Show off your expertise with a special profile badge', 5000, 'one_time'),
    ('Weekly Bonus', 'Double points for all activities for one week', 3000, 'unlimited'),
    ('Custom Goal Icons', 'Unlock custom icons for your goals', 1500, 'one_time'),
    ('Premium Template Pack', 'Unlock premium journal templates', 2500, 'one_time'); 