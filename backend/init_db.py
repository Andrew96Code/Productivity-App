import os
from dotenv import load_dotenv
from supabase import create_client, Client
import time
import json

def get_env_vars():
    # Force reload environment variables
    load_dotenv(override=True)
    
    # Get Supabase credentials
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    
    if not url or not key:
        raise ValueError("SUPABASE_URL or SUPABASE_KEY environment variables are not set")
    
    return url, key

def execute_sql(supabase: Client, sql_statement: str) -> bool:
    print(f"Executing SQL: {sql_statement[:100]}...")
    
    max_retries = 3
    retry_delay = 1  # seconds
    
    for attempt in range(max_retries):
        try:
            print(f"\nAttempt {attempt + 1}/{max_retries}")
            print(f"SQL statement: {sql_statement}")
            
            # Execute SQL using Supabase client's RPC call
            response = supabase.rpc('exec', {'query': sql_statement}).execute()
            
            print(f"\nResponse: {json.dumps(response.model_dump() if hasattr(response, 'model_dump') else response.dict(), indent=2)}")
            
            if hasattr(response, 'error') and response.error is not None:
                print(f"\nError executing SQL:")
                print(f"Error: {response.error}")
                
                if attempt < max_retries - 1:
                    print(f"Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                continue
            
            return True
                
        except Exception as e:
            print(f"\nError executing SQL: {str(e)}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2
            continue
            
    print("\nFailed after all retry attempts")
    return False

def main():
    try:
        # Get credentials
        SUPABASE_URL, SUPABASE_KEY = get_env_vars()
        
        print("Connecting to Supabase...")
        print(f"Using URL: {SUPABASE_URL}")
        print(f"Key starts with: {SUPABASE_KEY[:10]}...")

        # Initialize Supabase client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

        # Enable required extensions
        print("\nEnabling required extensions...")
        extension_statements = [
            "create extension if not exists \"uuid-ossp\";",
            "create extension if not exists \"pgcrypto\";"
        ]
        
        for statement in extension_statements:
            if not execute_sql(supabase, statement):
                print(f"Failed to enable extension: {statement}")
                return

        # Create SQL execution function
        print("\nCreating SQL execution function...")
        create_function_sql = """
        create or replace function execute_sql(sql text)
        returns void
        language plpgsql
        security definer
        as $$
        begin
            execute sql;
        end;
        $$;
        """
        
        if not execute_sql(supabase, create_function_sql):
            print("Failed to create SQL execution function. Please check your credentials and try again.")
            return

        # Test connection
        print("\nTesting connection...")
        test_sql = "SELECT current_timestamp"
        if not execute_sql(supabase, test_sql):
            print("Failed to connect to Supabase. Please check your credentials and try again.")
            return

        print("Connection successful!")

        # SQL statements for creating tables and setting up the schema
        schema_statements = [
            """
            -- Create users table
            create table if not exists users (
                id uuid references auth.users primary key,
                email text unique not null,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create tasks table
            create table if not exists tasks (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                title text not null,
                description text,
                due_date timestamp with time zone,
                priority text check (priority in ('low', 'medium', 'high')),
                status text check (status in ('todo', 'in_progress', 'completed', 'archived')) default 'todo',
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create categories table
            create table if not exists categories (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                name text not null,
                color text,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
                unique(user_id, name)
            );
            """,
            """
            -- Create task_categories junction table
            create table if not exists task_categories (
                task_id uuid references tasks on delete cascade,
                category_id uuid references categories on delete cascade,
                primary key (task_id, category_id)
            );
            """,
            """
            -- Create notes table
            create table if not exists notes (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                task_id uuid references tasks,
                title text not null,
                content text,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create attachments table
            create table if not exists attachments (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                task_id uuid references tasks,
                note_id uuid references notes,
                file_name text not null,
                file_type text not null,
                file_size integer not null,
                file_path text not null,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create recurring_tasks table
            create table if not exists recurring_tasks (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                title text not null,
                description text,
                frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'yearly')),
                start_date timestamp with time zone not null,
                end_date timestamp with time zone,
                priority text check (priority in ('low', 'medium', 'high')),
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create recurring_task_instances table
            create table if not exists recurring_task_instances (
                id uuid default uuid_generate_v4() primary key,
                recurring_task_id uuid references recurring_tasks on delete cascade not null,
                due_date timestamp with time zone not null,
                status text check (status in ('todo', 'in_progress', 'completed', 'skipped')) default 'todo',
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create email_integration table
            create table if not exists email_integrations (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                email_address text not null,
                provider text not null,
                access_token text,
                refresh_token text,
                token_expires_at timestamp with time zone,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
                unique(user_id, email_address)
            );
            """,
            """
            -- Create email_rules table
            create table if not exists email_rules (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                integration_id uuid references email_integrations not null,
                name text not null,
                conditions jsonb not null,
                actions jsonb not null,
                is_active boolean default true,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create email_tasks table
            create table if not exists email_tasks (
                id uuid default uuid_generate_v4() primary key,
                task_id uuid references tasks not null,
                email_id text not null,
                email_subject text not null,
                email_from text not null,
                email_date timestamp with time zone not null,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create document_processors table
            create table if not exists document_processors (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                name text not null,
                description text,
                processor_type text not null,
                configuration jsonb,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create document_processing_jobs table
            create table if not exists document_processing_jobs (
                id uuid default uuid_generate_v4() primary key,
                processor_id uuid references document_processors not null,
                attachment_id uuid references attachments not null,
                status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
                result jsonb,
                error_message text,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create task_delegations table
            create table if not exists task_delegations (
                id uuid default uuid_generate_v4() primary key,
                task_id uuid references tasks not null,
                delegated_by uuid references auth.users not null,
                delegated_to uuid references auth.users not null,
                status text check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """,
            """
            -- Create delegation_rules table
            create table if not exists delegation_rules (
                id uuid default uuid_generate_v4() primary key,
                user_id uuid references auth.users not null,
                name text not null,
                conditions jsonb not null,
                delegate_to uuid references auth.users not null,
                is_active boolean default true,
                created_at timestamp with time zone default timezone('utc'::text, now()) not null,
                updated_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            """
        ]

        print("\nCreating schema...")
        for i, statement in enumerate(schema_statements, 1):
            print(f"\nExecuting statement {i}/{len(schema_statements)}")
            if not execute_sql(supabase, statement):
                print(f"Failed to execute statement: {statement[:100]}...")

        print("\nSchema creation completed")

        # Sample data insertion
        print("\nInserting sample data...")
        sample_data_statements = [
            """
            -- Insert sample categories
            insert into categories (user_id, name, color)
            values 
            ('00000000-0000-0000-0000-000000000000', 'Work', '#FF0000'),
            ('00000000-0000-0000-0000-000000000000', 'Personal', '#00FF00'),
            ('00000000-0000-0000-0000-000000000000', 'Shopping', '#0000FF');
            """
        ]

        for i, statement in enumerate(sample_data_statements, 1):
            print(f"\nExecuting sample data statement {i}/{len(sample_data_statements)}")
            if not execute_sql(supabase, statement):
                print(f"Failed to execute sample data statement: {statement[:100]}...")

        print("\nSample data insertion completed")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return

if __name__ == "__main__":
    main() 