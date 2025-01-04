from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from backend.config import get_supabase_client
import logging

auth_bp = Blueprint('auth', __name__)

def serialize_auth_response(response):
    """Helper function to serialize Supabase auth response"""
    if not response:
        return None
    
    return {
        'user': {
            'id': response.user.id if response.user else None,
            'email': response.user.email if response.user else None,
            'created_at': str(response.user.created_at) if response.user else None
        },
        'session': {
            'access_token': response.session.access_token if response.session else None,
            'expires_at': str(response.session.expires_at) if response.session else None
        } if response.session else None
    }

@auth_bp.route('/signup', methods=['POST', 'OPTIONS'])
@cross_origin()
def signup():
    if request.method == 'OPTIONS':
        return jsonify({"message": "OK"}), 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        print(f"Attempting signup for email: {email}")  # Debug log
        
        supabase = get_supabase_client()
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        serialized_response = serialize_auth_response(response)
        print(f"Signup response: {serialized_response}")  # Debug log
        
        return jsonify({
            "message": "User created successfully", 
            "data": serialized_response
        }), 201
    except Exception as e:
        print(f"Signup error: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin()
def login():
    if request.method == 'OPTIONS':
        return jsonify({"message": "OK"}), 200
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        print(f"Attempting login for email: {email}")  # Debug log
        
        supabase = get_supabase_client()
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        serialized_response = serialize_auth_response(response)
        print(f"Login response: {serialized_response}")  # Debug log
        
        return jsonify(serialized_response), 200
    except Exception as e:
        print(f"Login error: {str(e)}")  # Debug log
        return jsonify({"error": str(e)}), 401 