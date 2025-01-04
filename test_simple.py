import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")

try:
    print("\nTesting basic connectivity...")
    # Try to ping the base domain
    base_domain = SUPABASE_URL.split('/')[2]
    print(f"Testing connection to: {base_domain}")
    
    response = requests.get(f"https://{base_domain}")
    print(f"Base domain response status: {response.status_code}")
    
    print("\nTesting API endpoint...")
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    # Try a simple health check
    response = requests.get(
        f"{SUPABASE_URL}/health",
        headers=headers
    )
    print(f"API endpoint response status: {response.status_code}")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"\nError: {str(e)}")
    if hasattr(e, 'response'):
        print(f"Response status: {e.response.status_code}")
        print(f"Response text: {e.response.text}") 