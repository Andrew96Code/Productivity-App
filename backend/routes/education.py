from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from ..db import get_db
from ..auth import require_auth

education_bp = Blueprint('education', __name__)

# Learning Resources
@education_bp.route('/resources', methods=['GET'])
@require_auth
def get_learning_resources(user_id):
    db = get_db()
    category = request.args.get('category')
    resource_type = request.args.get('type')
    difficulty = request.args.get('difficulty')
    
    query = '''
        SELECT r.*, 
               COALESCE(p.progress, 0) as progress,
               COALESCE(p.status, 'not_started') as status
        FROM learning_resources r
        LEFT JOIN user_learning_progress p 
            ON r.id = p.resource_id 
            AND p.user_id = %s
        WHERE 1=1
    '''
    params = [user_id]
    
    if category:
        query += ' AND r.category = %s'
        params.append(category)
    if resource_type:
        query += ' AND r.resource_type = %s'
        params.append(resource_type)
    if difficulty:
        query += ' AND r.difficulty_level = %s'
        params.append(difficulty)
    
    query += ' ORDER BY r.created_at DESC'
    
    resources = db.execute(query, params).fetchall()
    return jsonify(resources)

@education_bp.route('/resources/<resource_id>/progress', methods=['POST'])
@require_auth
def update_learning_progress(user_id, resource_id):
    db = get_db()
    data = request.json
    
    progress = db.execute('''
        INSERT INTO user_learning_progress (
            user_id, resource_id, start_date,
            completion_date, progress, status,
            notes, rating, feedback
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (user_id, resource_id) DO UPDATE
        SET progress = EXCLUDED.progress,
            status = EXCLUDED.status,
            completion_date = CASE 
                WHEN EXCLUDED.status = 'completed' 
                THEN NOW() 
                ELSE EXCLUDED.completion_date 
            END,
            notes = EXCLUDED.notes,
            rating = EXCLUDED.rating,
            feedback = EXCLUDED.feedback
        RETURNING id
    ''', (user_id, resource_id,
          data.get('start_date', datetime.now()),
          data.get('completion_date'),
          data['progress'],
          data['status'],
          data.get('notes'),
          data.get('rating'),
          data.get('feedback'))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': progress, 'message': 'Progress updated successfully'})

# Learning Modules
@education_bp.route('/modules', methods=['GET'])
@require_auth
def get_learning_modules(user_id):
    db = get_db()
    category = request.args.get('category')
    
    query = '''
        SELECT m.*,
               (
                   SELECT json_agg(json_build_object(
                       'resource_id', r.id,
                       'title', r.title,
                       'progress', COALESCE(p.progress, 0),
                       'status', COALESCE(p.status, 'not_started')
                   ))
                   FROM unnest(m.resources) AS r_id
                   JOIN learning_resources r ON r.id = r_id
                   LEFT JOIN user_learning_progress p 
                       ON p.resource_id = r.id 
                       AND p.user_id = %s
               ) as resources_progress
        FROM learning_modules m
        WHERE 1=1
    '''
    params = [user_id]
    
    if category:
        query += ' AND m.category = %s'
        params.append(category)
    
    query += ' ORDER BY m.sequence_order'
    
    modules = db.execute(query, params).fetchall()
    return jsonify(modules)

# Practice Exercises
@education_bp.route('/exercises', methods=['GET'])
@require_auth
def get_practice_exercises(user_id):
    db = get_db()
    exercise_type = request.args.get('type')
    
    query = '''
        SELECT e.*,
               r.title as resource_title,
               r.category,
               (
                   SELECT json_agg(s.*)
                   FROM exercise_submissions s
                   WHERE s.exercise_id = e.id
                   AND s.user_id = %s
               ) as submissions
        FROM practice_exercises e
        JOIN learning_resources r ON r.id = e.resource_id
        WHERE 1=1
    '''
    params = [user_id]
    
    if exercise_type:
        query += ' AND e.exercise_type = %s'
        params.append(exercise_type)
    
    exercises = db.execute(query, params).fetchall()
    return jsonify(exercises)

@education_bp.route('/exercises/<exercise_id>/submit', methods=['POST'])
@require_auth
def submit_exercise(user_id, exercise_id):
    db = get_db()
    data = request.json
    
    submission_id = db.execute('''
        INSERT INTO exercise_submissions (
            user_id, exercise_id, submission_data,
            reflection_notes, effectiveness_rating,
            completed_at
        )
        VALUES (%s, %s, %s, %s, %s, NOW())
        RETURNING id
    ''', (user_id, exercise_id,
          json.dumps(data['submission_data']),
          data.get('reflection_notes'),
          data.get('effectiveness_rating'))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': submission_id, 'message': 'Exercise submitted successfully'})

# Skill Assessments
@education_bp.route('/assessments', methods=['GET', 'POST'])
@require_auth
def manage_skill_assessments(user_id):
    db = get_db()
    
    if request.method == 'GET':
        category = request.args.get('category')
        query = '''
            SELECT * FROM skill_assessments
            WHERE user_id = %s
        '''
        params = [user_id]
        
        if category:
            query += ' AND category = %s'
            params.append(category)
        
        query += ' ORDER BY created_at DESC'
        
        assessments = db.execute(query, params).fetchall()
        return jsonify(assessments)
    
    data = request.json
    assessment_id = db.execute('''
        INSERT INTO skill_assessments (
            user_id, category, assessment_data,
            strengths, areas_for_improvement,
            recommendations, next_assessment_date
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, data['category'],
          json.dumps(data['assessment_data']),
          data['strengths'],
          data['areas_for_improvement'],
          json.dumps(data['recommendations']),
          data.get('next_assessment_date'))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': assessment_id, 'message': 'Assessment saved successfully'})

# Learning Paths
@education_bp.route('/paths', methods=['GET'])
@require_auth
def get_learning_paths(user_id):
    db = get_db()
    
    paths = db.execute('''
        SELECT p.*,
               (
                   SELECT json_agg(json_build_object(
                       'module_id', m.id,
                       'title', m.title,
                       'progress', (
                           SELECT avg(COALESCE(up.progress, 0))
                           FROM unnest(m.resources) AS r_id
                           LEFT JOIN user_learning_progress up 
                               ON up.resource_id = r_id
                               AND up.user_id = %s
                       )
                   ))
                   FROM unnest(p.modules) AS m_id
                   JOIN learning_modules m ON m.id = m_id
               ) as modules_progress,
               (
                   SELECT row_to_json(c.*)
                   FROM user_certifications c
                   WHERE c.path_id = p.id
                   AND c.user_id = %s
               ) as certification
        FROM learning_paths p
        ORDER BY p.created_at DESC
    ''', (user_id, user_id)).fetchall()
    
    return jsonify(paths)

@education_bp.route('/paths/<path_id>/progress', methods=['GET'])
@require_auth
def get_path_progress(user_id, path_id):
    db = get_db()
    
    progress = db.execute('''
        WITH path_resources AS (
            SELECT DISTINCT r_id
            FROM learning_paths p
            JOIN unnest(p.modules) AS m_id ON true
            JOIN learning_modules m ON m.id = m_id
            JOIN unnest(m.resources) AS r_id ON true
            WHERE p.id = %s
        )
        SELECT 
            count(*) as total_resources,
            count(up.*) as started_resources,
            count(CASE WHEN up.status = 'completed' THEN 1 END) as completed_resources,
            avg(COALESCE(up.progress, 0)) as overall_progress
        FROM path_resources pr
        LEFT JOIN user_learning_progress up 
            ON up.resource_id = pr.r_id
            AND up.user_id = %s
    ''', (path_id, user_id)).fetchone()
    
    return jsonify(progress)

# Certifications
@education_bp.route('/certifications', methods=['GET'])
@require_auth
def get_user_certifications(user_id):
    db = get_db()
    
    certifications = db.execute('''
        SELECT c.*,
               p.title as path_title,
               p.description as path_description
        FROM user_certifications c
        JOIN learning_paths p ON p.id = c.path_id
        WHERE c.user_id = %s
        ORDER BY c.earned_at DESC
    ''', (user_id,)).fetchall()
    
    return jsonify(certifications)

@education_bp.route('/paths/<path_id>/certify', methods=['POST'])
@require_auth
def certify_path_completion(user_id, path_id):
    db = get_db()
    data = request.json
    
    # Verify completion criteria
    progress = db.execute('''
        WITH path_resources AS (
            SELECT DISTINCT r_id
            FROM learning_paths p
            JOIN unnest(p.modules) AS m_id ON true
            JOIN learning_modules m ON m.id = m_id
            JOIN unnest(m.resources) AS r_id ON true
            WHERE p.id = %s
        )
        SELECT 
            count(*) as total_resources,
            count(CASE WHEN up.status = 'completed' THEN 1 END) as completed_resources
        FROM path_resources pr
        LEFT JOIN user_learning_progress up 
            ON up.resource_id = pr.r_id
            AND up.user_id = %s
    ''', (path_id, user_id)).fetchone()
    
    if progress['completed_resources'] < progress['total_resources']:
        return jsonify({
            'error': 'Certification requirements not met',
            'completed': progress['completed_resources'],
            'required': progress['total_resources']
        }), 400
    
    certification_id = db.execute('''
        INSERT INTO user_certifications (
            user_id, path_id, earned_at,
            certificate_data, valid_until
        )
        VALUES (%s, %s, NOW(), %s, %s)
        RETURNING id
    ''', (user_id, path_id,
          json.dumps(data.get('certificate_data', {})),
          data.get('valid_until'))).fetchone()['id']
    
    db.commit()
    return jsonify({'id': certification_id, 'message': 'Certification issued successfully'}) 