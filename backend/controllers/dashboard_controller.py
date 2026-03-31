from backend.services.analytics_service import generate_dashboard_stats

def get_dashboard():
    return generate_dashboard_stats()
