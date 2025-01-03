from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from ..db import get_db
from ..auth import require_auth

ai_automation_bp = Blueprint('ai_automation', __name__)

# Smart Goal Suggestions
@ai_automation_bp.route('/suggestions/goals', methods=['GET'])
@require_auth
def get_goal_suggestions(user_id):
    db = get_db()
    
    # Get user's past performance and patterns
    patterns = analyze_user_patterns(db, user_id)
    
    # Generate personalized suggestions
    suggestions = generate_smart_suggestions(db, user_id, 'goal', patterns)
    
    return jsonify(suggestions)

@ai_automation_bp.route('/suggestions/feedback', methods=['POST'])
@require_auth
def provide_suggestion_feedback(user_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        UPDATE smart_suggestions
        SET status = %s,
            feedback = %s
        WHERE id = %s AND user_id = %s
    ''', (data['status'], data.get('feedback'), data['suggestion_id'], user_id))
    
    # Update learning model with feedback
    update_learning_model(db, user_id, data)
    
    db.commit()
    return jsonify({'message': 'Feedback recorded successfully'})

# Schedule Optimization
@ai_automation_bp.route('/schedule/optimize', methods=['POST'])
@require_auth
def optimize_schedule(user_id):
    db = get_db()
    data = request.json
    
    # Get user patterns and preferences
    patterns = get_user_patterns(db, user_id)
    preferences = get_user_preferences(db, user_id)
    
    # Generate optimized schedule
    optimization = create_schedule_optimization(db, user_id, data['schedule'], patterns, preferences)
    
    return jsonify(optimization)

@ai_automation_bp.route('/schedule/apply', methods=['POST'])
@require_auth
def apply_schedule_optimization(user_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        UPDATE schedule_optimizations
        SET is_applied = true
        WHERE id = %s AND user_id = %s
    ''', (data['optimization_id'], user_id))
    
    # Apply the optimized schedule to user's calendar
    apply_optimized_schedule(db, user_id, data['optimization_id'])
    
    db.commit()
    return jsonify({'message': 'Schedule optimization applied successfully'})

# Burnout Prevention
@ai_automation_bp.route('/burnout/metrics', methods=['GET'])
@require_auth
def get_burnout_metrics(user_id):
    db = get_db()
    date = request.args.get('date', datetime.now().date().isoformat())
    
    metrics = db.execute('''
        SELECT * FROM burnout_metrics
        WHERE user_id = %s AND date = %s
    ''', (user_id, date)).fetchone()
    
    if not metrics:
        metrics = calculate_burnout_metrics(db, user_id, date)
        
    return jsonify(metrics)

@ai_automation_bp.route('/burnout/alerts', methods=['GET'])
@require_auth
def get_burnout_alerts(user_id):
    db = get_db()
    
    # Get recent burnout metrics
    metrics = db.execute('''
        SELECT * FROM burnout_metrics
        WHERE user_id = %s
        AND date >= CURRENT_DATE - INTERVAL '7 days'
        ORDER BY date DESC
    ''', (user_id,)).fetchall()
    
    # Generate alerts based on metrics
    alerts = generate_burnout_alerts(metrics)
    
    return jsonify(alerts)

# Task Prioritization
@ai_automation_bp.route('/tasks/prioritize', methods=['POST'])
@require_auth
def prioritize_tasks(user_id):
    db = get_db()
    data = request.json
    
    # Get task list and context
    tasks = data['tasks']
    context = get_task_context(db, user_id)
    
    # Calculate priorities
    priorities = calculate_task_priorities(db, user_id, tasks, context)
    
    return jsonify(priorities)

# Pattern Learning and Analysis
@ai_automation_bp.route('/patterns/analyze', methods=['GET'])
@require_auth
def analyze_patterns(user_id):
    db = get_db()
    pattern_type = request.args.get('type', 'productivity')
    period = request.args.get('period', 'weekly')
    
    patterns = db.execute('''
        SELECT * FROM user_patterns
        WHERE user_id = %s
        AND pattern_type = %s
        AND period = %s
        ORDER BY start_date DESC
        LIMIT 1
    ''', (user_id, pattern_type, period)).fetchone()
    
    if not patterns:
        patterns = analyze_and_store_patterns(db, user_id, pattern_type, period)
    
    return jsonify(patterns)

@ai_automation_bp.route('/insights', methods=['GET'])
@require_auth
def get_insights(user_id):
    db = get_db()
    
    insights = db.execute('''
        SELECT * FROM productivity_insights
        WHERE user_id = %s
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY created_at DESC
    ''', (user_id,)).fetchall()
    
    return jsonify(insights)

# Helper functions
def analyze_user_patterns(db, user_id):
    """Analyze user's behavioral patterns"""
    # Get relevant data
    activities = db.execute('''
        SELECT * FROM time_entries
        WHERE user_id = %s
        AND start_time >= CURRENT_DATE - INTERVAL '30 days'
    ''', (user_id,)).fetchall()
    
    productivity = db.execute('''
        SELECT * FROM productivity_scores
        WHERE user_id = %s
        AND date >= CURRENT_DATE - INTERVAL '30 days'
    ''', (user_id,)).fetchall()
    
    # Analyze patterns
    patterns = {
        'peak_productivity_hours': analyze_peak_hours(activities),
        'most_productive_days': analyze_productive_days(productivity),
        'common_distractions': analyze_distractions(activities),
        'successful_habits': analyze_habits(db, user_id)
    }
    
    return patterns

