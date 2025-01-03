from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import uuid
from ..config import supabase_client

focus_bp = Blueprint('focus', __name__)

@focus_bp.route('/focus/sessions', methods=['GET'])
def get_sessions():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
        
    try:
        # Get user's focus sessions for the last 30 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        response = supabase_client.table('focus_sessions') \
            .select('*') \
            .eq('user_id', user_id) \
            .gte('start_time', start_date.isoformat()) \
            .lte('start_time', end_date.isoformat()) \
            .order('start_time', desc=True) \
            .execute()
            
        return jsonify({'data': response.data})
    except Exception as e:
        print(f"Error getting focus sessions: {str(e)}")
        return jsonify({'error': 'Failed to get focus sessions'}), 500

@focus_bp.route('/focus/sessions', methods=['POST'])
def start_session():
    data = request.get_json()
    user_id = data.get('user_id')
    duration = data.get('duration', 25)  # Default to 25 minutes
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
        
    try:
        session_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'duration': duration,
            'start_time': datetime.now().isoformat(),
            'status': 'in_progress'
        }
        
        response = supabase_client.table('focus_sessions').insert(session_data).execute()
        return jsonify({'data': response.data[0]})
    except Exception as e:
        print(f"Error starting focus session: {str(e)}")
        return jsonify({'error': 'Failed to start focus session'}), 500

@focus_bp.route('/focus/sessions/<session_id>/complete', methods=['POST'])
def complete_session():
    session_id = request.view_args['session_id']
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
        
    try:
        # Get session details
        session_response = supabase_client.table('focus_sessions') \
            .select('*') \
            .eq('id', session_id) \
            .eq('user_id', user_id) \
            .execute()
            
        if not session_response.data:
            return jsonify({'error': 'Session not found or unauthorized'}), 404
            
        session = session_response.data[0]
        if session['status'] == 'completed':
            return jsonify({'error': 'Session already completed'}), 400
            
        # Calculate points based on duration
        points = (session['duration'] // 5) * 2  # 2 points per 5 minutes
        
        # Update session status
        supabase_client.table('focus_sessions') \
            .update({'status': 'completed', 'end_time': datetime.now().isoformat()}) \
            .eq('id', session_id) \
            .execute()
            
        # Award points
        points_data = {
            'id': str(uuid.uuid4()),
            'user_id': user_id,
            'points': points,
            'source': 'focus_completed',
            'source_id': session_id,
            'created_at': datetime.now().isoformat()
        }
        supabase_client.table('points_history').insert(points_data).execute()
        
        return jsonify({
            'data': {
                'points_earned': points,
                'duration': session['duration']
            }
        })
    except Exception as e:
        print(f"Error completing focus session: {str(e)}")
        return jsonify({'error': 'Failed to complete focus session'}), 500

@focus_bp.route('/focus/sessions/<session_id>', methods=['DELETE'])
def delete_session():
    session_id = request.view_args['session_id']
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
        
    try:
        # Check if session exists and belongs to user
        session_response = supabase_client.table('focus_sessions') \
            .select('*') \
            .eq('id', session_id) \
            .eq('user_id', user_id) \
            .execute()
            
        if not session_response.data:
            return jsonify({'error': 'Session not found or unauthorized'}), 404
            
        # Delete session
        supabase_client.table('focus_sessions') \
            .delete() \
            .eq('id', session_id) \
            .execute()
            
        return jsonify({'data': {'success': True}})
    except Exception as e:
        print(f"Error deleting focus session: {str(e)}")
        return jsonify({'error': 'Failed to delete focus session'}), 500 