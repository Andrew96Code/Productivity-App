from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
import croniter
import pytz
from backend.db import get_db
from backend.auth import require_auth
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from io import BytesIO
import base64
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

reporting_bp = Blueprint('reporting', __name__)

# Report Templates
@reporting_bp.route('/templates', methods=['GET', 'POST'])
@require_auth
def manage_report_templates(user_id):
    db = get_db()
    
    if request.method == 'GET':
        templates = db.execute('''
            SELECT * FROM report_templates
            WHERE user_id = %s OR is_public = true
            ORDER BY created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(templates)
    
    data = request.json
    template_id = db.execute('''
        INSERT INTO report_templates (
            user_id, name, description, report_type,
            data_sources, filters, sorting, grouping,
            visualizations, custom_calculations,
            layout, is_public
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['name'], data.get('description'),
          data['report_type'], data['data_sources'],
          json.dumps(data.get('filters', {})),
          json.dumps(data.get('sorting', {})),
          json.dumps(data.get('grouping', {})),
          json.dumps(data.get('visualizations', [])),
          json.dumps(data.get('custom_calculations', {})),
          json.dumps(data.get('layout', {})),
          data.get('is_public', False))).fetchone()['id']
    
    db.commit()
    return jsonify({
        'template_id': template_id,
        'message': 'Report template created successfully'
    })

@reporting_bp.route('/templates/<template_id>', methods=['GET', 'PUT', 'DELETE'])
@require_auth
def manage_report_template(user_id, template_id):
    db = get_db()
    
    if request.method == 'GET':
        template = db.execute('''
            SELECT * FROM report_templates
            WHERE id = %s AND (user_id = %s OR is_public = true)
        ''', (template_id, user_id)).fetchone()
        
        if not template:
            return jsonify({'error': 'Template not found'}), 404
        
        return jsonify(template)
    
    elif request.method == 'PUT':
        data = request.json
        db.execute('''
            UPDATE report_templates
            SET name = %s,
                description = %s,
                report_type = %s,
                data_sources = %s,
                filters = %s,
                sorting = %s,
                grouping = %s,
                visualizations = %s,
                custom_calculations = %s,
                layout = %s,
                is_public = %s,
                updated_at = NOW()
            WHERE id = %s AND user_id = %s
        ''', (data['name'], data.get('description'),
              data['report_type'], data['data_sources'],
              json.dumps(data.get('filters', {})),
              json.dumps(data.get('sorting', {})),
              json.dumps(data.get('grouping', {})),
              json.dumps(data.get('visualizations', [])),
              json.dumps(data.get('custom_calculations', {})),
              json.dumps(data.get('layout', {})),
              data.get('is_public', False),
              template_id, user_id))
        
        db.commit()
        return jsonify({'message': 'Report template updated successfully'})
    
    else:  # DELETE
        db.execute('''
            DELETE FROM report_templates
            WHERE id = %s AND user_id = %s
        ''', (template_id, user_id))
        
        db.commit()
        return jsonify({'message': 'Report template deleted successfully'})

