from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from ..db import get_db
from ..auth import require_auth
import geopy.distance
from geopy.geocoders import Nominatim

mobile_bp = Blueprint('mobile', __name__)

# Location-based Reminders
@mobile_bp.route('/location/reminders', methods=['GET', 'POST'])
@require_auth
def manage_location_reminders(user_id):
    db = get_db()
    
    if request.method == 'GET':
        reminders = db.execute('''
            SELECT * FROM location_reminders
            WHERE user_id = %s AND is_active = true
            ORDER BY created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(reminders)
    
    data = request.json
    reminder_id = db.execute('''
        INSERT INTO location_reminders (
            user_id, task_id, location_name,
            latitude, longitude, radius_meters,
            trigger_on
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['task_id'], data['location_name'],
          data['latitude'], data['longitude'],
          data['radius_meters'], data['trigger_on'])).fetchone()['id']
    
    db.commit()
    return jsonify({'id': reminder_id, 'message': 'Reminder created successfully'})

@mobile_bp.route('/location/check', methods=['POST'])
@require_auth
def check_location_reminders(user_id):
    db = get_db()
    data = request.json
    current_location = (data['latitude'], data['longitude'])
    
    # Get active reminders
    reminders = db.execute('''
        SELECT * FROM location_reminders
        WHERE user_id = %s AND is_active = true
    ''', (user_id,)).fetchall()
    
    triggered_reminders = []
    for reminder in reminders:
        reminder_location = (reminder['latitude'], reminder['longitude'])
        distance = geopy.distance.distance(current_location, reminder_location).meters
        
        if distance <= reminder['radius_meters']:
            triggered_reminders.append(reminder)
            
            # Update last triggered time
            db.execute('''
                UPDATE location_reminders
                SET last_triggered = NOW()
                WHERE id = %s
            ''', (reminder['id'],))
    
    db.commit()
    return jsonify(triggered_reminders)

# Offline Mode
@mobile_bp.route('/offline/sync', methods=['POST'])
@require_auth
def sync_offline_data(user_id):
    db = get_db()
    data = request.json
    device_id = data['device_id']
    
    # Process offline queue
    offline_data = db.execute('''
        SELECT * FROM offline_data_queue
        WHERE user_id = %s AND device_id = %s AND status = 'pending'
        ORDER BY created_at
    ''', (user_id, device_id)).fetchall()
    
    results = []
    for item in offline_data:
        try:
            # Process each offline operation
            result = process_offline_operation(db, user_id, item)
            results.append(result)
            
            # Update sync status
            db.execute('''
                UPDATE offline_data_queue
                SET status = %s,
                    sync_attempts = sync_attempts + 1,
                    last_sync_attempt = NOW()
                WHERE id = %s
            ''', ('synced' if result['success'] else 'failed',
                  item['id']))
        except Exception as e:
            db.execute('''
                UPDATE offline_data_queue
                SET status = 'failed',
                    sync_attempts = sync_attempts + 1,
                    last_sync_attempt = NOW()
                WHERE id = %s
            ''', (item['id'],))
            results.append({'success': False, 'error': str(e)})
    
    db.commit()
    return jsonify(results)

