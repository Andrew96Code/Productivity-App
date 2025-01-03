from dotenv import load_dotenv
import os
import requests
import json

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

print("Supabase URL:", supabase_url)
print("Supabase Key:", supabase_key[:10] + "..." if supabase_key else None)

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

try:
    # Create goals table using REST API
    goals_query = """
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
    """
    
    response = requests.post(
        f"{supabase_url}/rest/v1/rpc/execute",
        headers=headers,
        json={"query": goals_query}
    )
    print("Goals table creation response:", response.status_code)
    
    # Create rewards table
    rewards_query = """
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
    """
    
    response = requests.post(
        f"{supabase_url}/rest/v1/rpc/execute",
        headers=headers,
        json={"query": rewards_query}
    )
    print("Rewards table creation response:", response.status_code)
    
    # Create reward_redemptions table
    redemptions_query = """
    create table if not exists reward_redemptions (
        id uuid default uuid_generate_v4() primary key,
        user_id uuid references auth.users(id) not null,
        reward_id uuid references rewards(id) not null,
        points_spent integer not null check (points_spent > 0),
        redeemed_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
    """
    
    response = requests.post(
        f"{supabase_url}/rest/v1/rpc/execute",
        headers=headers,
        json={"query": redemptions_query}
    )
    print("Reward redemptions table creation response:", response.status_code)
    
    # Insert sample rewards
    sample_rewards = [
        {
            'title': 'Premium Theme',
            'description': 'Unlock dark mode and custom color themes',
            'points_cost': 1000,
            'reward_type': 'feature',
            'availability': 'one_time'
        },
        {
            'title': 'Data Analytics',
            'description': 'Unlock detailed progress analytics and insights',
            'points_cost': 2000,
            'reward_type': 'feature',
            'availability': 'one_time'
        },
        {
            'title': 'Expert Badge',
            'description': 'Show off your expertise with a special profile badge',
            'points_cost': 5000,
            'reward_type': 'badge',
            'availability': 'one_time'
        }
    ]
    
    for reward in sample_rewards:
        response = requests.post(
            f"{supabase_url}/rest/v1/rewards",
            headers=headers,
            json=reward
        )
        print(f"Reward '{reward['title']}' insertion response:", response.status_code)
    
except Exception as e:
    print("Error:", str(e)) 