from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
import pyotp
import bcrypt
import jwt
from cryptography.fernet import Fernet
from ..db import get_db
from ..auth import require_auth
import requests
from io import BytesIO
import hashlib
import base64

security_bp = Blueprint('security', __name__)

# Two-Factor Authentication
@security_bp.route('/2fa/setup', methods=['POST'])
@require_auth
def setup_2fa(user_id):
    db = get_db()
    data = request.json
    
    # Generate secret key for TOTP
    secret = pyotp.random_base32()
    backup_codes = [pyotp.random_base32()[:8] for _ in range(10)]
    
    # Hash backup codes before storing
    hashed_backup_codes = [bcrypt.hashpw(code.encode(), bcrypt.gensalt()).decode() for code in backup_codes]
    
    db.execute('''
        INSERT INTO two_factor_settings (
            user_id, is_enabled, method,
            secret_key, backup_codes, phone_number
        )
        VALUES (%s, false, %s, %s, %s, %s)
        ON CONFLICT (user_id) DO UPDATE
        SET method = EXCLUDED.method,
            secret_key = EXCLUDED.secret_key,
            backup_codes = EXCLUDED.backup_codes,
            phone_number = EXCLUDED.phone_number
    ''', (user_id, data['method'], secret,
          hashed_backup_codes, data.get('phone_number')))
    
    db.commit()
    
    # Log the 2FA setup attempt
    log_audit_event(db, user_id, 'setup_2fa',
                   'security', {'method': data['method']})
    
    return jsonify({
        'secret': secret,
        'backup_codes': backup_codes,
        'message': '2FA setup initiated successfully'
    })

@security_bp.route('/2fa/verify', methods=['POST'])
@require_auth
def verify_2fa(user_id):
    db = get_db()
    data = request.json
    
    settings = db.execute('''
        SELECT * FROM two_factor_settings
        WHERE user_id = %s
    ''', (user_id,)).fetchone()
    
    if not settings:
        return jsonify({'error': '2FA not set up'}), 400
    
    try:
        if data.get('is_backup_code'):
            # Verify backup code
            verified = verify_backup_code(settings['backup_codes'], data['code'])
        else:
            # Verify TOTP
            totp = pyotp.TOTP(settings['secret_key'])
            verified = totp.verify(data['code'])
        
        if verified:
            db.execute('''
                UPDATE two_factor_settings
                SET is_enabled = true,
                    last_verified = NOW()
                WHERE user_id = %s
            ''', (user_id,))
            
            db.commit()
            
            log_audit_event(db, user_id, 'verify_2fa',
                          'security', {'success': True})
            
            return jsonify({'message': '2FA verified successfully'})
        else:
            log_audit_event(db, user_id, 'verify_2fa',
                          'security', {'success': False})
            
            return jsonify({'error': 'Invalid code'}), 400
            
    except Exception as e:
        log_audit_event(db, user_id, 'verify_2fa',
                       'security', {'error': str(e)})
        return jsonify({'error': str(e)}), 500

# Encryption Management
@security_bp.route('/encryption/keys', methods=['POST'])
@require_auth
def generate_encryption_keys(user_id):
    db = get_db()
    data = request.json
    
    try:
        # Generate key pair
        key = Fernet.generate_key()
        fernet = Fernet(key)
        
        # Store encrypted keys
        key_id = db.execute('''
            INSERT INTO encryption_keys (
                user_id, key_type, public_key,
                encrypted_private_key, expires_at
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        ''', (user_id, data['key_type'],
              base64.b64encode(key).decode(),
              fernet.encrypt(key).decode(),
              datetime.now() + timedelta(days=365))).fetchone()['id']
        
        db.commit()
        
        log_audit_event(db, user_id, 'generate_keys',
                       'security', {'key_type': data['key_type']})
        
        return jsonify({
            'key_id': key_id,
            'message': 'Encryption keys generated successfully'
        })
        
    except Exception as e:
        log_audit_event(db, user_id, 'generate_keys',
                       'security', {'error': str(e)})
        return jsonify({'error': str(e)}), 500

