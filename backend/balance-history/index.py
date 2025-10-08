'''
Business: Get balance operation history for admin review
Args: event with httpMethod, queryStringParameters (username, limit)
Returns: HTTP response with history records or error
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
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        query_params = event.get('queryStringParameters') or {}
        username = query_params.get('username')
        limit = int(query_params.get('limit', '100'))
        
        if username:
            cursor.execute(
                "SELECT username, amount, balance_before, balance_after, operation_type, description, created_at FROM balance_history WHERE username = %s ORDER BY created_at DESC LIMIT %s",
                (username, limit)
            )
        else:
            cursor.execute(
                "SELECT username, amount, balance_before, balance_after, operation_type, description, created_at FROM balance_history ORDER BY created_at DESC LIMIT %s",
                (limit,)
            )
        
        history = cursor.fetchall()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'history': [
                    {
                        'username': h['username'],
                        'amount': float(h['amount']),
                        'balance_before': float(h['balance_before']),
                        'balance_after': float(h['balance_after']),
                        'operation_type': h['operation_type'],
                        'description': h['description'],
                        'created_at': h['created_at'].isoformat() if h['created_at'] else None
                    } for h in history
                ]
            })
        }
    
    finally:
        cursor.close()
        conn.close()
