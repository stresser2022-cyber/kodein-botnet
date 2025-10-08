'''
Business: Admin API to manage user balances (add, get, list all users)
Args: event with httpMethod, body, headers (X-Admin-Key for auth)
Returns: HTTP response with balance data or error
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    admin_key = headers.get('x-admin-key') or headers.get('X-Admin-Key')
    
    if admin_key != os.environ.get('ADMIN_KEY'):
        return {
            'statusCode': 403,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            username = query_params.get('username')
            
            if username:
                cursor.execute(
                    "SELECT username, balance, created_at, updated_at FROM user_balances WHERE username = %s",
                    (username,)
                )
                user = cursor.fetchone()
                
                if not user:
                    cursor.execute(
                        "INSERT INTO user_balances (username, balance) VALUES (%s, 0.00) RETURNING username, balance, created_at, updated_at",
                        (username,)
                    )
                    conn.commit()
                    user = cursor.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'username': user['username'],
                        'balance': float(user['balance'])
                    })
                }
            else:
                cursor.execute(
                    "SELECT username, balance, created_at, updated_at FROM user_balances ORDER BY username"
                )
                users = cursor.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'users': [{'username': u['username'], 'balance': float(u['balance'])} for u in users]
                    })
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            username = body_data.get('username')
            amount = body_data.get('amount')
            
            if not username or amount is None:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Username and amount required'})
                }
            
            cursor.execute(
                "SELECT balance FROM user_balances WHERE username = %s",
                (username,)
            )
            existing = cursor.fetchone()
            
            if existing:
                new_balance = float(existing['balance']) + float(amount)
                cursor.execute(
                    "UPDATE user_balances SET balance = %s, updated_at = CURRENT_TIMESTAMP WHERE username = %s RETURNING balance",
                    (new_balance, username)
                )
            else:
                cursor.execute(
                    "INSERT INTO user_balances (username, balance) VALUES (%s, %s) RETURNING balance",
                    (username, amount)
                )
            
            conn.commit()
            result = cursor.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'username': username,
                    'balance': float(result['balance'])
                })
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
