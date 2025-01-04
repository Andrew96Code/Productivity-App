import os
import requests
from dotenv import load_dotenv
import urllib3

# Disable SSL verification warnings
urllib3.disable_warnings()

# Load environment variables
load_dotenv('backend/.env')  # Explicitly load from backend/.env

# Get environment variables
SUPABASE_URL = 'https://aargnaqjgftolakpxajs.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcmduYXFqZ2Z0b2xha3B4YWpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTk5MDYzNywiZXhwIjoyMDUxNTY2NjM3fQ.mSpsbZC3HwaNKEpnqGhs5l8zGP6XWmogOg_LIFdZs6g'

print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")

try:
    print("\nTesting direct API connection...")
    
    # Create session with custom settings
    session = requests.Session()
    session.verify = False  # Disable SSL verification
    
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    # Test endpoints
    endpoints = [
        '/rest/v1/users?select=*&limit=1',
        '/rest/v1/rpc/exec_sql',
        '/rest/v1/health'
    ]
    
    for endpoint in endpoints:
        print(f"\nTesting endpoint: {endpoint}")
        url = f"{SUPABASE_URL}{endpoint}"
        print(f"Full URL: {url}")
        
        response = session.get(url, headers=headers)
        print(f"Status code: {response.status_code}")
        print(f"Response headers: {dict(response.headers)}")
        print(f"Response: {response.text[:200]}")
    
except Exception as e:
    print(f"\nError: {str(e)}")
    if hasattr(e, 'response'):
        print(f"Response status: {e.response.status_code}")
        print(f"Response text: {e.response.text}") 