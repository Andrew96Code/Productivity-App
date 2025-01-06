import os
from datetime import timedelta

class Config:
    # Basic Flask Config
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    PERMANENT_SESSION_LIFETIME = timedelta(days=31)
    
    # Security Headers
    SECURITY_HEADERS = {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; font-src 'self'; img-src 'self' data:; connect-src 'self'"
    }
    
    # Database Config
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Rate Limiting
    RATELIMIT_DEFAULT = "100 per minute"
    RATELIMIT_STORAGE_URL = "memory://"
    
    # Session Config
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # CORS Settings
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    # Force HTTPS in production
    PREFERRED_URL_SCHEME = 'https'
    # Stricter session settings
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    # Production database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    # Redis for rate limiting in production
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL')

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False
    # Less strict security for development
    SESSION_COOKIE_SECURE = False
    
class TestingConfig(Config):
    TESTING = True
    DEBUG = True
    # Use in-memory SQLite for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    # Disable CSRF for testing
    WTF_CSRF_ENABLED = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
} 