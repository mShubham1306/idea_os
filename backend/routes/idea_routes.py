from flask import Blueprint, request, jsonify
from backend.controllers.idea_controller import (
    analyze_idea,
    get_history,
    chat_with_copilot,
    record_idea_feedback
)

idea_bp = Blueprint('idea', __name__)


@idea_bp.route('/analyze', methods=['POST'])
def analyze():
    idea_text = None
    category = None
    audio_bytes = None
    audio_filename = None

    if request.content_type and request.content_type.startswith('multipart/form-data'):
        file = request.files.get('audio')
        if file:
            audio_bytes = file.read()
            audio_filename = file.filename
        idea_text = request.form.get('idea') or request.form.get('description')
        category = request.form.get('category')
    else:
        payload = request.get_json() or {}
        idea_text = payload.get('idea') or payload.get('description')
        category = payload.get('category')

    result = analyze_idea(idea_text, category, audio_bytes=audio_bytes, audio_filename=audio_filename)
    return jsonify(result)


@idea_bp.route('/chat', methods=['POST'])
def chat():
    payload = request.get_json() or {}
    result = chat_with_copilot(payload)
    return jsonify(result)


@idea_bp.route('/train-feedback', methods=['POST'])
def train_feedback():
    payload = request.get_json() or {}
    result = record_idea_feedback(payload)
    return jsonify(result)


@idea_bp.route('/history', methods=['GET'])
def history():
    data = get_history()
    return jsonify(data)
