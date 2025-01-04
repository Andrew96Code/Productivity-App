import os
from dotenv import load_dotenv
from supabase import create_client, Client
import traceback

# Load environment variables
load_dotenv()

# Get environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None")

try:
    print("Creating Supabase client...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("Testing connection...")
    # Try a simple query to check if the database exists
    response = supabase.rpc('version').execute()
    print(f"Response: {response}")
    print("Connection successful!")
except Exception as e:
    print(f"Error: {str(e)}")
    print("Traceback:")
    traceback.print_exc() 