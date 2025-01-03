from dotenv import load_dotenv
import os
from supabase import create_client, Client

# Load service role key
load_dotenv('.env.service')

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

print("Supabase URL:", supabase_url)
print("Supabase Key:", supabase_key[:10] + "..." if supabase_key else None)

try:
    supabase: Client = create_client(supabase_url, supabase_key)
    print("Connected to Supabase successfully!")
    
    # Enable UUID extension
    supabase.rpc('create_extension', {'name': 'uuid-ossp'}).execute()
    print("UUID extension enabled!")
    
    # Create goals table
    supabase.rpc('create_table', {
        'table_name': 'goals',
        'columns': [
            {'name': 'id', 'type': 'uuid', 'default': 'uuid_generate_v4()', 'primary': True},
            {'name': 'user_id', 'type': 'uuid', 'references': 'auth.users(id)', 'not_null': True},
            {'name': 'title', 'type': 'text', 'not_null': True},
            {'name': 'description', 'type': 'text'},
            {'name': 'category', 'type': 'text', 'not_null': True, 'check': "category in ('health', 'finance', 'productivity', 'learning', 'other')"},
            {'name': 'target_date', 'type': 'date'},
            {'name': 'target_value', 'type': 'numeric'},
            {'name': 'current_value', 'type': 'numeric', 'default': '0'},
            {'name': 'status', 'type': 'text', 'not_null': True, 'default': "'not_started'", 'check': "status in ('not_started', 'in_progress', 'completed', 'abandoned')"},
            {'name': 'created_at', 'type': 'timestamp with time zone', 'default': "timezone('utc'::text, now())", 'not_null': True},
            {'name': 'updated_at', 'type': 'timestamp with time zone', 'default': "timezone('utc'::text, now())", 'not_null': True}
        ]
    }).execute()
    print("Goals table created!")
    
    # Create rewards table
    supabase.rpc('create_table', {
        'table_name': 'rewards',
        'columns': [
            {'name': 'id', 'type': 'uuid', 'default': 'uuid_generate_v4()', 'primary': True},
            {'name': 'title', 'type': 'text', 'not_null': True},
            {'name': 'description', 'type': 'text', 'not_null': True},
            {'name': 'points_cost', 'type': 'integer', 'not_null': True, 'check': 'points_cost > 0'},
            {'name': 'reward_type', 'type': 'text', 'not_null': True, 'check': "reward_type in ('badge', 'feature', 'prize')"},
            {'name': 'availability', 'type': 'text', 'not_null': True, 'check': "availability in ('always', 'limited', 'one_time')"},
            {'name': 'stock', 'type': 'integer'},
            {'name': 'created_at', 'type': 'timestamp with time zone', 'default': "timezone('utc'::text, now())", 'not_null': True}
        ]
    }).execute()
    print("Rewards table created!")
    
    # Create reward_redemptions table
    supabase.rpc('create_table', {
        'table_name': 'reward_redemptions',
        'columns': [
            {'name': 'id', 'type': 'uuid', 'default': 'uuid_generate_v4()', 'primary': True},
            {'name': 'user_id', 'type': 'uuid', 'references': 'auth.users(id)', 'not_null': True},
            {'name': 'reward_id', 'type': 'uuid', 'references': 'rewards(id)', 'not_null': True},
            {'name': 'points_spent', 'type': 'integer', 'not_null': True, 'check': 'points_spent > 0'},
            {'name': 'redeemed_at', 'type': 'timestamp with time zone', 'default': "timezone('utc'::text, now())", 'not_null': True}
        ]
    }).execute()
    print("Reward redemptions table created!")
    
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
        supabase.table('rewards').upsert(reward).execute()
    print("Sample rewards inserted!")
    
except Exception as e:
    print("Error:", str(e)) 