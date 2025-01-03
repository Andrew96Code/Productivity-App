from flask import Flask, jsonify
from flask_cors import CORS
from backend.routes.reporting import reporting_bp
from backend.routes.auth import auth_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(reporting_bp, url_prefix='/reporting')
    
    # Root route
    @app.route('/')
    def home():
        return jsonify({
            'status': 'ok',
            'message': 'Productivity App API is running',
            'version': '1.0.0'
        })
    
    return app 