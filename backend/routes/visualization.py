from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from ..db import get_db
from ..auth import require_auth
import numpy as np
from scipy import stats

visualization_bp = Blueprint('visualization', __name__)

# Productivity Heatmaps
@visualization_bp.route('/heatmaps', methods=['GET'])
@require_auth
def get_productivity_heatmap(user_id):
    db = get_db()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date', datetime.now().date().isoformat())
    
    heatmaps = db.execute('''
        SELECT * FROM productivity_heatmaps
        WHERE user_id = %s
        AND date BETWEEN %s AND %s
        ORDER BY date
    ''', (user_id, start_date, end_date)).fetchall()
    
    if not heatmaps:
        # Generate heatmap data if it doesn't exist
        heatmaps = generate_productivity_heatmap(db, user_id, start_date, end_date)
    
    return jsonify(heatmaps)

# Visualization Widgets
@visualization_bp.route('/widgets', methods=['GET', 'POST'])
@require_auth
def manage_widgets(user_id):
    db = get_db()
    
    if request.method == 'GET':
        widgets = db.execute('''
            SELECT * FROM visualization_widgets
            WHERE user_id = %s
            ORDER BY created_at
        ''', (user_id,)).fetchall()
        return jsonify(widgets)
    
    data = request.json
    widget_id = db.execute('''
        INSERT INTO visualization_widgets (
            user_id, widget_type, title, description,
            config, data_source, refresh_interval,
            position, size
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['widget_type'], data['title'],
          data.get('description'), json.dumps(data['config']),
          json.dumps(data['data_source']),
          data.get('refresh_interval'),
          json.dumps(data.get('position', {})),
          json.dumps(data.get('size', {})))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': widget_id, 'message': 'Widget created successfully'})

@visualization_bp.route('/widgets/<widget_id>', methods=['PUT', 'DELETE'])
@require_auth
def update_widget(user_id, widget_id):
    db = get_db()
    
    if request.method == 'DELETE':
        db.execute('''
            DELETE FROM visualization_widgets
            WHERE id = %s AND user_id = %s
        ''', (widget_id, user_id))
        db.commit()
        return jsonify({'message': 'Widget deleted successfully'})
    
    data = request.json
    db.execute('''
        UPDATE visualization_widgets
        SET title = %s,
            description = %s,
            config = %s,
            data_source = %s,
            refresh_interval = %s,
            position = %s,
            size = %s,
            updated_at = NOW()
        WHERE id = %s AND user_id = %s
    ''', (data['title'], data.get('description'),
          json.dumps(data['config']),
          json.dumps(data['data_source']),
          data.get('refresh_interval'),
          json.dumps(data.get('position', {})),
          json.dumps(data.get('size', {})),
          widget_id, user_id))
    
    db.commit()
    return jsonify({'message': 'Widget updated successfully'})

# Progress Timelines
@visualization_bp.route('/timelines', methods=['GET', 'POST'])
@require_auth
def manage_timelines(user_id):
    db = get_db()
    
    if request.method == 'GET':
        timeline_type = request.args.get('type')
        query = '''
            SELECT * FROM progress_timelines
            WHERE user_id = %s
        '''
        params = [user_id]
        
        if timeline_type:
            query += ' AND timeline_type = %s'
            params.append(timeline_type)
        
        query += ' ORDER BY start_date DESC'
        
        timelines = db.execute(query, params).fetchall()
        return jsonify(timelines)
    
    data = request.json
    timeline_id = db.execute('''
        INSERT INTO progress_timelines (
            user_id, timeline_type, start_date, end_date,
            events, milestones, metadata
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['timeline_type'], data['start_date'],
          data.get('end_date'), json.dumps(data['events']),
          json.dumps(data.get('milestones', [])),
          json.dumps(data.get('metadata', {})))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': timeline_id, 'message': 'Timeline created successfully'})

# Comparative Analysis
@visualization_bp.route('/analyses', methods=['GET', 'POST'])
@require_auth
def manage_analyses(user_id):
    db = get_db()
    
    if request.method == 'GET':
        analysis_type = request.args.get('type')
        analyses = db.execute('''
            SELECT * FROM comparative_analyses
            WHERE user_id = %s
            AND analysis_type = COALESCE(%s, analysis_type)
            ORDER BY created_at DESC
        ''', (user_id, analysis_type)).fetchall()
        return jsonify(analyses)
    
    data = request.json
    analysis_id = db.execute('''
        INSERT INTO comparative_analyses (
            user_id, analysis_type, period_start, period_end,
            comparison_data, metrics, insights
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['analysis_type'], data['period_start'],
          data['period_end'], json.dumps(data['comparison_data']),
          json.dumps(data['metrics']),
          data.get('insights', []))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': analysis_id, 'message': 'Analysis created successfully'})

# Habit Correlation Matrix
@visualization_bp.route('/correlations', methods=['GET'])
@require_auth
def get_habit_correlations(user_id):
    db = get_db()
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date', datetime.now().isoformat())
    
    # Get existing correlations or calculate new ones
    correlations = db.execute('''
        SELECT * FROM habit_correlations
        WHERE user_id = %s
        AND analysis_period @> %s::timestamp
        AND analysis_period @> %s::timestamp
    ''', (user_id, start_date, end_date)).fetchall()
    
    if not correlations:
        correlations = calculate_habit_correlations(db, user_id, start_date, end_date)
    
    return jsonify(correlations)

# Real-time Metrics
@visualization_bp.route('/metrics/real-time', methods=['GET'])
@require_auth
def get_real_time_metrics(user_id):
    db = get_db()
    metric_types = request.args.get('types', '').split(',')
    
    if not metric_types or metric_types == ['']:
        metrics = db.execute('''
            SELECT * FROM real_time_metrics
            WHERE user_id = %s
            AND last_updated >= NOW() - update_frequency
        ''', (user_id,)).fetchall()
    else:
        metrics = db.execute('''
            SELECT * FROM real_time_metrics
            WHERE user_id = %s
            AND metric_type = ANY(%s)
            AND last_updated >= NOW() - update_frequency
        ''', (user_id, metric_types)).fetchall()
    
    # Update metrics if needed
    for metric in metrics:
        if datetime.now() - metric['last_updated'] > metric['update_frequency']:
            update_real_time_metric(db, user_id, metric['metric_type'])
    
    return jsonify(metrics)

# Helper Functions
def generate_productivity_heatmap(db, user_id, start_date, end_date):
    """Generate productivity heatmap data for the specified period"""
    heatmaps = []
    current_date = datetime.strptime(start_date, '%Y-%m-%d').date()
    end = datetime.strptime(end_date, '%Y-%m-%d').date()
    
    while current_date <= end:
        # Get productivity data for each hour
        hour_data = {}
        for hour in range(24):
            start_time = datetime.combine(current_date, time(hour=hour))
            end_time = start_time + timedelta(hours=1)
            
            # Get productivity score for this hour
            score = calculate_hourly_productivity(db, user_id, start_time, end_time)
            hour_data[str(hour)] = score
        
        # Calculate daily metrics
        metrics = {
            'average_score': sum(hour_data.values()) / 24,
            'peak_hours': [h for h, s in hour_data.items() if s >= 0.8],
            'low_hours': [h for h, s in hour_data.items() if s <= 0.2]
        }
        
        # Store heatmap data
        db.execute('''
            INSERT INTO productivity_heatmaps (
                user_id, date, hour_data, metrics, tags
            )
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (user_id, date) DO UPDATE
            SET hour_data = EXCLUDED.hour_data,
                metrics = EXCLUDED.metrics
        ''', (user_id, current_date, json.dumps(hour_data),
              json.dumps(metrics), []))
        
        heatmaps.append({
            'date': current_date.isoformat(),
            'hour_data': hour_data,
            'metrics': metrics
        })
        
        current_date += timedelta(days=1)
    
    db.commit()
    return heatmaps

def calculate_hourly_productivity(db, user_id, start_time, end_time):
    """Calculate productivity score for a specific hour"""
    # Get completed tasks
    tasks = db.execute('''
        SELECT COUNT(*) as completed
        FROM time_entries
        WHERE user_id = %s
        AND start_time BETWEEN %s AND %s
        AND end_time IS NOT NULL
    ''', (user_id, start_time, end_time)).fetchone()
    
    # Get focus time
    focus = db.execute('''
        SELECT COALESCE(SUM(EXTRACT(EPOCH FROM duration)/3600), 0) as focus_hours
        FROM time_entries
        WHERE user_id = %s
        AND start_time BETWEEN %s AND %s
        AND category = 'focus'
    ''', (user_id, start_time, end_time)).fetchone()
    
    # Calculate score (simplified version)
    task_score = min(tasks['completed'] * 0.2, 0.5)  # Up to 0.5 for tasks
    focus_score = min(focus['focus_hours'] * 0.5, 0.5)  # Up to 0.5 for focus time
    
    return task_score + focus_score

def calculate_habit_correlations(db, user_id, start_date, end_date):
    """Calculate correlations between different habits"""
    # Get all habits
    habits = db.execute('''
        SELECT id, name FROM habits
        WHERE user_id = %s
    ''', (user_id,)).fetchall()
    
    correlations = []
    for i, habit1 in enumerate(habits):
        for habit2 in habits[i+1:]:
            # Get completion data for both habits
            data1 = get_habit_completion_data(db, user_id, habit1['id'], start_date, end_date)
            data2 = get_habit_completion_data(db, user_id, habit2['id'], start_date, end_date)
            
            if len(data1) > 1 and len(data2) > 1:
                # Calculate correlation
                correlation, p_value = stats.pearsonr(data1, data2)
                confidence = 1 - p_value
                
                # Store correlation
                correlation_id = db.execute('''
                    INSERT INTO habit_correlations (
                        user_id, habit_pairs, correlation_score,
                        confidence_score, supporting_data, analysis_period
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                ''', (user_id,
                      json.dumps({'habit1': habit1['id'], 'habit2': habit2['id']}),
                      correlation, confidence,
                      json.dumps({'n_days': len(data1), 'p_value': p_value}),
                      f'[{start_date},{end_date}]')).fetchone()['id']
                
                correlations.append({
                    'id': correlation_id,
                    'habit1': habit1['name'],
                    'habit2': habit2['name'],
                    'correlation': correlation,
                    'confidence': confidence
                })
    
    db.commit()
    return correlations

def get_habit_completion_data(db, user_id, habit_id, start_date, end_date):
    """Get daily completion data for a habit"""
    return db.execute('''
        SELECT CASE WHEN completed THEN 1 ELSE 0 END as value
        FROM habit_tracking
        WHERE user_id = %s
        AND habit_id = %s
        AND date BETWEEN %s AND %s
        ORDER BY date
    ''', (user_id, habit_id, start_date, end_date)).fetchall()

def update_real_time_metric(db, user_id, metric_type):
    """Update a real-time metric"""
    now = datetime.now()
    
    # Calculate new value based on metric type
    if metric_type == 'productivity':
        value = calculate_current_productivity(db, user_id)
    elif metric_type == 'focus':
        value = calculate_current_focus(db, user_id)
    elif metric_type == 'energy':
        value = get_current_energy(db, user_id)
    else:
        value = None
    
    if value is not None:
        # Update metric
        db.execute('''
            UPDATE real_time_metrics
            SET current_value = %s,
                historical_values = jsonb_set(
                    historical_values,
                    array[to_char(NOW(), 'YYYY-MM-DD HH24:MI')],
                    %s::jsonb
                ),
                last_updated = NOW()
            WHERE user_id = %s AND metric_type = %s
        ''', (json.dumps(value), json.dumps(value), user_id, metric_type))
        
        db.commit()

def calculate_current_productivity(db, user_id):
    """Calculate current productivity score"""
    now = datetime.now()
    hour_ago = now - timedelta(hours=1)
    
    # Get recent activity data
    activity = db.execute('''
        SELECT 
            COUNT(*) as completed_tasks,
            SUM(CASE WHEN category = 'focus' THEN 1 ELSE 0 END) as focus_sessions
        FROM time_entries
        WHERE user_id = %s
        AND start_time >= %s
        AND end_time IS NOT NULL
    ''', (user_id, hour_ago)).fetchone()
    
    return {
        'score': min((activity['completed_tasks'] * 0.2 + 
                     activity['focus_sessions'] * 0.3), 1.0),
        'factors': {
            'tasks': activity['completed_tasks'],
            'focus_sessions': activity['focus_sessions']
        }
    }

def calculate_current_focus(db, user_id):
    """Calculate current focus score"""
    now = datetime.now()
    
    # Check for active focus session
    active_session = db.execute('''
        SELECT start_time, category
        FROM time_entries
        WHERE user_id = %s
        AND end_time IS NULL
        AND category = 'focus'
        ORDER BY start_time DESC
        LIMIT 1
    ''', (user_id,)).fetchone()
    
    if active_session:
        duration = (now - active_session['start_time']).total_seconds() / 3600
        return {
            'score': min(duration * 0.5, 1.0),
            'active_session': True,
            'duration_hours': duration
        }
    
    return {
        'score': 0,
        'active_session': False
    }

def get_current_energy(db, user_id):
    """Get current energy level"""
    # Get most recent energy reading
    energy = db.execute('''
        SELECT level, factors
        FROM energy_levels
        WHERE user_id = %s
        ORDER BY timestamp DESC
        LIMIT 1
    ''', (user_id,)).fetchone()
    
    if energy:
        return {
            'level': energy['level'],
            'factors': energy['factors']
        }
    
    return None 