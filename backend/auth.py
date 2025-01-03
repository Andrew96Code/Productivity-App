from functools import wraps
from flask import request, jsonify
import jwt

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No authorization header'}), 401
        
        try:
            # Remove 'Bearer ' from the header
            token = auth_header.split(' ')[1]
            # Replace this with your actual JWT secret key
            payload = jwt.decode(token, 'your_jwt_secret', algorithms=['HS256'])
            user_id = payload['user_id']
            return f(user_id, *args, **kwargs)
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return decorated 