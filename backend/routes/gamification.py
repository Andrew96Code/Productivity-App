from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import json
from ..db import get_db
from ..auth import require_auth

gamification_bp = Blueprint('gamification', __name__)

# Achievements and Badges
@gamification_bp.route('/achievements', methods=['GET'])
@require_auth
def get_achievements(user_id):
    db = get_db()
    achievements = db.execute('''
        SELECT at.*, ua.earned_at, ua.progress
        FROM achievement_types at
        LEFT JOIN user_achievements ua ON at.id = ua.achievement_id AND ua.user_id = %s
        ORDER BY at.category, at.name
    ''', (user_id,)).fetchall()
    return jsonify(achievements)

@gamification_bp.route('/achievements/progress', methods=['GET'])
@require_auth
def get_achievement_progress(user_id):
    db = get_db()
    progress = db.execute('''
        SELECT 
            COUNT(DISTINCT ua.achievement_id) as earned_achievements,
            SUM(at.points) as total_points,
            json_object_agg(at.category, COUNT(ua.id)) as categories
        FROM achievement_types at
        LEFT JOIN user_achievements ua ON at.id = ua.achievement_id AND ua.user_id = %s
        GROUP BY ua.user_id
    ''', (user_id,)).fetchone()
    return jsonify(progress)

# Quest System
@gamification_bp.route('/quests', methods=['GET'])
@require_auth
def get_quests(user_id):
    db = get_db()
    quest_type = request.args.get('type', 'daily')
    
    quests = db.execute('''
        SELECT qt.*, aq.progress, aq.status, aq.start_time, aq.end_time
        FROM quest_templates qt
        LEFT JOIN active_quests aq ON qt.id = aq.quest_id AND aq.user_id = %s
        WHERE qt.quest_type = %s
        AND (aq.id IS NULL OR aq.status = 'active')
        ORDER BY qt.difficulty
    ''', (user_id, quest_type)).fetchall()
    return jsonify(quests)

@gamification_bp.route('/quests/accept', methods=['POST'])
@require_auth
def accept_quest(user_id):
    db = get_db()
    data = request.json
    quest = db.execute('SELECT * FROM quest_templates WHERE id = %s', (data['quest_id'],)).fetchone()
    
    if not quest:
        return jsonify({'error': 'Quest not found'}), 404
    
    # Set quest duration based on type
    start_time = datetime.now()
    if quest['quest_type'] == 'daily':
        end_time = start_time + timedelta(days=1)
    elif quest['quest_type'] == 'weekly':
        end_time = start_time + timedelta(days=7)
    else:
        end_time = start_time + timedelta(days=int(data.get('duration', 1)))
    
    db.execute('''
        INSERT INTO active_quests (user_id, quest_id, start_time, end_time, status)
        VALUES (%s, %s, %s, %s, 'active')
    ''', (user_id, data['quest_id'], start_time, end_time))
    db.commit()
    
    return jsonify({'message': 'Quest accepted successfully'})

@gamification_bp.route('/quests/<quest_id>/progress', methods=['PUT'])
@require_auth
def update_quest_progress(user_id, quest_id):
    db = get_db()
    data = request.json
    
    quest = db.execute('''
        SELECT aq.*, qt.requirements, qt.rewards
        FROM active_quests aq
        JOIN quest_templates qt ON aq.quest_id = qt.id
        WHERE aq.id = %s AND aq.user_id = %s
    ''', (quest_id, user_id)).fetchone()
    
    if not quest:
        return jsonify({'error': 'Quest not found'}), 404
    
    # Update progress
    new_progress = data['progress']
    db.execute('''
        UPDATE active_quests
        SET progress = %s,
            status = CASE 
                WHEN %s >= 100 THEN 'completed'
                ELSE status
            END
        WHERE id = %s
    ''', (json.dumps(new_progress), new_progress['progress'], quest_id))
    
    # If quest completed, grant rewards
    if new_progress['progress'] >= 100:
        grant_quest_rewards(db, user_id, quest['rewards'])
    
    db.commit()
    return jsonify({'message': 'Quest progress updated successfully'})