@security_bp.route('/encryption/rotate', methods=['POST'])
@require_auth
def rotate_encryption_keys(user_id):
    db = get_db()
    data = request.json
    
    try:
        # Generate new key pair
        new_key = Fernet.generate_key()
        fernet = Fernet(new_key)
        
        # Deactivate old key
        db.execute('''
            UPDATE encryption_keys
            SET is_active = false
            WHERE user_id = %s AND key_type = %s AND is_active = true
        ''', (user_id, data['key_type']))
        
        # Store new key
        key_id = db.execute('''
            INSERT INTO encryption_keys (
                user_id, key_type, public_key,
                encrypted_private_key, key_version,
                expires_at
            )
            VALUES (%s, %s, %s, %s,
                    (SELECT COALESCE(MAX(key_version), 0) + 1
                     FROM encryption_keys
                     WHERE user_id = %s AND key_type = %s),
                    %s)
            RETURNING id
        ''', (user_id, data['key_type'],
              base64.b64encode(new_key).decode(),
              fernet.encrypt(new_key).decode(),
              user_id, data['key_type'],
              datetime.now() + timedelta(days=365))).fetchone()['id']
        
        db.commit()
        
        log_audit_event(db, user_id, 'rotate_keys',
                       'security', {'key_type': data['key_type']})
        
        return jsonify({
            'key_id': key_id,
            'message': 'Encryption keys rotated successfully'
        })
        
    except Exception as e:
        log_audit_event(db, user_id, 'rotate_keys',
                       'security', {'error': str(e)})
        return jsonify({'error': str(e)}), 500

# Data Backup and Recovery
@security_bp.route('/backups', methods=['POST'])
@require_auth
def create_backup(user_id):
    db = get_db()
    data = request.json
    
    try:
        # Get encryption key
        key = db.execute('''
            SELECT * FROM encryption_keys
            WHERE user_id = %s AND key_type = 'backup'
            AND is_active = true
        ''', (user_id,)).fetchone()
        
        if not key:
            return jsonify({'error': 'No active backup key found'}), 400
        
        # Fetch data to backup
        backup_data = fetch_user_data(db, user_id, data['data_scope'])
        
        # Encrypt backup data
        fernet = Fernet(base64.b64decode(key['public_key']))
        encrypted_data = fernet.encrypt(json.dumps(backup_data).encode())
        
        # Calculate checksum
        checksum = hashlib.sha256(encrypted_data).hexdigest()
        
        # Store backup
        backup_id = db.execute('''
            INSERT INTO data_backups (
                user_id, backup_type, data_scope,
                encrypted_data, encryption_key_id,
                size_bytes, checksum, status,
                retention_period
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'completed', %s)
            RETURNING id
        ''', (user_id, data['backup_type'],
              json.dumps(data['data_scope']),
              encrypted_data.decode(),
              key['id'], len(encrypted_data),
              checksum,
              data.get('retention_period'))).fetchone()['id']
        
        db.commit()
        
        log_audit_event(db, user_id, 'create_backup',
                       'data', {'backup_id': backup_id})
        
        return jsonify({
            'backup_id': backup_id,
            'message': 'Backup created successfully'
        })
        
    except Exception as e:
        log_audit_event(db, user_id, 'create_backup',
                       'data', {'error': str(e)})
        return jsonify({'error': str(e)}), 500

@security_bp.route('/backups/<backup_id>/restore', methods=['POST'])
@require_auth
def restore_backup(user_id, backup_id):
    db = get_db()
    
    try:
        # Get backup and key
        backup = db.execute('''
            SELECT b.*, k.public_key
            FROM data_backups b
            JOIN encryption_keys k ON k.id = b.encryption_key_id
            WHERE b.id = %s AND b.user_id = %s
        ''', (backup_id, user_id)).fetchone()
        
        if not backup:
            return jsonify({'error': 'Backup not found'}), 404
        
        # Decrypt backup data
        fernet = Fernet(base64.b64decode(backup['public_key']))
        decrypted_data = json.loads(fernet.decrypt(backup['encrypted_data'].encode()))
        
        # Restore data
        restore_user_data(db, user_id, decrypted_data)
        
        db.execute('''
            UPDATE data_backups
            SET status = 'restored'
            WHERE id = %s
        ''', (backup_id,))
        
        db.commit()
        
        log_audit_event(db, user_id, 'restore_backup',
                       'data', {'backup_id': backup_id})
        
        return jsonify({'message': 'Backup restored successfully'})
        
    except Exception as e:
        log_audit_event(db, user_id, 'restore_backup',
                       'data', {'error': str(e)})
        return jsonify({'error': str(e)}), 500

# Privacy Controls
@security_bp.route('/privacy/settings', methods=['GET', 'PUT'])
@require_auth
def manage_privacy_settings(user_id):
    db = get_db()
    
    if request.method == 'GET':
        settings = db.execute('''
            SELECT * FROM privacy_settings
            WHERE user_id = %s
        ''', (user_id,)).fetchone()
        
        return jsonify(settings if settings else {})
    
    data = request.json
    db.execute('''
        INSERT INTO privacy_settings (
            user_id, data_sharing, data_retention,
            visibility_settings, cookie_preferences
        )
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (user_id) DO UPDATE
        SET data_sharing = EXCLUDED.data_sharing,
            data_retention = EXCLUDED.data_retention,
            visibility_settings = EXCLUDED.visibility_settings,
            cookie_preferences = EXCLUDED.cookie_preferences,
            updated_at = NOW()
    ''', (user_id, json.dumps(data['data_sharing']),
          json.dumps(data['data_retention']),
          json.dumps(data['visibility_settings']),
          json.dumps(data['cookie_preferences'])))
    
    db.commit()
    
    log_audit_event(db, user_id, 'update_privacy',
                   'privacy', {'settings': data})
    
    return jsonify({'message': 'Privacy settings updated successfully'})

