from flask import Blueprint, jsonify, request
import random

quiz_bp = Blueprint('quiz', __name__)

# Sample quiz questions (in production, these would come from a database)
QUIZ_QUESTIONS = [
    {
        'id': 1,
        'text': 'What is the most effective way to build a new habit?',
        'options': [
            'Start big and aim for perfection',
            'Start small and build gradually',
            'Wait for motivation',
            'Change everything at once'
        ],
        'correct_index': 1
    },
    {
        'id': 2,
        'text': 'Which technique can help improve focus during work?',
        'options': [
            'Multitasking constantly',
            'Working for hours without breaks',
            'The Pomodoro Technique',
            'Checking emails frequently'
        ],
        'correct_index': 2
    },
    {
        'id': 3,
        'text': 'What is a key component of effective goal setting?',
        'options': [
            'Setting vague goals',
            'Making goals as challenging as possible',
            'Keeping goals private',
            'Making goals specific and measurable'
        ],
        'correct_index': 3
    },
    {
        'id': 4,
        'text': 'Which is the best approach to manage stress?',
        'options': [
            'Regular exercise and meditation',
            'Ignoring it completely',
            'Working longer hours',
            'Avoiding all challenges'
        ],
        'correct_index': 0
    },
    {
        'id': 5,
        'text': 'What is an effective way to improve time management?',
        'options': [
            'Taking on more tasks',
            'Prioritizing and planning ahead',
            'Working without breaks',
            'Saying yes to everything'
        ],
        'correct_index': 1
    }
]

@quiz_bp.route('/question', methods=['GET'])
def get_question():
    """Get a random quiz question"""
    if not QUIZ_QUESTIONS:
        return jsonify({'message': 'No questions available'}), 404
    
    question = random.choice(QUIZ_QUESTIONS).copy()
    # Don't send the correct answer to the client
    question.pop('correct_index')
    return jsonify({'question': question})

@quiz_bp.route('/answer', methods=['POST'])
def submit_answer():
    """Submit an answer to a quiz question"""
    data = request.get_json()
    question_id = data.get('question_id')
    answer_index = data.get('answer_index')
    user_id = data.get('user_id')
    
    if not all([question_id, isinstance(answer_index, int), user_id]):
        return jsonify({'message': 'Invalid request data'}), 400
    
    # Find the question
    question = next((q for q in QUIZ_QUESTIONS if q['id'] == question_id), None)
    if not question:
        return jsonify({'message': 'Question not found'}), 404
    
    is_correct = answer_index == question['correct_index']
    
    # In production, you would save the answer and update user's progress
    
    return jsonify({
        'correct': is_correct,
        'correct_index': question['correct_index']
    }) 