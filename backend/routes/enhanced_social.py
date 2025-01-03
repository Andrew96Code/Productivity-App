from flask import Blueprint, request, jsonify
from datetime import datetime
from ..db import get_db
from ..auth import require_auth

enhanced_social_bp = Blueprint('enhanced_social', __name__)

# Friend/Connection System
@enhanced_social_bp.route('/friends', methods=['GET'])
@require_auth
def get_friends(user_id):
    db = get_db()
    friends = db.execute('''
        SELECT u.username, u.avatar_url, fc.status, fc.created_at
        FROM friend_connections fc
        JOIN user_profiles u ON (
            CASE 
                WHEN fc.user_id = %s THEN u.user_id = fc.friend_id
                ELSE u.user_id = fc.user_id
            END
        )
        WHERE (fc.user_id = %s OR fc.friend_id = %s)
        AND fc.status != 'blocked'
        ORDER BY fc.created_at DESC
    ''', (user_id, user_id, user_id)).fetchall()
    return jsonify(friends)

@enhanced_social_bp.route('/friends/request', methods=['POST'])
@require_auth
def send_friend_request(user_id):
    db = get_db()
    data = request.json
    friend_id = data['friend_id']
    
    db.execute('''
        INSERT INTO friend_connections (user_id, friend_id, status)
        VALUES (%s, %s, 'pending')
    ''', (user_id, friend_id))
    db.commit()
    return jsonify({'message': 'Friend request sent successfully'})

@enhanced_social_bp.route('/friends/respond', methods=['POST'])
@require_auth
def respond_friend_request(user_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        UPDATE friend_connections
        SET status = %s, updated_at = NOW()
        WHERE friend_id = %s AND user_id = %s AND status = 'pending'
    ''', (data['status'], user_id, data['friend_id']))
    db.commit()
    return jsonify({'message': 'Friend request updated successfully'})

# Direct Messaging
@enhanced_social_bp.route('/messages/<friend_id>', methods=['GET'])
@require_auth
def get_messages(user_id, friend_id):
    db = get_db()
    messages = db.execute('''
        SELECT * FROM direct_messages
        WHERE (sender_id = %s AND receiver_id = %s)
        OR (sender_id = %s AND receiver_id = %s)
        ORDER BY created_at DESC
        LIMIT 50
    ''', (user_id, friend_id, friend_id, user_id)).fetchall()
    
    # Mark messages as read
    db.execute('''
        UPDATE direct_messages
        SET read = true
        WHERE receiver_id = %s AND sender_id = %s AND read = false
    ''', (user_id, friend_id))
    db.commit()
    
    return jsonify(messages)

@enhanced_social_bp.route('/messages/send', methods=['POST'])
@require_auth
def send_message(user_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        INSERT INTO direct_messages (sender_id, receiver_id, content)
        VALUES (%s, %s, %s)
    ''', (user_id, data['receiver_id'], data['content']))
    db.commit()
    return jsonify({'message': 'Message sent successfully'})

# Group Challenges
@enhanced_social_bp.route('/groups', methods=['GET', 'POST'])
@require_auth
def manage_groups(user_id):
    db = get_db()
    
    if request.method == 'GET':
        groups = db.execute('''
            SELECT cg.*, gm.role,
                   (SELECT COUNT(*) FROM group_members WHERE group_id = cg.id) as member_count
            FROM challenge_groups cg
            LEFT JOIN group_members gm ON cg.id = gm.group_id AND gm.user_id = %s
            WHERE NOT cg.is_private OR gm.user_id IS NOT NULL
            ORDER BY cg.created_at DESC
        ''', (user_id,)).fetchall()
        return jsonify(groups)
    
    data = request.json
    group_id = db.execute('''
        INSERT INTO challenge_groups (name, description, creator_id, is_private)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    ''', (data['name'], data.get('description'), user_id, data.get('is_private', False))).fetchone()['id']
    
    # Add creator as admin
    db.execute('''
        INSERT INTO group_members (group_id, user_id, role)
        VALUES (%s, %s, 'admin')
    ''', (group_id, user_id))
    db.commit()
    
    return jsonify({'message': 'Group created successfully', 'group_id': group_id})

