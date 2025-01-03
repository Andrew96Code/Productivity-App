from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

print("Supabase URL:", supabase_url)
print("Supabase Key:", supabase_key[:10] + "..." if supabase_key else None)

try:
    supabase: Client = create_client(supabase_url, supabase_key)
    print("Connected to Supabase successfully!")
    
    # Test query to check if tables exist
    result = supabase.table('goals').select("*").limit(1).execute()
    print("Goals table exists!")
    
    result = supabase.table('rewards').select("*").limit(1).execute()
    print("Rewards table exists!")
    
except Exception as e:
    print("Error:", str(e)) 