def generate_smart_suggestions(db, user_id, suggestion_type, patterns):
    """Generate personalized suggestions based on user patterns"""
    # Get user's learning model
    model = get_or_create_learning_model(db, user_id, suggestion_type)
    
    # Generate suggestions using the model
    suggestions = []
    if suggestion_type == 'goal':
        suggestions = generate_goal_suggestions(patterns, model)
    elif suggestion_type == 'schedule':
        suggestions = generate_schedule_suggestions(patterns, model)
    
    # Store suggestions
    for suggestion in suggestions:
        db.execute('''
            INSERT INTO smart_suggestions (user_id, suggestion_type, content, context, confidence_score, status)
            VALUES (%s, %s, %s, %s, %s, 'pending')
        ''', (user_id, suggestion_type, json.dumps(suggestion['content']),
              json.dumps(suggestion['context']), suggestion['confidence']))
    
    db.commit()
    return suggestions

def calculate_burnout_metrics(db, user_id, date):
    """Calculate burnout risk metrics"""
    # Collect relevant data
    work_hours = db.execute('''
        SELECT SUM(EXTRACT(EPOCH FROM duration)/3600) as hours
        FROM time_entries
        WHERE user_id = %s
        AND start_time::date = %s
    ''', (user_id, date)).fetchone()['hours'] or 0
    
    breaks = db.execute('''
        SELECT COUNT(*) FROM time_entries
        WHERE user_id = %s
        AND start_time::date = %s
        AND category = 'break'
    ''', (user_id, date)).fetchone()['count']
    
    stress_indicators = calculate_stress_indicators(db, user_id, date)
    
    # Calculate risk score
    risk_score = calculate_risk_score(work_hours, breaks, stress_indicators)
    
    # Generate recommendations
    recommendations = generate_burnout_recommendations(risk_score, stress_indicators)
    
    # Store metrics
    db.execute('''
        INSERT INTO burnout_metrics (user_id, date, metrics, risk_score, warning_signs, recommendations)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (user_id, date, json.dumps({'work_hours': work_hours, 'breaks': breaks, 'stress_indicators': stress_indicators}),
          risk_score, stress_indicators['warnings'], json.dumps(recommendations)))
    
    db.commit()
    return {
        'date': date,
        'risk_score': risk_score,
        'metrics': {'work_hours': work_hours, 'breaks': breaks, 'stress_indicators': stress_indicators},
        'recommendations': recommendations
    }

def calculate_task_priorities(db, user_id, tasks, context):
    """Calculate task priorities using ML model"""
    # Get or create priority model
    model = get_or_create_learning_model(db, user_id, 'task_priority')
    
    # Prepare task features
    task_features = prepare_task_features(tasks, context)
    
    # Calculate priorities
    priorities = []
    for task, features in zip(tasks, task_features):
        priority = predict_task_priority(model, features)
        
        # Store priority
        db.execute('''
            INSERT INTO task_priorities (user_id, task_id, original_priority,
                                       calculated_priority, priority_factors, valid_until)
            VALUES (%s, %s, %s, %s, %s, NOW() + INTERVAL '1 day')
        ''', (user_id, task['id'], task.get('priority'), priority,
              json.dumps({'features': features, 'context': context})))
        
        priorities.append({
            'task_id': task['id'],
            'priority': priority,
            'factors': features
        })
    
    db.commit()
    return priorities

def analyze_and_store_patterns(db, user_id, pattern_type, period):
    """Analyze and store user behavior patterns"""
    # Get relevant data based on pattern type
    data = get_pattern_data(db, user_id, pattern_type, period)
    
    # Analyze patterns
    analysis = analyze_pattern_data(data, pattern_type)
    
    # Calculate date range
    end_date = datetime.now()
    if period == 'daily':
        start_date = end_date - timedelta(days=1)
    elif period == 'weekly':
        start_date = end_date - timedelta(days=7)
    else:
        start_date = end_date - timedelta(days=30)
    
    # Store patterns
    db.execute('''
        INSERT INTO user_patterns (user_id, pattern_type, data, analysis, period, start_date, end_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    ''', (user_id, pattern_type, json.dumps(data), json.dumps(analysis),
          period, start_date, end_date))
    
    db.commit()
    return {
        'pattern_type': pattern_type,
        'period': period,
        'data': data,
        'analysis': analysis,
        'start_date': start_date,
        'end_date': end_date
    }

def get_or_create_learning_model(db, user_id, model_type):
    """Get or create a learning model for the user"""
    model = db.execute('''
        SELECT * FROM learning_models
        WHERE user_id = %s AND model_type = %s
    ''', (user_id, model_type)).fetchone()
    
    if not model:
        # Initialize new model
        model_data = initialize_learning_model(model_type)
        
        db.execute('''
            INSERT INTO learning_models (user_id, model_type, model_data, last_trained)
            VALUES (%s, %s, %s, NOW())
        ''', (user_id, model_type, json.dumps(model_data)))
        db.commit()
        
        model = {
            'model_type': model_type,
            'model_data': model_data,
            'version': 1
        }
    
    return model

def initialize_learning_model(model_type):
    """Initialize a new learning model"""
    if model_type == 'task_priority':
        return {
            'model': RandomForestRegressor(n_estimators=100),
            'features': ['urgency', 'importance', 'difficulty', 'time_required'],
            'weights': [0.3, 0.3, 0.2, 0.2]
        }
    # Add other model types as needed
    return {} 