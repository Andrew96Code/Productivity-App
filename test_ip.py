import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get environment variables
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")

try:
    print("\nTesting connection using IP address...")
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Host': 'aargnaqjgftolakpxajs.supabase.co'
    }
    
    # Try both IP addresses
    ips = ['172.64.149.246', '104.18.38.10']
    
    for ip in ips:
        print(f"\nTesting IP: {ip}")
        try:
            response = requests.get(
                f'https://{ip}',
                headers=headers,
                verify=False  # Disable SSL verification since we're using IP
            )
            print(f"Status code: {response.status_code}")
            print(f"Response headers: {dict(response.headers)}")
            print(f"Response: {response.text[:200]}")
        except Exception as e:
            print(f"Error with {ip}: {str(e)}")
    
except Exception as e:
    print(f"\nError: {str(e)}")
    if hasattr(e, 'response'):
        print(f"Response status: {e.response.status_code}")
        print(f"Response text: {e.response.text}") 