from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from ..db import get_db
from ..auth import require_auth
import numpy as np
from transformers import pipeline
import speech_recognition as sr
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pandas as pd

advanced_ai_bp = Blueprint('advanced_ai', __name__)

# Voice Command Processing
@advanced_ai_bp.route('/voice/command', methods=['POST'])
@require_auth
def process_voice_command(user_id):
    db = get_db()
    audio_data = request.files['audio']
    
    # Process voice command
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_data) as source:
        audio = recognizer.record(source)
        try:
            command_text = recognizer.recognize_google(audio)
        except sr.UnknownValueError:
            return jsonify({'error': 'Could not understand audio'}), 400
    
    # Process command using NLP
    processed_data = process_command_text(command_text)
    
    # Store command
    command_id = db.execute('''
        INSERT INTO voice_commands (
            user_id, command_text, command_type,
            processed_data, confidence_score,
            execution_status
        )
        VALUES (%s, %s, %s, %s, %s, 'pending')
        RETURNING id
    ''', (user_id, command_text, processed_data['type'],
          json.dumps(processed_data), processed_data['confidence'])).fetchone()['id']
    
    # Execute command
    execution_result = execute_voice_command(db, user_id, processed_data)
    
    # Update command status
    db.execute('''
        UPDATE voice_commands
        SET execution_status = %s,
            execution_result = %s
        WHERE id = %s
    ''', ('executed' if execution_result['success'] else 'failed',
          json.dumps(execution_result), command_id))
    
    db.commit()
    return jsonify(execution_result)

# Natural Language Task Processing
@advanced_ai_bp.route('/nlp/task', methods=['POST'])
@require_auth
def process_nlp_task(user_id):
    db = get_db()
    data = request.json
    input_text = data['text']
    
    # Process text using NLP pipeline
    nlp_result = analyze_task_text(input_text)
    
    # Store NLP result
    task_id = db.execute('''
        INSERT INTO nlp_task_inputs (
            user_id, input_text, parsed_intent,
            extracted_entities, confidence_scores,
            processed_result
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, input_text, nlp_result['intent'],
          json.dumps(nlp_result['entities']),
          json.dumps(nlp_result['confidence']),
          json.dumps(nlp_result['processed']))).fetchone()['id']
    
    db.commit()
    return jsonify({
        'id': task_id,
        'processed': nlp_result['processed']
    })

# Task Duration Prediction
@advanced_ai_bp.route('/predict/duration', methods=['POST'])
@require_auth
def predict_task_duration(user_id):
    db = get_db()
    data = request.json
    task_id = data['task_id']
    
    # Get task details and historical data
    task_data = get_task_prediction_data(db, user_id, task_id)
    
    # Generate prediction
    prediction = generate_duration_prediction(task_data)
    
    # Store prediction
    prediction_id = db.execute('''
        INSERT INTO task_duration_predictions (
            user_id, task_id, predicted_duration,
            prediction_factors, model_version
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, task_id, prediction['duration'],
          json.dumps(prediction['factors']),
          prediction['model_version'])).fetchone()['id']
    
    db.commit()
    return jsonify({
        'id': prediction_id,
        'predicted_duration': prediction['duration'].total_seconds() / 3600,
        'confidence': prediction['confidence']
    })

# Smart Meeting Scheduling
@advanced_ai_bp.route('/meetings/schedule', methods=['POST'])
@require_auth
def schedule_smart_meeting(user_id):
    db = get_db()
    data = request.json
    
    # Find optimal meeting slots
    slots = find_optimal_meeting_slots(db, user_id, data)
    
    # Store meeting
    meeting_id = db.execute('''
        INSERT INTO smart_meetings (
            user_id, title, description, participants,
            duration, preferred_times, constraints,
            suggested_slots, meeting_type, status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'scheduling')
        RETURNING id
    ''', (user_id, data['title'], data.get('description'),
          json.dumps(data['participants']),
          data['duration'], json.dumps(data['preferred_times']),
          json.dumps(data.get('constraints', {})),
          json.dumps(slots), data['meeting_type'])).fetchone()['id']
    
    db.commit()
    return jsonify({
        'id': meeting_id,
        'suggested_slots': slots
    })

