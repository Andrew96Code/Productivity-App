from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta, time
import json
from ..db import get_db
from ..auth import require_auth

wellness_bp = Blueprint('wellness', __name__)

# Meditation and Mindfulness
@wellness_bp.route('/meditation/sessions', methods=['GET', 'POST'])
@require_auth
def meditation_sessions(user_id):
    db = get_db()
    
    if request.method == 'GET':
        sessions = db.execute('''
            SELECT * FROM meditation_sessions
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 50
        ''', (user_id,)).fetchall()
        return jsonify(sessions)
    
    data = request.json
    db.execute('''
        INSERT INTO meditation_sessions (user_id, duration, session_type, mood_before, mood_after, notes)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (user_id, data['duration'], data['session_type'],
          data.get('mood_before'), data.get('mood_after'), data.get('notes')))
    
    # Update mindfulness stats
    update_mindfulness_stats(db, user_id)
    
    db.commit()
    return jsonify({'message': 'Meditation session recorded successfully'})

@wellness_bp.route('/meditation/stats', methods=['GET'])
@require_auth
def mindfulness_stats(user_id):
    db = get_db()
    date = request.args.get('date', datetime.now().date().isoformat())
    
    stats = db.execute('''
        SELECT * FROM mindfulness_stats
        WHERE user_id = %s AND date = %s
    ''', (user_id, date)).fetchone()
    
    if not stats:
        stats = calculate_mindfulness_stats(db, user_id, date)
    
    return jsonify(stats)

# Work-Life Balance
@wellness_bp.route('/balance', methods=['GET'])
@require_auth
def work_life_balance(user_id):
    db = get_db()
    date = request.args.get('date', datetime.now().date().isoformat())
    
    balance = db.execute('''
        SELECT * FROM work_life_balance
        WHERE user_id = %s AND date = %s
    ''', (user_id, date)).fetchone()
    
    if not balance:
        balance = calculate_work_life_balance(db, user_id, date)
    
    return jsonify(balance)

# Stress Monitoring
@wellness_bp.route('/stress', methods=['GET', 'POST'])
@require_auth
def stress_levels(user_id):
    db = get_db()
    
    if request.method == 'GET':
        period = request.args.get('period', '7')  # days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=int(period))
        
        levels = db.execute('''
            SELECT * FROM stress_levels
            WHERE user_id = %s
            AND timestamp BETWEEN %s AND %s
            ORDER BY timestamp DESC
        ''', (user_id, start_date, end_date)).fetchall()
        return jsonify(levels)
    
    data = request.json
    db.execute('''
        INSERT INTO stress_levels (user_id, timestamp, level, symptoms, triggers, notes)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (user_id, datetime.now(), data['level'],
          data.get('symptoms', []), data.get('triggers', []), data.get('notes')))
    
    db.commit()
    return jsonify({'message': 'Stress level recorded successfully'})

# Break Recommendations
@wellness_bp.route('/breaks/recommend', methods=['GET'])
@require_auth
def recommend_break(user_id):
    db = get_db()
    
    # Get user's current state
    current_state = get_user_state(db, user_id)
    
    # Generate break recommendation
    recommendation = generate_break_recommendation(current_state)
    
    # Store recommendation
    db.execute('''
        INSERT INTO break_recommendations (user_id, recommended_at, break_type, duration, reason)
        VALUES (%s, NOW(), %s, %s, %s)
        RETURNING id
    ''', (user_id, recommendation['type'], recommendation['duration'], recommendation['reason']))
    
    db.commit()
    return jsonify(recommendation)

