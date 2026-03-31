from flask import Blueprint, request, jsonify
from backend.controllers.auth_controller import signup as signup_ctrl, login as login_ctrl

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    result = login_ctrl(email, password)
    if isinstance(result, tuple):
        body, status = result
        return jsonify(body), status
    return jsonify(result)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    result = signup_ctrl(email, password)
    if isinstance(result, tuple):
        body, status = result
        return jsonify(body), status
    return jsonify(result)
