'''
Business: User authentication and registration API
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
Returns: HTTP response dict with statusCode, headers, body
'''

import json
import os
import bcrypt
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime, timedelta
import hashlib

JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

rate_limit_store: Dict[str, list] = {}
RATE_LIMIT_MAX_ATTEMPTS = 10
RATE_LIMIT_WINDOW_MINUTES = 5

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    import hashlib
    # Support legacy SHA256 hashes (64 chars hex)
    if len(password_hash) == 64:
        try:
            int(password_hash, 16)
            return hashlib.sha256(password.encode()).hexdigest() == password_hash
        except ValueError:
            pass
    # Bcrypt hashes start with $2b$
    if password_hash.startswith('$2b$'):
        try:
            return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
        except Exception:
            return False
    return False

def is_rate_limited(ip: str, username: str) -> bool:
    key = hashlib.sha256(f"{ip}:{username}".encode()).hexdigest()
    cutoff = datetime.utcnow() - timedelta(minutes=5)
    
    if key in rate_limit_store:
        rate_limit_store[key] = [t for t in rate_limit_store[key] if t > cutoff]
        if not rate_limit_store[key]:
            del rate_limit_store[key]
        return len(rate_limit_store.get(key, [])) >= 10
    return False

def record_attempt(ip: str, username: str):
    key = hashlib.sha256(f"{ip}:{username}".encode()).hexdigest()
    if key not in rate_limit_store:
        rate_limit_store[key] = []
    rate_limit_store[key].append(datetime.utcnow())

def create_jwt_token(user_id: int, username: str) -> str:
    jwt_secret = os.environ.get('JWT_SECRET')
    if not jwt_secret:
        raise ValueError('JWT_SECRET not configured')
    
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, jwt_secret, algorithm=JWT_ALGORITHM)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    allowed_origins = os.environ.get('ALLOWED_ORIGINS', '*')
    origin = event.get('headers', {}).get('origin', '')
    
    if allowed_origins == '*':
        allow_origin = '*'
    else:
        allowed_list = [o.strip() for o in allowed_origins.split(',')]
        allow_origin = origin if origin in allowed_list else allowed_list[0] if allowed_list else '*'
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': allow_origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                username = body_data.get('username', '').strip()
                password = body_data.get('password', '').strip()
                
                if not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'All fields are required'}),
                        'isBase64Encoded': False
                    }
                
                import re
                if not re.match(r'^[a-zA-Z0-9_-]{3,50}$', username):
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Username must be 3-50 characters and contain only letters, numbers, underscore, or dash'}),
                        'isBase64Encoded': False
                    }
                
                if len(password) < 6:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Password must be at least 6 characters'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT id FROM users WHERE username = %s", (username,))
                existing = cur.fetchone()
                
                if existing:
                    return {
                        'statusCode': 409,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'User with this username already exists'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                email = f"{username}@temp.local"
                
                cur.execute(
                    "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id, username, created_at",
                    (username, email, password_hash)
                )
                user = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'success': True,
                        'message': 'Account created successfully',
                        'user': {
                            'id': user['id'],
                            'username': user['username'],
                            'created_at': user['created_at'].isoformat() if user['created_at'] else None
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                username = body_data.get('username', '').strip()
                password = body_data.get('password', '').strip()
                
                if not username or not password:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Username and password are required'}),
                        'isBase64Encoded': False
                    }
                
                client_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
                
                if is_rate_limited(client_ip, username):
                    return {
                        'statusCode': 429,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Too many login attempts. Please try again in 5 minutes.'}),
                        'isBase64Encoded': False
                    }
                
                record_attempt(client_ip, username)
                
                cur.execute(
                    "SELECT id, username, password_hash, is_active FROM users WHERE username = %s",
                    (username,)
                )
                user = cur.fetchone()
                
                if not user or not verify_password(password, user['password_hash']):
                    return {
                        'statusCode': 401,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Invalid username or password'}),
                        'isBase64Encoded': False
                    }
                
                if not user['is_active']:
                    return {
                        'statusCode': 403,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Account is inactive'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute(
                    "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s",
                    (user['id'],)
                )
                conn.commit()
                
                token = create_jwt_token(user['id'], user['username'])
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'success': True,
                        'message': 'Logged in successfully',
                        'token': token,
                        'user': {
                            'id': user['id'],
                            'username': user['username']
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': cors_headers,
                    'body': json.dumps({'error': 'Invalid action'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()