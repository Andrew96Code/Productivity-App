import os
from dotenv import load_dotenv
from supabase import create_client, Client

def main():
    load_dotenv()

    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_KEY')
    supabase: Client = create_client(url, key)

    print("Connecting to Supabase...")
    print(f"Key starts with: {key[:10]}...")

    with open('backend/schema_update.sql', 'r', encoding='utf-8') as f:
        sql = f.read()
        
    print("\nExecuting schema update SQL...")
    result = supabase.rpc('execute_sql', {'sql': sql}).execute()
    print(result)

if __name__ == "__main__":
    main() 