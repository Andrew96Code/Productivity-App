from flask import Flask, render_template, send_from_directory
from backend.routes.prize_draw import prize_draw_bp
from backend.routes.auth import auth_bp
from backend.routes.reporting import reporting_bp
from backend.routes.quiz import quiz_bp
from backend.config import get_supabase_client
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__, 
                static_folder='static',
                template_folder='templates')
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(reporting_bp, url_prefix='/reporting')
    app.register_blueprint(prize_draw_bp, url_prefix='/prize-draw')
    app.register_blueprint(quiz_bp, url_prefix='/quiz')
    
    @app.route('/')
    def index():
        return render_template('index.html')
    
    @app.route('/static/<path:filename>')
    def serve_static(filename):
        return send_from_directory(app.static_folder, filename)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True) 