from flask import Blueprint, request, jsonify
from datetime import datetime
from backend.config import get_supabase_client

goals_bp = Blueprint('goals', __name__)

@goals_bp.route('/', methods=['GET'])
def get_goals():
    """Get user's goals."""
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({
            'success': False,
            'error': 'User ID is required'
        }), 400
    
    try:
        supabase = get_supabase_client()
        
        response = supabase.table('goals')\
            .select('*')\
            .eq('user_id', user_id)\
            .order('created_at', desc=True)\
            .execute()
        
        if not response:
            print(f"No response from Supabase goals table for user {user_id}")
            return jsonify({
                'success': True,
                'data': []
            })
        
        goals = response.data or []
        
        # Ensure all required fields exist with default values
        for goal in goals:
            goal['title'] = goal.get('title', 'Unnamed Goal')
            goal['description'] = goal.get('description', '')
            goal['category'] = goal.get('category', 'other')
            goal['status'] = goal.get('status', 'not_started')
            goal['target_date'] = goal.get('target_date')
            goal['target_value'] = goal.get('target_value')
            goal['current_value'] = goal.get('current_value', 0)
        
        return jsonify({
            'success': True,
            'data': goals
        })
    except Exception as e:
        print(f"Error in get_goals for user {user_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while fetching goals',
            'details': str(e)
        }), 500

@goals_bp.route('/', methods=['POST'])
def create_goal():
    """Create a new goal."""
    data = request.get_json()
    required_fields = ['user_id', 'title', 'category']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        supabase = get_supabase_client()
        
        # Add timestamps
        data['created_at'] = datetime.utcnow().isoformat()
        data['updated_at'] = data['created_at']
        
        response = supabase.table('goals').insert(data).execute()
        
        return jsonify({
            'success': True,
            'data': response.data[0]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@goals_bp.route('/<goal_id>', methods=['PUT'])
def update_goal(goal_id):
    """Update a goal's status or progress."""
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        supabase = get_supabase_client()
        
        # Add updated timestamp
        data['updated_at'] = datetime.utcnow().isoformat()
        
        response = supabase.table('goals')\
            .update(data)\
            .eq('id', goal_id)\
            .eq('user_id', user_id)\
            .execute()
        
        if not response.data:
            return jsonify({'error': 'Goal not found or unauthorized'}), 404
        
        # If goal is completed, award points
        if data.get('status') == 'completed':
            points_data = {
                'user_id': user_id,
                'points': 50,  # Base points for completing a goal
                'reason': f'Completed goal: {response.data[0]["title"]}',
                'category': 'goal_completion'
            }
            supabase.table('points_log').insert(points_data).execute()
        
        return jsonify({
            'success': True,
            'data': response.data[0]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@goals_bp.route('/<goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    """Delete a goal."""
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        supabase = get_supabase_client()
        
        response = supabase.table('goals')\
            .delete()\
            .eq('id', goal_id)\
            .eq('user_id', user_id)\
            .execute()
        
        if not response.data:
            return jsonify({'error': 'Goal not found or unauthorized'}), 404
        
        return jsonify({
            'success': True,
            'message': 'Goal deleted successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500 