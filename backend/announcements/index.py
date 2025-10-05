import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage announcements (create, list, delete) for admin panel
    Args: event - dict with httpMethod, body, headers
          context - object with request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    admin_key = headers.get('X-Admin-Key') or headers.get('x-admin-key')
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            cursor.execute(
                "SELECT id, title, message, type, created_at, is_active FROM announcements WHERE is_active = true ORDER BY created_at DESC"
            )
            announcements = cursor.fetchall()
            
            result = []
            for ann in announcements:
                result.append({
                    'id': ann['id'],
                    'title': ann['title'],
                    'message': ann['message'],
                    'type': ann['type'],
                    'created_at': ann['created_at'].isoformat() if ann['created_at'] else None,
                    'is_active': ann['is_active']
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'announcements': result})
            }
        
        if method == 'POST':
            expected_admin_key = os.environ.get('ADMIN_KEY')
            if not admin_key or admin_key != expected_admin_key:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized: Invalid admin key'})
                }
            
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title', '').strip()
            message = body_data.get('message', '').strip()
            ann_type = body_data.get('type', 'info')
            
            if not title or not message:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Title and message are required'})
                }
            
            cursor.execute(
                "INSERT INTO announcements (title, message, type) VALUES (%s, %s, %s) RETURNING id",
                (title, message, ann_type)
            )
            new_id = cursor.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': new_id})
            }
        
        if method == 'DELETE':
            expected_admin_key = os.environ.get('ADMIN_KEY')
            if not admin_key or admin_key != expected_admin_key:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Unauthorized: Invalid admin key'})
                }
            
            query_params = event.get('queryStringParameters', {})
            ann_id = query_params.get('id')
            
            if not ann_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Announcement ID required'})
                }
            
            cursor.execute("UPDATE announcements SET is_active = false WHERE id = %s", (ann_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