@mobile_bp.route('/offline/queue', methods=['POST'])
@require_auth
def queue_offline_data(user_id):
    db = get_db()
    data = request.json
    
    queue_id = db.execute('''
        INSERT INTO offline_data_queue (
            user_id, device_id, data_type,
            operation, data, status
        )
        VALUES (%s, %s, %s, %s, %s, 'pending')
        RETURNING id
    ''', (user_id, data['device_id'], data['type'],
          data['operation'], json.dumps(data['data']))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': queue_id, 'message': 'Data queued successfully'})

# Mobile Widgets
@mobile_bp.route('/widgets', methods=['GET', 'POST'])
@require_auth
def manage_mobile_widgets(user_id):
    db = get_db()
    
    if request.method == 'GET':
        widgets = db.execute('''
            SELECT * FROM mobile_widgets
            WHERE user_id = %s
            ORDER BY position
        ''', (user_id,)).fetchall()
        return jsonify(widgets)
    
    data = request.json
    widget_id = db.execute('''
        INSERT INTO mobile_widgets (
            user_id, widget_type, title,
            config, refresh_interval, position, size
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['widget_type'], data['title'],
          json.dumps(data['config']),
          data.get('refresh_interval'),
          data['position'],
          json.dumps(data['size']))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': widget_id, 'message': 'Widget created successfully'})

@mobile_bp.route('/widgets/<widget_id>', methods=['PUT', 'DELETE'])
@require_auth
def update_mobile_widget(user_id, widget_id):
    db = get_db()
    
    if request.method == 'DELETE':
        db.execute('''
            DELETE FROM mobile_widgets
            WHERE id = %s AND user_id = %s
        ''', (widget_id, user_id))
        db.commit()
        return jsonify({'message': 'Widget deleted successfully'})
    
    data = request.json
    db.execute('''
        UPDATE mobile_widgets
        SET title = %s,
            config = %s,
            refresh_interval = %s,
            position = %s,
            size = %s,
            last_updated = NOW()
        WHERE id = %s AND user_id = %s
    ''', (data['title'], json.dumps(data['config']),
          data.get('refresh_interval'),
          data['position'], json.dumps(data['size']),
          widget_id, user_id))
    
    db.commit()
    return jsonify({'message': 'Widget updated successfully'})

# Smart Notifications
@mobile_bp.route('/notifications/rules', methods=['GET', 'POST'])
@require_auth
def manage_notification_rules(user_id):
    db = get_db()
    
    if request.method == 'GET':
        rules = db.execute('''
            SELECT * FROM notification_rules
            WHERE user_id = %s AND is_active = true
            ORDER BY priority
        ''', (user_id,)).fetchall()
        return jsonify(rules)
    
    data = request.json
    rule_id = db.execute('''
        INSERT INTO notification_rules (
            user_id, rule_type, conditions,
            action, priority
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['rule_type'],
          json.dumps(data['conditions']),
          json.dumps(data['action']),
          data['priority'])).fetchone()['id']
    
    db.commit()
    return jsonify({'id': rule_id, 'message': 'Rule created successfully'})

@mobile_bp.route('/notifications/check', methods=['POST'])
@require_auth
def check_notification_rules(user_id):
    db = get_db()
    data = request.json
    context = data['context']
    
    # Get active rules
    rules = db.execute('''
        SELECT * FROM notification_rules
        WHERE user_id = %s AND is_active = true
        ORDER BY priority
    ''', (user_id,)).fetchall()
    
    triggered_notifications = []
    for rule in rules:
        if should_trigger_notification(rule, context):
            notification = generate_notification(rule, context)
            triggered_notifications.append(notification)
            
            # Update last triggered time
            db.execute('''
                UPDATE notification_rules
                SET last_triggered = NOW()
                WHERE id = %s
            ''', (rule['id'],))
    
    db.commit()
    return jsonify(triggered_notifications)

# Gesture Shortcuts
@mobile_bp.route('/gestures', methods=['GET', 'POST'])
@require_auth
def manage_gesture_shortcuts(user_id):
    db = get_db()
    
    if request.method == 'GET':
        shortcuts = db.execute('''
            SELECT * FROM gesture_shortcuts
            WHERE user_id = %s AND is_active = true
            ORDER BY created_at
        ''', (user_id,)).fetchall()
        return jsonify(shortcuts)
    
    data = request.json
    shortcut_id = db.execute('''
        INSERT INTO gesture_shortcuts (
            user_id, gesture_type, action_type, action_data
        )
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (user_id, gesture_type) DO UPDATE
        SET action_type = EXCLUDED.action_type,
            action_data = EXCLUDED.action_data
        RETURNING id
    ''', (user_id, data['gesture_type'],
          data['action_type'],
          json.dumps(data['action_data']))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': shortcut_id, 'message': 'Shortcut created successfully'})

# Device Sync
@mobile_bp.route('/sync/status', methods=['GET', 'POST'])
@require_auth
def manage_device_sync(user_id):
    db = get_db()
    
    if request.method == 'GET':
        device_id = request.args.get('device_id')
        status = db.execute('''
            SELECT * FROM device_sync_status
            WHERE user_id = %s AND device_id = %s
        ''', (user_id, device_id)).fetchone()
        return jsonify(status)
    
    data = request.json
    sync_id = db.execute('''
        INSERT INTO device_sync_status (
            user_id, device_id, device_type,
            last_sync, sync_token, data_types,
            settings
        )
        VALUES (%s, %s, %s, NOW(), %s, %s, %s)
        ON CONFLICT (user_id, device_id) DO UPDATE
        SET last_sync = NOW(),
            sync_token = EXCLUDED.sync_token,
            data_types = EXCLUDED.data_types,
            settings = EXCLUDED.settings
        RETURNING id
    ''', (user_id, data['device_id'], data['device_type'],
          data['sync_token'], data['data_types'],
          json.dumps(data.get('settings', {})))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': sync_id, 'message': 'Sync status updated successfully'})

@mobile_bp.route('/sync/conflicts', methods=['GET', 'POST'])
@require_auth
def manage_sync_conflicts(user_id):
    db = get_db()
    
    if request.method == 'GET':
        conflicts = db.execute('''
            SELECT * FROM sync_conflicts
            WHERE user_id = %s AND resolution_status = 'pending'
            ORDER BY created_at
        ''', (user_id,)).fetchall()
        return jsonify(conflicts)
    
    data = request.json
    conflict_id = db.execute('''
        INSERT INTO sync_conflicts (
            user_id, data_type, entity_id,
            device_id, server_data, client_data,
            resolution_status
        )
        VALUES (%s, %s, %s, %s, %s, %s, 'pending')
        RETURNING id
    ''', (user_id, data['data_type'], data['entity_id'],
          data['device_id'], json.dumps(data['server_data']),
          json.dumps(data['client_data']))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': conflict_id, 'message': 'Conflict recorded successfully'})

# Helper Functions
def process_offline_operation(db, user_id, item):
    """Process a single offline operation"""
    try:
        if item['operation'] == 'create':
            return create_entity(db, user_id, item['data_type'], item['data'])
        elif item['operation'] == 'update':
            return update_entity(db, user_id, item['data_type'], item['data'])
        elif item['operation'] == 'delete':
            return delete_entity(db, user_id, item['data_type'], item['data'])
        else:
            return {'success': False, 'error': 'Unknown operation'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def should_trigger_notification(rule, context):
    """Check if a notification rule should be triggered based on context"""
    conditions = rule['conditions']
    
    if rule['rule_type'] == 'time':
        return check_time_conditions(conditions, context)
    elif rule['rule_type'] == 'location':
        return check_location_conditions(conditions, context)
    elif rule['rule_type'] == 'context':
        return check_context_conditions(conditions, context)
    else:
        return check_custom_conditions(conditions, context)

def generate_notification(rule, context):
    """Generate notification content based on rule and context"""
    action = rule['action']
    
    return {
        'rule_id': rule['id'],
        'title': format_notification_title(action, context),
        'message': format_notification_message(action, context),
        'data': action.get('data', {}),
        'priority': rule['priority']
    }

def check_time_conditions(conditions, context):
    """Check if time-based conditions are met"""
    current_time = datetime.now().time()
    if 'start_time' in conditions and 'end_time' in conditions:
        start = datetime.strptime(conditions['start_time'], '%H:%M').time()
        end = datetime.strptime(conditions['end_time'], '%H:%M').time()
        return start <= current_time <= end
    return True

def check_location_conditions(conditions, context):
    """Check if location-based conditions are met"""
    if 'location' not in context:
        return False
    
    current_location = (context['location']['latitude'],
                       context['location']['longitude'])
    target_location = (conditions['latitude'], conditions['longitude'])
    
    distance = geopy.distance.distance(current_location, target_location).meters
    return distance <= conditions.get('radius_meters', 100)

def check_context_conditions(conditions, context):
    """Check if context-based conditions are met"""
    for key, value in conditions.items():
        if key not in context or context[key] != value:
            return False
    return True

def check_custom_conditions(conditions, context):
    """Check if custom conditions are met"""
    # Implement custom condition checking logic
    return True

def format_notification_title(action, context):
    """Format notification title based on action and context"""
    if 'title_template' in action:
        return action['title_template'].format(**context)
    return action.get('title', 'Notification')

def format_notification_message(action, context):
    """Format notification message based on action and context"""
    if 'message_template' in action:
        return action['message_template'].format(**context)
    return action.get('message', '') 