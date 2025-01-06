import pytest
from flask import url_for
from backend.models import User

def test_signup_success(client, app):
    """Test successful user signup."""
    with app.test_request_context():
        response = client.post('/signup', json={
            'email': 'test@example.com',
            'password': 'test_password',
            'morning_time': '06:00',
            'afternoon_time': '12:00',
            'evening_time': '18:00'
        })
        assert response.status_code == 201
        assert b'User created successfully' in response.data
        
        # Verify user was created in database
        user = User.query.filter_by(email='test@example.com').first()
        assert user is not None
        assert user.check_password('test_password')

def test_signup_duplicate_email(client, app):
    """Test signup with existing email."""
    # Create initial user
    with app.test_request_context():
        client.post('/signup', json={
            'email': 'test@example.com',
            'password': 'test_password',
            'morning_time': '06:00',
            'afternoon_time': '12:00',
            'evening_time': '18:00'
        })
        
        # Try to create user with same email
        response = client.post('/signup', json={
            'email': 'test@example.com',
            'password': 'different_password',
            'morning_time': '07:00',
            'afternoon_time': '13:00',
            'evening_time': '19:00'
        })
        assert response.status_code == 400
        assert b'Email already registered' in response.data

def test_login_success(client, app):
    """Test successful login."""
    # Create user first
    with app.test_request_context():
        client.post('/signup', json={
            'email': 'test@example.com',
            'password': 'test_password',
            'morning_time': '06:00',
            'afternoon_time': '12:00',
            'evening_time': '18:00'
        })
        
        # Try to login
        response = client.post('/login', json={
            'email': 'test@example.com',
            'password': 'test_password'
        })
        assert response.status_code == 200
        assert b'Logged in successfully' in response.data

def test_login_invalid_password(client, app):
    """Test login with wrong password."""
    # Create user first
    with app.test_request_context():
        client.post('/signup', json={
            'email': 'test@example.com',
            'password': 'test_password',
            'morning_time': '06:00',
            'afternoon_time': '12:00',
            'evening_time': '18:00'
        })
        
        # Try to login with wrong password
        response = client.post('/login', json={
            'email': 'test@example.com',
            'password': 'wrong_password'
        })
        assert response.status_code == 401
        assert b'Invalid email or password' in response.data

def test_login_nonexistent_user(client):
    """Test login with non-existent user."""
    response = client.post('/login', json={
        'email': 'nonexistent@example.com',
        'password': 'test_password'
    })
    assert response.status_code == 401
    assert b'Invalid email or password' in response.data

def test_logout(client, auth):
    """Test logout functionality."""
    auth.login()
    response = client.post('/logout')
    assert response.status_code == 200
    assert b'Logged out successfully' in response.data

def test_protected_route_authenticated(client, auth):
    """Test accessing protected route when authenticated."""
    auth.login()
    response = client.get('/protected')
    assert response.status_code == 200

def test_protected_route_unauthenticated(client):
    """Test accessing protected route when not authenticated."""
    response = client.get('/protected')
    assert response.status_code == 401 