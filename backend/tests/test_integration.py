from datetime import datetime, timedelta

def test_complete_daily_workflow(client, auth_headers):
    """Test complete daily workflow: morning routine -> afternoon check -> evening review."""
    
    # Morning Routine
    morning_response = client.post('/api/entries', json={
        'period': 'morning',
        'mood': 4,
        'energy': 5,
        'notes': 'Starting the day fresh',
        'focus_score': 90,
        'completed_tasks': 0,
        'total_tasks': 5
    }, headers=auth_headers)
    assert morning_response.status_code == 201
    morning_entry_id = morning_response.json['id']
    
    # Create and complete morning habits
    habit_response = client.post('/api/habits', json={
        'name': 'Morning Exercise',
        'category': 'wellness',
        'is_active': True
    }, headers=auth_headers)
    assert habit_response.status_code == 201
    habit_id = habit_response.json['id']
    
    # Complete habit
    complete_response = client.post(f'/api/habits/{habit_id}/log', json={
        'completed': True,
        'notes': 'Great workout'
    }, headers=auth_headers)
    assert complete_response.status_code == 200
    
    # Afternoon Check-in
    afternoon_response = client.post('/api/entries', json={
        'period': 'afternoon',
        'mood': 3,
        'energy': 4,
        'notes': 'Productive morning',
        'focus_score': 85,
        'completed_tasks': 3,
        'total_tasks': 5
    }, headers=auth_headers)
    assert afternoon_response.status_code == 201
    
    # Evening Review
    evening_response = client.post('/api/entries', json={
        'period': 'evening',
        'mood': 4,
        'energy': 3,
        'notes': 'Good day overall',
        'focus_score': 80,
        'completed_tasks': 5,
        'total_tasks': 5
    }, headers=auth_headers)
    assert evening_response.status_code == 201
    
    # Check daily summary
    summary_response = client.get('/api/summary/daily', headers=auth_headers)
    assert summary_response.status_code == 200
    summary = summary_response.json
    
    # Verify summary calculations
    assert 3 <= summary['mood_average'] <= 4
    assert 3 <= summary['energy_average'] <= 5
    assert 80 <= summary['focus_average'] <= 90
    assert summary['completion_rate'] == 100  # All tasks completed

def test_habit_streak_workflow(client, auth_headers):
    """Test habit streak over multiple days."""
    
    # Create a habit
    habit_response = client.post('/api/habits', json={
        'name': 'Daily Reading',
        'category': 'learning',
        'is_active': True
    }, headers=auth_headers)
    assert habit_response.status_code == 201
    habit_id = habit_response.json['id']
    
    # Log completions for the past 3 days
    today = datetime.utcnow().date()
    for i in range(3):
        date = (today - timedelta(days=i)).isoformat()
        response = client.post(f'/api/habits/{habit_id}/log', json={
            'completed': True,
            'date': date,
            'notes': f'Day {i+1} of reading'
        }, headers=auth_headers)
        assert response.status_code == 200
    
    # Verify streak
    habit_response = client.get(f'/api/habits/{habit_id}', headers=auth_headers)
    assert habit_response.status_code == 200
    assert habit_response.json['streak'] == 3
    assert habit_response.json['total_completions'] == 3

def test_time_based_access(client, auth_headers):
    """Test access to different periods based on time."""
    
    # Helper function to create entry
    def create_entry(period):
        return client.post('/api/entries', json={
            'period': period,
            'mood': 4,
            'energy': 4,
            'notes': f'Test {period}',
            'focus_score': 80,
            'completed_tasks': 1,
            'total_tasks': 1
        }, headers=auth_headers)
    
    # Try to create entries for different periods
    morning = create_entry('morning')
    afternoon = create_entry('afternoon')
    evening = create_entry('evening')
    
    # At least one period should be valid based on current time
    assert any(r.status_code == 201 for r in [morning, afternoon, evening])

def test_data_consistency(client, auth_headers):
    """Test data consistency across different endpoints."""
    
    # Create a habit and log it
    habit_response = client.post('/api/habits', json={
        'name': 'Test Habit',
        'category': 'wellness',
        'is_active': True
    }, headers=auth_headers)
    habit_id = habit_response.json['id']
    
    client.post(f'/api/habits/{habit_id}/log', json={
        'completed': True,
        'notes': 'Test completion'
    }, headers=auth_headers)
    
    # Create a daily entry
    client.post('/api/entries', json={
        'period': 'morning',
        'mood': 4,
        'energy': 4,
        'notes': 'Test entry',
        'focus_score': 80,
        'completed_tasks': 1,
        'total_tasks': 1
    }, headers=auth_headers)
    
    # Check consistency across different views
    daily_summary = client.get('/api/summary/daily', headers=auth_headers)
    weekly_summary = client.get('/api/summary/weekly', headers=auth_headers)
    habits = client.get('/api/habits', headers=auth_headers)
    entries = client.get('/api/entries', headers=auth_headers)
    
    assert daily_summary.status_code == 200
    assert weekly_summary.status_code == 200
    assert habits.status_code == 200
    assert entries.status_code == 200
    
    # Verify data consistency
    assert len(habits.json) > 0
    assert len(entries.json) > 0
    assert daily_summary.json['completion_rate'] > 0
    assert any(day['habits_completed'] > 0 for day in weekly_summary.json['days']) 