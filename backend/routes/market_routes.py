from flask import Blueprint, jsonify

market_bp = Blueprint('market', __name__)


@market_bp.route('/summary', methods=['GET'])
def market_summary():
    """Return full market intelligence data derived from the dataset CSVs."""
    try:
        from backend.services.market_intelligence_service import get_market_summary_for_api
        data = get_market_summary_for_api()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
