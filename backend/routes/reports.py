from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from ..db import get_db
from ..auth import require_auth

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/reports/<report_type>', methods=['GET'])
@require_auth
def get_report(user_id, report_type):
    db = get_db()
    
    # Calculate date range
    end_date = datetime.now().date()
    if report_type == 'weekly':
        start_date = end_date - timedelta(days=7)
    else:  # monthly
        start_date = end_date - timedelta(days=30)
    
    # Get or generate report
    report = db.execute('''
        SELECT * FROM user_reports
        WHERE user_id = %s AND report_type = %s AND start_date = %s
    ''', (user_id, report_type, start_date)).fetchone()
    
    if report:
        return jsonify(report)
    
    # Generate new report
    metrics = generate_metrics(db, user_id, start_date, end_date)
    insights = generate_insights(metrics)
    
    db.execute('''
        INSERT INTO user_reports (user_id, report_type, start_date, end_date, metrics, insights)
        VALUES (%s, %s, %s, %s, %s, %s)
    ''', (user_id, report_type, start_date, end_date, json.dumps(metrics), json.dumps(insights)))
    db.commit()
    
    return jsonify({
        'start_date': start_date,
        'end_date': end_date,
        'metrics': metrics,
        'insights': insights
    })

@reports_bp.route('/recommendations', methods=['GET'])
@require_auth
def get_recommendations(user_id):
    db = get_db()
    recommendations = db.execute('''
        SELECT * FROM ai_recommendations
        WHERE user_id = %s AND created_at >= NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
    ''', (user_id,)).fetchall()
    return jsonify(recommendations)

def generate_metrics(db, user_id, start_date, end_date):
    # Collect various metrics
    points = db.execute('''
        SELECT SUM(points) as total_points
        FROM points_log
        WHERE user_id = %s AND created_at::date BETWEEN %s AND %s
    ''', (user_id, start_date, end_date)).fetchone()['total_points'] or 0
    
    completed_challenges = db.execute('''
        SELECT COUNT(*) as count
        FROM user_challenges
        WHERE user_id = %s AND status = 'completed'
        AND created_at::date BETWEEN %s AND %s
    ''', (user_id, start_date, end_date)).fetchone()['count']
    
    # Add more metrics as needed
    return {
        'points_earned': points,
        'challenges_completed': completed_challenges,
        # Add more metrics
    }

def generate_insights(metrics):
    insights = []
    
    if metrics['points_earned'] > 1000:
        insights.append({
            'type': 'achievement',
            'message': 'Great job! You earned over 1000 points in this period.'
        })
    
    if metrics['challenges_completed'] > 5:
        insights.append({
            'type': 'progress',
            'message': f"You've completed {metrics['challenges_completed']} challenges!"
        })
    
    return insights 