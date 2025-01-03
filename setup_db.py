from dotenv import load_dotenv
import os
import requests
import json

# Load environment variables
load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

print("Supabase URL:", supabase_url)
print("Supabase Key:", supabase_key[:10] + "..." if supabase_key else None)

headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

try:
    # Read SQL file
    with open('update_schema.sql', 'r') as file:
        sql = file.read()
    
    # Execute SQL using Supabase REST API
    response = requests.post(
        f"{supabase_url}/rest/v1/rpc/raw_sql",
        headers=headers,
        json={"query": sql}
    )
    
    if response.status_code == 200:
        print("Database setup completed successfully!")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
    
except Exception as e:
    print("Error:", str(e)) 