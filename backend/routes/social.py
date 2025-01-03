from flask import Blueprint, request, jsonify
from ..db import get_db
from ..auth import require_auth

social_bp = Blueprint('social', __name__)

@social_bp.route('/profile', methods=['GET', 'PUT'])
@require_auth
def profile(user_id):
    db = get_db()
    
    if request.method == 'GET':
        profile = db.execute(
            'SELECT * FROM user_profiles WHERE user_id = %s',
            (user_id,)
        ).fetchone()
        return jsonify(profile)
    
    data = request.json
    db.execute('''
        INSERT INTO user_profiles (user_id, username, avatar_url, bio)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (user_id) DO UPDATE
        SET username = EXCLUDED.username,
            avatar_url = EXCLUDED.avatar_url,
            bio = EXCLUDED.bio
    ''', (user_id, data['username'], data.get('avatar_url'), data.get('bio')))
    db.commit()
    return jsonify({'message': 'Profile updated successfully'})

@social_bp.route('/challenges', methods=['GET', 'POST'])
@require_auth
def challenges(user_id):
    db = get_db()
    
    if request.method == 'GET':
        challenges = db.execute('''
            SELECT c.*, uc.status, uc.progress
            FROM challenges c
            LEFT JOIN user_challenges uc ON c.id = uc.challenge_id AND uc.user_id = %s
            WHERE c.end_date > NOW()
            ORDER BY c.start_date ASC
        ''', (user_id,)).fetchall()
        return jsonify(challenges)
    
    data = request.json
    db.execute('''
        INSERT INTO user_challenges (user_id, challenge_id, status)
        VALUES (%s, %s, 'in_progress')
        ON CONFLICT (user_id, challenge_id) DO NOTHING
    ''', (user_id, data['challenge_id']))
    db.commit()
    return jsonify({'message': 'Challenge joined successfully'})

@social_bp.route('/leaderboard/<board_type>', methods=['GET'])
@require_auth
def leaderboard(user_id, board_type):
    db = get_db()
    leaderboard = db.execute('''
        SELECT up.username, up.avatar_url, up.total_points
        FROM user_profiles up
        ORDER BY up.total_points DESC
        LIMIT 100
    ''').fetchall()
    return jsonify(leaderboard) 