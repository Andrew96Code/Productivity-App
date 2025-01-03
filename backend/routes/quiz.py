from flask import Blueprint, request, jsonify
from backend.config import get_supabase_client
import json

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/questions', methods=['GET'])
def get_questions():
    try:
        difficulty = request.args.get('difficulty', 'medium')
        limit = request.args.get('limit', 5)
        
        supabase = get_supabase_client()
        result = supabase.table('quizzes')\
            .select('*')\
            .eq('difficulty_level', difficulty)\
            .limit(limit)\
            .execute()
        
        # Ensure options are properly formatted as JSON
        questions = []
        for question in result.data:
            # Parse options if it's a string, otherwise use as is
            if isinstance(question['options'], str):
                try:
                    question['options'] = json.loads(question['options'])
                except json.JSONDecodeError:
                    # If string parsing fails, try to evaluate as Python list
                    question['options'] = eval(question['options'])
            questions.append(question)
        
        return jsonify({"data": questions}), 200
    except Exception as e:
        print(f"Error fetching questions: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 400

@quiz_bp.route('/submit', methods=['POST'])
def submit_answer():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        quiz_id = data.get('quiz_id')
        selected_answer = data.get('selected_answer')
        
        supabase = get_supabase_client()
        
        # Get correct answer
        quiz = supabase.table('quizzes')\
            .select('correct_answer')\
            .eq('id', quiz_id)\
            .single()\
            .execute()
        
        is_correct = quiz.data['correct_answer'] == selected_answer
        
        # Record response
        result = supabase.table('user_quiz_responses').insert({
            'user_id': user_id,
            'quiz_id': quiz_id,
            'selected_answer': selected_answer,
            'correct': is_correct
        }).execute()
        
        # Award points if correct
        if is_correct:
            supabase.table('points_log').insert({
                'user_id': user_id,
                'points': 10,  # Base points for correct answer
                'reason': 'quiz_correct'
            }).execute()
        
        return jsonify({
            "message": "Answer submitted successfully",
            "correct": is_correct,
            "data": result.data
        }), 201
    except Exception as e:
        print(f"Error submitting answer: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 400 