'''
Business: Purchase plan by deducting balance from user account
Args: event with body containing username, plan_id, amount
Returns: HTTP response with updated balance or error
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    username = body_data.get('username')
    amount = body_data.get('amount')
    
    if not username or not amount:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Username and amount required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cursor.execute(
            "SELECT balance FROM user_balances WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()
        
        if not user:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'User balance not found'})
            }
        
        current_balance = float(user['balance'])
        
        if current_balance < float(amount):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Insufficient balance'})
            }
        
        new_balance = current_balance - float(amount)
        
        cursor.execute(
            "UPDATE user_balances SET balance = %s, updated_at = CURRENT_TIMESTAMP WHERE username = %s RETURNING balance",
            (new_balance, username)
        )
        
        result = cursor.fetchone()
        
        cursor.execute(
            "INSERT INTO balance_history (username, amount, balance_before, balance_after, operation_type, description) VALUES (%s, %s, %s, %s, %s, %s)",
            (username, -float(amount), current_balance, new_balance, 'plan_purchase', f"Plan purchase -${float(amount)}")
        )
        
        conn.commit()
        
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
    
    finally:
        cursor.close()
        conn.close()
