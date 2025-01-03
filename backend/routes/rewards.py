from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
from backend.config import get_supabase_client

rewards_bp = Blueprint('rewards', __name__)

@rewards_bp.route('/achievements', methods=['GET'])
def get_achievements():
    """Get all achievements and user's progress."""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'User ID is required'}), 400
    
    try:
        supabase = get_supabase_client()
        
        # Get all achievements
        achievements_response = supabase.table('achievements')\
            .select('*')\
            .execute()
        
        if not achievements_response:
            print(f"No response from Supabase achievements table for user {user_id}")
            return jsonify({
                'success': True,
                'data': []
            })

        # Get user's progress
        progress_response = supabase.table('user_achievements')\
            .select('*')\
            .eq('user_id', user_id)\
            .execute()
        
        if not progress_response:
            print(f"No response from Supabase user_achievements table for user {user_id}")
            progress_response.data = []
        
        # Combine achievements with user progress
        achievements = achievements_response.data or []
        progress = {p['achievement_id']: p for p in (progress_response.data or [])}
        
        # Ensure each achievement has the required fields
        for achievement in achievements:
            user_progress = progress.get(achievement['id'], {})
            achievement['progress'] = user_progress.get('progress', 0)
            achievement['completed'] = user_progress.get('completed_at') is not None
            # Add default values for required fields if they don't exist
            achievement['requirement_value'] = achievement.get('requirement_value', 1)
            achievement['points_reward'] = achievement.get('points_reward', 0)
            achievement['badge_icon'] = achievement.get('badge_icon', '🏆')
            achievement['description'] = achievement.get('description', '')
            achievement['category'] = achievement.get('category', 'other')
        
        return jsonify({
            'success': True,
            'data': achievements
        })
    except Exception as e:
        print(f"Error in get_achievements for user {user_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while fetching achievements',
            'details': str(e)
        }), 500

@rewards_bp.route('/rewards', methods=['GET'])
def get_rewards():
    """Get all available rewards."""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'error': 'User ID is required'}), 400
    
    try:
        supabase = get_supabase_client()
        
        # Get all rewards
        rewards_response = supabase.table('rewards')\
            .select('*')\
            .execute()

        if not rewards_response:
            print(f"No response from Supabase rewards table for user {user_id}")
            return jsonify({
                'success': True,
                'data': []
            })
        
        # Get user's redemptions
        redemptions_response = supabase.table('reward_redemptions')\
            .select('*')\
            .eq('user_id', user_id)\
            .execute()

        if not redemptions_response:
            print(f"No response from Supabase reward_redemptions table for user {user_id}")
            redemptions_response.data = []
        
        # Filter out one-time rewards that user has already redeemed
        rewards = rewards_response.data or []
        redeemed_rewards = {r['reward_id'] for r in (redemptions_response.data or [])}
        available_rewards = []
        
        for reward in rewards:
            # Ensure all required fields exist
            reward['title'] = reward.get('title', 'Unnamed Reward')
            reward['description'] = reward.get('description', '')
            reward['points_cost'] = int(reward.get('points_cost', 0))
            reward['availability'] = reward.get('availability', 'unlimited')
            reward['stock'] = int(reward.get('stock', 0))
            
            # Only include if it's not a one-time redeemed reward
            if reward['availability'] != 'one_time' or reward['id'] not in redeemed_rewards:
                available_rewards.append(reward)
        
        return jsonify({
            'success': True,
            'data': available_rewards
        })
    except Exception as e:
        print(f"Error in get_rewards for user {user_id}: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while fetching rewards',
            'details': str(e)
        }), 500

@rewards_bp.route('/rewards/<reward_id>/redeem', methods=['POST'])
def redeem_reward(reward_id):
    """Redeem a reward."""
    data = request.get_json()
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    try:
        supabase = get_supabase_client()
        
        # Get reward details
        reward_response = supabase.table('rewards')\
            .select('*')\
            .eq('id', reward_id)\
            .single()\
            .execute()
        
        reward = reward_response.data
        if not reward:
            return jsonify({'error': 'Reward not found'}), 404
        
        # Check if one-time reward is already redeemed
        if reward['availability'] == 'one_time':
            redemption_response = supabase.table('reward_redemptions')\
                .select('*')\
                .eq('user_id', user_id)\
                .eq('reward_id', reward_id)\
                .execute()
            
            if redemption_response.data:
                return jsonify({'error': 'Reward already redeemed'}), 400
        
        # Check if limited reward is in stock
        if reward['availability'] == 'limited' and reward['stock'] <= 0:
            return jsonify({'error': 'Reward out of stock'}), 400
        
        # Get user's current points
        points_response = supabase.rpc('get_user_points', {'user_id_param': user_id}).execute()
        current_points = points_response.data
        
        if current_points < reward['points_cost']:
            return jsonify({'error': 'Insufficient points'}), 400
        
        # Create redemption record and deduct points
        redemption_response = supabase.table('reward_redemptions').insert({
            'user_id': user_id,
            'reward_id': reward_id,
            'points_spent': reward['points_cost']
        }).execute()
        
        # Deduct points
        supabase.table('points_log').insert({
            'user_id': user_id,
            'points': -reward['points_cost'],
            'reason': f'Redeemed reward: {reward["title"]}',
            'category': 'reward_redemption'
        }).execute()
        
        # Update stock if limited availability
        if reward['availability'] == 'limited':
            supabase.table('rewards')\
                .update({'stock': reward['stock'] - 1})\
                .eq('id', reward_id)\
                .execute()
        
        return jsonify({
            'success': True,
            'data': redemption_response.data[0]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rewards_bp.route('/achievements/check', methods=['POST'])
def check_achievements():
    """Check and update achievement progress."""
    data = request.get_json()
    user_id = data.get('user_id')
    category = data.get('category')
    action_type = data.get('type')
    value = data.get('value', 1)
    
    if not all([user_id, category, action_type]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        supabase = get_supabase_client()
        
        # Get relevant achievements
        achievements_response = supabase.table('achievements')\
            .select('*')\
            .eq('category', category)\
            .execute()
        
        achievements = achievements_response.data
        completed_achievements = []
        
        for achievement in achievements:
            # Get or create user achievement progress
            progress_response = supabase.table('user_achievements')\
                .select('*')\
                .eq('user_id', user_id)\
                .eq('achievement_id', achievement['id'])\
                .execute()
            
            user_achievement = progress_response.data[0] if progress_response.data else None
            
            # Skip if already completed
            if user_achievement and user_achievement.get('completed_at'):
                continue
            
            # Calculate new progress based on achievement type
            if achievement['requirement_type'] == action_type:
                current_progress = user_achievement['progress'] if user_achievement else 0
                new_progress = current_progress + value
                
                # Check if achievement is completed
                if new_progress >= achievement['requirement_value']:
                    completed_achievements.append(achievement)
                    new_progress = achievement['requirement_value']
                    completed_at = datetime.now(timezone.utc)
                else:
                    completed_at = None
                
                # Update or create progress record
                supabase.table('user_achievements')\
                    .upsert({
                        'user_id': user_id,
                        'achievement_id': achievement['id'],
                        'progress': new_progress,
                        'completed_at': completed_at
                    })\
                    .execute()
        
        # Award points for completed achievements
        for achievement in completed_achievements:
            supabase.table('points_log').insert({
                'user_id': user_id,
                'points': achievement['points_reward'],
                'reason': f'Achievement unlocked: {achievement["title"]}',
                'category': 'achievement'
            }).execute()
        
        return jsonify({
            'success': True,
            'data': {
                'completed_achievements': completed_achievements
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500 