# Experience and Levels
@gamification_bp.route('/experience', methods=['GET'])
@require_auth
def get_experience(user_id):
    db = get_db()
    experience = db.execute('''
        SELECT ue.*, el.title, el.rewards,
               (SELECT json_agg(xt.*) 
                FROM (
                    SELECT * FROM xp_transactions 
                    WHERE user_id = %s 
                    ORDER BY created_at DESC 
                    LIMIT 10
                ) xt) as recent_transactions
        FROM user_experience ue
        JOIN experience_levels el ON ue.current_level = el.level
        WHERE ue.user_id = %s
    ''', (user_id, user_id)).fetchone()
    return jsonify(experience)

@gamification_bp.route('/experience/add', methods=['POST'])
@require_auth
def add_experience(user_id):
    db = get_db()
    data = request.json
    
    # Add XP transaction
    db.execute('''
        INSERT INTO xp_transactions (user_id, amount, source, description)
        VALUES (%s, %s, %s, %s)
    ''', (user_id, data['amount'], data['source'], data.get('description')))
    
    # Update user experience
    result = db.execute('''
        WITH updated_exp AS (
            UPDATE user_experience
            SET total_xp = total_xp + %s,
                level_progress = jsonb_set(
                    level_progress,
                    '{current_xp}',
                    to_jsonb(CAST(level_progress->>'current_xp' AS INTEGER) + %s)
                )
            WHERE user_id = %s
            RETURNING *
        )
        SELECT updated_exp.*, el.required_xp
        FROM updated_exp
        JOIN experience_levels el ON updated_exp.current_level = el.level
    ''', (data['amount'], data['amount'], user_id)).fetchone()
    
    # Check for level up
    if int(result['level_progress']['current_xp']) >= result['required_xp']:
        handle_level_up(db, user_id)
    
    db.commit()
    return jsonify({'message': 'Experience added successfully'})

# Skill Trees
@gamification_bp.route('/skills/trees', methods=['GET'])
@require_auth
def get_skill_trees(user_id):
    db = get_db()
    trees = db.execute('''
        SELECT st.*,
               (SELECT json_agg(sn.*)
                FROM skill_nodes sn
                WHERE sn.tree_id = st.id) as nodes,
               (SELECT json_agg(us.*)
                FROM user_skills us
                JOIN skill_nodes sn ON us.node_id = sn.id
                WHERE us.user_id = %s AND sn.tree_id = st.id) as user_progress
        FROM skill_trees st
        ORDER BY st.category, st.name
    ''', (user_id,)).fetchall()
    return jsonify(trees)

@gamification_bp.route('/skills/unlock', methods=['POST'])
@require_auth
def unlock_skill(user_id):
    db = get_db()
    data = request.json
    
    # Check if user meets requirements
    node = db.execute('SELECT * FROM skill_nodes WHERE id = %s', (data['node_id'],)).fetchone()
    if not node:
        return jsonify({'error': 'Skill node not found'}), 404
    
    if not check_skill_requirements(db, user_id, node['requirements']):
        return jsonify({'error': 'Requirements not met'}), 400
    
    # Unlock the skill
    db.execute('''
        INSERT INTO user_skills (user_id, node_id, current_level, unlocked_at)
        VALUES (%s, %s, 1, NOW())
    ''', (user_id, data['node_id']))
    
    # Apply skill benefits
    apply_skill_benefits(db, user_id, node['benefits'])
    
    db.commit()
    return jsonify({'message': 'Skill unlocked successfully'})

@gamification_bp.route('/skills/<node_id>/upgrade', methods=['POST'])
@require_auth
def upgrade_skill(user_id, node_id):
    db = get_db()
    
    skill = db.execute('''
        SELECT us.*, sn.max_level, sn.requirements
        FROM user_skills us
        JOIN skill_nodes sn ON us.node_id = sn.id
        WHERE us.user_id = %s AND us.node_id = %s
    ''', (user_id, node_id)).fetchone()
    
    if not skill:
        return jsonify({'error': 'Skill not found'}), 404
    
    if skill['current_level'] >= skill['max_level']:
        return jsonify({'error': 'Skill already at max level'}), 400
    
    # Update skill level
    db.execute('''
        UPDATE user_skills
        SET current_level = current_level + 1,
            progress = '{"xp": 0, "next_level_xp": 100}'::jsonb
        WHERE user_id = %s AND node_id = %s
    ''', (user_id, node_id))
    
    db.commit()
    return jsonify({'message': 'Skill upgraded successfully'})

