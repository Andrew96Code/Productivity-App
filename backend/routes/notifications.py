from flask import Blueprint, request, jsonify
from datetime import datetime
from ..db import get_db
from ..auth import require_auth

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
@require_auth
def get_notifications(user_id):
    db = get_db()
    notifications = db.execute('''
        SELECT *
        FROM user_notifications
        WHERE user_id = %s AND status != 'dismissed'
        ORDER BY created_at DESC
    ''', (user_id,)).fetchall()
    return jsonify(notifications)

@notifications_bp.route('/notifications/<notification_id>', methods=['PUT'])
@require_auth
def update_notification(user_id, notification_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        UPDATE user_notifications
        SET status = %s
        WHERE id = %s AND user_id = %s
    ''', (data['status'], notification_id, user_id))
    db.commit()
    
    return jsonify({'message': 'Notification updated successfully'})

@notifications_bp.route('/notifications/settings', methods=['GET', 'PUT'])
@require_auth
def notification_settings(user_id):
    db = get_db()
    
    if request.method == 'GET':
        settings = db.execute('''
            SELECT notification_settings
            FROM user_profiles
            WHERE user_id = %s
        ''', (user_id,)).fetchone()
        return jsonify(settings)
    
    data = request.json
    db.execute('''
        UPDATE user_profiles
        SET notification_settings = %s
        WHERE user_id = %s
    ''', (data['settings'], user_id))
    db.commit()
    
    return jsonify({'message': 'Notification settings updated successfully'})

def create_notification(db, user_id, title, message, type, scheduled_for=None):
    """Helper function to create a new notification"""
    db.execute('''
        INSERT INTO user_notifications (user_id, title, message, type, status, scheduled_for)
        VALUES (%s, %s, %s, %s, 'unread', %s)
    ''', (user_id, title, message, type, scheduled_for))
    db.commit() 