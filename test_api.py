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
    print("Testing API connection...")
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    # Try to get project info
    response = requests.get(
        'https://api.supabase.com/v1/projects/aqfzxmqxvjvxvvjjnqxe',
        headers=headers
    )
    
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"Error: {str(e)}") 