# Scheduled Reports
@reporting_bp.route('/schedules', methods=['GET', 'POST'])
@require_auth
def manage_scheduled_reports(user_id):
    db = get_db()
    
    if request.method == 'GET':
        schedules = db.execute('''
            SELECT s.*, t.name as template_name
            FROM scheduled_reports s
            JOIN report_templates t ON t.id = s.template_id
            WHERE s.user_id = %s
            ORDER BY s.next_run
        ''', (user_id,)).fetchall()
        return jsonify(schedules)
    
    data = request.json
    
    # Calculate next run time
    timezone = pytz.timezone(data.get('timezone', 'UTC'))
    if data['schedule_type'] == 'custom':
        cron = croniter.croniter(data['cron_expression'],
                               datetime.now(timezone))
        next_run = cron.get_next(datetime)
    else:
        next_run = calculate_next_run(data['schedule_type'],
                                    timezone)
    
    schedule_id = db.execute('''
        INSERT INTO scheduled_reports (
            user_id, template_id, name,
            schedule_type, cron_expression,
            timezone, recipients, export_format,
            next_run
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['template_id'],
          data['name'], data['schedule_type'],
          data.get('cron_expression'),
          data.get('timezone', 'UTC'),
          json.dumps(data['recipients']),
          data['export_format'], next_run)).fetchone()['id']
    
    db.commit()
    return jsonify({
        'schedule_id': schedule_id,
        'message': 'Scheduled report created successfully'
    })

@reporting_bp.route('/schedules/<schedule_id>', methods=['GET', 'PUT', 'DELETE'])
@require_auth
def manage_scheduled_report(user_id, schedule_id):
    db = get_db()
    
    if request.method == 'GET':
        schedule = db.execute('''
            SELECT s.*, t.name as template_name
            FROM scheduled_reports s
            JOIN report_templates t ON t.id = s.template_id
            WHERE s.id = %s AND s.user_id = %s
        ''', (schedule_id, user_id)).fetchone()
        
        if not schedule:
            return jsonify({'error': 'Schedule not found'}), 404
        
        return jsonify(schedule)
    
    elif request.method == 'PUT':
        data = request.json
        
        # Calculate next run time
        timezone = pytz.timezone(data.get('timezone', 'UTC'))
        if data['schedule_type'] == 'custom':
            cron = croniter.croniter(data['cron_expression'],
                                   datetime.now(timezone))
            next_run = cron.get_next(datetime)
        else:
            next_run = calculate_next_run(data['schedule_type'],
                                        timezone)
        
        db.execute('''
            UPDATE scheduled_reports
            SET template_id = %s,
                name = %s,
                schedule_type = %s,
                cron_expression = %s,
                timezone = %s,
                recipients = %s,
                export_format = %s,
                next_run = %s,
                is_active = %s
            WHERE id = %s AND user_id = %s
        ''', (data['template_id'], data['name'],
              data['schedule_type'],
              data.get('cron_expression'),
              data.get('timezone', 'UTC'),
              json.dumps(data['recipients']),
              data['export_format'], next_run,
              data.get('is_active', True),
              schedule_id, user_id))
        
        db.commit()
        return jsonify({'message': 'Scheduled report updated successfully'})
    
    else:  # DELETE
        db.execute('''
            DELETE FROM scheduled_reports
            WHERE id = %s AND user_id = %s
        ''', (schedule_id, user_id))
        
        db.commit()
        return jsonify({'message': 'Scheduled report deleted successfully'})

# Report Generation and Export
@reporting_bp.route('/generate', methods=['POST'])
@require_auth
def generate_report(user_id):
    db = get_db()
    data = request.json
    
    try:
        # Start execution record
        execution_id = db.execute('''
            INSERT INTO report_executions (
                template_id, user_id, parameters,
                status
            )
            VALUES (%s, %s, %s, 'running')
            RETURNING id
        ''', (data['template_id'], user_id,
              json.dumps(data.get('parameters', {})))).fetchone()['id']
        
        start_time = datetime.now()
        
        # Get template
        template = db.execute('''
            SELECT * FROM report_templates
            WHERE id = %s AND (user_id = %s OR is_public = true)
        ''', (data['template_id'], user_id)).fetchone()
        
        if not template:
            raise Exception('Template not found')
        
        # Generate report data
        report_data = generate_report_data(db, template,
                                         data.get('parameters', {}))
        
        # Generate visualizations if needed
        if template['visualizations']:
            visualizations = generate_visualizations(report_data,
                                                  template['visualizations'])
            report_data['visualizations'] = visualizations
        
        # Calculate execution time
        execution_time = datetime.now() - start_time
        
        # Create export record
        export_id = db.execute('''
            INSERT INTO report_exports (
                user_id, template_id, name,
                format, data, status
            )
            VALUES (%s, %s, %s, %s, %s, 'completed')
            RETURNING id
        ''', (user_id, data['template_id'],
              f"{template['name']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
              data.get('format', 'json'),
              json.dumps(report_data))).fetchone()['id']
        
        # Update execution record
        db.execute('''
            UPDATE report_executions
            SET status = 'completed',
                execution_time = %s,
                row_count = %s
            WHERE id = %s
        ''', (execution_time, len(report_data.get('rows', [])),
              execution_id))
        
        # Generate insights
        generate_report_insights(db, template['id'],
                               user_id, report_data)
        
        db.commit()
        
        return jsonify({
            'export_id': export_id,
            'message': 'Report generated successfully'
        })
        
    except Exception as e:
        db.execute('''
            UPDATE report_executions
            SET status = 'failed',
                error_details = %s
            WHERE id = %s
        ''', (str(e), execution_id))
        
        db.commit()
        return jsonify({'error': str(e)}), 500

@reporting_bp.route('/exports/<export_id>/download', methods=['GET'])
@require_auth
def download_report(user_id, export_id):
    db = get_db()
    
    export = db.execute('''
        SELECT * FROM report_exports
        WHERE id = %s AND user_id = %s
    ''', (export_id, user_id)).fetchone()
    
    if not export:
        return jsonify({'error': 'Export not found'}), 404
    
    # Generate file in requested format
    if export['format'] == 'csv':
        file_data = generate_csv(export['data'])
        mime_type = 'text/csv'
    elif export['format'] == 'excel':
        file_data = generate_excel(export['data'])
        mime_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    elif export['format'] == 'pdf':
        file_data = generate_pdf(export['data'])
        mime_type = 'application/pdf'
    else:  # json
        return jsonify(json.loads(export['data']))
    
    # Update export record with file info
    db.execute('''
        UPDATE report_exports
        SET file_url = %s,
            file_size = %s
        WHERE id = %s
    ''', (f"/exports/{export_id}.{export['format']}",
          len(file_data), export_id))
    
    db.commit()
    
    return file_data, 200, {
        'Content-Type': mime_type,
        'Content-Disposition': f"attachment; filename=report_{export_id}.{export['format']}"
    }

# Report Sharing
@reporting_bp.route('/share', methods=['POST'])
@require_auth
def share_report(user_id):
    db = get_db()
    data = request.json
    
    # Verify template ownership
    template = db.execute('''
        SELECT * FROM report_templates
        WHERE id = %s AND user_id = %s
    ''', (data['report_id'], user_id)).fetchone()
    
    if not template:
        return jsonify({'error': 'Report template not found'}), 404
    
    # Create share record
    share_id = db.execute('''
        INSERT INTO report_shares (
            report_id, user_id, shared_by,
            permissions, access_token,
            expires_at
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (data['report_id'], data['user_id'],
          user_id, json.dumps(data.get('permissions', {})),
          generate_access_token(),
          data.get('expires_at'))).fetchone()['id']
    
    db.commit()
    
    return jsonify({
        'share_id': share_id,
        'message': 'Report shared successfully'
    })

# Report Subscriptions
@reporting_bp.route('/subscriptions', methods=['GET', 'POST'])
@require_auth
def manage_subscriptions(user_id):
    db = get_db()
    
    if request.method == 'GET':
        subscriptions = db.execute('''
            SELECT s.*, t.name as report_name
            FROM report_subscriptions s
            JOIN report_templates t ON t.id = s.report_id
            WHERE s.user_id = %s
            ORDER BY s.created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(subscriptions)
    
    data = request.json
    subscription_id = db.execute('''
        INSERT INTO report_subscriptions (
            user_id, report_id, frequency,
            delivery_method, format
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['report_id'],
          data['frequency'], data['delivery_method'],
          data['format'])).fetchone()['id']
    
    db.commit()
    return jsonify({
        'subscription_id': subscription_id,
        'message': 'Subscription created successfully'
    })

# Helper Functions
def calculate_next_run(schedule_type, timezone):
    """Calculate next run time based on schedule type"""
    now = datetime.now(timezone)
    
    if schedule_type == 'daily':
        next_run = now.replace(hour=0, minute=0,
                             second=0, microsecond=0) + timedelta(days=1)
    elif schedule_type == 'weekly':
        next_run = now.replace(hour=0, minute=0,
                             second=0, microsecond=0)
        while next_run.weekday() != 0:  # Monday
            next_run += timedelta(days=1)
    else:  # monthly
        next_run = now.replace(day=1, hour=0,
                             minute=0, second=0,
                             microsecond=0) + timedelta(months=1)
    
    return next_run

def generate_report_data(db, template, parameters):
    """Generate report data based on template and parameters"""
    data = {'rows': [], 'summary': {}, 'metadata': {}}
    
    for source in template['data_sources']:
        # Build query with filters and sorting
        query = f"SELECT * FROM {source}"
        params = []
        
        if template['filters']:
            conditions = []
            for f in template['filters']:
                conditions.append(f"{f['field']} {f['operator']} %s")
                params.append(f['value'])
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
        
        if template['sorting']:
            sort_clauses = []
            for s in template['sorting']:
                sort_clauses.append(f"{s['field']} {s['direction']}")
            
            if sort_clauses:
                query += " ORDER BY " + ", ".join(sort_clauses)
        
        # Execute query and process results
        results = db.execute(query, params).fetchall()
        data['rows'].extend(results)
    
    # Apply grouping if specified
    if template['grouping']:
        data['rows'] = apply_grouping(data['rows'],
                                    template['grouping'])
    
    # Apply custom calculations
    if template['custom_calculations']:
        data['summary'] = apply_calculations(data['rows'],
                                          template['custom_calculations'])
    
    # Add metadata
    data['metadata'] = {
        'generated_at': datetime.now().isoformat(),
        'template_name': template['name'],
        'parameters': parameters
    }
    
    return data

def generate_visualizations(data, visualization_config):
    """Generate visualizations based on report data"""
    visualizations = {}
    
    for viz in visualization_config:
        if viz['type'] == 'chart':
            plt.figure(figsize=(10, 6))
            
            if viz['chart_type'] == 'bar':
                sns.barplot(data=pd.DataFrame(data['rows']),
                          x=viz['x_field'],
                          y=viz['y_field'])
            elif viz['chart_type'] == 'line':
                sns.lineplot(data=pd.DataFrame(data['rows']),
                           x=viz['x_field'],
                           y=viz['y_field'])
            elif viz['chart_type'] == 'pie':
                plt.pie(pd.DataFrame(data['rows'])[viz['value_field']],
                       labels=pd.DataFrame(data['rows'])[viz['label_field']])
            
            plt.title(viz['title'])
            
            # Save to buffer
            buffer = BytesIO()
            plt.savefig(buffer, format='png')
            plt.close()
            
            # Convert to base64
            image_base64 = base64.b64encode(buffer.getvalue()).decode()
            visualizations[viz['id']] = image_base64
    
    return visualizations

def generate_report_insights(db, template_id, user_id, report_data):
    """Generate automated insights from report data"""
    insights = []
    
    # Analyze trends
    if len(report_data['rows']) > 1:
        trend_insight = analyze_trends(report_data['rows'])
        if trend_insight:
            insights.append({
                'type': 'trend',
                'content': trend_insight['description'],
                'metrics': trend_insight['metrics'],
                'importance_score': trend_insight['importance']
            })
    
    # Detect anomalies
    anomalies = detect_anomalies(report_data['rows'])
    for anomaly in anomalies:
        insights.append({
            'type': 'anomaly',
            'content': anomaly['description'],
            'metrics': anomaly['metrics'],
            'importance_score': anomaly['importance']
        })
    
    # Find correlations
    correlations = find_correlations(report_data['rows'])
    for correlation in correlations:
        insights.append({
            'type': 'correlation',
            'content': correlation['description'],
            'metrics': correlation['metrics'],
            'importance_score': correlation['importance']
        })
    
    # Generate summary
    summary = generate_summary(report_data)
    insights.append({
        'type': 'summary',
        'content': summary['description'],
        'metrics': summary['metrics'],
        'importance_score': 1.0
    })
    
    # Store insights
    for insight in insights:
        db.execute('''
            INSERT INTO report_insights (
                report_id, user_id, insight_type,
                content, metrics, importance_score,
                generated_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        ''', (template_id, user_id,
              insight['type'], insight['content'],
              json.dumps(insight['metrics']),
              insight['importance_score']))

def analyze_trends(data):
    """Analyze trends in the data"""
    # Implement trend analysis logic
    pass

def detect_anomalies(data):
    """Detect anomalies in the data"""
    # Implement anomaly detection logic
    pass

def find_correlations(data):
    """Find correlations in the data"""
    # Implement correlation analysis logic
    pass

def generate_summary(data):
    """Generate a summary of the report data"""
    # Implement summary generation logic
    pass

def generate_access_token():
    """Generate a unique access token"""
    return os.urandom(32).hex()

def generate_csv(data):
    """Generate CSV file from report data"""
    df = pd.DataFrame(data['rows'])
    buffer = BytesIO()
    df.to_csv(buffer, index=False)
    return buffer.getvalue()

def generate_excel(data):
    """Generate Excel file from report data"""
    df = pd.DataFrame(data['rows'])
    buffer = BytesIO()
    df.to_excel(buffer, index=False)
    return buffer.getvalue()

def generate_pdf(data):
    """Generate PDF file from report data"""
    # Implement PDF generation logic
    pass 