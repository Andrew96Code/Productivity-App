import pytest
from datetime import datetime, timedelta
from backend.models import User, DailyEntry, Habit, HabitLog

def test_user_creation(app):
    """Test creating a new user."""
    with app.app_context():
        user = User(
            email='test@example.com',
            morning_time='06:00',
            afternoon_time='12:00',
            evening_time='18:00'
        )
        user.set_password('test_password')
        
        assert user.email == 'test@example.com'
        assert user.check_password('test_password')
        assert not user.check_password('wrong_password')
        assert user.morning_time == '06:00'
        assert user.afternoon_time == '12:00'
        assert user.evening_time == '18:00'

def test_daily_entry_creation(app, test_user):
    """Test creating a daily entry."""
    with app.app_context():
        entry = DailyEntry(
            user_id=test_user.id,
            date=datetime.now().date(),
            period='morning',
            mood=4,
            energy=5,
            notes='Test entry'
        )
        
        assert entry.user_id == test_user.id
        assert entry.period == 'morning'
        assert entry.mood == 4
        assert entry.energy == 5
        assert entry.notes == 'Test entry'

def test_habit_creation(app, test_user):
    """Test creating a habit."""
    with app.app_context():
        habit = Habit(
            user_id=test_user.id,
            name='Exercise',
            category='wellness',
            description='Daily workout',
            frequency='daily',
            time_of_day='morning'
        )
        
        assert habit.user_id == test_user.id
        assert habit.name == 'Exercise'
        assert habit.category == 'wellness'
        assert habit.description == 'Daily workout'
        assert habit.frequency == 'daily'
        assert habit.time_of_day == 'morning'

def test_habit_log_creation(app, test_user, test_habit):
    """Test creating a habit log."""
    with app.app_context():
        log = HabitLog(
            habit_id=test_habit.id,
            date=datetime.now().date(),
            completed=True,
            notes='Completed morning workout'
        )
        
        assert log.habit_id == test_habit.id
        assert log.completed == True
        assert log.notes == 'Completed morning workout'

def test_user_habits_relationship(app, test_user, test_habit):
    """Test relationship between user and habits."""
    with app.app_context():
        assert test_habit in test_user.habits
        assert test_habit.user == test_user

def test_habit_logs_relationship(app, test_habit, test_habit_log):
    """Test relationship between habit and logs."""
    with app.app_context():
        assert test_habit_log in test_habit.logs
        assert test_habit_log.habit == test_habit

def test_user_daily_entries_relationship(app, test_user, test_daily_entry):
    """Test relationship between user and daily entries."""
    with app.app_context():
        assert test_daily_entry in test_user.daily_entries
        assert test_daily_entry.user == test_user

def test_habit_completion_stats(app, test_user, test_habit):
    """Test habit completion statistics."""
    with app.app_context():
        # Create some habit logs
        today = datetime.now().date()
        for i in range(7):
            log = HabitLog(
                habit_id=test_habit.id,
                date=today - timedelta(days=i),
                completed=i % 2 == 0  # Alternate between completed and not completed
            )
            db.session.add(log)
        db.session.commit()
        
        # Test completion rate
        completion_rate = test_habit.get_completion_rate(days=7)
        assert completion_rate == 4/7  # 4 completed out of 7 days

def test_user_password_hashing(app):
    """Test password hashing functionality."""
    with app.app_context():
        user = User(email='test@example.com')
        user.set_password('test_password')
        
        assert user.password_hash is not None
        assert user.password_hash != 'test_password'
        assert user.check_password('test_password')
        assert not user.check_password('wrong_password') 