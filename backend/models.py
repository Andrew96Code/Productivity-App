from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    """User model."""
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    morning_time = db.Column(db.String(5), nullable=False, default='06:00')
    afternoon_time = db.Column(db.String(5), nullable=False, default='12:00')
    evening_time = db.Column(db.String(5), nullable=False, default='18:00')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    is_admin = db.Column(db.Boolean, nullable=False, default=False)
    
    habits = db.relationship('Habit', backref='user', lazy=True)
    daily_entries = db.relationship('DailyEntry', backref='user', lazy=True)
    
    def set_password(self, password):
        """Set password hash."""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password against hash."""
        return check_password_hash(self.password_hash, password)

class Habit(db.Model):
    """Habit model."""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    frequency = db.Column(db.String(20), nullable=False, default='daily')
    time_of_day = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    
    logs = db.relationship('HabitLog', backref='habit', lazy=True)
    
    def get_completion_rate(self, days=7):
        """Calculate completion rate for the last n days."""
        recent_logs = [log for log in self.logs if (datetime.utcnow().date() - log.date).days <= days]
        if not recent_logs:
            return 0
        return sum(1 for log in recent_logs if log.completed) / len(recent_logs)

class HabitLog(db.Model):
    """Habit log model."""
    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('habit_id', 'date', name='unique_habit_date'),
    )

class DailyEntry(db.Model):
    """Daily entry model."""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    period = db.Column(db.String(20), nullable=False)
    mood = db.Column(db.Integer)
    energy = db.Column(db.Integer)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    __table_args__ = (
        db.UniqueConstraint('user_id', 'date', 'period', name='unique_user_date_period'),
    ) 