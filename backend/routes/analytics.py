from flask import Blueprint, request, jsonify, send_file
from datetime import datetime, timedelta
import json
import pandas as pd
import io
from ..db import get_db
from ..auth import require_auth

analytics_bp = Blueprint('analytics', __name__)

# Time Tracking
@analytics_bp.route('/time/entries', methods=['GET', 'POST'])
@require_auth
def time_entries(user_id):
    db = get_db()
    
    if request.method == 'GET':
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        entries = db.execute('''
            SELECT * FROM time_entries
            WHERE user_id = %s
            AND start_time::date BETWEEN %s AND %s
            ORDER BY start_time DESC
        ''', (user_id, start_date, end_date)).fetchall()
        return jsonify(entries)
    
    data = request.json
    db.execute('''
        INSERT INTO time_entries (user_id, activity_type, category, start_time, end_time, duration, notes, tags)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    ''', (user_id, data['activity_type'], data['category'], data['start_time'],
          data.get('end_time'), data.get('duration'), data.get('notes'), data.get('tags')))
    db.commit()
    return jsonify({'message': 'Time entry created successfully'})

# Productivity Analysis
@analytics_bp.route('/productivity/score', methods=['GET'])
@require_auth
def productivity_score(user_id):
    db = get_db()
    date = request.args.get('date', datetime.now().date().isoformat())
    
    score = db.execute('''
        SELECT * FROM productivity_scores
        WHERE user_id = %s AND date = %s
    ''', (user_id, date)).fetchone()
    
    if not score:
        # Calculate productivity score based on various factors
        factors = calculate_productivity_factors(db, user_id, date)
        score_value = calculate_score_from_factors(factors)
        
        db.execute('''
            INSERT INTO productivity_scores (user_id, date, score, factors)
            VALUES (%s, %s, %s, %s)
        ''', (user_id, date, score_value, json.dumps(factors)))
        db.commit()
        
        score = {
            'date': date,
            'score': score_value,
            'factors': factors
        }
    
    return jsonify(score)

@analytics_bp.route('/productivity/trends', methods=['GET'])
@require_auth
def productivity_trends(user_id):
    db = get_db()
    period = request.args.get('period', '30')  # days
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=int(period))
    
    trends = db.execute('''
        SELECT date, score, factors
        FROM productivity_scores
        WHERE user_id = %s AND date BETWEEN %s AND %s
        ORDER BY date
    ''', (user_id, start_date, end_date)).fetchall()
    
    return jsonify({
        'trends': trends,
        'analysis': analyze_productivity_trends(trends)
    })

# Habit Analytics
@analytics_bp.route('/habits/streaks', methods=['GET'])
@require_auth
def habit_streaks(user_id):
    db = get_db()
    
    streaks = db.execute('''
        SELECT h.name, hs.*
        FROM habit_streaks hs
        JOIN habits h ON hs.habit_id = h.id
        WHERE hs.user_id = %s AND (hs.end_date IS NULL OR hs.end_date >= CURRENT_DATE - INTERVAL '30 days')
        ORDER BY hs.current_streak DESC
    ''', (user_id,)).fetchall()
    return jsonify(streaks)

@analytics_bp.route('/habits/patterns', methods=['GET'])
@require_auth
def habit_patterns(user_id):
    db = get_db()
    pattern_type = request.args.get('type', 'weekly')
    
    patterns = db.execute('''
        SELECT * FROM habit_patterns
        WHERE user_id = %s AND pattern_type = %s
        ORDER BY analysis_date DESC
        LIMIT 1
    ''', (user_id, pattern_type)).fetchone()
    
    if not patterns:
        patterns = analyze_habit_patterns(db, user_id, pattern_type)
        
    return jsonify(patterns)

