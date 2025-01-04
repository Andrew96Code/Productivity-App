import os
import requests
from dotenv import load_dotenv
import jwt

# Load environment variables
load_dotenv()

# Get environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")
print(f"SUPABASE_ANON_KEY: {SUPABASE_ANON_KEY[:10]}..." if SUPABASE_ANON_KEY else "SUPABASE_ANON_KEY: None")

# Decode the JWT token to get project info
token_data = jwt.decode(SUPABASE_KEY, options={'verify_signature': False})
project_ref = token_data.get('ref')
print(f"\nProject reference from JWT: {project_ref}")

try:
    print("\nTesting with service role key...")
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    # Try to get project info
    response = requests.get(
        f'https://api.supabase.com/v1/projects/{project_ref}',
        headers=headers
    )
    print(f"Service role response status: {response.status_code}")
    print(f"Response: {response.text}")
    
    print("\nTesting with anon key...")
    headers = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': f'Bearer {SUPABASE_ANON_KEY}'
    }
    
    # Try to get project info
    response = requests.get(
        f'https://api.supabase.com/v1/projects/{project_ref}',
        headers=headers
    )
    print(f"Anon key response status: {response.status_code}")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"\nError: {str(e)}")
    if hasattr(e, 'response'):
        print(f"Response status: {e.response.status_code}")
        print(f"Response text: {e.response.text}") 