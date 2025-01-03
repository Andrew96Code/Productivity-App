from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from ..config import supabase_client
import uuid

achievements_bp = Blueprint('achievements', __name__)

@achievements_bp.route('/achievements', methods=['GET'])
def get_achievements():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    category = request.args.get('category')
    
    try:
        # Get all achievements
        query = supabase_client.table('achievements').select('*')
        if category and category != 'all':
            query = query.eq('category', category)
        achievements_response = query.execute()
        
        # Get user's progress for these achievements
        progress_response = supabase_client.table('user_achievements').select('*') \
            .eq('user_id', user_id) \
            .execute()
        
        # Combine achievement data with user progress
        achievements_data = achievements_response.data
        progress_data = {p['achievement_id']: p for p in progress_response.data}
        
        combined_data = []
        for achievement in achievements_data:
            progress = progress_data.get(achievement['id'], {
                'progress': 0,
                'completed': False,
                'completed_at': None
            })
            
            combined_data.append({
                **achievement,
                'progress': progress.get('progress', 0),
                'completed': progress.get('completed', False),
                'completed_at': progress.get('completed_at')
            })
        
        return jsonify({
            'success': True,
            'data': combined_data
        }), 200
        
    except Exception as e:
        print(f"Error getting achievements: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get achievements'
        }), 500

@achievements_bp.route('/achievements/progress', methods=['POST'])
def update_achievement_progress():
    data = request.get_json()
    user_id = data.get('user_id')
    achievement_id = data.get('achievement_id')
    progress = data.get('progress')
    
    if not all([user_id, achievement_id, progress is not None]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        # Get achievement details
        achievement_response = supabase_client.table('achievements').select('*') \
            .eq('id', achievement_id) \
            .execute()
        
        if not achievement_response.data:
            return jsonify({'error': 'Achievement not found'}), 404
        
        achievement = achievement_response.data[0]
        
        # Get or create user achievement progress
        progress_response = supabase_client.table('user_achievements').select('*') \
            .eq('user_id', user_id) \
            .eq('achievement_id', achievement_id) \
            .execute()
        
        current_time = datetime.utcnow().isoformat()
        
        if progress_response.data:
            # Update existing progress
            user_achievement = progress_response.data[0]
            was_completed = user_achievement['completed']
            
            # Check if achievement is completed
            is_completed = progress >= achievement['requirement_value']
            
            update_data = {
                'progress': progress,
                'completed': is_completed
            }
            
            if is_completed and not was_completed:
                update_data['completed_at'] = current_time
                # Award points for completing the achievement
                points_data = {
                    'id': str(uuid.uuid4()),
                    'user_id': user_id,
                    'points': achievement['points_reward'],
                    'reason': f'Completed achievement: {achievement["title"]}',
                    'created_at': current_time
                }
                supabase_client.table('points_history').insert(points_data).execute()
            
            response = supabase_client.table('user_achievements') \
                .update(update_data) \
                .eq('id', user_achievement['id']) \
                .execute()
        else:
            # Create new progress entry
            is_completed = progress >= achievement['requirement_value']
            progress_data = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'achievement_id': achievement_id,
                'progress': progress,
                'completed': is_completed,
                'completed_at': current_time if is_completed else None,
                'created_at': current_time
            }
            
            response = supabase_client.table('user_achievements').insert(progress_data).execute()
            
            if is_completed:
                # Award points for completing the achievement
                points_data = {
                    'id': str(uuid.uuid4()),
                    'user_id': user_id,
                    'points': achievement['points_reward'],
                    'reason': f'Completed achievement: {achievement["title"]}',
                    'created_at': current_time
                }
                supabase_client.table('points_history').insert(points_data).execute()
        
        return jsonify({
            'success': True,
            'data': response.data[0]
        }), 200
        
    except Exception as e:
        print(f"Error updating achievement progress: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to update achievement progress'
        }), 500

@achievements_bp.route('/achievements/stats', methods=['GET'])
def get_achievement_stats():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        # Get total achievements count
        total_response = supabase_client.table('achievements').select('count') \
            .execute()
        total_count = total_response.count
        
        # Get completed achievements count
        completed_response = supabase_client.table('user_achievements').select('count') \
            .eq('user_id', user_id) \
            .eq('completed', True) \
            .execute()
        completed_count = completed_response.count
        
        # Get completion percentage by category
        categories_response = supabase_client.table('achievements').select('category').execute()
        categories = set(a['category'] for a in categories_response.data)
        
        category_stats = {}
        for category in categories:
            # Get total in category
            category_total = len([a for a in categories_response.data if a['category'] == category])
            
            # Get completed in category
            completed_in_category = supabase_client.table('user_achievements') \
                .select('user_achievements.id') \
                .join('achievements', 'user_achievements.achievement_id=achievements.id') \
                .eq('user_achievements.user_id', user_id) \
                .eq('user_achievements.completed', True) \
                .eq('achievements.category', category) \
                .execute()
            
            category_stats[category] = {
                'total': category_total,
                'completed': len(completed_in_category.data),
                'percentage': round((len(completed_in_category.data) / category_total * 100) if category_total > 0 else 0, 1)
            }
        
        return jsonify({
            'success': True,
            'data': {
                'total_achievements': total_count,
                'completed_achievements': completed_count,
                'completion_percentage': round((completed_count / total_count * 100) if total_count > 0 else 0, 1),
                'category_stats': category_stats
            }
        }), 200
        
    except Exception as e:
        print(f"Error getting achievement stats: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to get achievement stats'
        }), 500 