@advanced_ai_bp.route('/meetings/<meeting_id>/confirm', methods=['POST'])
@require_auth
def confirm_meeting_slot(user_id, meeting_id):
    db = get_db()
    data = request.json
    selected_slot = data['selected_slot']
    
    # Update meeting
    db.execute('''
        UPDATE smart_meetings
        SET final_schedule = %s,
            status = 'scheduled'
        WHERE id = %s AND user_id = %s
    ''', (selected_slot, meeting_id, user_id))
    
    db.commit()
    return jsonify({'message': 'Meeting scheduled successfully'})

# Work Summaries
@advanced_ai_bp.route('/summaries/generate', methods=['POST'])
@require_auth
def generate_work_summary(user_id):
    db = get_db()
    data = request.json
    
    # Get work data for the period
    activities = get_work_activities(db, user_id, data['start'], data['end'])
    
    # Generate summary
    summary = generate_summary_content(activities)
    
    # Store summary
    summary_id = db.execute('''
        INSERT INTO work_summaries (
            user_id, summary_type, period_start,
            period_end, activities, key_achievements,
            metrics, generated_summary, tags
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['type'], data['start'],
          data['end'], json.dumps(activities),
          json.dumps(summary['achievements']),
          json.dumps(summary['metrics']),
          summary['content'],
          summary.get('tags', []))).fetchone()['id']
    
    db.commit()
    return jsonify({
        'id': summary_id,
        'summary': summary['content']
    })

# Context-Aware Productivity Tips
@advanced_ai_bp.route('/tips/context', methods=['GET'])
@require_auth
def get_context_tips(user_id):
    db = get_db()
    
    # Get user's current context
    context = analyze_user_context(db, user_id)
    
    # Generate relevant tips
    tips = generate_contextual_tips(db, user_id, context)
    
    # Store and return tips
    for tip in tips:
        db.execute('''
            INSERT INTO productivity_tips (
                user_id, context_type, trigger_conditions,
                tip_content, relevance_score, shown_at
            )
            VALUES (%s, %s, %s, %s, %s, NOW())
        ''', (user_id, tip['context_type'],
              json.dumps(tip['conditions']),
              tip['content'],
              tip['relevance']))
    
    db.commit()
    return jsonify(tips)

# AI Model Management
@advanced_ai_bp.route('/models/train', methods=['POST'])
@require_auth
def train_ai_model(user_id):
    db = get_db()
    data = request.json
    model_type = data['model_type']
    
    # Get training data
    training_data = get_training_data(db, user_id, model_type)
    
    # Train model
    model_result = train_model(model_type, training_data)
    
    # Update model config
    db.execute('''
        INSERT INTO ai_models_config (
            user_id, model_type, model_parameters,
            performance_metrics, last_trained,
            next_training_due, active_version
        )
        VALUES (%s, %s, %s, %s, NOW(), %s, %s)
        ON CONFLICT (user_id, model_type) DO UPDATE
        SET model_parameters = EXCLUDED.model_parameters,
            performance_metrics = EXCLUDED.performance_metrics,
            last_trained = EXCLUDED.last_trained,
            next_training_due = EXCLUDED.next_training_due,
            active_version = EXCLUDED.active_version
    ''', (user_id, model_type,
          json.dumps(model_result['parameters']),
          json.dumps(model_result['metrics']),
          datetime.now() + timedelta(days=7),
          model_result['version']))
    
    db.commit()
    return jsonify(model_result)

# Helper Functions
def process_command_text(command_text):
    """Process voice command text using NLP"""
    nlp = pipeline("text-classification", model="distilbert-base-uncased")
    
    # Classify command type
    command_type = classify_command_type(command_text)
    
    # Extract relevant information
    entities = extract_command_entities(command_text)
    
    return {
        'type': command_type,
        'entities': entities,
        'confidence': 0.85  # Simplified confidence score
    }

def execute_voice_command(db, user_id, processed_data):
    """Execute the processed voice command"""
    command_type = processed_data['type']
    entities = processed_data['entities']
    
    if command_type == 'task':
        return create_task_from_command(db, user_id, entities)
    elif command_type == 'reminder':
        return create_reminder_from_command(db, user_id, entities)
    elif command_type == 'note':
        return create_note_from_command(db, user_id, entities)
    elif command_type == 'schedule':
        return schedule_from_command(db, user_id, entities)
    else:
        return {'success': False, 'error': 'Unknown command type'}

def analyze_task_text(text):
    """Analyze task text using NLP"""
    nlp = pipeline("ner", model="dbmdz/bert-large-cased-finetuned-conll03-english")
    
    # Extract entities
    entities = nlp(text)
    
    # Determine intent
    intent = classify_task_intent(text)
    
    # Process extracted information
    processed = process_task_entities(entities, intent)
    
    return {
        'intent': intent,
        'entities': entities,
        'confidence': calculate_confidence(entities),
        'processed': processed
    }

def generate_duration_prediction(task_data):
    """Generate task duration prediction using ML model"""
    # Prepare features
    features = prepare_prediction_features(task_data)
    
    # Load or train model
    model = load_duration_prediction_model()
    
    # Generate prediction
    prediction = model.predict(features)[0]
    
    return {
        'duration': timedelta(hours=prediction),
        'factors': task_data['factors'],
        'confidence': calculate_prediction_confidence(model, features),
        'model_version': '1.0'
    }

def find_optimal_meeting_slots(db, user_id, meeting_data):
    """Find optimal meeting slots based on participants' schedules"""
    # Get participants' availability
    availability = get_participants_availability(db, meeting_data['participants'])
    
    # Apply constraints
    filtered_slots = apply_meeting_constraints(
        availability,
        meeting_data.get('constraints', {}),
        meeting_data['duration']
    )
    
    # Score and rank slots
    ranked_slots = rank_meeting_slots(filtered_slots, meeting_data['preferred_times'])
    
    return ranked_slots[:5]  # Return top 5 slots

def generate_summary_content(activities):
    """Generate work summary from activities"""
    # Analyze activities
    analysis = analyze_activities(activities)
    
    # Generate natural language summary
    summary = generate_nl_summary(analysis)
    
    # Extract key achievements
    achievements = extract_achievements(activities)
    
    # Calculate metrics
    metrics = calculate_summary_metrics(activities)
    
    return {
        'content': summary,
        'achievements': achievements,
        'metrics': metrics,
        'tags': generate_summary_tags(analysis)
    }

def analyze_user_context(db, user_id):
    """Analyze user's current context for productivity tips"""
    # Get recent activities
    activities = get_recent_activities(db, user_id)
    
    # Get current metrics
    metrics = get_current_metrics(db, user_id)
    
    # Analyze patterns
    patterns = analyze_activity_patterns(activities)
    
    return {
        'activities': activities,
        'metrics': metrics,
        'patterns': patterns,
        'time_of_day': datetime.now().hour
    }

def generate_contextual_tips(db, user_id, context):
    """Generate context-aware productivity tips"""
    # Analyze context
    analysis = analyze_context(context)
    
    # Generate relevant tips
    tips = []
    for issue in analysis['issues']:
        tip = generate_tip_for_issue(issue, context)
        if tip['relevance'] > 0.7:  # Only include highly relevant tips
            tips.append(tip)
    
    return tips

def train_model(model_type, training_data):
    """Train AI model with user data"""
    # Prepare data
    X_train, X_test, y_train, y_test = prepare_training_data(training_data)
    
    # Initialize model
    model = initialize_model(model_type)
    
    # Train model
    model.fit(X_train, y_train)
    
    # Evaluate performance
    metrics = evaluate_model(model, X_test, y_test)
    
    return {
        'version': generate_model_version(),
        'parameters': model.get_params(),
        'metrics': metrics
    } 