@wellness_bp.route('/breaks/feedback', methods=['POST'])
@require_auth
def break_feedback(user_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        UPDATE break_recommendations
        SET taken = true,
            effectiveness_rating = %s
        WHERE id = %s AND user_id = %s
    ''', (data['rating'], data['recommendation_id'], user_id))
    
    db.commit()
    return jsonify({'message': 'Break feedback recorded successfully'})

# Sleep Tracking
@wellness_bp.route('/sleep', methods=['GET', 'POST'])
@require_auth
def sleep_tracking(user_id):
    db = get_db()
    
    if request.method == 'GET':
        date = request.args.get('date', datetime.now().date().isoformat())
        
        sleep = db.execute('''
            SELECT * FROM sleep_tracking
            WHERE user_id = %s AND date = %s
        ''', (user_id, date)).fetchone()
        return jsonify(sleep)
    
    data = request.json
    db.execute('''
        INSERT INTO sleep_tracking (
            user_id, date, bedtime, wake_time, duration,
            quality_rating, disruptions, factors, notes
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (user_id, date) DO UPDATE
        SET bedtime = EXCLUDED.bedtime,
            wake_time = EXCLUDED.wake_time,
            duration = EXCLUDED.duration,
            quality_rating = EXCLUDED.quality_rating,
            disruptions = EXCLUDED.disruptions,
            factors = EXCLUDED.factors,
            notes = EXCLUDED.notes
    ''', (user_id, data['date'], data['bedtime'], data['wake_time'],
          data['duration'], data['quality_rating'], data.get('disruptions', []),
          json.dumps(data.get('factors', {})), data.get('notes')))
    
    db.commit()
    return jsonify({'message': 'Sleep data recorded successfully'})

# Energy Level Tracking
@wellness_bp.route('/energy', methods=['GET', 'POST'])
@require_auth
def energy_levels(user_id):
    db = get_db()
    
    if request.method == 'GET':
        period = request.args.get('period', '7')  # days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=int(period))
        
        levels = db.execute('''
            SELECT * FROM energy_levels
            WHERE user_id = %s
            AND timestamp BETWEEN %s AND %s
            ORDER BY timestamp DESC
        ''', (user_id, start_date, end_date)).fetchall()
        return jsonify(levels)
    
    data = request.json
    db.execute('''
        INSERT INTO energy_levels (user_id, timestamp, level, factors, activities_impact, notes)
        VALUES (%s, NOW(), %s, %s, %s, %s)
    ''', (user_id, data['level'], json.dumps(data.get('factors', {})),
          json.dumps(data.get('activities_impact', {})), data.get('notes')))
    
    db.commit()
    return jsonify({'message': 'Energy level recorded successfully'})

# Wellness Insights and Goals
@wellness_bp.route('/insights', methods=['GET'])
@require_auth
def wellness_insights(user_id):
    db = get_db()
    category = request.args.get('category')
    
    query = '''
        SELECT * FROM wellness_insights
        WHERE user_id = %s
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    '''
    params = [user_id]
    
    if category:
        query += ' AND category = %s'
        params.append(category)
    
    query += ' ORDER BY date DESC, priority ASC'
    
    insights = db.execute(query, params).fetchall()
    return jsonify(insights)

@wellness_bp.route('/goals', methods=['GET', 'POST'])
@require_auth
def wellness_goals(user_id):
    db = get_db()
    
    if request.method == 'GET':
        goals = db.execute('''
            SELECT * FROM wellness_goals
            WHERE user_id = %s
            AND status = 'active'
            ORDER BY created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(goals)
    
    data = request.json
    db.execute('''
        INSERT INTO wellness_goals (
            user_id, category, target, progress,
            start_date, end_date, status
        )
        VALUES (%s, %s, %s, %s, %s, %s, 'active')
    ''', (user_id, data['category'], json.dumps(data['target']),
          json.dumps({'current': 0}), data['start_date'], data.get('end_date')))
    
    db.commit()
    return jsonify({'message': 'Wellness goal created successfully'})

# Helper functions
def update_mindfulness_stats(db, user_id):
    """Update mindfulness statistics after a new session"""
    today = datetime.now().date()
    
    # Get today's total minutes and sessions
    stats = db.execute('''
        SELECT COALESCE(SUM(EXTRACT(EPOCH FROM duration)/60), 0) as total_minutes,
               COUNT(*) as sessions
        FROM meditation_sessions
        WHERE user_id = %s
        AND created_at::date = CURRENT_DATE
    ''', (user_id,)).fetchone()
    
    # Calculate streak
    streak = calculate_meditation_streak(db, user_id)
    
    # Update stats
    db.execute('''
        INSERT INTO mindfulness_stats (
            user_id, date, total_minutes, sessions_completed,
            streak_days, focus_score
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (user_id, date) DO UPDATE
        SET total_minutes = EXCLUDED.total_minutes,
            sessions_completed = EXCLUDED.sessions_completed,
            streak_days = EXCLUDED.streak_days
    ''', (user_id, today, stats['total_minutes'], stats['sessions'],
          streak, calculate_focus_score(stats['total_minutes'], streak)))

def calculate_work_life_balance(db, user_id, date):
    """Calculate work-life balance score and metrics"""
    # Get work hours
    work_hours = db.execute('''
        SELECT COALESCE(SUM(EXTRACT(EPOCH FROM duration)/3600), 0) as hours
        FROM time_entries
        WHERE user_id = %s
        AND start_time::date = %s
        AND category = 'work'
    ''', (user_id, date)).fetchone()['hours']
    
    # Get personal activities
    personal = db.execute('''
        SELECT 
            COALESCE(SUM(CASE WHEN category = 'exercise' 
                THEN EXTRACT(EPOCH FROM duration)/60 ELSE 0 END), 0) as exercise_minutes,
            COALESCE(SUM(CASE WHEN category != 'work' AND category != 'exercise'
                THEN EXTRACT(EPOCH FROM duration)/3600 ELSE 0 END), 0) as personal_hours,
            array_agg(DISTINCT CASE WHEN category != 'work' THEN category END) as activities
        FROM time_entries
        WHERE user_id = %s
        AND start_time::date = %s
    ''', (user_id, date)).fetchone()
    
    # Calculate balance score
    factors = {
        'work_hours': work_hours,
        'personal_hours': personal['personal_hours'],
        'exercise_minutes': personal['exercise_minutes'],
        'activity_variety': len([a for a in personal['activities'] if a is not None])
    }
    
    balance_score = calculate_balance_score(factors)
    recommendations = generate_balance_recommendations(factors)
    
    # Store results
    db.execute('''
        INSERT INTO work_life_balance (
            user_id, date, work_hours, personal_hours,
            exercise_minutes, leisure_activities,
            balance_score, factors, recommendations
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', (user_id, date, work_hours, personal['personal_hours'],
          personal['exercise_minutes'], personal['activities'],
          balance_score, json.dumps(factors), json.dumps(recommendations)))
    
    db.commit()
    return {
        'date': date,
        'balance_score': balance_score,
        'factors': factors,
        'recommendations': recommendations
    }

def get_user_state(db, user_id):
    """Get user's current state for break recommendations"""
    now = datetime.now()
    
    # Get recent activity
    activity = db.execute('''
        SELECT * FROM time_entries
        WHERE user_id = %s
        AND end_time IS NULL
        ORDER BY start_time DESC
        LIMIT 1
    ''', (user_id,)).fetchone()
    
    # Get recent breaks
    last_break = db.execute('''
        SELECT * FROM break_recommendations
        WHERE user_id = %s
        AND taken = true
        ORDER BY recommended_at DESC
        LIMIT 1
    ''', (user_id,)).fetchone()
    
    # Get current stress level
    stress = db.execute('''
        SELECT * FROM stress_levels
        WHERE user_id = %s
        AND timestamp >= NOW() - INTERVAL '1 hour'
        ORDER BY timestamp DESC
        LIMIT 1
    ''', (user_id,)).fetchone()
    
    return {
        'current_activity': activity,
        'last_break': last_break,
        'current_stress': stress,
        'time_since_break': (now - last_break['recommended_at']) if last_break else None
    }

def generate_break_recommendation(state):
    """Generate a break recommendation based on user's state"""
    now = datetime.now()
    
    if not state['last_break'] or \
       (now - state['last_break']['recommended_at']).total_seconds() > 7200:  # 2 hours
        return {
            'type': 'long',
            'duration': timedelta(minutes=15),
            'reason': 'You have been working for a long time'
        }
    
    if state['current_stress'] and state['current_stress']['level'] >= 4:
        return {
            'type': 'meditation',
            'duration': timedelta(minutes=10),
            'reason': 'High stress levels detected'
        }
    
    return {
        'type': 'micro',
        'duration': timedelta(minutes=5),
        'reason': 'Regular break to maintain productivity'
    }

def calculate_focus_score(minutes, streak):
    """Calculate focus score based on meditation minutes and streak"""
    base_score = min(minutes / 30 * 50, 50)  # Up to 50 points for duration
    streak_score = min(streak * 5, 50)  # Up to 50 points for streak
    return base_score + streak_score

def calculate_balance_score(factors):
    """Calculate work-life balance score"""
    score = 100
    
    # Deduct points for too much or too little work
    if factors['work_hours'] > 9:
        score -= (factors['work_hours'] - 9) * 10
    elif factors['work_hours'] < 4:
        score -= (4 - factors['work_hours']) * 10
    
    # Add points for exercise
    score += min(factors['exercise_minutes'] / 30 * 10, 20)
    
    # Add points for activity variety
    score += min(factors['activity_variety'] * 5, 20)
    
    return max(min(score, 100), 0)  # Ensure score is between 0 and 100 