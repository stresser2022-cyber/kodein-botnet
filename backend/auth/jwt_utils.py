import os
import jwt
from typing import Dict, Any, Optional

JWT_ALGORITHM = 'HS256'

def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify JWT token and return decoded payload
    Returns None if token is invalid
    """
    jwt_secret = os.environ.get('JWT_SECRET')
    if not jwt_secret:
        return None
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except Exception:
        return None

def extract_user_from_token(event: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Extract user info from JWT token in Authorization header or X-Auth-Token
    Returns dict with user_id and username, or None if invalid
    """
    headers = event.get('headers', {})
    
    # Try Authorization header first
    auth_header = headers.get('authorization') or headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header[7:]  # Remove 'Bearer ' prefix
        payload = verify_jwt_token(token)
        if payload:
            return {
                'user_id': payload.get('user_id'),
                'username': payload.get('username')
            }
    
    # Try X-Auth-Token as fallback
    token = headers.get('x-auth-token') or headers.get('X-Auth-Token')
    if token:
        payload = verify_jwt_token(token)
        if payload:
            return {
                'user_id': payload.get('user_id'),
                'username': payload.get('username')
            }
    
    return None
