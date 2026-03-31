from flask import Blueprint, jsonify
from backend.controllers.dashboard_controller import get_dashboard

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/insights', methods=['GET'])
def insights():
    data = get_dashboard()
    return jsonify(data)
