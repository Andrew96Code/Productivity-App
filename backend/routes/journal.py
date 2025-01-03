from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from ..config import supabase_client
import uuid

journal_bp = Blueprint('journal', __name__)

@journal_bp.route('/entries', methods=['GET'])
def get_entries():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    period = request.args.get('period', 'week')
    prompt_type = request.args.get('prompt_type')
    
    # Calculate date range based on period
    end_date = datetime.utcnow()
    if period == 'week':
        start_date = end_date - timedelta(days=7)
    elif period == 'month':
        start_date = end_date - timedelta(days=30)
    elif period == 'year':
        start_date = end_date - timedelta(days=365)
    else:
        return jsonify({'error': 'Invalid period'}), 400
    
    try:
        # Build query
        query = supabase_client.table('journal_entries').select('*') \
            .eq('user_id', user_id) \
            .gte('created_at', start_date.isoformat()) \
            .lte('created_at', end_date.isoformat())
        
        # Add prompt type filter if specified
        if prompt_type:
            query = query.eq('prompt_type', prompt_type)
        
        # Execute query with ordering
        response = query.order('created_at', desc=True).execute()
        
        return jsonify({'data': response.data}), 200
    except Exception as e:
        print(f"Error getting journal entries: {str(e)}")
        return jsonify({'error': 'Failed to get journal entries'}), 500

@journal_bp.route('/entries', methods=['POST'])
def create_entry():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    required_fields = ['prompt_type', 'response']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        # Check if user already has an entry for this prompt type today
        today = datetime.utcnow().date()
        existing_entry = supabase_client.table('journal_entries').select('*') \
            .eq('user_id', user_id) \
            .eq('prompt_type', data['prompt_type']) \
            .gte('created_at', today.isoformat()) \
            .lte('created_at', (today + timedelta(days=1)).isoformat()) \
            .execute()
        
        if existing_entry.data:
            return jsonify({'error': f'Already submitted a {data["prompt_type"]} entry today'}), 400
        
        # Create journal entry
        entry_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'prompt_type': data['prompt_type'],
            'response': data['response'],
            'mood_rating': data.get('mood_rating'),
            'tags': data.get('tags', []),
            'created_at': datetime.utcnow().isoformat()
        }
        
        response = supabase_client.table('journal_entries').insert(entry_data).execute()
        
        # Award points for journaling
        points_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'points': 10,
            'reason': f'Completed {data["prompt_type"]} journal entry',
            'created_at': datetime.utcnow().isoformat()
        }
        supabase_client.table('points_history').insert(points_data).execute()
        
        return jsonify({'data': response.data[0]}), 201
    except Exception as e:
        print(f"Error creating journal entry: {str(e)}")
        return jsonify({'error': 'Failed to create journal entry'}), 500

@journal_bp.route('/entries/<entry_id>', methods=['PUT'])
def update_entry(entry_id):
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Verify the entry belongs to the user
        response = supabase_client.table('journal_entries').select('*') \
            .eq('id', entry_id) \
            .eq('user_id', user_id) \
            .execute()
        
        if not response.data:
            return jsonify({'error': 'Journal entry not found'}), 404
        
        # Update fields that are provided
        update_data = {}
        if 'response' in data:
            update_data['response'] = data['response']
        if 'mood_rating' in data:
            update_data['mood_rating'] = data['mood_rating']
        if 'tags' in data:
            update_data['tags'] = data['tags']
        
        if not update_data:
            return jsonify({'error': 'No fields to update'}), 400
        
        # Update the entry
        response = supabase_client.table('journal_entries') \
            .update(update_data) \
            .eq('id', entry_id) \
            .eq('user_id', user_id) \
            .execute()
        
        return jsonify({'data': response.data[0]}), 200
    except Exception as e:
        print(f"Error updating journal entry: {str(e)}")
        return jsonify({'error': 'Failed to update journal entry'}), 500

