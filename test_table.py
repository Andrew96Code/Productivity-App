from dotenv import load_dotenv
import os
from supabase import create_client, Client
import json

# Load environment variables
load_dotenv('.env.service')  # Load service role key

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

print("Supabase URL:", supabase_url)
print("Supabase Key:", supabase_key[:10] + "..." if supabase_key else None)

try:
    supabase: Client = create_client(supabase_url, supabase_key)
    print("Connected to Supabase successfully!")
    
    # Try to get table info first
    response = supabase.table('goals').select('*').limit(1).execute()
    print("Table info:", response)
    
    # Try to insert a test record into the goals table
    test_goal = {
        'user_id': '4dac9223-c725-452d-8fd5-35f0ca9fefa7',  # Replace with a valid user ID
        'title': 'Test Goal',
        'description': 'This is a test goal',
        'category': 'other',
        'status': 'not_started'
    }
    
    response = supabase.table('goals').insert(test_goal).execute()
    print("Test goal inserted:", json.dumps(response.data, indent=2))
    
except Exception as e:
    print("Error type:", type(e))
    print("Error args:", e.args)
    print("Error:", str(e))
    if hasattr(e, 'response'):
        print("Response status:", e.response.status_code)
        print("Response text:", e.response.text) 