# Custom Dashboards
@analytics_bp.route('/dashboards', methods=['GET', 'POST'])
@require_auth
def manage_dashboards(user_id):
    db = get_db()
    
    if request.method == 'GET':
        dashboards = db.execute('''
            SELECT d.*, 
                   (SELECT json_agg(w.*) FROM dashboard_widgets w WHERE w.dashboard_id = d.id) as widgets
            FROM custom_dashboards d
            WHERE d.user_id = %s
            ORDER BY d.is_default DESC, d.created_at
        ''', (user_id,)).fetchall()
        return jsonify(dashboards)
    
    data = request.json
    dashboard_id = db.execute('''
        INSERT INTO custom_dashboards (user_id, name, layout, is_default)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['name'], json.dumps(data['layout']), data.get('is_default', False))).fetchone()['id']
    
    # Add widgets
    for widget in data.get('widgets', []):
        db.execute('''
            INSERT INTO dashboard_widgets (dashboard_id, widget_type, title, config, position)
            VALUES (%s, %s, %s, %s, %s)
        ''', (dashboard_id, widget['type'], widget['title'], json.dumps(widget['config']), json.dumps(widget['position'])))
    
    db.commit()
    return jsonify({'message': 'Dashboard created successfully', 'dashboard_id': dashboard_id})

# Export functionality
@analytics_bp.route('/export', methods=['GET'])
@require_auth
def export_data(user_id):
    db = get_db()
    export_type = request.args.get('type', 'productivity')
    format = request.args.get('format', 'csv')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Get data based on export type
    if export_type == 'productivity':
        data = db.execute('''
            SELECT date, score, factors
            FROM productivity_scores
            WHERE user_id = %s AND date BETWEEN %s AND %s
            ORDER BY date
        ''', (user_id, start_date, end_date)).fetchall()
    elif export_type == 'time':
        data = db.execute('''
            SELECT activity_type, category, start_time, end_time, duration, notes, tags
            FROM time_entries
            WHERE user_id = %s AND start_time::date BETWEEN %s AND %s
            ORDER BY start_time
        ''', (user_id, start_date, end_date)).fetchall()
    else:
        return jsonify({'error': 'Invalid export type'}), 400
    
    # Convert to DataFrame for easy export
    df = pd.DataFrame(data)
    
    # Export in requested format
    if format == 'csv':
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'{export_type}_export_{start_date}_to_{end_date}.csv'
        )
    elif format == 'json':
        return jsonify(data)
    else:
        return jsonify({'error': 'Invalid export format'}), 400

def calculate_productivity_factors(db, user_id, date):
    """Calculate productivity factors based on various metrics"""
    # Get completed tasks
    completed_tasks = db.execute('''
        SELECT COUNT(*) FROM user_challenges
        WHERE user_id = %s AND status = 'completed'
        AND created_at::date = %s
    ''', (user_id, date)).fetchone()['count']
    
    # Get time tracked
    time_tracked = db.execute('''
        SELECT SUM(EXTRACT(EPOCH FROM duration)/3600) as hours
        FROM time_entries
        WHERE user_id = %s AND start_time::date = %s
    ''', (user_id, date)).fetchone()['hours'] or 0
    
    # Get habit completions
    habits_completed = db.execute('''
        SELECT COUNT(*) FROM habit_streaks
        WHERE user_id = %s AND start_date <= %s
        AND (end_date IS NULL OR end_date >= %s)
    ''', (user_id, date, date)).fetchone()['count']
    
    return {
        'completed_tasks': completed_tasks,
        'time_tracked_hours': time_tracked,
        'habits_completed': habits_completed
    }

def calculate_score_from_factors(factors):
    """Calculate a productivity score from 0-100 based on factors"""
    score = 0
    weights = {
        'completed_tasks': 40,
        'time_tracked_hours': 30,
        'habits_completed': 30
    }
    
    if factors['completed_tasks'] > 0:
        score += min(factors['completed_tasks'] * 10, weights['completed_tasks'])
    
    if factors['time_tracked_hours'] > 0:
        score += min(factors['time_tracked_hours'] * 7.5, weights['time_tracked_hours'])
    
    if factors['habits_completed'] > 0:
        score += min(factors['habits_completed'] * 10, weights['habits_completed'])
    
    return min(score, 100)

def analyze_productivity_trends(trends):
    """Analyze productivity trends and provide insights"""
    if not trends:
        return []
    
    insights = []
    scores = [t['score'] for t in trends]
    avg_score = sum(scores) / len(scores)
    
    if len(scores) > 1:
        trend = scores[-1] - scores[0]
        if trend > 5:
            insights.append("Your productivity is trending upward!")
        elif trend < -5:
            insights.append("Your productivity has been declining recently.")
    
    if avg_score > 80:
        insights.append("Excellent productivity level maintained!")
    elif avg_score < 50:
        insights.append("There's room for improvement in your productivity.")
    
    return insights

def analyze_habit_patterns(db, user_id, pattern_type):
    """Analyze habit patterns and generate insights"""
    # Implementation would analyze habit completion patterns
    # and generate meaningful insights about timing, frequency, etc.
    pass 