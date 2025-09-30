from typing import Dict, Any

PLAN_LIMITS: Dict[str, Dict[str, Any]] = {
    'free': {
        'max_concurrents': 1,
        'max_duration': 60,
        'methods': ['dns', 'udp', 'tcp']
    },
    'pro': {
        'max_concurrents': 3,
        'max_duration': 300,
        'methods': ['dns', 'udp', 'tcp', 'pps', 'syn', 'ack', 'flood', 'http']
    },
    'ultimate': {
        'max_concurrents': 10,
        'max_duration': 1800,
        'methods': 'all'
    }
}

def get_plan_limits(plan: str) -> Dict[str, Any]:
    return PLAN_LIMITS.get(plan, PLAN_LIMITS['free'])

def check_plan_validity(plan: str, plan_expires_at: Any) -> str:
    from datetime import datetime
    
    if not plan or plan == 'free':
        return 'free'
    
    if plan_expires_at and isinstance(plan_expires_at, datetime):
        if plan_expires_at < datetime.utcnow():
            return 'free'
    
    return plan