@journal_bp.route('/entries/<entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Verify the entry belongs to the user
        response = supabase_client.table('journal_entries').select('*') \
            .eq('id', entry_id) \
            .eq('user_id', user_id) \
            .execute()
        
        if not response.data:
            return jsonify({'error': 'Journal entry not found'}), 404
        
        # Delete the entry
        supabase_client.table('journal_entries').delete() \
            .eq('id', entry_id) \
            .eq('user_id', user_id) \
            .execute()
        
        return jsonify({'message': 'Journal entry deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting journal entry: {str(e)}")
        return jsonify({'error': 'Failed to delete journal entry'}), 500

@journal_bp.route('/prompts', methods=['GET'])
def get_prompts():
    prompt_type = request.args.get('type', 'morning')
    
    prompts = {
        'morning': [
            "What are your main goals for today?",
            "What are you grateful for this morning?",
            "How did you sleep last night?",
            "What's your energy level right now?",
            "What would make today great?",
            "What's one small thing you can do today to improve yourself?"
        ],
        'evening': [
            "What were your wins today?",
            "What challenges did you face?",
            "What did you learn today?",
            "How productive do you feel today was?",
            "What could you have done better?",
            "What are you looking forward to tomorrow?"
        ],
        'custom': [
            "What's on your mind right now?",
            "How are you feeling at this moment?",
            "What's something you'd like to improve?",
            "What's a recent experience that impacted you?",
            "What's a goal you're working towards?",
            "What's something you're proud of?"
        ]
    }
    
    return jsonify({
        'data': {
            'prompts': prompts.get(prompt_type, prompts['custom'])
        }
    }), 200

@journal_bp.route('/analytics', methods=['GET'])
def get_analytics():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    period = request.args.get('period', 'month')
    
    # Calculate date range based on period
    end_date = datetime.utcnow()
    if period == 'week':
        start_date = end_date - timedelta(days=7)
    elif period == 'month':
        start_date = end_date - timedelta(days=30)
    elif period == 'year':
        start_date = end_date - timedelta(days=365)
    else:
        return jsonify({'error': 'Invalid period'}), 400
    
    try:
        # Get journal entries for the period
        response = supabase_client.table('journal_entries').select('*') \
            .eq('user_id', user_id) \
            .gte('created_at', start_date.isoformat()) \
            .lte('created_at', end_date.isoformat()) \
            .execute()
        
        entries = response.data
        if not entries:
            return jsonify({'data': {
                'total_entries': 0,
                'entry_types': {},
                'mood_trend': [],
                'common_tags': [],
                'streak': 0
            }}), 200
        
        # Calculate analytics
        total_entries = len(entries)
        entry_types = {}
        mood_data = []
        tags_count = {}
        
        for entry in entries:
            # Count entry types
            prompt_type = entry['prompt_type']
            entry_types[prompt_type] = entry_types.get(prompt_type, 0) + 1
            
            # Collect mood data
            if entry.get('mood_rating'):
                mood_data.append({
                    'date': entry['created_at'],
                    'rating': entry['mood_rating']
                })
            
            # Count tags
            for tag in entry.get('tags', []):
                tags_count[tag] = tags_count.get(tag, 0) + 1
        
        # Calculate streak
        streak = 0
        current_date = datetime.utcnow().date()
        while True:
            day_entries = [e for e in entries if datetime.fromisoformat(e['created_at']).date() == current_date]
            if not day_entries:
                break
            streak += 1
            current_date -= timedelta(days=1)
        
        # Get most common tags
        common_tags = sorted(
            [{'tag': tag, 'count': count} for tag, count in tags_count.items()],
            key=lambda x: x['count'],
            reverse=True
        )[:10]
        
        analytics_data = {
            'total_entries': total_entries,
            'entry_types': entry_types,
            'mood_trend': sorted(mood_data, key=lambda x: x['date']),
            'common_tags': common_tags,
            'streak': streak
        }
        
        return jsonify({'data': analytics_data}), 200
    except Exception as e:
        print(f"Error getting journal analytics: {str(e)}")
        return jsonify({'error': 'Failed to get journal analytics'}), 500 