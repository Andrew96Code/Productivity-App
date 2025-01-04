import os
import requests
from dotenv import load_dotenv

# Get the absolute path to the .env file
current_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(current_dir, 'backend', '.env')

# Load environment variables
print(f"Loading environment variables from: {dotenv_path}")
load_dotenv(dotenv_path)

# Get environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")

try:
    print("Testing REST API connection...")
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    # Try to access the REST API endpoint
    api_url = f"{SUPABASE_URL}/rest/v1/"
    print(f"Connecting to: {api_url}")
    response = requests.get(api_url, headers=headers)
    
    print(f"Status code: {response.status_code}")
    print(f"Response headers: {dict(response.headers)}")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"Error: {str(e)}")
    print(f"Error type: {type(e)}")
    if hasattr(e, 'response'):
        print(f"Response status: {e.response.status_code}")
        print(f"Response text: {e.response.text}") 