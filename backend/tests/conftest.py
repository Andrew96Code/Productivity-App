import os
import tempfile
import pytest
from datetime import datetime
from backend import create_app
from backend.models import db, User, DailyEntry, Habit, HabitLog

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': f'sqlite:///{db_path}',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'SECRET_KEY': 'test_secret_key'
    })
    
    # Create the database and load test data
    with app.app_context():
        db.create_all()
        yield app
    
    # Cleanup after test
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test CLI runner for the app."""
    return app.test_cli_runner()

@pytest.fixture
def test_user(app):
    """Create a test user."""
    with app.app_context():
        user = User(
            email='test@example.com',
            morning_time='06:00',
            afternoon_time='12:00',
            evening_time='18:00'
        )
        user.set_password('test_password')
        db.session.add(user)
        db.session.commit()
        return user

@pytest.fixture
def test_habit(app, test_user):
    """Create a test habit."""
    with app.app_context():
        habit = Habit(
            user_id=test_user.id,
            name='Test Habit',
            category='wellness',
            description='Test habit description',
            frequency='daily',
            time_of_day='morning'
        )
        db.session.add(habit)
        db.session.commit()
        return habit

@pytest.fixture
def test_habit_log(app, test_habit):
    """Create a test habit log."""
    with app.app_context():
        log = HabitLog(
            habit_id=test_habit.id,
            date=datetime.now().date(),
            completed=True,
            notes='Test completion'
        )
        db.session.add(log)
        db.session.commit()
        return log

@pytest.fixture
def test_daily_entry(app, test_user):
    """Create a test daily entry."""
    with app.app_context():
        entry = DailyEntry(
            user_id=test_user.id,
            date=datetime.now().date(),
            period='morning',
            mood=4,
            energy=5,
            notes='Test entry'
        )
        db.session.add(entry)
        db.session.commit()
        return entry

class AuthActions:
    def __init__(self, client):
        self._client = client
        
    def login(self, email='test@example.com', password='test_password'):
        return self._client.post('/login', json={
            'email': email,
            'password': password
        })
        
    def logout(self):
        return self._client.post('/logout')

@pytest.fixture
def auth(client):
    """Authentication helper."""
    return AuthActions(client) 