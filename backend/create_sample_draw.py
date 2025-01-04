from datetime import datetime, timedelta, timezone
from config import get_supabase_client

def create_sample_draw():
    supabase = get_supabase_client()
    
    # Create a prize draw that ends in 7 days
    end_date = datetime.now(timezone.utc) + timedelta(days=7)
    
    draw_data = {
        'title': 'Weekly Prize Draw',
        'description': 'Win a $50 Amazon gift card! Enter now for a chance to win.',
        'prize': '$50 Amazon Gift Card',
        'points_required': 100,
        'status': 'active',
        'end_date': end_date.isoformat()
    }
    
    try:
        response = supabase.table('prize_draws').insert(draw_data).execute()
        print('Successfully created sample prize draw:', response.data)
    except Exception as e:
        print('Error creating sample prize draw:', str(e))

if __name__ == '__main__':
    create_sample_draw() 