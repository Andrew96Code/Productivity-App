from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from ..config import get_supabase_client
import random

prize_draw_bp = Blueprint('prize_draw', __name__)

@prize_draw_bp.route('/draws', methods=['GET'])
def get_draws():
    """Get all active prize draws."""
    try:
        supabase = get_supabase_client()
        now = datetime.now(timezone.utc)
        
        # Get active draws that haven't ended yet
        response = supabase.table('prize_draws')\
            .select('*')\
            .eq('status', 'active')\
            .gt('end_date', now.isoformat())\
            .order('end_date')\
            .execute()
        
        return jsonify({
            'success': True,
            'data': response.data or []
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prize_draw_bp.route('/draws/<draw_id>/entries', methods=['GET'])
def get_draw_entries(draw_id):
    """Get entries for a specific draw."""
    try:
        supabase = get_supabase_client()
        
        response = supabase.table('prize_draw_entries')\
            .select('*')\
            .eq('draw_id', draw_id)\
            .execute()
        
        return jsonify({
            'success': True,
            'data': response.data or []
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prize_draw_bp.route('/draws/<draw_id>/enter', methods=['POST'])
def enter_draw(draw_id):
    """Enter a prize draw."""
    data = request.get_json()
    user_id = data.get('user_id')
    tickets = data.get('tickets', 1)
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        supabase = get_supabase_client()
        now = datetime.now(timezone.utc)
        
        # Get draw details
        draw_response = supabase.table('prize_draws')\
            .select('*')\
            .eq('id', draw_id)\
            .single()\
            .execute()
        
        draw = draw_response.data
        if not draw:
            return jsonify({'error': 'Draw not found'}), 404
        
        # Check if draw is still active
        if draw['status'] != 'active' or draw['end_date'] < now.isoformat():
            return jsonify({'error': 'Draw is no longer active'}), 400
        
        # Calculate points needed
        points_needed = tickets * draw['points_required']
        
        # Get user's current points
        points_response = supabase.rpc('get_user_points', {'user_id_param': user_id}).execute()
        current_points = points_response.data
        
        if current_points < points_needed:
            return jsonify({'error': 'Insufficient points'}), 400
        
        # Create entry and deduct points
        entry_data = {
            'draw_id': draw_id,
            'user_id': user_id,
            'tickets': tickets
        }
        
        entry_response = supabase.table('prize_draw_entries').insert(entry_data).execute()
        
        # Deduct points
        points_log_data = {
            'user_id': user_id,
            'points': -points_needed,
            'reason': f'Entered prize draw: {draw["title"]} ({tickets} tickets)',
            'category': 'prize_draw_entry'
        }
        supabase.table('points_log').insert(points_log_data).execute()
        
        return jsonify({
            'success': True,
            'data': entry_response.data[0]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prize_draw_bp.route('/draws/<draw_id>/draw-winner', methods=['POST'])
def draw_winner(draw_id):
    """Draw a winner for a completed prize draw."""
    try:
        supabase = get_supabase_client()
        
        # Get all entries for the draw
        entries_response = supabase.table('prize_draw_entries')\
            .select('*')\
            .eq('draw_id', draw_id)\
            .execute()
        
        entries = entries_response.data
        if not entries:
            return jsonify({'error': 'No entries found for this draw'}), 400
        
        # Create weighted list based on number of tickets
        weighted_entries = []
        for entry in entries:
            weighted_entries.extend([entry['user_id']] * entry['tickets'])
        
        # Randomly select winner
        winner_id = random.choice(weighted_entries)
        
        # Update draw with winner
        update_data = {
            'status': 'completed',
            'winner_id': winner_id
        }
        
        response = supabase.table('prize_draws')\
            .update(update_data)\
            .eq('id', draw_id)\
            .execute()
        
        return jsonify({
            'success': True,
            'data': {
                'draw': response.data[0],
                'winner_id': winner_id
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prize_draw_bp.route('/draws/<draw_id>/cancel', methods=['POST'])
def cancel_draw(draw_id):
    """Cancel a prize draw and refund points to participants."""
    try:
        supabase = get_supabase_client()
        
        # Get draw details
        draw_response = supabase.table('prize_draws')\
            .select('*')\
            .eq('id', draw_id)\
            .single()\
            .execute()
        
        draw = draw_response.data
        if not draw:
            return jsonify({'error': 'Draw not found'}), 404
        
        # Get all entries
        entries_response = supabase.table('prize_draw_entries')\
            .select('*')\
            .eq('draw_id', draw_id)\
            .execute()
        
        # Refund points to participants
        for entry in entries_response.data:
            points_refund = entry['tickets'] * draw['points_required']
            refund_data = {
                'user_id': entry['user_id'],
                'points': points_refund,
                'reason': f'Refund for cancelled draw: {draw["title"]}',
                'category': 'prize_draw_refund'
            }
            supabase.table('points_log').insert(refund_data).execute()
        
        # Update draw status
        update_data = {
            'status': 'cancelled'
        }
        
        response = supabase.table('prize_draws')\
            .update(update_data)\
            .eq('id', draw_id)\
            .execute()
        
        return jsonify({
            'success': True,
            'data': response.data[0]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prize_draw_bp.route('/entry', methods=['POST'])
def create_entry():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        time_period = data.get('time_period')
        
        if not user_id or not time_period:
            return jsonify({'error': 'User ID and time period are required'}), 400
            
        supabase = get_supabase_client()
        
        # Check if user already has an entry for this time period today
        today = datetime.now().date().isoformat()
        existing_entry = supabase.table('prize_draw_entries').select('*').eq('user_id', user_id).eq('time_period', time_period).gte('created_at', today).execute()
        
        if existing_entry.data:
            return jsonify({'error': 'Entry already exists for this time period today'}), 400
        
        # Create new entry
        entry_data = {
            'user_id': user_id,
            'time_period': time_period,
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('prize_draw_entries').insert(entry_data).execute()
        
        # Award points for completing all tasks
        points_data = {
            'user_id': user_id,
            'points': 50,  # Award 50 points for completing all tasks in a time period
            'reason': f'Completed all tasks - {time_period}',
            'created_at': datetime.now().isoformat()
        }
        supabase.table('points_history').insert(points_data).execute()
        
        return jsonify({
            'message': 'Prize draw entry created successfully',
            'data': result.data[0]
        }), 201
        
    except Exception as e:
        print(f"Error creating prize draw entry: {str(e)}")
        return jsonify({'error': 'Failed to create prize draw entry'}), 500

@prize_draw_bp.route('/entries', methods=['GET'])
def get_entries():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
            
        supabase = get_supabase_client()
        
        # Get entries for the current month
        start_date = datetime.now().replace(day=1).date().isoformat()
        result = supabase.table('prize_draw_entries').select('*').eq('user_id', user_id).gte('created_at', start_date).execute()
        
        entries_by_period = {
            'morning': 0,
            'afternoon': 0,
            'evening': 0
        }
        
        for entry in result.data:
            period = entry['time_period']
            if period in entries_by_period:
                entries_by_period[period] += 1
        
        return jsonify({
            'data': {
                'entries': result.data,
                'summary': entries_by_period
            }
        })
        
    except Exception as e:
        print(f"Error getting prize draw entries: {str(e)}")
        return jsonify({'error': 'Failed to get prize draw entries'}), 500 