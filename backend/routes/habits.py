from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
from ..config import supabase_client

habits_bp = Blueprint('habits', __name__)

@habits_bp.route('/habits', methods=['GET'])
def get_habits():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
        
    try:
        # Get user's habits
        response = supabase_client.table('habits').select('*').eq('user_id', user_id).execute()
        habits = response.data
        
        # Get completion history for the last 7 days
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=6)
        
        for habit in habits:
            # Get completion history
            history_response = supabase_client.table('habit_completions') \
                .select('*') \
                .eq('habit_id', habit['id']) \
                .gte('completion_date', start_date.isoformat()) \
                .lte('completion_date', end_date.isoformat()) \
                .execute()
            
            completions = history_response.data
            completion_dates = {c['completion_date'] for c in completions}
            
            # Build 7-day history
            history = []
            current_date = start_date
            while current_date <= end_date:
                history.append({
                    'date': current_date.isoformat(),
                    'completed': current_date.isoformat() in completion_dates
                })
                current_date += timedelta(days=1)
            
            habit['history'] = history
            habit['completed_today'] = end_date.isoformat() in completion_dates
            
            # Calculate current streak
            streak = 0
            current_streak_date = end_date
            while True:
                if current_streak_date.isoformat() in completion_dates:
                    streak += 1
                    current_streak_date -= timedelta(days=1)
                else:
                    break
            habit['current_streak'] = streak
        
        return jsonify({'data': habits})
    except Exception as e:
        print(f"Error getting habits: {str(e)}")
        return jsonify({'error': 'Failed to get habits'}), 500

@habits_bp.route('/habits', methods=['POST'])
def create_habit():
    data = request.get_json()
    required_fields = ['user_id', 'title', 'category', 'frequency']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        habit_data = {
            'id': str(uuid.uuid4()),
            'user_id': data['user_id'],
            'title': data['title'],
            'description': data.get('description', ''),
            'category': data['category'],
            'frequency': data['frequency'],
            'target_value': data.get('target_value', 1),
            'current_value': 0,
            'created_at': datetime.now().isoformat()
        }
        
        # Create habit
        response = supabase_client.table('habits').insert(habit_data).execute()
        
        # Award points for creating a new habit
        points_data = {
            'id': str(uuid.uuid4()),
            'user_id': data['user_id'],
            'points': 10,
            'source': 'habit_created',
            'source_id': habit_data['id'],
            'created_at': datetime.now().isoformat()
        }
        supabase_client.table('points_history').insert(points_data).execute()
        
        return jsonify({'data': response.data[0]})
    except Exception as e:
        print(f"Error creating habit: {str(e)}")
        return jsonify({'error': 'Failed to create habit'}), 500

@habits_bp.route('/habits/<habit_id>/complete', methods=['POST'])
def complete_habit():
    data = request.get_json()
    habit_id = request.view_args['habit_id']
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Check if habit exists and belongs to user
        habit_response = supabase_client.table('habits') \
            .select('*') \
            .eq('id', habit_id) \
            .eq('user_id', user_id) \
            .execute()
        
        if not habit_response.data:
            return jsonify({'error': 'Habit not found or unauthorized'}), 404
        
        habit = habit_response.data[0]
        today = datetime.now().date()
        
        # Check if already completed today
        completion_response = supabase_client.table('habit_completions') \
            .select('*') \
            .eq('habit_id', habit_id) \
            .eq('completion_date', today.isoformat()) \
            .execute()
        
        if completion_response.data:
            return jsonify({'error': 'Habit already completed today'}), 400
        
        # Record completion
        completion_data = {
            'id': str(uuid.uuid4()),
            'habit_id': habit_id,
            'user_id': user_id,
            'completion_date': today.isoformat(),
            'created_at': datetime.now().isoformat()
        }
        supabase_client.table('habit_completions').insert(completion_data).execute()
        
        # Calculate streak
        streak = 1
        current_date = today - timedelta(days=1)
        
        while True:
            streak_check = supabase_client.table('habit_completions') \
                .select('*') \
                .eq('habit_id', habit_id) \
                .eq('completion_date', current_date.isoformat()) \
                .execute()
            
            if not streak_check.data:
                break
                
            streak += 1
            current_date -= timedelta(days=1)
        
        # Award points
        base_points = 5
        streak_bonus = 50 if streak > 0 and streak % 7 == 0 else 0
        total_points = base_points + streak_bonus
        
        points_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'points': total_points,
            'source': 'habit_completed',
            'source_id': habit_id,
            'created_at': datetime.now().isoformat()
        }
        supabase_client.table('points_history').insert(points_data).execute()
        
        return jsonify({
            'data': {
                'points_earned': total_points,
                'streak': streak
            }
        })
    except Exception as e:
        print(f"Error completing habit: {str(e)}")
        return jsonify({'error': 'Failed to complete habit'}), 500

@habits_bp.route('/habits/<habit_id>', methods=['DELETE'])
def delete_habit():
    habit_id = request.view_args['habit_id']
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Check if habit exists and belongs to user
        habit_response = supabase_client.table('habits') \
            .select('*') \
            .eq('id', habit_id) \
            .eq('user_id', user_id) \
            .execute()
        
        if not habit_response.data:
            return jsonify({'error': 'Habit not found or unauthorized'}), 404
        
        # Delete habit completions first
        supabase_client.table('habit_completions') \
            .delete() \
            .eq('habit_id', habit_id) \
            .execute()
        
        # Delete habit
        supabase_client.table('habits') \
            .delete() \
            .eq('id', habit_id) \
            .execute()
        
        return jsonify({'data': {'success': True}})
    except Exception as e:
        print(f"Error deleting habit: {str(e)}")
        return jsonify({'error': 'Failed to delete habit'}), 500 