from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_migrate import Migrate
from werkzeug.middleware.proxy_fix import ProxyFix
import logging
from logging.handlers import RotatingFileHandler
import os

from .models import db, User, DailyEntry, Habit, HabitLog
from .config import config

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Load config
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Setup rate limiting
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        default_limits=["100 per minute"]
    )
    
    # Setup logging
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('App startup')
    
    # Security headers middleware
    @app.after_request
    def add_security_headers(response):
        for header, value in app.config['SECURITY_HEADERS'].items():
            response.headers[header] = value
        return response
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        app.logger.error(f'Server Error: {error}')
        return jsonify({'error': 'Internal server error'}), 500
    
    # Routes
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/login')
    def login():
        return render_template('login.html')

    @app.route('/app')
    def app_dashboard():
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return render_template('app.html')
    
    # API Routes
    @app.route('/api/auth/login', methods=['POST'])
    @limiter.limit("5 per minute")
    def api_login():
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Missing credentials'}), 400
            
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            session['user_id'] = user.id
            return jsonify({
                'success': True,
                'user': {
                    'email': user.email,
                    'timePreferences': {
                        'morning': user.morning_time,
                        'afternoon': user.afternoon_time,
                        'evening': user.evening_time
                    }
                }
            })
        return jsonify({'error': 'Invalid credentials'}), 401

    @app.route('/api/auth/signup', methods=['POST'])
    @limiter.limit("3 per hour")
    def api_signup():
        data = request.get_json()
        if not data or not all(k in data for k in ['email', 'password', 'timePreferences']):
            return jsonify({'error': 'Missing required fields'}), 400
            
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
            
        user = User(
            email=data['email'],
            morning_time=data['timePreferences']['morning'],
            afternoon_time=data['timePreferences']['afternoon'],
            evening_time=data['timePreferences']['evening']
        )
        user.set_password(data['password'])
        
        try:
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return jsonify({'success': True})
        except Exception as e:
            db.session.rollback()
            app.logger.error(f'Error creating user: {e}')
            return jsonify({'error': 'Could not create account'}), 500

    @app.route('/api/auth/logout', methods=['POST'])
    def api_logout():
        session.clear()
        return jsonify({'success': True})
    
    return app

# Create app instance
app = create_app(os.getenv('FLASK_ENV', 'default'))

if __name__ == '__main__':
    app.run() 