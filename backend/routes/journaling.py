from flask import Blueprint, request, jsonify
from datetime import datetime
from backend.config import get_supabase_client

journaling_bp = Blueprint('journaling', __name__)

@journaling_bp.route('/log', methods=['POST'])
def create_daily_log():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        prompt_type = data.get('prompt_type')  # morning, midday, or evening
        response = data.get('response')
        
        supabase = get_supabase_client()
        result = supabase.table('daily_logs').insert({
            'user_id': user_id,
            f'{prompt_type}_prompt_response': response,
            'date': datetime.now().date().isoformat(),
            'created_at': datetime.now().isoformat()
        }).execute()
        
        return jsonify({"message": "Log created successfully", "data": result.data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@journaling_bp.route('/logs/<user_id>', methods=['GET'])
def get_user_logs(user_id):
    try:
        date = request.args.get('date', datetime.now().date().isoformat())
        
        supabase = get_supabase_client()
        result = supabase.table('daily_logs')\
            .select('*')\
            .eq('user_id', user_id)\
            .eq('date', date)\
            .execute()
        
        return jsonify({"data": result.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400 