# Audit Logs
@security_bp.route('/audit-logs', methods=['GET'])
@require_auth
def get_audit_logs(user_id):
    db = get_db()
    
    category = request.args.get('category')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = '''
        SELECT * FROM audit_logs
        WHERE user_id = %s
    '''
    params = [user_id]
    
    if category:
        query += ' AND event_category = %s'
        params.append(category)
    
    if start_date:
        query += ' AND created_at >= %s'
        params.append(start_date)
    
    if end_date:
        query += ' AND created_at <= %s'
        params.append(end_date)
    
    query += ' ORDER BY created_at DESC'
    
    logs = db.execute(query, params).fetchall()
    return jsonify(logs)

# GDPR Compliance
@security_bp.route('/gdpr/requests', methods=['POST'])
@require_auth
def submit_gdpr_request(user_id):
    db = get_db()
    data = request.json
    
    request_id = db.execute('''
        INSERT INTO gdpr_requests (
            user_id, request_type,
            request_details, status
        )
        VALUES (%s, %s, %s, 'pending')
        RETURNING id
    ''', (user_id, data['request_type'],
          json.dumps(data['request_details']))).fetchone()['id']
    
    db.commit()
    
    log_audit_event(db, user_id, 'gdpr_request',
                   'privacy', {'request_type': data['request_type']})
    
    return jsonify({
        'request_id': request_id,
        'message': 'GDPR request submitted successfully'
    })

@security_bp.route('/gdpr/requests/<request_id>', methods=['GET'])
@require_auth
def get_gdpr_request_status(user_id, request_id):
    db = get_db()
    
    request = db.execute('''
        SELECT * FROM gdpr_requests
        WHERE id = %s AND user_id = %s
    ''', (request_id, user_id)).fetchone()
    
    if not request:
        return jsonify({'error': 'Request not found'}), 404
    
    return jsonify(request)

@security_bp.route('/gdpr/consent', methods=['POST'])
@require_auth
def record_consent(user_id):
    db = get_db()
    data = request.json
    
    consent_id = db.execute('''
        INSERT INTO consent_records (
            user_id, consent_type,
            consent_version, granted,
            ip_address, user_agent
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['consent_type'],
          data['consent_version'], data['granted'],
          request.remote_addr,
          request.headers.get('User-Agent'))).fetchone()['id']
    
    db.commit()
    
    log_audit_event(db, user_id, 'record_consent',
                   'privacy', {
                       'consent_type': data['consent_type'],
                       'granted': data['granted']
                   })
    
    return jsonify({
        'consent_id': consent_id,
        'message': 'Consent recorded successfully'
    })

# Helper Functions
def log_audit_event(db, user_id, event_type, category, event_data):
    """Log an audit event"""
    db.execute('''
        INSERT INTO audit_logs (
            user_id, event_type, event_category,
            event_data, ip_address, user_agent,
            status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    ''', (user_id, event_type, category,
          json.dumps(event_data),
          request.remote_addr,
          request.headers.get('User-Agent'),
          'success'))
    db.commit()

def verify_backup_code(stored_codes, provided_code):
    """Verify a backup code"""
    for stored_code in stored_codes:
        if bcrypt.checkpw(provided_code.encode(), stored_code.encode()):
            return True
    return False

def fetch_user_data(db, user_id, data_scope):
    """Fetch user data based on scope"""
    data = {}
    for table in data_scope:
        data[table] = db.execute(f'''
            SELECT * FROM {table}
            WHERE user_id = %s
        ''', (user_id,)).fetchall()
    return data

def restore_user_data(db, user_id, data):
    """Restore user data from backup"""
    for table, records in data.items():
        for record in records:
            # Remove id and created_at fields
            record.pop('id', None)
            record.pop('created_at', None)
            
            # Convert record to SQL insert
            fields = ', '.join(record.keys())
            values = ', '.join(['%s'] * len(record))
            
            db.execute(f'''
                INSERT INTO {table} ({fields})
                VALUES ({values})
                ON CONFLICT (user_id) DO UPDATE
                SET {', '.join(f"{k} = EXCLUDED.{k}"
                             for k in record.keys())}
            ''', tuple(record.values())) 