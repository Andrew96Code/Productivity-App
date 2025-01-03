from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from ..db import get_db
from ..auth import require_auth
import croniter
import pytz
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
import imaplib
import email
import os
import pytesseract
from PIL import Image
import requests
from io import BytesIO

automation_bp = Blueprint('automation', __name__)

# Workflow Automation
@automation_bp.route('/workflows', methods=['GET', 'POST'])
@require_auth
def manage_workflows(user_id):
    db = get_db()
    
    if request.method == 'GET':
        workflows = db.execute('''
            SELECT * FROM workflow_templates
            WHERE user_id = %s
            ORDER BY created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(workflows)
    
    data = request.json
    workflow_id = db.execute('''
        INSERT INTO workflow_templates (
            user_id, name, description, trigger_type,
            trigger_config, steps, is_active
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['name'], data.get('description'),
          data['trigger_type'], json.dumps(data['trigger_config']),
          json.dumps(data['steps']), data.get('is_active', True))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': workflow_id, 'message': 'Workflow created successfully'})

@automation_bp.route('/workflows/<workflow_id>/execute', methods=['POST'])
@require_auth
def execute_workflow(user_id, workflow_id):
    db = get_db()
    data = request.json
    
    # Start workflow execution
    execution_id = db.execute('''
        INSERT INTO workflow_executions (
            workflow_id, user_id, trigger_data,
            execution_status, started_at
        )
        VALUES (%s, %s, %s, 'in_progress', NOW())
        RETURNING id
    ''', (workflow_id, user_id, json.dumps(data))).fetchone()['id']
    
    try:
        # Get workflow steps
        workflow = db.execute('''
            SELECT * FROM workflow_templates
            WHERE id = %s AND user_id = %s
        ''', (workflow_id, user_id)).fetchone()
        
        step_results = []
        for step in workflow['steps']:
            result = execute_workflow_step(db, user_id, step, data)
            step_results.append(result)
            
            if not result['success']:
                raise Exception(f"Step failed: {result['error']}")
        
        # Update execution status
        db.execute('''
            UPDATE workflow_executions
            SET execution_status = 'completed',
                step_results = %s,
                completed_at = NOW()
            WHERE id = %s
        ''', (json.dumps(step_results), execution_id))
        
        # Update workflow stats
        db.execute('''
            UPDATE workflow_templates
            SET last_executed = NOW(),
                execution_count = execution_count + 1
            WHERE id = %s
        ''', (workflow_id,))
        
    except Exception as e:
        db.execute('''
            UPDATE workflow_executions
            SET execution_status = 'failed',
                step_results = %s,
                error_details = %s,
                completed_at = NOW()
            WHERE id = %s
        ''', (json.dumps(step_results), json.dumps({'error': str(e)}), execution_id))
    
    db.commit()
    return jsonify({'id': execution_id, 'message': 'Workflow executed successfully'})

# Task Templates
@automation_bp.route('/templates', methods=['GET', 'POST'])
@require_auth
def manage_task_templates(user_id):
    db = get_db()
    
    if request.method == 'GET':
        templates = db.execute('''
            SELECT * FROM task_templates
            WHERE user_id = %s
            ORDER BY created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(templates)
    
    data = request.json
    template_id = db.execute('''
        INSERT INTO task_templates (
            user_id, name, description, category,
            default_priority, estimated_duration,
            checklist, default_tags, custom_fields,
            smart_suggestions
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['name'], data.get('description'),
          data['category'], data.get('default_priority'),
          data.get('estimated_duration'),
          json.dumps(data.get('checklist', [])),
          data.get('default_tags', []),
          json.dumps(data.get('custom_fields', {})),
          data.get('smart_suggestions', False))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': template_id, 'message': 'Template created successfully'})

# Recurring Tasks
@automation_bp.route('/recurring-tasks', methods=['GET', 'POST'])
@require_auth
def manage_recurring_tasks(user_id):
    db = get_db()
    
    if request.method == 'GET':
        tasks = db.execute('''
            SELECT r.*, t.name as template_name
            FROM recurring_tasks r
            LEFT JOIN task_templates t ON t.id = r.template_id
            WHERE r.user_id = %s
            ORDER BY r.next_occurrence
        ''', (user_id,)).fetchall()
        return jsonify(tasks)
    
    data = request.json
    task_id = db.execute('''
        INSERT INTO recurring_tasks (
            user_id, template_id, name, description,
            recurrence_pattern, next_occurrence,
            dynamic_scheduling, optimization_rules,
            skip_dates
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data.get('template_id'),
          data['name'], data.get('description'),
          json.dumps(data['recurrence_pattern']),
          data['next_occurrence'],
          data.get('dynamic_scheduling', False),
          json.dumps(data.get('optimization_rules', {})),
          data.get('skip_dates', []))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': task_id, 'message': 'Recurring task created successfully'})

@automation_bp.route('/recurring-tasks/generate', methods=['POST'])
@require_auth
def generate_recurring_instances(user_id):
    db = get_db()
    now = datetime.now(pytz.UTC)
    
    # Get tasks that need instances generated
    tasks = db.execute('''
        SELECT * FROM recurring_tasks
        WHERE user_id = %s
        AND next_occurrence <= %s
        ORDER BY next_occurrence
    ''', (user_id, now)).fetchall()
    
    generated_instances = []
    for task in tasks:
        # Generate instance
        instance_id = db.execute('''
            INSERT INTO recurring_task_instances (
                recurring_task_id, user_id,
                scheduled_date, status
            )
            VALUES (%s, %s, %s, 'pending')
            RETURNING id
        ''', (task['id'], user_id,
              task['next_occurrence'])).fetchone()['id']
        
        generated_instances.append(instance_id)
        
        # Calculate next occurrence
        next_occurrence = calculate_next_occurrence(
            task['recurrence_pattern'],
            task['next_occurrence'],
            task['skip_dates']
        )
        
        # Update task
        db.execute('''
            UPDATE recurring_tasks
            SET next_occurrence = %s,
                last_occurrence = %s
            WHERE id = %s
        ''', (next_occurrence, task['next_occurrence'],
              task['id']))
    
    db.commit()
    return jsonify({
        'generated_instances': generated_instances,
        'message': f'Generated {len(generated_instances)} task instances'
    })

# Email Integration
@automation_bp.route('/email/integrations', methods=['GET', 'POST'])
@require_auth
def manage_email_integrations(user_id):
    db = get_db()
    
    if request.method == 'GET':
        integrations = db.execute('''
            SELECT * FROM email_integrations
            WHERE user_id = %s
            ORDER BY created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(integrations)
    
    data = request.json
    integration_id = db.execute('''
        INSERT INTO email_integrations (
            user_id, email_address, provider,
            integration_type, credentials, sync_settings
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['email_address'],
          data['provider'], data['integration_type'],
          json.dumps(data['credentials']),
          json.dumps(data['sync_settings']))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': integration_id, 'message': 'Email integration created successfully'})

@automation_bp.route('/email/rules', methods=['GET', 'POST'])
@require_auth
def manage_email_rules(user_id):
    db = get_db()
    
    if request.method == 'GET':
        rules = db.execute('''
            SELECT r.*, i.email_address
            FROM email_rules r
            JOIN email_integrations i ON i.id = r.integration_id
            WHERE r.user_id = %s
            ORDER BY r.priority
        ''', (user_id,)).fetchall()
        return jsonify(rules)
    
    data = request.json
    rule_id = db.execute('''
        INSERT INTO email_rules (
            user_id, integration_id, name,
            conditions, actions, priority
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['integration_id'],
          data['name'], json.dumps(data['conditions']),
          json.dumps(data['actions']),
          data['priority'])).fetchone()['id']
    
    db.commit()
    return jsonify({'id': rule_id, 'message': 'Email rule created successfully'})

@automation_bp.route('/email/sync', methods=['POST'])
@require_auth
def sync_emails(user_id):
    db = get_db()
    integration_id = request.json.get('integration_id')
    
    integration = db.execute('''
        SELECT * FROM email_integrations
        WHERE id = %s AND user_id = %s
    ''', (integration_id, user_id)).fetchone()
    
    if not integration:
        return jsonify({'error': 'Integration not found'}), 404
    
    try:
        # Connect to email server
        if integration['integration_type'] == 'gmail':
            processed_emails = sync_gmail(db, user_id, integration)
        elif integration['integration_type'] == 'outlook':
            processed_emails = sync_outlook(db, user_id, integration)
        else:
            processed_emails = sync_custom_email(db, user_id, integration)
        
        # Update last sync time
        db.execute('''
            UPDATE email_integrations
            SET last_sync = NOW()
            WHERE id = %s
        ''', (integration_id,))
        
        db.commit()
        return jsonify({
            'processed_emails': processed_emails,
            'message': 'Email sync completed successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Document Processing
@automation_bp.route('/documents/processors', methods=['GET', 'POST'])
@require_auth
def manage_document_processors(user_id):
    db = get_db()
    
    if request.method == 'GET':
        processors = db.execute('''
            SELECT * FROM document_processors
            WHERE user_id = %s
            ORDER BY created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(processors)
    
    data = request.json
    processor_id = db.execute('''
        INSERT INTO document_processors (
            user_id, name, processor_type,
            configuration, supported_formats
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['name'],
          data['processor_type'],
          json.dumps(data['configuration']),
          data['supported_formats'])).fetchone()['id']
    
    db.commit()
    return jsonify({'id': processor_id, 'message': 'Document processor created successfully'})

@automation_bp.route('/documents/process', methods=['POST'])
@require_auth
def process_document(user_id):
    db = get_db()
    data = request.json
    
    # Create processing job
    job_id = db.execute('''
        INSERT INTO document_processing_jobs (
            user_id, processor_id, document_url,
            document_type, processing_status
        )
        VALUES (%s, %s, %s, %s, 'processing')
        RETURNING id
    ''', (user_id, data['processor_id'],
          data['document_url'],
          data['document_type'])).fetchone()['id']
    
    try:
        # Get processor configuration
        processor = db.execute('''
            SELECT * FROM document_processors
            WHERE id = %s AND user_id = %s
        ''', (data['processor_id'], user_id)).fetchone()
        
        # Process document based on type
        if processor['processor_type'] == 'ocr':
            result = process_ocr(data['document_url'], processor['configuration'])
        elif processor['processor_type'] == 'parser':
            result = process_parser(data['document_url'], processor['configuration'])
        elif processor['processor_type'] == 'extractor':
            result = process_extractor(data['document_url'], processor['configuration'])
        else:
            result = process_classifier(data['document_url'], processor['configuration'])
        
        # Update job status
        db.execute('''
            UPDATE document_processing_jobs
            SET processing_status = 'completed',
                result_data = %s
            WHERE id = %s
        ''', (json.dumps(result), job_id))
        
    except Exception as e:
        db.execute('''
            UPDATE document_processing_jobs
            SET processing_status = 'failed',
                error_details = %s
            WHERE id = %s
        ''', (json.dumps({'error': str(e)}), job_id))
    
    db.commit()
    return jsonify({'id': job_id, 'message': 'Document processing started'})

# Task Delegation
@automation_bp.route('/delegations', methods=['GET', 'POST'])
@require_auth
def manage_delegations(user_id):
    db = get_db()
    
    if request.method == 'GET':
        role = request.args.get('role', 'delegator')
        
        if role == 'delegator':
            delegations = db.execute('''
                SELECT d.*, u.username as delegatee_name
                FROM task_delegations d
                JOIN user_profiles u ON u.user_id = d.delegatee_id
                WHERE d.delegator_id = %s
                ORDER BY d.created_at DESC
            ''', (user_id,)).fetchall()
        else:
            delegations = db.execute('''
                SELECT d.*, u.username as delegator_name
                FROM task_delegations d
                JOIN user_profiles u ON u.user_id = d.delegator_id
                WHERE d.delegatee_id = %s
                ORDER BY d.created_at DESC
            ''', (user_id,)).fetchall()
        
        return jsonify(delegations)
    
    data = request.json
    delegation_id = db.execute('''
        INSERT INTO task_delegations (
            task_id, delegator_id, delegatee_id,
            delegation_type, permissions, status,
            due_date, notes
        )
        VALUES (%s, %s, %s, %s, %s, 'pending', %s, %s)
        RETURNING id
    ''', (data['task_id'], user_id,
          data['delegatee_id'], data['delegation_type'],
          json.dumps(data['permissions']),
          data.get('due_date'), data.get('notes'))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': delegation_id, 'message': 'Task delegation created successfully'})

@automation_bp.route('/delegations/<delegation_id>/respond', methods=['POST'])
@require_auth
def respond_to_delegation(user_id, delegation_id):
    db = get_db()
    data = request.json
    
    delegation = db.execute('''
        SELECT * FROM task_delegations
        WHERE id = %s AND delegatee_id = %s
    ''', (delegation_id, user_id)).fetchone()
    
    if not delegation:
        return jsonify({'error': 'Delegation not found'}), 404
    
    db.execute('''
        UPDATE task_delegations
        SET status = %s
        WHERE id = %s
    ''', (data['status'], delegation_id))
    
    db.commit()
    return jsonify({'message': f'Delegation {data["status"]}'})

@automation_bp.route('/delegation-rules', methods=['GET', 'POST'])
@require_auth
def manage_delegation_rules(user_id):
    db = get_db()
    
    if request.method == 'GET':
        rules = db.execute('''
            SELECT r.*, u.username as delegatee_name
            FROM delegation_rules r
            JOIN user_profiles u ON u.user_id = r.delegatee_id
            WHERE r.user_id = %s
            ORDER BY r.priority
        ''', (user_id,)).fetchall()
        return jsonify(rules)
    
    data = request.json
    rule_id = db.execute('''
        INSERT INTO delegation_rules (
            user_id, name, conditions,
            delegatee_id, delegation_config,
            priority
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['name'],
          json.dumps(data['conditions']),
          data['delegatee_id'],
          json.dumps(data['delegation_config']),
          data['priority'])).fetchone()['id']
    
    db.commit()
    return jsonify({'id': rule_id, 'message': 'Delegation rule created successfully'})

# Helper Functions
def execute_workflow_step(db, user_id, step, context):
    """Execute a single workflow step"""
    try:
        if step['type'] == 'task':
            return create_task(db, user_id, step['config'], context)
        elif step['type'] == 'email':
            return send_email(step['config'], context)
        elif step['type'] == 'notification':
            return send_notification(db, user_id, step['config'], context)
        elif step['type'] == 'api':
            return call_external_api(step['config'], context)
        else:
            return {'success': False, 'error': 'Unknown step type'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def calculate_next_occurrence(pattern, last_occurrence, skip_dates):
    """Calculate the next occurrence based on recurrence pattern"""
    base = croniter.croniter(pattern['cron'], last_occurrence)
    next_date = base.get_next(datetime)
    
    while next_date.date() in skip_dates:
        next_date = base.get_next(datetime)
    
    return next_date

def sync_gmail(db, user_id, integration):
    """Sync emails from Gmail"""
    # Implement Gmail API integration
    pass

def sync_outlook(db, user_id, integration):
    """Sync emails from Outlook"""
    # Implement Outlook API integration
    pass

def sync_custom_email(db, user_id, integration):
    """Sync emails from custom email server"""
    # Implement IMAP/POP3 integration
    pass

def process_ocr(document_url, config):
    """Process document using OCR"""
    response = requests.get(document_url)
    image = Image.open(BytesIO(response.content))
    return pytesseract.image_to_text(image)

def process_parser(document_url, config):
    """Parse document structure"""
    # Implement document parsing logic
    pass

def process_extractor(document_url, config):
    """Extract specific information from document"""
    # Implement information extraction logic
    pass

def process_classifier(document_url, config):
    """Classify document type"""
    # Implement document classification logic
    pass 