# Collectibles
@gamification_bp.route('/collectibles', methods=['GET'])
@require_auth
def get_collectibles(user_id):
    db = get_db()
    collectibles = db.execute('''
        SELECT ct.*, uc.acquired_at, uc.is_favorite
        FROM collectible_types ct
        LEFT JOIN user_collectibles uc ON ct.id = uc.collectible_id AND uc.user_id = %s
        ORDER BY ct.rarity, ct.name
    ''', (user_id,)).fetchall()
    return jsonify(collectibles)

@gamification_bp.route('/collectibles/<collectible_id>/toggle-favorite', methods=['POST'])
@require_auth
def toggle_favorite_collectible(user_id, collectible_id):
    db = get_db()
    
    db.execute('''
        UPDATE user_collectibles
        SET is_favorite = NOT is_favorite
        WHERE user_id = %s AND collectible_id = %s
    ''', (user_id, collectible_id))
    
    db.commit()
    return jsonify({'message': 'Collectible favorite status toggled'})

# Milestone Celebrations
@gamification_bp.route('/milestones', methods=['GET'])
@require_auth
def get_milestones(user_id):
    db = get_db()
    milestones = db.execute('''
        SELECT mt.*, um.achieved_at, um.celebration_status
        FROM milestone_types mt
        LEFT JOIN user_milestones um ON mt.id = um.milestone_id AND um.user_id = %s
        ORDER BY mt.category, mt.name
    ''', (user_id,)).fetchall()
    return jsonify(milestones)

@gamification_bp.route('/milestones/<milestone_id>/celebrate', methods=['POST'])
@require_auth
def celebrate_milestone(user_id, milestone_id):
    db = get_db()
    
    db.execute('''
        UPDATE user_milestones
        SET celebration_status = 'celebrated'
        WHERE user_id = %s AND milestone_id = %s
    ''', (user_id, milestone_id))
    
    db.commit()
    return jsonify({'message': 'Milestone celebrated successfully'})

# Helper functions
def handle_level_up(db, user_id):
    """Handle user level up logic"""
    result = db.execute('''
        UPDATE user_experience
        SET current_level = current_level + 1,
            level_progress = '{"current_xp": 0, "next_level_xp": 100}'::jsonb
        WHERE user_id = %s
        RETURNING current_level
    ''', (user_id,)).fetchone()
    
    # Grant level up rewards
    level_rewards = db.execute('''
        SELECT rewards FROM experience_levels WHERE level = %s
    ''', (result['current_level'],)).fetchone()
    
    if level_rewards and level_rewards['rewards']:
        grant_rewards(db, user_id, level_rewards['rewards'])

def check_skill_requirements(db, user_id, requirements):
    """Check if user meets skill requirements"""
    # Implementation would check various requirements like:
    # - Required level
    # - Prerequisite skills
    # - Required achievements
    # - Required stats/attributes
    return True  # Placeholder

def apply_skill_benefits(db, user_id, benefits):
    """Apply the benefits of unlocking a skill"""
    # Implementation would apply various benefits like:
    # - Stat boosts
    # - Unlock features
    # - Grant rewards
    pass

def grant_quest_rewards(db, user_id, rewards):
    """Grant rewards for completing a quest"""
    if 'xp' in rewards:
        db.execute('''
            INSERT INTO xp_transactions (user_id, amount, source, description)
            VALUES (%s, %s, 'quest_completion', 'Quest completion reward')
        ''', (user_id, rewards['xp']))
    
    if 'collectibles' in rewards:
        for collectible_id in rewards['collectibles']:
            db.execute('''
                INSERT INTO user_collectibles (user_id, collectible_id, acquired_at, source)
                VALUES (%s, %s, NOW(), 'quest_reward')
            ''', (user_id, collectible_id))
    
    # Add other reward types as needed 