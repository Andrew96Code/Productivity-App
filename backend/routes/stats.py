from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from ..config import supabase_client

stats_bp = Blueprint('stats', __name__)

def get_date_range(period):
    now = datetime.utcnow()
    if period == 'week':
        start_date = now - timedelta(days=7)
    elif period == 'month':
        start_date = now - timedelta(days=30)
    elif period == 'year':
        start_date = now - timedelta(days=365)
    else:  # all time
        start_date = now - timedelta(days=3650)  # 10 years
    return start_date, now

@stats_bp.route('/stats/points', methods=['GET'])
def get_points_stats():
    user_id = request.args.get('user_id')
    period = request.args.get('period', 'week')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        start_date, end_date = get_date_range(period)
        
        # Get total points
        points_response = supabase_client.table('points_history') \
            .select('points') \
            .eq('user_id', user_id) \
            .execute()
        
        total_points = sum(p['points'] for p in points_response.data)
        
        # Get points in period
        period_points_response = supabase_client.table('points_history') \
            .select('points') \
            .eq('user_id', user_id) \
            .gte('created_at', start_date.isoformat()) \
            .lte('created_at', end_date.isoformat()) \
            .execute()
        
        period_points = sum(p['points'] for p in period_points_response.data)
        
        # Get points by category
        categories = ['goals', 'habits', 'focus', 'mood', 'quiz', 'achievements']
        category_points = {}
        
        for category in categories:
            earned_response = supabase_client.table('points_history') \
                .select('points') \
                .eq('user_id', user_id) \
                .like('reason', f'%{category}%') \
                .execute()
            
            available_response = supabase_client.table('achievements') \
                .select('points_reward') \
                .eq('category', category) \
                .execute()
            
            category_points[category] = {
                'earned': sum(p['points'] for p in earned_response.data),
                'available': sum(a['points_reward'] for a in available_response.data)
            }
        
        return jsonify({
            'success': True,
            'data': {
                'total': total_points,
                'change': period_points,
                'category_points': category_points
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting points stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get points statistics'
        }), 500

@stats_bp.route('/stats/goals', methods=['GET'])
def get_goals_stats():
    user_id = request.args.get('user_id')
    period = request.args.get('period', 'week')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        start_date, end_date = get_date_range(period)
        
        # Get completed goals in period
        completed_response = supabase_client.table('goals') \
            .select('id') \
            .eq('user_id', user_id) \
            .eq('status', 'completed') \
            .gte('updated_at', start_date.isoformat()) \
            .lte('updated_at', end_date.isoformat()) \
            .execute()
        
        # Get in-progress goals
        in_progress_response = supabase_client.table('goals') \
            .select('id') \
            .eq('user_id', user_id) \
            .eq('status', 'in_progress') \
            .execute()
        
        return jsonify({
            'success': True,
            'data': {
                'completed': len(completed_response.data),
                'in_progress': len(in_progress_response.data)
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting goals stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get goals statistics'
        }), 500

@stats_bp.route('/stats/habits', methods=['GET'])
def get_habits_stats():
    user_id = request.args.get('user_id')
    period = request.args.get('period', 'week')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        start_date, end_date = get_date_range(period)
        
        # Get all user's habits
        habits_response = supabase_client.table('habits') \
            .select('id,title') \
            .eq('user_id', user_id) \
            .execute()
        
        # Calculate completion rates for each habit
        completion_rates = {}
        current_streak = 0
        longest_streak = 0
        
        for habit in habits_response.data:
            # Get completions in period
            completions_response = supabase_client.table('habit_completions') \
                .select('completion_date') \
                .eq('habit_id', habit['id']) \
                .gte('completion_date', start_date.date().isoformat()) \
                .lte('completion_date', end_date.date().isoformat()) \
                .execute()
            
            # Calculate completion rate
            days_in_period = (end_date - start_date).days
            completion_rate = len(completions_response.data) / days_in_period
            completion_rates[habit['title']] = completion_rate
            
            # Calculate streak
            dates = sorted([c['completion_date'] for c in completions_response.data])
            current_date = end_date.date()
            streak = 0
            
            for date in reversed(dates):
                if date == current_date.isoformat():
                    streak += 1
                    current_date -= timedelta(days=1)
                else:
                    break
            
            current_streak = max(current_streak, streak)
            longest_streak = max(longest_streak, streak)
        
        return jsonify({
            'success': True,
            'data': {
                'completion_rates': completion_rates,
                'current_streak': current_streak,
                'longest_streak': longest_streak
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting habits stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get habits statistics'
        }), 500

@stats_bp.route('/stats/focus', methods=['GET'])
def get_focus_stats():
    user_id = request.args.get('user_id')
    period = request.args.get('period', 'week')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        start_date, end_date = get_date_range(period)
        
        # Get completed focus sessions in period
        sessions_response = supabase_client.table('focus_sessions') \
            .select('duration') \
            .eq('user_id', user_id) \
            .eq('status', 'completed') \
            .gte('start_time', start_date.isoformat()) \
            .lte('end_time', end_date.isoformat()) \
            .execute()
        
        total_minutes = sum(s['duration'] for s in sessions_response.data)
        days_in_period = (end_date - start_date).days
        average_daily_minutes = total_minutes / days_in_period if days_in_period > 0 else 0
        
        return jsonify({
            'success': True,
            'data': {
                'total_minutes': total_minutes,
                'average_daily_minutes': average_daily_minutes
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting focus stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get focus statistics'
        }), 500

@stats_bp.route('/stats/activity', methods=['GET'])
def get_activity_stats():
    user_id = request.args.get('user_id')
    period = request.args.get('period', 'week')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        start_date, end_date = get_date_range(period)
        days = []
        
        current_date = start_date
        while current_date <= end_date:
            day_stats = {
                'date': current_date.date().isoformat(),
                'goals': 0,
                'habits': 0,
                'focus': 0,
                'mood': 0,
                'total': 0
            }
            
            # Count completed goals
            goals_response = supabase_client.table('goals') \
                .select('id') \
                .eq('user_id', user_id) \
                .eq('status', 'completed') \
                .gte('updated_at', current_date.isoformat()) \
                .lt('updated_at', (current_date + timedelta(days=1)).isoformat()) \
                .execute()
            day_stats['goals'] = len(goals_response.data)
            
            # Count habit completions
            habits_response = supabase_client.table('habit_completions') \
                .select('id') \
                .eq('user_id', user_id) \
                .eq('completion_date', current_date.date().isoformat()) \
                .execute()
            day_stats['habits'] = len(habits_response.data)
            
            # Count focus sessions
            focus_response = supabase_client.table('focus_sessions') \
                .select('id') \
                .eq('user_id', user_id) \
                .eq('status', 'completed') \
                .gte('start_time', current_date.isoformat()) \
                .lt('start_time', (current_date + timedelta(days=1)).isoformat()) \
                .execute()
            day_stats['focus'] = len(focus_response.data)
            
            # Count mood entries
            mood_response = supabase_client.table('mood_entries') \
                .select('id') \
                .eq('user_id', user_id) \
                .gte('created_at', current_date.isoformat()) \
                .lt('created_at', (current_date + timedelta(days=1)).isoformat()) \
                .execute()
            day_stats['mood'] = len(mood_response.data)
            
            day_stats['total'] = sum([
                day_stats['goals'],
                day_stats['habits'],
                day_stats['focus'],
                day_stats['mood']
            ])
            
            days.append(day_stats)
            current_date += timedelta(days=1)
        
        return jsonify({
            'success': True,
            'data': days[-7:]  # Return last 7 days
        }), 200
        
    except Exception as e:
        print(f"Error getting activity stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get activity statistics'
        }), 500 