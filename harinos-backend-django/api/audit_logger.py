from .models import AuditLog

def log_security_event(request, action):
    """
    Log sensitive security events to the database audit trail.
    """
    user = 'anonymous'
    if hasattr(request, 'user') and request.user:
        if hasattr(request.user, 'username') and request.user.username:
            user = request.user.username
        elif hasattr(request.user, 'id') and request.user.id:
            user = str(request.user.id)
        elif hasattr(request.user, 'role') and request.user.role:
            user = f"role_{request.user.role}"

    # Extract client IP
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip_address = x_forwarded_for.split(',')[0].strip()
    else:
        ip_address = request.META.get('REMOTE_ADDR', '0.0.0.0')

    # Save to Database
    AuditLog.objects.create(
        user=user,
        action=action,
        ip_address=ip_address
    )
