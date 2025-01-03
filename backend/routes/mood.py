from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from ..config import supabase_client
import uuid

mood_bp = Blueprint('mood', __name__)

@mood_bp.route('/entries', methods=['GET'])
def get_moods():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    period = request.args.get('period', 'week')
    
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
        response = supabase_client.table('mood_entries').select('*') \
            .eq('user_id', user_id) \
            .gte('created_at', start_date.isoformat()) \
            .lte('created_at', end_date.isoformat()) \
            .order('created_at', desc=True) \
            .execute()
        
        return jsonify({'data': response.data}), 200
    except Exception as e:
        print(f"Error getting mood entries: {str(e)}")
        return jsonify({'error': 'Failed to get mood entries'}), 500

@mood_bp.route('/entries', methods=['POST'])
def log_mood():
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    required_fields = ['mood_rating', 'mood_type']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    
    try:
        # Create mood entry
        mood_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'mood_rating': data['mood_rating'],
            'mood_type': data['mood_type'],
            'energy_level': data.get('energy_level'),
            'sleep_hours': data.get('sleep_hours'),
            'activities': data.get('activities', []),
            'notes': data.get('notes', ''),
            'created_at': datetime.utcnow().isoformat()
        }
        
        response = supabase_client.table('mood_entries').insert(mood_data).execute()
        
        # Award points for logging mood
        points_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'points': 5,
            'reason': 'Logged mood entry',
            'created_at': datetime.utcnow().isoformat()
        }
        supabase_client.table('points_history').insert(points_data).execute()
        
        return jsonify({'data': response.data[0]}), 201
    except Exception as e:
        print(f"Error logging mood: {str(e)}")
        return jsonify({'error': 'Failed to log mood'}), 500

@mood_bp.route('/entries/<entry_id>', methods=['DELETE'])
def delete_mood(entry_id):
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Verify the entry belongs to the user
        response = supabase_client.table('mood_entries').select('*') \
            .eq('id', entry_id) \
            .eq('user_id', user_id) \
            .execute()
        
        if not response.data:
            return jsonify({'error': 'Mood entry not found'}), 404
        
        # Delete the entry
        supabase_client.table('mood_entries').delete() \
            .eq('id', entry_id) \
            .eq('user_id', user_id) \
            .execute()
        
        return jsonify({'message': 'Mood entry deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting mood entry: {str(e)}")
        return jsonify({'error': 'Failed to delete mood entry'}), 500

@mood_bp.route('/analytics', methods=['GET'])
def get_analytics():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    period = request.args.get('period', 'week')
    
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
        # Get mood entries for the period
        response = supabase_client.table('mood_entries').select('*') \
            .eq('user_id', user_id) \
            .gte('created_at', start_date.isoformat()) \
            .lte('created_at', end_date.isoformat()) \
            .execute()
        
        entries = response.data
        if not entries:
            return jsonify({'data': {
                'average_mood': 0,
                'average_energy': 0,
                'average_sleep': 0,
                'mood_distribution': {},
                'common_activities': [],
                'best_mood_activities': []
            }}), 200
        
        # Calculate averages
        mood_ratings = [e['mood_rating'] for e in entries]
        energy_levels = [e['energy_level'] for e in entries if e['energy_level']]
        sleep_hours = [e['sleep_hours'] for e in entries if e['sleep_hours']]
        
        average_mood = round(sum(mood_ratings) / len(mood_ratings), 1)
        average_energy = round(sum(energy_levels) / len(energy_levels), 1) if energy_levels else 0
        average_sleep = round(sum(sleep_hours) / len(sleep_hours), 1) if sleep_hours else 0
        
        # Calculate mood distribution
        mood_counts = {}
        for entry in entries:
            mood_type = entry['mood_type']
            mood_counts[mood_type] = mood_counts.get(mood_type, 0) + 1
        
        total_moods = len(entries)
        mood_distribution = {mood: round((count / total_moods) * 100) 
                           for mood, count in mood_counts.items()}
        
        # Analyze activities
        activity_data = {}
        for entry in entries:
            for activity in entry['activities']:
                if activity not in activity_data:
                    activity_data[activity] = {
                        'count': 0,
                        'total_mood': 0
                    }
                activity_data[activity]['count'] += 1
                activity_data[activity]['total_mood'] += entry['mood_rating']
        
        # Get most common activities
        common_activities = sorted(
            [{'activity': activity, 'count': data['count']} 
             for activity, data in activity_data.items()],
            key=lambda x: x['count'],
            reverse=True
        )[:5]
        
        # Get activities with best mood impact
        best_mood_activities = sorted(
            [{'activity': activity, 
              'average_mood': round(data['total_mood'] / data['count'], 1)}
             for activity, data in activity_data.items()
             if data['count'] >= 3],  # Require at least 3 entries for significance
            key=lambda x: x['average_mood'],
            reverse=True
        )[:5]
        
        analytics_data = {
            'average_mood': average_mood,
            'average_energy': average_energy,
            'average_sleep': average_sleep,
            'mood_distribution': mood_distribution,
            'common_activities': common_activities,
            'best_mood_activities': best_mood_activities
        }
        
        return jsonify({'data': analytics_data}), 200
    except Exception as e:
        print(f"Error getting mood analytics: {str(e)}")
        return jsonify({'error': 'Failed to get mood analytics'}), 500 