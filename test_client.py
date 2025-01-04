import os
from dotenv import load_dotenv
from supabase import create_client, Client
import urllib3
import requests

# Disable SSL verification warnings
urllib3.disable_warnings()

# Load environment variables
load_dotenv('backend/.env')  # Explicitly load from backend/.env

# Get environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Override URL and key to use the correct values
SUPABASE_URL = 'https://aargnaqjgftolakpxajs.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcmduYXFqZ2Z0b2xha3B4YWpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDM3NjE5NiwiZXhwIjoyMDE5OTUyMTk2fQ.Pu_TGn9ZqLZuVLWvGhPxhBw-PpxqHXqOhqxQQBYxBX4'

print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")

try:
    print("\nTesting Supabase connection...")
    
    # Create session with custom settings
    session = requests.Session()
    session.verify = False  # Disable SSL verification
    
    # Create Supabase client with custom options
    supabase: Client = create_client(
        SUPABASE_URL,
        SUPABASE_KEY,
        {
            'auth': {
                'autoRefreshToken': False,
                'persistSession': False
            },
            'db': {
                'schema': 'public'
            }
        }
    )
    
    print("Testing simple query...")
    response = supabase.table('users').select("*").limit(1).execute()
    print(f"Response: {response}")
    
except Exception as e:
    print(f"\nError: {str(e)}")
    if hasattr(e, 'response'):
        print(f"Response status: {e.response.status_code}")
        print(f"Response text: {e.response.text}") 