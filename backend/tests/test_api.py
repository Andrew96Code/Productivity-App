from datetime import datetime

def test_create_habit(client, auth_headers):
    """Test creating a new habit."""
    response = client.post('/api/habits', json={
        'name': 'Morning Meditation',
        'category': 'wellness',
        'is_active': True
    }, headers=auth_headers)
    
    assert response.status_code == 201
    assert response.json['name'] == 'Morning Meditation'
    assert response.json['category'] == 'wellness'

def test_get_habits(client, auth_headers, test_habit):
    """Test getting user's habits."""
    response = client.get('/api/habits', headers=auth_headers)
    
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) > 0
    assert response.json[0]['name'] == test_habit.name

def test_update_habit(client, auth_headers, test_habit):
    """Test updating a habit."""
    response = client.put(f'/api/habits/{test_habit.id}', json={
        'name': 'Updated Habit',
        'is_active': False
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['name'] == 'Updated Habit'
    assert response.json['is_active'] == False

def test_delete_habit(client, auth_headers, test_habit):
    """Test deleting a habit."""
    response = client.delete(f'/api/habits/{test_habit.id}', headers=auth_headers)
    assert response.status_code == 204

def test_create_daily_entry(client, auth_headers):
    """Test creating a daily entry."""
    response = client.post('/api/entries', json={
        'period': 'morning',
        'mood': 4,
        'energy': 3,
        'notes': 'Feeling productive',
        'focus_score': 85,
        'completed_tasks': 2,
        'total_tasks': 5
    }, headers=auth_headers)
    
    assert response.status_code == 201
    assert response.json['period'] == 'morning'
    assert response.json['mood'] == 4

def test_get_daily_entries(client, auth_headers, test_daily_entry):
    """Test getting user's daily entries."""
    response = client.get('/api/entries', headers=auth_headers)
    
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) > 0
    assert response.json[0]['period'] == test_daily_entry.period

def test_get_daily_summary(client, auth_headers, test_daily_entry):
    """Test getting daily summary."""
    response = client.get('/api/summary/daily', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'mood_average' in response.json
    assert 'energy_average' in response.json
    assert 'focus_average' in response.json
    assert 'completion_rate' in response.json

def test_get_weekly_summary(client, auth_headers, test_daily_entry):
    """Test getting weekly summary."""
    response = client.get('/api/summary/weekly', headers=auth_headers)
    
    assert response.status_code == 200
    assert 'days' in response.json
    assert isinstance(response.json['days'], list)
    assert 'completion_rate' in response.json

def test_unauthorized_access(client):
    """Test accessing endpoints without authentication."""
    endpoints = [
        ('GET', '/api/habits'),
        ('POST', '/api/habits'),
        ('GET', '/api/entries'),
        ('POST', '/api/entries'),
        ('GET', '/api/summary/daily')
    ]
    
    for method, endpoint in endpoints:
        if method == 'GET':
            response = client.get(endpoint)
        else:
            response = client.post(endpoint)
        assert response.status_code == 401

def test_invalid_habit_data(client, auth_headers):
    """Test creating habit with invalid data."""
    response = client.post('/api/habits', json={
        'category': 'wellness'  # Missing required name field
    }, headers=auth_headers)
    
    assert response.status_code == 400
    assert 'error' in response.json

def test_invalid_entry_data(client, auth_headers):
    """Test creating daily entry with invalid data."""
    response = client.post('/api/entries', json={
        'mood': 6,  # Invalid mood value (should be 1-5)
        'period': 'morning'
    }, headers=auth_headers)
    
    assert response.status_code == 400
    assert 'error' in response.json

def test_habit_streak_update(client, auth_headers, test_habit):
    """Test habit streak updates correctly."""
    # Log habit completion for today
    response = client.post(f'/api/habits/{test_habit.id}/log', json={
        'completed': True,
        'notes': 'Completed today'
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['streak'] == 1
    
    # Log habit completion for yesterday
    yesterday = datetime.utcnow().date().isoformat()
    response = client.post(f'/api/habits/{test_habit.id}/log', json={
        'completed': True,
        'notes': 'Completed yesterday',
        'date': yesterday
    }, headers=auth_headers)
    
    assert response.status_code == 200
    assert response.json['streak'] == 2 