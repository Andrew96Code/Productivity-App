import pytest
from datetime import datetime, timedelta
from backend.models import User, DailyEntry, Habit, HabitLog
from sqlalchemy.exc import IntegrityError
import json

def test_concurrent_habit_updates(app, test_user, test_habit):
    """Test handling concurrent updates to the same habit."""
    with app.app_context():
        # Create two logs for the same habit at the same time
        date = datetime.now().date()
        log1 = HabitLog(habit_id=test_habit.id, date=date, completed=True)
        log2 = HabitLog(habit_id=test_habit.id, date=date, completed=False)
        
        db.session.add(log1)
        db.session.commit()
        
        # Second log should fail due to unique constraint
        with pytest.raises(IntegrityError):
            db.session.add(log2)
            db.session.commit()

def test_rate_limiting(client):
    """Test rate limiting on API endpoints."""
    # Make multiple requests in quick succession
    responses = []
    for _ in range(50):
        response = client.post('/login', json={
            'email': 'test@example.com',
            'password': 'test_password'
        })
        responses.append(response)
    
    # At least one response should be rate limited
    assert any(r.status_code == 429 for r in responses)

def test_long_text_input(app, test_user):
    """Test handling extremely long text inputs."""
    with app.app_context():
        # Create a daily entry with very long notes
        long_notes = 'a' * 10000  # 10,000 characters
        entry = DailyEntry(
            user_id=test_user.id,
            date=datetime.now().date(),
            period='morning',
            notes=long_notes
        )
        
        # Should truncate or raise error depending on implementation
        with pytest.raises(ValueError):
            db.session.add(entry)
            db.session.commit()

def test_special_characters(client, auth):
    """Test handling special characters in inputs."""
    auth.login()
    special_chars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~'
    response = client.post('/api/habits', json={
        'name': f'Test Habit {special_chars}',
        'category': 'wellness',
        'description': f'Description with {special_chars}'
    })
    assert response.status_code == 201
    data = json.loads(response.data)
    assert special_chars in data['name']
    assert special_chars in data['description']

def test_timezone_handling(app, test_user):
    """Test handling different timezones."""
    with app.app_context():
        # Create entries for different times
        entry1 = DailyEntry(
            user_id=test_user.id,
            date=datetime.now().date(),
            period='morning',
            created_at=datetime.now()
        )
        
        # Entry for tomorrow in UTC but might be today in some timezones
        entry2 = DailyEntry(
            user_id=test_user.id,
            date=(datetime.now() + timedelta(days=1)).date(),
            period='morning',
            created_at=datetime.now() + timedelta(days=1)
        )
        
        db.session.add_all([entry1, entry2])
        db.session.commit()
        
        # Test fetching today's entries in different timezones
        entries = DailyEntry.query.filter(
            DailyEntry.user_id == test_user.id,
            DailyEntry.date == datetime.now().date()
        ).all()
        
        assert len(entries) == 1
        assert entries[0].date == datetime.now().date()

def test_duplicate_prevention(app, test_user):
    """Test preventing duplicate entries for the same period."""
    with app.app_context():
        date = datetime.now().date()
        entry1 = DailyEntry(
            user_id=test_user.id,
            date=date,
            period='morning'
        )
        db.session.add(entry1)
        db.session.commit()
        
        # Try to create another entry for the same period
        entry2 = DailyEntry(
            user_id=test_user.id,
            date=date,
            period='morning'
        )
        
        with pytest.raises(IntegrityError):
            db.session.add(entry2)
            db.session.commit()

def test_invalid_date_format(client, auth):
    """Test handling invalid date formats."""
    auth.login()
    response = client.post('/api/entries', json={
        'date': 'invalid-date',
        'period': 'morning',
        'mood': 5
    })
    assert response.status_code == 400
    assert b'Invalid date format' in response.data

def test_empty_summary(app, test_user):
    """Test handling empty summaries."""
    with app.app_context():
        # Create an entry with empty fields
        entry = DailyEntry(
            user_id=test_user.id,
            date=datetime.now().date(),
            period='morning',
            notes='',
            mood=None,
            energy=None
        )
        db.session.add(entry)
        db.session.commit()
        
        # Fetch and verify empty fields are handled correctly
        fetched_entry = DailyEntry.query.filter_by(id=entry.id).first()
        assert fetched_entry.notes == ''
        assert fetched_entry.mood is None
        assert fetched_entry.energy is None

def test_session_expiration(client, auth):
    """Test session expiration handling."""
    auth.login()
    
    # Simulate session expiration
    with client.session_transaction() as session:
        session.clear()
    
    response = client.get('/protected')
    assert response.status_code == 401
    assert b'Session expired' in response.data

def test_malformed_json(client, auth):
    """Test handling malformed JSON requests."""
    auth.login()
    response = client.post(
        '/api/habits',
        data='invalid json',
        content_type='application/json'
    )
    assert response.status_code == 400
    assert b'Invalid JSON' in response.data

def test_sql_injection_prevention(client):
    """Test prevention of SQL injection attempts."""
    injection_attempt = "' OR '1'='1"
    response = client.post('/login', json={
        'email': f"test@example.com{injection_attempt}",
        'password': 'test_password'
    })
    assert response.status_code == 401  # Should fail normally, not expose data

def test_xss_prevention(client, auth):
    """Test prevention of XSS attempts."""
    auth.login()
    script_tag = '<script>alert("xss")</script>'
    response = client.post('/api/habits', json={
        'name': f'Test Habit {script_tag}',
        'category': 'wellness'
    })
    assert response.status_code == 201
    data = json.loads(response.data)
    assert script_tag not in data['name']  # Should be escaped 