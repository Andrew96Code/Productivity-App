import os
from dotenv import load_dotenv, set_key
import requests
import json

# Get the absolute path to the .env file
current_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(current_dir, '.env')

# Set environment variables using set_key
set_key(dotenv_path, 'FLASK_APP', 'main.py')
set_key(dotenv_path, 'FLASK_ENV', 'development')
set_key(dotenv_path, 'SUPABASE_URL', 'https://aqfzxmqxvjvxvvjjnqxe.supabase.co')
set_key(dotenv_path, 'SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZnp4bXF4dmp2eHZ2ampucXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTk5NjkwMiwiZXhwIjoyMDE3NTcyOTAyfQ.Pu_TGn9ZqLZuVLWvGhPxhBw-PpxqHXqOhqxQQBYxBX4')

# Load environment variables
print(f"Loading environment variables from: {dotenv_path}")
load_dotenv(dotenv_path)

# Get environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print(f"Current directory: {current_dir}")
print(f"Environment file exists: {os.path.exists(dotenv_path)}")
print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")

# Print all environment variables
print("\nAll environment variables:")
for key, value in os.environ.items():
    print(f"{key}: {value[:10]}..." if value else f"{key}: None")

# Read and print the .env file contents
print("\n.env file contents:")
try:
    with open(dotenv_path, 'r') as f:
        print(f.read())
except Exception as e:
    print(f"Error reading .env file: {str(e)}")

# Test connection
def test_connection():
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    # Simple test query
    test_sql = "SELECT current_timestamp"
    
    try:
        print(f"\nTesting connection to Supabase...")
        print(f"URL: {url}")
        print(f"Headers: {headers}")
        print(f"Test SQL: {test_sql}")
        
        response = requests.post(
            url,
            headers=headers,
            json={"command": test_sql}
        )
        
        print(f"Response status code: {response.status_code}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 200:
            print("Connection successful!")
            return True
        else:
            print(f"Connection failed with status code {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        return False
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return False

if __name__ == '__main__':
    test_connection() 