import os
import requests
from dotenv import load_dotenv
import jwt

# Load environment variables
load_dotenv()

# Get environment variables
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Decode the JWT token to get the project reference
token_data = jwt.decode(SUPABASE_KEY, options={'verify_signature': False})
project_ref = token_data.get('ref')

print(f"Project reference: {project_ref}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")

try:
    print("Testing management API connection...")
    headers = {
        'Authorization': f'Bearer {SUPABASE_KEY}'
    }
    
    # Try to get project configuration
    response = requests.get(
        f'https://api.supabase.com/v1/projects/{project_ref}/config',
        headers=headers
    )
    
    print(f"Status code: {response.status_code}")
    if response.status_code == 200:
        print("Project configuration:")
        print(response.json())
    else:
        print(f"Error response: {response.text}")
    
except Exception as e:
    print(f"Error: {str(e)}") 