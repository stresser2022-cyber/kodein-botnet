"""
Business: User authentication and registration API
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
Returns: HTTP response dict with statusCode, headers, body
"""

import json
import os
import hashlib
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
                email = body_data.get('email', '').strip()
                password = body_data.get('password', '').strip()
                
                if not username or not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'All fields are required'}),
                        'isBase64Encoded': False
                    }
                
                if len(username) < 3 or len(username) > 50:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Username must be 3-50 characters'}),
                        'isBase64Encoded': False
                    }
                
                if len(password) < 6:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Password must be at least 6 characters'}),
                        'isBase64Encoded': False
                    }
                
                cur.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
                existing = cur.fetchone()
                
                if existing:
                    return {
                        'statusCode': 409,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'User with this email or username already exists'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id, username, email, created_at",
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
                            'email': user['email'],
                            'created_at': user['created_at'].isoformat() if user['created_at'] else None
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                email = body_data.get('email', '').strip()
                password = body_data.get('password', '').strip()
                
                if not email or not password:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Email and password are required'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id, username, email, is_active FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Invalid email or password'}),
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
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'success': True,
                        'message': 'Logged in successfully',
                        'user': {
                            'id': user['id'],
                            'username': user['username'],
                            'email': user['email']
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
