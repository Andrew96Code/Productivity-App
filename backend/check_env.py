import os
from dotenv import load_dotenv

# Load environment variables from the correct path
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Get environment variables
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print(f"Environment variables loaded from: {dotenv_path}")
print(f"SUPABASE_URL: {SUPABASE_URL}")
print(f"SUPABASE_KEY: {SUPABASE_KEY[:10]}..." if SUPABASE_KEY else "SUPABASE_KEY: None") 