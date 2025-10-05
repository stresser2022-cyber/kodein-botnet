'''
Business: Система регистрации и авторизации пользователей с JWT токенами
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами: request_id, function_name
Returns: HTTP response с JWT токеном или ошибкой
'''

import json
import os
import hashlib
import hmac
import base64
import re
from typing import Dict, Any, Optional
from datetime import datetime, timedelta

try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    import bcrypt
except ImportError:
    psycopg2 = None
    bcrypt = None


def create_jwt(user_id: int, username: str, secret: str) -> str:
    header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": int((datetime.utcnow() + timedelta(days=7)).timestamp())
    }
    
    header_b64 = base64.urlsafe_b64encode(
        json.dumps(header).encode()
    ).decode().rstrip('=')
    
    payload_b64 = base64.urlsafe_b64encode(
        json.dumps(payload).encode()
    ).decode().rstrip('=')
    
    message = f"{header_b64}.{payload_b64}"
    signature = hmac.new(
        secret.encode(),
        message.encode(),
        hashlib.sha256
    ).digest()
    
    signature_b64 = base64.urlsafe_b64encode(signature).decode().rstrip('=')
    
    return f"{message}.{signature_b64}"


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    try:
        if hashed.startswith('$2b$') or hashed.startswith('$2a$'):
            return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        pass
    
    sha256_hash = hashlib.sha256(password.encode()).hexdigest()
    return sha256_hash == hashed

def validate_username(username: str) -> bool:
    if len(username) < 3 or len(username) > 20:
        return False
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        return False
    return True

def validate_password(password: str) -> bool:
    if len(password) < 8:
        return False
    return True


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON'}),
            'isBase64Encoded': False
        }
    
    action = body_data.get('action')
    username = body_data.get('username', '').strip()
    password = body_data.get('password', '').strip()
    
    if not username or not password:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Username and password required'}),
            'isBase64Encoded': False
        }
    
    if not validate_username(username):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid username format. Use 3-20 alphanumeric characters'}),
            'isBase64Encoded': False
        }
    
    if not validate_password(password):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Password must be at least 8 characters'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    jwt_secret = os.environ.get('JWT_SECRET', 'default-secret-key')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if action == 'register':
        cursor.execute(
            "SELECT id FROM users WHERE username = %s",
            (username,)
        )
        existing = cursor.fetchone()
        
        if existing:
            cursor.close()
            conn.close()
            return {
                'statusCode': 409,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Username already exists'}),
                'isBase64Encoded': False
            }
        
        password_hash = hash_password(password)
        email = f"{username}@local.domain"
        
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id, username, created_at",
            (username, email, password_hash)
        )
        user = cursor.fetchone()
        conn.commit()
        
        token = create_jwt(user['id'], user['username'], jwt_secret)
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'token': token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'created_at': user['created_at'].isoformat()
                }
            }),
            'isBase64Encoded': False
        }
    
    elif action == 'login':
        cursor.execute(
            "SELECT id, username, password_hash, created_at FROM users WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()
        
        if not user or not verify_password(password, user['password_hash']):
        
            cursor.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid username or password'}),
                'isBase64Encoded': False
            }
        
        cursor.close()
        conn.close()
        
        token = create_jwt(user['id'], user['username'], jwt_secret)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'token': token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'created_at': user['created_at'].isoformat()
                }
            }),
            'isBase64Encoded': False
        }
    
    else:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid action. Use "register" or "login"'}),
            'isBase64Encoded': False
        }