@enhanced_social_bp.route('/groups/<group_id>/challenges', methods=['GET', 'POST'])
@require_auth
def group_challenges(user_id, group_id):
    db = get_db()
    
    if request.method == 'GET':
        challenges = db.execute('''
            SELECT c.*, gc.start_date, gc.end_date,
                   (SELECT COUNT(*) FROM user_challenges uc 
                    WHERE uc.challenge_id = c.id AND uc.status = 'completed') as completion_count
            FROM group_challenges gc
            JOIN challenges c ON gc.challenge_id = c.id
            WHERE gc.group_id = %s
            ORDER BY gc.start_date DESC
        ''', (group_id,)).fetchall()
        return jsonify(challenges)
    
    data = request.json
    db.execute('''
        INSERT INTO group_challenges (group_id, challenge_id, start_date, end_date)
        VALUES (%s, %s, %s, %s)
    ''', (group_id, data['challenge_id'], data['start_date'], data['end_date']))
    db.commit()
    return jsonify({'message': 'Challenge added to group successfully'})

# Social Feed
@enhanced_social_bp.route('/feed', methods=['GET'])
@require_auth
def get_social_feed(user_id):
    db = get_db()
    feed = db.execute('''
        SELECT sa.*, up.username, up.avatar_url,
               (SELECT COUNT(*) FROM activity_reactions ar WHERE ar.activity_id = sa.id) as reaction_count,
               (SELECT COUNT(*) FROM activity_comments ac WHERE ac.activity_id = sa.id) as comment_count,
               EXISTS(SELECT 1 FROM activity_reactions ar 
                     WHERE ar.activity_id = sa.id AND ar.user_id = %s) as has_reacted
        FROM social_activities sa
        JOIN user_profiles up ON sa.user_id = up.user_id
        WHERE sa.visibility = 'public'
        OR (sa.visibility = 'friends' AND EXISTS (
            SELECT 1 FROM friend_connections fc
            WHERE (fc.user_id = sa.user_id AND fc.friend_id = %s
                   OR fc.user_id = %s AND fc.friend_id = sa.user_id)
            AND fc.status = 'accepted'
        ))
        OR sa.user_id = %s
        ORDER BY sa.created_at DESC
        LIMIT 50
    ''', (user_id, user_id, user_id, user_id)).fetchall()
    return jsonify(feed)

@enhanced_social_bp.route('/activities', methods=['POST'])
@require_auth
def create_activity(user_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        INSERT INTO social_activities (user_id, activity_type, content, visibility)
        VALUES (%s, %s, %s, %s)
    ''', (user_id, data['activity_type'], data['content'], data.get('visibility', 'friends')))
    db.commit()
    return jsonify({'message': 'Activity posted successfully'})

@enhanced_social_bp.route('/activities/<activity_id>/react', methods=['POST'])
@require_auth
def react_to_activity(user_id, activity_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        INSERT INTO activity_reactions (activity_id, user_id, reaction_type)
        VALUES (%s, %s, %s)
        ON CONFLICT (activity_id, user_id) DO UPDATE
        SET reaction_type = EXCLUDED.reaction_type
    ''', (activity_id, user_id, data['reaction_type']))
    db.commit()
    return jsonify({'message': 'Reaction added successfully'})

@enhanced_social_bp.route('/activities/<activity_id>/comment', methods=['POST'])
@require_auth
def comment_on_activity(user_id, activity_id):
    db = get_db()
    data = request.json
    
    db.execute('''
        INSERT INTO activity_comments (activity_id, user_id, content)
        VALUES (%s, %s, %s)
    ''', (activity_id, user_id, data['content']))
    db.commit()
    return jsonify({'message': 'Comment added successfully'}) 