"""
Business: Admin panel API for viewing registered users
Args: event - dict with httpMethod, headers, queryStringParameters
      context - object with attributes: request_id, function_name, function_version, memory_limit_in_mb
Returns: HTTP response dict with user list or error
"""

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    cors_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {})
    admin_key = headers.get('x-admin-key') or headers.get('X-Admin-Key')
    
    if admin_key != 'kodein_admin_2025':
        return {
            'statusCode': 403,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Access denied. Invalid admin key.'}),
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
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            limit = int(query_params.get('limit', 100))
            offset = int(query_params.get('offset', 0))
            
            cur.execute(
                """
                SELECT id, username, email, created_at, last_login, is_active 
                FROM users 
                ORDER BY created_at DESC 
                LIMIT %s OFFSET %s
                """,
                (limit, offset)
            )
            users = cur.fetchall()
            
            cur.execute("SELECT COUNT(*) as total FROM users")
            total_result = cur.fetchone()
            total = total_result['total'] if total_result else 0
            
            users_list = []
            for user in users:
                users_list.append({
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'created_at': user['created_at'].isoformat() if user['created_at'] else None,
                    'last_login': user['last_login'].isoformat() if user['last_login'] else None,
                    'is_active': user['is_active']
                })
            
            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({
                    'success': True,
                    'total': total,
                    'limit': limit,
                    'offset': offset,
                    'users': users_list
                }),
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
