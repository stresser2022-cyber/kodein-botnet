import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage user settings (update email, password, notifications)
    Args: event - dict with httpMethod, body, headers
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    # Get user ID from header
    headers = event.get('headers', {})
    user_id = headers.get('X-User-Id') or headers.get('x-user-id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'User ID required'})
        }
    
    # Connect to database
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            # Get user settings (user_id can be username or numeric id)
            cursor.execute(
                "SELECT email, plan, plan_expires_at, max_concurrents, max_duration FROM users WHERE username = %s OR id::text = %s",
                (user_id, user_id)
            )
            user = cursor.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'User not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'email': user['email'],
                    'plan': user.get('plan', 'free'),
                    'plan_expires_at': user['plan_expires_at'].isoformat() if user.get('plan_expires_at') else None,
                    'max_concurrents': user.get('max_concurrents', 1),
                    'max_duration': user.get('max_duration', 60)
                })
            }
        
        elif method == 'PUT':
            # Update user settings
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'update_email':
                new_email = body_data.get('email')
                if not new_email:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'Email is required'})
                    }
                
                cursor.execute(
                    "UPDATE users SET email = %s WHERE username = %s OR id::text = %s",
                    (new_email, user_id, user_id)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'message': 'Email updated successfully',
                        'email': new_email
                    })
                }
            

            
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Invalid action'})
                }
        
        elif method == 'DELETE':
            # Delete user account
            cursor.execute("DELETE FROM users WHERE username = %s OR id::text = %s", (user_id, user_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'message': 'Account deleted successfully'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cursor.close()
        conn.close()