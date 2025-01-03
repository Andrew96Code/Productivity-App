from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from backend.config import get_supabase_client

points_bp = Blueprint('points', __name__)

@points_bp.route('/total/<user_id>', methods=['GET'])
def get_total_points(user_id):
    try:
        supabase = get_supabase_client()
        result = supabase.table('points_log')\
            .select('points')\
            .eq('user_id', user_id)\
            .execute()
        
        total_points = sum(record['points'] for record in result.data)
        return jsonify({"total_points": total_points}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@points_bp.route('/history/<user_id>', methods=['GET'])
def get_points_history(user_id):
    try:
        days = int(request.args.get('days', 30))
        start_date = (datetime.now() - timedelta(days=days)).date().isoformat()
        
        supabase = get_supabase_client()
        result = supabase.table('points_log')\
            .select('*')\
            .eq('user_id', user_id)\
            .gte('created_at', start_date)\
            .order('created_at', desc=True)\
            .execute()
        
        return jsonify({"data": result.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@points_bp.route('/award', methods=['POST'])
def award_points():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        points = data.get('points')
        reason = data.get('reason')
        
        supabase = get_supabase_client()
        result = supabase.table('points_log').insert({
            'user_id': user_id,
            'points': points,
            'reason': reason,
            'created_at': datetime.now().isoformat()
        }).execute()
        
        return jsonify({"message": "Points awarded successfully", "data": result.data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400 